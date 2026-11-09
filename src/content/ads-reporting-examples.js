// Prepared editorial examples for the guide. The local experiment has its own fixtures.
export const reportingExamples = [
  {
    id: "complete",
    title: "Complete report",
    signal: "The final batch arrived",
    result: "Both batches arrived, giving you three rows. Each row covers one campaign and day.",
    facts: [
      ["Impressions", "2,300"],
      ["Clicks", "64"],
      ["Spend", "£36.00"],
      ["Credited conversions", "Total unavailable"],
    ],
    meaning: "One row shows zero conversions and another has no conversion count. The spend total covers all the returned rows, but there isn’t enough information to add up conversions.",
    action: "Use the spend total for the requested period. Record when you collected it and check for later updates before using recent figures to make a decision.",
  },
  {
    id: "empty",
    title: "Empty report",
    signal: "The request finished with zero rows",
    result: "The first batch was empty and said there were no more batches. There are no totals to show.",
    meaning: "No rows matched the request. That gives you no spend or conversion figures to interpret.",
    action: "Check the account, dates and filters. If those are right, report “no rows returned” and keep the totals blank.",
  },
  {
    id: "partial",
    title: "Partial report",
    signal: "Another batch is missing",
    result: "The first batch returned two rows and a marker for the next batch. The next batch never arrived.",
    facts: [
      ["Rows received", "2"],
      ["Spend in rows received", "£30.50"],
    ],
    meaning: "£30.50 is the subtotal for the rows you have. The spend for the full period is still unknown.",
    action: "Keep the original dates and filters and use the saved marker to retry the missing batch. If you can’t recover it, label the report partial and carry the gap into any summary.",
  },
  {
    id: "stale",
    title: "Stale report",
    signal: "All batches arrived, but the figures are old",
    result: "At a review on 5 November, the team still had a complete report collected on 3 November. They refreshed the same dates and received revised figures.",
    comparison: [
      ["Spend", "£36.00", "£36.30"],
      ["Credited conversions", "Unavailable", "3"],
    ],
    meaning: "Receiving every batch tells you the collection finished. It doesn’t tell you whether the platform has since updated the figures.",
    action: "Refresh the same request before using the old copy. Use the newer figures for the same dates, and retain both collection times so readers can see what changed.",
  },
  {
    id: "rejected",
    title: "Rejected request",
    signal: "The requester lacked access",
    result: "In this example, the reporting tool refused the request because the signed-in person didn’t have permission for the selected account. It returned no report.",
    meaning: "The tool stopped at its access check. There are no figures to interpret for that account.",
    action: "Check that you selected the right account and ask an account admin to confirm your access. Retry once the account or permission has been corrected.",
  },
];
