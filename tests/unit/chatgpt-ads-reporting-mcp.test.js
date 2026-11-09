// @vitest-environment node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { runSyntheticReport } from "../../scripts/reporting/synthetic-report.mjs";

const cliPath = fileURLToPath(new URL("../../scripts/collect-chatgpt-ads-report.mjs", import.meta.url));
const serverPath = fileURLToPath(new URL("../../scripts/chatgpt-ads-reporting-mcp.mjs", import.meta.url));
const toolName = "collect_synthetic_ads_report";

async function withClient(mode, check) {
  const client = new Client(
    { name: "harness-reporting-test", version: "1.0.0" },
    { versionNegotiation: { mode } },
  );
  try {
    await client.connect(new StdioClientTransport({
      command: process.execPath,
      args: [serverPath],
    }));
    await check(client);
  } finally {
    await client.close();
  }
}

describe("Local reporting adapters", () => {
  it.each(["auto", "legacy"])("preserves collector output over %s MCP and the CLI", async (mode) => {
    await withClient(mode, async (client) => {
      const cases = [
        ["retry", 10, 0],
        ["complete", 1, 1],
        ["rejected", 10, 1],
        ["cancelled", 10, 130],
      ];
      for (const [scenario, maxPages, exitCode] of cases) {
        const expected = await runSyntheticReport({ scenario, maxPages });
        const cli = spawnSync(process.execPath, [cliPath, scenario, "--max-pages", String(maxPages)], {
          encoding: "utf8",
          timeout: 5000,
        });
        expect(cli.status).toBe(exitCode);
        expect(JSON.parse(cli.stdout)).toEqual(expected);

        const result = await client.callTool({
          name: toolName,
          arguments: { scenario, max_pages: maxPages },
        });
        expect(result.isError).not.toBe(true);
        expect(result.structuredContent).toEqual(expected);
        expect(JSON.parse(result.content[0].text)).toEqual(expected);
      }
    });
  });

  it("advertises only the local report tool and rejects input outside the fixture contract", async () => {
    await withClient("auto", async (client) => {
      const { tools } = await client.listTools();
      expect(tools).toHaveLength(1);
      expect(tools[0]).toMatchObject({
        name: toolName,
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
        inputSchema: { additionalProperties: false },
      });
      for (const args of [{ scenario: "live" }, { max_pages: 21 }, { fixture_path: "/tmp/other.json" }]) {
        const result = await client.callTool({ name: toolName, arguments: args });
        expect(result.isError).toBe(true);
        expect(result.structuredContent).toBeUndefined();
      }
      const result = await client.callTool({ name: toolName, arguments: {} });
      expect(result.structuredContent).toEqual(await runSyntheticReport());
    });
  });
});
