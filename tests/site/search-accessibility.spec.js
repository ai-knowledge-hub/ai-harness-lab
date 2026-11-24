import { test, expect } from "@playwright/test";
const path = "/learn/system-design/chatgpt-ads";
const id = "chatgpt-ads-visual-deep-dive-0-stage-";

test("responsibility controls preserve keyboard focus at both boundaries", async ({ page }) => {
  await page.goto(path);
  const figure = page.locator('[data-chatgpt-visual="orchestration"]');
  await figure.locator(".cg-controls > summary").click();
  const next = figure.getByRole("button", { name: "Next responsibility", exact: true });
  const previous = figure.getByRole("button", { name: "Previous responsibility", exact: true });
  const status = figure.getByRole("status");
  for (let step = 0; step < 4; step++) await next.press("Enter");
  await expect(next).toBeFocused();
  await next.press("Space");
  await expect(status).toContainText("Responsibility 5 of 5");
  for (let step = 0; step < 4; step++) await previous.press("Enter");
  await expect(previous).toBeFocused();
  await previous.press("Space");
  await expect(status).toContainText("Responsibility 1 of 5");
});

test("historical explanation fragments land at their mapped responsibilities", async ({ page }) => {
  for (const [stage, section] of [[0, "visual-deep-dive"], [1, "orchestrator-detail"], [2, "delivery-boundaries"], [3, "advertiser-controls"], [4, "reference-downloads"]]) {
    await page.goto(path + "#" + id + stage);
    const target = page.locator(`[id="${id}${stage}"]`);
    await expect(target).toBeInViewport();
    expect(await target.evaluate((element, section) => element.closest("section").id === section, section)).toBe(true);
  }
});

test("browser search reaches the reviewed explanation without activating controls", async ({ page }) => {
  await page.goto(path);
  expect(await page.evaluate(() => window.find("The LLM does not independently set the price"))).toBe(true);
  await expect(page.locator("#orchestrator-detail")).toContainText("The LLM does not independently set the price");
});

test("the Markdown guide keeps its reading layout, fragment and table without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/learn/measurement-ml/attribution-and-lift#read-the-results");
    await expect(page.getByRole("heading", { level: 1, name: "How to compare attributed conversions and lift" })).toBeVisible();
    const section = page.locator("#read-the-results");
    await expect(section.getByRole("heading", { level: 2 })).toHaveAttribute("id", "read-the-results-title");
    await expect(section.getByRole("columnheader", { name: "Order rate" })).toBeVisible();
    await expect(section.getByRole("rowheader", { name: "Holdout" })).toBeVisible();
    await expect(section.getByRole("cell", { name: "2.0%" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Google Research on geographic experiments" })).toHaveAttribute(
      "href", "https://research.google/pubs/measuring-ad-effectiveness-using-geo-experiments/",
    );
    const tableRegion = section.getByRole("region", { name: "Scrollable comparison table" });
    await tableRegion.focus();
    await expect(tableRegion).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } finally {
    await context.close();
  }
});
