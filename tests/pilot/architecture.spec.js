import { test, expect } from "@playwright/test";
const path = "/learn/system-design/chatgpt-ads";

async function expectReference(page) {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("How ChatGPT Ads Works");
  await expect(page.locator("[data-chatgpt-visual]")).toHaveCount(5);
  await expect(page.locator("[data-cg-equation] math")).toHaveCount(2);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://harness.ai-knowledge-hub.org" + path);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
}

test("reviewed reading, all figures and v1 downloads survive without JavaScript", async ({ browser, baseURL }, testInfo) => {
  const context = await browser.newContext({ baseURL, viewport: testInfo.project.use.viewport, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(path);
    await expectReference(page);
    await expect(page.locator(".cg-controls")).toHaveCount(0);
    await expect(page.locator("#delivery-boundaries")).toContainText("Server-side timeout");
    for (const file of ["README.md", "architecture-contracts.schema.json", "architecture-examples.json"]) {
      const href = "/references/chatgpt-ads/v1/" + file;
      await expect(page.locator(`a[href="${href}"]`)).toBeVisible();
      expect((await context.request.get(href)).ok()).toBe(true);
    }
  } finally { await context.close(); }
});

test("a failed enhancement keeps the full teaching reference readable", async ({ page }) => {
  await page.route(/\/_astro\/.*\.js(?:\?|$)/, route => route.abort());
  await page.goto(path);
  await expectReference(page);
  await expect(page.locator(".cg-controls")).toHaveCount(0);
  await expect(page.locator(".cg-tool-loop details[open]")).toHaveCount(5);
});

test("the delivery experiment distinguishes both timing boundaries using native controls", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(path + "#chatgpt-delivery");
  const figure = page.locator('[data-chatgpt-visual="delivery"]');
  await expect(figure).toHaveAttribute("data-outcome", "on-time");
  await figure.locator('[name="arrival"][value="late"]').check();
  await expect(figure).toHaveAttribute("data-outcome", "late");
  await figure.locator('[name="context"][value="reject"]').check();
  await expect(figure).toHaveAttribute("data-outcome", "rejected");
  await figure.locator('[name="server"][value="timeout"]').check();
  await expect(figure).toHaveAttribute("data-outcome", "timeout");
  await expect(figure.locator("[data-context-controls] input").first()).toBeDisabled();
  await expect(figure.locator("[data-arrival-controls] input").first()).toBeDisabled();
  await expect(figure.getByRole("status")).toContainText("Organic answer: available independently");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
