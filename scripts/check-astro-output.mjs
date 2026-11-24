import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import { readingText } from "./reading-text.mjs";
import { checkChatGPTReviewedCopy } from "./check-chatgpt-reviewed-copy.mjs";

const baseline = JSON.parse(await readFile("tests/fixtures/reading-baseline.json", "utf8"));
const markdownBaseline = JSON.parse(await readFile("tests/fixtures/markdown-migration-baseline.json", "utf8"));
// The marketplace case study replaces the original checkout draft’s copy;
// keep the original migration snapshot frozen for the other guides and anchors.
const marketplaceArticle = JSON.parse(await readFile("tests/fixtures/marketplace-systems-article.json", "utf8"));
// The author-supplied reporting rewrite has its own editorial snapshot. Keep
// #42 and the Markdown-migration fixtures frozen, including their old copy.
const reportingArticle = JSON.parse(await readFile("tests/fixtures/advertising-reporting-article.json", "utf8"));
const platformArticle = JSON.parse(await readFile("tests/fixtures/advertising-platforms-article.json", "utf8"));
const chatgptArticle = JSON.parse(await readFile("tests/fixtures/chatgpt-ads-article.json", "utf8"));
const retirement = JSON.parse(await readFile("tests/fixtures/api-guide-retirement.json", "utf8"));
const replacementArticles = { ...reportingArticle.routes, ...platformArticle.routes, ...chatgptArticle.routes, ...retirement.routes };
function historicalEditorialReferences(value) {
  return value
    .replaceAll("Production case study How ChatGPT Ads Works", "Platform introduction How ChatGPT Ads works")
    .replaceAll("How ChatGPT Ads Works", "How ChatGPT Ads works")
    .replaceAll("How Advertising Platforms Work", "How advertising platforms work")
    .replaceAll("System-design case study · Preview How Advertising Reporting Systems Work", "Worked example · Preview How to collect ChatGPT Ads reports")
    .replaceAll("How Advertising Reporting Systems Work", "How to collect ChatGPT Ads reports")
    .replaceAll("Follow a coffee-grinder campaign from distributed events to reporting rows, late conversions, complete retrieval and evidence an agent can use.", "Request campaign results, check which data you received and show readers what is missing.")
    .replaceAll("Advertising reporting", "Reporting example");
}
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
for (const [path, historical] of Object.entries(baseline.routes)) {
  if (path === retirement.retiredRoute) continue;
  const expected = replacementArticles[path] ?? historical;
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
  // The marketplace case study adds one explicitly checked track entry.
  // Its approved copy has a separate snapshot below.
  if (path === "/learn/system-design") {
    const draft = main.querySelector('a[href="/learn/system-design/when-an-agent-checkout-times-out"]').closest("li");
    assert.equal(readingText(draft), marketplaceArticle.trackEntry, "marketplace case-study track entry");
    draft.remove();
  }
  main.querySelectorAll("script,style,template").forEach((element) => element.remove());
  const actualText = historicalEditorialReferences(readingText(main));
  // The full replacement article is checked against its editorial snapshot
  // below; this pass still checks its infrastructure and historical anchors.
  if (!replacementArticles[path] && actualText !== expected.text) {
    const index = [...actualText].findIndex((character, index) => character !== expected.text[index]);
    assert.fail(`${path}: no-JavaScript reading text differs at ${index}: expected ${JSON.stringify(expected.text.slice(index - 30, index + 100))}; received ${JSON.stringify(actualText.slice(index - 30, index + 100))}`);
  }
  const ids = new Set([...main.querySelectorAll("[id]")].map((element) => element.id));
  // Removing the sole related guide also removes its now-empty wrapper.
  for (const id of historical.ids.filter(id => !retirement.removedAnchors[path]?.includes(id))) assert.ok(ids.has(id), `${path}: missing anchor ${id}`);
  if (!replacementArticles[path]) assert.deepEqual([...main.querySelectorAll("a[href]")].map((element) => element.getAttribute("href")), expected.hrefs, `${path}: reading links`);
}
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
for (const url of baseline.sitemap.filter(url => new URL(url).pathname !== retirement.retiredRoute)) assert.ok(urls.includes(url), `Sitemap omitted ${url}`);
assert.ok(!urls.some(url => new URL(url).pathname === retirement.retiredRoute), "Retired guide must not be indexed");
for (const path of ["/examples", "/learn/system-design/chatgpt-ads-reporting", "/algorithms", "/patterns"])
  assert.ok(!urls.includes(`https://harness.ai-knowledge-hub.org${path}`), `Sitemap indexed ${path}`);
