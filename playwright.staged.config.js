import { defineConfig } from "@playwright/test";
import config from "./playwright.config.js";

export default defineConfig({
  ...config,
  metadata: { astroPilot: true },
  webServer: {
    ...config.webServer,
    command: "pnpm preview:astro-pilot --host 127.0.0.1 --port 4173",
    reuseExistingServer: false,
  },
});
