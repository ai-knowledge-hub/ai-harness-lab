import { allocate, exampleBidders, pace, pacingNames, pacingPolicies, reserveBudget, reportObservation, pounds, type PacingPolicy, type BudgetStrategy } from "../content/advertising-platform-models";

function required<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing advertising example element: ${selector}`);
  return element;
}
const put = (root: ParentNode, selector: string, value: string) => { required(root, selector).textContent = value; };
const numeric = (form: HTMLFormElement, name: string) => required<HTMLInputElement>(form, `[name="${name}"]`).valueAsNumber;

function updateAndReveal(root: HTMLElement, form: HTMLFormElement) {
  update(root, form);
  required(form, '[role="status"]').textContent = required(root, `[data-${form.dataset.simulator}-result]`).textContent;
  const feedback = required<HTMLElement>(form, ".platform-feedback");
  const bounds = feedback.getBoundingClientRect();
  const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
  // Keep focus on the submitted control while exposing its adjacent result.
  // Tall feedback starts below the header and remains readable by scrolling.
  if (bounds.top < headerBottom || bounds.bottom > innerHeight) feedback.scrollIntoView({ block: "start" });
}

function update(root: HTMLElement, form: HTMLFormElement) {
  const data = new FormData(form);
  switch (form.dataset.simulator) {
    case "auction": {
      const result = allocate(exampleBidders.map((bidder, index) => ({
        ...bidder,
        bidPence: Math.round(numeric(form, `bid-${index}`) * 100),
        qualityPercent: Math.round(numeric(form, `quality-${index}`) * 100),
        eligible: data.has(`eligible-${index}`),
      })));
      const peak = Math.max(1, ...result.rows.filter(row => row.eligible).map(row => row.scoreUnits));
      for (const row of result.rows) {
        const element = required<HTMLElement>(root, `[data-bidder="${row.index}"]`);
        put(element, "[data-score-label]", `${row.eligible ? "Eligible" : "Ineligible"} · Score ${(row.scoreUnits / 10000).toFixed(2)}`);
        required<HTMLElement>(element, "[data-score-bar]").style.width = `${row.eligible ? row.scoreUnits / peak * 100 : 0}%`;
      }
      const winner = result.winner;
      put(root, "[data-auction-result]", winner
        ? `${winner.name} wins with a score of ${(winner.scoreUnits / 10000).toFixed(2)}.${result.tied ? " Equal top scores: the earliest listed eligible advertiser wins under this simulator's tie rule." : ""} Billing has not been established.`
        : "No candidate has a positive eligible score. No allocation or competitive price is established.");
      put(root, "[data-auction-pricing]", result.thresholdPence === null || result.minimumWinningPence === null
        ? winner ? "Only one candidate can win. No competitive matching threshold can be inferred; a reserve price would require a separate rule." : "There is no winner, so there is no matching threshold to display."
        : `The next-highest score is ${(result.runner!.scoreUnits / 10000).toFixed(2)}. The matching threshold is £${(result.thresholdPence / 100).toFixed(4)}. Under the stated tie rule and penny-sized bids, the minimum winning bid for ${winner!.name} is ${pounds(result.minimumWinningPence)}. This is not a billing event.`);
      break;
    }
    case "pacing": {
      const morning = numeric(form, "morning"), evening = numeric(form, "evening");
      for (const policy of pacingPolicies) {
        const result = pace(policy, morning, evening);
        const row = required(root, `[data-pacing-policy="${policy}"]`);
        put(row, "[data-morning]", pounds(result.morning * 100));
        put(row, "[data-evening]", pounds(result.evening * 100));
        put(row, "[data-expected]", result.expectedPurchases.toFixed(1));
      }
      const policy = String(data.get("policy")) as PacingPolicy;
      const selected = pace(policy, morning, evening);
      put(root, "[data-pacing-result]", `${pacingNames[policy]} reserves ${pounds(selected.morning * 100)} in the morning and ${pounds(selected.evening * 100)} in the evening. Expected incremental purchases: ${selected.expectedPurchases.toFixed(1)} under the supplied assumptions. The reservation envelope is £1,000; final charges are not known.`);
      break;
    }
    case "budget": {
      const result = reserveBudget(String(data.get("strategy")) as BudgetStrategy, data.has("failure"));
      result.workers.forEach((worker, index) => {
        const row = required(root, `[data-worker="${index}"]`);
        put(row, "[data-observed]", pounds(worker.observedPence));
        put(row, "[data-committed]", pounds(worker.committedPence));
      });
      put(root, "[data-budget-result]", result.explanation + " Billable charges remain unknown.");
      break;
    }
    case "clocks": {
      const result = reportObservation(data.get("basis") === "conversion" ? "conversion" : "interaction", data.get("snapshot") === "wednesday" ? "wednesday" : "tuesday", data.has("correction"));
      put(root, "[data-clocks-result]", `Reporting day for the illustrated purchase under the selected rule: ${result.reportingDay}. ${result.eventState} Separately, the Monday interaction-date report shows ${result.mondayCount} attributed purchases at this observation. ${result.correctionState}`);
      break;
    }
  }
}

document.querySelectorAll<HTMLElement>("[data-platform-visual]").forEach(root => {
  // Insert optional controls only after the module has loaded. Static results,
  // diagrams and explanations remain intact when enhancement is unavailable.
  root.querySelectorAll<HTMLTemplateElement>("template[data-platform-controls]").forEach(template => {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    fragment.querySelectorAll<HTMLFormElement>("form[data-simulator]").forEach(form => {
      // Keep the reading result outside the closed disclosure. The controls
      // get one live feedback region; the reading copy stays in sync silently.
      const feedback = document.createElement("div");
      feedback.className = "platform-feedback";
      const actions = required<HTMLElement>(form, ".platform-actions");
      actions.replaceWith(feedback);
      const readingResult = required(root, `[data-${form.dataset.simulator}-result]`);
      readingResult.removeAttribute("role");
      const status = document.createElement("p");
      status.className = "platform-result";
      status.setAttribute("role", "status");
      feedback.append(actions, status);
      form.addEventListener("submit", event => {
        event.preventDefault();
        if (form.reportValidity()) updateAndReveal(root, form);
      });
      // Run after the browser's reset default action has restored values and
      // checked states; a microtask can still observe the pre-reset controls.
      form.addEventListener("reset", () => requestAnimationFrame(() => updateAndReveal(root, form)));
    });
    template.replaceWith(fragment);
  });
});
