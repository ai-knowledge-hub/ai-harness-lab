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
