import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";

const route = "/learn/system-design/chatgpt-ads";
const kinds = ["intent", "orchestration", "independence", "delivery", "diagnostics"];
const baseline = JSON.parse(await readFile(new URL("../fixtures/reading-baseline.json", import.meta.url), "utf8"));

for (const width of [320, 768, 1440]) {
  test(`reviewed ChatGPT Ads copy and five visuals remain readable without JavaScript at ${width}px`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 1000 } });
    try {
      const page = await context.newPage();
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("How ChatGPT Ads Works");
      await expect(page.locator(".lesson-section > h2").filter({ hasText: /^[1-7]\. / })).toHaveCount(7);
      const mobileContents = page.locator(".lesson-mobile-contents");
      const mobileContentsVisible = await mobileContents.isVisible();
      if (mobileContentsVisible) await mobileContents.locator("summary").click();
      for (const contents of await page.locator('nav[aria-label="Guide contents"]').all()) {
        if (await contents.isVisible()) {
          await expect(contents.locator('a[href="#conversation-intent"]')).toHaveAccessibleName("A conversation is not a search query");
          await expect(contents.locator('a[href="#advertiser-controls"]')).toHaveAccessibleName("What advertisers can actually control and verify");
        }
        await expect(contents.locator("a > span")).toHaveText(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"]);
        for (const label of await contents.locator("a").allTextContents()) expect(label).not.toMatch(/^\d{2}[1-7]\.\s/);
      }
      if (mobileContentsVisible) await mobileContents.locator("summary").click();
      await expect(page.locator("main")).not.toContainText(/Publication approval pending|V4: insert|Reviewed candidate/);
      await expect(page.locator(".cg-controls")).toHaveCount(0);
      await expect(page.locator("astro-island")).toHaveCount(0);
      for (const anchor of baseline.routes[route].ids) await expect(page.locator(`[id="${anchor}"]`)).toHaveCount(1);
      for (const theme of ["light", "dark"]) {
        await page.locator("html").evaluate((element, theme) => { element.dataset.theme = theme; }, theme);
        for (const kind of kinds) {
          const figure = page.locator(`[data-chatgpt-visual="${kind}"]`);
          await expect(figure).toBeVisible();
          // Native disclosures remain operable even when enhancement is absent.
          for (const summary of await figure.locator("summary").all()) {
            await summary.focus();
            const before = await summary.evaluate(element => element.parentElement.open);
            await page.keyboard.press("Enter");
            expect(await summary.evaluate(element => element.parentElement.open)).toBe(!before);
            await page.keyboard.press("Enter");
          }
          await figure.screenshot({ path: testInfo.outputPath(`chatgpt-${kind}-${theme}-${width}.png`), style: ".site-header { visibility: hidden !important; }" });
        }
        for (const equation of await page.locator("[data-cg-equation]").all()) {
          await expect(equation).toHaveAttribute("aria-label", /.+/);
          await equation.focus();
          await expect(equation).toBeFocused();
          expect(await equation.locator("math").getAttribute("aria-label")).toBeTruthy();
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      for (const file of ["architecture-contracts.schema.json", "architecture-examples.json", "README.md"]) {
        const href = `/references/chatgpt-ads/v1/${file}`;
        await expect(page.locator(`.reference-downloads a[href="${href}"]`)).toHaveAttribute("download", "");
        const response = await context.request.get(href);
        expect(response.ok()).toBe(true);
        expect(createHash("sha256").update(await response.body()).digest("hex")).toBe(baseline.downloads[href.slice(1)]);
      }
    } finally { await context.close(); }
  });
}

test("changing intent distinguishes missing history from withdrawn shopping intent", async ({ page }) => {
  await page.goto(route + "#chatgpt-intent");
  const figure = page.locator('[data-chatgpt-visual="intent"]');
  await figure.locator(".cg-controls > summary").click();
  const select = figure.getByLabel("Conversation moment");
  for (const [value, goal] of [["training", "Plan training"], ["weather", "Adapt training"], ["shoes", "Explore replacement"], ["price", "price preference"], ["withdrawn", "Understand injury prevention"], ["missing", "Cannot identify"]]) {
    await select.selectOption(value);
    await expect(figure.locator("[data-intent-goal]")).toContainText(goal);
  }
  await expect(figure.getByRole("status")).toContainText("Missing context");
  await select.selectOption("withdrawn");
  await expect(figure.getByRole("status")).toContainText("Stale context");
  await expect(figure.locator('[data-intent-step][aria-current]')).toHaveCount(0);
});

test("orchestration supports rejection, empty results and revised retrieval without moving pricing into the LLM", async ({ page }) => {
  await page.goto(route + "#chatgpt-orchestration");
  const figure = page.locator('[data-chatgpt-visual="orchestration"]');
  await figure.locator(".cg-controls > summary").click();
  for (const [scenario, count, finalStep, outcome] of [["ineligible", 2, "eligibility", "another country"], ["empty", 1, "retrieve", "no candidates"], ["revised", 6, "context", "revises its queries"], ["rejected", 5, "context", "No placement is sent"], ["eligible", 5, "context", "delivery boundaries"]]) {
    await figure.getByLabel("Candidate scenario").selectOption(scenario);
    for (let i = 1; i < count; i++) await figure.getByRole("button", { name: "Next responsibility" }).press("Enter");
    await expect(figure.locator('[data-tool-step][aria-current="step"]')).toHaveAttribute("data-tool-step", finalStep);
    await expect(figure.getByRole("status")).toContainText(`Responsibility ${count} of ${count}`);
    await expect(figure.locator("[data-result]")).toContainText(outcome);
    await expect(figure.getByRole("button", { name: "Next responsibility" })).toHaveAttribute("aria-disabled", "true");
  }
  await figure.locator('[data-tool-step="auction"] > details > summary').click();
  await expect(figure.locator('[data-tool-step="auction"]')).toContainText("The auction has authority");
});

