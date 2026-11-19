import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import { guideSections } from "./scripts/markdown-guide-sections.mjs";
import { validateAuthoredGuideOutput } from "./scripts/validate-authored-guide-output.mjs";
import { site } from "./src/content/site.js";
import { copyFile, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Preserve the flat .html URLs emitted by the previous static builder as well
// as Astro's directory URLs. Astro owns rendering and route discovery.
async function mirrorHtml(directory, root = directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await mirrorHtml(path, root);
    else if (entry.name === "index.html" && directory !== root) {
      const alias = `${relative(root, directory)}.html`;
      try {
        await copyFile(path, join(root, alias), constants.COPYFILE_EXCL);
      } catch (error) {
        if (error.code === "EEXIST")
          throw new Error(`Flat HTML alias ${alias} conflicts with an existing document`, { cause: error });
        throw error;
      }
    }
  }
}

let trailingSlash;

export default defineConfig({
  site: site.origin,
  output: "static",
  // Preserve the established inline spacing across the Astro 7 compiler change.
  compressHTML: true,
  trailingSlash: "never",
  build: { format: "directory" },
  devToolbar: { enabled: false },
  vite: { build: { assetsInlineLimit: 0 } },
  markdown: {
    syntaxHighlight: false,
    processor: satteri({ hastPlugins: [guideSections], features: { smartPunctuation: false } }),
  },
  integrations: [
    react(),
    mdx(),
    {
      name: "harness-static-output",
      hooks: {
        "astro:config:done": ({ config }) => {
          trailingSlash = config.trailingSlash;
        },
        "astro:build:done": async ({ dir }) => {
          const output = fileURLToPath(dir);
          await mirrorHtml(output);
          await validateAuthoredGuideOutput(output, site.origin, trailingSlash);
        },
      },
    },
  ],
});
