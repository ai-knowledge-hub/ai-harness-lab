// @vitest-environment node
import { loadReferenceContracts } from "../../scripts/reference-contracts.mjs";

let validate;
let examples;
beforeAll(async () => ({ validate, examples } = await loadReferenceContracts()));

describe("Downloadable reference contract boundaries", () => {
  it("rejects a payload relabelled as a different event", () => {
    const example = structuredClone(examples.find((item) => item.event_type === "frontend.ad_event"));
    example.event_type = "orchestrator.tool_call";
    expect(validate(example)).toBe(false);
  });
  it("requires typed inputs and outputs for the illustrative embedding tool", () => {
    const example = examples.find((item) => item.payload.tool_name === "embed");
    for (const field of ["arguments", "result"]) {
      const invalid = structuredClone(example);
      invalid.payload[field] = {};
      expect(validate(invalid)).toBe(false);
    }
  });
  it("keeps late arrival separate from impressions and contextual acceptance", () => {
    const late = structuredClone(examples.find((item) => item.payload.event === "dropped_arrived_late"));
    late.payload.event = "impression_shown";
    expect(validate(late)).toBe(false);
    const gate = structuredClone(examples.find((item) => item.payload.tool_name === "final_gate"));
    gate.payload.result.block_reason = "arrival_timeout";
    expect(validate(gate)).toBe(false);
  });
});
