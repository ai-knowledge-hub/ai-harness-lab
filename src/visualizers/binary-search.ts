export const binaryCode = [
  "def first_true(n, predicate):",
  "    lo = 0",
  "    hi = n",
  "    while lo < hi:",
  "        mid = lo + (hi - lo) // 2",
  "        if predicate(mid):",
  "            hi = mid",
  "        else:",
  "            lo = mid + 1",
  "    return lo",
];

export const binaryScenarios = {
  boundary: { name: "Locate the boundary", values: [100, 250, 400, 650, 650, 850, 1100, 1250], threshold: 650, unit: "Cumulative expenditure (£)" },
  counterexample: { name: "Break the assumption", values: [4, 8, 5, 4, 7, 9, 10], threshold: 6, unit: "Daily CPA (£)" },
} as const;
export type BinaryScenario = keyof typeof binaryScenarios;
export type BinaryExperiment = BinaryScenario | "growth";
type SearchObservation = {
  phase: "inspect" | "update"; lo: number; hi: number; mid: number; matched: boolean; evaluations: number;
};

/** First true in a stable false-then-true predicate, or end sentinel n.
 * The observer records instrumentation; it does not decide the search.
 */
export function firstTrue(n: number, predicate: (index: number) => boolean, observe?: (state: SearchObservation) => void): number {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError("n must be a non-negative safe integer");
  let lo = 0;
  let hi = n;
  let evaluations = 0;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const matched = predicate(mid);
    evaluations += 1;
    observe?.({ phase: "inspect", lo, hi, mid, matched, evaluations });
    if (matched) hi = mid;
    else lo = mid + 1;
    observe?.({ phase: "update", lo, hi, mid, matched, evaluations });
  }
  return lo;
}

export function worstCaseEvaluations(n: number): number {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError("n must be a non-negative safe integer");
  let evaluations = 0;
  while (n > 0) { n = Math.floor(n / 2); evaluations += 1; }
  return evaluations;
}

export function prefixMaximum(values: readonly number[]): number[] {
  let highest = -Infinity;
  return values.map((value) => (highest = Math.max(highest, value)));
}

export type BinarySearchStep = {
  line: number; label: string; note: string;
  phase: "initial" | "inspect" | "update" | "return";
  lo: number; hi: number; mid: number | null; result: number | null;
  values: readonly number[]; threshold: number; observed: number[]; evaluations: number;
  actualBoundary: number; boundaryPreserved: boolean; monotonic: boolean;
  firstInvalidUpdate: number | null; update: number; matched: boolean | null;
};

/** The independent linear oracle is outside the search and evaluation count. */
export function boundaryTrace(values: readonly number[], threshold: number): BinarySearchStep[] {
  if (!Number.isFinite(threshold) || values.some((value) => !Number.isFinite(value))) throw new RangeError("Values and threshold must be finite numbers");
  const snapshot = [...values];
  const firstMatch = snapshot.findIndex((value) => value >= threshold);
  const actualBoundary = firstMatch === -1 ? snapshot.length : firstMatch;
  const monotonic = snapshot.every((value, i) => i === 0 || snapshot[i - 1] < threshold || value >= threshold);
  const observed: number[] = [];
  let firstInvalidUpdate: number | null = null;
  let update = 0;
  const base: BinarySearchStep = {
    line: 3, label: "Initial bounds",
    note: `Set lo = 0 and hi = n = ${snapshot.length}. These bounds include ${snapshot.length + 1} possible answers: any record position, or ${snapshot.length} for no match. No values have been inspected.`,
    phase: "initial", lo: 0, hi: snapshot.length, mid: null, result: null,
    values: snapshot, threshold, observed: [], evaluations: 0, actualBoundary,
    boundaryPreserved: true, monotonic, firstInvalidUpdate: null, update: 0, matched: null,
  };
  const steps: BinarySearchStep[] = [base];
  const result = firstTrue(snapshot.length, (index) => snapshot[index] >= threshold, (state) => {
    if (state.phase === "inspect") observed.push(state.mid);
    else update += 1;
    const boundaryPreserved = state.lo <= actualBoundary && actualBoundary <= state.hi;
    if (!boundaryPreserved && firstInvalidUpdate === null) firstInvalidUpdate = update;
    const inference = state.matched
      ? `The check at index ${state.mid} was true. If the predicate stays false then true, the first match is at index ${state.mid} or earlier. Set hi = mid = ${state.mid}; this position remains a possible answer.`
      : `The check at index ${state.mid} was false. If the predicate stays false then true, the first match is later than index ${state.mid}. Set lo = mid + 1 = ${state.mid + 1}; this skips the checked position.`;
    const warning = boundaryPreserved
      ? "The independently checked first match remains among the possible boundaries."
      : `Invalid elimination: the verifier finds the first match at index ${actualBoundary} (Day ${actualBoundary + 1}), outside [${state.lo}, ${state.hi}]. Date order does not justify this inference.`;
    steps.push({
      ...base, ...state, observed: [...observed], update, firstInvalidUpdate, boundaryPreserved,
      line: state.phase === "inspect" ? 6 : state.matched ? 7 : 9,
      label: state.phase === "inspect" ? `Inspect index ${state.mid}` : `Move ${state.matched ? "hi" : "lo"}`,
      note: state.phase === "inspect"
        ? `Calculate mid = ${state.lo} + (${state.hi} - ${state.lo}) // 2 = ${state.mid}. Inspect index ${state.mid} (Day ${state.mid + 1}): £${snapshot[state.mid]} ${state.matched ? "meets" : "is below"} the £${threshold} threshold, so predicate(mid) is ${state.matched ? "true" : "false"}. Predict which bound moves before advancing.`
        : `${inference} ${warning}`,
    });
  });
  const last = steps[steps.length - 1];
  steps.push({
    ...last, phase: "return", line: 10, label: "Return boundary", mid: null, result,
    note: `The bounds meet: lo = hi = ${result}, so the while loop stops. Return index ${result}${result === snapshot.length ? ", the end sentinel (the search reports no match)" : ` (Day ${result + 1})`}. ${result === actualBoundary ? "This agrees with the independent linear check." : `The actual first match is index ${actualBoundary} (Day ${actualBoundary + 1}); the first invalid update was ${firstInvalidUpdate}.`} Search predicate evaluations: ${last.evaluations}. Verifier work is additional and is not counted as search work.`,
  });
  return steps;
}

