# ChatGPT Ads reporting experiment

## Account findings from 9 November 2026

This record supports [issue #13](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/13). We signed in to the AI Knowledge Hub advertiser account in Ads Manager. Its region was United Kingdom, its currency GBP and its reporting time zone London. Ads Manager showed the account under review, with billing setup and a business logo required for ads to serve.

| Area | What we observed |
| --- | --- |
| Campaigns and reporting | The campaign table was empty. Ads Manager showed campaign, ad group and ad views, a date picker and columns for impressions, clicks, spend and conversions. |
| Attribution | The column selector offered separate click-through and view-through conversion columns. The selected windows were 30 days after a click and one day after a view. |
| Export | The menu offered current-table and daily-value exports. Trying the current-table export returned “No data available to download.” |
| Conversion measurement | The Conversions page showed zero events, no data sources and no active campaigns. It offered tabs for conversion events, the event stream and diagnostics. |
| Advertiser API | General settings offered key creation and showed no existing advertiser API keys. Authentication and the account’s live Insights response remain unverified. |

The experiment runs in a local terminal using fictional data. The script, sample data and account notes stay outside the website build. The account inspection involved browsing Ads Manager and trying the empty export. The scope excludes campaign creation, billing, event submission and credential creation.

## Run the experiment

From the repository root, run:

```sh
node scripts/chatgpt-ads-reporting-experiment.mjs
```

This prints all four reports as JSON. Append `empty`, `partial`, `complete` or `refreshed` to inspect a single case. The script needs only Node.js and the checked-in [sample data](../scripts/fixtures/chatgpt-ads-reporting.json).

The fictional advertiser asks for daily campaign results on 1 and 2 November in London time. Every report carries that scope, GBP, the attribution settings and the time of collection. The example follows the documented Insights pagination pattern. When a page says more results exist, the next request uses that page’s `last_id` as its `after` cursor. The JSON printed by the script is our own report format. [OpenAI Insights reference](https://developers.openai.com/ads/api-reference/insights)

| Case | Expected result |
| --- | --- |
| Empty | The only page contains zero rows and says there are no further pages. The report has no totals. |
| Partial | Two rows arrive, then the requested page is missing. The report records the next cursor and shows £30.50 spend across the rows received. |
| Complete | Both pages arrive with three distinct campaign-day rows. The report shows 2,300 impressions, 64 clicks and £36.00 spend. One row records zero conversions and another has an unavailable conversion count, so the combined conversion count is unavailable. |
| Refreshed | A fresh read of the same period returns three rows, with 2,310 impressions, 66 clicks, £36.30 spend and three attributed conversions. Compare this snapshot with the original to see which figures changed. |

`received_totals` always covers the rows collected in that run. Check `status` before interpreting it as a total for the requested period. Here, a complete report means we reached the final page. Figures can still change after that. The refresh is a separate snapshot of the same dates, so its rows are never added to the original report. [OpenAI reporting documentation](https://developers.openai.com/ads/reporting)

The experiment checks whether we can collect and explain a report. Its conversion figures illustrate credited actions. The Christmas pilot’s question about additional sales would require a comparison and reconciled merchant orders. [Christmas pilot article](https://ai-knowledge-hub.org/library/chatgpt-ads-christmas-pilot/)

Issue #13 remains open for the broader capability research and live API access checks. The empty account gives us a real example of what a marketer sees before any delivery. The synthetic runs give us repeatable examples for the reporting guide and future collector.