for (const [file, expected] of Object.entries(baseline.downloads)) {
  const hash = createHash("sha256").update(await readFile(`dist/${file}`)).digest("hex");
  assert.equal(hash, expected, `${file}: versioned download changed`);
}
for (const file of [`dist${retirement.retiredRoute}/index.html`, `dist${retirement.retiredRoute}.html`]) {
  await assert.rejects(access(file), { code: "ENOENT" }, `${file}: retired output must be absent`);
}
const redirects = JSON.parse(await readFile("vercel.json", "utf8")).redirects;
for (const source of [retirement.retiredRoute, `${retirement.retiredRoute}/`, `${retirement.retiredRoute}.html`]) {
  const matching = redirects.filter(redirect => redirect.source === source);
  assert.equal(matching.length, 1, `${source}: exactly one retirement redirect`);
  assert.equal(matching[0].destination, retirement.redirectDestination);
  assert.equal(matching[0].permanent, true);
}
const [redirectPath, fragment] = retirement.redirectDestination.split("#");
const redirectDocument = new JSDOM(await readFile(`dist${redirectPath}/index.html`, "utf8")).window.document;
assert.ok(redirectDocument.getElementById(fragment), "Retirement redirect must land on an existing section");
for (const file of (await readdir("dist", { recursive: true })).filter(file => file.endsWith(".html"))) {
  const document = new JSDOM(await readFile(`dist/${file}`, "utf8")).window.document;
  for (const link of document.querySelectorAll("a[href]")) {
    const target = new URL(link.getAttribute("href"), `https://harness.ai-knowledge-hub.org/${file}`);
    if (target.origin !== "https://harness.ai-knowledge-hub.org") continue;
    assert.notEqual(target.pathname.replace(/\.html$|\/$/g, ""), retirement.retiredRoute, `${file}: link to retired guide`);
    assert.notEqual(target.pathname, "/references/chatgpt-ads/v1/capabilities.json", `${file}: archived API map must not rejoin the curriculum`);
  }
}
console.log(`Astro preserves infrastructure and historical anchors across ${Object.keys(baseline.routes).length - 1} retained baseline routes. The retired guide is absent; permanent redirects, all five original download hashes and curriculum links are checked. Sitemap contains ${urls.length} eligible URLs.`);

for (const [path, expected] of Object.entries({ ...markdownBaseline.routes, ...marketplaceArticle.routes, ...replacementArticles })) {
  if (path === retirement.retiredRoute) continue;
  const document = new JSDOM(await readFile(`dist${path}/index.html`, "utf8")).window.document;
  const main = document.querySelector("main");
  assert.equal(document.title, expected.title, `${path}: migrated title`);
  assert.equal(document.querySelector('meta[name="description"]').content, expected.description, `${path}: migrated description`);
  assert.equal(document.querySelector('link[rel="canonical"]').href, expected.canonical, `${path}: migrated canonical`);
  assert.equal(document.querySelector('meta[name="robots"]').content, expected.robots, `${path}: migrated indexing`);
  // A prior editorial snapshot can contain a link title subsequently updated
  // by another article. Compare those bounded reference labels consistently.
  assert.equal(historicalEditorialReferences(readingText(main)), historicalEditorialReferences(expected.text), `${path}: complete approved reading text`);
  assert.deepEqual([...main.querySelectorAll("a[href]")].map((link) => link.getAttribute("href")), expected.hrefs, `${path}: approved reading links`);
  for (const id of expected.ids) assert.ok(document.getElementById(id), `${path}: approved anchor ${id}`);
  for (const id of (markdownBaseline.routes[path] ?? baseline.routes[path]).ids.filter(id => !retirement.removedAnchors[path]?.includes(id))) assert.ok(document.getElementById(id), `${path}: retained migration anchor ${id}`);
  assert.deepEqual([...main.querySelectorAll("pre code")].map((code) => code.textContent.trimEnd()), expected.code, `${path}: approved code`);
  for (const pre of main.querySelectorAll("pre")) {
    assert.equal(pre.tabIndex, 0, `${path}: keyboard-accessible code`);
    assert.ok(pre.getAttribute("aria-label"), `${path}: named code`);
  }
  if (expected.robots.startsWith("noindex")) assert.ok(!urls.includes(expected.canonical), `${path}: draft sitemap exclusion`);
}
console.log("Migrated guides retain their original content; marketplace, reporting, platform and ChatGPT Ads rewrites match their editorial snapshots and retain historical anchors and indexing.");
await checkChatGPTReviewedCopy();
