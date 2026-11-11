import { execFileSync } from "node:child_process";
import { cp, rm } from "node:fs/promises";

// #45 previews the Astro site. Production cutover and retirement of the old
// renderer remain in #47, after the lab-specific migration checks in #46.
if (process.env.VERCEL_ENV === "production") {
  execFileSync("pnpm", ["build:legacy"], { stdio: "inherit" });
  await rm("dist", { recursive: true, force: true });
  await cp("legacy-dist", "dist", { recursive: true });
} else execFileSync("pnpm", ["build"], { stdio: "inherit" });
