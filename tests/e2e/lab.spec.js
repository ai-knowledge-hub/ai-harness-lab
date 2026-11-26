import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { visualState } from "../support/visual-state";

// Independent #42 inventory, not calculated from the candidate registry.
const { labs } = JSON.parse(readFileSync(new URL("../fixtures/labs.json", import.meta.url)));
const { states } = JSON.parse(readFileSync(new URL("../fixtures/lab-visual-states.json", import.meta.url)));
const binaryPilot = JSON.parse(readFileSync(new URL("../fixtures/binary-search-pilot.json", import.meta.url)));
const labPath = "/learn/algorithms/visualizers";
async function ready(page, title = "Binary Search") {
  await expect(page.locator("#visualizer h2")).toHaveText(title);
  const island = page.locator("astro-island");
  if (await island.count()) await expect(island).not.toHaveAttribute("ssr");
}

test("all 15 visualizers render every baseline step in both themes", async ({ page }) => {
  test.setTimeout(90_000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && /hydrat|minified React error/i.test(message.text())) errors.push(message.text());
  });
  await page.goto(labPath + "?algorithm=binary#visualizer");
  await ready(page);
  await expect(page.locator("#visualizer")).not.toHaveAttribute("aria-live");
  const status = page.locator("#visualizer").getByRole("status");
  await expect(status).toHaveAttribute("aria-atomic", "true");
  await expect(status).toHaveAttribute("aria-live", "polite");
  await expect(page.locator('#visualizer [aria-live="polite"]')).toHaveCount(1);
  await expect(page.locator(".algorithm-list button")).toHaveCount(15);
  const meter = page.locator(".step-meter span");
  for (const theme of ["dark", "light"]) {
    if (theme === "light") await page.getByRole("button", { name: "Switch to light mode" }).click();
    for (const [id, title, , baselineCount] of labs) {
      const count = id === "binary" ? binaryPilot.steps.length : baselineCount;
      await page.locator(".algorithm-list").getByText(title, { exact: true }).click();
      await ready(page, title);
      await page.getByRole("button", { name: "Run", exact: true }).click();
      // Keep two-dimensional diagrams readable inside their local scroller.
      // A document-width assertion alone passes when SVG labels shrink to 6px.
      const scales = await page.locator(".visualization svg text").evaluateAll(elements =>
        elements.filter(element => element.textContent.trim()).map(element => element.getScreenCTM().a));
      for (const scale of scales) expect(scale, `${id}: authored SVG label scale`).toBeGreaterThanOrEqual(1);
      await expect(page).toHaveURL(new RegExp(`algorithm=${id}(?:&|#|$)`));
      await expect(meter.last()).toHaveText(String(count));
      if (id !== "binary") expect(states[id]).toHaveLength(count);
      for (let step = 1; step <= count; step++) {
        const [label, expectedState] = id === "binary" ? [binaryPilot.steps[step - 1].label, null] : states[id][step - 1];
        await expect(meter.first()).toHaveText(String(step));
        await expect(status).toHaveAccessibleName(`${title}: step ${step} of ${count}, ${label}`);
        // Only the existing concise explanation is live, not SVG or code edits.
        expect(await status.locator("svg, pre, button").count()).toBe(0);
        if (id === "binary") {
          const expected = binaryPilot.steps[step - 1];
          const activeLines = [3, 6, 7, 6, 9, 6, 7, 10];
          await expect(page.locator(".code-line.active")).toHaveText(new RegExp(`^\\s*${activeLines[step - 1]}\\s`));
          await expect(page.locator(".binary-code-values")).toContainText(`lo = ${expected.lo}; hi = ${expected.hi}`);
          await expect(page.locator('.visualization .binary-state')).toContainText(`Search evaluations completed: ${expected.evaluations}`);
          await expect(page.locator('.visualization .binary-state')).toContainText(`Remaining elements: [${expected.lo}, ${expected.hi})`);
          const possible = await page.locator('.visualization [data-boundary][data-possible="true"]').evaluateAll(nodes => nodes.map(node => Number(node.dataset.boundary)));
          expect(possible).toEqual(Array.from({ length: expected.hi - expected.lo + 1 }, (_, i) => i + expected.lo));
          for (let index = 0; index < binaryPilot.values.length; index++) {
            await expect(page.locator(`.visualization [data-record="${index}"] > text`).first()).toHaveText(expected.observed.includes(index) ? String(binaryPilot.values[index]) : "?");
          }
        } else {
          const rendered = await page.locator(".visualization").evaluate(visualState);
          const actualState = createHash("sha256").update(rendered).digest("hex");
          expect.soft(actualState, `${id} step ${step}: ${label} diagram state`).toBe(expectedState);
        }
        await expect(page.locator(".visual-panel .panel-title strong")).toHaveText(label);
        await expect(page.locator(".code-line.active")).toHaveCount(1);
        if (step < count) await page.getByRole("button", { name: "Next", exact: true }).click();
      }
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expect(meter.first()).toHaveText(String(count));
      await page.getByRole("button", { name: "Back", exact: true }).click();
      await expect(meter.first()).toHaveText(String(count - 1));
      await page.getByRole("button", { name: "Context", exact: true }).click();
      if (id === "binary") await expect(page.getByRole("heading", { name: "Binary Search: How Much Can One Comparison Tell Us?", exact: true })).toBeVisible();
      else await expect(page.getByText("Why it exists", { exact: true })).toBeVisible();
      await page.getByRole("button", { name: "Run", exact: true }).click();
      await page.getByRole("button", { name: "Reset", exact: true }).click();
      await expect(meter.first()).toHaveText("1");
      await page.getByRole("button", { name: "Back", exact: true }).click();
      await expect(meter.first()).toHaveText("1");
    }
  }
  const speed = page.getByLabel("Speed", { exact: true });
  await speed.press("Home"); await expect(speed).toHaveValue("500");
  await expect(speed).toHaveAttribute("aria-valuetext", "500 milliseconds between steps");
  await speed.press("End"); await expect(speed).toHaveValue("1800");
  await expect(speed).toHaveAttribute("aria-valuetext", "1800 milliseconds between steps");
  await speed.press("Home");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(status).toHaveAttribute("aria-live", "off");
  await expect(meter.first()).toHaveText("2");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(status).toHaveAttribute("aria-live", "polite");
  await expect(status).toContainText("Paused.");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(meter.first()).toHaveText(String(labs.at(-1)[3]));
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
  await expect(status).toContainText("Playback complete.");
  expect(errors).toEqual([]);
});

