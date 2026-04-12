const examples = [
  {
    title: "Reporting Harnesses",
    summary:
      "Practical studies of automated reporting systems, data refresh loops, approval checkpoints, and narrative generation pipelines.",
  },
  {
    title: "Content and Creative Workflows",
    summary:
      "Breakdowns of briefs, generation, review, routing, and publishing flows that connect models to real editorial and campaign operations.",
  },
  {
    title: "Campaign and Analytics Operations",
    summary:
      "Walkthroughs of campaign analysis, anomaly detection, martech orchestration, and the control layers that make those systems operational.",
  },
];

export function ExamplesPage() {
  return (
    <main>
      <section className="module-hero module-coming-soon" aria-labelledby="examples-title">
        <p className="eyebrow">Practical Examples</p>
        <h1 id="examples-title">Real marketing systems, real harness decisions</h1>
        <p>
          This section is reserved for concrete marketing AI case studies:
          reporting harnesses, content review loops, campaign analysis systems,
          orchestration flows, and production examples worth dissecting.
        </p>
        <div className="coming-soon-strip" aria-label="Module status">
          <span className="manual-index">Status</span>
          <p>In development now. This module is being prepared as a case-study library for serious marketing AI builders rather than a lightweight examples gallery.</p>
        </div>
      </section>

      <section className="stack-map" aria-labelledby="examples-groups-title">
        <div className="section-head">
          <p className="eyebrow">Planned examples</p>
          <h2 id="examples-groups-title">What this module will cover</h2>
        </div>
        <div className="manual-list stack-manual">
          {examples.map((example, index) => (
            <article key={example.title} className="manual-row">
              <span className="manual-index">{`0${index + 1}`}</span>
              <div className="manual-body">
                <h3>{example.title}</h3>
                <p>{example.summary}</p>
              </div>
              <span className="status-note">In development</span>
            </article>
          ))}
        </div>
      </section>

      <section className="build-notes" aria-labelledby="examples-notes-title">
        <div className="section-head">
          <p className="eyebrow">Editorial direction</p>
          <h2 id="examples-notes-title">How the examples library will evolve</h2>
        </div>
        <div className="build-note-body">
          <span className="manual-index">01</span>
          <p>
            Each example will focus on one real marketing system shape: what the
            harness is doing, which deterministic structures hold it together,
            what tradeoffs the builders made, and where the design breaks under
            operational pressure.
          </p>
        </div>
      </section>
    </main>
  );
}
