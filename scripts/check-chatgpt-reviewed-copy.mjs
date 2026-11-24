import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import { JSDOM } from "jsdom";
import { readingText } from "./reading-text.mjs";

// Compare rendered editorial text with the independent author-supplied source,
// excluding only implementation figures, the retained opening heading and
// the equivalent MathML syntax. Apply only the three editorial trims approved
// by the user on 24 November 2026; preserve the independent source fixture.
export async function checkChatGPTReviewedCopy() {
  let reviewed = await readFile("tests/fixtures/chatgpt-ads-reviewed-v3.1.md", "utf8");
  const approvedCuts = [
    "For ChatGPT Ads, the published design separates the answer-generation path from the advertising-serving path.",
    "A timeout concerns the server-side deadline. A contextual rejection concerns suitability. A late arrival concerns the frontend's display window.",
    "These are commercial reporting metrics, not a complete record of the orchestrator's internal decisions.",
  ];
  for (const cut of approvedCuts) {
    assert.equal(reviewed.split(cut).length - 1, 1, `Approved editorial cut must occur exactly once in source: ${cut}`);
    reviewed = reviewed.replace(cut, "");
  }
  reviewed = reviewed.replace(/<!--[\s\S]*?-->/g, "")
    .replace("$$CTR=\\frac{250}{10,000}=2.5\\%$$", "CG-EQUATION-CTR")
    .replace("$$\\frac{£300}{250}=£1.20$$", "CG-EQUATION-AVERAGE");
  const processor = await createSatteriMarkdownProcessor({ syntaxHighlight: false, smartypants: false });
  const { code } = await processor.render(reviewed);
  const expected = new JSDOM(code, { url: "https://harness.ai-knowledge-hub.org" }).window.document;
  const built = new JSDOM(await readFile("dist/learn/system-design/chatgpt-ads/index.html", "utf8"), { url: "https://harness.ai-knowledge-hub.org" }).window.document;
  const reading = built.createElement("div");
  reading.append(built.querySelector(".lesson-header h1").cloneNode(true), built.querySelector(".lesson-lede").cloneNode(true));
  for (const section of built.querySelectorAll(".lesson-article > .lesson-section")) reading.append(section.cloneNode(true));
  reading.querySelectorAll("[data-chatgpt-visual], script, style, template, .cg-legacy-anchor, .table-scroll-hint").forEach(element => element.remove());
  reading.querySelector("#the-ad-experience-title").remove();
  for (const equation of reading.querySelectorAll("[data-cg-equation]")) {
    const text = built.createElement("p");
    text.textContent = equation.dataset.cgEquation === "ctr" ? "CG-EQUATION-CTR" : "CG-EQUATION-AVERAGE";
    equation.replaceWith(text);
  }
  const actualText = readingText(reading), expectedText = readingText(expected.body);
  const mismatch = [...actualText].findIndex((character, index) => character !== expectedText[index]);
  assert.ok(actualText === expectedText, `Reviewed-copy mismatch at ${mismatch}: actual ${JSON.stringify(actualText.slice(mismatch - 60, mismatch + 120))}; expected ${JSON.stringify(expectedText.slice(mismatch - 60, mismatch + 120))}`);
  const hrefs = new Set([...reading.querySelectorAll("a")].map(link => link.href));
  for (const link of expected.querySelectorAll("a")) assert.ok(hrefs.has(link.href), `Missing reviewed source/resource link: ${link.href}`);
  assert.ok(hrefs.has("https://harness.ai-knowledge-hub.org/learn/system-design/chatgpt-ads-apis"));
  assert.equal(built.querySelectorAll("[data-chatgpt-visual]").length, 5);
  assert.equal(built.querySelectorAll("[data-cg-equation] math").length, 2);
  assert.equal(built.querySelector('[data-cg-equation="ctr"] math').textContent, "CTR=25010,000=2.5%");
  assert.equal(built.querySelector('[data-cg-equation="spend-per-click"] math').textContent, "£300250=£1.20");
  assert.equal(built.querySelectorAll(".lesson-section h2").length, 11);
  assert.equal(250 / 10_000 * 100, 2.5);
  assert.equal(300 / 250, 1.2);
  console.log("ChatGPT Ads rendered prose matches reviewed v3.1 with three approved editorial trims; all reviewed links, five figures and both equations are retained.");
}

if (process.argv[1]?.endsWith("check-chatgpt-reviewed-copy.mjs")) await checkChatGPTReviewedCopy();
