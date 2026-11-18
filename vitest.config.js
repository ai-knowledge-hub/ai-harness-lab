import { sync } from "astro";
import { getViteConfig } from "astro/config";

const config = getViteConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    globals: true,
    css: true,
    exclude: ["tests/e2e/**", "tests/pilot/**", "tests/site/**", "node_modules/**"],
  },
});

export default async (env) => {
  // Vitest uses Vite's serve mode, so Astro reads the development content store.
  await sync({ cacheDir: "./.astro", logLevel: "warn" });
  return config(env);
};
