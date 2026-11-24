// @vitest-environment node
import { deliveryOutcome, intentStates, orchestrationScenarios } from "../../src/content/chatgpt-ads-models";

describe("the two independent delivery boundaries", () => {
  const combinations = ["ready", "timeout"].flatMap(server => ["pass", "reject"].flatMap(context => ["on-time", "late"].map(arrival => ({ server, context, arrival }))));

  it.each(combinations)("preserves upstream priority for $server / $context / $arrival", input => {
    const result = deliveryOutcome(input);
    const expected = input.server === "timeout" ? "timeout" : input.context === "reject" ? "rejected" : input.arrival === "late" ? "late" : "on-time";
    expect(result.id).toBe(expected);
    // Invariants across the failure space: no send crosses a failed upstream
    // boundary, and display eligibility requires both boundaries to pass.
    expect(result.sent).toBe(input.server === "ready" && input.context === "pass");
    expect(result.contextReached).toBe(input.server === "ready");
    expect(result.arrivalReached).toBe(result.sent);
    expect(result.displayEligible).toBe(result.sent && input.arrival === "on-time");
  });

  it("does not let irrelevant downstream selections change an earlier failure", () => {
    const failures = combinations.filter(input => input.server === "timeout").map(deliveryOutcome);
    expect(failures.every(value => JSON.stringify(value) === JSON.stringify(failures[0]))).toBe(true);
    expect(deliveryOutcome({ server: "ready", context: "reject", arrival: "late" })).toEqual(deliveryOutcome({ server: "ready", context: "reject", arrival: "on-time" }));
  });
});

it("distinguishes missing history from withdrawn purchase intent", () => {
  expect(intentStates.find(state => state.id === "withdrawn").goal).toBe("Understand injury prevention");
  expect(intentStates.find(state => state.id === "withdrawn").implication).toContain("Stale context");
  expect(intentStates.find(state => state.id === "missing").implication).toContain("Missing context");
});

it("keeps rejection and revised retrieval distinct from auction authority", () => {
  expect(orchestrationScenarios.find(scenario => scenario.id === "empty").path).not.toContain("auction");
  expect(orchestrationScenarios.find(scenario => scenario.id === "ineligible").path).not.toContain("auction");
  expect(orchestrationScenarios.find(scenario => scenario.id === "revised").path.filter(step => step === "retrieve")).toHaveLength(2);
  expect(orchestrationScenarios.find(scenario => scenario.id === "rejected").path.at(-1)).toBe("context");
});
