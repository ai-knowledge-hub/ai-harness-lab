import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  architectureNodes,
  architectureSources,
  architectureStages,
  deliveryExamples,
} from "../content/chatgpt-ad-architecture";

const BOX_WIDTH = 164;
const BOX_HEIGHT = 92;
const nodes = architectureNodes.map((node) => ({
  ...node, x: 24 + node.column * 196, y: 24 + node.row * 132,
}));
const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
function port(id, side) {
  const { x, y } = byId[id];
  return {
    top: [x + BOX_WIDTH / 2, y],
    bottom: [x + BOX_WIDTH / 2, y + BOX_HEIGHT],
    left: [x, y + BOX_HEIGHT / 2],
    right: [x + BOX_WIDTH, y + BOX_HEIGHT / 2],
  }[side];
}
function connection(from, to, options = {}) {
  const start = port(from, options.start ?? "right");
  const end = port(to, options.end ?? "left");
  const route = options.viaY !== undefined
    ? `V ${options.viaY} H ${end[0]} V ${end[1]}`
    : options.viaX !== undefined
      ? `H ${options.viaX} V ${end[1]} H ${end[0]}`
      : `L ${end.join(" ")}`;
  return { from, to, ...options, path: `M ${start.join(" ")} ${route}` };
}
const connections = [
  connection("turn", "answer"),
  connection("answer", "client"),
  connection("turn", "session", { start: "bottom", end: "top" }),
  connection("session", "orchestrator"),
  ...["retrieval", "eligibility", "scoring", "auction"].map((tool) =>
    connection("orchestrator", tool, { start: "bottom", end: "top", viaY: 268, both: true }),
  ),
  connection("auction", "checks", { start: "bottom", end: "top", viaY: 400 }),
  connection("checks", "no-ad", { start: "left", end: "right", outcomes: ["ineligible"] }),
  connection("checks", "bundle", { outcomes: ["timely", "late"] }),
  connection("bundle", "display", { start: "bottom", end: "top", outcomes: ["timely", "late"] }),
  connection("display", "late", { start: "left", end: "right", outcomes: ["late"] }),
  connection("display", "client", { end: "right", viaX: 790, outcomes: ["timely"] }),
  // The routing is explanatory. It does not specify OpenAI's logging transport.
  { from: "client", to: "logs", path: "M 694 116 V 140 H 596 V 664 H 302 V 684" },
  // There is deliberately no invented logs-to-Insights internal pipeline.
  connection("worker", "insights", { start: "top", end: "bottom", both: true, reference: true }),
  connection("worker", "evidence", { start: "left", end: "right", reference: true }),
];

