import type { CSSProperties } from "react";

type DiagramNode = { id: string; x: number; y: number; w?: number; h?: number; label: string; title: string; detail: string; uncertain?: boolean };
type Diagram = { title: string; height: number; nodes: DiagramNode[]; edges: { path: string; dashed?: boolean }[]; lanes: { text: string; x: number; y: number }[]; steps: string[]; note: string };

const diagrams = {
  "event-to-row": {
    title: "From an event to a reporting row", height: 665,
    lanes: [{ text: "INDIVIDUAL EVENTS · COFFEE-GRINDER CAMPAIGN", x: 24, y: 22 }, { text: "CONCEPTUAL PROCESSING STAGES", x: 24, y: 247 }],
    nodes: [
      { id: "impression", x: 24, y: 55, label: "Advertising delivery", title: "Impression", detail: "An ad is displayed; an impression record is created." },
      { id: "click", x: 288, y: 55, label: "Interaction record", title: "Click", detail: "A click identifier connects the interaction to the campaign." },
      { id: "purchase", x: 552, y: 55, label: "Retailer + integration", title: "Purchase O-1042", detail: "An order produces a purchase notification." },
      { id: "ingest", x: 24, y: 280, label: "Ingestion", title: "Collect and validate", detail: "Receive records that may be late, repeated or invalid." },
      { id: "identity", x: 288, y: 280, label: "Identity resolution", title: "Match and deduplicate", detail: "Link eligible records. Recognise repeated purchase notifications." },
      { id: "attribution", x: 552, y: 280, label: "Attribution", title: "Assign conversion credit", detail: "Apply the report's conversion definition and attribution rules." },
      { id: "aggregate", x: 24, y: 505, w: 752, h: 130, label: "Aggregation → Reporting API · retailer-uk / coffee-grinder / 21 Nov 2026", title: "8,000 impressions · 320 clicks · £160 spend · 12 attributed conversions", detail: "One campaign/day observation. Individual event IDs and arrival order are absent from this aggregate row." },
    ],
    edges: [{ path: "M136 210V280" }, { path: "M400 210V230H136" }, { path: "M664 210V230H400" }, { path: "M248 357H288" }, { path: "M512 357H552" }, { path: "M664 435V470H400V505" }],
    steps: [
      "An impression, click and purchase are separate records. Purchase O-1042 is one business occurrence even if its notification arrives more than once.",
      "Conceptual ingestion validates records; identity resolution matches and deduplicates them; attribution determines conversion credit. These responsibilities need not be separate services.",
      "Aggregation changes the grain from individual events to account/campaign/reporting-day totals. This observation is retailer-uk / coffee-grinder / 21 November 2026: 8,000 impressions, 320 clicks, £160 spend and 12 attributed conversions.",
      "This row omits individual event identifiers and processing order. Adding country as a dimension changes the aggregation key. A later snapshot can replace this observation without creating additional campaign activity.",
    ],
    note: "A conceptual teaching model, not a provider architecture. The event examples contribute to a larger fictional campaign; they are not the only events counted in the row.",
  },
  "two-clocks": {
    title: "Two clocks, two kinds of completeness", height: 570,
    lanes: [{ text: "EVENT TIME", x: 24, y: 83 }, { text: "PROCESSING TIME", x: 24, y: 233 }, { text: "CLIENT RETRIEVAL · A SEPARATE OPERATION", x: 24, y: 347 }],
    nodes: [
      { id: "page-one", x: 24, y: 385, label: "Page 1", title: "Accepted rows", detail: "Valid observations are retained." },
      { id: "page-two", x: 288, y: 385, label: "Page 2", title: "Request times out", detail: "A required page is still missing.", uncertain: true },
      { id: "collection", x: 552, y: 385, label: "Collection state", title: "Retrieval incomplete", detail: "This can happen even when source data is mature.", uncertain: true },
    ],
    edges: [{ path: "M248 462H288" }, { path: "M512 462H552", dashed: true }],
    steps: [
      "Both timelines use the same UTC scale. Purchase A happens on 21 November at 18:10 and is processed at 18:11. C happens at 19:05; B happens later, at 20:15.",
      "B is processed on 22 November at 11:40, before C at 13:20. Event order A, C, B becomes processing order A, B, C. The sloping lines show delay, not another purchase.",
      "Late eligible notifications can revise an earlier conversion count. Retrieving every page cannot force those source events to arrive or establish finality.",
      "Separately, a collector accepts page 1 but times out on page 2. That is incomplete retrieval, regardless of the source's maturity. Either problem can exist without the other.",
    ],
    note: "A, B and C use the purchase times in the article's table. The API-page failure is a separate hypothetical collection; time on the source timeline does not measure pagination progress.",
  },
  "decision-boundary": {
    title: "The boundary between evidence and action", height: 905,
    lanes: [{ text: "READ-ONLY REPORT · EVIDENCE VALIDATION", x: 24, y: 22 }, { text: "ACTION WORKFLOW · SEPARATE AUTHORITY", x: 24, y: 482 }],
    nodes: [
      { id: "envelope", x: 24, y: 55, label: "Report envelope", title: "Latest observation: 14", detail: "Carry scope, coverage, maturity, provenance and limitations." },
      { id: "validate", x: 288, y: 55, label: "Application checks", title: "Validate evidence", detail: "Does this report cover the intended comparison and required metrics?" },
      { id: "policy", x: 552, y: 55, label: "Decision policy", title: "Check suitability", detail: "Enforce maturity rules, decision assumptions and proposal permission." },
      { id: "reject", x: 288, y: 280, w: 488, h: 145, label: "If either check fails", title: "Return the limitation or request more evidence", detail: "Keep accepted observations. The agent cannot override a failed application check.", uncertain: true },
      { id: "recommend", x: 24, y: 515, w: 350, label: "Recommendation", title: "Propose a budget change", detail: "State the exact campaign, change and supporting assumptions." },
      { id: "approve", x: 426, y: 515, w: 350, label: "Approval", title: "Authorise that change", detail: "An authorised person or policy approves the specific action." },
      { id: "execute", x: 24, y: 720, w: 350, label: "Execution", title: "Submit the permitted change", detail: "Use a separately authorised write operation." },
      { id: "verify", x: 426, y: 720, w: 350, label: "Verification", title: "Check platform state", detail: "Confirm the budget reached its intended value; sales impact still needs evidence." },
    ],
    edges: [{ path: "M248 132H288" }, { path: "M512 132H552" }, { path: "M400 210V280", dashed: true }, { path: "M664 210V280", dashed: true }, { path: "M776 132H790V505H199V515" }, { path: "M374 592H426" }, { path: "M601 670V695H199V720" }, { path: "M374 797H426" }],
    steps: [
      "The report envelope carries the latest observation of 14 attributed conversions together with scope, collection evidence, maturity, provenance, semantics and limitations.",
      "Application logic validates evidence and applies the workflow's decision policy before an agent can submit a recommendation. A missing requirement returns a limitation or a request for more evidence.",
      "If checks pass, the agent may recommend a specific budget change. An authorised person or policy must approve that action before a separately authorised write operation executes it.",
      "Verification checks that the intended platform state was reached. A confirmed budget change does not prove that sales improved or that any improvement was caused by advertising.",
    ],
    note: "A proposed application boundary. Passing the evidence checks permits a recommendation under policy; it does not itself grant approval, API write access or proof of incremental sales.",
  },
} satisfies Record<string, Diagram>;

