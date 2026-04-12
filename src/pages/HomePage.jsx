import { Link } from "react-router-dom";
import { HomeHeroHarness } from "../sections/HomeHeroHarness";

const modules = [
  {
    title: "Algorithms",
    href: "/algorithms",
    summary:
      "Interactive visualizers for the deterministic structures behind campaign reporting, crawl monitoring, routing, clustering, and other marketing AI workloads.",
  },
  {
    title: "Patterns",
    href: "/patterns",
    summary:
      "Harness design patterns for memory, permissions, orchestration, and context compaction in real marketing systems and agent-assisted operations.",
  },
  {
    title: "Examples",
    href: "/examples",
    summary:
      "Builder-oriented walkthroughs of reporting harnesses, campaign-analysis systems, content workflows, and other real marketing AI case studies.",
  },
];

const audience = [
  "Builders turning marketing operations into working AI systems",
  "Learners studying what sits between a model, a martech stack, and production behavior",
  "Experimenters comparing harness patterns across campaign, content, reporting, and analytics workflows",
];

export function HomePage() {
  return (
    <main id="top" className="home-shell">
      <section className="home-hero" aria-labelledby="page-title">
        <div className="home-hero-grid">
          <div className="home-kicker">
            <p className="eyebrow">Interactive Pattern Lab</p>
            <p className="section-index">Issue 01</p>
          </div>

          <div className="home-copy">
            <h1 id="page-title">Harness engineering for marketing AI systems</h1>
            <p className="home-summary">
              AI Harness Lab is the interactive companion to the wider AI Knowledge
              Hub ecosystem: a place to study how deterministic algorithms,
              structural patterns, orchestration, memory, and control layers make
              marketing AI systems reliable, scalable, and auditable.
            </p>
            <div className="hero-actions home-actions">
              <Link className="hero-link primary-link" to="/algorithms">
                Open algorithms
              </Link>
              <Link className="hero-link" to="/patterns">
                Browse patterns
              </Link>
            </div>
          </div>
        </div>

        <HomeHeroHarness />

        <aside className="home-meta home-facts" aria-label="Site scope">
          <div>
            <span className="meta-label">Format</span>
            <p>Interactive manual for builders, learners, and operators working inside marketing AI stacks.</p>
          </div>
          <div>
            <span className="meta-label">Focus</span>
            <p>Deterministic control layers, reference patterns, and real harness behavior for campaign, content, and reporting systems.</p>
          </div>
          <div>
            <span className="meta-label">Current modules</span>
            <p>Algorithms, patterns, and examples for marketing-first applied AI engineering.</p>
          </div>
        </aside>
      </section>

      <section className="home-section home-section-lines" aria-labelledby="home-modules-title">
        <div className="section-head">
          <p className="eyebrow">Modules</p>
          <h2 id="home-modules-title">Three ways into the system</h2>
        </div>
        <div className="manual-list">
          {modules.map((module, index) => (
            <article key={module.title} className="manual-row">
              <span className="manual-index">{`0${index + 1}`}</span>
              <div className="manual-body">
                <h3>{module.title}</h3>
                <p>{module.summary}</p>
              </div>
              <Link className="inline-link" to={module.href}>
                Open module
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="audience-title">
        <div className="section-head">
          <p className="eyebrow">Audience</p>
          <h2 id="audience-title">Built for teams working past generic AI demos</h2>
        </div>
        <div className="audience-manifest">
          {audience.map((item, index) => (
            <article key={item} className="audience-row">
              <span className="manual-index">{`0${index + 1}`}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-ecosystem" aria-labelledby="ecosystem-title">
        <div className="section-head">
          <p className="eyebrow">Ecosystem</p>
          <h2 id="ecosystem-title">How this property fits the wider marketing AI hub</h2>
        </div>
        <div className="ecosystem-grid">
          <article className="ecosystem-block current-block">
            <span className="meta-label">Current property</span>
            <h3>AI Harness Lab</h3>
            <p>
              Interactive reference space for deterministic algorithms, harness
              behavior, and structural decisions in marketing AI systems.
            </p>
          </article>
          <article className="ecosystem-block">
            <span className="meta-label">Editorial stream</span>
            <h3>
              <a href="https://ai-news-hub.performics-labs.com/" target="_blank" rel="noreferrer">
                AI News Hub
              </a>
            </h3>
            <p>Analysis, reporting, and long-form narrative across AI, martech, and applied system change.</p>
          </article>
          <article className="ecosystem-block">
            <span className="meta-label">Implementation catalogue</span>
            <h3>
              <a href="https://skills.ai-knowledge-hub.org/" target="_blank" rel="noreferrer">
                AI Skills Guide
              </a>
            </h3>
            <p>Reference catalogue for skills, tools, MCP servers, plugins, and builder workflows that can be applied across marketing operations.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
