import { test, expect } from "@playwright/test";

test("homepage and algorithms route load", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toContainText(/harness engineering for marketing ai systems/i);

  await page.goto("/algorithms");
  await expect(
    page.getByRole("heading", { name: /algorithms inside marketing agents/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /binary search/i })).toBeVisible();
  await page.getByRole("button", { name: "Control" }).click();
  await expect(page.getByRole("button", { name: /approval state machine/i })).toBeVisible();

  await page.goto("/patterns");
  await expect(page.getByRole("heading", { name: /agent control plane/i })).toBeVisible();
  await expect(page.locator("main")).toContainText(/approval gates/i);
});
