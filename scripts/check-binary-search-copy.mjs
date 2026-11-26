import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import { JSDOM } from "jsdom";
import { readingText } from "./reading-text.mjs";

// The fixture is the supplied Part I, not text generated from the candidate.
// Ignore export whitespace in code, equivalent equation notation, and the
// explicitly specified figures/solution/optional mathematical note only.
export async function checkBinarySearchCopy() {
  let source = await readFile("tests/fixtures/binary-search-reviewed-v2.txt", "utf8");
  const editorial = JSON.parse(await readFile("tests/fixtures/binary-search-editorial-edits.json", "utf8"));
  for (const { before, after, reason } of editorial.revisions) {
    assert.equal(source.split(before).length, 2, `Editorial source passage must occur exactly once: ${reason}`);
    source = source.replace(before, after);
  }
  source = source.replaceAll(" — ", ": ");
  // Preserve the original review and apply the authorized observation move
  // before the newcomer revision, which now explains this assumption too.
  const observation = "We know the expenditure cannot decrease in this hypothetical dataset, but we have inspected only one record.";
  const inspection = "Instead, suppose we inspect Day 5 and discover that cumulative spending is £650.";
  assert.equal(source.split(observation).length, 2);
  assert.equal(source.split(inspection).length, 2);
  source = source.replace(observation, "").replace(inspection, `${inspection}\n\n${observation}`);
  const kinds = ["predicate", "invariant", "width", "evaluations"];
  source = source.replace(/^\\\\\[.*?\\\\\]$/gm, () => `BINARY-EQUATION-${kinds.shift()}`)
    .replaceAll("\\\\(", "`").replaceAll("\\\\)", "`").replaceAll("O(\\log n)", "O(log n)");
  assert.equal(kinds.length, 0, "All four reviewed equations must be represented");
  const novice = JSON.parse(await readFile("tests/fixtures/binary-search-novice-edits.json", "utf8"));
  for (const { before, after, reason } of novice.revisions.filter(revision => revision.scope !== "supplement")) {
    // Paragraph consolidation changed whitespace, not words. Match either
    // grouping while still requiring the complete authorized passage once.
    const expression = before.split(/\s+/).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+");
    const pattern = new RegExp(expression, "g");
    assert.equal([...source.matchAll(pattern)].length, 1, `Newcomer review passage must occur exactly once: ${reason}`);
    source = source.replace(pattern, () => after);
  }
  const supplements = novice.revisions.filter(revision => revision.scope === "supplement").map(revision => ({ ...revision }));
  const followup = JSON.parse(await readFile("tests/fixtures/binary-search-followup-edits.json", "utf8"));
  for (const { before, after, reason, scope } of followup.revisions) {
    if (scope === "supplement") {
      const matches = supplements.filter(revision => revision.after.includes(before));
      assert.equal(matches.length, 1, `Follow-up supplement passage must occur exactly once: ${reason}`);
      assert.equal(matches[0].after.split(before).length, 2);
      matches[0].after = matches[0].after.replace(before, () => after);
    } else {
      const expression = before.split(/\s+/).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+");
      const pattern = new RegExp(expression, "g");
      assert.equal([...source.matchAll(pattern)].length, 1, `Follow-up source passage must occur exactly once: ${reason}`);
      source = source.replace(pattern, () => after);
    }
  }
  const processor = await createSatteriMarkdownProcessor({ syntaxHighlight: false, smartypants: false });
  const expected = new JSDOM((await processor.render(source)).code).window.document;
  const built = new JSDOM(await readFile("dist/learn/algorithms/visualizers/index.html", "utf8")).window.document;
  for (const { after, reason } of supplements) {
    const supplement = new JSDOM((await processor.render(after)).code).window.document;
    assert.ok(readingText(built.querySelector(".binary-context-copy")).includes(readingText(supplement.body)), `Constructive solution or optional proof retains the reviewed explanation: ${reason}`);
  }
  assert.ok(!readingText(built.querySelector("#visualizer")).includes("—"), "Binary Search reader-facing copy contains no em dashes");
  const context = built.querySelector(".binary-context-copy").cloneNode(true);
  context.querySelectorAll("[data-binary-asset], .binary-mathematical-note").forEach(node => node.remove());
  const solution = context.querySelector(".binary-solution");
  assert.ok(solution?.textContent.includes("[80, 120, 250, 250, 250, 300, 300]"), "Constructive solution is included");
  const solutionLabel = built.createElement("p");
  solutionLabel.textContent = "Reveal suggested solution";
  solution.replaceWith(solutionLabel);
  for (const equation of context.querySelectorAll("[data-binary-equation]")) equation.textContent = `BINARY-EQUATION-${equation.dataset.binaryEquation}`;
  const expectedCode = [...expected.querySelectorAll("pre")].map(node => node.textContent.replace(/\s+/g, ""));
  const actualCode = [...context.querySelectorAll("pre")].map(node => node.textContent.replace(/\s+/g, ""));
  assert.deepEqual(actualCode, expectedCode, "All four approved code examples survive export formatting repair");
  const pilot = JSON.parse(await readFile("tests/fixtures/binary-search-pilot.json", "utf8"));
  assert.deepEqual(context.querySelector("pre code").textContent.trimEnd().split("\n"), pilot.code, "Restored Python indentation remains executable");
  assert.deepEqual([...built.querySelectorAll(".code-line")].map(node => node.textContent.replace(/^ *\d+ {3}/, "")), pilot.code, "Run preserves the same executable Python indentation");
  const workbenchCode = [...built.querySelectorAll(".code-line")].map(node => node.textContent.replace(/^\s*\d+\s+/, "")).join("");
  assert.equal(workbenchCode.replace(/\s+/g, ""), expectedCode[0], "Run and Context display the same approved search");
  for (const document of [expected.body, context]) {
    [...document.querySelectorAll("pre")].forEach((node, index) => { node.textContent = `BINARY-CODE-${index}`; });
  }
  const actualText = readingText(context), expectedText = readingText(expected.body);
  const index = [...actualText].findIndex((char, i) => char !== expectedText[i]);
  assert.equal(actualText, expectedText, `Binary Search reviewed copy differs at ${index}`);
  const urls = root => [...root.querySelectorAll('a[href^="https:"]')].map(link => {
    const url = new URL(link.href); url.searchParams.delete("utm_source"); return url.href;
  });
  assert.deepEqual(urls(context), urls(expected.body), "Approved primary-source destinations are retained");
  assert.equal(built.querySelectorAll("[data-binary-asset]").length, 6);
  assert.equal(built.querySelectorAll(".binary-context-copy h4").length, 6);
  assert.equal(built.querySelectorAll(".binary-context-copy h1, .binary-context-copy h2").length, 0);
  const reportingLinks = built.querySelectorAll('.binary-context-copy a[href="/learn/system-design/chatgpt-ads-reporting#why-yesterday-changes"]');
  assert.equal(reportingLinks.length, 1, "One contextual reporting connection replaces the old ending block");
  const connection = reportingLinks[0].closest("p");
  assert.ok(connection.previousElementSibling.textContent.includes("concurrent revisions"), "Reporting link immediately follows the data-stability caveat");
  const next = connection.nextElementSibling;
  assert.ok(next.matches('a[data-binary-scenario="counterexample"]') || next.querySelector('a[data-binary-scenario="counterexample"]'));
  assert.equal(built.querySelectorAll(".binary-related").length, 0);
  const invariantFigure = built.querySelector('[data-binary-asset="invariant"]');
  assert.equal(invariantFigure.querySelectorAll(".binary-state p").length, 1, "Static status identifies preservation without repeating the numerical snapshot");
  assert.ok(invariantFigure.querySelector("figcaption").textContent.includes("With one record left to inspect, two answers remain possible"));
  const report = new JSDOM(await readFile("dist/learn/system-design/chatgpt-ads-reporting/index.html", "utf8")).window.document;
  assert.ok(report.getElementById("why-yesterday-changes"));
  for (const pre of built.querySelectorAll(".binary-context-copy pre")) {
    assert.equal(pre.tabIndex, 0, "Context code remains keyboard-scrollable");
    assert.ok(pre.getAttribute("aria-label"), "Context code has a name");
  }
  console.log("Binary Search preserves reviewed Context v2.0 with the authorized editorial revisions and punctuation changes, all four code examples and primary sources; six static figures, constructive solution, optional proof and reporting fragment are checked.");
}

if (process.argv[1]?.endsWith("check-binary-search-copy.mjs")) await checkBinarySearchCopy();
