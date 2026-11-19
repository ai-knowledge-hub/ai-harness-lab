import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

const baseline = JSON.parse(await readFile(new URL("../fixtures/markdown-migration-baseline.json", import.meta.url), "utf8"));

for (const width of [390, 1440]) {
  test(`all migrated guides retain reading and accessible code without JavaScript at ${width}px`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 1000 } });
    try {
      const page = await context.newPage();
      for (const [path, expected] of Object.entries(baseline.routes)) {
        const response = await page.goto(path);
        expect(response.status()).toBe(200);
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", expected.robots);
        expect(await page.locator("pre code").allTextContents()).toEqual(expected.code.map((code) => code + "\n"));
        for (const pre of await page.locator(".lesson-code pre").all()) {
          await expect(pre).toHaveAttribute("role", "region");
          await pre.focus();
          await expect(pre).toBeFocused();
          await expect(pre).toHaveAttribute("aria-label", /.+/);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      await page.goto("/learn/system-design/when-an-agent-checkout-times-out#look-up-the-order-before-retrying");
      await page.locator("#look-up-the-order-before-retrying").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `/private/tmp/harness-checkout-markdown-${width}.png` });
    } finally {
      await context.close();
    }
  });
}
