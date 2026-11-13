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

function StageControls({ diagramId }) {
  return (
        <div className="ads-controls">
          <ol className="ads-stage-picker" aria-label="Architecture stages">
            {architectureStages.map((item, index) => (
              <li key={item.short}>
                <button
                  type="button"
                  data-stage={index}
                  aria-label={`Stage ${index + 1}: ${item.short} — ${item.title}`}
                  aria-current={index === 0 ? "step" : undefined}
                  aria-controls={`${diagramId}-map ${diagramId}-explanations`}
                >
                  <span aria-hidden="true">0{index + 1}</span>{item.short}
                </button>
              </li>
            ))}
          </ol>
          <div className="ads-step-actions">
            <button type="button" data-previous="" aria-disabled="true">Previous</button>
            <p role="status">Stage 1 of {architectureStages.length}</p>
            <button type="button" data-next="">Next</button>
          </div>
          <button className="ads-complete-toggle" type="button" aria-pressed="false">
            Show complete diagram
          </button>
        </div>
  );
}

function DeliveryControls({ diagramId }) {
  return (
            <>
              <label htmlFor={`${diagramId}-example`}>Example ad outcome</label>
              <select id={`${diagramId}-example`} defaultValue="timely">
                {Object.entries(deliveryExamples).map(([value, item]) => (
                  <option key={value} value={value}>{item.label}</option>
                ))}
              </select>
              <p role="status">{deliveryExamples.timely.outcome}</p>
            </>
  );
}

/** Build-time HTML only. The Astro/TypeScript enhancement owns all browser state.
 * @param {{ id: string, GuideLink?: "a" | typeof import("./SiteLink").SiteLink }} props
 */
export function ChatGPTAdsArchitecture({ id: diagramId, GuideLink = "a" }) {
  const mapHeight = Math.max(...nodes.map((node) => node.y)) + BOX_HEIGHT + 24;
  return (
    <div className="ads-deep-dive" data-ads-walkthrough="">
      <p className="ads-scope-note">
        This diagram shows how ChatGPT answers and how the ad system works alongside it.
        Solid boxes show steps OpenAI describes. Dashed boxes show how Harness
        proposes to collect and save reports. Sources reviewed 8 November 2026.
      </p>
      <>
        <template data-controls=""><StageControls diagramId={diagramId} /></template>
        <template data-delivery-controls=""><div><DeliveryControls diagramId={diagramId} /></div></template>
      </>
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
              {connections.map((edge) => (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={edge.path}
                  data-from={edge.from}
                  data-to={edge.to}
                  data-outcomes={edge.outcomes?.join(" ")}
                  className={`ads-connection${edge.reference ? " ads-reference-connection" : ""}`}
                  markerEnd={`url(#${diagramId}-arrow)`}
                  markerStart={edge.both ? `url(#${diagramId}-arrow)` : undefined}
                />
              ))}
            </svg>
            <ul className="ads-nodes" aria-label="Diagram components">
              {nodes.map((node) => (
                <li
                  key={node.id}
                  data-node={node.id}
                  data-stage={node.stage}
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
        <div className="ads-delivery-example">
          <p>Example ad outcomes</p>
          <ul>{Object.entries(deliveryExamples).map(([value, item]) => (
            <li key={item.label} data-example={value}><strong>{item.label}.</strong> {item.outcome}</li>
          ))}</ul>
          <p className="ads-example-note">These examples use imagined situations to show how an ad can be chosen and still go unseen.</p>
        </div>
      <div className="ads-explanations" id={`${diagramId}-explanations`}>
        {architectureStages.map((item, index) => (
          <section className="ads-stage-copy" key={item.short} data-stage={index} aria-labelledby={`${diagramId}-stage-${index}`}>
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
