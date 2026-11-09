export const chatgptAdsApisGuide = {
  id: "chatgpt-ads-apis", path: "/learn/system-design/chatgpt-ads-apis",
  title: "ChatGPT Ads APIs for advertisers", shortTitle: "Advertiser APIs",
  description: "See which ChatGPT Ads tools let you set up ads, send conversion data and read performance reports.",
  trackId: "system-design", kind: "capabilities", publicationStatus: "published", format: "Advertiser API guide", readingMinutes: 6, updatedAt: "2026-11-08",
  objectives: ["Find the right API for the job you want to do.", "Check what data you can send or receive.", "See what access each tool requires."],
  prerequisiteConceptIds: [], conceptIds: ["api-contracts"], projectIds: [], platformIds: ["chatgpt-ads"], publicationIds: [], capabilityIds: [], videoIds: [],
  relatedGuideIds: ["chatgpt-ads", "api-design", "chatgpt-ads-reporting"],
  introduction: "Use this map to find the tool for your task. An API is how your software asks a platform for data or sends it instructions. ChatGPT Ads has separate tools for changing ad settings, sending records of actions like purchases and reading campaign results.",
  sections: [
    { id: "capability-map", title: "What advertisers can do", blocks: [{ type: "ads-capabilities" }] },
    { id: "internal-versus-public", title: "How to read the internal tools in our examples", blocks: [
      { type: "paragraph", text: "OpenAI describes how its system finds, checks and ranks ads before an auction. The exact messages those parts exchange are private. Names like prepare_queries, embed and final_gate belong to our example of how a system like this might work.", source: { title: "OpenAI engineering account", href: "https://openai.com/index/building-chatgpt-ad-stack/" } },
      { type: "callout", title: "What the reporting case can answer", text: "How often were your ads shown and how much did you spend in the campaigns and dates you chose? Conversation details, relevance scores and the reasons for individual auction results stay inside the platform." },
    ] },
    { id: "reference-downloads", title: "API documentation and downloads", blocks: [{ type: "reference-downloads", collection: "capabilities" }] },
  ],
};
