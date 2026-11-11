import { defineConfig } from "@playwright/test";
import config from "./playwright.config.js";
export default defineConfig({
  ...config,
  projects: [config.projects[0]],
  metadata: { legacy: true },
  webServer: { ...config.webServer, command: "pnpm preview:legacy --host 127.0.0.1 --port 4173" },
});
