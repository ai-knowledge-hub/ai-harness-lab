import { test, expect } from "@playwright/test";

const path = "/learn/system-design/when-an-agent-checkout-times-out";
const retainedAnchors = ["recheck-the-delivery-promise", "trace-the-timeout", "look-up-the-order-before-retrying", "make-a-repeat-submit-safe", "replay-the-failures"];
const diagramKinds = ["partition", "lifecycle", "coordination", "events", "checkout"];

for (const width of [320, 1440]) {
  test(`marketplace diagrams and the rewritten article work without JavaScript at ${width}px`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 1000 } });
    try {
      const page = await context.newPage();
      for (const theme of ["light", "dark"]) {
        await page.goto(path);
        await page.locator("html").evaluate((html, theme) => { html.dataset.theme = theme; }, theme);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText("How Marketplaces Work When Their Systems Disagree");
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
        for (const anchor of retainedAnchors) await expect(page.locator(`#${anchor}`)).toHaveCount(1);
        await expect(page.locator("main")).not.toContainText("Diagram brief:");
        const research = page.locator("#sources-and-scope");
        await expect(research.locator("ol > li")).toHaveCount(14);
        await expect(research.locator("ol a")).toHaveCount(16);
        const sourceNotes = page.locator(".lesson-section > p > em").filter({ hasText: /^(Sources|Source|Further reading):/ });
        await expect(sourceNotes).toHaveCount(7);
        for (const note of await sourceNotes.all()) expect(await note.locator("a").count()).toBeGreaterThan(0);
        const indistinguishableLinks = await page.locator("#sources-and-scope ol a, .lesson-section > p > em a").evaluateAll(links =>
          links.filter(link => link.protocol !== "https:" || !getComputedStyle(link).textDecorationLine.includes("underline")).map(link => link.textContent),
        );
        expect(indistinguishableLinks, "Sources use HTTPS and have visible link underlines").toEqual([]);
        const figures = page.locator("figure.marketplace-diagram");
        await expect(figures).toHaveCount(diagramKinds.length);
        for (const [index, kind] of diagramKinds.entries()) {
          const figure = figures.nth(index);
          await expect(figure).toHaveAttribute("data-diagram", kind);
          await figure.scrollIntoViewIfNeeded();
          await expect(figure.locator("svg")).toHaveAttribute("aria-hidden", "true");
          const region = figure.getByRole("region");
          await expect(region).toHaveAccessibleName(await figure.locator("figcaption").textContent());
          // The graph uses real text, with non-overlapping nodes, rather than
          // raster labels that become inaccessible or unreadable when zoomed.
          const overlaps = await figure.locator(".marketplace-node").evaluateAll((nodes) => {
            const bounds = nodes.map(node => ({ id: node.dataset.node, rect: node.getBoundingClientRect() }));
            return bounds.flatMap((a, i) => bounds.slice(i + 1).filter(b =>
              Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left) > 1 &&
              Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top) > 1,
            ).map(b => `${a.id}/${b.id}`));
          });
          expect(overlaps, `${kind}: node overlap`).toEqual([]);
          const outsideCanvas = await figure.locator(".marketplace-diagram-map").evaluate(map => {
            const bounds = map.getBoundingClientRect();
            return [...map.querySelectorAll(".marketplace-node")].filter(node => {
              const rect = node.getBoundingClientRect();
              return rect.left < bounds.left - 1 || rect.right > bounds.right + 1 ||
                rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1;
            }).map(node => node.dataset.node);
          });
          expect(outsideCanvas, `${kind}: nodes remain inside the diagram canvas`).toEqual([]);
          const summary = figure.locator("summary");
          await summary.focus();
          await page.keyboard.press("Shift+Tab");
          await expect(region).toBeFocused();
          if (await region.evaluate((element) => element.scrollWidth > element.clientWidth)) {
            await page.keyboard.press("ArrowRight", { delay: 100 });
            await expect.poll(() => region.evaluate((element) => element.scrollLeft), { message: `${kind}, ${theme}: keyboard scrolling` }).toBeGreaterThan(0);
          }
          await summary.focus();
          await page.keyboard.press("Enter");
          await expect(figure.locator("details")).toHaveAttribute("open", "");
          await expect(figure.locator("details ol li").first()).toBeVisible();
          await page.keyboard.press("Enter");
          await region.evaluate(element => { element.scrollLeft = 0; });
          await figure.screenshot({ path: testInfo.outputPath(`marketplace-${kind}-${theme}.png`), style: ".site-header { visibility: hidden !important; }" });
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(await page.locator("astro-island").count()).toBe(0);
        await page.locator(".lesson-header").screenshot({ path: testInfo.outputPath(`marketplace-opening-${theme}.png`) });
      }
    } finally {
      await context.close();
    }
  });
}
