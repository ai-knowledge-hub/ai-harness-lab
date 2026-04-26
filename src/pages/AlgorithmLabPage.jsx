import { useEffect, useMemo, useState } from "react";
import { algorithms, operations } from "../visualizers/algorithms-data";
import { renderVisualization } from "../visualizers/renderers";
import { HeroAlgorithm } from "../sections/HeroAlgorithm";

const ARTICLE_URL =
  "https://ai-news-hub.performics-labs.com/analysis/deterministic-core-algorithms-data-structures-marketing-agents";
const CONTROL_ARTICLE_URL =
  "https://ai-news-hub.performics-labs.com/news/google-cloud-next-2026-marketing-commerce-adtech-impact";

function CodeView({ lines, activeLine }) {
  return (
    <pre>
      <code>
        {lines.map((line, index) => {
          const lineNumber = String(index + 1).padStart(2, " ");
          return (
            <span
              key={`${lineNumber}-${line}`}
              className={`code-line ${index + 1 === activeLine ? "active" : ""}`}
            >
              {lineNumber} {"  "}
              {line}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

function ContextView({ context }) {
  const rows = [
    ["Why it exists", context.why],
    ["What it optimizes", context.optimizes],
    ["Still used in", context.stillUsed],
    ["Remember", context.remember],
  ];

  return (
    <article className="panel context-panel">
      <div className="panel-title">
        <span>Practical context</span>
      </div>
      <div className="context-grid">
        {rows.map(([label, copy]) => (
          <section className="context-row" key={label}>
            <span className="meta-label">{label}</span>
            <p>{copy}</p>
          </section>
        ))}
      </div>
    </article>
  );
}

export function AlgorithmLabPage() {
  const [filter, setFilter] = useState("All");
  const [currentId, setCurrentId] = useState("binary");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1050);
  const [viewMode, setViewMode] = useState("run");

  const currentAlgorithm = useMemo(
    () => algorithms.find((item) => item.id === currentId) ?? algorithms[0],
    [currentId],
  );

  const currentStep = currentAlgorithm.steps[stepIndex];

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setStepIndex((previous) => {
        if (previous >= currentAlgorithm.steps.length - 1) {
          setPlaying(false);
          return previous;
        }
        return previous + 1;
      });
    }, speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, currentAlgorithm.steps.length]);

  const visibleAlgorithms = algorithms.filter(
    (item) => filter === "All" || item.operation === filter,
  );

  function setAlgorithm(id) {
    setCurrentId(id);
    setStepIndex(0);
    setPlaying(false);
  }

  return (
    <main id="top">
      <section className="module-hero algorithm-hero" aria-labelledby="page-title">
        <div className="intro-copy">
          <h1 id="page-title">Algorithms inside marketing agents</h1>
          <p>
            Step through the deterministic core behind skills, MCP tools, plugins,
            CLIs, agent orchestration, and governed control planes. Each animation
            uses marketing system shapes: campaigns, crawls, reports, tool paths,
            incident clusters, approvals, permission graphs, and audit logs.
          </p>
          <div className="article-bridge" aria-label="Source analysis">
            <span className="manual-index">Sources</span>
            <div className="source-list">
              <article className="source-row">
                <div>
                  <h2>The Deterministic Core</h2>
                  <p>
                    The systems argument for why marketing agents need explicit
                    algorithms for finding, exploring, ordering, routing,
                    deduplicating, and compressing work.
                  </p>
                </div>
                <a className="inline-link" href={ARTICLE_URL} target="_blank" rel="noreferrer">
                  Read algorithms essay
                </a>
              </article>
              <article className="source-row">
                <div>
                  <h2>Google Cloud Next 2026</h2>
                  <p>
                    The control-plane source for the identity, gateway, policy,
                    approval, and audit visualizers added to the Control group.
                  </p>
                </div>
                <a
                  className="inline-link muted-link"
                  href={CONTROL_ARTICLE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read control-plane article
                </a>
              </article>
            </div>
          </div>
        </div>
        <HeroAlgorithm />
      </section>

      <section className="workspace" id="visualizer" aria-label="Algorithm visualizer">
        <aside className="catalogue" aria-label="Algorithm catalogue">
          <div className="catalogue-head">
            <p className="eyebrow">Operations</p>
            <h2>Choose a pattern</h2>
          </div>
          <div className="filters">
            {operations.map((operation) => (
              <button
                key={operation}
                className={`filter ${filter === operation ? "active" : ""}`}
                type="button"
                onClick={() => {
                  setFilter(operation);
                  const visibleCurrent = algorithms.some(
                    (item) =>
                      item.id === currentId &&
                      (operation === "All" || item.operation === operation),
                  );
                  if (!visibleCurrent) {
                    const nextAlgorithm =
                      algorithms.find((item) => item.operation === operation) ??
                      algorithms[0];
                    setAlgorithm(nextAlgorithm.id);
                  }
                }}
              >
                {operation}
              </button>
            ))}
          </div>
          <div className="algorithm-list">
            {visibleAlgorithms.map((item) => (
              <button
                key={item.id}
                className={`algorithm-button ${item.id === currentId ? "active" : ""}`}
                type="button"
                onClick={() => setAlgorithm(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.short}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="stage" aria-live="polite">
          <div className="stage-head">
            <div>
              <p className="eyebrow">{currentAlgorithm.operation}</p>
              <h2>{currentAlgorithm.title}</h2>
              <p>{currentAlgorithm.summary}</p>
            </div>
            <div className="stage-meta">
              <div className="mode-tabs" aria-label="Algorithm view">
                {["run", "context"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={viewMode === mode ? "active" : ""}
                    aria-pressed={viewMode === mode}
                    onClick={() => {
                      setViewMode(mode);
                      if (mode === "context") setPlaying(false);
                    }}
                  >
                    {mode === "run" ? "Run" : "Context"}
                  </button>
                ))}
              </div>
              {viewMode === "run" && (
                <div className="step-meter">
                  <span>{stepIndex + 1}</span>
                  <span>/</span>
                  <span>{currentAlgorithm.steps.length}</span>
                </div>
              )}
            </div>
          </div>

          {viewMode === "run" ? (
            <>
              <div className="controls" aria-label="Animation controls">
                <div className="control-group">
                  <button type="button" onClick={() => setStepIndex(0)}>
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setStepIndex((previous) => Math.max(0, previous - 1))}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="primary"
                    onClick={() => setPlaying((previous) => !previous)}
                  >
                    {playing ? "Pause" : "Play"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setStepIndex((previous) =>
                        Math.min(currentAlgorithm.steps.length - 1, previous + 1),
                      )
                    }
                  >
                    Next
                  </button>
                </div>
                <label className="speed-control">
                  <span>Speed</span>
                  <input
                    type="range"
                    min="500"
                    max="1800"
                    value={speed}
                    onChange={(event) => setSpeed(Number(event.target.value))}
                  />
                </label>
              </div>

              <div className="stage-grid">
                <article className="panel visual-panel">
                  <div className="panel-title">
                    <span>Animation</span>
                    <strong>{currentStep.label}</strong>
                  </div>
                  <div
                    className="visualization"
                    dangerouslySetInnerHTML={{
                      __html: renderVisualization(currentAlgorithm.id, currentStep),
                    }}
                  />
                </article>

                <article className="panel code-panel">
                  <div className="panel-title">
                    <span>Reference code</span>
                    <strong>{currentAlgorithm.complexity}</strong>
                  </div>
                  <CodeView lines={currentAlgorithm.code} activeLine={currentStep.line} />
                </article>
              </div>

              <div className="explain-row">
                <article className="panel">
                  <div className="panel-title">
                    <span>Current step</span>
                  </div>
                  <p>{currentStep.note}</p>
                </article>
                <article className="panel">
                  <div className="panel-title">
                    <span>Why it helps LLM apps</span>
                  </div>
                  <p>{currentAlgorithm.agentUse}</p>
                </article>
              </div>
            </>
          ) : (
            <ContextView context={currentAlgorithm.context} />
          )}
        </section>
      </section>

      <section className="stack-map" id="stack-map" aria-labelledby="stack-map-title">
        <div className="section-head">
          <p className="eyebrow">From the source analysis</p>
          <h2 id="stack-map-title">Where each structure sits in the agent stack</h2>
        </div>
        <div className="manual-list stack-manual">
          <article className="manual-row">
            <span className="manual-index">01</span>
            <div className="manual-body">
              <h3>Skills</h3>
              <p>
                BFS, DFS, topological sort, Bloom filters, and circular buffers keep
                workflow steps explicit and bounded.
              </p>
            </div>
          </article>
          <article className="manual-row">
            <span className="manual-index">02</span>
            <div className="manual-body">
              <h3>Tools and MCP</h3>
              <p>
                Binary search, heaps, Rabin-Karp, and routing algorithms make
                structured tool responses fast, auditable, and safe to inspect.
              </p>
            </div>
          </article>
          <article className="manual-row">
            <span className="manual-index">03</span>
            <div className="manual-body">
              <h3>Plugins and Memory</h3>
              <p>
                Plugin packages rely on memory windows, indexes, dependency graphs,
                and portable execution rules.
              </p>
            </div>
          </article>
          <article className="manual-row">
            <span className="manual-index">04</span>
            <div className="manual-body">
              <h3>Orchestration</h3>
              <p>
                Topological sort, Dijkstra, Union-Find, and lease-locked queues turn
                multi-agent work into schedulable, recoverable paths.
              </p>
            </div>
          </article>
          <article className="manual-row">
            <span className="manual-index">05</span>
            <div className="manual-body">
              <h3>Control Plane</h3>
              <p>
                Approval state machines, token buckets, permission graphs, and audit
                hash chains enforce identity, policy, rate limits, and
                tamper-evident logs.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="build-notes" id="build-notes" aria-labelledby="build-notes-title">
        <div className="section-head">
          <p className="eyebrow">Implementation notes</p>
          <h2 id="build-notes-title">How this mirrors the reference pattern</h2>
        </div>
        <div className="build-note-body">
          <span className="manual-index">01</span>
          <p>
            The published analysis provides the systems argument and the six
            operation model: find, explore, order, deduplicate, route, and
            compress. This lab turns those categories into visual states, code
            traces, and marketing-specific data examples that can be studied step
            by step.
          </p>
        </div>
      </section>
    </main>
  );
}
