import { expect, test } from "@playwright/test";

test.use({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });

test("readers can inspect the five prepared reporting outcomes on a phone", async ({ page }) => {
  const response = await page.goto("/learn/system-design/chatgpt-ads-reporting#report-outcomes");
  expect(response.ok()).toBe(true);

  const reference = page.getByRole("region", { name: "Can you use this report?" });
  await expect(reference.getByText("Prepared examples · Fictional data")).toBeVisible();
  await expect(reference.getByText(/fictional UK ad account on 1 and 2 November/)).toBeVisible();

  const examples = [
    ["Complete report", "£36.00"],
    ["Empty report", "There are no totals to show."],
    ["Partial report", "The spend for the full period is still unknown."],
    ["Stale report", "Same reporting dates, two collection times"],
    ["Rejected request", "Retry once the account or permission has been corrected."],
  ];
  for (const [title, evidence] of examples) {
    const summary = reference.locator("summary").filter({ hasText: title });
    await summary.focus();
    await summary.press("Enter");
    await expect(reference.getByText(evidence, { exact: false }).first()).toBeVisible();
    await expect(reference.locator("details[open]")).toHaveCount(1);
    await expect(reference.getByRole("heading", { name: "What to do next" })).toBeVisible();

    if (title === "Stale report") {
      const comparison = reference.getByRole("table");
      await expect(comparison.getByRole("cell", { name: "£36.00" })).toBeVisible();
      await expect(comparison.getByRole("cell", { name: "£36.30" })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    }
  }
});
