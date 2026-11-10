import { parseArgs } from "node:util";
import { defaultReportPages, maxReportPages } from "./reporting/collect.mjs";
import { reportScenarios, runSyntheticReport } from "./reporting/synthetic-report.mjs";

const usage = [
  "Usage: node scripts/collect-chatgpt-ads-report.mjs [scenario] [--max-pages N]",
  "Read a local synthetic report and print it as JSON.",
  `Scenarios: ${reportScenarios.join(", ")}. Default: complete.`,
  `Page limit: 1–${maxReportPages}. Default: ${defaultReportPages}.`,
  "Use --help to show this message.",
].join("\n");

function readOptions() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      "max-pages": { type: "string", default: String(defaultReportPages) },
      help: { type: "boolean", short: "h" },
    },
  });
  if (values.help) return { help: true };

  const [scenario = "complete"] = positionals;
  const maxPages = Number(values["max-pages"]);
  if (positionals.length > 1 || !reportScenarios.includes(scenario) ||
      !/^[1-9]\d?$/.test(values["max-pages"]) || maxPages > maxReportPages) {
    throw new Error("Invalid scenario or page limit");
  }
  return { scenario, maxPages };
}

async function run(options) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  process.once("SIGINT", cancel);
  try {
    const report = await runSyntheticReport({ ...options, signal: controller.signal });
    console.log(JSON.stringify(report, null, 2));
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

if (options?.help) {
  console.log(usage);
} else if (options) {
  try {
    await run(options);
  } catch (error) {
    console.error(`Could not run the local collector: ${error.message}`);
    process.exitCode = 1;
  }
}
