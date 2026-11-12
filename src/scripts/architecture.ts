function required<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing walkthrough element: ${selector}`);
  return element;
}

function show(element: HTMLElement | SVGElement, visible: boolean) {
  element.toggleAttribute("hidden", !visible);
  // The node layout uses display:flex, which overrides the browser's hidden rule.
  element.style.display = visible ? "" : "none";
}

function enhance(root: HTMLElement) {
  const diagram = root;
  const controls = required<HTMLTemplateElement>(root, "template[data-controls]").content.cloneNode(true) as DocumentFragment;
  const deliveryControls = required<HTMLTemplateElement>(root, "template[data-delivery-controls]").content.cloneNode(true) as DocumentFragment;
  const buttons = [...controls.querySelectorAll<HTMLButtonElement>("[data-stage]")];
  const previous = required<HTMLButtonElement>(controls, "[data-previous]");
  const next = required<HTMLButtonElement>(controls, "[data-next]");
  const status = required<HTMLElement>(controls, "[role=status]");
  const completeToggle = required<HTMLButtonElement>(controls, ".ads-complete-toggle");
  const select = required<HTMLSelectElement>(deliveryControls, "select");
  const outcome = required<HTMLElement>(deliveryControls, "[role=status]");
  const map = required<HTMLElement>(diagram, ".ads-map");
  const svg = required<SVGSVGElement>(map, "svg");
  const nodes = [...map.querySelectorAll<HTMLElement>("[data-node]")];
  const edges = [...map.querySelectorAll<SVGPathElement>("[data-from]")];
  const explanations = [...diagram.querySelectorAll<HTMLElement>(".ads-stage-copy")];
  const delivery = required<HTMLElement>(diagram, ".ads-delivery-example");
  const fallbackLabel = required<HTMLElement>(delivery, "p");
  const fallbackExamples = required<HTMLElement>(delivery, "ul");
  const examples = new Map([...fallbackExamples.querySelectorAll<HTMLElement>("[data-example]")].map((element) => [
    element.dataset.example,
    element.textContent.slice(required(element, "strong").textContent.length).trim(),
  ]));
  let stage = 0;
  let complete = false;
  const searchablePanels = "onbeforematch" in HTMLElement.prototype;

  function render() {
    const visibleIds = new Set<string>();
    let height = 0;
    for (const node of nodes) {
      const visible = complete || Number(node.dataset.stage) <= stage;
      show(node, visible);
      if (visible) {
        visibleIds.add(node.dataset.node!);
        // Coordinates come from the shared server renderer; avoid forcing layout
        // between visibility writes while changing stages.
        height = Math.max(height, Number.parseFloat(node.style.top) + Number.parseFloat(node.style.height) + 24);
      }
    }
    for (const edge of edges) {
      show(edge, visibleIds.has(edge.dataset.from!) && visibleIds.has(edge.dataset.to!));
      const muted = edge.dataset.outcomes && !edge.dataset.outcomes.split(" ").includes(select.value);
      edge.toggleAttribute("data-muted", Boolean(muted));
      if (muted) edge.setAttribute("data-muted", "true");
    }
    map.style.height = `${height}px`;
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 800 ${height}`);
    for (const section of explanations) {
      // until-found keeps inactive copy searchable. Safari gets the complete
      // linear reference below the interactive diagram instead of hidden text.
      section.style.removeProperty("display");
      if (complete || !searchablePanels || Number(section.dataset.stage) === stage)
        section.removeAttribute("hidden");
      else section.setAttribute("hidden", "until-found");
    }
    buttons.forEach((button, index) => {
      if (!complete && stage === index) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    previous.disabled = complete || stage === 0;
    next.disabled = complete || stage === buttons.length - 1;
    status.textContent = complete ? "Complete diagram" : `Stage ${stage + 1} of ${buttons.length}`;
    completeToggle.textContent = complete ? "Return to staged view" : "Show complete diagram";
    completeToggle.setAttribute("aria-pressed", String(complete));
    show(delivery, complete || stage >= 2);
    outcome.textContent = examples.get(select.value) ?? "";
  }

  function selectStage(index: number) {
    stage = Math.max(0, Math.min(index, buttons.length - 1));
    complete = false;
    render();
  }
  buttons.forEach((button, index) => button.addEventListener("click", () => selectStage(index)));
  previous.addEventListener("click", () => selectStage(stage - 1));
  next.addEventListener("click", () => selectStage(stage + 1));
  completeToggle.addEventListener("click", () => { complete = !complete; render(); });
  select.addEventListener("change", render);
  explanations.forEach((section) => section.addEventListener("beforematch", () => {
    selectStage(Number(section.dataset.stage));
  }));

  function revealFragment() {
    let id: string;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const section = target && explanations.find((section) => section.contains(target));
    if (section) {
      selectStage(Number(section.dataset.stage));
      target.scrollIntoView({ block: "start" });
    }
  }

  required(diagram, ".ads-figure").before(controls);
  delivery.prepend(deliveryControls);
  show(fallbackLabel, false);
  show(fallbackExamples, false);
  render();
  revealFragment();
  window.addEventListener("hashchange", revealFragment);
}

// Initialise searchable panels before find-in-page can jump to an explanation.
// A failed module download leaves the complete server-rendered reference intact.
document.querySelectorAll<HTMLElement>("[data-ads-walkthrough]").forEach(enhance);
