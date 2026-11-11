import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/site",
  use: { baseURL: "http://127.0.0.1:4176", viewport: { width: 1440, height: 1000 } },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", testMatch: "search-accessibility.spec.js", use: { browserName: "webkit" } },
  ],
  webServer: { command: "pnpm preview --ignore-lock --host 127.0.0.1 --port 4176", port: 4176, reuseExistingServer: false },
});
