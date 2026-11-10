import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { defaultReportPages, maxReportPages } from "./reporting/collect.mjs";
import { reportScenarios, runSyntheticReport } from "./reporting/synthetic-report.mjs";

function createServer() {
  const server = new McpServer({ name: "harness-synthetic-ads-reporting", version: "0.1.0" });
  server.registerTool(
    "collect_synthetic_ads_report",
    {
      title: "Read a synthetic ChatGPT Ads report",
      description: "Inspect a fictional campaign report from the bundled local fixture. Returns report scope, rows, totals, and coverage, including simulated failures.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      inputSchema: z.strictObject({
        scenario: z.enum(reportScenarios).optional().describe("Fictional outcome to inspect. Defaults to complete."),
        max_pages: z.number().int().min(1).max(maxReportPages).optional()
          .describe(`Maximum accepted pages. Defaults to ${defaultReportPages}.`),
      }),
    },
    async ({ scenario, max_pages }, { signal }) => {
      const report = await runSyntheticReport({ scenario, maxPages: max_pages, signal });
      return {
        structuredContent: report,
        content: [{ type: "text", text: JSON.stringify(report, null, 2) }],
      };
    },
  );
  return server;
}

serveStdio(createServer);
