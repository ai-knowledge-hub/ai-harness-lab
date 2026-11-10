type BinarySearchStep = {
  line: number;
  label: string;
  note: string;
  lo: number;
  hi: number;
  mid: number | null;
  result: number | null;
};

export const binarySearch = {
  id: "binary",
  title: "Binary Search",
  operation: "Find",
  short: "Campaign threshold finder",
  complexity: "O(log n)",
  summary:
    "Find the first day a sorted campaign metric crosses a target without scanning every row.",
  agentUse:
    "A skill or MCP endpoint can answer threshold questions over long time series without spending tokens or API time on a full scan.",
  code: [
    "def find_threshold_date(series, target):",
    "    lo, hi = 0, len(series) - 1",
    "    result = None",
    "    while lo <= hi:",
    "        mid = (lo + hi) // 2",
    "        if series[mid].value >= target:",
    "            result = series[mid]",
    "            hi = mid - 1",
    "        else:",
    "            lo = mid + 1",
    "    return result",
  ],
  steps: [
    { line: 1, label: "Initial bounds", note: "The CPA series is sorted by date. We start with the full window and target 6.00.", lo: 0, hi: 6, mid: null, result: null },
    { line: 5, label: "Check middle", note: "The middle value is 5.80, still below the target, so the breach must be to the right.", lo: 0, hi: 6, mid: 3, result: null },
    { line: 10, label: "Move right", note: "Discard the earlier half. The search window now covers 2026-03-05 to 2026-03-07.", lo: 4, hi: 6, mid: null, result: null },
    { line: 5, label: "Check middle", note: "The middle value is 7.40, which crosses the target. Store it, then keep searching earlier.", lo: 4, hi: 6, mid: 5, result: 5 },
    { line: 8, label: "Tighten left", note: "Move the high pointer left to test whether the breach happened before 2026-03-06.", lo: 4, hi: 4, mid: null, result: 5 },
    { line: 5, label: "Earliest breach", note: "2026-03-05 is 6.25, also above target. It becomes the earliest known breach.", lo: 4, hi: 4, mid: 4, result: 4 },
    { line: 11, label: "Return", note: "The first threshold crossing is 2026-03-05.", lo: 4, hi: 3, mid: null, result: 4 },
  ] satisfies BinarySearchStep[],
};

export function renderBinary(step: BinarySearchStep) {
  const data: [label: string, value: number][] = [
    ["Mar 01", 4.2],
    ["Mar 02", 4.55],
    ["Mar 03", 5.1],
    ["Mar 04", 5.8],
    ["Mar 05", 6.25],
    ["Mar 06", 7.4],
    ["Mar 07", 7.1],
  ];
  const max = 8;
  const bars = data
    .map(([label, value], index) => {
      const height = (value / max) * 220;
      const x = 36 + index * 78;
      const y = 270 - height;
      const inWindow = index >= step.lo && index <= step.hi;
      const isMid = index === step.mid;
      const isResult = index === step.result;
      const fill = isResult
        ? "var(--accent)"
        : isMid
          ? "var(--warn)"
          : inWindow
            ? "var(--viz-info)"
            : "color-mix(in srgb, var(--text) 15.0%, transparent)";
      return `<g>
        <rect x="${x}" y="${y}" width="46" height="${height}" rx="6" fill="${fill}"></rect>
        <text x="${x + 23}" y="296" text-anchor="middle" fill="var(--muted)" font-size="12">${label}</text>
        <text x="${x + 23}" y="${y - 10}" text-anchor="middle" fill="var(--text)" font-size="13">${value.toFixed(2)}</text>
        <text x="${x + 23}" y="320" text-anchor="middle" fill="var(--viz-info)" font-size="12">${index}</text>
      </g>`;
    })
    .join("");
  return `
    <svg viewBox="0 0 620 360" role="img">
      <line x1="24" y1="215" x2="590" y2="215" stroke="var(--warn)" stroke-dasharray="5 5"></line>
      <text x="590" y="207" text-anchor="end" fill="var(--warn)" font-size="13">target CPA 6.00</text>
      ${bars}
    </svg>
    <div class="legend">
      <span class="pill ${step.lo <= step.hi ? "active" : ""}">lo: ${step.lo}</span>
      <span class="pill ${step.mid !== null ? "warn" : ""}">mid: ${step.mid ?? "-"}</span>
      <span class="pill ${step.lo <= step.hi ? "active" : ""}">hi: ${step.hi}</span>
      <span class="pill ${step.result !== null ? "active" : ""}">result: ${step.result !== null ? data[step.result][0] : "-"}</span>
    </div>
  `;
}
