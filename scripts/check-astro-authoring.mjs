import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, unlink, access } from "node:fs/promises";
import { JSDOM } from "jsdom";
import { codeFenceExamples, ordinaryCodeFences } from "../tests/fixtures/ordinary-code-fences.js";

const source = "src/content/lessons/migration-authoring-check.ts";
const markdownSource = "src/content/lessons/markdown-authoring-check.md";
const mdxSource = "src/content/lessons/markdown-authoring-check.mdx";
for (const file of [source, markdownSource, mdxSource]) {
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
  introduction: "Give **repeated report requests** one stable identity.\n\nContact hello@example.com or visit https://example.com/retries?mode=safe&limit=1 or www.example.com for details.",
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
const heading = "## Keep the reference stable";
const paragraph = "Keep the request identity with its completed result.";
const footnote = "A note adds context.[^source]\n\n[^source]: Footnote text.";
const validLinks = [
  "[This section](#check-section)",
  "[An HTML alias](/learn/software-production/migration-authoring-check.html#identify-the-request)",
  "[An absolute guide URL](https://harness.ai-knowledge-hub.org/learn/measurement-ml/attribution-and-lift#read-the-results)",
  "[A relative download](../../../references/chatgpt-ads/v1/README.md)",
  "[A citation](https://example.com/source)",
].join(" ");
const authoredFiles = new Set();
async function writeAuthored(body = [paragraph, validLinks, footnote].join("\n\n"), file = markdownSource) {
  const frontmatter = Object.entries(markdown).map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  await writeFile(file, ["---", ...frontmatter, "---", "", heading, "", body, ""].join("\n"));
  authoredFiles.add(file);
}
const buildErrorIncludes = (...messages) => (error) => {
  const output = String(error.stdout) + String(error.stderr);
  for (const message of messages) assert.ok(output.includes(message), output);
  return true;
};
function checkOrdinaryCodeFences(document) {
  const blocks = [...document.querySelectorAll("#check-section pre")];
  assert.equal(blocks.length, codeFenceExamples.length);
  for (const [index, pre] of blocks.entries()) {
    assert.equal(pre.parentElement.className, "lesson-code");
    assert.equal(pre.tabIndex, 0);
    assert.equal(pre.getAttribute("role"), "region");
    assert.equal(pre.getAttribute("aria-label"), codeFenceExamples[index].label);
    assert.equal(pre.querySelector("code").textContent, codeFenceExamples[index].code + "\n");
  }
}
function checkIntroduction(document) {
  const introduction = document.querySelector(".lesson-lede");
  assert.equal(introduction.querySelectorAll("p").length, 2);
  assert.equal(introduction.querySelector("strong").textContent, "repeated report requests");
  assert.equal(introduction.querySelectorAll("a").length, 0);
  assert.equal(introduction.querySelectorAll("p")[1].textContent,
    "Contact hello@example.com or visit https://example.com/retries?mode=safe&limit=1 or www.example.com for details.");
}
let created = false;
try {
  await writeGuide(); created = true; build();
  const page = new JSDOM(await html(`${path.slice(1)}/index.html`)).window.document;
  checkIntroduction(page);
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

  await writeAuthored();
  build();
  const markdownPage = new JSDOM(await html(`${markdownPath.slice(1)}/index.html`)).window.document;
  checkIntroduction(markdownPage);
  assert.match(markdownPage.querySelector('a[href="#check-section"]').textContent, /Keep the reference stable/);
  assert.equal(markdownPage.querySelector("#check-section > h2").id, "check-section-title");
  assert.equal(markdownPage.querySelector("#check-section > p").textContent.trim(), paragraph);
  assert.ok(markdownPage.querySelector("[data-footnotes]"));
  for (const contents of markdownPage.querySelectorAll('nav[aria-label="Guide contents"]')) {
    assert.deepEqual([...contents.querySelectorAll("a")].map((link) => link.hash), ["#check-section"]);
  }
  assert.equal(markdownPage.querySelector('link[rel="canonical"]').href, "https://harness.ai-knowledge-hub.org" + markdownPath);
  assert.ok((await html("sitemap.xml")).includes(markdownPath));
  assert.ok(new JSDOM(await html("learn/software-production/index.html")).window.document.querySelector(`a[href="${markdownPath}"]`));

  await writeAuthored(ordinaryCodeFences); build();
  checkOrdinaryCodeFences(new JSDOM(await html(`${markdownPath.slice(1)}/index.html`)).window.document);

  markdown.publicationStatus = "draft";
  await writeAuthored(); build();
  const markdownDraft = new JSDOM(await html(`${markdownPath.slice(1)}/index.html`)).window.document;
  assert.equal(markdownDraft.querySelector('meta[name="robots"]').content, "noindex, follow");
  assert.ok(!(await html("sitemap.xml")).includes(markdownPath));

  markdown.readingMinutes = 0;
  await writeAuthored();
  assert.throws(build, (error) => /readingMinutes/.test(String(error.stdout) + String(error.stderr)));
  markdown.readingMinutes = 3;

  markdown.id = guide.id;
  await writeAuthored();
  assert.throws(build, (error) => /duplicate path/.test(String(error.stdout) + String(error.stderr)));
  markdown.id = "markdown-authoring-check";

  markdown.relatedGuideIds = ["missing-guide"];
  await writeAuthored();
  assert.throws(build, (error) => /unknown lessons reference missing-guide/.test(String(error.stdout) + String(error.stderr)));
  markdown.relatedGuideIds = [];

  markdown.sectionIds.push("missing-section");
  await writeAuthored();
  assert.throws(build, (error) => /expected a heading for every section ID/.test(String(error.stdout) + String(error.stderr)));

  markdown.sectionIds.pop();
  markdown.publicationStatus = "published";

  await writeAuthored(`${paragraph}\n\n### Check section\n\nProse.\n\n### Check section title\n\nMore prose.`);
  assert.throws(build, buildErrorIncludes('duplicate rendered id "check-section"', 'duplicate rendered id "check-section-title"'));

  await writeAuthored([
    "[Missing route](/learn/software-production/missing-route#missing)",
    "[Missing fragment](#missing-fragment)",
    "[Missing cross-guide fragment](/learn/software-production/migration-authoring-check.html#missing-target)",
    "[Insecure citation](http://example.com/source)",
  ].join(" "));
  assert.throws(build, buildErrorIncludes(
    "unbuilt local destination: /learn/software-production/missing-route#missing",
    "missing local fragment: #missing-fragment",
    "missing local fragment: /learn/software-production/migration-authoring-check.html#missing-target",
    "use HTTPS for web references: http://example.com/source",
  ));

  const relativeReference = "../system-design/api-design";
  await writeAuthored(`[Cross-track guide](${relativeReference})`);
  assert.throws(build, buildErrorIncludes(
    `${markdownPath}/index.html#check-section: unbuilt local destination: ${relativeReference}`,
  ));

  await writeAuthored("[API design](/learn/system-design/api-design/)");
  assert.throws(build, buildErrorIncludes(
    "local destination violates trailingSlash=never: /learn/system-design/api-design/",
  ));

  await writeAuthored("[Back to this track](./index.html)");
  assert.throws(build, buildErrorIncludes("link destination changes across served URLs: ./index.html"));

  await writeAuthored("<!-- Editorial TODO -->");
  assert.throws(build, buildErrorIncludes("#check-section: guide section is empty"));

  await unlink(markdownSource);
  authoredFiles.delete(markdownSource);
  await writeAuthored("{/* Editorial TODO */}\n\n{null}", mdxSource);
  assert.throws(build, buildErrorIncludes("#check-section: guide section is empty"));

  await writeAuthored([
    paragraph,
    '<a href={"/learn/absent"}>MDX reference</a>',
    '<a href={"/learn/system-design/api-design/"}>API design</a>',
    '<a href={"ftp://example.com/source"}>Non-HTTPS reference</a>',
    `<a href={"${relativeReference}"}>Relative MDX reference</a>`,
  ].join("\n\n"), mdxSource);
  assert.throws(build, buildErrorIncludes(
    "unbuilt local destination: /learn/absent",
    "local destination violates trailingSlash=never: /learn/system-design/api-design/",
    "use HTTPS for web references: ftp://example.com/source",
    `${markdownPath}/index.html#check-section: unbuilt local destination: ${relativeReference}`,
  ));

  await writeAuthored('<a href={"./index.html"}>Back to this track</a>', mdxSource);
  assert.throws(build, buildErrorIncludes("link destination changes across served URLs: ./index.html"));

  await writeAuthored(`${paragraph}\n\n<a href={"#check-section"}>MDX reference</a>\n\n${footnote}`, mdxSource);
  build();
  const mdxPage = new JSDOM(await html(`${markdownPath.slice(1)}/index.html`)).window.document;
  checkIntroduction(mdxPage);
  assert.equal(mdxPage.querySelector('#check-section a[href="#check-section"]').textContent, "MDX reference");
  assert.ok(mdxPage.querySelector("[data-footnotes]"));
  assert.equal(mdxPage.querySelectorAll('nav[aria-label="Guide contents"] a').length, 2);

  await writeAuthored(ordinaryCodeFences, mdxSource); build();
  checkOrdinaryCodeFences(new JSDOM(await html(`${markdownPath.slice(1)}/index.html`)).window.document);

  console.log("Typed, Markdown and MDX guides passed the authoring checks, including draft eligibility, rendered links and IDs, readable sections and footnotes.");
} finally {
  for (const file of authoredFiles) await unlink(file);
  if (created) await unlink(source);
  if (created || authoredFiles.size) build();
}
