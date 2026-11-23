import { test, expect } from "@playwright/test";

const route = "/learn/system-design/advertising-platforms";
const kinds = ["auction", "budget", "delivery", "clocks", "incrementality"];

async function deliveryLayoutProblems(figure) {
  return figure.locator(".marketplace-diagram-map").evaluate(map => {
    const bounds = map.getBoundingClientRect();
    const nodes = [...map.querySelectorAll("[data-node]")];
    return nodes.flatMap((node, index) => {
      const a = node.getBoundingClientRect(), result = [];
      if (a.left < bounds.left - 1 || a.right > bounds.right + 1 || a.top < bounds.top - 1 || a.bottom > bounds.bottom + 1) result.push(node.dataset.node + " outside canvas");
      for (const child of node.children) {
        const content = child.getBoundingClientRect();
        if (content.left < a.left || content.right > a.right || content.top < a.top || content.bottom > a.bottom) result.push(node.dataset.node + " clipped text");
      }
      for (const other of nodes.slice(index + 1)) {
        const b = other.getBoundingClientRect();
        if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) result.push(node.dataset.node + "/" + other.dataset.node);
      }
      return result;
    });
  });
}

for (const width of [320, 768, 1440]) {
  test(`reviewed platform lesson remains readable without JavaScript at ${width}px`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 1000 } });
    try {
      const page = await context.newPage();
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("How Advertising Platforms Work");
      await expect(page.locator("main")).not.toContainText(/\[S\d+\]|not approved for publication|Phase 6/);
      for (const id of ["start-with-the-user", "map-the-system", "platform-landscape", "from-report-to-integration", "first-platform", "what-to-check-before-using-a-report"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
      await expect(page.locator("math")).toHaveCount(4);
      await expect(page.locator('[data-equation="contribution"] math')).toHaveText("0.05×£60=£3");
      await expect(page.locator('[data-equation="ranking"] math')).toHaveText("Si=biqi");
      await expect(page.locator("main")).not.toContainText("kind ===");
      await expect(page.locator(".platform-sources li")).toHaveCount(11);
      await expect(page.locator("astro-island")).toHaveCount(0);
      await expect(page.locator("[data-platform-visual] form")).toHaveCount(0);
      for (const equation of await page.locator(".lesson-equation").all()) {
        await equation.focus();
        await expect(equation).toBeFocused();
        if (await equation.evaluate(el => el.scrollWidth > el.clientWidth)) {
          await page.keyboard.press("ArrowRight", { delay: 100 });
          await expect.poll(() => equation.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
        }
      }
      for (const theme of ["light", "dark"]) {
        await page.locator("html").evaluate((html, value) => { html.dataset.theme = value; }, theme);
        for (const kind of kinds) {
          const figure = page.locator(`[data-platform-visual="${kind}"]`);
          await expect(figure).toBeVisible();
          const summaries = figure.locator("summary");
          for (const summary of await summaries.all()) {
            await summary.focus();
            await page.keyboard.press("Enter");
            expect(await summary.evaluate(el => el.parentElement.open)).toBe(true);
            await page.keyboard.press("Enter");
          }
          for (const region of await figure.getByRole("region").all()) {
            await region.focus();
            await expect(region).toBeFocused();
            if (await region.evaluate(el => el.scrollWidth > el.clientWidth)) {
              await page.keyboard.press("ArrowRight", { delay: 100 });
              await expect.poll(() => region.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
              await region.evaluate(el => { el.scrollLeft = 0; });
            }
          }
          if (kind === "delivery") {
            expect(await deliveryLayoutProblems(figure)).toEqual([]);
          }
          await figure.screenshot({ path: testInfo.outputPath(`platform-${kind}-${theme}-${width}.png`), style: ".site-header { visibility: hidden !important; }" });
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    } finally { await context.close(); }
  });
}

for (const width of [320, 1440]) {
  test(`delivery diagram grows with 200% text without JavaScript at ${width}px`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 1000 } });
    try {
      const page = await context.newPage();
      await page.goto(route);
      await page.locator("html").evaluate(html => { html.style.fontSize = "32px"; });
      const figure = page.locator('[data-platform-visual="delivery"]');
      for (const theme of ["light", "dark"]) {
        await page.locator("html").evaluate((html, value) => { html.dataset.theme = value; }, theme);
        expect(await deliveryLayoutProblems(figure)).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await figure.screenshot({ path: testInfo.outputPath(`delivery-200-percent-${theme}-${width}.png`), style: ".site-header { visibility: hidden !important; }" });
      }
    } finally { await context.close(); }
  });
}