// A shared, linear time scale keeps the two clocks comparable. Labels remain
// HTML text; the SVG draws only axes, markers and delay connectors.
const clockMarks = [
  { name: "A", eventX: 165, processedX: 165.2 },
  { name: "C", eventX: 191, processedX: 708 },
  { name: "B", eventX: 224, processedX: 661 },
];
const clockTicks = [{ x: 160, label: "21 Nov · 18:00" }, { x: 330, label: "22 Nov · 00:00" }, { x: 585, label: "09:00" }, { x: 755, label: "15:00 UTC" }];

export function ReportingDiagram({ kind }: { kind: keyof typeof diagrams }) {
  const diagram: Diagram = diagrams[kind];
  const id = `reporting-${kind}`;
  return (
    <figure className="marketplace-diagram reporting-diagram" data-diagram={kind}>
      <figcaption id={`${id}-caption`}>{diagram.title}</figcaption>
      <p className="marketplace-diagram-hint" id={`${id}-hint`}>Scroll across to follow the diagram. A text explanation is available below.</p>
      <div className="marketplace-diagram-scroll" tabIndex={0} role="region" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-hint`}>
        <div className="marketplace-diagram-map" style={{ minHeight: diagram.height }}>
          <svg width="800" height={diagram.height} viewBox={`0 0 800 ${diagram.height}`} aria-hidden="true" focusable="false">
            <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor" /></marker></defs>
            {diagram.edges.map((edge, index) => <path key={index} d={edge.path} className={edge.dashed ? "marketplace-edge marketplace-edge-uncertain" : "marketplace-edge"} markerEnd={`url(#${id}-arrow)`} />)}
            {kind === "two-clocks" && <>
              {[110, 260].map(y => <path key={y} d={`M160 ${y}H776`} className="marketplace-edge" markerEnd={`url(#${id}-arrow)`} />)}
              {clockTicks.map(tick => <path key={tick.x} d={`M${tick.x} 56V295`} className="reporting-clock-grid" />)}
              {clockMarks.map(mark => <g key={mark.name}>
                <path d={`M${mark.eventX} 110L${mark.processedX} 260`} className="marketplace-edge marketplace-edge-uncertain" />
                <circle cx={mark.eventX} cy="110" r="4" fill="currentColor" />
                <circle cx={mark.processedX} cy="260" r="4" fill="currentColor" />
              </g>)}
            </>}
          </svg>
          {diagram.lanes.map(lane => <p className="marketplace-lane" key={lane.text} style={{ left: lane.x, top: lane.y }}>{lane.text}</p>)}
          {kind === "two-clocks" && <>
            {clockTicks.map(tick => <span className="reporting-clock-tick" key={tick.x} style={{ left: tick.x, top: 24 }}>{tick.label}</span>)}
            {clockMarks.map(mark => <span className="reporting-clock-mark" key={`event-${mark.name}`} style={{ left: mark.eventX, top: 77 }}>{mark.name}</span>)}
            {clockMarks.map(mark => <span className="reporting-clock-mark" key={`processing-${mark.name}`} style={{ left: mark.processedX, top: 273 }}>{mark.name}</span>)}
          </>}
          <ul className="marketplace-nodes" role="list" aria-label="Diagram components">
            {diagram.nodes.map(node => <li key={node.id} data-node={node.id} className={node.uncertain ? "marketplace-node marketplace-node-uncertain" : "marketplace-node"} style={{ left: node.x, top: node.y, width: node.w ?? 224, minHeight: node.h ?? 155 } as CSSProperties}>
              <span>{node.label}</span><strong>{node.title}</strong><p>{node.detail}</p>
            </li>)}
          </ul>
        </div>
      </div>
      <p className="marketplace-diagram-note">{diagram.note}</p>
      <details className="marketplace-diagram-description"><summary>Read “{diagram.title}” as text</summary><ol>{diagram.steps.map(step => <li key={step}>{step}</li>)}</ol></details>
    </figure>
  );
}
