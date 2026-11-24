import { intentStates, orchestrationSteps, orchestrationScenarios, independentStates, diagnosticStates, deliveryOutcome, type DeliveryInput } from "../content/chatgpt-ads-models";

function get<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing ChatGPT Ads teaching element: ${selector}`);
  return element;
}
const put = (root: ParentNode, selector: string, text: string) => { get(root, selector).textContent = text; };

document.querySelectorAll<HTMLElement>("[data-chatgpt-visual]").forEach(root => {
  const template = root.querySelector<HTMLTemplateElement>("template[data-cg-controls]");
  if (!template) return;
  const fragment = template.content.cloneNode(true) as DocumentFragment;
  const form = get<HTMLFormElement>(fragment, "form");
  let step = 0;
  const value = (name: string) => String(new FormData(form).get(name));
  const feedback = (text: string) => put(form, "[data-feedback]", text);
  const result = (text: string) => { put(root, "[data-result]", text); feedback(text); };

  function update() {
    switch (root.dataset.chatgptVisual) {
      case "intent": {
        const state = intentStates.find(state => state.id === value("turn"))!;
        put(root, "[data-intent-message]", state.message);
        put(root, "[data-intent-history]", state.history);
        put(root, "[data-intent-goal]", state.goal);
        root.querySelectorAll<HTMLElement>("[data-intent-step]").forEach(element => {
          if (element.dataset.intentStep === state.id) element.setAttribute("aria-current", "step");
          else element.removeAttribute("aria-current");
        });
        result(`${state.label}. ${state.implication}`);
        break;
      }
      case "orchestration": {
        const scenario = orchestrationScenarios.find(scenario => scenario.id === value("scenario"))!;
        step = Math.min(Math.max(0, step), scenario.path.length - 1);
        const current = scenario.path[step];
        root.querySelectorAll<HTMLElement>("[data-tool-step]").forEach(element => {
          const active = element.dataset.toolStep === current;
          get<HTMLDetailsElement>(element, "details").open = active;
          if (active) element.setAttribute("aria-current", "step");
          else element.removeAttribute("aria-current");
        });
        // aria-disabled keeps the boundary control in the keyboard order and
        // preserves focus when the last/first responsibility is reached.
        get(form, "[data-previous]").setAttribute("aria-disabled", String(step === 0));
        get(form, "[data-next]").setAttribute("aria-disabled", String(step === scenario.path.length - 1));
        const title = orchestrationSteps.find(item => item.id === current)!.title;
        const revisit = scenario.id === "revised" && step === 1 ? " Revised queries return to retrieval after the clarification." : "";
        feedback(`Responsibility ${step + 1} of ${scenario.path.length}: ${title}.${revisit} ${step === scenario.path.length - 1 ? scenario.outcome : "Continue to inspect this illustrative branch."}`);
        put(root, "[data-result]", scenario.outcome);
        break;
      }
      case "independence": {
        const state = independentStates.find(state => state.id === value("advertising"))!;
        result(`${state.result} Organic answer: available independently.`);
        break;
      }
      case "delivery": {
        // Read selected values even while their native fieldset is disabled;
        // the pure model ignores unreachable downstream values by priority.
        const selected = (name: string) => get<HTMLInputElement>(form, `[name="${name}"]:checked`).value;
        const outcome = deliveryOutcome({ server: selected("server"), context: selected("context"), arrival: selected("arrival") } as DeliveryInput);
        get<HTMLFieldSetElement>(form, "[data-context-controls]").disabled = !outcome.contextReached;
        get<HTMLFieldSetElement>(form, "[data-arrival-controls]").disabled = !outcome.arrivalReached;
        put(form, "[data-context-note]", outcome.contextReached ? "Contextual review is reached." : "Not reached: server-side timeout. The disabled review value is irrelevant.");
        put(form, "[data-arrival-note]", outcome.arrivalReached ? "Frontend arrival is reached." : "Not reached: an upstream boundary stopped sending. The disabled arrival value is irrelevant.");
        root.dataset.outcome = outcome.id;
        put(root, "[data-result]", `${outcome.title}. ${outcome.detail}`);
        const consequence = { timeout: "No completed placement is sent.", rejected: "The candidate is blocked before sending.", late: "The frontend display window has closed.", "on-time": "Display and acknowledgement require separate evidence." }[outcome.id];
        feedback(`${outcome.title}. ${consequence} Organic answer: available independently.`);
        break;
      }
      case "diagnostics": {
        const state = diagnosticStates.find(state => state.id === value("outcome"))!;
        const lens = value("lens") as "operations" | "quality" | "business";
        put(root, "[data-diagnostic-evidence]", state.evidence);
        put(root, "[data-result]", state[lens]);
        feedback(`${state.label}. Evidence: ${state.evidence} Investigation: ${state[lens]}`);
        break;
      }
    }
  }

  form.addEventListener("submit", event => { event.preventDefault(); update(); });
  form.addEventListener("change", event => {
    if ((event.target as HTMLInputElement).name === "scenario") step = 0;
    update();
  });
  form.querySelector("[data-next]")?.addEventListener("click", () => {
    if (get(form, "[data-next]").getAttribute("aria-disabled") === "true") return;
    step++; update();
  });
  form.querySelector("[data-previous]")?.addEventListener("click", () => {
    if (get(form, "[data-previous]").getAttribute("aria-disabled") === "true") return;
    step--; update();
  });
  template.replaceWith(fragment);
  update();
});
