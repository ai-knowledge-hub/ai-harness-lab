import { readFile } from "node:fs/promises";
import { campaignDayKey, summarizeRows } from "./reporting/rows.mjs";

const fixture = JSON.parse(await readFile(
  new URL("./fixtures/chatgpt-ads-reporting.json", import.meta.url),
  "utf8",
));

const scenarios = new Map([
  ["empty", fixture.empty],
  ["partial", { ...fixture.initial, pages: fixture.initial.pages.slice(0, 1) }],
  ["complete", fixture.initial],
  ["refreshed", fixture.refreshed],
]);

function collectReport(scenario, { pages, retrieved_at }) {
  const pagesByCursor = new Map(pages.map(({ after, response }) => [after, response]));
  const visitedCursors = new Set();
  const rowsByCampaignDay = new Map();
  let cursor = null;
  let pagesCollected = 0;
  let stopReason;

  while (true) {
    if (visitedCursors.has(cursor)) {
      stopReason = "repeated_cursor";
      break;
    }
    const page = pagesByCursor.get(cursor);
    if (!page) {
      stopReason = "missing_page";
      break;
    }

    for (const row of page.data) {
      const key = campaignDayKey(row);
      if (rowsByCampaignDay.has(key)) {
        throw new Error(`Duplicate campaign-day in the ${scenario} report: ${key}`);
      }
      rowsByCampaignDay.set(key, row);
    }
    visitedCursors.add(cursor);
    pagesCollected += 1;

    if (!page.has_more) {
      cursor = null;
      stopReason = "last_page";
      break;
    }
    cursor = page.last_id;
  }

  const rows = [...rowsByCampaignDay.values()];
  const status = stopReason !== "last_page" ? "partial" : rows.length ? "complete" : "empty";
  return {
    data_source: fixture.data_source,
    scenario,
    scope: fixture.scope,
    retrieved_at,
    status,
    coverage: { pages_collected: pagesCollected, next_cursor: cursor, stop_reason: stopReason },
    received_totals: summarizeRows(rows),
    rows,
  };
}

const [scenario, ...extraArgs] = process.argv.slice(2);
if (extraArgs.length || (scenario !== undefined && !scenarios.has(scenario))) {
  console.error("Usage: node scripts/chatgpt-ads-reporting-experiment.mjs [empty|partial|complete|refreshed]");
  process.exitCode = 1;
} else {
  const reports = scenario === undefined
    ? [...scenarios].map(([name, snapshot]) => collectReport(name, snapshot))
    : collectReport(scenario, scenarios.get(scenario));
  console.log(JSON.stringify(reports, null, 2));
}
