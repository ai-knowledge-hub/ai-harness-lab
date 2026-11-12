import type { Guide } from "../guide-types";

export const advertisingPlatformsGuide = {
  id: "advertising-platforms",
  path: "/learn/system-design/advertising-platforms",
  title: "How advertising platforms work",
  shortTitle: "Advertising platforms",
  description:
    "See how platforms choose ads, what people see and which results advertisers can measure.",
  trackId: "system-design",
  kind: "overview",
  publicationStatus: "published",
  format: "Platform overview",
  readingMinutes: 7,
  updatedAt: "2026-11-07",
  objectives: [
    "Follow an ad from campaign setup to the performance report.",
    "See which actions show up in the data you can collect.",
    "Choose what to explore next, from collecting reports to testing campaign changes.",
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
    "An advertising platform brings a campaign into something a person is already doing, such as searching, watching a video or asking for advice. How the platform picks and shows an ad affects what you can learn from the campaign report.",
  sections: [
    {
      id: "start-with-the-user",
      title: "Start with the user experience",
      blocks: [
        { type: "paragraph", text: "Begin with what the person is doing: searching for an answer, watching a video, browsing a feed, comparing a product or asking for advice. An ad occupies a particular place in that experience. Where the ad appears shapes what it can look like, what people can do with it and what you can measure." },
        { type: "paragraph", text: "Ask where an ad can appear, which ads qualify and which settings you can change. Then check what the platform counts. An impression records an ad being shown. A conversion is an action you measure, such as a purchase or signup. Each platform has its own rules for counting them." },
      ],
    },
    {
      id: "map-the-system",
      title: "From setting up an ad to reading the report",
      blocks: [
        { type: "flow", label: "A simplified view of how advertising works", steps: ["Set up the campaign", "Choose and show ads", "Measure what people do", "Review results"] },
        { type: "paragraph", text: "You set the campaign goal, choose the ad content (the creative), set limits on who can see it and decide how much to spend. The platform chooses which ad to show from the ones that qualify. It records actions and groups them into results you can use." },
        { type: "paragraph", text: "Results feed back into later decisions about bids, budgets and ads. How useful they are depends on your goal, how well the numbers capture it, how quickly they arrive and which settings you can change." },
        { type: "callout", title: "What to check before using a report", text: "When you pull reports into your own tools, check what each number means, whether you have every batch and whether recent figures might change." },
      ],
    },
    {
      id: "platform-landscape",
      title: "What to ask about each platform",
      blocks: [
        { type: "table", columns: ["Platform", "Where people see ads", "Questions to ask"], rows: [
          ["Google Ads", "Search, YouTube and other places Google shows ads.", "How do campaign type and placement affect where ads show, how reports group results and which metrics you can compare?"],
          ["Meta", "Advertising within social experiences, including Facebook and Instagram.", "How do the ad, campaign goal and measured actions relate to the results in the report?"],
          ["Amazon Ads", "Advertising around shopping and media experiences.", "What can you learn from campaign reports, and when do you need to combine data or build audiences?"],
          ["TikTok", "Ads as people discover and watch videos.", "Which views, interactions and later actions can your software collect?"],
          ["ChatGPT Ads", "Advertising in the context of exploration and decisions in a conversation.", "How are ads chosen, what can advertisers change and what can they measure?"],
          ["Programmatic: DV360 & The Trade Desk", "Buying and measuring ads across many publishers’ sites and apps.", "Which tools let you set up campaigns, create reports and download every batch of results?"],
        ] },
        { type: "paragraph", text: "Use these questions to compare platforms. Check each platform’s rules for choosing ads, organising campaigns and deciding which ads get credit for a conversion." },
        { type: "paragraph", text: "Amazon Marketing Cloud helps advertisers analyse data and build audiences alongside their campaign reports. It’s a clean room, a controlled space for working with data under privacy rules.", source: { title: "Amazon Marketing Cloud overview", href: "https://advertising.amazon.com/solutions/products/amazon-marketing-cloud" } },
      ],
    },
    {
      id: "from-report-to-integration",
      title: "Connect your own software to a platform",
      blocks: [
        { type: "paragraph", text: "Setting up ads, sending records of actions and collecting performance results are separate jobs. They may use different APIs, which are the ways your software asks the platform for data or actions. For example, Google directs DV360 performance reporting to the Bid Manager API. Campaign management uses the Display & Video 360 API.", source: { title: "DV360 reporting boundary", href: "https://developers.google.com/display-video/api/support/faq?hl=en" } },
        { type: "list", items: [
          "Choose the account and dates. Decide how to group results, such as by campaign and day, and check each metric’s units and meaning.",
          "Keep track of which batches you’ve collected, which reports are still running and why any data is missing.",
          "Save the original results, avoid counting a record twice and make it possible to pick up after an interruption.",
          "Flag late or revised data. A successful request can return figures that will still change.",
          "When you use a report to make a decision, explain what it covers and what is still uncertain.",
        ] },
        { type: "paragraph", text: "Pagination fetches the next batch of the same report. Splitting a request asks for several smaller reports. Streaming lets you read a large file as it arrives. Whichever approach you use, check that you have every batch you asked for." },
      ],
    },
    {
      id: "first-platform",
      title: "Start with ChatGPT Ads",
      blocks: [
        { type: "paragraph", text: "The ChatGPT Ads guide follows an ad from the conversation where it might appear to the report an advertiser can read. The reporting example shows how your software can ask for daily campaign results and flag gaps." },
        { type: "paragraph", text: "Start with the platform guide to see how the parts fit together. If you’re already working on a reporting tool, start with the API design principles." },
      ],
    },
  ],
} satisfies Guide;

export default advertisingPlatformsGuide;
