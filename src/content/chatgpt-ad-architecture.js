export const architectureSources = {
  engineering: {
    title: "OpenAI engineering account",
    href: "https://openai.com/index/building-chatgpt-ad-stack/",
  },
  reporting: {
    title: "OpenAI reporting documentation",
    href: "https://developers.openai.com/ads/reporting",
  },
};

export const architectureStages = [
  {
    short: "Paths",
    title: "Separate the answer and ad paths",
    documented: "Answer generation and advertising are separate. The answer does not wait for an ad.",
    implication: "Give the advertising work its own boundary. A slow or unavailable dependency should not block the primary user task.",
    check: "Trace the answer path on its own before adding advertising components.",
    source: "engineering",
  },
  {
    short: "Tools",
    title: "Expand the orchestration loop",
    documented: "A stateful ads session supports an LLM orchestrator calling retrieval, eligibility and scoring tools. Calls can repeat.",
    implication: "Treat these as distinct responsibilities. Inspect what each tool returns and what evidence the next decision needs; avoid assuming a fixed call sequence.",
    check: "A retrieved candidate is still only a candidate. Explain which checks remain before it could be shown.",
    source: "engineering",
  },
  {
    short: "Delivery",
    title: "Follow selection through delivery",
    documented: "The auction determines selection and pricing. Context rejection stops the bundle. Server-side delivery can still arrive too late for frontend display; it does not establish an impression.",
    implication: "Record selection, sending and display as distinct observations. Give a missing placement an explicit reason rather than treating every absence as a failure.",
    check: "Compare the illustrative outcomes. The answer path stays available in every case.",
    source: "engineering",
  },
  {
    short: "Reports",
    title: "Locate measurement and reporting",
    documented: "OpenAI describes logging and feedback. Separately, public reporting exposes aggregated performance. Their internal connection is not specified in this diagram.",
    implication: "Keep the event lifecycle separate from the report you retrieve. Preserve reporting scope, definitions and freshness before using the result to support a decision.",
    check: "The gap between logs and the reporting API is intentional: it does not invent an unpublished data pipeline.",
    source: "reporting",
  },
  {
    short: "Our build",
    title: "Add our reference integration",
    proposal: "Our proposed worker retrieves bounded reports and stores evidence with coverage and freshness. These dashed components are a reference design, not a live connector or OpenAI internals.",
    implication: "Choose request partitions, checkpoints, storage and retries for your own operating constraints. Keep those choices separate from the provider’s documented API contract.",
    check: "Use the API-design preview to define what a complete, partial or rejected result must mean before implementing the worker.",
    source: "reporting",
  },
];

// Fixed layout coordinates are shared by the HTML boxes and SVG connectors.
// This is a logical map, not a claim about service deployment or internal APIs.
export const architectureNodes = [
  ["turn", "Conversation turn", 0, 0, 0, "documented"],
  ["answer", "Answer generation", 1, 0, 0, "documented"],
  ["client", "User interface", 3, 0, 0, "documented"],
  ["session", "Stateful ad session", 0, 1, 0, "documented"],
  ["orchestrator", "Ads orchestrator", 1, 1, 1, "documented"],
  ["retrieval", "Candidate retrieval", 0, 2, 1, "documented"],
  ["eligibility", "Eligibility filters", 1, 2, 1, "documented"],
  ["scoring", "Relevance & scoring", 2, 2, 1, "documented"],
  ["auction", "Auction tool", 3, 2, 2, "documented"],
  ["no-ad", "Placement rejected", 0, 3, 2, "documented"],
  ["checks", "Final context check", 1, 3, 2, "documented"],
  ["bundle", "Ad bundle", 3, 3, 2, "documented"],
  ["late", "Not displayed: late", 2, 4, 2, "documented"],
  ["display", "Frontend timing check", 3, 4, 2, "documented"],
  ["logs", "Logs & feedback", 1, 5, 3, "documented"],
  ["insights", "Reporting API", 3, 5, 3, "documented"],
  ["evidence", "Evidence store", 1, 6, 4, "reference"],
  ["worker", "Ingestion worker", 3, 6, 4, "reference"],
].map(([id, title, column, row, stage, origin]) => ({
  id, title, column, row, stage, origin,
}));

export const deliveryExamples = {
  timely: {
    label: "Eligible and on time",
    outcome: "The bundle can reach the interface. Count an impression only when there is evidence it was displayed.",
  },
  late: {
    label: "Ad arrives too late",
    outcome: "The bundle is delivered server-side but arrives too late for frontend display. No ad is shown for this turn; the answer continues and there is no impression to count.",
  },
  ineligible: {
    label: "Final context check fails",
    outcome: "The final check rejects the placement before the bundle is sent to the frontend. Preserve the reason; there is no impression to count.",
  },
};
