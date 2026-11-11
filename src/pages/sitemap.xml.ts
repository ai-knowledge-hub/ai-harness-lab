import { staticPaths, getPageMetadata } from "../content/page-metadata";
import { validateLearningContent } from "../content/validate-learning";

export function GET() {
  validateLearningContent();
  const urls = staticPaths.map(getPageMetadata).filter((page) => page.robots === "index, follow");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((page) => `\n  <url><loc>${page.canonical}</loc></url>`).join("")}\n</urlset>\n`, {
    headers: { "Content-Type": "application/xml" },
  });
}
