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
    if (label !== "System design") {
      await page.getByRole("link", { name: "Follow the ChatGPT Ads workflow" }).click();
      await expect(page.getByRole("heading", { name: "One platform across five tracks" })).toBeInViewport();
    }
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
    .getByRole("link", { name: "Engineering tracks", exact: true })
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

test("the guide is readable as static HTML without JavaScript", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(10000);
  try {
    await page.goto("http://127.0.0.1:4173/learn/system-design/api-design");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "API design for advertising systems",
      }),
    ).toBeVisible();
    await expect(page).toHaveTitle(
      "API design for advertising systems · Harness · AI Knowledge Hub",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://harness.ai-knowledge-hub.org/learn/system-design/api-design",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    await expect(page.locator(".lesson-code code")).toContainText(
      '"sample-account"',
    );
    await page
      .getByRole("navigation", { name: "Guide contents" })
      .getByRole("link", { name: /Define the contract/ })
      .click();
    await expect(
      page.getByRole("heading", { name: "Define the contract", exact: true }),
    ).toBeInViewport();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.locator(".lesson-mobile-contents summary").click();
    await page
      .getByRole("navigation", { name: "Guide contents" })
      .getByRole("link", { name: /Make failures useful/ })
      .click();
    await expect(
      page.getByRole("heading", { name: "Make failures useful", exact: true }),
    ).toBeInViewport();
    const sitemap = await request.get("/sitemap.xml");
    const sitemapText = await sitemap.text();
    expect(sitemapText).toContain(
      "https://harness.ai-knowledge-hub.org/learn/system-design",
    );
    expect(sitemapText).not.toContain(
      "/learn/system-design/api-design",
    );
    for (const [slug, title] of [
      ["advertising-platforms", "How advertising platforms work"],
      ["chatgpt-ads", "ChatGPT Ads: a system introduction"],
    ]) {
      await page.goto(`http://127.0.0.1:4173/learn/system-design/${slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
      await expect(page.locator(".source-citation").first()).toBeVisible();
      await expect(page.locator(".lesson-next")).toHaveCount(0);
      expect(sitemapText).toContain(`/learn/system-design/${slug}`);
      if (slug === "chatgpt-ads") {
        await expect(page.getByRole("region", { name: "Architecture diagram" })).toBeVisible();
        await expect(page.locator('.ads-node[data-node="worker"]')).toContainText("Harness · proposed");
        await expect(page.locator(".ads-stage-copy")).toHaveCount(5);
        await expect(page.getByRole("button", { name: "Show complete diagram" })).toHaveCount(0);
      }
    }
  } finally {
    await context.close().catch(() => {});
  }
});

test("the architecture walkthrough preserves stages, evidence labels and delivery outcomes", async ({ page }) => {
  await page.goto("/learn/system-design/chatgpt-ads#visual-deep-dive");
  const walkthrough = page.locator(".ads-deep-dive");
  const worker = walkthrough.locator('[data-node="worker"]');
  await expect(walkthrough.getByRole("button", { name: "Previous", exact: true })).toBeDisabled();
  await expect(walkthrough.getByRole("status")).toHaveText("Stage 1 of 5");
  await expect(worker).toHaveCount(0);
  for (let stage = 2; stage <= 5; stage++) {
    await walkthrough.getByRole("button", { name: "Next", exact: true }).click();
    await expect(walkthrough.locator(".ads-step-actions [role=status]")).toHaveText(`Stage ${stage} of 5`);
    if (stage === 3) {
      const edge = (from, to) => walkthrough.locator(`path[data-from="${from}"][data-to="${to}"]`);
      await expect(edge("display", "client")).toHaveCSS("opacity", "1");
      await expect(edge("display", "late")).toHaveCSS("opacity", "0.18");
      await walkthrough.getByLabel("Illustrative delivery outcome").selectOption("late");
      await expect(walkthrough.locator(".ads-delivery-example [role=status]")).toContainText("No ad is shown");
      await expect(edge("checks", "bundle")).toHaveCSS("opacity", "1");
      await expect(edge("bundle", "display")).toHaveCSS("opacity", "1");
      await expect(edge("display", "late")).toHaveCSS("opacity", "1");
      await expect(edge("checks", "no-ad")).toHaveCSS("opacity", "0.18");
      await expect(edge("display", "client")).toHaveCSS("opacity", "0.18");
      await walkthrough.getByLabel("Illustrative delivery outcome").selectOption("ineligible");
      await expect(walkthrough.locator(".ads-delivery-example [role=status]")).toContainText("final check rejects");
      await expect(edge("checks", "no-ad")).toHaveCSS("opacity", "1");
      await expect(edge("checks", "bundle")).toHaveCSS("opacity", "0.18");
      await expect(edge("bundle", "display")).toHaveCSS("opacity", "0.18");
      await expect(edge("display", "late")).toHaveCSS("opacity", "0.18");
    }
    if (stage < 5) await expect(worker).toHaveCount(0);
  }
  await expect(worker).toContainText("Harness · proposed");
  await expect(worker).toHaveCSS("border-top-style", "dashed");
  await expect(walkthrough.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
  await walkthrough.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(worker).toHaveCount(0);
  const tools = walkthrough.getByRole("button", { name: /Stage 2:/ });
  await tools.focus();
  await page.keyboard.press("Enter");
  await expect(tools).toHaveAttribute("aria-current", "step");
  await walkthrough.getByRole("button", { name: "Show complete diagram" }).click();
  await expect(walkthrough.locator(".ads-stage-copy")).toHaveCount(5);
  await expect(worker).toBeVisible();
  expect(await walkthrough.locator(".ads-connection").evaluateAll((paths) =>
    paths.every((path) => ["marker-start", "marker-end"].every((name) => {
      const reference = path.getAttribute(name);
      return !reference || Boolean(document.getElementById(reference.slice(5, -1)));
    })),
  )).toBe(true);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(worker).toHaveCSS("animation-name", "none");
  await expect(walkthrough.getByRole("region", { name: "Architecture diagram" })).toHaveAttribute("tabindex", "0");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await walkthrough.getByRole("button", { name: "Return to staged view" }).click();
  await expect(tools).toHaveAttribute("aria-current", "step");
  await expect(worker).toHaveCount(0);
});

test("guide navigation, hydration, saved theme and metadata stay coherent", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydrat|minified React error/i.test(message.text())
    )
      errors.push(message.text());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page
    .locator(".desktop-navigation")
    .getByRole("link", { name: "System design", exact: true })
    .click();
  await page
    .getByRole("link", {
      name: /Platform overview.*How advertising platforms work/,
    })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("How advertising platforms work");
  await page.getByRole("link", { name: "ChatGPT Ads: a system introduction", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ChatGPT Ads: a system introduction");
  await page.getByRole("link", { name: "API design for advertising systems", exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/system-design\/api-design$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "API design for advertising systems",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /bounded reporting contract/,
  );
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Switch to dark mode" }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByText("Planned build", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open the build", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("complementary", { name: "Supporting case study" }).getByRole("link", {
      name: "Should You Test ChatGPT Ads Before Christmas?",
      exact: true,
    }),
  ).toHaveAttribute(
    "href",
    "https://ai-knowledge-hub.org/library/chatgpt-ads-christmas-pilot/",
  );
  expect((await page.locator(".lesson-header, .lesson-section, .lesson-next").allTextContents()).join(" "))
    .not.toMatch(/Christmas|holiday/i);
  await page
    .getByRole("navigation", { name: "Guide contents" })
    .getByRole("link", { name: /Connect it to ChatGPT Ads/ })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Connect it to ChatGPT Ads",
      exact: true,
    }),
  ).toBeInViewport();
  expect(errors).toEqual([]);
});

test("guide content reflows in both themes with usable mobile contents", async ({
  page,
}) => {
  const routes = ["system-design", "algorithms", "software-production", "measurement-ml", "ai-engineering"]
    .map((track) => `/learn/${track}`)
    .concat(["advertising-platforms", "chatgpt-ads", "api-design"].map((slug) => `/learn/system-design/${slug}`));
  await page.goto(routes[0]);
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.getByRole("button", { name: "Switch to light mode" }).click();
    for (const route of routes) {
      await page.goto(route);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const sizes = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(sizes.scroll, `${route}: ${theme} at ${width}px`).toBeLessThanOrEqual(
        sizes.width + 1,
      );
    }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".lesson-mobile-contents summary").click();
  await page
    .locator(".lesson-mobile-contents")
    .getByRole("link", { name: /Define the contract/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Define the contract", exact: true }),
  ).toBeInViewport();
});
