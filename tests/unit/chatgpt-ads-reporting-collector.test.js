// @vitest-environment node
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { collectSyntheticReport } from "../../scripts/reporting/collect.mjs";

const script = fileURLToPath(new URL("../../scripts/collect-chatgpt-ads-report.mjs", import.meta.url));

function run(...args) {
  const { status, stdout, stderr } = spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    timeout: 5000,
  });
  expect(stderr).toBe("");
  return { status, report: JSON.parse(stdout) };
}

describe("Local ChatGPT Ads report collector", () => {
  it("recovers from a temporary failure without counting the first page twice", () => {
    const { status, report } = run("retry");
    expect(status).toBe(0);
    expect(report).toMatchObject({
      data_source: "synthetic",
      provider: "chatgpt_ads",
      status: "complete",
      scope: { currency: "GBP", time_zone: "Europe/London" },
      coverage: { pages_collected: 2, requests_made: 3, retries_made: 1, next_cursor: null },
      received_totals: { impressions: 2300, clicks: 64, spend: 36, conversions: null },
    });
    expect(report.rows).toHaveLength(3);
  });

  it.each([
    ["retry-exhausted", [], 1, "partial", "retry_limit", 4],
    ["complete", ["--max-pages", "1"], 1, "partial", "page_limit", 1],
    ["cancelled", [], 130, "cancelled", "cancelled", 2],
  ])("preserves the first batch when %s stops early", (scenario, args, exit, state, reason, requests) => {
    const { status, report } = run(scenario, ...args);
    expect(status).toBe(exit);
    expect(report).toMatchObject({
      status: state,
      coverage: {
        pages_collected: 1,
        requests_made: requests,
        next_cursor: "synthetic-row-2",
        stop_reason: reason,
      },
      received_totals: { spend: 30.5 },
    });
    expect(report.rows).toHaveLength(2);
  });

  it("does not retry a rejected request or report missing totals as zero", () => {
    const { status, report } = run("rejected");
    expect(status).toBe(1);
    expect(report).toMatchObject({
      status: "rejected",
      coverage: { pages_collected: 0, requests_made: 1, retries_made: 0 },
      received_totals: null,
      rows: [],
    });
  });

  it("discards a whole page if it repeats a campaign-day already collected", async () => {
    const fixture = JSON.parse(readFileSync(
      new URL("../../scripts/fixtures/chatgpt-ads-reporting.json", import.meta.url),
      "utf8",
    ));
    const first = fixture.initial.pages[0].response;
    const second = fixture.initial.pages[1].response;
    const duplicate = first.data[0];
    const report = await collectSyntheticReport({
      scope: fixture.scope,
      retrievedAt: fixture.initial.retrieved_at,
      maxPages: 2,
      readPage: async ({ cursor }) => ({
        kind: "page",
        page: cursor === null ? first : {
          ...second,
          data: [...second.data, duplicate],
          count: 2,
          last_id: duplicate.id,
        },
      }),
    });
    expect(report).toMatchObject({
      status: "partial",
      coverage: { pages_collected: 1, stop_reason: "invalid_page" },
      received_totals: { spend: 30.5 },
      rows: first.data,
    });
  });
});