export function ChatGPTAdsArchitecture({ id: diagramId }) {
  const [enhanced, setEnhanced] = useState(false);
  const [stage, setStage] = useState(0);
  const [complete, setComplete] = useState(false);
  const [example, setExample] = useState("timely");
  useEffect(() => setEnhanced(true), []);

  // Server HTML remains a complete reference when JavaScript is unavailable.
  const showAll = !enhanced || complete;
  const visibleNodes = nodes.filter((node) => showAll || node.stage <= stage);
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const mapHeight = Math.max(...visibleNodes.map((node) => node.y)) + BOX_HEIGHT + 24;
  const outcome = deliveryExamples[example];
  const showDelivery = showAll || stage >= 2;
  function selectStage(index) {
    setStage(index);
    setComplete(false);
  }

  return (
    <div className="ads-deep-dive">
      <p className="ads-scope-note">
        Simplified logical architecture. OpenAI documents the solid components;
        dashed components are our proposed integration. Layout and grouping are
        explanatory, not a deployment blueprint. Sources reviewed 8 November 2026.
      </p>
      {enhanced && (
        <div className="ads-controls">
          <ol className="ads-stage-picker" aria-label="Architecture stages">
            {architectureStages.map((item, index) => (
              <li key={item.short}>
                <button
                  type="button"
                  aria-label={`Stage ${index + 1}: ${item.title}`}
                  aria-current={!complete && stage === index ? "step" : undefined}
                  aria-controls={`${diagramId}-map ${diagramId}-explanations`}
                  onClick={() => selectStage(index)}
                >
                  <span aria-hidden="true">0{index + 1}</span>{item.short}
                </button>
              </li>
            ))}
          </ol>
          <div className="ads-step-actions">
            <button type="button" disabled={complete || stage === 0} onClick={() => selectStage(stage - 1)}>Previous</button>
            <p role="status">{complete ? "Complete diagram" : `Stage ${stage + 1} of ${architectureStages.length}`}</p>
            <button type="button" disabled={complete || stage === architectureStages.length - 1} onClick={() => selectStage(stage + 1)}>Next</button>
          </div>
          <button className="ads-complete-toggle" type="button" aria-pressed={complete} onClick={() => setComplete((value) => !value)}>
            {complete ? "Return to staged view" : "Show complete diagram"}
          </button>
        </div>
      )}
      <figure className="ads-figure">
        <figcaption>
          <span>ChatGPT Ads · logical system map</span>
          <span className="ads-legend"><span>Solid: OpenAI documented</span><span>Dashed: Harness reference design</span></span>
        </figcaption>
        <p className="ads-scroll-hint">Scroll across the diagram to inspect each component →</p>
        <div className="ads-map-scroll" tabIndex={0} role="region" aria-label="Architecture diagram">
          <div className="ads-map" id={`${diagramId}-map`} style={{ height: mapHeight }}>
            <svg width="800" height={mapHeight} viewBox={`0 0 800 ${mapHeight}`} aria-hidden="true" focusable="false">
              <defs>
                <marker id={`${diagramId}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
              </defs>
              {connections.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to)).map((edge) => (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={edge.path}
                  data-from={edge.from}
                  data-to={edge.to}
                  className={`ads-connection${edge.reference ? " ads-reference-connection" : ""}`}
                  data-muted={enhanced && edge.outcomes && !edge.outcomes.includes(example) ? "true" : undefined}
                  markerEnd={`url(#${diagramId}-arrow)`}
                  markerStart={edge.both ? `url(#${diagramId}-arrow)` : undefined}
                />
              ))}
            </svg>
            <ul className="ads-nodes" aria-label="Diagram components">
              {visibleNodes.map((node) => (
                <li
                  key={node.id}
                  data-node={node.id}
                  data-origin={node.origin}
                  className="ads-node"
                  style={{ left: node.x, top: node.y, width: BOX_WIDTH, height: BOX_HEIGHT }}
                >
                  <span className="ads-node-origin">{node.origin === "reference" ? "Harness · proposed" : "OpenAI · documented"}</span>
                  <strong>{node.title}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="ads-map-note">Two-headed arrows indicate repeatable tool calls or request/response. A rejected placement stops before the bundle; a late bundle can reach the frontend without being displayed. No internal logs-to-reporting connection is asserted.</p>
      </figure>
      {showDelivery && (
        <div className="ads-delivery-example">
          {enhanced ? (
            <>
              <label htmlFor={`${diagramId}-example`}>Illustrative delivery outcome</label>
              <select id={`${diagramId}-example`} value={example} onChange={(event) => setExample(event.target.value)}>
                {Object.entries(deliveryExamples).map(([value, item]) => (
                  <option key={value} value={value}>{item.label}</option>
                ))}
              </select>
              <p role="status">{outcome.outcome}</p>
            </>
          ) : (
            <>
              <p>Illustrative delivery outcomes</p>
              <ul>{Object.values(deliveryExamples).map((item) => (
                <li key={item.label}><strong>{item.label}.</strong> {item.outcome}</li>
              ))}</ul>
            </>
          )}
          <p className="ads-example-note">A walkthrough of the delivery boundary, not live traffic or a provider trace.</p>
        </div>
      )}
      <div className="ads-explanations" id={`${diagramId}-explanations`}>
        {architectureStages.map((item, index) => (showAll || index === stage) && (
          <section className="ads-stage-copy" key={item.short} aria-labelledby={`${diagramId}-stage-${index}`}>
            <p className="eyebrow">{item.proposal ? "Harness reference design · Planned" : "OpenAI documented · Simplified"}</p>
            <h3 id={`${diagramId}-stage-${index}`}>{index + 1}. {item.title}</h3>
            <p>{item.documented ?? item.proposal}</p>
            <dl>
              <dt>Implementation implication</dt><dd>{item.implication}</dd>
              <dt>What to check</dt><dd>{item.check}</dd>
            </dl>
            <a className="source-citation" href={architectureSources[item.source].href}>{architectureSources[item.source].title}</a>
            {index === 3 && <> · <a className="source-citation" href={architectureSources.engineering.href}>Logging and feedback account</a></>}
            {item.proposal && <p><Link className="text-link" to="/learn/system-design/api-design">Open the reporting API-design preview</Link></p>}
          </section>
        ))}
      </div>
      <details className="ads-evidence-note">
        <summary>How to read the evidence boundary</summary>
        <p>The published descriptions establish responsibilities and behaviours. They do not establish the exact service topology, storage products, transport protocols, model weights or deployment choices. The dashed worker and store are our proposed reference build. Their implementation is still planned.</p>
      </details>
    </div>
  );
}
