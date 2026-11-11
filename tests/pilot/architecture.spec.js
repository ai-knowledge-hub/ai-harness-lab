import { test, expect } from "@playwright/test";

const path = "/learn/system-design/chatgpt-ads";
const stageTitles = [
  "How the answer and ad take separate paths",
  "Find ads that could fit the conversation",
  "See when a selected ad appears",
  "Find the results advertisers can read",
  "See how you could collect reports",
];

async function expectReference(page) {
  await expect(page.getByRole("heading", { level: 1, name: "How ChatGPT Ads works" })).toBeVisible();
  const diagram = page.locator(".ads-deep-dive");
  await expect(diagram.locator(".ads-node:visible")).toHaveCount(18);
  await expect(diagram.locator(".ads-stage-copy:visible")).toHaveCount(5);
  await expect(diagram.getByText("No ad is shown in this exchange", { exact: false })).toBeVisible();
  await expect(diagram.getByRole("button", { name: "Next", exact: true })).not.toBeVisible();
  await expect(diagram.locator('[data-node="worker"]')).toContainText("Harness · proposed");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://harness.ai-knowledge-hub.org" + path);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
}

test("reading, complete diagram and downloads survive without JavaScript", async ({ browser, baseURL }, testInfo) => {
  const context = await browser.newContext({ baseURL, viewport: testInfo.project.use.viewport, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(path);
  await expectReference(page);
  for (const file of ["README.md", "architecture-contracts.schema.json", "architecture-examples.json"]) {
    const href = "/references/chatgpt-ads/v1/" + file;
    await expect(page.locator(`a[href="${href}"]`)).toBeVisible();
    expect((await context.request.get(href)).ok()).toBe(true);
  }
  await context.close();
});

test("a failed enhancement keeps the complete reference readable", async ({ page }) => {
  await page.route(/\/_astro\/.*\.js(?:\?|$)/, (route) => route.abort());
  await page.goto(path + "#visual-deep-dive");
  await expectReference(page);
});

test("walkthrough preserves stage, outcome and keyboard behaviour", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(path + "#visual-deep-dive");
  const diagram = page.locator(".ads-deep-dive");
  const status = diagram.locator(".ads-step-actions [role=status]");
  const next = diagram.getByRole("button", { name: "Next", exact: true });
  const previous = diagram.getByRole("button", { name: "Previous", exact: true });
  const nodeCounts = [4, 8, 14, 16, 18];
  const mapHeights = [272, 404, 668, 800, 932];
  for (let stage = 0; stage < 5; stage++) {
    await expect(status).toHaveText(`Stage ${stage + 1} of 5`);
    await expect(diagram.locator(".ads-stage-copy:visible")).toHaveCount(1);
    await expect(diagram.getByRole("heading", { level: 3, name: `${stage + 1}. ${stageTitles[stage]}`, exact: true })).toBeVisible();
    await expect(diagram.locator(".ads-node:visible")).toHaveCount(nodeCounts[stage]);
    await expect(diagram.locator(".ads-map svg")).toHaveAttribute("height", String(mapHeights[stage]));
    if (stage === 0) await expect(previous).toBeDisabled();
    if (stage < 4) {
      await next.focus();
      await page.keyboard.press("Enter");
    }
  }
  await expect(next).toBeDisabled();
  for (let stage = 4; stage > 0; stage--) {
    await previous.click();
    await expect(status).toHaveText(`Stage ${stage} of 5`);
    await expect(diagram.locator(".ads-node:visible")).toHaveCount(nodeCounts[stage - 1]);
    await expect(diagram.getByRole("heading", { level: 3, name: `${stage}. ${stageTitles[stage - 1]}`, exact: true })).toBeVisible();
  }
  await expect(previous).toBeDisabled();
  await diagram.getByRole("button", { name: /^Stage 3:/ }).click();
  await expect(status).toHaveText("Stage 3 of 5");
  const select = diagram.getByLabel("Example ad outcome", { exact: true });
  const outcome = diagram.locator(".ads-delivery-example [role=status]");
  for (const [value, text] of [
    ["late", "No ad is shown in this exchange"],
    ["ineligible", "before the system sends it"],
    ["timely", "Count an impression"],
  ]) {
    await select.selectOption(value);
    await expect(outcome).toContainText(text);
    const shownEdge = value === "ineligible" ? '[data-from="checks"][data-to="no-ad"]'
      : value === "late" ? '[data-from="display"][data-to="late"]'
        : '[data-from="display"][data-to="client"]';
    await expect(diagram.locator(shownEdge)).not.toHaveAttribute("data-muted", "true");
    const selectedAd = diagram.locator('[data-from="checks"][data-to="bundle"]');
    if (value === "ineligible") await expect(selectedAd).toHaveAttribute("data-muted", "true");
    else await expect(selectedAd).not.toHaveAttribute("data-muted", "true");
  }
  await diagram.getByRole("button", { name: "Show complete diagram", exact: true }).click();
  await expect(status).toHaveText("Complete diagram");
  await expect(next).toBeDisabled();
  await expect(previous).toBeDisabled();
  await expect(diagram.locator(".ads-node:visible")).toHaveCount(18);
  await expect(diagram.locator(".ads-stage-copy:visible")).toHaveCount(5);
  await diagram.getByRole("button", { name: "Return to staged view", exact: true }).click();
  await expect(status).toHaveText("Stage 3 of 5");
  await expect(diagram.locator(".ads-stage-copy:visible")).toHaveCount(1);
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  if (page.viewportSize().width < 640) {
    const menu = page.locator(".mobile-navigation");
    await menu.locator("summary").click();
    await page.keyboard.press("Escape");
    await expect(menu).not.toHaveAttribute("open");
    await expect(menu.locator("summary")).toBeFocused();
    const contents = page.locator(".lesson-mobile-contents");
    await contents.locator("summary").click();
    await contents.getByRole("link", { name: "Follow the path of an ad" }).click();
    await expect(page).toHaveURL(/#visual-deep-dive$/);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
