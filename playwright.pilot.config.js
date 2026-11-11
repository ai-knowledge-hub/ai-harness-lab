import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/pilot",
  use: { baseURL: "http://127.0.0.1:4175" },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    // Navigation uses the same anchors at both widths; the main suite also
    // covers desktop entry. Only the diagram needs this second viewport.
    { name: "desktop", testMatch: "architecture.spec.js", use: { viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: {
    command: "pnpm preview:astro-pilot --host 127.0.0.1 --port 4175",
    port: 4175,
    reuseExistingServer: false,
  },
});