test("enhancement keeps reading results visible with simulator controls closed", async ({ page }) => {
  await page.goto(route);
  await expect(page.locator("[data-simulator]")).toHaveCount(4);
  for (const simulator of ["auction", "pacing", "budget", "clocks"]) {
    const form = page.locator(`[data-simulator="${simulator}"]`);
    const reading = page.locator(`[data-${simulator}-result]`);
    await expect(reading).toBeVisible();
    expect(await reading.evaluate(el => el.closest("details"))).toBeNull();
    const baseline = await reading.textContent();
    await expect(reading).not.toHaveAttribute("role", "status");
    const details = form.locator("..");
    const summary = details.locator("summary");
    await summary.click();
    await expect(reading).toBeVisible();
    await expect(reading).toHaveText(baseline);
    const submit = form.locator('button[type="submit"]');
    await submit.press("Enter");
    await expect(submit).toBeFocused();
    const feedback = form.getByRole("status", { includeHidden: true });
    await expect(feedback).toHaveText(await reading.textContent());
    await expect(reading).toBeVisible();
    await summary.click();
    await expect(feedback).toBeHidden();
    await expect(reading).toBeVisible();
    await expect(reading).toHaveText(await feedback.textContent());
  }
});

test("small-phone submissions show feedback beside the focused controls", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(route);
  for (const [kind, simulator, summary, button] of [
    ["auction", "auction", "Change the auction inputs", "Update auction"],
    ["budget", "pacing", "Change the pacing assumptions", "Compare pacing policies"],
    ["budget", "budget", "Compare reservation strategies and a worker failure", "Run reservation example"],
    ["clocks", "clocks", "Inspect reporting dates and observations", "Inspect observation"],
  ]) {
    const figure = page.locator(`[data-platform-visual="${kind}"]`);
    await figure.getByText(summary, { exact: true }).click();
    const form = figure.locator(`[data-simulator="${simulator}"]`);
    if (simulator === "clocks") await form.getByLabel("Wednesday after ingestion", { exact: true }).check();
    if (simulator === "auction") await form.locator('[name="eligible-0"]').uncheck();
    const submit = form.getByRole("button", { name: button, exact: true });
    await submit.focus();
    // Reproduce submitting with the control at the foot of a short viewport.
    await submit.evaluate(el => window.scrollBy(0, el.getBoundingClientRect().bottom - innerHeight + 16));
    await submit.press("Enter");
    await expect(submit).toBeFocused();
    const result = form.getByRole("status");
    await expect(result).toHaveAttribute("role", "status");
    expect(await result.evaluate(el => el.previousElementSibling?.classList.contains("platform-actions"))).toBe(true);
    await expect.poll(async () => result.evaluate(el => {
      const status = el.getBoundingClientRect();
      const control = el.previousElementSibling.querySelector('button[type="submit"]').getBoundingClientRect();
      const header = document.querySelector(".site-header").getBoundingClientRect();
      return control.top >= header.bottom && control.bottom <= innerHeight && status.top >= control.bottom && status.top + parseFloat(getComputedStyle(el).lineHeight) <= innerHeight;
    })).toBe(true);
    if (simulator === "auction") await expect(result).toContainText("Competitor A wins");
    if (simulator === "clocks") await expect(result).toContainText("11 attributed purchases");
    await page.screenshot({ path: testInfo.outputPath(`${simulator}-feedback-320x568.png`) });
  }
});

