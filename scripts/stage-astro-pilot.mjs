import { execFileSync } from "node:child_process";
import { copyFile, cp } from "node:fs/promises";

if (
  process.env.VERCEL_ENV === "preview" &&
  process.env.VERCEL_GIT_COMMIT_REF === "codex/astro-chatgpt-ads-pilot"
) {
  console.log(`Building the Astro guide preview with Node ${process.version}`);
  execFileSync("pnpm", ["build:astro-pilot"], { stdio: "inherit" });
  const guidePath = "learn/system-design/chatgpt-ads";
  const pilotHtml = `pilot/dist/${guidePath}/index.html`;
  await cp("pilot/dist/_astro", "dist/_astro", { recursive: true });
  await copyFile(pilotHtml, `dist/${guidePath}/index.html`);
  await copyFile(pilotHtml, `dist/${guidePath}.html`);
}
