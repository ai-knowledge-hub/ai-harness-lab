const toggle = document.querySelector<HTMLButtonElement>(".theme-toggle");
const root = document.documentElement;

function updateToggle(button: HTMLButtonElement) {
  const next = root.dataset.theme === "light" ? "Dark" : "Light";
  button.textContent = `${next} mode`;
  button.setAttribute("aria-label", `Switch to ${next.toLowerCase()} mode`);
}

if (toggle) {
  updateToggle(toggle);
  toggle.addEventListener("click", () => {
    const theme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = theme;
    updateToggle(toggle);
    try {
      localStorage.setItem("harness-theme", theme);
    } catch {
      /* The current choice still applies when storage is unavailable. */
    }
  });
}

const menu = document.querySelector<HTMLDetailsElement>(".mobile-navigation");
menu?.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.open) {
    menu.open = false;
    menu.querySelector("summary")?.focus();
  }
});
import { inject } from "@vercel/analytics";

// Full document navigation supplies page views without a React analytics island.
// Local previews keep the same SDK in their measured bundle, without requesting
// the platform-only endpoint or sending development visits to production.
if (import.meta.env.PROD && !["localhost", "127.0.0.1", "[::1]"].includes(location.hostname))
  inject({
    framework: "astro", mode: "production",
    basePath: import.meta.env.PUBLIC_VERCEL_OBSERVABILITY_BASEPATH,
  }, import.meta.env.PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG);

menu?.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("a[href]")) {
    menu.open = false;
    menu.querySelector("summary")?.focus();
  }
});
