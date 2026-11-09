import { readFile } from "node:fs/promises";
import { setImmediate } from "node:timers/promises";
import { collectSyntheticReport, defaultReportPages } from "./collect.mjs";

export const reportScenarios = Object.freeze([
  "complete", "empty", "partial", "refreshed", "retry", "retry-exhausted",
  "rejected", "cancelled",
]);

export async function runSyntheticReport({
  scenario = "complete",
  maxPages = defaultReportPages,
  signal,
} = {}) {
  if (!reportScenarios.includes(scenario)) throw new RangeError("Unknown synthetic report scenario");

  const fixture = JSON.parse(await readFile(
    new URL("../fixtures/chatgpt-ads-reporting.json", import.meta.url),
    "utf8",
  ));
  const snapshot = scenario === "empty" || scenario === "refreshed"
    ? fixture[scenario]
    : fixture.initial;
  const pages = new Map(snapshot.pages.map(({ after, response }) => [after, response]));

  const simulatedCancellation = scenario === "cancelled" ? new AbortController() : null;
  const collectionSignal = simulatedCancellation && signal
    ? AbortSignal.any([signal, simulatedCancellation.signal])
    : simulatedCancellation?.signal ?? signal;

  const report = await collectSyntheticReport({
    scope: fixture.scope,
    retrievedAt: snapshot.retrieved_at,
    maxPages,
    signal: collectionSignal,
    async readPage({ cursor, attempt, signal }) {
      if (cursor !== null) simulatedCancellation?.abort();
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
  return { scenario, ...report };
}
