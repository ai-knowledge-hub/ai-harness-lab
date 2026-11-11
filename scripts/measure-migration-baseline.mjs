import { parseArgs } from "node:util";
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: { route: { type: "string" } },
});
if (positionals.length > 1) throw new Error("Expected one preview origin");
const origin = new URL(positionals[0] ?? "http://127.0.0.1:4173").origin;
const sampleCount = 5;
const paintWindowMs = 5_000;
const scriptWindowMs = 1_000;
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
    controls: "#visual-deep-dive .ads-deep-dive",
    step: (controls, number) => controls.getByRole("status").filter({
      hasText: new RegExp(`^Stage ${number} of 5$`),
    }),
  },
  {
    path: "/learn/algorithms/visualizers",
    heading: "Algorithms inside marketing agents",
    controls: "#visualizer",
    step: (controls, number) => controls.locator(".step-meter span").first().filter({
      hasText: new RegExp(`^${number}$`),
    }),
  },
];
const selectedRoutes = values.route === undefined
  ? routes
  : routes.filter(({ path }) => path === values.route);
if (!selectedRoutes.length) {
  throw new Error(`Unknown --route ${values.route}. Choose ${routes.map(({ path }) => path).join(", ")}`);
}

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

async function withMobilePage(browser, run) {
  const context = await browser.newContext({ ...profile, serviceWorkers: "block" });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(10_000);
    const session = await context.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    await session.send("Network.emulateNetworkConditions", network);
    await session.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
    return await run(page);
  } finally {
    await context.close();
  }
}

async function navigate(page, route, waitUntil) {
  const response = await page.goto(origin + route.path, { waitUntil });
  if (!response?.ok()) throw new Error(`Failed to load ${route.path}`);
}

async function measurePaint(browser, route) {
  return withMobilePage(browser, async (page) => {
    // Include any pending request that could supply visible content, including
    // CSS background images and cross-origin fonts.
    const pending = new Set();
    const renderResources = new Set(["image", "font", "stylesheet", "script"]);
    page.on("request", (request) => {
      if (renderResources.has(request.resourceType())) pending.add(request);
    });
    page.on("requestfinished", (request) => pending.delete(request));
    page.on("requestfailed", (request) => pending.delete(request));
    await page.addInitScript(() => {
      let lcp;
      const observer = new PerformanceObserver((list) => {
        lcp = list.getEntries().at(-1);
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
      window.readBaselinePaint = () => {
        const unfinishedImages = [...document.images].filter((img) => {
          if (img.complete && img.naturalWidth > 0) return false;
          if (!img.currentSrc && !img.getAttribute("src") && !img.getAttribute("srcset")) return false;
          const rect = img.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 &&
            rect.bottom > 0 && rect.top < window.innerHeight &&
            rect.right > 0 && rect.left < window.innerWidth &&
            getComputedStyle(img).visibility === "visible";
        }).length;
        const latestLcp = observer.takeRecords().at(-1) ?? lcp;
        return {
          fcpMs: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
          lcpMs: latestLcp?.startTime,
          documentResponseEnd: performance.getEntriesByType("navigation")[0]?.responseEnd,
          unfinishedImages,
          fontsLoading: document.fonts.status === "loading",
        };
      };
    });

    await navigate(page, route, "commit");
    await page.waitForFunction((windowMs) => performance.now() >= windowMs, paintWindowMs);
    const pendingCount = pending.size;
    const { fcpMs, lcpMs, documentResponseEnd, unfinishedImages, fontsLoading } =
      await page.evaluate(() => window.readBaselinePaint());
    const paintInconclusive = [];
    if (!(documentResponseEnd > 0 && documentResponseEnd <= paintWindowMs)) {
      paintInconclusive.push("main document response did not finish by the paint cutoff");
    }
    if (pendingCount) paintInconclusive.push(`${pendingCount} render resource requests still pending`);
    if (unfinishedImages) paintInconclusive.push(`${unfinishedImages} viewport images unfinished or failed`);
    if (fontsLoading) paintInconclusive.push("document fonts still loading");
    if (!Number.isFinite(fcpMs) || !Number.isFinite(lcpMs)) paintInconclusive.push("missing paint timing");
    return {
      fcpMs: paintInconclusive.length ? null : Math.round(fcpMs),
      lcpMs: paintInconclusive.length ? null : Math.round(lcpMs),
      paintInconclusive,
    };
  });
}

async function measureScripts(browser, route) {
  return withMobilePage(browser, async (page) => {
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
    await navigate(page, route, "load");
    await page.getByRole("heading", { level: 1, name: route.heading }).waitFor();
    await page.waitForTimeout(scriptWindowMs);
    const initialJsGzipBytes = await scriptBytes(page, responses);
    let jsGzipBytesThroughNext = null;
    if (route.controls) {
      const controls = page.locator(route.controls);
      await controls.scrollIntoViewIfNeeded();
      await route.step(controls, 1).waitFor();
      await controls.getByRole("button", { name: "Next", exact: true }).click();
      await route.step(controls, 2).waitFor();
      jsGzipBytesThroughNext = await scriptBytes(page, responses);
    }
    return { initialJsGzipBytes, jsGzipBytesThroughNext };
  });
}

async function measure(browser, route, sample) {
  const paint = await measurePaint(browser, route);
  const scripts = paint.paintInconclusive.length
    ? { initialJsGzipBytes: null, jsGzipBytesThroughNext: null }
    : await measureScripts(browser, route);
  return { route: route.path, sample, ...paint, ...scripts };
}

const browser = await chromium.launch();
try {
  const results = [];
  for (let sample = 1; sample <= sampleCount; sample += 1) {
    for (const route of selectedRoutes) {
      results.push(await measure(browser, route, sample));
    }
  }
  console.log(JSON.stringify({
    chromium: browser.version(),
    node: process.version,
    profile,
    cpuRate,
    network,
    paintWindowMs,
    scriptWindowMs,
    sampleCount,
    results,
  }, null, 2));
  if (results.some(({ paintInconclusive }) => paintInconclusive.length)) process.exitCode = 2;
} finally {
  await browser.close();
}
