export const chatgptAdsReportingGuide = {
  id: "chatgpt-ads-reporting", path: "/learn/system-design/chatgpt-ads-reporting",
  title: "How to collect ChatGPT Ads reports", shortTitle: "Reporting example",
  description: "Request campaign results, check which data you received and show readers what is missing.",
  trackId: "system-design", kind: "case", publicationStatus: "draft", format: "Worked example", readingMinutes: 9, updatedAt: "2026-11-08",
  objectives: ["Turn a question about campaign performance into an Insights request.", "Know when to ask for the next batch and when to split a request into smaller ones.", "Show what the report covers and how recently you collected the data."],
  prerequisiteConceptIds: ["http-basics"], conceptIds: ["api-contracts", "reporting-evidence"], projectIds: ["advertising-reporting"], platformIds: ["chatgpt-ads"], publicationIds: ["christmas-pilot"], capabilityIds: ["auth-review"], videoIds: ["api-design-walkthrough"],
  relatedGuideIds: ["api-design", "chatgpt-ads-apis", "chatgpt-ads"],
  introduction: "Say you want to know what each campaign spent on a given day. This example shows how to ask OpenAI’s reporting API for the figures and check that you have every batch. The sample uses made-up data. Connecting a live account and running the software are planned work.",
  sections: [
    { id: "scope-the-operation", title: "Decide what the report should cover", blocks: [
      { type: "paragraph", text: "Start with results by campaign and day for one ad account you have permission to use. Choose the dates and metrics, then keep the account’s time zone, currency and the time you collected the data with the report. A live request needs separate Advertiser API access.", source: { title: "Reporting definitions and data updates", href: "https://developers.openai.com/ads/reporting" } },
      { type: "flow", label: "Harness example of how to collect and save a report", steps: ["Request data from your server", "Collect results in batches", "Save data and progress", "Show results and gaps"] },
      { type: "paragraph", text: "Reports show totals for the campaigns or ads you ask about. Individual conversations, the ads considered for them and their ranking scores stay inside the platform. Keep the Ads API key, a secret your software uses to sign in, on your server.", source: { title: "Authentication and account scope", href: "https://developers.openai.com/ads/api-reference/authentication" } },
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
        ["Our report collector", "Save the original request and each batch you finish so you can resume. If the same page marker keeps coming back or you run out of retries, stop and record what is missing."],
      ] },
      { type: "paragraph", text: "Pagination means asking for the next page of the same result. Splitting an oversized conversion report means making several smaller requests and combining their results. Use the rules for the report you asked for.", source: { title: "Reporting limits", href: "https://developers.openai.com/ads/reporting" } },
    ] },
    { id: "application-result", title: "Show what your report is missing", blocks: [
      { type: "code", label: "Sample report from Harness · made-up data", language: "json", code: '{\n  "reference_kind": "illustrative-reporting-envelope",\n  "account_ref": "sample-account",\n  "status": "partial",\n  "coverage": {"completed_partitions": 2, "expected_partitions": 3},\n  "missing_partitions": ["campaign-group-c"],\n  "stop_reason": "retry_budget_exhausted"\n}' },
      { type: "paragraph", text: "In this example, two of three batches are ready and the remaining batch is named. Save the request ID, the dates or IDs covered by each batch, and when you collected it. If you retry, avoid counting the same campaign and day twice. Getting the last page tells you the request is finished. Recent figures can still change, so decide when to refresh them." },
      { type: "callout", title: "What conversions tell you", text: "Attribution means the platform gives an ad credit for an action such as a purchase under its reporting rules. To estimate additional sales caused by the campaign, you need a comparison that helps estimate what would have happened without it. Show missing or late data and explain the metrics before using a report to suggest a budget or ad change." },
    ] },
    { id: "reference-downloads", title: "Reference downloads", blocks: [{ type: "reference-downloads", collection: "reporting" }] },
  ],
};