test("all 15 direct query links survive refresh and reveal the working area", async ({ page }) => {
  for (const [id, title] of labs) {
    await page.goto(`${labPath}?source=lab-audit&algorithm=${id}#visualizer`);
    await ready(page, title);
    await expect(page.locator("#visualizer h2")).toBeInViewport();
    await page.reload();
    await ready(page, title);
    await expect(page.locator("#visualizer h2")).toBeInViewport();
    expect(new URL(page.url()).searchParams.get("source")).toBe("lab-audit");
  }
});

test("Binary Search tests assumptions, threshold changes, prediction and scaling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(labPath + "?source=binary-pilot&algorithm=binary#visualizer");
  await ready(page);
  await expect(page.locator('.visualization [data-observed="true"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Next", exact: true }).press("Enter");
  await expect(page.locator('.visualization [data-record="4"]')).toHaveAttribute("data-observed", "true");
  await expect(page.locator(".binary-code-values")).toContainText("mid = 4; predicate(mid) = True");
  await expect(page.getByRole("status")).toContainText("mid = 0 + (8 - 0) // 2 = 4");
  await page.getByRole("button", { name: "Move hi", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Correct: the algorithm moves hi to mid");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".binary-code-values")).toContainText("lo = 0; hi = 4; mid = 4");
  await expect(page.getByRole("status")).toContainText("this position remains a possible answer");
  await page.getByLabel("Threshold (£)", { exact: true }).fill("2000");
  await page.getByRole("button", { name: "Apply threshold", exact: true }).press("Enter");
  await expect(page.locator(".step-meter span").first()).toHaveText("1");
  await expect(page.locator(".visualization")).toContainText("£2000");
  for (let step = 1; step < 8; step++) await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("end sentinel");
  await expect(page.locator('.visualization [data-result="8"]')).toContainText("search reports no match");
  await page.getByLabel("Experiment", { exact: true }).selectOption("counterexample");
  await expect(page.getByLabel("Threshold (£)", { exact: true })).toHaveValue("6");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Day 2");
  await expect(page.locator('.visualization .binary-state')).toHaveAttribute("data-invariant", "violated");
  await expect(page.locator('.visualization [data-record="1"]')).toHaveAttribute("data-observed", "false");
  await expect(page.locator('.visualization [data-record="1"]')).toContainText("Assumed F");
  await expect(page.locator('.visualization [data-record="1"]')).toContainText("Verifier found");
  for (let step = 3; step < 8; step++) await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Return index 4 (Day 5)");
  await expect(page.getByRole("status")).toContainText("actual first match is index 1 (Day 2)");
  await expect(page.locator('.visualization [data-result="4"]')).toContainText("Incorrect: first match is index 1 (Day 2)");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.locator('.visualization [data-record="1"] > text').first()).toHaveText("?");
  await page.getByLabel("Reveal all dataset values", { exact: true }).check();
  await expect(page.locator('.visualization [data-record="1"] > text').first()).toHaveText("8");
  await expect(page.locator('.visualization [data-record="1"]')).toHaveAttribute("data-observed", "false");
  await expect(page.locator(".binary-dataset-label")).toContainText("it does not add checks to the search");
  await page.getByRole("button", { name: "Context", exact: true }).click();
  await page.getByText("Reveal suggested solution", { exact: true }).click();
  await expect(page.locator(".binary-solution")).toContainText("[80, 120, 250, 250, 250, 300, 300]");
  await page.getByRole("link", { name: "Try it in Run: Scale the search", exact: true }).click();
  await expect(page.locator(".binary-growth")).toBeVisible();
  const scale = page.getByLabel("Records: 1,024", { exact: true });
  await scale.press("End");
  await expect(page.locator("#binary-scale")).toHaveValue("20");
  await expect(page.locator(".binary-growth-bars")).toContainText("1,048,576");
  await expect(page.locator(".binary-growth-bars")).toContainText("21");
  await page.getByRole("button", { name: "Context", exact: true }).click();
  await expect(page.locator(".binary-context-copy h3")).toBeVisible();
  await expect(page.locator("#binary-scale")).toBeHidden();
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("#binary-scale")).toHaveValue("20");
  await expect(page.getByLabel("Records: 1,048,576", { exact: true })).toBeVisible();
  await expect(page.locator(".binary-growth-bars")).toContainText("1,048,576");
  await expect(page.locator(".binary-growth-bars")).toContainText("21");
  expect(new URL(page.url()).searchParams.get("source")).toBe("binary-pilot");
  expect(new URL(page.url()).searchParams.get("algorithm")).toBe("binary");
  await page.getByLabel("Experiment", { exact: true }).selectOption("boundary");
  await expect(page.locator(".step-meter span").first()).toHaveText("1");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
});

test("Binary Search starts with the explanation and preserves direct experiment links", async ({ page }) => {
  await page.goto(labPath + "?source=lesson-entry#visualizer");
  await ready(page);
  await expect(page.getByRole("button", { name: "Context", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".binary-context-copy h3")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next", exact: true })).toBeHidden();
  await expect(page.locator(".stage-head")).toContainText("without checking every record");
  await page.getByRole("link", { name: "Try the algorithm", exact: true }).press("Enter");
  await expect(page.getByRole("button", { name: "Next", exact: true })).toBeVisible();
  await expect(page.locator(".code-panel pre")).toBeVisible();
  await page.getByRole("link", { name: "Read the explanation", exact: true }).press("Enter");
  const experimentLink = page.getByRole("link", { name: "Try it in Run: Break the assumption", exact: true });
  const directLink = await experimentLink.getAttribute("href");
  await experimentLink.press("Enter");
  await expect(page.getByLabel("Experiment", { exact: true })).toHaveValue("counterexample");
  await expect(page.getByLabel("Threshold (£)", { exact: true })).toHaveValue("6");
  expect(new URL(page.url()).searchParams.get("source")).toBe("lesson-entry");
  await page.reload();
  await ready(page);
  await expect(page.getByLabel("Experiment", { exact: true })).toHaveValue("counterexample");
  await expect(page.getByLabel("Threshold (£)", { exact: true })).toHaveValue("6");
  await page.goBack();
  await expect(page.getByRole("button", { name: "Context", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.goto(labPath + directLink);
  await ready(page);
  await expect(page.getByLabel("Experiment", { exact: true })).toHaveValue("counterexample");
  await page.locator(".algorithm-list").getByText("BFS", { exact: true }).click();
  await ready(page, "BFS");
  await expect(page.getByRole("button", { name: "Next", exact: true })).toBeVisible();
  await page.locator(".algorithm-list").getByText("Binary Search", { exact: true }).click();
  await ready(page);
  await expect(page.getByRole("button", { name: "Context", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test.describe("Binary Search static reading", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  test("Context and constructive solution read without JavaScript", async ({ page }) => {
    await page.goto(labPath + "?algorithm=binary#visualizer", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Binary Search: How Much Can One Comparison Tell Us?", exact: true })).toBeVisible();
    await expect(page.locator(".binary-context-copy h4")).toHaveCount(6);
    await page.getByText("Reveal suggested solution", { exact: true }).click();
    await expect(page.locator(".binary-solution pre")).toBeVisible();
    await page.getByText("Could any Boolean-query search do better?", { exact: true }).click();
    await expect(page.locator('.binary-mathematical-note [role="math"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true);
  });
});

test("filters and Back/Forward restore selection and reset playback", async ({ page }) => {
  await page.goto(labPath + "?source=lab-audit#visualizer");
  await ready(page);
  for (const operation of [...new Set(labs.map(([, , operation]) => operation))]) {
    await page.getByRole("button", { name: operation, exact: true }).click();
    await expect(page.locator(".algorithm-list strong")).toHaveText(labs.filter(([, , op]) => op === operation).map(([, title]) => title));
    await expect(page.getByRole("button", { name: operation, exact: true })).toHaveAttribute("aria-pressed", "true");
  }
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".algorithm-list button")).toHaveCount(15);
  await page.locator(".algorithm-list").getByText("BFS", { exact: true }).click();
  await ready(page, "BFS");
  await page.locator(".algorithm-list").getByText("Dijkstra", { exact: true }).click();
  await ready(page, "Dijkstra");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await page.goBack(); await ready(page, "BFS");
  await expect(page.locator(".step-meter span").first()).toHaveText("1");
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
  await page.goForward(); await ready(page, "Dijkstra");
  await expect(page.locator(".step-meter span").first()).toHaveText("1");
  expect(new URL(page.url()).searchParams.get("source")).toBe("lab-audit");
  expect(new URL(page.url()).hash).toBe("#visualizer");
  const status = page.locator("#visualizer").getByRole("status");
  await page.getByLabel("Speed", { exact: true }).press("End");
  for (const [action, expectedStep] of [["Next", "3"], ["Back", "1"], ["Reset", "1"]]) {
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(status).toHaveAttribute("aria-live", "off");
    await page.getByRole("button", { name: action, exact: true }).click();
    await expect(status).toHaveAttribute("aria-live", "polite");
    await expect(status).toContainText("Paused.");
    await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
    await expect(page.locator(".step-meter span").first()).toHaveText(expectedStep);
  }
});

test("legacy document redirects preserve query and fragment through refresh", async ({ page }) => {
  for (const [from, to, heading] of [
    ["/algorithms?source=lab-audit&algorithm=tokenBucket#visualizer", `${labPath}?source=lab-audit&algorithm=tokenBucket#visualizer`, "Token Bucket"],
    ["/patterns?source=lab-audit#offline-mock-lab", "/learn/ai-engineering/control-plane?source=lab-audit#offline-mock-lab", "Agent Control Plane"],
  ]) {
    await page.goto(from);
    await expect(page).toHaveURL(new URL(to, page.url()).href);
    if (heading === "Token Bucket") await ready(page, heading);
    else await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    const target = page.locator(heading === "Token Bucket" ? "#visualizer h2" : "#offline-mock-lab");
    // Finish the initial fragment navigation before testing refresh restoration.
    await expect(target).toBeInViewport();
    await page.reload();
    await expect(page).toHaveURL(new URL(to, page.url()).href);
    await expect(target).toBeInViewport();
  }
});

test("algorithm query changes preserve the working position", async ({ page }) => {
  await page.goto(labPath);
  await ready(page);
  const target = page.getByRole("button", { name: "BFS Site crawler by depth", exact: true });
  await target.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await target.click();
  await ready(page, "BFS");
  expect(Math.abs(await page.evaluate(() => window.scrollY) - before)).toBeLessThanOrEqual(1);
  const animation = page.getByRole("region", { name: "Animation", exact: true });
  await animation.evaluate(element => { element.scrollLeft = element.scrollWidth; });
  expect(await animation.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await page.locator(".algorithm-list").getByText("Dijkstra", { exact: true }).click();
  await ready(page, "Dijkstra");
  await expect.poll(() => animation.evaluate(element => element.scrollLeft)).toBe(0);
  await animation.evaluate(element => { element.scrollLeft = element.scrollWidth; });
  const horizontal = await animation.evaluate(element => element.scrollLeft);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".step-meter span").first()).toHaveText("2");
  expect(await animation.evaluate(element => element.scrollLeft)).toBe(horizontal);
  await page.goBack(); await ready(page, "BFS");
  await expect.poll(() => animation.evaluate(element => element.scrollLeft)).toBe(0);
  await animation.evaluate(element => { element.scrollLeft = element.scrollWidth; });
  await page.goForward(); await ready(page, "Dijkstra");
  await expect.poll(() => animation.evaluate(element => element.scrollLeft)).toBe(0);
});

for (const hash of ["", "#visualizer"]) {
  test(`active reselection resets playback without navigation ${hash || "without anchor"}`, async ({ page }) => {
    for (const query of ["", "?algorithm=unknown", "?algorithm=bfs"]) {
      await page.goto(`${labPath}${query}${hash}`);
      await ready(page, query.includes("bfs") ? "BFS" : "Binary Search");
      await page.getByRole("button", { name: "Run", exact: true }).click();
      const active = page.locator('.algorithm-list button[aria-pressed="true"]');
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expect(page.locator(".step-meter span").first()).toHaveText("2");
      await page.getByRole("button", { name: "Play", exact: true }).click();
      await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
      await active.scrollIntoViewIfNeeded();
      const before = await page.evaluate(() => ({ scroll: window.scrollY, history: history.length, url: location.href }));
      await active.click();
      await expect(page.locator(".step-meter span").first()).toHaveText("1");
      await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
      const after = await page.evaluate(() => ({ scroll: window.scrollY, history: history.length, url: location.href }));
      expect(after.url).toBe(before.url);
      expect(after.history).toBe(before.history);
      expect(Math.abs(after.scroll - before.scroll)).toBeLessThanOrEqual(1);
    }
  });
}
