import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile-lab", testMatch: "lab.spec.js", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
  },
  // Keep Playwright in charge of server lifetime, including agent-run sessions.
  webServer: {
    command: "pnpm preview --ignore-lock --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
