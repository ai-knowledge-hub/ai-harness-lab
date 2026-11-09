import { campaignDayKey, summarizeRows } from "./rows.mjs";

const metricDefinitions = {
  impressions: { unit: "count", meaning: "Reported ad impressions" },
  clicks: { unit: "count", meaning: "Reported ad clicks" },
  spend: { unit: "GBP", meaning: "Reported media spend in pounds, summed in pence" },
  conversions: { unit: "count", meaning: "Goal conversions credited under the requested attribution settings" },
};

const maxAttempts = 3;
const isCount = (value) => Number.isSafeInteger(value) && value >= 0;

function pageKeys(page, scope, receivedKeys) {
  if (!Array.isArray(page?.data) || page.count !== page.data.length ||
      typeof page.has_more !== "boolean") return null;

  const first = page.data[0]?.id ?? null;
  const last = page.data.at(-1)?.id ?? null;
  if (page.first_id !== first || page.last_id !== last || (page.has_more && !last)) {
    return null;
  }

  const keys = new Set();
  for (const row of page.data) {
    if (typeof row?.id !== "string" || !row.id ||
        typeof row.campaign_id !== "string" || !row.campaign_id ||
        typeof row.readable_time !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(row.readable_time) ||
        row.readable_time < scope.start_date || row.readable_time >= scope.end_date_exclusive ||
        !isCount(row.impressions) || !isCount(row.clicks) ||
        !Number.isFinite(row.spend) || row.spend < 0 ||
        (row.conversions !== null && !isCount(row.conversions))) return null;

    const key = campaignDayKey(row);
    if (keys.has(key) || receivedKeys.has(key)) return null;
    keys.add(key);
  }
  return keys;
}

function reportStatus(reason, rowCount, pagesCollected) {
  if (reason === "last_page") return rowCount ? "complete" : "empty";
  if (reason === "cancelled" || reason === "rejected") return reason;
  return pagesCollected ? "partial" : "failed";
}

// readPage supplies a prepared page or a named failure. The synthetic reader
// settles promptly and observes the same cancellation signal as the collector.
export async function collectSyntheticReport({ scope, retrievedAt, readPage, signal, maxPages }) {
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 20) {
    throw new RangeError("maxPages must be an integer from 1 to 20");
  }

  const rows = [];
  const receivedKeys = new Set();
  const visitedCursors = new Set();
  let cursor = null;
  let requestsMade = 0;
  let retriesMade = 0;

  const finish = (reason) => ({
    schema_version: "1.0.0",
    data_source: "synthetic",
    provider: "chatgpt_ads",
    scope,
    metric_definitions: metricDefinitions,
    retrieved_at: retrievedAt,
    status: reportStatus(reason, rows.length, visitedCursors.size),
    coverage: {
      pages_collected: visitedCursors.size,
      requests_made: requestsMade,
      retries_made: retriesMade,
      next_cursor: cursor,
      stop_reason: reason,
      max_pages: maxPages,
      max_attempts_per_page: maxAttempts,
    },
    received_totals: summarizeRows(rows),
    rows,
  });

  while (true) {
    if (signal?.aborted) return finish("cancelled");
    if (visitedCursors.has(cursor)) return finish("repeated_cursor");
    if (visitedCursors.size >= maxPages) return finish("page_limit");

    let response;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      requestsMade += 1;
      if (attempt > 1) retriesMade += 1;
      try {
        response = await readPage({ cursor, attempt, signal });
      } catch {
        return finish(signal?.aborted ? "cancelled" : "read_failed");
      }
      if (signal?.aborted) return finish("cancelled");
      if (response?.kind !== "temporary_failure") break;
    }

    if (response?.kind === "temporary_failure") return finish("retry_limit");
    if (response?.kind === "missing_page" || response?.kind === "rejected") {
      return finish(response.kind);
    }
    const page = response?.kind === "page" ? response.page : null;
    const keys = pageKeys(page, scope, receivedKeys);
    if (!keys) return finish("invalid_page");

    for (const key of keys) receivedKeys.add(key);
    rows.push(...page.data);
    visitedCursors.add(cursor);

    if (!page.has_more) {
      cursor = null;
      return finish("last_page");
    }
    cursor = page.last_id;
  }
}
