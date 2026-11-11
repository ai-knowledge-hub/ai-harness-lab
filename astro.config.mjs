import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { copyFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Preserve the flat .html URLs emitted by the previous static builder as well
// as Astro's directory URLs. Astro owns rendering and route discovery.
async function mirrorHtml(directory, root = directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await mirrorHtml(path, root);
    else if (entry.name === "index.html" && directory !== root)
      await copyFile(path, join(root, `${relative(root, directory)}.html`));
  }
}

export default defineConfig({
  site: "https://harness.ai-knowledge-hub.org",
  output: "static",
  trailingSlash: "never",
  build: { format: "directory" },
  devToolbar: { enabled: false },
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    react(),
    { name: "legacy-html-addresses", hooks: { "astro:build:done": ({ dir }) => mirrorHtml(fileURLToPath(dir)) } },
  ],
});
