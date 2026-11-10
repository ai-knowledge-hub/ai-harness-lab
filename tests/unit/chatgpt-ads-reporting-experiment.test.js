// @vitest-environment node
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL(
  "../../scripts/chatgpt-ads-reporting-experiment.mjs",
  import.meta.url,
));

let reports;
beforeAll(() => {
  const output = execFileSync(process.execPath, [script], { encoding: "utf8" });
  reports = Object.fromEntries(JSON.parse(output).map((report) => [report.scenario, report]));
});

describe("Offline ChatGPT Ads reporting", () => {
  it("distinguishes an empty result from an interrupted report", () => {
    expect(reports.empty).toMatchObject({
      status: "empty",
      coverage: { pages_collected: 1, stop_reason: "last_page" },
      received_totals: null,
      rows: [],
    });
    expect(reports.partial).toMatchObject({
      status: "partial",
      coverage: { pages_collected: 1, next_cursor: "synthetic-row-2", stop_reason: "missing_page" },
      received_totals: { spend: 30.5 },
    });
  });

  it("follows the next cursor and keeps unavailable conversions distinct from zero", () => {
    expect(reports.complete).toMatchObject({
      status: "complete",
      coverage: { pages_collected: 2, next_cursor: null },
      received_totals: { impressions: 2300, clicks: 64, spend: 36, conversions: null },
    });
    expect(reports.complete.rows.map((row) => row.conversions)).toEqual([1, 0, null]);
  });

  it("keeps the refreshed totals separate for the same reporting scope", () => {
    expect(reports.refreshed.scope).toEqual(reports.complete.scope);
    expect(reports.refreshed.retrieved_at > reports.complete.retrieved_at).toBe(true);
    expect(reports.refreshed.rows).toHaveLength(3);
    expect(reports.refreshed.received_totals).toEqual({
      impressions: 2310,
      clicks: 66,
      spend: 36.3,
      conversions: 3,
    });
  });
});
