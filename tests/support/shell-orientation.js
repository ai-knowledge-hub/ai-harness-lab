import { expect } from "@playwright/test";

// Reader-facing expectations intentionally do not import the content catalogue.
export async function expectShellOrientation(page) {
  const descriptor = page.getByRole("complementary", { name: "About Harness", exact: true });
  await expect(descriptor).toBeVisible();
  await expect(descriptor).toHaveText("Engineering guides, labs and worked examples for AI systems.");
  await expect(page.locator(".site-brand")).toHaveAccessibleName("AI Knowledge Hub Harness home");
  const mobile = page.viewportSize().width <= 900;
  const summary = page.locator(".mobile-navigation > summary");
  if (mobile) await summary.press("Enter");
  const family = page.locator(mobile ? '.mobile-menu nav[aria-label="Companion sites"]' : ".family-navigation");
  for (const [name, purpose, href] of [
    ["Publication", "Research to inform decisions.", "https://ai-knowledge-hub.org"],
    ["Skills", "Reusable resources to adapt.", "https://skills.ai-knowledge-hub.org"],
  ]) {
    for (const navigation of [family, page.getByRole("navigation", { name: "Footer", exact: true })]) {
      const link = navigation.getByRole("link", { name: new RegExp(`^${name}`) });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
      await expect(link.locator(".family-link-purpose")).toBeVisible();
      await expect(link.locator(".family-link-purpose")).toHaveText(purpose);
      await expect(link).toHaveAccessibleName(new RegExp(purpose.replaceAll(".", "\\.")));
    }
  }
  if (mobile) {
    await summary.press("Enter");
    await expect(page.locator(".mobile-navigation")).not.toHaveAttribute("open");
    await expect(summary).toBeFocused();
  }
}
