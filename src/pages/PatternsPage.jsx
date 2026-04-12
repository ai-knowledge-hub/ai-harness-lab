const patternGroups = [
  {
    title: "Memory and Context",
    summary:
      "Campaign history, reporting windows, retrieval layers, and how durable memory changes the shape of a marketing AI system.",
  },
  {
    title: "Permissions and Control",
    summary:
      "Approval gates, brand and compliance checks, risky actions, and the rules that keep marketing automation usable without losing control.",
  },
  {
    title: "Orchestration",
    summary:
      "Reporting pipelines, campaign and content workflows, routing, retries, joins, and background loops for real marketing operations.",
  },
];

export function PatternsPage() {
  return (
    <main>
      <section className="module-hero module-coming-soon" aria-labelledby="patterns-title">
        <p className="eyebrow">Structural Patterns</p>
        <h1 id="patterns-title">Harness patterns behind reliable marketing AI</h1>
        <p>
          This module will cover the non-model structures that make marketing AI
          systems stable: memory, permissions, approvals, routing, orchestration,
          and runtime control across campaigns, content, analytics, and reporting.
        </p>
        <div className="coming-soon-strip" aria-label="Module status">
          <span className="manual-index">Status</span>
          <p>In development now. This section is being shaped into a reference manual for marketing AI patterns rather than a shallow catalogue.</p>
        </div>
      </section>

      <section className="stack-map" aria-labelledby="patterns-groups-title">
        <div className="section-head">
          <p className="eyebrow">Planned areas</p>
          <h2 id="patterns-groups-title">What this module will cover</h2>
        </div>
        <div className="manual-list stack-manual">
          {patternGroups.map((group, index) => (
            <article key={group.title} className="manual-row">
              <span className="manual-index">{`0${index + 1}`}</span>
              <div className="manual-body">
                <h3>{group.title}</h3>
                <p>{group.summary}</p>
              </div>
              <span className="status-note">In development</span>
            </article>
          ))}
        </div>
      </section>

      <section className="build-notes" aria-labelledby="patterns-notes-title">
        <div className="section-head">
          <p className="eyebrow">Editorial direction</p>
          <h2 id="patterns-notes-title">How this section will be built out</h2>
        </div>
        <div className="build-note-body">
          <span className="manual-index">01</span>
          <p>
            Each pattern will eventually get the same treatment as the algorithms
            lab: a clear role inside a marketing system, deterministic rationale,
            visual explanation, and practical guidance that stays transferable to
            adjacent AI products and operations.
          </p>
        </div>
      </section>
    </main>
  );
}
