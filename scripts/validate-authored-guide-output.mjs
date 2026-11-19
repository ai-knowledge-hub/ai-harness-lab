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

async function linkError(link, origin, files, readPage) {
  const href = link.getAttribute("href");
  let target;
  try {
    target = new URL(href, link.baseURI);
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
  const readPage = async (file, html) => {
    if (!pages.has(file)) {
      const route = file.replace(/\/index\.html$/, "") || "/";
      const dom = new JSDOM(html ?? await readFile(files.get(file), "utf8"), { url: new URL(route, origin).href });
      pages.set(file, dom);
    }
    return pages.get(file).window.document;
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
      for (const id of duplicateIds(document)) {
        errors.push(`${path}: duplicate rendered id ${JSON.stringify(id)}`);
      }
      for (const section of article.querySelectorAll(":scope > section.lesson-section")) {
        if (!hasReadingContent(section)) errors.push(`${path}#${section.id}: guide section is empty`);
        for (const link of section.querySelectorAll("a[href]")) {
          const error = await linkError(link, origin, files, readPage);
          if (error) errors.push(`${path}#${section.id}: ${error}`);
        }
      }
    }
  } finally {
    for (const { window } of pages.values()) window.close();
  }

  if (errors.length) throw new Error(`Invalid authored guide output:\n${errors.join("\n")}`);
}
