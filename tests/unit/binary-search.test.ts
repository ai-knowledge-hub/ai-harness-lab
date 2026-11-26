import assert from "node:assert/strict";
import { firstTrue, boundaryTrace, binaryScenarios, prefixMaximum, renderBinary, worstCaseEvaluations } from "../../src/visualizers/binary-search";

describe("first-true boundary search", () => {
  it("preserves the invariant and reaches every boundary for n = 0..256", () => {
    let configurations = 0;
    for (let n = 0; n <= 256; n++) {
      let mostEvaluations = 0;
      for (let boundary = 0; boundary <= n; boundary++) {
        let evaluations = 0;
        let previousWidth = n;
        const result = firstTrue(n, index => {
          assert.ok(index >= 0 && index < n, "predicate access stays inside [0,n)");
          evaluations += 1;
          return index >= boundary;
        }, state => {
          assert.ok(0 <= state.lo && state.lo <= boundary && boundary <= state.hi && state.hi <= n);
          if (state.phase === "update") {
            const width = state.hi - state.lo;
            assert.ok(width < previousWidth);
            assert.ok(width <= Math.floor(previousWidth / 2));
            previousWidth = width;
          }
        });
        assert.equal(result, boundary);
        assert.ok(evaluations <= Math.ceil(Math.log2(n + 1)));
        mostEvaluations = Math.max(mostEvaluations, evaluations);
        configurations += 1;
      }
      assert.equal(mostEvaluations, Math.ceil(Math.log2(n + 1)), "bound is tight");
    }
    expect(configurations).toBe(33153);
  });

  it("uses the same procedure for the normal and counterexample datasets", () => {
    const valid = boundaryTrace(binaryScenarios.boundary.values, 650);
    expect(valid.at(-1)).toMatchObject({ result: 3, evaluations: 3, actualBoundary: 3, firstInvalidUpdate: null });
    expect(valid.every(step => step.boundaryPreserved)).toBe(true);
    expect(valid.map(step => step.line)).toEqual([3, 6, 7, 6, 9, 6, 7, 10]);
    expect(valid[1].note).toContain("mid = 0 + (8 - 0) // 2 = 4");
    expect(valid[3].note).toContain("mid = 0 + (4 - 0) // 2 = 2");
    expect(valid[5].note).toContain("mid = 3 + (4 - 3) // 2 = 3");
    expect(valid[2].note).toContain("this position remains a possible answer");
    expect(valid[4].note).toContain("this skips the checked position");
    expect(valid.at(-1)?.note).toContain("lo = hi = 3, so the while loop stops");
    const invalid = boundaryTrace(binaryScenarios.counterexample.values, 6);
    expect(invalid.at(-1)).toMatchObject({ result: 4, evaluations: 3, actualBoundary: 1, firstInvalidUpdate: 1 });
    expect(invalid[1]).toMatchObject({ phase: "inspect", mid: 3, lo: 0, hi: 7, boundaryPreserved: true });
    expect(invalid[2]).toMatchObject({ phase: "update", lo: 4, hi: 7, boundaryPreserved: false, evaluations: 1 });
    expect(invalid[2].note).toContain("Day 2");
  });

  it("handles empty input, duplicates, threshold extremes and stable snapshots", () => {
    expect(boundaryTrace([], 1).at(-1)).toMatchObject({ result: 0, evaluations: 0 });
    expect(boundaryTrace([5], 5).at(-1)?.result).toBe(0);
    expect(boundaryTrace([5], 6).at(-1)?.result).toBe(1);
    expect(boundaryTrace([1, 2, 2, 2, 4], 2).at(-1)?.result).toBe(1);
    expect(boundaryTrace([1, 2, 4], -1).at(-1)?.result).toBe(0);
    expect(boundaryTrace([1, 2, 4], 5).at(-1)?.result).toBe(3);
    const input = [1, 2, 4];
    const trace = boundaryTrace(input, 2);
    input[1] = 9;
    expect(trace[0].values).toEqual([1, 2, 4]);
    expect(worstCaseEvaluations(Number.MAX_SAFE_INTEGER)).toBe(53);
    expect(() => boundaryTrace([NaN], 1)).toThrow(RangeError);
    expect(() => firstTrue(-1, () => true)).toThrow(RangeError);
  });

  it("keeps observations, reveal and verifier evidence distinct", () => {
    const root = document.createElement("div");
    const trace = boundaryTrace(binaryScenarios.boundary.values, 650);
    root.innerHTML = renderBinary(trace[2], false, "observation");
    expect(root.querySelector("svg")?.getAttribute("aria-label")).toContain("Day 5: £650");
    expect(root.querySelectorAll('[data-observed="true"]')).toHaveLength(1);
    expect(root.querySelector('[data-record="4"]')?.textContent).toContain("Checked: yes");
    expect(root.querySelector('[data-record="5"]')?.textContent).toContain("Known: yes");
    expect(root.querySelector('[data-record="5"] text')?.textContent).toBe("?");
    expect(root.querySelector("[data-boundary], .binary-state")).toBeNull();
    root.innerHTML = renderBinary(trace[1]);
    expect(root.querySelector('[data-record="0"] text')?.textContent).toBe("?");
    expect(root.querySelector('[data-record="4"] text')?.textContent).toBe("650");
    expect(root.querySelector('[data-record="4"]')?.getAttribute("data-observed")).toBe("true");
    expect(root.querySelector('[data-record="4"]')?.getAttribute("data-state")).toBe("Inspect T");
    expect(root.querySelector("svg")?.getAttribute("aria-label")).toContain("Day 5 (index 4): £650, true");
    root.innerHTML = renderBinary(trace[1], true);
    expect(root.querySelector('[data-record="0"] text')?.textContent).toBe("100");
    expect(root.querySelector('[data-record="0"]')?.getAttribute("data-observed")).toBe("false");
    const invalid = boundaryTrace(binaryScenarios.counterexample.values, 6);
    root.innerHTML = renderBinary(invalid[2]);
    expect(root.querySelector('[data-record="1"]')?.getAttribute("data-state")).toBe("Assumed F");
    expect(root.querySelector('[data-record="1"]')?.textContent).toContain("Verifier found");
    expect(root.querySelector('[data-record="1"]')?.getAttribute("data-observed")).toBe("false");
    root.innerHTML = renderBinary(trace.at(-1)!);
    expect(root.querySelector('[data-result="3"]')?.textContent).toContain("Return index 3 (Day 4). First match.");
    root.innerHTML = renderBinary(invalid.at(-1)!);
    expect(root.querySelector('[data-result="4"]')?.textContent).toContain("Incorrect: first match is index 1 (Day 2)");
    const noMatch = boundaryTrace(binaryScenarios.boundary.values, 2000);
    root.innerHTML = renderBinary(noMatch.at(-1)!);
    expect(root.querySelector('[data-result="8"]')?.textContent).toContain("end sentinel (search reports no match)");
    expect(root.querySelector('[data-record="8"]')).toBeNull();
  });

  it("compresses static invariant annotation while retaining the full diagram and Run explanation", () => {
    const step = boundaryTrace(binaryScenarios.boundary.values, 650)[4];
    const root = document.createElement("div");
    root.innerHTML = renderBinary(step);
    const diagram = root.querySelector("svg")!.outerHTML;
    expect(root.querySelector(".binary-state")?.textContent).toContain("Remaining elements: [3, 4)");
    expect(root.querySelector(".binary-state")?.textContent).toContain("Search evaluations completed: 2");
    root.innerHTML = renderBinary(step, false, "invariant");
    expect(root.querySelector("svg")!.outerHTML).toBe(diagram);
    expect(root.querySelectorAll(".binary-state p")).toHaveLength(1);
    expect(root.querySelector(".binary-state")?.textContent?.trim()).toBe("Boundary invariant preserved");
  });

  it("preserves first crossings when constructing prefix maxima", () => {
    const raw = [80, 120, 250, 90, 180, 300, 100];
    const maxima = prefixMaximum(raw);
    expect(maxima).toEqual([80, 120, 250, 250, 250, 300, 300]);
    for (let threshold = 0; threshold <= 350; threshold++) {
      const expected = raw.findIndex(value => value >= threshold);
      expect(firstTrue(maxima.length, i => maxima[i] >= threshold)).toBe(expected < 0 ? raw.length : expected);
    }
  });
});
