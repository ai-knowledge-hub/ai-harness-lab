import { test, expect } from "@playwright/test";

const pilotPath = "/learn/system-design/chatgpt-ads";

function navigationTo(page, path) {
  return page.waitForResponse((response) =>
    response.request().isNavigationRequest() &&
    response.request().frame() === page.mainFrame() &&
    new URL(response.url()).pathname === path,
  { timeout: 5000 });
}

async function expectPilot(page) {
  await expect(page.locator("[data-ads-walkthrough]")).toHaveCount(1);
  await expect(page.locator('script[src^="/assets/"]')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://harness.ai-knowledge-hub.org" + pilotPath);
}

for (const [source, route, link] of [
  ["track entry", "/learn/system-design", (page) => page.getByRole("link", { name: "Explore ad delivery", exact: true })],
  ["related guide", "/learn/system-design/advertising-platforms", (page) => page.getByRole("link", { name: "How ChatGPT Ads works", exact: true })],
  ["reference context", "/learn/system-design/api-design", (page) => page.getByRole("navigation", { name: "Reference context" }).getByRole("link", { name: /How ads work/ })],
]) {
  test(`${source} requests its Astro document`, async ({ page }) => {
    await page.goto(route);
    // Exercise the shell before testing native document navigation.
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const [response] = await Promise.all([navigationTo(page, pilotPath), link(page).click()]);
    expect(response.status()).toBe(200);
    await expectPilot(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.locator(".ads-deep-dive").scrollIntoViewIfNeeded();
    const status = page.locator(".ads-step-actions [role=status]");
    await expect(status).toHaveText("Stage 1 of 5");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(status).toHaveText("Stage 2 of 5");
    await page.reload();
    await expectPilot(page);
    await page.goBack();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(route + "$"));
  });
}

for (const javaScriptEnabled of [false, true]) {
  test(`preview site links work with JavaScript ${javaScriptEnabled ? "enabled" : "disabled"}`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled, viewport: testInfo.project.use.viewport });
    try {
      const page = await context.newPage();
      for (const [target, heading] of [
        ["/", /Build and operate AI products/i],
        ["/learn/system-design", "System design"],
        ["/learn/system-design/chatgpt-ads-apis", "ChatGPT Ads APIs for advertisers"],
        ["/learn/system-design/chatgpt-ads-reporting", "How to collect ChatGPT Ads reports"],
        ["/learn/system-design/api-design", "API design principles"],
        ["/learn/system-design/advertising-platforms", "How advertising platforms work"],
      ]) {
        await page.goto(pilotPath);
        await expectPilot(page);
        const [response] = await Promise.all([
          navigationTo(page, target),
          page.locator(`main a[href="${target}"]`).first().click(),
        ]);
        expect(response.status()).toBe(200);
        await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
        await expect(page).toHaveURL(new RegExp(target + "$"));
      }
    } finally {
      await context.close();
    }
  });
}
