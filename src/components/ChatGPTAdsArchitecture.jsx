import { useEffect, useState } from "react";
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

/** @param {{ id: string, GuideLink?: "a" | typeof import("./SiteLink").SiteLink, staticEnhancement?: boolean }} props */
export function ChatGPTAdsArchitecture({ id: diagramId, GuideLink = "a", staticEnhancement = false }) {
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
        This diagram shows how ChatGPT answers and how the ad system works alongside it.
        Solid boxes show steps OpenAI describes. Dashed boxes show how Harness
        proposes to collect and save reports. Sources reviewed 8 November 2026.
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
          <span>ChatGPT Ads · how the parts fit together</span>
          <span className="ads-legend"><span>Solid: OpenAI documented</span><span>Dashed: Harness proposal</span></span>
        </figcaption>
        <p className="ads-scroll-hint">Scroll sideways to see the rest of the diagram →</p>
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
                  data-outcomes={staticEnhancement ? edge.outcomes?.join(" ") : undefined}
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
                  data-stage={staticEnhancement ? node.stage : undefined}
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
        <p className="ads-map-note">Arrows that point both ways show a request and its reply, or a tool the system can use again. The final check can stop an ad before it is sent. An ad that arrives late has already been sent and misses its chance to appear.</p>
      </figure>
      {showDelivery && (
        <div className="ads-delivery-example">
          {enhanced ? (
            <>
              <label htmlFor={`${diagramId}-example`}>Example ad outcome</label>
              <select id={`${diagramId}-example`} value={example} onChange={(event) => setExample(event.target.value)}>
                {Object.entries(deliveryExamples).map(([value, item]) => (
                  <option key={value} value={value}>{item.label}</option>
                ))}
              </select>
              <p role="status">{outcome.outcome}</p>
            </>
          ) : (
            <>
              <p>Example ad outcomes</p>
              <ul>{Object.entries(deliveryExamples).map(([value, item]) => (
                <li key={item.label} data-example={staticEnhancement ? value : undefined}><strong>{item.label}.</strong> {item.outcome}</li>
              ))}</ul>
            </>
          )}
          <p className="ads-example-note">These examples use imagined situations to show how an ad can be chosen and still go unseen.</p>
        </div>
      )}
      <div className="ads-explanations" id={`${diagramId}-explanations`}>
        {architectureStages.map((item, index) => (showAll || index === stage) && (
          <section className="ads-stage-copy" key={item.short} data-stage={staticEnhancement ? index : undefined} aria-labelledby={`${diagramId}-stage-${index}`}>
            <p className="eyebrow">{item.proposal ? "Harness proposal · Planned" : "OpenAI documented · Simplified"}</p>
            <h3 id={`${diagramId}-stage-${index}`}>{index + 1}. {item.title}</h3>
            <p>{item.documented ?? item.proposal}</p>
            <dl>
              <dt>What this means in practice</dt><dd>{item.implication}</dd>
              <dt>What to check</dt><dd>{item.check}</dd>
            </dl>
            <a className="source-citation" href={architectureSources[item.source].href}>{architectureSources[item.source].title}</a>
            {index === 1 && <p><a className="text-link" href="#orchestrator-detail">See six steps involved in choosing an ad</a></p>}
            {index === 3 && <p><GuideLink className="text-link" href="/learn/system-design/chatgpt-ads-apis">See what advertisers can do with the APIs</GuideLink></p>}
            {index === 3 && <> · <a className="source-citation" href={architectureSources.engineering.href}>How OpenAI records events and feedback</a></>}
            {item.proposal && <p><GuideLink className="text-link" href="/learn/system-design/chatgpt-ads-reporting">Open the reporting example</GuideLink></p>}
          </section>
        ))}
      </div>
      <details className="ads-evidence-note">
        <summary>What this diagram is based on</summary>
        <p>OpenAI describes what each part does. The diagram groups those parts to make the process easier to follow. The report collector and saved report data are part of a planned Harness build.</p>
      </details>
    </div>
  );
}
