import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import { readingText } from "./reading-text.mjs";

const baseline = JSON.parse(await readFile("tests/fixtures/reading-baseline.json", "utf8"));
// Reviewed #60 copy changes are asserted before restoring their historical
// wording for #42 parity. This is a bounded list, not a skipped content region.
const companionCopy = [
  ['#related-reading > .eyebrow', "Optional companions", "The wider context"],
  ['#related-reading-title', "Related reading and resources", "Related reading"],
  ['#related-reading .resource-kind', "Resource · Skills", "Related guide · Skills"],
  ['.guide-case-study > .eyebrow', "Optional case study · Publication", "Supporting case study · Publication"],
  ['#references a[href="https://skills.ai-knowledge-hub.org/plugins/engineering/code-maintenance-plugin"]', "Inspect the coding workflow package in Skills", "Run the coding workflow example in Skills"],
  ['#references a[href="https://skills.ai-knowledge-hub.org/plugins/agentops/harness-governance-plugin"]', "Inspect the harness review package in Skills", "Run the harness review example in Skills"],
];
for (const [path, expected] of Object.entries(baseline.routes)) {
  const file = path === "/" ? "dist/index.html" : `dist${path}/index.html`;
  const html = await readFile(file, "utf8");
  if (path !== "/") assert.equal(await readFile(`dist${path}.html`, "utf8"), html, `${path}: flat HTML alias`);
  const document = new JSDOM(html).window.document;
  assert.equal(document.title, expected.title, `${path}: title`);
  for (const [selector, attribute, value] of [
    ['meta[name="description"]', "content", expected.description],
    ['meta[name="robots"]', "content", expected.robots],
    ['link[rel="canonical"]', "href", expected.canonical],
    ...Object.entries(expected.og).map(([property, content]) => [`meta[property="${property}"]`, "content", content]),
  ]) assert.equal(document.querySelector(selector)?.getAttribute(attribute), value, `${path}: ${selector}`);
  assert.equal(document.querySelectorAll("header.site-header").length, 1, `${path}: shared header`);
  assert.equal(document.querySelectorAll("footer.site-footer").length, 1, `${path}: shared footer`);
  assert.equal(document.querySelectorAll("main").length, 1, `${path}: one main landmark`);
  assert.equal(document.querySelectorAll('script[src^="/assets/"]').length, 0, `${path}: no Vite app entry`);
  assert.equal(document.querySelectorAll("astro-island").length, path === "/learn/algorithms/visualizers" ? 1 : 0, `${path}: hydration boundary`);
  const main = document.querySelector("main");
  for (const [selector, current, historical] of companionCopy) {
    for (const element of main.querySelectorAll(selector)) {
      assert.equal(readingText(element), current, `${path}: approved companion copy ${selector}`);
      element.textContent = historical;
    }
  }
  // #59 deliberately adds requirements context. Keep the independent #42
  // fixture frozen and compare its retained body; discovery browser assertions
  // separately check the new notes, descriptions and reading-alternative link.
  const requirementKind = !path.startsWith("/learn/") || path === "/learn/ai-engineering/control-plane"
    ? null : path === "/learn/algorithms/visualizers" ? "lab" : path.split("/").length === 3 ? "start" : "guide";
  const requirements = main.querySelectorAll("[data-task-requirements]");
  assert.equal(requirements.length, requirementKind ? 1 : 0, `${path}: requirements context count`);
  for (const element of requirements) {
    const selector = {
      start: '#start-here > p#start-requirements[data-task-requirements="start"]',
      guide: '.lesson-orientation p[data-task-requirements="guide"]',
      lab: '.algorithm-hero .intro-copy > div#lab-requirements[data-task-requirements="lab"]',
    }[requirementKind];
    assert.ok(element.matches(selector), `${path}: requirements context location`);
    assert.ok(element.textContent.trim(), `${path}: requirements context must have text`);
    element.remove();
  }
  main.querySelectorAll("script,style,template").forEach((element) => element.remove());
  const actualText = readingText(main);
  if (actualText !== expected.text) {
    const index = [...actualText].findIndex((character, index) => character !== expected.text[index]);
    assert.fail(`${path}: no-JavaScript reading text differs at ${index}: expected ${JSON.stringify(expected.text.slice(index - 30, index + 100))}; received ${JSON.stringify(actualText.slice(index - 30, index + 100))}`);
  }
  const ids = new Set([...main.querySelectorAll("[id]")].map((element) => element.id));
  for (const id of expected.ids) assert.ok(ids.has(id), `${path}: missing anchor ${id}`);
  assert.deepEqual([...main.querySelectorAll("a[href]")].map((element) => element.getAttribute("href")), expected.hrefs, `${path}: reading links`);
}
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
for (const url of baseline.sitemap) assert.ok(urls.includes(url), `Sitemap omitted ${url}`);
for (const path of ["/examples", "/learn/system-design/chatgpt-ads-reporting", "/algorithms", "/patterns"])
  assert.ok(!urls.includes(`https://harness.ai-knowledge-hub.org${path}`), `Sitemap indexed ${path}`);
for (const [file, expected] of Object.entries(baseline.downloads)) {
  const hash = createHash("sha256").update(await readFile(`dist/${file}`)).digest("hex");
  assert.equal(hash, expected, `${file}: versioned download changed`);
}
console.log(`Astro preserves ${Object.keys(baseline.routes).length} independent baseline routes, their retained reading text, anchors, links and metadata, plus all five download hashes. New requirements context is scoped separately. Sitemap contains ${urls.length} eligible URLs.`);
