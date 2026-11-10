import type { Guide } from "../guide-types";

export const attributionAndLiftGuide = {
  id: "attribution-and-lift",
  path: "/learn/measurement-ml/attribution-and-lift",
  title: "How to compare attributed conversions and lift",
  shortTitle: "Attribution and lift",
  description: "Use a fictional campaign to compare orders credited to ads with the extra orders an experiment estimates the ads caused.",
  trackId: "measurement-ml",
  kind: "principle",
  publicationStatus: "published",
  format: "Reusable guide",
  readingMinutes: 4,
  updatedAt: "2026-11-10",
  objectives: [
    "Choose an outcome that would change your decision.",
    "Read attributed conversions and estimated lift as answers to different questions.",
    "Write down what evidence would justify acting on a result.",
  ],
  prerequisiteConceptIds: [],
  conceptIds: [],
  projectIds: [],
  platformIds: [],
  publicationIds: [],
  capabilityIds: [],
  videoIds: [],
  relatedGuideIds: [],
  introduction: "Say you need to decide whether to raise next month’s ad budget. An ad report can tell you which orders it credits to the campaign. An experiment can help you estimate how many extra orders the campaign caused.",
  sections: [
    {
      id: "choose-an-outcome",
      title: "Choose the outcome before you look at results",
      blocks: [
        { type: "paragraph", text: "Write down the decision, the outcome, and the period. For example, decide whether to raise the budget based on completed orders over two weeks. Count orders from every channel using the same rules for everyone in the comparison." },
        { type: "paragraph", text: "Attribution is the rule an ad platform uses to credit an outcome. For example, a report may count an order when someone buys within a set number of days after clicking an ad. Some of those customers might have ordered anyway." },
      ],
    },
    {
      id: "compare-without-the-campaign",
      title: "Compare results with and without the campaign",
      blocks: [
        { type: "paragraph", text: "When you can, randomly assign eligible people to two groups. Make the campaign available to one group and withhold it from the other. The second group is called a holdout. Compare everyone assigned to each group, including people who never clicked or saw an ad." },
        { type: "paragraph", text: "If you can run the campaign separately by region, another option is to randomly assign regions to the two groups. You need enough suitable regions and a way to limit spillover, such as people in the holdout seeing the test ads.", source: { title: "Google Research on geographic experiments", href: "https://research.google/pubs/measuring-ad-effectiveness-using-geo-experiments/" } },
      ],
    },
    {
      id: "read-the-results",
      title: "Work through a fictional example",
      blocks: [
        { type: "paragraph", text: "Imagine you assign 10,000 eligible people to each group and track orders for two weeks. Each person can place at most one order in this example. The platform credits the campaign with 180 orders under its reporting rules." },
        { type: "table", columns: ["Group", "People assigned", "Completed orders", "Order rate"], rows: [
          ["Campaign available", "10,000", "260", "2.6%"],
          ["Holdout", "10,000", "200", "2.0%"],
        ] },
        { type: "paragraph", text: "The campaign group had 60 more orders. Because the groups are the same size, subtracting the counts gives the same comparison as subtracting the rates. The difference is 0.6 percentage points, or 30% above the holdout rate. This difference estimates incremental lift, the extra effect caused by the campaign. The 180 credited orders came from a separate reporting rule." },
        { type: "callout", title: "Write a decision rule before the test", text: "Decide how many extra orders you would need to cover the cost of the ads. Check the range of effects that fit the data, since another sample could give a different result. If that range includes results too small to cover the cost, collect more evidence or hold the budget steady." },
      ],
    },
  ],
} satisfies Guide;