test("native controls preserve the auction, budget and reporting boundaries", async ({ page }) => {
  await page.goto(route);
  const auction = page.locator('[data-platform-visual="auction"]');
  await auction.getByText("Change the auction inputs", { exact: true }).click();
  const form = auction.locator("form");
  await form.locator('[name="bid-0"]').fill("2");
  await form.locator('[name="quality-0"]').fill("1");
  await form.locator('[name="bid-1"]').fill("2");
  await form.locator('[name="quality-1"]').fill("1");
  await form.locator('[name="quality-2"]').fill("0");
  const update = form.getByRole("button", { name: "Update auction" });
  await update.press("Enter");
  await expect(update).toBeFocused();
  await expect(auction.getByRole("status")).toContainText("Equal top scores");
  await expect(auction.getByRole("status")).toContainText("Our retailer wins");
  await form.locator('[name="eligible-0"]').uncheck();
  await update.press("Enter");
  await expect(auction.getByRole("status")).toContainText("Competitor A wins");
  await form.locator('[name="eligible-1"]').uncheck();
  await form.locator('[name="eligible-2"]').uncheck();
  await update.press("Enter");
  await expect(auction.getByRole("status")).toContainText("No candidate");
  await form.getByRole("button", { name: "Reset auction" }).press("Enter");
  await expect(auction.getByRole("status")).toContainText("Our retailer wins with a score of 1.80");

  const budget = page.locator('[data-platform-visual="budget"]');
  await budget.getByText("Change the pacing assumptions", { exact: true }).click();
  const pacing = budget.locator('[data-simulator="pacing"]');
  await pacing.locator('[name="morning"]').fill("10");
  await pacing.locator('[name="evening"]').fill("1");
  await pacing.getByLabel("Follow the forecast", { exact: true }).check();
  await pacing.getByRole("button", { name: "Compare pacing policies" }).press("Enter");
  await expect(budget.locator("[data-pacing-result]")).toContainText("82.0");
  await expect(budget.locator('[data-pacing-policy="forecast"] [data-morning]')).toHaveText("£800.00");
  await pacing.locator('[name="morning"]').fill("101");
  await pacing.getByRole("button", { name: "Compare pacing policies" }).click();
  expect(await pacing.locator('[name="morning"]').evaluate(el => el.validity.rangeOverflow)).toBe(true);
  await expect(budget.locator("[data-pacing-result]")).toContainText("82.0");
  await pacing.getByRole("button", { name: "Reset pacing" }).click();
  await expect(budget.locator("[data-pacing-result]")).toContainText("35.0");

  await budget.getByText("Compare reservation strategies and a worker failure", { exact: true }).click();
  const reservation = budget.locator('[data-simulator="budget"]');
  await reservation.getByLabel("Atomic reservation", { exact: true }).check();
  await reservation.getByLabel("Worker A fails before reconciliation").check();
  await reservation.getByRole("button", { name: "Run reservation example" }).press("Enter");
  await expect(budget.locator("[data-budget-result]")).toContainText("retain its £8 commitment");
  await expect(budget.locator('[data-worker="1"] [data-committed]')).toHaveText("£0.00");
  await reservation.getByLabel("£5 preallocated allowances", { exact: true }).check();
  await reservation.getByRole("button", { name: "Run reservation example" }).press("Enter");
  await expect(budget.locator("[data-budget-result]")).toContainText("stranded");
  await expect(budget.locator("[data-budget-result]")).toContainText("Billable charges remain unknown");
  await expect(budget.locator('[data-worker="0"] [data-committed]')).toHaveText("£0.00");

  const clocks = page.locator('[data-platform-visual="clocks"]');
  await clocks.getByText("Inspect reporting dates and observations", { exact: true }).click();
  const clockForm = clocks.locator("form");
  await clockForm.getByLabel("Conversion date", { exact: true }).check();
  await clockForm.getByLabel("Wednesday after ingestion", { exact: true }).check();
  await clockForm.getByRole("button", { name: "Inspect observation" }).press("Enter");
  await expect(clocks.getByRole("status")).toContainText("selected rule: Tuesday");
  await expect(clocks.getByRole("status")).toContainText("11 attributed purchases");
  await clockForm.locator('[name="correction"]').check();
  await clockForm.getByRole("button", { name: "Inspect observation" }).press("Enter");
  await expect(clocks.getByRole("status")).toContainText("10 attributed purchases");
  await clockForm.getByLabel("Tuesday morning", { exact: true }).check();
  await clockForm.getByRole("button", { name: "Inspect observation" }).press("Enter");
  await expect(clocks.getByRole("status")).toContainText("8 attributed purchases");
  await expect(clocks.getByRole("status")).toContainText("correction has not occurred");
  await expect(page.locator("astro-island")).toHaveCount(0);
});

test("an unavailable enhancement leaves complete static explanations", async ({ page }) => {
  await page.route(/PlatformEnhancements.*\.js/, route => route.abort());
  await page.goto(route);
  await expect(page.locator('[data-platform-visual] form')).toHaveCount(0);
  await expect(page.locator('[data-platform-visual="auction"] [data-auction-result]')).toContainText("Our retailer wins");
  await expect(page.locator('[data-platform-visual="clocks"]')).toContainText("conversion-date totals");
  for (const kind of kinds) await expect(page.locator(`[data-platform-visual="${kind}"]`)).toBeVisible();
});
