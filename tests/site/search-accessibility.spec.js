import { test, expect } from "@playwright/test";
const path = "/learn/system-design/chatgpt-ads";
const id = "chatgpt-ads-visual-deep-dive-0-stage-";

test("every stage control includes its visible label in its accessible name", async ({ page }) => {
  await page.goto(path);
  for (const [index, label] of ["Paths", "Tools", "Delivery", "Reports", "Our build"].entries()) {
    const button = page.getByRole("button", { name: new RegExp(`^Stage ${index + 1}:`) });
    await expect(button).toContainText(label);
    await expect(button).toHaveAccessibleName(new RegExp(label));
  }
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
