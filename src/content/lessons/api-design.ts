import type { Guide } from "../guide-types";

export const apiDesignLesson = {
  id: "api-design",
  path: "/learn/system-design/api-design",
  title: "API design principles",
  shortTitle: "API design",
  description: "Define what someone can ask an API to do, who has permission, and how to tell whether the task is finished.",
  trackId: "system-design",
  kind: "principle",
  publicationStatus: "published",
  format: "Reusable principles",
  readingMinutes: 8,
  updatedAt: "2026-11-08",
  objectives: ["Describe the task before choosing how to run it.", "Explain what the task covers, what it changes and when it is done.", "Use the same rules when a person, an app or an AI agent runs the task."],
  prerequisiteConceptIds: ["http-basics"],
  conceptIds: ["api-contracts"],
  projectIds: [], platformIds: [], publicationIds: ["tool-layer"], capabilityIds: [], videoIds: [],
  relatedGuideIds: ["chatgpt-ads-apis", "chatgpt-ads-reporting"],
  introduction: "An API (application programming interface) gives software a way to ask another system for data or to take an action. A good API tells you what you can ask for, what will change and what the result actually shows.",
  sections: [
    { id: "start-with-the-operation", title: "Start with the task", blocks: [
      { type: "paragraph", text: "Write down who is making the request, what it covers and what they should get back. “Get last week’s campaign results” and “change the campaign budget” can use the same API. One reads data and the other changes a setting." },
      { type: "flow", label: "What happens when you ask an API to do something", steps: ["Define the task", "Check permissions and details", "Run the task within its limits", "Explain the result"] },
      { type: "paragraph", text: "Put permission checks and limits in the code that runs the task. Those rules should apply whether someone uses a web request, a command-line interface (CLI) for typed commands, or an AI agent connected through the Model Context Protocol (MCP)." },
    ] },
    { id: "define-the-contract", title: "Define the contract", blocks: [
      { type: "paragraph", text: "A contract is the set of rules a request and its result must follow. For a report, it covers details such as who can ask for it, which dates it includes and how to tell whether data is missing." },
      { type: "table", columns: ["Part of the contract", "What to decide"], rows: [
        ["Identity and permission", "Who can make the request, which accounts or records they can use, and where the system checks permission."],
        ["Inputs", "What you must supply, what the system assumes if you leave something blank, and which units and dates it accepts."],
        ["Effects", "Whether the task reads data or changes it, and how to check what happened."],
        ["Results", "How to tell a finished task from an empty result, a partial result, a refused request or a service that could not respond."],
        ["Limits", "How much work the system will do, how long it will wait and how to continue or stop."],
        ["Source of the data", "Where the data came from, when it was recorded, what was changed and what is still uncertain."],
      ] },
      { type: "paragraph", text: "A server can successfully receive a request while the report is still being prepared. A valid account ID can belong to someone else. Make the result say whether the task is finished and whether the requester has permission." },
    ] },
    { id: "preserve-reporting-meaning", title: "Keep the meaning when data moves", blocks: [
      { type: "paragraph", text: "If you reformat a report or calculate a new metric, keep the original IDs and units alongside the result. Mark an unavailable number as missing so readers can distinguish it from a measured zero." },
      { type: "paragraph", text: "For a list or report, explain how results are ordered and how to tell when you have the last batch. For a change such as a budget update, explain how to recognise a repeat request. If the first attempt times out, check whether it took effect before trying again." },
      { type: "paragraph", text: "Give your report format a version so readers and software know how to interpret it. If you change what a field means, use a new version and explain the change. For example, a report grouped by the date of an ad interaction answers a different question from one grouped by the date of a purchase." },
    ] },
    { id: "make-failures-useful", title: "Make failures useful", blocks: [
      { type: "table", columns: ["Condition", "What the result should tell you"], rows: [
        ["Empty", "The system checked the requested account, dates or records and found no matches."],
        ["Partial", "Which results are available, which are missing and how to continue or why the task stopped."],
        ["Rejected", "What was wrong with the request or which permission is needed. Keep passwords, keys and private data out of the message."],
        ["Unavailable", "Whether you can safely try again, how many attempts to make and where to pick up."],
        ["Unconfirmed change", "A request ID and a way to check whether the change happened before you repeat it."],
      ] },
      { type: "paragraph", text: "Give people a short explanation. Give apps and agents a consistent code for each reason and a clear next step." },
    ] },
    { id: "connect-to-chatgpt-ads", title: "Apply the principles in a case", blocks: [
      { type: "paragraph", text: "The ChatGPT Ads reporting case shows how these rules work in practice. You choose the account and dates, collect every batch of results and make any gaps visible in the report." },
      { type: "callout", title: "Find the API you need", text: "Use the advertiser API guide to find the right tool. Open the reporting example for a sample request. The platform guide explains how ads are chosen, shown and measured." },
    ] },
  ],
} satisfies Guide;

export default apiDesignLesson;
