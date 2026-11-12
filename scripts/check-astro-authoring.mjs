import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, unlink, access } from "node:fs/promises";
import { JSDOM } from "jsdom";

const source = "src/content/lessons/migration-authoring-check.ts";
try { await access(source); throw new Error(`Refusing to overwrite ${source}`); }
catch (error) { if (error.code !== "ENOENT") throw error; }
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
let created = false;
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
  console.log("One authored record created its route, anchor, metadata, primary-track discovery and sitemap entry; repeated diagram blocks, draft eligibility, reserved index routes and invalid references were enforced.");
} finally {
  if (created) { await unlink(source); build(); }
}
