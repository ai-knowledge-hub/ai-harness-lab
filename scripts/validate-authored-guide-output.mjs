import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { JSDOM } from "jsdom";

function hasReadingContent(section) {
  const body = section.cloneNode(true);
  body.querySelectorAll(":scope > h2, script, style, template, [data-footnotes], [data-footnote-ref]")
    .forEach((element) => element.remove());
  return Boolean(body.textContent.trim() || body.querySelector("img[src], svg, video, audio, iframe[src]"));
}

function duplicateIds(document) {
  const seen = new Set();
  const duplicates = new Set();
  for (const { id } of document.querySelectorAll("[id]")) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return duplicates;
}

async function linkError(href, base, origin, files, readPage) {
  let target;
  try {
    target = new URL(href, base);
  } catch {
    return `invalid URL ${JSON.stringify(href)}`;
  }
  if (target.protocol === "mailto:" || target.protocol === "tel:") return;
  if (target.protocol !== "https:") return `use HTTPS for web references: ${href}`;
  if (target.origin !== origin) return;

  let path;
  let fragment;
  try {
    path = decodeURI(target.pathname);
    fragment = decodeURIComponent(target.hash.slice(1).split(":~:")[0]);
  } catch {
    return `invalid URL encoding: ${href}`;
  }

  const index = `${path.replace(/\/$/, "")}/index.html`;
  const file = [path, index, `${path}.html`].find((candidate) => files.has(candidate));
  if (!file) return `unbuilt local destination: ${href}`;
  if (!fragment || fragment.toLowerCase() === "top" || !file.endsWith(".html")) return;

  const document = await readPage(file);
  if (!document.getElementById(fragment) && ![...document.querySelectorAll("a[name]")].some((anchor) => anchor.name === fragment)) {
    return `missing local fragment: ${href}`;
  }
}

// Validate the static output so component-rendered links and IDs are covered
// alongside the Markdown source. Only authored guides opt into these checks.
export async function validateAuthoredGuideOutput(output, origin) {
  const files = new Map();
  for (const entry of await readdir(output, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const file = join(entry.parentPath, entry.name);
    files.set(`/${relative(output, file).split(sep).join("/")}`, file);
  }

  const pages = new Map();
  const readPage = async (file, html, address = file.replace(/\/index\.html$/, "") || "/") => {
    const url = new URL(address, origin).href;
    if (!pages.has(url)) {
      const contents = html ?? await readFile(files.get(file), "utf8");
      pages.set(url, new JSDOM(contents, { url }));
    }
    return pages.get(url).window.document;
  };
  const errors = [];

  try {
    for (const [file, filename] of files) {
      if (!file.endsWith("/index.html")) continue;
      const html = await readFile(filename, "utf8");
      if (!html.includes("data-authored-guide")) continue;
      const document = await readPage(file, html);
      const article = document.querySelector("article[data-authored-guide]");
      if (!article) continue;

      const path = new URL(document.URL).pathname;
      const directory = file.slice(0, -"index.html".length);
      const addresses = new Set([path, file, directory]);
      const flatAlias = `${path}.html`;
      if (files.has(flatAlias)) addresses.add(flatAlias);

      // Parse at each address so the document's base reflects how it was opened.
      const bases = await Promise.all([...addresses].map(async (address) => ({
        address,
        base: (await readPage(file, html, address)).baseURI,
      })));
      for (const id of duplicateIds(document)) {
        errors.push(`${path}: duplicate rendered id ${JSON.stringify(id)}`);
      }
      for (const section of article.querySelectorAll(":scope > section.lesson-section")) {
        if (!hasReadingContent(section)) errors.push(`${path}#${section.id}: guide section is empty`);
        for (const link of section.querySelectorAll("a[href]")) {
          const href = link.getAttribute("href");
          const reported = new Set();
          for (const { address, base } of bases) {
            const error = await linkError(href, base, origin, files, readPage);
            if (error && !reported.has(error)) {
              errors.push(`${address}#${section.id}: ${error}`);
              reported.add(error);
            }
          }
        }
      }
    }
  } finally {
    for (const { window } of pages.values()) window.close();
  }

  if (errors.length) throw new Error(`Invalid authored guide output:\n${errors.join("\n")}`);
}
