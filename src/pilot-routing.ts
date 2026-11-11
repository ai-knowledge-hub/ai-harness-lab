/// <reference types="vite/client" />

// This flag is set only by the combined preview builder. React Router must
// request the Astro document instead of rendering the legacy guide route.
export function shouldLoadAstroDocument(href: string): boolean {
  const pathname = href.split(/[?#]/, 1)[0].replace(/\/+$/, "").replace(/\.html$/, "");
  return import.meta.env.VITE_ASTRO_PILOT === "true" &&
    pathname === "/learn/system-design/chatgpt-ads";
}
