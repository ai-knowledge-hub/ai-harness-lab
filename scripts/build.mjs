import { checkReferenceContracts } from "./reference-contracts.mjs";
import { build } from "vite";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";

// Build both entry points without a listening server. The temporary renderer
// uses the same components as the client and is removed from deploy output.
await checkReferenceContracts();
await build();
const rendererDirectory = resolve("dist/.prerender");
try {
  await build({
    build: {
      ssr: "src/entry-server.jsx",
      outDir: rendererDirectory,
      emptyOutDir: true,
    },
  });
  const rendering = await import(
    pathToFileURL(resolve(rendererDirectory, "entry-server.js")).href
  );
  rendering.validateLearningContent();
  const template = await readFile(resolve("dist/index.html"), "utf8");
  if (
    !template.includes('<div id="root"></div>') ||
    !template.includes("<!--page-metadata-->")
  )
    throw new Error("Static rendering slots are missing from index.html");
  const escape = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  const sitemap = [];
  for (const path of rendering.staticPaths) {
    const { markup, metadata } = rendering.renderPage(path);
    const head = `<link rel="canonical" href="${escape(metadata.canonical)}" />\n<meta name="robots" content="${metadata.robots}" />\n<meta property="og:title" content="${escape(metadata.title)}" />\n<meta property="og:description" content="${escape(metadata.description)}" />\n<meta property="og:url" content="${escape(metadata.canonical)}" />`;
    const html = template
      .replace(
        /<title>[\s\S]*?<\/title>/,
        () => `<title>${escape(metadata.title)}</title>`,
      )
      .replace(
        /(<meta\s+name="description"\s+content=")[^"]*("\s*\/>)/,
        (_, before, after) =>
          `${before}${escape(metadata.description)}${after}`,
      )
      .replace("<!--page-metadata-->", () => head)
      .replace(
        '<div id="root"></div>',
        () =>
          `<div id="root" data-rendered-path="${escape(path)}">${markup}</div>`,
      );
    const files =
      path === "/"
        ? [resolve("dist/index.html")]
        : [
            resolve("dist", `${path.slice(1)}.html`),
            resolve("dist", path.slice(1), "index.html"),
          ];
    for (const file of files) {
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, html);
    }
    if (metadata.robots.startsWith("index")) sitemap.push(metadata.canonical);
  }
  await writeFile(
    resolve("dist/sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap.map((url) => `\n  <url><loc>${escape(url)}</loc></url>`).join("")}\n</urlset>\n`,
  );
  await writeFile(
    resolve("dist/robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: https://harness.ai-knowledge-hub.org/sitemap.xml\n`,
  );
  console.log(
    `Rendered ${rendering.staticPaths.length} routes as HTML; ${sitemap.length} indexable routes in sitemap.`,
  );
} finally {
  await rm(rendererDirectory, { recursive: true, force: true });
}
