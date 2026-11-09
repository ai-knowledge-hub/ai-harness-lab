import { readFile } from "node:fs/promises";
import { setImmediate } from "node:timers/promises";
import { parseArgs } from "node:util";
import { collectSyntheticReport } from "./reporting/collect.mjs";

const scenarios = [
  "complete", "empty", "partial", "refreshed", "retry", "retry-exhausted",
  "rejected", "cancelled",
];
const usage = [
  "Usage: node scripts/collect-chatgpt-ads-report.mjs [scenario] [--max-pages N]",
  `Scenarios: ${scenarios.join(", ")}. Default: complete.`,
  "Page limit: 1–20. Default: 10.",
].join("\n");

function readOptions() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { "max-pages": { type: "string", default: "10" } },
  });
  const [scenario = "complete"] = positionals;
  const maxPages = Number(values["max-pages"]);
  if (positionals.length > 1 || !scenarios.includes(scenario) ||
      !/^[1-9]\d?$/.test(values["max-pages"]) || maxPages > 20) {
    throw new Error("Choose a listed scenario and a page limit from 1 to 20.");
  }
  return { scenario, maxPages };
}

async function run({ scenario, maxPages }) {
  const fixture = JSON.parse(await readFile(
    new URL("./fixtures/chatgpt-ads-reporting.json", import.meta.url),
    "utf8",
  ));
  const snapshot = scenario === "empty" || scenario === "refreshed"
    ? fixture[scenario]
    : fixture.initial;
  const pages = new Map(snapshot.pages.map(({ after, response }) => [after, response]));
  const controller = new AbortController();
  const cancel = () => controller.abort();
  process.once("SIGINT", cancel);
  try {
    const report = await collectSyntheticReport({
      scope: fixture.scope,
      retrievedAt: snapshot.retrieved_at,
      maxPages,
      signal: controller.signal,
      async readPage({ cursor, attempt, signal }) {
        if (scenario === "cancelled" && cursor !== null) cancel();
        await setImmediate(undefined, { signal });

        if (scenario === "rejected") return { kind: "rejected" };
        if (scenario === "partial" && cursor !== null) return { kind: "missing_page" };
        if (cursor !== null &&
            (scenario === "retry-exhausted" || (scenario === "retry" && attempt === 1))) {
          return { kind: "temporary_failure" };
        }
        const page = pages.get(cursor);
        return page ? { kind: "page", page } : { kind: "missing_page" };
      },
    });

    console.log(JSON.stringify({ scenario, ...report }, null, 2));
    if (report.status === "cancelled") process.exitCode = 130;
    else if (report.status !== "complete" && report.status !== "empty") process.exitCode = 1;
  } finally {
    process.removeListener("SIGINT", cancel);
  }
}

let options;
try {
  options = readOptions();
} catch {
  console.error(usage);
  process.exitCode = 2;
}

if (options) {
  try {
    await run(options);
  } catch (error) {
    console.error(`Could not run the local collector: ${error.message}`);
    process.exitCode = 1;
  }
}
