import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const { routes } = JSON.parse(readFileSync(new URL("../fixtures/reading-baseline.json", import.meta.url)));

test("reading pages do not request the lab island", async ({ page, request }) => {
  const labHtml = await (await request.get("/learn/algorithms/visualizers")).text();
  const labEntry = labHtml.match(/component-url="([^"]+)"/)[1];
  const scripts = [];
  page.on("request", (request) => { if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname); });
  for (const route of Object.keys(routes).filter(path => path !== "/learn/algorithms/visualizers")) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("astro-island")).toHaveCount(0);
  }
  expect(scripts).not.toContain(labEntry);
});

test("a late lab download preserves the existing scrolling target", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && /hydrat|minified React error/i.test(message.text())) errors.push(message.text());
  });
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route(/AlgorithmLabIsland.*\.js$/, async (route) => { await held; await route.continue(); });
  await page.goto("/learn/algorithms/visualizers?algorithm=tokenBucket", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#visualizer h2")).toHaveText("Binary Search");
  const target = await page.locator("#visualizer").elementHandle();
  await page.locator("#visualizer").scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  release();
  await expect(page.locator("astro-island")).not.toHaveAttribute("ssr");
  await expect(page.locator("#visualizer h2")).toHaveText("Token Bucket");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".step-meter span").first()).toHaveText("2");
  expect(await target.evaluate((element) => element.isConnected)).toBe(true);
  expect(Math.abs(await page.evaluate(() => window.scrollY) - before)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});
