import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import { guideSections } from "../../scripts/markdown-guide-sections.mjs";
import { codeFenceExamples, ordinaryCodeFences } from "../fixtures/ordinary-code-fences.js";

const baseline = JSON.parse(await readFile(new URL("../fixtures/markdown-migration-baseline.json", import.meta.url), "utf8"));
const marketplaceArticle = JSON.parse(await readFile(new URL("../fixtures/marketplace-systems-article.json", import.meta.url), "utf8"));
const reportingArticle = JSON.parse(await readFile(new URL("../fixtures/advertising-reporting-article.json", import.meta.url), "utf8"));
const platformArticle = JSON.parse(await readFile(new URL("../fixtures/advertising-platforms-article.json", import.meta.url), "utf8"));
const chatgptArticle = JSON.parse(await readFile(new URL("../fixtures/chatgpt-ads-article.json", import.meta.url), "utf8"));
const retirement = JSON.parse(await readFile(new URL("../fixtures/api-guide-retirement.json", import.meta.url), "utf8"));

for (const width of [390, 1440]) {
  test(`all migrated guides retain reading and accessible code without JavaScript at ${width}px`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 1000 } });
    try {
      const page = await context.newPage();
      for (const [path, expected] of Object.entries({ ...baseline.routes, ...marketplaceArticle.routes, ...reportingArticle.routes, ...platformArticle.routes, ...chatgptArticle.routes, ...retirement.routes })) {
        if (path === retirement.retiredRoute) continue;
        const response = await page.goto(path);
        expect(response.status()).toBe(200);
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", expected.robots);
        expect(await page.locator("pre code").allTextContents()).toEqual(expected.code.map((code) => code + "\n"));
        for (const pre of await page.locator("main pre").all()) {
          await expect(pre).toHaveAttribute("role", "region");
          await pre.focus();
          await expect(pre).toBeFocused();
          await expect(pre).toHaveAttribute("aria-label", /.+/);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      await page.goto("/learn/system-design/when-an-agent-checkout-times-out#look-up-the-order-before-retrying");
      await page.locator("#look-up-the-order-before-retrying").scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath(`marketplace-reading-${width}.png`) });
    } finally {
      await context.close();
    }
  });
}

test("ordinary code fences stay keyboard-scrollable at 320px without JavaScript", async ({ browser, baseURL }, testInfo) => {
  const renderer = await createSatteriMarkdownProcessor({ syntaxHighlight: false, hastPlugins: [guideSections] });
  const { code } = await renderer.render(`## Ordinary fences\n\n${ordinaryCodeFences}`, {
    frontmatter: { sectionIds: ["ordinary-fences"] },
  });
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  try {
    const page = await context.newPage();
    await page.goto("/learn/system-design/when-an-agent-checkout-times-out");
    // Exercise the real Markdown processor inside the served guide's layout/CSS.
    await page.locator(".lesson-section").first().evaluate((section, html) => { section.innerHTML = html; }, code);
    const blocks = page.locator("#ordinary-fences pre");
    await expect(blocks).toHaveCount(codeFenceExamples.length);
    for (const [index, example] of codeFenceExamples.entries()) {
      const pre = blocks.nth(index);
      await expect(pre).toHaveAttribute("role", "region");
      await expect(pre).toHaveAccessibleName(example.label);
      await expect(pre.locator("code")).toHaveText(example.code);
      expect(await pre.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
      await pre.evaluate((element) => {
        const before = document.createElement("button");
        element.before(before);
        before.focus();
      });
      await page.keyboard.press("Tab");
      await expect(pre).toBeFocused();
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => pre.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator("#ordinary-fences").scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("ordinary-fences-320.png") });
  } finally {
    await context.close();
  }
});
