import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { visualState } from "../support/visual-state";

// Independent #42 inventory, not calculated from the candidate registry.
const { labs } = JSON.parse(readFileSync(new URL("../fixtures/labs.json", import.meta.url)));
const { states } = JSON.parse(readFileSync(new URL("../fixtures/lab-visual-states.json", import.meta.url)));
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
  await expect(page.locator(".algorithm-list button")).toHaveCount(15);
  const meter = page.locator(".step-meter span");
  for (const theme of ["dark", "light"]) {
    if (theme === "light") await page.getByRole("button", { name: "Switch to light mode" }).click();
    for (const [id, title, , count] of labs) {
      await page.locator(".algorithm-list").getByText(title, { exact: true }).click();
      await ready(page, title);
      await expect(page).toHaveURL(new RegExp(`algorithm=${id}(?:&|#|$)`));
      await expect(meter.last()).toHaveText(String(count));
      expect(states[id]).toHaveLength(count);
      for (let step = 1; step <= count; step++) {
        const [label, expectedState] = states[id][step - 1];
        await expect(meter.first()).toHaveText(String(step));
        const rendered = await page.locator(".visualization").evaluate(visualState);
        const actualState = createHash("sha256").update(rendered).digest("hex");
        expect.soft(actualState, `${id} step ${step}: ${label} diagram state`).toBe(expectedState);
        await expect(page.locator(".visual-panel .panel-title strong")).toHaveText(label);
        await expect(page.locator(".code-line.active")).toHaveCount(1);
        if (step < count) await page.getByRole("button", { name: "Next", exact: true }).click();
      }
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expect(meter.first()).toHaveText(String(count));
      await page.getByRole("button", { name: "Back", exact: true }).click();
      await expect(meter.first()).toHaveText(String(count - 1));
      await page.getByRole("button", { name: "Context", exact: true }).click();
      await expect(page.getByText("Why it exists", { exact: true })).toBeVisible();
      await page.getByRole("button", { name: "Run", exact: true }).click();
      await page.getByRole("button", { name: "Reset", exact: true }).click();
      await expect(meter.first()).toHaveText("1");
      await page.getByRole("button", { name: "Back", exact: true }).click();
      await expect(meter.first()).toHaveText("1");
    }
  }
  const speed = page.getByLabel("Speed", { exact: true });
  await speed.press("Home"); await expect(speed).toHaveValue("500");
  await speed.press("End"); await expect(speed).toHaveValue("1800");
  await speed.press("Home");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(meter.first()).toHaveText("2");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(meter.first()).toHaveText(String(labs.at(-1)[3]));
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
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
    await page.reload();
    await expect(page).toHaveURL(new URL(to, page.url()).href);
    await expect(page.locator(heading === "Token Bucket" ? "#visualizer h2" : "#offline-mock-lab")).toBeInViewport();
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
});

for (const hash of ["", "#visualizer"]) {
  test(`active reselection resets playback without navigation ${hash || "without anchor"}`, async ({ page }) => {
    for (const query of ["", "?algorithm=unknown", "?algorithm=bfs"]) {
      await page.goto(`${labPath}${query}${hash}`);
      await ready(page, query.includes("bfs") ? "BFS" : "Binary Search");
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
