import { test, expect } from "@playwright/test";

test("homepage and algorithms route load", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toContainText(
    /build the systems behind ai-powered growth/i,
  );

  await page.goto("/algorithms");
  await expect(
    page.getByRole("heading", { name: /algorithms inside marketing agents/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /binary search/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Control" }).click();
  await expect(
    page.getByRole("button", { name: /approval state machine/i }),
  ).toBeVisible();

  await page.goto("/patterns");
  await expect(
    page.getByRole("heading", { name: /agent control plane/i }),
  ).toBeVisible();
  await expect(page.locator("main")).toContainText(/approval gates/i);
});

test("five tracks connect to the existing labs and preserve deep links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const navigation = page.locator(".desktop-navigation");
  for (const [label, title] of [
    ["System design", "Platforms & System Design"],
    ["Algorithms & data", "Algorithms & Data"],
    ["Software & production", "Software Design & Production"],
    ["Measurement & ML", "Measurement & ML"],
    ["AI engineering", "AI Engineering & Harnesses"],
  ]) {
    await navigation.getByRole("link", { name: label, exact: true }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: title, exact: true }),
    ).toBeVisible();
    await expect(
      navigation.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "page");
  }
  await navigation
    .getByRole("link", { name: "Algorithms & data", exact: true })
    .click();
  await page
    .locator(".algorithm-index-list")
    .getByRole("link", { name: /Dijkstra/ })
    .click();
  await expect(page).toHaveURL(/algorithm=dijkstra#visualizer/);
  await expect(
    page.getByRole("heading", { name: "Dijkstra", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Circular Buffer/ }).click();
  await expect(
    page.getByRole("heading", { name: "Circular Buffer", exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Dijkstra", exact: true }),
  ).toBeVisible();
  await page.goto("/algorithms?algorithm=tokenBucket#visualizer");
  await expect(page).toHaveURL(
    /learn\/algorithms\/visualizers\?algorithm=tokenBucket#visualizer/,
  );
  await expect(
    page.getByRole("heading", { name: "Token Bucket", exact: true }),
  ).toBeVisible();
  await page.goto("/learn/algorithms/visualizers?algorithm=unknown");
  await expect(
    page.getByRole("heading", { name: "Binary Search", exact: true }),
  ).toBeVisible();
});

test("all visualizers retain step controls and practical context in both themes", async ({
  page,
}) => {
  await page.goto("/learn/algorithms/visualizers#visualizer");
  const names = [
    "Binary Search",
    "BFS",
    "DFS",
    "Rabin-Karp",
    "Heap",
    "Topological Sort",
    "Bloom Filter",
    "Circular Buffer",
    "Dijkstra",
    "Union-Find",
    "Approval State Machine",
    "Token Bucket",
    "Lease-Locked Queue",
    "RBAC / ABAC Permission Graph",
    "Audit Hash Chain",
  ];
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.getByRole("button", { name: "Switch to light mode" }).click();
    for (const name of names) {
      await page
        .locator(".algorithm-list")
        .getByText(name, { exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name, exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expect(page.locator(".step-meter span").first()).toHaveText("2");
      await page.getByRole("button", { name: "Context", exact: true }).click();
      await expect(
        page.getByText("Why it exists", { exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Run", exact: true }).click();
      await page.getByRole("button", { name: "Reset", exact: true }).click();
      await expect(page.locator(".step-meter span").first()).toHaveText("1");
    }
  }
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.locator(".step-meter span").first()).toHaveText("2");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
});

test("mobile navigation, theme persistence, keyboard escape and responsive reflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.locator("summary").click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-navigation")).not.toHaveAttribute("open");
  await expect(page.locator("summary")).toBeFocused();
  await page.locator("summary").click();
  await page
    .locator(".mobile-menu")
    .getByRole("link", { name: "AI engineering", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { level: 1, name: "AI Engineering & Harnesses" }),
  ).toBeVisible();
  await expect(page.locator(".mobile-navigation")).not.toHaveAttribute("open");
  for (const width of [320, 390, 640, 768, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/learn/system-design",
      "/learn/algorithms",
      "/learn/software-production",
      "/learn/measurement-ml",
      "/learn/ai-engineering",
      "/learn/algorithms/visualizers",
      "/patterns",
      "/examples",
    ]) {
      await page.goto(route);
      const sizes = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(sizes.scroll, `${route} at ${width}px`).toBeLessThanOrEqual(
        sizes.width + 1,
      );
    }
  }
});

for (const width of [390, 1440]) {
  test(`reference rows keep index, prose and separators at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/algorithms", "/patterns", "/examples"]) {
      await page.goto(route);
      const rows = page.locator(".manual-list .manual-row");
      for (let index = 0; index < 2; index++) {
        const row = rows.nth(index);
        const geometry = await row.evaluate((element) => {
          const number = element
            .querySelector(".manual-index")
            .getBoundingClientRect();
          const body = element
            .querySelector(".manual-body")
            .getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            indexRight: number.right,
            indexTop: number.top,
            bodyLeft: body.left,
            bodyTop: body.top,
            paddingTop: parseFloat(style.paddingTop),
            paddingBottom: parseFloat(style.paddingBottom),
            separator: parseFloat(style.borderBottomWidth),
            proseTransform: getComputedStyle(
              element.querySelector(".manual-body p"),
            ).textTransform,
          };
        });
        expect(
          geometry.bodyLeft,
          `${route}: index beside content`,
        ).toBeGreaterThan(geometry.indexRight + 10);
        expect(
          Math.abs(geometry.indexTop - geometry.bodyTop),
          `${route}: row alignment`,
        ).toBeLessThan(8);
        expect(
          geometry.paddingTop,
          `${route}: breathing room above`,
        ).toBeGreaterThanOrEqual(16);
        expect(
          geometry.paddingBottom,
          `${route}: breathing room below`,
        ).toBeGreaterThanOrEqual(16);
        expect(geometry.separator, `${route}: row separator`).toBeGreaterThan(
          0,
        );
        expect(geometry.proseTransform, `${route}: readable prose`).toBe(
          "none",
        );
      }
    }
  });
}

test("repeated navigation returns to the same tracks anchor", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const tracksHeading = page.getByRole("heading", {
    name: "Five tracks. One connected practice.",
  });
  await page
    .getByRole("link", { name: "Explore the tracks", exact: true })
    .click();
  await expect(page).toHaveURL(/\/#tracks$/);
  await expect(tracksHeading).toBeInViewport();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(tracksHeading).not.toBeInViewport();
  await page
    .locator("footer")
    .getByRole("link", { name: "Learning tracks", exact: true })
    .click();
  await expect(page).toHaveURL(/\/#tracks$/);
  await expect(tracksHeading).toBeInViewport();
});

test("algorithm query changes preserve the working area position", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/learn/algorithms/visualizers");
  const introduction = page.getByRole("heading", { level: 1 });
  await page.locator("#visualizer").scrollIntoViewIfNeeded();
  await expect(introduction).not.toBeInViewport();
  await page
    .getByRole("button", { name: "BFS Site crawler by depth", exact: true })
    .click();
  await expect(page).toHaveURL(/algorithm=bfs$/);
  await expect(
    page.getByRole("heading", { name: "BFS", exact: true }),
  ).toBeInViewport();
  await expect(introduction).not.toBeInViewport();
});

for (const hash of ["", "#visualizer"]) {
  test(`reselecting the active visualizer preserves scroll and history ${hash || "without an anchor"}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/learn/algorithms/visualizers?algorithm=bfs${hash}`);
    const active = page.getByRole("button", {
      name: "BFS Site crawler by depth",
      exact: true,
    });
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.locator(".step-meter span").first()).toHaveText("2");
    await active.scrollIntoViewIfNeeded();
    await page.evaluate(() =>
      window.scrollBy({ top: 80, behavior: "instant" }),
    );
    await active.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => ({
      scroll: window.scrollY,
      history: window.history.length,
      url: window.location.href,
    }));
    expect(before.scroll).toBeGreaterThan(100);
    await active.click();
    await expect(page.locator(".step-meter span").first()).toHaveText("1");
    const after = await page.evaluate(() => ({
      scroll: window.scrollY,
      history: window.history.length,
      url: window.location.href,
    }));
    expect(after.url).toBe(before.url);
    expect(after.history).toBe(before.history);
    expect(Math.abs(after.scroll - before.scroll)).toBeLessThanOrEqual(1);
  });
}
