# Google Ads daily campaign reporting

Scoped case brief for [issue #32](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/32). Google Ads is the proposed second provider because the same campaign-day question can test the existing reporting principles while exposing different rules for access, page retrieval, and metric meaning. This brief uses public documentation and a fictional example. Live access and provider responses have yet to be verified.

## The report

A growth practitioner asks, “What did each campaign spend on each of the last two completed account days, and how many impressions, clicks, and conversions did Google Ads credit?” Start with one client account and one row per campaign per date. Record the account, its time zone and currency, the date range, when the data was fetched, and whether the read finished. Use impressions, clicks, and spend to explain delivery. Treat credited conversions as a platform measure and use a separate comparison to estimate lift.

Get `customer.id`, `customer.currency_code`, and `customer.time_zone` from the target account. For a fictional account in London on 3 November, the two completed account days are 1 and 2 November. Use explicit account dates. The bounds in this Google Ads Query Language (GAQL) example include both dates. [Account fields](https://developers.google.com/google-ads/api/fields/v25/customer) · [Query structure](https://developers.google.com/google-ads/api/docs/query/structure)

```sql
SELECT
  campaign.id,
  segments.date,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions
FROM campaign
WHERE segments.date BETWEEN '2026-11-01' AND '2026-11-02'
ORDER BY segments.date, campaign.id
```

## What carries over from ChatGPT Ads

| Decision | Reuse from Harness | Google Ads detail |
| --- | --- | --- |
| Who may read which account? | Keep the requesting identity and account scope explicit. Enforce the operation's read boundary on the server if it becomes a live tool. | The request uses OAuth 2.0 and a developer token. The client customer ID identifies the account being queried. When access is through a manager, `login-customer-id` identifies that manager and can differ from the target. Check both the authorised relationship and the target. [Google Ads authorization](https://developers.google.com/google-ads/api/rest/auth) |
| What defines one row? | Use a stable provider/account/entity/date key and retain the definitions alongside the values. | `FROM campaign` with `segments.date` gives the campaign-day grain for this query. Keep spend as integer micros (millionths of the account currency) until display. A day with no returned row is different from a returned row with zero conversions. Segmented queries can omit rows where all selected metrics are zero. [Query structure](https://developers.google.com/google-ads/api/docs/query/structure) · [Zero metrics](https://developers.google.com/google-ads/api/docs/reporting/zero-metrics) |
| How do we know the read finished? | Bound the run, accept only validated batches, and record why collection stopped. | Start with `GoogleAdsService.Search`. Keep the query identical across requests and pass REST's `nextPageToken` back as `pageToken`. The last response has no next token. Search uses fixed pages of up to 10,000 rows. Evaluate `SearchStream` for larger reports in a separate step, with its own rules for restarting an interrupted stream. [Paging](https://developers.google.com/google-ads/api/docs/reporting/paging) · [Streaming](https://developers.google.com/google-ads/api/docs/reporting/streaming) |
| What should happen on failure? | A partial result shows accepted rows and a stop reason. Keep totals for those rows separate from a complete report. | Stop on permission or query validation errors and explain what to correct. Back off only for transient failures within a fixed budget. Distinguish a brief rate limit from exhausted quota. If a saved token is rejected, restart the bounded query as a new snapshot. Keep partial rows separate from the replacement run. [Error types](https://developers.google.com/google-ads/api/docs/best-practices/error-types) · [Common errors](https://developers.google.com/google-ads/api/docs/common-errors) |
| How fresh are the numbers? | Record collection time separately from coverage. Reconcile a later snapshot of the same period instead of adding it to the earlier snapshot. | `metrics.conversions` counts the configured actions included in the Conversions metric. The default reporting date follows the ad interaction. `metrics.conversions_by_conversion_date` answers a different date question. Keep fractional credit and record the chosen metric and date basis. Conversions and other metrics can change after a complete read. [Metrics](https://developers.google.com/google-ads/api/reference/rpc/v25/Metrics) · [Conversion reporting](https://support.google.com/google-ads/answer/6270625) · [Data freshness](https://support.google.com/google-ads/answer/2544985) |

The worked case can use the existing System design, Algorithms & Data, Software & production, and Measurement & ML sections to explain the contract, batch boundaries, recovery, and interpretation. AI Engineering can link to the same case when it explains a bounded reporting tool. The Google query, account metadata, page tokens, zero-row handling, and conversion settings belong in the provider reference. Check what the shared collector can reuse after the two adapters' assumptions are explicit. [Current worked case](https://harness.ai-knowledge-hub.org/learn/system-design/chatgpt-ads-reporting)

## Fictional fixture and expected results

Use account currency GBP and time zone Europe/London. The small page boundary is deliberate so a reader can inspect both batches. Page 1 returns a fictional next token and page 2 ends the read. Campaign 102 on 2 November is absent from the fixture. Preserve that absence rather than filling in a zero row.

| Page | Date | Campaign | Impressions | Clicks | Cost in micros | Credited conversions |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 1 | 2026-11-01 | 101 | 1,000 | 40 | 12,500,000 | 1.5 |
| 1 | 2026-11-01 | 102 | 400 | 12 | 5,250,000 | 0 |
| 2 | 2026-11-02 | 101 | 600 | 18 | 7,250,000 | 0.5 |

- **Complete.** Three rows, 2,000 impressions, 70 clicks, £25.00 spend, and 2 credited conversions.
- **Interrupted.** Page 2 fails after bounded retries. Report 1,400 impressions, 52 clicks, £17.75 spend, and 1.5 credited conversions across the received rows. Mark the result partial and leave whole-report totals unset.
- **Empty or refused.** A successful query ending with no rows is empty. A permission error is refused and has no report totals.
- **Refreshed.** In a later run for the same dates, change the last row to 1.5 credited conversions. The latest complete snapshot has 3 credited conversions and £25.00 spend. Show the difference and keep the earlier snapshot available for comparison.

This gives the follow-up an offline acceptance example. A live adapter needs a separate read-only access check, a pinned supported API version, field compatibility validation, and a comparison against an authorised account report with matching dates and metric settings.
