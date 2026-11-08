export const advertisingPlatformsGuide = {
  id: "advertising-platforms",
  path: "/learn/system-design/advertising-platforms",
  title: "How advertising platforms work",
  shortTitle: "Advertising platforms",
  description:
    "Follow an ad from advertiser intent to user experience, measurement and reporting. A system map for building integrations across advertising platforms.",
  trackId: "system-design",
  publicationStatus: "published",
  format: "Platform overview",
  readingMinutes: 7,
  updatedAt: "2026-11-07",
  objectives: [
    "Locate the delivery, measurement and reporting boundaries of an advertising system.",
    "Connect the user experience to the data your integration can observe.",
    "Choose where to go deeper: reporting contracts, ingestion or optimisation.",
  ],
  prerequisiteConceptIds: [],
  conceptIds: ["reporting-evidence"],
  projectIds: [],
  platformIds: ["google-ads", "meta-ads", "amazon-ads", "tiktok-ads", "chatgpt-ads", "dv360"],
  publicationIds: [],
  capabilityIds: [],
  videoIds: [],
  relatedGuideIds: ["chatgpt-ads", "api-design"],
  introduction:
    "An advertising platform connects an advertiser’s objective to a moment in someone’s experience. Understanding what happens between those two points helps you build better reporting, integrations and optimisation tools.",
  sections: [
    {
      id: "start-with-the-user",
      title: "Start with the user experience",
      blocks: [
        { type: "paragraph", text: "Begin with what the person is doing: searching for an answer, watching a video, browsing a feed, comparing a product or asking for advice. An ad occupies a particular place in that experience. The placement shapes the creative, the interaction and the evidence you can collect." },
        { type: "paragraph", text: "For each platform, ask the same practical questions: where can an ad appear, what makes it eligible, what can the advertiser influence, and what does an impression, click or conversion actually record? The answers determine what a useful report or integration must preserve." },
      ],
    },
    {
      id: "map-the-system",
      title: "Map the system boundaries",
      blocks: [
        { type: "flow", label: "Conceptual advertising system — an explanatory model, not a vendor’s internal architecture", steps: ["Advertiser configuration", "Ad selection & delivery", "Interaction & measurement", "Reporting & decisions"] },
        { type: "paragraph", text: "Configuration expresses the objective, creative, audience constraints and spending controls. Delivery decides which eligible ad to show in a particular context. Measurement records observations. Reporting aggregates those observations into results that people and software can act on." },
        { type: "paragraph", text: "There is a feedback loop: observed outcomes can inform future bids, budgets, creative and delivery. Its usefulness depends on the objective, the quality and delay of the signals, and the controls the platform exposes. A clean diagram should identify those boundaries before introducing implementation detail." },
        { type: "callout", title: "Where this reference goes deep", text: "Use the platform map for orientation. Go deeper where you need to build: reporting semantics, API contracts, complete retrieval, ingestion, operational reliability and evidence for optimisation decisions." },
      ],
    },
    {
      id: "platform-landscape",
      title: "Locate the platforms in the landscape",
      blocks: [
        { type: "table", columns: ["Platform", "Experience to examine", "Integration questions"], rows: [
          ["Google Ads", "Search, YouTube and other advertising surfaces.", "How do campaign type and placement change delivery, reporting grain and the metrics you can compare?"],
          ["Meta", "Advertising within social experiences, including Facebook and Instagram.", "How do creative, delivery objectives and measurement signals connect to the reported outcome?"],
          ["Amazon Ads", "Advertising around shopping and media experiences.", "Where do campaign reports end and cross-source analytics or audience workflows begin?"],
          ["TikTok", "Advertising within a video-led discovery experience.", "Which creative interactions, delivery signals and downstream events are available to the integration?"],
          ["ChatGPT Ads", "Advertising in the context of exploration and decisions in a conversation.", "What is documented about the experience, advertiser controls, measurement and reporting interfaces?"],
          ["Programmatic: DV360 & The Trade Desk", "Buying and measuring advertising across publisher inventory.", "Which interface owns configuration, report generation and complete retrieval for each provider?"],
        ] },
        { type: "paragraph", text: "Treat this as a map of questions, not a claim that these systems share one auction, entity hierarchy or attribution model. Each platform needs its own documented account of the parts exposed to advertisers and developers." },
        { type: "paragraph", text: "Amazon Marketing Cloud belongs inside the Amazon Ads picture as a clean room for analytics and audience creation. It complements campaign reporting; it does not stand for the entire ad-serving platform.", source: { title: "Amazon Marketing Cloud overview", href: "https://advertising.amazon.com/solutions/products/amazon-marketing-cloud" } },
      ],
    },
    {
      id: "from-report-to-integration",
      title: "Turn the map into an integration",
      blocks: [
        { type: "paragraph", text: "Separate three jobs: configuring advertising, sending measurement events, and retrieving performance. They can have different APIs, credentials, permissions, delays and failure modes. Google’s documentation, for example, directs DV360 offline performance reporting to the Bid Manager API rather than the Display & Video 360 resource-management API.", source: { title: "DV360 reporting boundary", href: "https://developers.google.com/display-video/api/support/faq?hl=en" } },
        { type: "list", items: [
          "Define the account, period, reporting grain, units and meaning of each requested metric.",
          "Retrieve the required population. Track pages, report jobs, missing segments and the reason a read stopped.",
          "Ingest results reproducibly: retain source evidence, prevent duplicates and make interrupted work resumable.",
          "Keep late or revised data visible. A successful request does not establish that a reporting period is final.",
          "Use the resulting evidence to support a decision, with the assumptions and limitations still attached.",
        ] },
        { type: "paragraph", text: "Pagination, splitting requests, streaming a large file and showing progress in a user interface solve different problems. Choose each deliberately. None, on its own, proves that the dataset is complete." },
      ],
    },
    {
      id: "first-platform",
      title: "Start with ChatGPT Ads",
      blocks: [
        { type: "paragraph", text: "Our first platform reference follows ChatGPT Ads from the documented advertiser surface into reporting and integration design. It connects to all five engineering tracks. The next guides will work through retrieval, ingestion, measurement and agent interfaces as those implementations become available." },
        { type: "paragraph", text: "Use the platform introduction for orientation, or go directly to API design if you already know the system boundary. Supporting case studies supply commercial context without making the reference depend on a particular campaign or season." },
      ],
    },
  ],
};
