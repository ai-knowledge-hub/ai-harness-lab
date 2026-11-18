import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, unlink, access } from "node:fs/promises";
import { JSDOM } from "jsdom";

const source = "src/content/lessons/migration-authoring-check.ts";
const markdownSource = "src/content/lessons/markdown-authoring-check.md";
for (const file of [source, markdownSource]) {
  try { await access(file); throw new Error(`Refusing to overwrite ${file}`); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
}
const path = "/learn/software-production/migration-authoring-check";
const guide = {
  id: "migration-authoring-check", trackId: "software-production", path,
  title: "Make report requests safe to retry", shortTitle: "Safe report retries",
  description: "Identify a reporting request so a retry can reuse its completed result.",
  kind: "principle", publicationStatus: "published", format: "Reusable guide",
  readingMinutes: 3, updatedAt: "2026-11-11",
  introduction: "Give repeated report requests one stable identity.",
  objectives: ["Recognise a repeated request."], prerequisiteConceptIds: [], conceptIds: [],
  projectIds: [], platformIds: [], publicationIds: [], capabilityIds: [], videoIds: [], relatedGuideIds: [],
  sections: [{ id: "identify-the-request", title: "Identify the request", blocks: [{ type: "paragraph", text: "Keep the request identity with its completed result." }] }],
};
const writeGuide = () => writeFile(source, `import type { Guide } from "../guide-types";\nexport default ${JSON.stringify(guide, null, 2)} satisfies Guide;\n`);
const build = () => execFileSync("pnpm", ["build"], { encoding: "utf8", stdio: "pipe" });
const html = (file) => readFile(`dist/${file}`, "utf8");
const { sections, path: _, ...metadata } = guide;
const markdown = { ...metadata, id: "markdown-authoring-check", sectionIds: ["check-section"] };
const markdownPath = `/learn/${markdown.trackId}/${markdown.id}`;
const writeMarkdown = () => writeFile(markdownSource, [
  "---",
  ...Object.entries(markdown).map(([key, value]) => `${key}: ${JSON.stringify(value)}`),
  "---",
  "",
  "## Keep the reference stable",
  "",
  "Keep the request identity with its completed result.",
  "",
].join("\n"));
let created = false;
let createdMarkdown = false;
try {
  await writeGuide(); created = true; build();
  const page = new JSDOM(await html(`${path.slice(1)}/index.html`)).window.document;
  assert.equal(page.querySelector("h1").textContent, guide.title);
  assert.ok(page.getElementById("identify-the-request"));
  assert.equal(page.querySelector('link[rel="canonical"]').href, "https://harness.ai-knowledge-hub.org" + path);
  assert.equal(page.querySelector('meta[name="robots"]').content, "index, follow");
  const track = new JSDOM(await html("learn/software-production/index.html")).window.document;
  assert.equal(track.querySelector(`a[href="${path}"]`).textContent, "Read Safe report retries");
  assert.ok((await html("sitemap.xml")).includes(`<loc>https://harness.ai-knowledge-hub.org${path}</loc>`));

  guide.sections.push({ id: "diagram-instances", title: "Independent diagrams", blocks: [{ type: "ads-architecture" }, { type: "ads-architecture" }] });
  await writeGuide(); build();
  const diagrams = new JSDOM(await html(`${path.slice(1)}/index.html`)).window.document;
  const instances = [...diagrams.querySelectorAll("[data-ads-walkthrough]")];
  assert.equal(instances.length, 2);
  assert.equal(new Set(instances.map((element) => element.querySelector(".ads-map").id)).size, 2);
  for (const element of instances) {
    assert.ok(element.querySelector("template[data-controls]").content.querySelector("[data-next]"));
    assert.ok(element.querySelector("template[data-delivery-controls]"));
  }
  guide.sections.pop();

  guide.publicationStatus = "draft"; await writeGuide(); build();
  const draft = new JSDOM(await html(`${path.slice(1)}/index.html`)).window.document;
  assert.equal(draft.querySelector('meta[name="robots"]').content, "noindex, follow");
  assert.ok(!(await html("sitemap.xml")).includes(`<loc>https://harness.ai-knowledge-hub.org${path}</loc>`));
  const draftTrack = new JSDOM(await html("learn/software-production/index.html")).window.document;
  assert.match(draftTrack.querySelector(`a[href="${path}"]`).closest("li").textContent, /Preview/);

  guide.id = "index";
  guide.path = "/learn/software-production/index";
  guide.publicationStatus = "published";
  await writeGuide();
  assert.throws(build, (error) => /guide ID index is reserved/.test(String(error.stdout) + String(error.stderr)));
  guide.id = "migration-authoring-check";
  guide.path = path;

  guide.prerequisiteConceptIds = ["missing-migration-concept"]; await writeGuide();
  assert.throws(build, (error) => /unknown concepts reference missing-migration-concept/.test(String(error.stdout) + String(error.stderr)));
  guide.prerequisiteConceptIds = [];
  await writeGuide();

  await writeMarkdown();
  createdMarkdown = true;
  build();
  const markdownPage = new JSDOM(await html(`${markdownPath.slice(1)}/index.html`)).window.document;
  assert.match(markdownPage.querySelector('a[href="#check-section"]').textContent, /Keep the reference stable/);
  assert.equal(markdownPage.querySelector("#check-section > h2").id, "check-section-title");
  assert.equal(markdownPage.querySelector("#check-section > p").textContent.trim(), "Keep the request identity with its completed result.");
  assert.equal(markdownPage.querySelector('link[rel="canonical"]').href, "https://harness.ai-knowledge-hub.org" + markdownPath);
  assert.ok((await html("sitemap.xml")).includes(markdownPath));
  assert.ok(new JSDOM(await html("learn/software-production/index.html")).window.document.querySelector(`a[href="${markdownPath}"]`));

  markdown.publicationStatus = "draft";
  await writeMarkdown(); build();
  const markdownDraft = new JSDOM(await html(`${markdownPath.slice(1)}/index.html`)).window.document;
  assert.equal(markdownDraft.querySelector('meta[name="robots"]').content, "noindex, follow");
  assert.ok(!(await html("sitemap.xml")).includes(markdownPath));

  markdown.readingMinutes = 0;
  await writeMarkdown();
  assert.throws(build, (error) => /readingMinutes/.test(String(error.stdout) + String(error.stderr)));
  markdown.readingMinutes = 3;

  markdown.id = guide.id;
  await writeMarkdown();
  assert.throws(build, (error) => /duplicate path/.test(String(error.stdout) + String(error.stderr)));
  markdown.id = "markdown-authoring-check";

  markdown.relatedGuideIds = ["missing-guide"];
  await writeMarkdown();
  assert.throws(build, (error) => /unknown lessons reference missing-guide/.test(String(error.stdout) + String(error.stderr)));
  markdown.relatedGuideIds = [];

  markdown.sectionIds.push("missing-section");
  await writeMarkdown();
  assert.throws(build, (error) => /expected a heading for every section ID/.test(String(error.stdout) + String(error.stderr)));

  console.log("Typed and Markdown guides created their routes, anchors, metadata, track entries and sitemap entries. Drafts, invalid metadata, mixed-format collisions and invalid references were checked.");
} finally {
  if (createdMarkdown) await unlink(markdownSource);
  if (created) await unlink(source);
  if (created || createdMarkdown) build();
}