test("advertising conditions cannot gate the illustrated organic answer", async ({ page }) => {
  await page.goto(route + "#chatgpt-independence");
  const figure = page.locator('[data-chatgpt-visual="independence"]');
  await figure.locator(".cg-controls > summary").click();
  for (const value of ["ready", "slow", "unavailable", "empty"]) {
    await figure.locator(`[name="advertising"][value="${value}"]`).check();
    await expect(figure.locator("[data-organic-answer]")).toHaveText("Available independently of advertising.");
    await expect(figure.getByRole("status")).toContainText("Organic answer: available independently");
  }
});

test("all delivery combinations honor upstream priority and disable irrelevant controls", async ({ page }, testInfo) => {
  await page.goto(route + "#chatgpt-delivery");
  const figure = page.locator('[data-chatgpt-visual="delivery"]');
  for (const server of ["ready", "timeout"]) for (const review of ["pass", "reject"]) for (const arrival of ["on-time", "late"]) {
    await figure.locator('[name="server"][value="ready"]').check();
    await figure.locator('[name="context"][value="pass"]').check();
    await figure.locator(`[name="arrival"][value="${arrival}"]`).check();
    await figure.locator(`[name="context"][value="${review}"]`).check();
    await figure.locator(`[name="server"][value="${server}"]`).check();
    const expected = server === "timeout" ? "timeout" : review === "reject" ? "rejected" : arrival === "late" ? "late" : "on-time";
    await expect(figure).toHaveAttribute("data-outcome", expected);
    if (server === "timeout") await expect(figure.locator("[data-context-controls] input").first()).toBeDisabled();
    else await expect(figure.locator("[data-context-controls] input").first()).toBeEnabled();
    const arrivalDisabled = server === "timeout" || review === "reject";
    if (arrivalDisabled) {
      await expect(figure.locator("[data-arrival-controls] input").first()).toBeDisabled();
      await expect(figure.locator("[data-arrival-note]")).toContainText("irrelevant");
    } else await expect(figure.locator("[data-arrival-controls] input").first()).toBeEnabled();
    await expect(figure.getByRole("status")).toContainText("Organic answer: available independently");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(figure.locator(".cg-feedback")).toHaveCSS("animation-name", "none");
  await figure.screenshot({ path: testInfo.outputPath("chatgpt-delivery-controls-mobile.png"), style: ".site-header { visibility: hidden !important; }" });
});

test("each diagnostic branch offers distinct operational, quality and reporting questions", async ({ page }) => {
  await page.goto(route + "#chatgpt-diagnostics");
  const figure = page.locator('[data-chatgpt-visual="diagnostics"]');
  await figure.locator(".cg-controls > summary").click();
  for (const branch of ["ineligible", "no-retrieval", "empty", "eligibility", "context", "timeout", "late", "displayed"]) {
    await figure.getByLabel("Observed branch").selectOption(branch);
    const messages = new Set();
    for (const lens of ["operations", "quality", "business"]) {
      await figure.locator(`[name="lens"][value="${lens}"]`).check();
      messages.add(await figure.locator("[data-result]").textContent());
      await expect(figure.getByRole("status")).toContainText("Evidence:");
    }
    expect(messages.size).toBe(3);
  }
});

test("failed enhancement preserves the reviewed article, all figures and static outcomes", async ({ page }) => {
  await page.route(/\/_astro\/.*\.js(?:\?|$)/, route => route.abort());
  await page.goto(route);
  await expect(page.locator(".cg-controls")).toHaveCount(0);
  await expect(page.locator("[data-chatgpt-visual]")).toHaveCount(5);
  await expect(page.locator("#delivery-boundaries")).toContainText("Server-side timeout");
  await expect(page.locator("#delivery-boundaries")).toContainText("On-time arrival");
});

test("the first successful responsibility change stays inside the reading script budget", async ({ page }) => {
  const scripts = new Map();
  page.on("response", response => { if (response.request().resourceType() === "script") scripts.set(response.url(), response); });
  await page.goto(route, { waitUntil: "networkidle" });
  const figure = page.locator('[data-chatgpt-visual="orchestration"]');
  await figure.locator(".cg-controls > summary").click();
  await figure.getByRole("button", { name: "Next responsibility" }).click();
  await expect(figure.getByRole("status")).toContainText("Responsibility 2 of 5");
  const sizes = await Promise.all([...scripts.values()].map(async response => gzipSync(await response.body()).length));
  const inline = await page.locator('script:not([src]):is(:not([type]), [type="module"])').allTextContents();
  const bytes = sizes.reduce((a,b) => a+b,0) + inline.filter(text => text.trim()).reduce((sum,text) => sum+gzipSync(text).length,0);
  expect(bytes).toBeLessThanOrEqual(63_477);
  test.info().annotations.push({ type: "script-gzip-bytes", description: String(bytes) });
});
