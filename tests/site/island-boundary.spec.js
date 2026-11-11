import { test, expect } from "@playwright/test";

test("reading pages do not request the lab island", async ({ page, request }) => {
  const labHtml = await (await request.get("/learn/algorithms/visualizers")).text();
  const labEntry = labHtml.match(/component-url="([^"]+)"/)[1];
  const scripts = [];
  page.on("request", (request) => { if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname); });
  for (const route of ["/", "/learn/system-design", "/learn/system-design/api-design", "/learn/system-design/chatgpt-ads", "/learn/ai-engineering/verify-small-code-change", "/learn/system-design/chatgpt-ads-reporting", "/examples"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("astro-island")).toHaveCount(0);
  }
  expect(scripts).not.toContain(labEntry);
});

test("a late lab download preserves the existing scrolling target", async ({ page }) => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route(/AlgorithmLabIsland.*\.js$/, async (route) => { await held; await route.continue(); });
  await page.goto("/learn/algorithms/visualizers", { waitUntil: "domcontentloaded" });
  const target = await page.locator("#visualizer").elementHandle();
  await page.locator("#visualizer").scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  release();
  await expect(page.locator("astro-island")).not.toHaveAttribute("ssr");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".step-meter span").first()).toHaveText("2");
  expect(await target.evaluate((element) => element.isConnected)).toBe(true);
  expect(Math.abs(await page.evaluate(() => window.scrollY) - before)).toBeLessThanOrEqual(1);
});
