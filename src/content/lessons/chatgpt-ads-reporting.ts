import type { Guide } from "../guide-types";

export const chatgptAdsReportingGuide = {
  id: "chatgpt-ads-reporting", path: "/learn/system-design/chatgpt-ads-reporting",
  title: "How to collect ChatGPT Ads reports", shortTitle: "Reporting example",
  description: "Request campaign results, check which data you received and show readers what is missing.",
  trackId: "system-design", kind: "case", publicationStatus: "draft", format: "Worked example", readingMinutes: 11, updatedAt: "2026-11-09",
  objectives: ["Turn a question about daily campaign spend into an Insights request.", "Collect the result in batches and show which rows, dates, or metrics are missing.", "Decide whether the result is ready for a decision or safe to pass to an agent."],
  prerequisiteConceptIds: ["http-basics"], conceptIds: ["api-contracts", "reporting-evidence"], projectIds: ["advertising-reporting", "local-reporting-adapters", "live-advertising-reporting"], platformIds: ["chatgpt-ads"], publicationIds: ["christmas-pilot"], capabilityIds: ["auth-review"], videoIds: ["api-design-walkthrough"],
  relatedGuideIds: ["api-design", "chatgpt-ads-apis", "chatgpt-ads", "advertising-platforms"],
  introduction: "Build a read-only report of daily spend by campaign. Return the rows you received, their totals, and enough detail to tell whether the report is complete and current. Try the collector locally with fictional data. Live setup is in development and requires verified advertiser API access.",
  sections: [
    { id: "scope-the-operation", title: "Decide what the report should cover", blocks: [
      { type: "paragraph", text: "Start with results by campaign and day for one ad account you have permission to use. Choose the dates and metrics, then keep the account’s time zone, currency and the time you collected the data with the report. A live request needs separate Advertiser API access.", source: { title: "Reporting definitions and data updates", href: "https://developers.openai.com/ads/reporting" } },
      { type: "flow", label: "Harness example of how to collect and save a report", steps: ["Request data from your server", "Collect results in batches", "Save data and progress", "Show results and gaps"] },
      { type: "paragraph", text: "Reports show totals for the campaigns or ads you ask about. Individual conversations, the ads considered for them and their ranking scores stay inside the platform. Keep the Ads API key, a secret your software uses to sign in, on your server.", source: { title: "Authentication and account scope", href: "https://developers.openai.com/ads/api-reference/authentication" } },
      { type: "paragraph", text: "Define the result before choosing the interface. Return the requested scope, the scope actually covered, and a status with the reason collection stopped. A subtotal should identify the rows it covers so the caller can tell whether it answers the original question." },
    ] },
    { id: "provider-request", title: "Ask Insights for daily campaign results", blocks: [
      { type: "paragraph", text: "Insights is the part of the Ads API that returns performance reports. This request asks for one row per campaign per day, with the campaign ID, date, impressions, clicks and spend.", source: { title: "Insights request reference", href: "https://developers.openai.com/ads/api-reference/insights" } },
      { type: "code", label: "Example API request · sample dates", language: "http", code: 'GET https://api.ads.openai.com/v1/ad_account/insights\n\naggregation_level=campaign\ntime_granularity=daily\nfields[]=metadata.readable_time\nfields[]=campaign.id\nfields[]=campaign.impressions\nfields[]=campaign.clicks\nfields[]=campaign.spend\ntime_ranges[]={"type":"unix_range","start":1793491200,"end":1793577600}\n\n# Query values must be URL-encoded.\n# Authorisation is supplied by your server, never this page.' },
      { type: "paragraph", text: "This request covers 1 November 2026 in UTC, the time standard used for the example. The end time is midnight at the start of 2 November, so the request excludes that day. Check the account’s reporting time zone if you want a local calendar day. The download labels OpenAI’s request fields and our own report fields separately." },
    ] },
    { id: "complete-retrieval", title: "Check that you have every batch", blocks: [
      { type: "table", columns: ["Interface", "How to get the full result"], rows: [
        ["General Insights", "Insights sends results in batches called pages. Save first_id, last_id and has_more. If has_more is true, send the same request with after set to the last_id from that page. Stop when has_more is false."],
        ["Dedicated conversion report", "A request to POST /conversions/insights can return error 413 if the report is too large. In that case you get no rows or marker for a next page. Split the request by campaign or other ID, or use shorter date ranges that do not overlap."],
        ["Local sample collector", "Track the page markers already seen and the campaign and date pairs already accepted. Stop on a repeated marker or duplicate row and retain the earlier valid batches."],
      ] },
      { type: "paragraph", text: "Pagination means asking for the next page of the same result. Splitting an oversized conversion report means making several smaller requests and combining their results. Use the rules for the report you asked for.", source: { title: "Reporting limits", href: "https://developers.openai.com/ads/reporting" } },
    ] },
    { id: "application-result", title: "Show what your report is missing", blocks: [
      { type: "code", label: "Sample report from Harness · made-up data", language: "json", code: '{\n  "reference_kind": "illustrative-reporting-envelope",\n  "account_ref": "sample-account",\n  "status": "partial",\n  "coverage": {"completed_partitions": 2, "expected_partitions": 3},\n  "missing_partitions": ["campaign-group-c"],\n  "stop_reason": "retry_budget_exhausted"\n}' },
      { type: "paragraph", text: "In this example, two of three batches are ready and the remaining batch is named. Give temporary failures a bounded retry budget. If access is denied or the results cannot be validated, stop and return the batches you already accepted with the reason the report is incomplete." },
      { type: "paragraph", text: "To resume across runs in production, save the original request, accepted batches, and the next cursor. Use the campaign and date to avoid counting a row twice within this report. When figures arrive late, reconcile the newer snapshot for the same scope instead of adding both snapshots together." },
      { type: "callout", title: "Try a retry or a partial run", text: "The local collector can retry a simulated temporary failure and return accepted rows when it stops early. Each invocation starts a fresh run. Durable checkpoints and live deployment are in development." },
    ] },
    {
      id: "report-outcomes",
      title: "Can you use this report?",
      blocks: [{ type: "ads-reporting-reference" }],
    },
    {
      id: "interpret-metrics",
      title: "Interpret credited conversions",
      blocks: [
        { type: "paragraph", text: "Before comparing reports, check that the account, dates, time zone, currency, and attribution settings match. Check coverage and freshness too. An unavailable conversion count represents missing information. A newer snapshot may have a different count for the same dates." },
        { type: "paragraph", text: "An attributed conversion is an action the platform credits to an ad under its reporting rules. To estimate how many additional sales the campaign caused, define the outcome and compare it with a credible estimate of what would have happened without the campaign. A suitable holdout can provide that comparison." },
      ],
    },
    {
      id: "bounded-agent-tool",
      title: "Give an agent a bounded reporting tool",
      blocks: [
        { type: "paragraph", text: "Give the tool one job: read a campaign report within an explicit scope. For a live design, the service should enforce account access and request limits. Return the scope, status, coverage, and freshness alongside the values so an agent can explain an incomplete result before recommending a decision." },
        { type: "paragraph", text: "The local MCP tool reads the bundled fictional reports. Its inputs select a scenario and a page limit. Try the partial scenario and check whether the agent can explain which totals are available and why collection stopped. The collector and adapter run instructions are below." },
      ],
    },
    { id: "reference-downloads", title: "Reference downloads", blocks: [{ type: "reference-downloads", collection: "reporting" }] },
  ],
} satisfies Guide;

export default chatgptAdsReportingGuide;
