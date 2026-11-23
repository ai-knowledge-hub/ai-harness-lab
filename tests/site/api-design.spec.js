import { test, expect } from "@playwright/test";
import { gzipSync } from "node:zlib";

const route = "/learn/system-design/api-design";
const historicalAnchors = ["start-with-the-operation", "define-the-contract", "make-failures-useful", "preserve-reporting-meaning", "connect-to-chatgpt-ads"];

for (const width of [320, 1440]) {
  test(`API contract figures and recovery explanations work without JavaScript at ${width}px`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 1000 } });
    try {
      const page = await context.newPage();
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("API Design: How Software Makes Promises It Can Keep");
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
      await expect(page.locator("main")).not.toContainText(/Visual brief|Publication candidate|Awaiting approval|utm_source=chatgpt/);
      await expect(page.locator("astro-island")).toHaveCount(0);
      for (const id of historicalAnchors) {
        await page.goto(`${route}#${id}`);
        await expect(page.locator(`#${id}`)).toBeInViewport();
        await expect(page.locator(`#${id}-title`)).toHaveCount(1);
      }
      for (const theme of ["light", "dark"]) {
        await page.locator("html").evaluate((html, value) => { html.dataset.theme = value; }, theme);
        for (const kind of ["boundary", "timeline", "compatibility"]) {
          const figure = page.locator(`[data-api-visual="${kind}"]`);
          await expect(figure).toBeVisible();
          if (kind === "timeline") {
            await expect(figure.locator("details")).toHaveCount(4);
            for (const scenario of await figure.locator("details").all()) {
              const summary = scenario.locator("summary");
              await summary.focus();
              if (!await scenario.evaluate(element => element.open)) await page.keyboard.press("Enter");
              await expect(summary).toBeFocused();
              const region = scenario.getByRole("region");
              await expect(region).toBeVisible();
              // Tab from the native disclosure reaches its scrollable timeline.
              await page.keyboard.press("Tab");
              await expect(region).toBeFocused();
              if (await region.evaluate(element => element.scrollWidth > element.clientWidth)) {
                await page.keyboard.press("ArrowRight", { delay: 100 });
                await expect.poll(() => region.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
                await region.evaluate(element => { element.scrollLeft = 0; });
              }
              await expect(scenario.locator(".api-retry-decision")).toContainText("Next safe action:");
              await summary.focus();
              await page.keyboard.press("Space");
              expect(await scenario.evaluate(element => element.open)).toBe(false);
            }
            await figure.locator("summary").first().press("Enter");
          }
          await figure.screenshot({ path: testInfo.outputPath(`api-${kind}-${theme}-${width}.png`), style: ".site-header { visibility: hidden !important; }" });
        }
        const answers = page.locator("[data-api-answer]");
        await expect(answers).toHaveCount(4);
        for (const answer of await answers.all()) {
          const summary = answer.locator("summary");
          await summary.focus();
          await page.keyboard.press("Enter");
          await expect(answer.locator("p")).toBeVisible();
          await page.keyboard.press("Enter");
          await expect(answer.locator("p")).not.toBeVisible();
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.locator(".lesson-header").screenshot({ path: testInfo.outputPath(`api-opening-${theme}-${width}.png`) });
      }
    } finally { await context.close(); }
  });
}

test("native scenario changes keep the reading script budget and require no island", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL });
  try {
    const page = await context.newPage();
    const scripts = new Map();
    page.on("response", response => {
      if (response.request().resourceType() === "script") scripts.set(response.url(), response);
    });
    await page.goto(route, { waitUntil: "networkidle" });
    const summary = page.locator("#api-concurrent-update > summary");
    await summary.press("Enter");
    await expect(page.locator("#api-concurrent-update .api-retry-decision")).toBeVisible();
    await expect(page.locator("astro-island")).toHaveCount(0);
    const externalBytes = await Promise.all([...scripts.values()].map(async response => gzipSync(await response.body()).length));
    const inline = await page.locator('script:not([src]):is(:not([type]), [type="module"], [type="text/javascript"])').allTextContents();
    const bytes = externalBytes.reduce((sum, count) => sum + count, 0) + inline.filter(text => text.trim()).reduce((sum, text) => sum + gzipSync(text).length, 0);
    expect(bytes, "reading scripts through the first native scenario change").toBeLessThanOrEqual(63_477);
    test.info().annotations.push({ type: "script-gzip-bytes", description: String(bytes) });
  } finally { await context.close(); }
});
