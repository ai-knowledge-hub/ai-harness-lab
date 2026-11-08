import { Link } from "react-router-dom";
import { algorithms } from "../visualizers/algorithms-data";
import {
  site,
  tracks,
  trackPath,
  articleUrl,
} from "../content/site";

export function HomePage() {
  return (
    <main id="main-content" className="landing" tabIndex={-1}>
      <section className="landing-hero" aria-labelledby="page-title">
        <picture className="hero-art" aria-hidden="true">
          <source media="(max-width: 640px)" srcSet="/brand/sphere-800.webp" />
          <img
            src="/brand/sphere-1600.webp"
            alt=""
            width="1600"
            height="893"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-plate">
          <p className="eyebrow">AI Knowledge Hub · Practical engineering</p>
          <p className="hero-name">Harness</p>
          <h1 id="page-title">
            Build the systems behind{" "}
            <span className="unbroken">AI-powered</span> growth.
          </h1>
          <p className="hero-description">
            Understand the principles. Explore the code. Build the systems that
            bring AI products to market.
          </p>
          <div className="landing-actions">
            <a className="action-link" href="#tracks">
              Explore the tracks
            </a>
            <Link className="text-link" to="/learn/system-design/advertising-platforms">
              Explore advertising systems
            </Link>
          </div>
        </div>
      </section>
      <div className="editorial-wrap">
        <section
          className="home-orientation"
          aria-labelledby="orientation-title"
        >
          <p className="eyebrow">Theory into practice</p>
          <div>
            <h2 id="orientation-title">
              A practical companion
              <br />
              to the changing commercial web.
            </h2>
            <p>
              For builders working across marketing, growth, and go to market.
              Connect system design, market theory, and machine learning to the
              decisions behind a working product.
            </p>
          </div>
        </section>
        <section
          id="tracks"
          className="tracks-section"
          aria-labelledby="tracks-title"
        >
          <div className="editorial-section-head">
            <h2 id="tracks-title">Five tracks. One connected practice.</h2>
            <p>Choose a discipline. Follow it into a real system.</p>
          </div>
          <div className="track-list">
            {tracks.map((track) => (
              <Link
                className="track-row"
                to={trackPath(track)}
                key={track.slug}
              >
                <span className="track-number">{track.number}</span>
                <h3>{track.title}</h3>
                <p>{track.short}</p>
                <span className="track-availability">
                  {track.slug === "algorithms"
                    ? `${algorithms.length} visualizers`
                    : track.availability}
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section
          className="available-section"
          aria-labelledby="available-title"
        >
          <div className="editorial-section-head">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 id="available-title">Get inside the system.</h2>
            </div>
            <p>Platform maps and practical design references.</p>
          </div>
          <div className="available-grid">
            <article className="featured-resource">
              <p className="resource-kind">
                Overview · Platforms & System Design
              </p>
              <h3>
                <Link to="/learn/system-design/advertising-platforms">How advertising platforms work.</Link>
              </h3>
              <p>
                Follow ad delivery, measurement and reporting. Locate the
                interfaces and data systems you can build around them.
              </p>
              <Link className="text-link" to="/learn/system-design/advertising-platforms">
                Read the platform overview
              </Link>
            </article>
            <article className="featured-resource">
              <p className="resource-kind">
                First platform · ChatGPT Ads
              </p>
              <h3>
                <Link to="/learn/system-design/chatgpt-ads">From the ad experience to the integration.</Link>
              </h3>
              <p>
                Map advertiser controls, measurement and reporting, then follow
                the workflow across the five engineering tracks.
              </p>
              <Link className="text-link" to="/learn/system-design/chatgpt-ads">
                Explore ChatGPT Ads
              </Link>
            </article>
          </div>
          <p className="tutorial-note">
            YouTube walkthroughs are in development. Each will connect a concrete
            task to its implementation guide, code, and working example here.
          </p>
        </section>
        <section className="reading-section" aria-labelledby="reading-title">
          <div className="editorial-section-head">
            <div>
              <p className="eyebrow">Read, then explore</p>
              <h2 id="reading-title">The ideas behind the implementation.</h2>
            </div>
            <a className="text-link" href={site.publication}>
              Read the publication
            </a>
          </div>
          <div className="reading-list">
            <a
              href={articleUrl(
                "deterministic-core-algorithms-data-structures-marketing-agents",
              )}
            >
              <span className="resource-kind">Algorithms & Data</span>
              <h3>The Deterministic Core</h3>
              <p>
                Why explicit algorithms and data structures matter in marketing
                agents.
              </p>
            </a>
            <a
              href={articleUrl(
                "muscles-of-the-machine-tools-mcp-cli-first-principles-marketing",
              )}
            >
              <span className="resource-kind">Platforms & System Design</span>
              <h3>The Muscles of the Machine</h3>
              <p>Design the capabilities that connect an agent to real work.</p>
            </a>
            <a
              href={articleUrl(
                "building-to-learn-agentic-marketing-optimization",
              )}
            >
              <span className="resource-kind">Measurement & ML</span>
              <h3>Building to Learn</h3>
              <p>
                What prototyping reveals about agentic marketing optimisation.
              </p>
            </a>
          </div>
        </section>
        <section className="family-section" aria-labelledby="family-title">
          <h2 id="family-title">Research. Capabilities. Working systems.</h2>
          <p>Three connected parts of AI Knowledge Hub.</p>
          <div className="family-grid">
            <a href={site.publication}>
              <span className="resource-kind">The publication</span>
              <h3>Understand the change.</h3>
              <p>Research, ideas, and evidence on AI and the commercial web.</p>
            </a>
            <a href={site.skills}>
              <span className="resource-kind">Skills</span>
              <h3>Find the capabilities.</h3>
              <p>
                Reusable skills, agents, plugins, and tools to inspect and
                adapt.
              </p>
            </a>
            <div>
              <span className="resource-kind">Harness · You are here</span>
              <h3>Build the system.</h3>
              <p>
                Architecture, code, and practical engineering for AI-powered
                growth.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
