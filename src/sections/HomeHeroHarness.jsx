const previewJob = {
  title: "Plan this week's campaign report",
  copy: "Need source selection, governed tool use, and a verified answer.",
  queue: ["campaign report", "crawl alert review", "incident cluster summary"],
  metrics: {
    tools: "2 calls",
    memory: "12 chunks",
    latency: "480 ms",
  },
  lanes: {
    cli: "fetch analytics export",
    mcp: "load skill context",
    cache: "reuse crawl results",
    output: "report ready to send",
  },
  logs: [
    { key: "ok", label: "09:16", copy: "route matched reporting workflow" },
    { key: "ok", label: "09:17", copy: "policy allowed one CLI call and one MCP read" },
    { key: "info", label: "09:18", copy: "memory restored recent campaign thresholds" },
    { key: "ok", label: "09:19", copy: "response returned with checks passed" },
  ],
};

const steps = [
  { key: "route", label: "Route", copy: "classify intent and select the path" },
  { key: "policy", label: "Policy", copy: "approve calls and enforce constraints" },
  { key: "memory", label: "Memory", copy: "retrieve compacted context and state" },
  { key: "respond", label: "Respond", copy: "return a controlled result to the operator" },
];

export function HomeHeroHarness() {
  return (
    <div className="home-hero-harness" aria-label="AI harness preview">
      <div className="harness-stage">
        <div className="harness-column request-column">
          <div className="harness-chip chip-live">Preview flow</div>
          <div className="harness-card card-request">
            <span className="card-label">Incoming job</span>
            <strong>{previewJob.title}</strong>
            <p>{previewJob.copy}</p>
          </div>
          <div className="queue-stack" aria-hidden="true">
            {previewJob.queue.map((item, index) => (
              <div key={item} className={`queue-item ${index === 0 ? "active" : ""}`}>
                {item}
              </div>
            ))}
          </div>
          <div className="flow-lane lane-request" aria-hidden="true">
            <span className="packet packet-solo" />
          </div>
        </div>

        <div className="harness-column center-column">
          <div className="harness-core">
            <div className="core-header">
              <span className="card-label">Control plane</span>
              <strong>Deterministic harness path</strong>
            </div>

            <div className="core-pipeline">
              {steps.map((step, index) => (
                <div
                  key={step.key}
                  className={`pipeline-step ${
                    index === steps.length - 1 ? "step-output step-hold" : "step-complete"
                  }`}
                >
                  <span className="step-index">{`0${index + 1}`}</span>
                  <div>
                    <strong>{step.label}</strong>
                    <p>{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="core-metrics" aria-hidden="true">
              <div className="metric-card">
                <span className="metric-label">tools</span>
                <strong>{previewJob.metrics.tools}</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">memory</span>
                <strong>{previewJob.metrics.memory}</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">latency</span>
                <strong>{previewJob.metrics.latency}</strong>
              </div>
            </div>

            <div className="flow-lane lane-core" aria-hidden="true">
              <span className="packet packet-solo" />
            </div>
          </div>
        </div>

        <div className="harness-column systems-column">
          <div className="systems-grid">
            <div className="system-card">
              <span>Tool lane</span>
              <strong>CLI</strong>
              <p>{previewJob.lanes.cli}</p>
            </div>
            <div className="system-card">
              <span>Server lane</span>
              <strong>MCP</strong>
              <p>{previewJob.lanes.mcp}</p>
            </div>
            <div className="system-card">
              <span>State lane</span>
              <strong>Cache</strong>
              <p>{previewJob.lanes.cache}</p>
            </div>
            <div className="system-card output-card system-active">
              <span>Final lane</span>
              <strong>Verified result</strong>
              <p>{previewJob.lanes.output}</p>
              <em className="result-badge">Ready</em>
            </div>
          </div>

          <div className="log-window">
            {previewJob.logs.map((row, index) => (
              <div
                key={row.label}
                className={`log-row ${index === previewJob.logs.length - 1 ? "log-row-current" : "log-row-complete"}`}
              >
                <span className={`log-key ${row.key}`}>{row.label}</span>
                <span>{row.copy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
