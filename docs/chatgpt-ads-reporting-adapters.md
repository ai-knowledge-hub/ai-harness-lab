# Local ChatGPT Ads reporting adapters

These adapters support [issue #16](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/16). The CLI and Model Context Protocol (MCP) server both call the same collector and read the same bundled fictional report pages. They return the versioned report described in the [collector guide](chatgpt-ads-reporting-collector.md).

## Run the CLI

Use Node.js 20.3 or newer. From this checkout, run:

```sh
node scripts/collect-chatgpt-ads-report.mjs --help
node scripts/collect-chatgpt-ads-report.mjs retry
node scripts/collect-chatgpt-ads-report.mjs complete --max-pages 1
```

The retry example returns a complete report after three requests. With a one-page limit, the result is partial and preserves the first page, its £30.50 subtotal and the next cursor. The CLI prints the report as JSON and uses the exit codes in the collector guide.

## Connect a local MCP host

Install the locked development dependencies from the repository root with `pnpm install --frozen-lockfile`. The MCP server is version `0.1.0` and uses MCP SDK `2.4.0`. Use a desktop or terminal MCP host that launches local processes over standard input and output (stdio).

For a current Codex CLI with MCP support, register the local command from the repository root:

```sh
codex mcp add harness-synthetic-ads-reporting -- "$(command -v node)" "$PWD/scripts/chatgpt-ads-reporting-mcp.mjs"
codex mcp list
```

Other stdio hosts can use the same Node executable and absolute script path in their server settings. [Codex MCP setup](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)

Call `collect_synthetic_ads_report` with an object such as:

```json
{ "scenario": "retry", "max_pages": 10 }
```

Both fields are optional. The default is the complete scenario with a ten-page limit. The server accepts the CLI’s listed scenarios and integer page limits from 1 to 20. It returns the report as structured data and as JSON text. Simulated rejection, cancellation and partial collection are report outcomes, so read `status` and `coverage.stop_reason` before using totals. Invalid arguments are tool errors. A cancellation signal from the host goes to the collector.

The tool reads only the bundled fixture. Its inputs select a scenario and a limit, and the stdio process makes no network requests. The website serves prepared examples separately.

## Skills and plugin follow-up

Harness owns the reference implementation, fixture and guide. A future release in `ai-skills-guide` can own the installable tool and a reporting skill that teaches agents to inspect scope, coverage and freshness before interpreting totals. Pin the Harness source revision and include the same fixture and contract checks in the release. Link the versioned Skills release from Harness once it exists. The existing related skill covers permission and credential review for a future live connector. [Ad Platform Agent Auth Review v0.1.0 manifest](https://skills.ai-knowledge-hub.org/release-manifests/skills/security/ad-platform-agent-auth-review/0.1.0.yaml)

OpenAI documents its own Ads Manager plugin for live account tasks. For a separate Harness package, its general plugin guide covers bundling skills and MCP servers, and its desktop submission guide covers local stdio servers. Public desktop submission has additional eligibility requirements. Live account verification stays in [issue #13](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/13). [Official Ads Manager plugin](https://help.openai.com/en/articles/20001558-use-the-chatgpt-ads-manager-plugin) · [Package your plugin](https://developers.openai.com/plugins/build/plugins) · [Desktop-only submission](https://developers.openai.com/plugins/deploy/desktop-only)
