import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:4173").origin;
const sampleCount = 5;
const observeMs = 1_000;
const profile = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};
const cpuRate = 4;
const network = {
  offline: false,
  latency: 150,
  downloadThroughput: 1_600_000 / 8,
  uploadThroughput: 750_000 / 8,
};
const routes = [
  { path: "/", heading: /build and operate ai products/i },
  {
    path: "/learn/system-design/api-design",
    heading: "API design principles",
  },
  {
    path: "/learn/system-design/chatgpt-ads",
    heading: "How ChatGPT Ads works",
    controls: "#visual-deep-dive",
    afterNext: (page) => page.getByText("Stage 2 of 5", { exact: true }),
  },
  {
    path: "/learn/algorithms/visualizers",
    heading: "Algorithms inside marketing agents",
    controls: "#visualizer",
    afterNext: (page) => page.locator("#visualizer .step-meter").getByText("2", { exact: true }),
  },
];

async function scriptBytes(page, responses) {
  const external = await Promise.all(
    [...responses.values()].map(async (response) => gzipSync(await response.body()).length),
  );
  const inline = await page.locator(
    'script:not([src]):is(:not([type]), [type=""], [type="module"], [type="text/javascript"], [type="application/javascript"])',
  ).allTextContents();
  const inlineBytes = inline.filter((text) => text.trim()).reduce(
    (total, text) => total + gzipSync(text).length,
    0,
  );
  return external.reduce((total, bytes) => total + bytes, inlineBytes);
}

async function measure(browser, route, sample) {
  const context = await browser.newContext({ ...profile, serviceWorkers: "block" });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(10_000);
    const session = await context.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    await session.send("Network.emulateNetworkConditions", network);
    await session.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
    await page.addInitScript(() => {
      new PerformanceObserver((list) => {
        window.baselineLcp = list.getEntries().at(-1)?.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });

    const responses = new Map();
    page.on("response", (response) => {
      const url = new URL(response.url());
      const contentType = response.headers()["content-type"] ?? "";
      if (
        url.origin === origin &&
        response.ok() &&
        (response.request().resourceType() === "script" || /\b(?:java|ecma)script\b/i.test(contentType))
      ) {
        responses.set(response.url(), response);
      }
    });
    const documentResponse = await page.goto(origin + route.path, { waitUntil: "load" });
    if (!documentResponse?.ok()) throw new Error(`Failed to load ${route.path}`);
    await page.getByRole("heading", { level: 1, name: route.heading }).waitFor();
    await page.waitForTimeout(observeMs);
    const timing = await page.evaluate(() => ({
      fcpMs: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
      lcpMs: window.baselineLcp,
    }));
    if (!Number.isFinite(timing.fcpMs) || !Number.isFinite(timing.lcpMs)) {
      throw new Error(`Missing paint timing for ${route.path}`);
    }
    const initialJsGzipBytes = await scriptBytes(page, responses);
    let jsGzipBytesThroughNext = null;
    if (route.controls) {
      const controls = page.locator(route.controls);
      await controls.scrollIntoViewIfNeeded();
      await controls.getByRole("button", { name: "Next", exact: true }).click();
      await route.afterNext(page).waitFor();
      jsGzipBytesThroughNext = await scriptBytes(page, responses);
    }
    return {
      route: route.path,
      sample,
      fcpMs: Math.round(timing.fcpMs),
      lcpMs: Math.round(timing.lcpMs),
      initialJsGzipBytes,
      jsGzipBytesThroughNext,
    };
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch();
try {
  const results = [];
  for (let sample = 1; sample <= sampleCount; sample += 1) {
    for (const route of routes) {
      results.push(await measure(browser, route, sample));
    }
  }
  console.log(JSON.stringify({
    chromium: browser.version(),
    node: process.version,
    profile,
    cpuRate,
    network,
    observeMs,
    sampleCount,
    results,
  }, null, 2));
} finally {
  await browser.close();
}
