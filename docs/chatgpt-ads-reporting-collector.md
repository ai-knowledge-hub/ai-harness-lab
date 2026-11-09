# Local ChatGPT Ads reporting collector

The collector is a runnable reference for [issue #15](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/15). It reads the same fictional campaign pages used by the local experiment. It runs in Node.js 20 or later with no dependencies to install, credentials to configure or network requests.

From the repository root:

```sh
node scripts/collect-chatgpt-ads-report.mjs
```

The command prints one JSON report to stdout. It defaults to the `complete` scenario. To see the command recover when the second page fails once, run:

```sh
node scripts/collect-chatgpt-ads-report.mjs retry
```

| Scenario or option | Expected result |
| --- | --- |
| `complete` | Two pages and three rows. 2,300 impressions, 64 clicks, £36.00 spend and an unavailable conversion total. |
| `empty` | One empty final page and no totals. |
| `partial` | The second page is missing. The report keeps the first two rows, £30.50 across those rows and the cursor for the missing page. |
| `refreshed` | A separate snapshot for the same dates. Three rows, £36.30 spend and three credited conversions. |
| `retry` | The second page succeeds on its second attempt. The report matches the complete totals after three requests in all. |
| `retry-exhausted` | Three attempts on the second page fail. The report keeps the first page and stops after four requests in all. |
| `rejected` | The first request is refused. The collector stops after one attempt and returns no totals. |
| `cancelled` | A simulated cancellation interrupts the second request. The report keeps the first page and its next cursor. |
| `complete --max-pages 1` | The page limit stops collection after one page. The report is partial. |

## Reading the output

The report format is versioned with `schema_version`. It records the provider, fictional account, reporting dates, time zone, GBP and the settings used to credit conversions. The end date is exclusive. `retrieved_at` is the simulated collection time from the fixture. The refreshed scenario keeps the reporting dates fixed and uses a later collection time.

`coverage` gives the number of accepted pages, requests made, retries made, the next cursor and why collection stopped. `received_totals` covers the accepted rows. Only a complete report supplies totals for the full returned period. If any row has an unavailable conversion count, the overall count is also unavailable. A credited conversion follows the chosen attribution rules. Estimating additional sales requires a comparison.

The collector accepts up to 10 pages by default. Set `--max-pages` to an integer from 1 to 20. Each page has at most three attempts, and only a simulated temporary failure is retried. A rejected request, missing page, invalid page or repeated cursor stops collection. If a page repeats a campaign and day already collected, the collector rejects that page as a whole and preserves earlier results.

Press Ctrl+C during a run to cancel. The fixture reader observes the cancellation signal, and the collector returns any previously accepted pages. The command exits with `0` for complete and empty reports, `1` for partial, rejected or failed reports, `2` for invalid command arguments and `130` for cancellation. Check the status and stop reason before using the totals. Each invocation starts a fresh collection.

## Where the code belongs

Harness owns this local reference, its synthetic fixture and the interactive guide. The terminal command adapts the fixture to the collector in `scripts/reporting/collect.mjs`. The collector handles page retrieval and report assembly independently of argument parsing and console output. That separation gives the later CLI and MCP work in [issue #16](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/16) one operation to adapt.

The website displays its own prepared examples. The collector lives under `scripts/` and runs from a checkout, outside the website build. Live account access, authentication and reporting behaviour remain unverified and are tracked in [issue #13](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/13). Any future live adapter needs separate account verification and server-side credentials, along with limits and cancellation that apply to network requests.
