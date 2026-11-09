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
    title: "How the answer and ad take separate paths",
    documented: "ChatGPT writes the answer separately from choosing an ad. The answer does not wait for an ad.",
    implication: "If you add advertising to a product, keep the main feature usable even when the ad system is slow or unavailable.",
    check: "Follow the top row from the conversation to the answer on screen.",
    source: "engineering",
  },
  {
    short: "Tools",
    title: "Find ads that could fit the conversation",
    documented: "The ad session keeps track of the conversation. An AI model called the orchestrator decides when to use tools that find, check and score possible ads. It can use a tool more than once.",
    implication: "An ad can match what someone is looking for and still fail a check, for example if its campaign has run out of budget.",
    check: "Follow the arrows between the orchestrator and the tools it can use.",
    source: "engineering",
  },
  {
    short: "Delivery",
    title: "See when a selected ad appears",
    documented: "The auction chooses an ad and sets its price. A final check can stop it if it does not fit the conversation. An ad that passes the check can still arrive too late for the chat to show it.",
    implication: "Keep separate records for when an ad is chosen, sent and shown. An impression counts an ad that was shown.",
    check: "Try the example outcomes. Watch what happens to the ad while the answer carries on.",
    source: "engineering",
  },
  {
    short: "Reports",
    title: "Find the results advertisers can read",
    documented: "OpenAI describes recording events and collecting feedback. Its reporting API gives advertisers performance totals.",
    implication: "Before using a report to make a decision, check which ads and dates it covers, what each number measures and when it was collected.",
    check: "The diagram shows the event records and reporting API separately. The public description covers them as separate topics.",
    source: "reporting",
  },
  {
    short: "Our build",
    title: "See how you could collect reports",
    proposal: "The dashed boxes show our plan for software that collects reports and saves the results, including which dates they cover and when they were collected.",
    implication: "Decide how to split large requests, where to save the results and when to try again if a request fails.",
    check: "Use the reporting case to see how your software can show which results are ready and which are missing.",
    source: "reporting",
  },
];

// Fixed layout coordinates are shared by the HTML boxes and SVG connectors.
// This is a logical map, not a claim about service deployment or internal APIs.
export const architectureNodes = [
  ["turn", "One exchange in chat", 0, 0, 0, "documented"],
  ["answer", "Write the answer", 1, 0, 0, "documented"],
  ["client", "Chat screen", 3, 0, 0, "documented"],
  ["session", "Ad session tracks the chat", 0, 1, 0, "documented"],
  ["orchestrator", "Ad orchestrator", 1, 1, 1, "documented"],
  ["retrieval", "Find possible ads", 0, 2, 1, "documented"],
  ["eligibility", "Check which ads qualify", 1, 2, 1, "documented"],
  ["scoring", "Score possible ads", 2, 2, 1, "documented"],
  ["auction", "Ad auction", 3, 2, 2, "documented"],
  ["no-ad", "Ad blocked by check", 0, 3, 2, "documented"],
  ["checks", "Final check for fit", 1, 3, 2, "documented"],
  ["bundle", "Ad and introduction", 3, 3, 2, "documented"],
  ["late", "Arrives too late to show", 2, 4, 2, "documented"],
  ["display", "Check arrival time", 3, 4, 2, "documented"],
  ["logs", "Events and feedback", 1, 5, 3, "documented"],
  ["insights", "Reporting API", 3, 5, 3, "documented"],
  ["evidence", "Saved report data", 1, 6, 4, "reference"],
  ["worker", "Report collector", 3, 6, 4, "reference"],
].map(([id, title, column, row, stage, origin]) => ({
  id, title, column, row, stage, origin,
}));

export const deliveryExamples = {
  timely: {
    label: "Eligible and on time",
    outcome: "The ad can reach the chat screen in time. Count an impression once you know the ad was shown.",
  },
  late: {
    label: "Ad arrives too late",
    outcome: "The ad system sends the ad, but it arrives too late for the chat to show it. No ad is shown in this exchange, so there is no impression to count. ChatGPT still answers.",
  },
  ineligible: {
    label: "Final context check fails",
    outcome: "The final check rejects the ad for this conversation before the system sends it to the chat screen. No ad appears, so there is no impression to count.",
  },
};
