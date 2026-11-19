import { test, expect } from "@playwright/test";

const path = "/learn/system-design/when-an-agent-checkout-times-out";
const retainedAnchors = ["recheck-the-delivery-promise", "trace-the-timeout", "look-up-the-order-before-retrying", "make-a-repeat-submit-safe", "replay-the-failures"];

for (const width of [320, 1440]) {
  test(`the restored systems article and diagrams work without JavaScript at ${width}px`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 1000 } });
    try {
      const page = await context.newPage();
      for (const theme of ["light", "dark"]) {
        await page.goto(path);
        await page.locator("html").evaluate((html, theme) => { html.dataset.theme = theme; }, theme);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText("Eventual Consistency at the Checkout");
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
        for (const anchor of retainedAnchors) await expect(page.locator(`#${anchor}`)).toHaveCount(1);
        await expect(page.locator("#christmas-peak")).toContainText("$1,750");
        const figures = page.locator("figure.system-diagram");
        await expect(figures).toHaveCount(3);
        for (const [index, figure] of (await figures.all()).entries()) {
          const image = figure.getByRole("img");
          await image.scrollIntoViewIfNeeded();
          await expect(image).toHaveAttribute("alt", /.+/);
          await expect.poll(() => image.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
          const link = figure.getByRole("link", { name: "Open the full diagram" });
          expect((await context.request.get(await link.getAttribute("href"))).status()).toBe(200);
          const region = figure.getByRole("region");
          await expect(region).toHaveAccessibleName(await figure.locator("figcaption").textContent());
          await link.focus();
          await page.keyboard.press("Tab");
          await expect(region).toBeFocused();
          if (await region.evaluate((element) => element.scrollWidth > element.clientWidth)) {
            await page.keyboard.press("ArrowRight", { delay: 100 });
            await expect.poll(() => region.evaluate((element) => element.scrollLeft), { message: `Diagram ${index + 1}, ${theme}: keyboard scrolling` }).toBeGreaterThan(0);
          }
          await figure.screenshot({ path: testInfo.outputPath(`diagram-${index + 1}-${theme}.png`) });
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await page.locator("astro-island").count())).toBe(0);
      }
    } finally {
      await context.close();
    }
  });
}
