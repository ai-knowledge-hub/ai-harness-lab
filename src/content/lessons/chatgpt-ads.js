export const chatgptAdsGuide = {
  id: "chatgpt-ads",
  path: "/learn/system-design/chatgpt-ads",
  title: "ChatGPT Ads: a system introduction",
  shortTitle: "ChatGPT Ads",
  description:
    "Map the ChatGPT Ads experience, advertiser controls, measurement and reporting interfaces, then follow them into the software you can build.",
  trackId: "system-design",
  publicationStatus: "published",
  format: "Platform introduction",
  readingMinutes: 10,
  updatedAt: "2026-11-08",
  objectives: [
    "Separate the ad experience from the configuration, measurement and reporting interfaces.",
    "Identify the evidence and access needed before implementing a connector.",
    "Locate the reporting workflow across the five engineering tracks.",
  ],
  prerequisiteConceptIds: [],
  conceptIds: ["api-contracts", "reporting-evidence"],
  projectIds: [],
  platformIds: ["chatgpt-ads"],
  publicationIds: ["christmas-pilot"],
  capabilityIds: [],
  videoIds: [],
  relatedGuideIds: ["advertising-platforms", "api-design"],
  introduction:
    "Start with the experience people see, then trace the controls and evidence available to the advertiser. This introduction maps the documented surface of ChatGPT Ads and the practical systems we will build around it.",
  sections: [
    {
      id: "the-ad-experience",
      title: "The ad experience",
      blocks: [
        { type: "paragraph", text: "OpenAI describes ChatGPT advertising around moments when people explore options, compare alternatives and make decisions in a conversation. That makes the surrounding task and context part of the starting point for understanding an ad’s relevance.", source: { title: "ChatGPT advertiser overview", href: "https://ads.openai.com/" } },
        { type: "paragraph", text: "For a builder, the important questions are practical: which advertiser inputs are exposed, which interactions are measured, and which results can an integration retrieve? The public interfaces let us reason about those boundaries without claiming to know the private ranking model or serving infrastructure." },
      ],
    },
    {
      id: "visual-deep-dive",
      title: "Decompose the ad system",
      blocks: [{ type: "ads-architecture" }],
    },
    {
      id: "advertiser-controls",
      title: "Advertiser controls and system boundaries",
      blocks: [
        { type: "flow", label: "Conceptual workflow — not a diagram of OpenAI’s internal services", steps: ["Configure campaigns & ads", "Deliver in the user experience", "Collect measurement events", "Retrieve & review results"] },
        { type: "paragraph", text: "The documented hierarchy is ad account → campaign → ad group → ad. The Advertiser API exposes campaign management and reporting. Keep resource identity, configuration and performance observations distinct when designing your own application.", source: { title: "Advertiser API and campaign structure", href: "https://developers.openai.com/ads/api-overview" } },
        { type: "paragraph", text: "The measurement pixel and Conversions API provide paths for website and backend conversion events. Sending those events is a separate operation from asking for an advertising report.", source: { title: "Measurement interfaces", href: "https://developers.openai.com/ads" } },
        { type: "paragraph", text: "An Ads API key is scoped to an ad account and belongs on the server. A general ChatGPT account does not establish advertiser API access. Verify the account and the capabilities needed for the integration before attempting a live workflow.", source: { title: "Advertiser API authentication", href: "https://developers.openai.com/ads/api-reference/authentication" } },
      ],
    },
    {
      id: "reporting-and-retrieval",
      title: "Reporting and complete retrieval",
      blocks: [
        { type: "paragraph", text: "General Insights supports account, campaign, ad-group and ad reporting. Choose the entity scope and row grain explicitly, and retain the account currency and reporting timezone. Recent delivery, cost and conversion values can update at different speeds.", source: { title: "Reporting semantics and freshness", href: "https://developers.openai.com/ads/reporting" } },
        { type: "paragraph", text: "General Insights responses are paginated. Follow the endpoint’s continuation rules to retrieve the requested population; a first page or a display limit is not a complete report.", source: { title: "Insights reference", href: "https://developers.openai.com/ads/api-reference/insights" } },
        { type: "paragraph", text: "The dedicated conversion report has a different boundary: an oversized result can return HTTP 413 without a partial report or pagination cursor. The documented recovery is to split entity lists or use smaller, non-overlapping date ranges. A connector must implement the rule for the endpoint it actually calls.", source: { title: "Conversion report size limits", href: "https://developers.openai.com/ads/reporting" } },
        { type: "callout", title: "The first implementation problem", text: "Build a report you can account for: requested scope, retrieved pages or partitions, missing evidence, freshness and the reason execution stopped. The API-design guide establishes that contract. The runnable connector and ingestion workflow are still planned." },
      ],
    },
    {
      id: "optimisation-and-evidence",
      title: "Optimisation and evidence",
      blocks: [
        { type: "paragraph", text: "Keep the delivery objective, billing basis and reporting interpretation separate. The documented conversion-optimised CPC option targets a selected conversion event while charging for valid clicks; it requires eligible account access and conversion tracking. Optimising for an outcome does not make a reported conversion evidence of causal lift.", source: { title: "Conversion-optimised campaign requirements", href: "https://developers.openai.com/ads/conversion-optimized-campaigns" } },
        { type: "paragraph", text: "Our measurement references will examine which signals a decision uses, how late data changes the picture, and what comparison would support an incrementality claim. The first connector should preserve those observations rather than manufacture an optimisation recommendation from incomplete results." },
      ],
    },
    {
      id: "across-five-tracks",
      title: "One platform across five tracks",
      blocks: [
        { type: "table", columns: ["Track", "Practical focus", "Current starting point"], rows: [
          ["Platforms & System Design", "Map delivery, measurement, reporting and their interfaces.", "This introduction and the API-design preview."],
          ["Algorithms & Data", "Traverse pages, deduplicate observations and aggregate at the correct grain.", "Existing visualizers; reporting-specific implementations are planned."],
          ["Software Design & Production", "Schedule ingestion, checkpoint progress, retry safely and observe missing data.", "Track introduction; a production ingestion build is planned."],
          ["Measurement & ML", "Preserve metric meaning and evaluate optimisation decisions.", "Track introduction; platform-specific measurement references are planned."],
          ["AI Engineering & Harnesses", "Build the integration with coding agents, then expose bounded operations to agents.", "Existing control-plane reference; reporting CLI/MCP adapters are planned."],
        ] },
      ],
    },
  ],
};
