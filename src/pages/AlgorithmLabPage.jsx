import { useEffect, useMemo, useState } from "react";
import { algorithms, operations } from "../visualizers/algorithms-data";
import { renderVisualization } from "../visualizers/renderers";
import { HeroAlgorithm } from "../sections/HeroAlgorithm";

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

export function AlgorithmLabPage() {
  const [filter, setFilter] = useState("All");
  const [currentId, setCurrentId] = useState("binary");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1050);

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
            CLIs, and agent orchestration. Each animation uses the marketing data
            shapes from the article: campaigns, crawls, reports, tool paths, and
            incident clusters.
          </p>
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
            <div className="step-meter">
              <span>{stepIndex + 1}</span>
              <span>/</span>
              <span>{currentAlgorithm.steps.length}</span>
            </div>
          </div>

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
        </section>
      </section>

      <section className="stack-map" id="stack-map" aria-labelledby="stack-map-title">
        <div className="section-head">
          <p className="eyebrow">From the article series</p>
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
              <h3>MCP tools</h3>
              <p>
                Binary search, heaps, Rabin-Karp, and deduplication gates make structured
                tool responses fast and auditable.
              </p>
            </div>
          </article>
          <article className="manual-row">
            <span className="manual-index">03</span>
            <div className="manual-body">
              <h3>Plugins</h3>
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
                Topological sort, Dijkstra, and Union-Find turn multi-agent work into
                schedulable paths and explainable clusters.
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
            The Algomaster reference uses a catalogue of algorithms and an individual
            workspace for each animation: input examples, code, a visual state, and
            a step counter. This site keeps that learning loop, but swaps textbook
            examples for marketing-agent systems from the article.
          </p>
        </div>
      </section>
    </main>
  );
}
