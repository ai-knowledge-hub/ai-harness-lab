import { useEffect, useMemo, useState, type SetStateAction, type ReactNode } from "react";
import { algorithms, operations, type Algorithm } from "../visualizers/algorithms-data";
import { renderVisualization } from "../visualizers/render-visualization";
import { binaryScenarios, boundaryTrace, renderBinary, type BinaryExperiment } from "../visualizers/binary-search";
import { BinarySearchSettings, BinarySearchGrowth } from "../components/BinarySearchTools";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { articleUrl, trackPath, tracks } from "../content/site";

const ARTICLE_URL = articleUrl(
  "deterministic-core-algorithms-data-structures-marketing-agents",
);
const CONTROL_ARTICLE_URL = articleUrl(
  "anatomy-marketing-agent-skills-tools-mcp",
);
const AD_PLATFORM_SECURITY_URL = articleUrl(
  "building-secure-marketing-agents-ad-platform-authentication-architecture",
);

function CodeView({ lines, activeLine }: { lines: string[]; activeLine: number }) {
  return (
    <pre tabIndex={0} role="region" aria-labelledby="reference-code-label">
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

function ContextView({ context }: { context: Algorithm["context"] }) {
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

export function AlgorithmLabPage({ deferQueryUntilMounted = false, binaryContext }: { deferQueryUntilMounted?: boolean; binaryContext?: ReactNode }) {
  const [filter, setFilter] = useState("All");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [queryReady, setQueryReady] = useState(!deferQueryUntilMounted);
  useEffect(() => {
    if (deferQueryUntilMounted) setQueryReady(true);
  }, [deferQueryUntilMounted]);
  const requestedId = queryReady ? searchParams.get("algorithm") : null;
  const currentId = algorithms.some((item) => item.id === requestedId)
    ? requestedId
    : "binary";
  const [stepIndex, setStepIndex] = useState(0);
  const [playback, setPlayback] = useState<"ready" | "playing" | "paused" | "complete">("ready");
  const playing = playback === "playing";
  const [speed, setSpeed] = useState(1050);
  const [otherViewMode, setOtherViewMode] = useState("run");
  // Existing algorithm query links are invitations to run a visualizer.
  // The ordinary lesson entry and catalogue selection start with Context.
  const requestedView = queryReady ? searchParams.get("view") : null;
  const binaryView = requestedView === "run" || requestedView !== "context" && requestedId === "binary" ? "run" : "context";
  const viewMode = currentId === "binary"
    ? binaryView : otherViewMode;
  const requestedExperiment = queryReady ? searchParams.get("experiment") : null;
  const binaryExperiment: BinaryExperiment = requestedExperiment === "counterexample" || requestedExperiment === "growth"
    ? requestedExperiment : "boundary";
  const [binaryThreshold, setBinaryThreshold] = useState(650);
  const [revealBinary, setRevealBinary] = useState(false);
  const [prediction, setPrediction] = useState<"lo" | "hi" | null>(null);
  const binarySteps = useMemo(() => boundaryTrace(
    binaryScenarios[binaryExperiment === "counterexample" ? "counterexample" : "boundary"].values,
    binaryThreshold,
  ), [binaryExperiment, binaryThreshold]);

  const currentAlgorithm = useMemo(
    () => {
      const item = algorithms.find((item) => item.id === currentId) ?? algorithms[0];
      return item.id === "binary" ? { ...item, steps: binarySteps } : item;
    },
    [currentId, binarySteps],
  );

  const currentStep =
    currentAlgorithm.steps[stepIndex] ?? currentAlgorithm.steps[0];
  const binaryStep = currentAlgorithm.id === "binary" ? currentAlgorithm.steps[stepIndex] ?? currentAlgorithm.steps[0] : null;
  const scaling = currentId === "binary" && binaryExperiment === "growth";

  useEffect(() => {
    setStepIndex(0);
    setPlayback("ready");
    setPrediction(null);
  }, [currentId]);

  useEffect(() => {
    setBinaryThreshold(binaryExperiment === "counterexample" ? 6 : 650);
    setRevealBinary(false);
    setPrediction(null);
    setStepIndex(0);
    setPlayback("ready");
  }, [binaryExperiment]);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setPrediction(null);
      setStepIndex((previous) => {
        if (previous >= currentAlgorithm.steps.length - 1) {
          setPlayback("complete");
          return previous;
        }
        return previous + 1;
      });
    }, speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, currentAlgorithm.steps.length]);

  const activeFilter =
    filter === "All" || filter === currentAlgorithm.operation ? filter : "All";
  const visibleAlgorithms = algorithms.filter(
    (item) => activeFilter === "All" || item.operation === activeFilter,
  );

  function setAlgorithm(id: Algorithm["id"]) {
    // Reselecting the active entry resets playback without creating a new
    // navigation key, which would be treated as an intentional anchor revisit.
    if (currentId !== id) {
      const next = new URLSearchParams(searchParams);
      next.set("algorithm", id);
      next.delete("experiment");
      if (id === "binary") next.set("view", "context");
      else next.delete("view");
      navigate(
        {
          pathname: location.pathname,
          search: next.toString(),
          hash: location.hash,
        },
        { preventScrollReset: true },
      );
    }
    setStepIndex(0);
    setPlayback("ready");
    setPrediction(null);
  }

  function setManualStep(update: SetStateAction<number>) {
    setPlayback("paused");
    setStepIndex(update);
    setPrediction(null);
  }

  function chooseBinaryExperiment(experiment: BinaryExperiment, jump = false) {
    navigateBinary("run", experiment, jump);
    setBinaryThreshold(experiment === "counterexample" ? 6 : 650);
    setRevealBinary(false);
    setPrediction(null);
    setStepIndex(0);
    setPlayback("ready");
  }

  function binaryHref(mode: "run" | "context", experiment?: BinaryExperiment) {
    const next = new URLSearchParams(searchParams);
    next.set("algorithm", "binary");
    next.set("view", mode);
    if (experiment) next.set("experiment", experiment);
    return `${location.pathname}?${next.toString()}#visualizer`;
  }

  function navigateBinary(mode: "run" | "context", experiment?: BinaryExperiment, jump = false) {
    const href = binaryHref(mode, experiment);
    const destination = jump ? href : href.replace(/#visualizer$/, location.hash);
    if (destination !== `${location.pathname}${location.search}${location.hash}`) {
      navigate(destination, { preventScrollReset: true });
    }
    setPlayback("paused");
    if (jump) requestAnimationFrame(() => {
      const stage = document.getElementById("visualizer");
      stage?.focus({ preventScroll: true });
      stage?.scrollIntoView({ block: "start" });
    });
  }

  function setViewMode(mode: "run" | "context") {
    if (currentId === "binary") navigateBinary(mode);
    else setOtherViewMode(mode);
  }

  return (
    <main id="main-content" className="lab-page" tabIndex={-1}>
      <nav className="breadcrumbs editorial-wrap" aria-label="Breadcrumb">
        <a href="/">Harness</a>
        <span aria-hidden="true">/</span>
        <a href={trackPath(tracks[1])}>Algorithms & Data</a>
        <span aria-hidden="true">/</span>
        <span>Visualizers</span>
      </nav>
      <section
        className="module-hero algorithm-hero"
        aria-labelledby="page-title"
      >
        <div className="intro-copy">
          <h1 id="page-title">Algorithms inside marketing agents</h1>
          <p>
            Explore how algorithms search records, organise tasks and control
            actions in an agent system. Step through the examples and compare
            each change in the animation with the code that produces it.
          </p>
          <a className="action-link" href="#catalogue">
            Choose a visualizer
          </a>
        </div>
      </section>

      <section className="workspace" aria-label="Algorithm visualizer">
        <aside
          className="catalogue"
          id="catalogue"
          aria-label="Algorithm catalogue"
        >
          <div className="catalogue-head">
            <p className="eyebrow">Operations</p>
            <h2>Choose a pattern</h2>
          </div>
          <div className="filters">
            {operations.map((operation) => (
              <button
                key={operation}
                className={`filter ${activeFilter === operation ? "active" : ""}`}
                aria-pressed={activeFilter === operation}
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
                aria-pressed={item.id === currentId}
                type="button"
                onClick={() => setAlgorithm(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.short}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="stage" id="visualizer" tabIndex={-1}
          onClick={event => {
            if (currentId !== "binary" || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-binary-view], a[data-binary-scenario]");
            if (!link) return;
            const experiment = link.dataset.binaryScenario;
            event.preventDefault();
            if (experiment === "boundary" || experiment === "counterexample" || experiment === "growth") chooseBinaryExperiment(experiment, true);
            else navigateBinary(link.dataset.binaryView === "context" ? "context" : "run", undefined, true);
          }}>
          <div className="stage-head">
            <div>
              <p className="eyebrow">{currentAlgorithm.operation}</p>
              <h2>{currentAlgorithm.title}</h2>
              <p>{currentAlgorithm.summary}</p>
              {currentId === "binary" && <div className="binary-introduction">
                <p>In the spending example, we want to find when a campaign’s cumulative spending first reaches £650. Because the total never decreases, checking a day near the middle lets us rule out earlier or later days. Repeating this process finds the first qualifying day or establishes that the threshold was never reached.</p>
                <p>Step through the search, then test what happens when the values rise and fall.</p>
                <p><a className="inline-link" data-binary-view={viewMode === "context" ? "run" : "context"}
                  href={binaryHref(viewMode === "context" ? "run" : "context")}>
                  {viewMode === "context" ? "Try the algorithm" : "Read the explanation"}
                </a></p>
              </div>}
            </div>
            <div className="stage-meta">
              <div className="mode-tabs" aria-label="Algorithm view">
                {(currentId === "binary" ? ["context", "run"] as const : ["run", "context"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={viewMode === mode ? "active" : ""}
                    aria-pressed={viewMode === mode}
                    onClick={() => {
                      setViewMode(mode);
                      if (mode === "context") setPlayback("paused");
                    }}
                  >
                    {mode === "run" ? "Run" : "Context"}
                  </button>
                ))}
              </div>
              {viewMode === "run" && !scaling && (
                <div className="step-meter">
                  <span>{stepIndex + 1}</span>
                  <span>/</span>
                  <span>{currentAlgorithm.steps.length}</span>
                </div>
              )}
            </div>
          </div>

          {(viewMode === "run" || currentId === "binary") && (
            <div hidden={viewMode !== "run"}>
              {currentId === "binary" && <BinarySearchSettings experiment={binaryExperiment} threshold={binaryThreshold} reveal={revealBinary}
                onExperiment={chooseBinaryExperiment} onReveal={setRevealBinary}
                onThreshold={value => { setBinaryThreshold(value); setManualStep(0); }} />}
              {scaling ? <BinarySearchGrowth /> : <>
              <div className="controls" aria-label="Animation controls">
                <div className="control-group">
                  <button type="button" onClick={() => setManualStep(0)}>
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setManualStep((previous) => Math.max(0, previous - 1))
                    }
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="primary"
                    onClick={() => setPlayback((previous) => previous === "playing" ? "paused" : "playing")}
                  >
                    {playing ? "Pause" : "Play"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setManualStep((previous) =>
                        Math.min(
                          currentAlgorithm.steps.length - 1,
                          previous + 1,
                        ),
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
                    aria-valuetext={`${speed} milliseconds between steps`}
                    onChange={(event) => setSpeed(Number(event.target.value))}
                  />
                </label>
              </div>

              <div className="stage-grid">
                <article className="panel visual-panel">
                  <div className="panel-title">
                    <span id="animation-label">Animation</span>
                    <strong>{currentStep.label}</strong>
                  </div>
                  {binaryStep && <p className="binary-reading-key">Each card shows a day and its index: Day 1 is index 0. T means the threshold is met; F means it is not. The dots below are possible answers; <code>lo</code> and <code>hi</code> mark their limits.</p>}
                  <div
                    key={currentAlgorithm.id}
                    className="visualization"
                    tabIndex={0}
                    role="region"
                    aria-labelledby="animation-label"
                    dangerouslySetInnerHTML={{
                      __html: binaryStep ? renderBinary(binaryStep, revealBinary) : renderVisualization(currentAlgorithm, stepIndex),
                    }}
                  />
                </article>

                <article className="panel code-panel">
                  <div className="panel-title">
                    <span id="reference-code-label">Reference code</span>
                    <strong>{currentAlgorithm.complexity}</strong>
                  </div>
                  {binaryStep && <>
                    <p className="binary-reading-key">In this Python code, <code>n</code> counts the records and <code>predicate(mid)</code> checks whether the value at index <code>mid</code> is at least £{binaryThreshold}. <code>//</code> divides and rounds down. Each check and its bound update appear in separate frames.</p>
                    <p className="binary-code-values"><code>n = {binaryStep.values.length}; lo = {binaryStep.lo}; hi = {binaryStep.hi}{binaryStep.mid !== null ? `; mid = ${binaryStep.mid}; predicate(mid) = ${binaryStep.matched ? "True" : "False"}` : binaryStep.result !== null ? `; return ${binaryStep.result}` : "; mid not yet chosen"}</code></p>
                  </>}
                  <CodeView lines={currentAlgorithm.code} activeLine={currentStep.line} />
                  {binaryStep && <p className="binary-instrumentation">The costs above describe the search procedure. Recorded frames and the independent verifier use additional work and memory.</p>}
                </article>
              </div>

              {binaryStep?.phase === "inspect" && <fieldset className="binary-prediction">
                <legend>Predict the next update</legend>
                <p>Which bound moves after this observation?</p>
                {(["lo", "hi"] as const).map(bound => <button key={bound} type="button" aria-pressed={prediction === bound} onClick={() => { setPlayback("paused"); setPrediction(bound); }}>Move {bound}</button>)}
              </fieldset>}

              <div className="explain-row">
                <article className="panel">
                  <div className="panel-title">
                    <span>Current step</span>
                  </div>
                  <p
                    role="status"
                    aria-live={playing ? "off" : "polite"}
                    aria-atomic="true"
                    aria-label={`${currentAlgorithm.title}: step ${stepIndex + 1} of ${currentAlgorithm.steps.length}, ${currentStep.label}`}
                  >
                    {playback === "paused" ? "Paused. " : playback === "complete" ? "Playback complete. " : ""}
                    {currentStep.note}
                    {prediction && binaryStep?.phase === "inspect" && ` ${prediction === (binaryStep.matched ? "hi" : "lo") ? "Correct" : "Reconsider"}: the algorithm moves ${binaryStep.matched ? "hi to mid" : "lo to mid + 1"}. The inference requires a monotonic predicate.`}
                  </p>
                </article>
                <article className="panel">
                  <div className="panel-title">
                    <span>Why it helps LLM apps</span>
                  </div>
                  <p>{currentAlgorithm.agentUse}</p>
                </article>
              </div>
              </>}
            </div>
          )}
          {viewMode === "context" && currentId !== "binary" && <ContextView context={currentAlgorithm.context} />}
          {currentId === "binary" && <details className="binary-context" id="binary-search-context" open={viewMode === "context"}
            onToggle={event => {
              const open = event.currentTarget.open;
              if (open && viewMode !== "context") { setViewMode("context"); setPlayback("paused"); }
              else if (!open && viewMode === "context") setViewMode("run");
            }}>
            <summary>Read Binary Search context</summary>
            <div className="binary-context-copy">{binaryContext ?? <p>Why it exists: use monotonicity to eliminate possible answers safely.</p>}</div>
          </details>}
        </section>
      </section>

      <section
        className="lab-sources editorial-wrap"
        aria-label="Related publication reading"
      >
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
              <a
                className="inline-link"
                href={ARTICLE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Read algorithms essay
              </a>
            </article>
            <article className="source-row">
              <div>
                <h2>The Anatomy of a Marketing Agent</h2>
                <p>
                  How runtime, harness, tools, and permissions interact in a
                  marketing workflow.
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
            <article className="source-row">
              <div>
                <h2>Secure Marketing Agents</h2>
                <p>
                  The ad-platform source for scoped campaign-change grants,
                  policy-gated execution, approval records, and rollback
                  evidence in DV360 and Google Ads workflows.
                </p>
              </div>
              <a
                className="inline-link muted-link"
                href={AD_PLATFORM_SECURITY_URL}
                target="_blank"
                rel="noreferrer"
              >
                Read security architecture
              </a>
            </article>
          </div>
        </div>
      </section>

      <section
        className="stack-map"
        id="stack-map"
        aria-labelledby="stack-map-title"
      >
        <div className="section-head">
          <p className="eyebrow">From the source analysis</p>
          <h2 id="stack-map-title">
            Where each structure sits in the agent stack
          </h2>
        </div>
        <div className="manual-list stack-manual">
          <article className="manual-row">
            <span className="manual-index">01</span>
            <div className="manual-body">
              <h3>Skills</h3>
              <p>
                BFS, DFS, topological sort, Bloom filters, and circular buffers
                keep workflow steps explicit and bounded.
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
                Plugin packages rely on memory windows, indexes, dependency
                graphs, and portable execution rules.
              </p>
            </div>
          </article>
          <article className="manual-row">
            <span className="manual-index">04</span>
            <div className="manual-body">
              <h3>Orchestration</h3>
              <p>
                Topological sort, Dijkstra, Union-Find, and lease-locked queues
                turn multi-agent work into schedulable, recoverable paths.
              </p>
            </div>
          </article>
          <article className="manual-row">
            <span className="manual-index">05</span>
            <div className="manual-body">
              <h3>Control Plane</h3>
              <p>
                Approval state machines, token buckets, permission graphs, and
                audit hash chains enforce identity, policy, rate limits, and
                tamper-evident logs.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section
        className="ad-control-plane"
        id="ad-platform-control-plane"
        aria-labelledby="ad-control-plane-title"
      >
        <div className="section-head">
          <p className="eyebrow">Ad platform control plane</p>
          <h2 id="ad-control-plane-title">
            Plan, validate, approve, execute, record
          </h2>
        </div>
        <div
          className="control-flow"
          aria-label="Ad platform control-plane walkthrough"
        >
          {[
            {
              step: "01",
              label: "Plan",
              title: "Agent drafts a change",
              detail:
                "The read-only agent proposes a structured DV360 or Google Ads diff: entity, current state, proposed state, rationale, expected impact, and risk tier.",
              artifact: "change_plan.json",
            },
            {
              step: "02",
              label: "Validate",
              title: "Policy checks scope and risk",
              detail:
                "The policy engine checks advertiser scope, max bid or budget delta, targeting breadth, workspace ownership, and same-entity write conflicts.",
              artifact: "policy_decision",
            },
            {
              step: "03",
              label: "Approve",
              title: "Human signs high-risk action",
              detail:
                "Budget increases, targeting broadening, audience expansion, and tracking changes create an approval record before execution can continue.",
              artifact: "approval_id",
            },
            {
              step: "04",
              label: "Execute",
              title: "Narrow service writes to API",
              detail:
                "The executor retrieves scoped credentials, validates current platform state, applies the approved change, and queues same-line-item DV360 writes.",
              artifact: "execution_grant",
            },
            {
              step: "05",
              label: "Record",
              title: "Audit captures rollback evidence",
              detail:
                "The system stores pre-image, post-image, API payload, policy result, approver, execution token, and rollback patch for review or recovery.",
              artifact: "audit_event",
            },
          ].map((item, index, items) => (
            <article className="control-step" key={item.step}>
              <span className="manual-index">{item.step}</span>
              <div className="control-step-body">
                <span className="control-step-label">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <code>{item.artifact}</code>
              </div>
              {index < items.length - 1 && (
                <span className="flow-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </article>
          ))}
        </div>
        <div
          className="token-card"
          aria-label="Example scoped campaign change grant"
        >
          <div>
            <p className="eyebrow">Scoped campaign-change grant</p>
            <h3 id="grant-example-title">One action, one advertiser, one expiry window</h3>
            <p>
              The campaign equivalent of a scoped payment token: enough
              authority to apply one approved change, not broad access to the
              whole ad account.
            </p>
          </div>
          <pre tabIndex={0} role="region" aria-labelledby="grant-example-title">{`{
  "platform": "dv360",
  "advertiser_id": "987654",
  "entity_type": "line_item",
  "allowed_action": "apply_bid_delta",
  "max_delta_percent": 10,
  "approval_id": "approval_abc"
}`}</pre>
        </div>
      </section>

      <section
        className="build-notes"
        id="build-notes"
        aria-labelledby="build-notes-title"
      >
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
            traces, and marketing-specific data examples you can inspect
            step by step and adapt to your own systems.
          </p>
        </div>
      </section>
    </main>
  );
}
