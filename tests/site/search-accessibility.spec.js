import { test, expect } from "@playwright/test";
const path = "/learn/system-design/chatgpt-ads";
const id = "chatgpt-ads-visual-deep-dive-0-stage-";

test("stage controls preserve their names and keyboard focus at boundaries", async ({ page }) => {
  await page.goto(path);
  for (const [index, label] of ["Paths", "Tools", "Delivery", "Reports", "Our build"].entries()) {
    const button = page.getByRole("button", { name: new RegExp(`^Stage ${index + 1}:`) });
    await expect(button).toContainText(label);
    await expect(button).toHaveAccessibleName(new RegExp(label));
  }
  const next = page.locator(".ads-step-actions").getByRole("button", { name: "Next", exact: true });
  const previous = page.locator(".ads-step-actions").getByRole("button", { name: "Previous", exact: true });
  const status = page.locator(".ads-step-actions [role=status]");
  for (let step = 0; step < 4; step++) await next.press("Enter");
  await expect(next).toBeFocused();
  await next.press("Space");
  await expect(status).toHaveText("Stage 5 of 5");
  for (let step = 0; step < 4; step++) await previous.press("Enter");
  await expect(previous).toBeFocused();
  await previous.press("Space");
  await expect(status).toHaveText("Stage 1 of 5");
});

test("initial and changed explanation fragments reveal the matching stage", async ({ page }) => {
  await page.goto(path + "#" + id + "4");
  const status = page.locator(".ads-step-actions [role=status]");
  await expect(status).toHaveText("Stage 5 of 5");
  await expect(page.locator(`[id="${id}4"]`)).toBeVisible();
  await expect(page.locator(`[id="${id}4"]`)).toBeInViewport();
  await page.goto(path + "#" + id + "1");
  await expect(status).toHaveText("Stage 2 of 5");
  await expect(page.locator(`[id="${id}1"]`)).toBeInViewport();
  await expect(page.getByRole("button", { name: /^Stage 2:/ })).toHaveAttribute("aria-current", "step");
});

test("browser search can reach inactive explanation text", async ({ page }) => {
  await page.goto(path);
  const status = page.locator(".ads-step-actions [role=status]");
  await expect(status).toHaveText("Stage 1 of 5");
  const supportsReveal = await page.evaluate(() => "onbeforematch" in HTMLElement.prototype);
  expect(await page.evaluate(() => window.find("The dashed boxes show our plan"))).toBe(true);
  if (supportsReveal) {
    // Also exercise the native reveal event independently of the legacy JS
    // find API, whose dispatch behaviour differs from browser-chrome search.
    await page.locator(`[id="${id}4"]`).evaluate((heading) => {
      heading.closest(".ads-stage-copy").dispatchEvent(new Event("beforematch", { bubbles: true }));
    });
    await expect(status).toHaveText("Stage 5 of 5");
    await expect(page.getByRole("button", { name: /^Stage 5:/ })).toHaveAttribute("aria-current", "step");
  } else await expect(page.locator(".ads-stage-copy:visible")).toHaveCount(5);
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
