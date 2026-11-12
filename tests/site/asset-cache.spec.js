import { test, expect } from "@playwright/test";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

test("a cached missing asset recovers when the asset is restored", async ({ page }) => {
  const config = JSON.parse(readFileSync(new URL("../../vercel.json", import.meta.url)));
  const cacheControl = config.headers
    .find(rule => rule.source === "/_astro/(.*)")
    ?.headers.find(header => header.key.toLowerCase() === "cache-control")?.value;
  expect(cacheControl).toBeTruthy();

  const asset = "/_astro/rollback-recovery.abc123.js";
  const restoredBody = "export const restored = true;";
  let available = false;
  let assetRequests = 0;
  const server = createServer((request, response) => {
    if (request.url !== asset) {
      response.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-store" });
      response.end("<!doctype html><title>Asset recovery probe</title>");
      return;
    }
    assetRequests++;
    response.writeHead(available ? 200 : 404, {
      "Cache-Control": cacheControl,
      "Content-Type": available ? "application/javascript" : "text/plain",
    });
    response.end(available ? restoredBody : "Asset unavailable");
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    // Use the real browser HTTP cache: request interception, APIRequestContext,
    // cache-busting URLs or forced reloads would hide the negative-cache bug.
    const readAsset = () => page.evaluate(async path => {
      const response = await fetch(path);
      return { status: response.status, body: await response.text() };
    }, asset);

    expect(await readAsset()).toEqual({ status: 404, body: "Asset unavailable" });
    available = true;
    expect(await readAsset()).toEqual({ status: 200, body: restoredBody });
    expect(assetRequests).toBe(2);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