export const binarySearch = {
  id: "binary" as const, title: "Binary Search", operation: "Find", short: "Campaign threshold finder",
  complexity: "O(log n) evaluations · O(1) auxiliary space",
  summary: "Binary search can find the first record that meets a condition without checking every record.",
  agentUse: "Ordered representations can reduce tool-side search work. Preparing that representation, evaluating a costly predicate, and handling revised records remain separate costs.",
  code: binaryCode,
  steps: boundaryTrace(binaryScenarios.boundary.values, binaryScenarios.boundary.threshold),
};

/** Shared by Run and static Context. Never reveal an unobserved value unless
 * requested, or explicitly identified as the verifier's counterexample. */
export function renderBinary(step: BinarySearchStep, reveal = false, presentation: "search" | "observation" = "search"): string {
  const observationOnly = presentation === "observation";
  const width = Math.max(740, step.values.length * 100 + 70);
  const cell = (width - 70) / Math.max(step.values.length, 1);
  const failure = !step.boundaryPreserved;
  const records = step.values.map((value, index) => {
    const inspected = step.observed.includes(index);
    const active = step.phase === "inspect" && index === step.mid;
    const outside = index < step.lo || index >= step.hi;
    const counterexample = failure && index === step.actualBoundary;
    const inferred = outside && !inspected;
    const verdict = index < step.lo ? "F" : "T";
    const searchState = active ? `Inspect ${value >= step.threshold ? "T" : "F"}` : inspected ? (value >= step.threshold ? "Observed T" : "Observed F")
      : inferred ? `${failure || !step.monotonic ? "Assumed" : "Inferred"} ${verdict}` : "Unresolved";
    const state = observationOnly
      ? inspected ? `Checked: ${value >= step.threshold ? "yes" : "no"}` : inferred ? `Known: ${verdict === "T" ? "yes" : "no"}` : "Not checked"
      : searchState;
    const x = 35 + index * cell;
    const color = counterexample ? "var(--viz-danger)" : active ? "var(--viz-warning)"
      : inferred && verdict === "T" && !failure ? "var(--viz-success)" : "var(--viz-info)";
    return `<g data-record="${index}" data-state="${state}" data-observed="${inspected}">
      <rect x="${x}" y="45" width="${cell - 10}" height="66" rx="3" fill="var(--surface)" stroke="${color}" stroke-width="${active || counterexample ? 3 : 1.5}" ${inferred ? 'stroke-dasharray="5 4"' : !inspected ? 'stroke-dasharray="1 4"' : ""}/>
      <text x="${x + (cell - 10) / 2}" y="84" text-anchor="middle" fill="var(--text)" font-size="18">${inspected || reveal || counterexample ? value : "?"}</text>
      <text x="${x + (cell - 10) / 2}" y="135" text-anchor="middle" fill="var(--muted)" font-size="14">Day ${index + 1}${observationOnly ? "" : ` · ${index}`}</text>
      <text x="${x + (cell - 10) / 2}" y="159" text-anchor="middle" fill="var(--text)" font-size="13">${state}</text>
      ${counterexample ? `<text x="${x + (cell - 10) / 2}" y="183" text-anchor="middle" fill="var(--viz-danger)" font-size="13">Verifier found</text>` : ""}
    </g>`;
  }).join("");
  const boundaries = observationOnly ? "" : Array.from({ length: step.values.length + 1 }, (_, index) => {
    const possible = index >= step.lo && index <= step.hi;
    const excludedAnswer = failure && index === step.actualBoundary;
    const x = 30 + index * cell;
    return `<g data-boundary="${index}" data-possible="${possible}">
      <circle cx="${x}" cy="220" r="${possible || excludedAnswer ? 7 : 4}" fill="${excludedAnswer ? "var(--viz-danger)" : possible ? "var(--viz-warning)" : "var(--muted)"}"/>
      <text x="${x}" y="250" text-anchor="middle" fill="var(--text)" font-size="14">${index}</text>
      <text x="${x}" y="276" text-anchor="middle" fill="var(--text)" font-size="14">${[index === step.lo ? "lo" : "", index === step.hi ? "hi" : ""].filter(Boolean).join(" = ")}</text>
    </g>`;
  }).join("");
  const checkedDescription = step.observed.length
    ? ` Checked ${step.observed.map(index => `Day ${index + 1} (index ${index}): £${step.values[index]}, ${step.values[index] >= step.threshold ? "true" : "false"}`).join("; ")}.`
    : " No values have been checked.";
  const resultDescription = step.result === null ? ""
    : ` Search returns index ${step.result}${step.result === step.values.length ? ", the no-match end sentinel" : `, Day ${step.result + 1}`}.`;
  const footer = step.result === null
    ? `Position ${step.values.length} is the end sentinel: no match, not a record to read.`
    : `${step.result === step.values.length ? `Return ${step.result}: end sentinel (search reports no match).` : `Return index ${step.result} (Day ${step.result + 1}).`} ${failure ? `Incorrect: first match is index ${step.actualBoundary} (Day ${step.actualBoundary + 1}).` : step.result < step.values.length ? "First match." : ""}`;
  const description = observationOnly
    ? `Spending target: at least £${step.threshold}. Checked ${step.observed.map(index => `Day ${index + 1}: £${step.values[index]}`).join(", ")}. Solid outlines show checked values; dashed outlines show conclusions about unchecked values, assuming spending never decreases.`
    : `${step.label}. Remaining elements [${step.lo}, ${step.hi}); possible boundaries [${step.lo}, ${step.hi}].${checkedDescription}${resultDescription} ${failure ? `The verifier finds the actual first match at index ${step.actualBoundary}, Day ${step.actualBoundary + 1}, outside the bounds.` : "The actual first match remains possible."}`;
  return `<svg class="binary-sequence" viewBox="0 0 ${width} ${observationOnly ? 190 : 330}" role="img" aria-label="${description}">
    <text x="35" y="23" fill="var(--muted)" font-size="14">${observationOnly ? `Target: at least £${step.threshold}` : `Predicate: value ≥ £${step.threshold}`}</text>
    ${records}${boundaries}
    ${observationOnly ? "" : `<text ${step.result === null ? "" : `data-result="${step.result}"`} x="35" y="317" fill="var(--muted)" font-size="14">${footer}</text>`}
  </svg>
  ${observationOnly ? "" : `<div class="binary-state" data-invariant="${failure ? "violated" : "preserved"}">
    <p><strong>${failure ? "Invalid elimination" : step.monotonic ? "Boundary invariant preserved" : "Boundary still possible; monotonicity is not guaranteed"}</strong></p>
    <p>Remaining elements: [${step.lo}, ${step.hi}). Possible boundaries: [${step.lo}, ${step.hi}].</p>
    <p>Search evaluations completed: ${step.evaluations}. Solid outlines mark observations; dotted outlines are unresolved; dashed outlines mark ${failure || !step.monotonic ? "assumptions" : "inferences"}.</p>
    ${failure ? `<p>Verifier counterexample: index ${step.actualBoundary}, £${step.values[step.actualBoundary]}. The verifier scans the dataset separately; its work is excluded from the search count.</p>` : ""}
  </div>`}`;
}
