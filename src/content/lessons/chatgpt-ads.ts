import type { Guide } from "../guide-types";

export const chatgptAdsGuide = {
  id: "chatgpt-ads",
  path: "/learn/system-design/chatgpt-ads",
  title: "How ChatGPT Ads works",
  shortTitle: "ChatGPT Ads",
  description:
    "See how ChatGPT Ads chooses and shows ads, what advertisers can control and what reports can tell you.",
  trackId: "system-design",
  kind: "platform",
  publicationStatus: "published",
  format: "Platform introduction",
  readingMinutes: 14,
  updatedAt: "2026-11-08",
  objectives: [
    "Follow an ad from a conversation to the point where it might be shown.",
    "Find the settings and results available to advertisers.",
    "See how to collect and use campaign reports.",
  ],
  prerequisiteConceptIds: [],
  conceptIds: ["api-contracts", "reporting-evidence"],
  projectIds: [],
  platformIds: ["chatgpt-ads"],
  publicationIds: ["christmas-pilot"],
  capabilityIds: [],
  videoIds: [],
  relatedGuideIds: ["advertising-platforms", "chatgpt-ads-apis", "chatgpt-ads-reporting", "api-design"],
  introduction:
    "What makes an ad fit a conversation, and what can you learn from the campaign report afterwards? Follow the path from what a person asks ChatGPT to what an advertiser can see and change.",
  sections: [
    {
      id: "the-ad-experience",
      title: "The ad experience",
      blocks: [
        { type: "paragraph", text: "OpenAI describes ChatGPT advertising around moments when people explore options, compare alternatives and make decisions in a conversation. That makes the surrounding task and context part of the starting point for understanding an ad’s relevance.", source: { title: "ChatGPT advertiser overview", href: "https://ads.openai.com/" } },
        { type: "paragraph", text: "For an advertiser, the next questions are practical. Which settings can you change? Which actions can you measure? Which results can your software pull into a report?" },
      ],
    },
    {
      id: "visual-deep-dive",
      title: "Follow the path of an ad",
      blocks: [{ type: "ads-architecture" }],
    },
    {
      id: "orchestrator-detail",
      title: "How ChatGPT looks for a relevant ad",
      blocks: [{ type: "ads-orchestrator" }],
    },
    {
      id: "reference-downloads",
      title: "Ad system examples to download",
      blocks: [{ type: "reference-downloads", collection: "architecture" }],
    },
    {
      id: "advertiser-controls",
      title: "What advertisers can set up and measure",
      blocks: [
        { type: "flow", label: "The advertising workflow from setup to reporting", steps: ["Configure campaigns & ads", "Show ads", "Record actions", "Review results"] },
        { type: "paragraph", text: "An ad account contains campaigns, campaigns contain ad groups, and ad groups contain ads. An API is how software sends a request to another system. The Advertiser API lets software manage campaigns and request reports. When you build a report, keep each campaign’s ID and settings alongside its results.", source: { title: "Advertiser API and campaign structure", href: "https://developers.openai.com/ads/api-overview" } },
        { type: "paragraph", text: "A measurement pixel is a small piece of website code that records actions. The Conversions API lets your server send records of actions such as purchases. Sending those records and requesting a campaign report are separate jobs.", source: { title: "Measurement interfaces", href: "https://developers.openai.com/ads" } },
        { type: "paragraph", text: "An Ads API key is a secret your server uses to access a specific ad account. Using ChatGPT and getting advertiser API access are separate. Before connecting a live account, check that you have access and that the features you need are available.", source: { title: "Advertiser API authentication", href: "https://developers.openai.com/ads/api-reference/authentication" } },
      ],
    },
    {
      id: "reporting-and-retrieval",
      title: "What the reports tell you",
      blocks: [
        { type: "paragraph", text: "A report can show impressions, clicks and spend, for example by campaign and day. The reasons an ad was considered, scored or chosen for a particular conversation stay inside the platform." },
        { type: "callout", title: "Get campaign results", text: "The advertiser API guide shows which tools to use. The reporting case walks through a request, shows how to collect all the results and gives an example of how to flag missing data. A live connection is planned." },
      ],
    },
    {
      id: "optimisation-and-evidence",
      title: "Optimisation and evidence",
      blocks: [
        { type: "paragraph", text: "Ask what the campaign aims to achieve, what you pay for and what the report measures. With conversion-optimised cost per click (CPC), the campaign aims for a chosen action, such as a purchase, and you pay for valid clicks. It requires an eligible ad account and conversion tracking. An order credited to an ad tells you how the platform counted it. To estimate how many extra sales the ad caused, you need a comparison.", source: { title: "Conversion-optimised campaign requirements", href: "https://developers.openai.com/ads/conversion-optimized-campaigns" } },
        { type: "paragraph", text: "Before changing a budget or ad, check what the report measures and whether more data may arrive. The measurement guides will look at how to use these results and how to estimate the extra sales a campaign caused, known as incrementality." },
      ],
    },
    {
      id: "across-five-tracks",
      title: "One platform across five tracks",
      blocks: [
        { type: "paragraph", text: "The worked reporting case takes one request for daily campaign spend through the five tracks. It covers the contract, batch retrieval, recovery, interpretation, and how an agent can use the result." },
      ],
    },
  ],
} satisfies Guide;
