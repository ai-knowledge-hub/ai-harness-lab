import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  output: "static",
  srcDir: "./pilot/src",
  outDir: "./pilot/dist",
  build: { format: "directory" },
  devToolbar: { enabled: false },
  integrations: [react()],
});
