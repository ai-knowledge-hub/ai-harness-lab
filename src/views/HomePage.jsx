import { Link } from "react-router-dom";
import { algorithms } from "../visualizers/algorithms-data";
import { resolveDiscoveryLink } from "../content/discovery";
import { learningContent } from "../content/learning";
import { familySites, tracks, trackPath } from "../content/site";

export function HomePage() {
  const featuredCase = resolveDiscoveryLink(learningContent, learningContent.discovery.featuredCase);

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
          <p className="hero-name">Harness</p>
          <h1 id="page-title">Build and operate AI products.</h1>
          <p className="hero-description">
            Engineering guides, interactive labs, and worked examples for the decisions behind a real system.
          </p>
          <div className="landing-actions">
            <a className="action-link" href="#tracks">Explore the tracks</a>
            {featuredCase && (
              <a className="text-link" href="#featured-case">See the featured case</a>
            )}
          </div>
        </div>
      </section>

      <div className="editorial-wrap">
        <section id="tracks" className="tracks-section" aria-labelledby="tracks-title">
          <div className="editorial-section-head">
            <h2 id="tracks-title">Engineering tracks</h2>
            <p>Choose the decision you’re working on.</p>
          </div>
          <div className="track-list">
            {tracks.map((track) => (
              <Link className="track-row" to={trackPath(track)} key={track.slug}>
                <span className="track-number" aria-hidden="true">{track.number}</span>
                <h3>{track.nav}</h3>
                <p>{track.short}</p>
                <span className="track-availability">
                  {track.slug === "algorithms" ? `${algorithms.length} visualizers` : track.availability}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {featuredCase && (
          <section id="featured-case" className="home-feature" aria-labelledby="featured-case-title">
            <div>
              <p className="eyebrow">Featured case{featuredCase.preview ? " · Preview" : ""}</p>
              <h2 id="featured-case-title">{featuredCase.title}</h2>
            </div>
            <div className="home-feature-detail">
              <p>{featuredCase.description}</p>
              <Link className="text-link" to={featuredCase.href}>{featuredCase.action}</Link>
            </div>
          </section>
        )}

        <section className="family-section" aria-labelledby="family-title">
          <h2 id="family-title">Explore AI Knowledge Hub</h2>
          <div className="family-grid">
            {familySites.map((companion) => (
              <a href={companion.href} key={companion.name}>
                <p className="resource-kind">{companion.name}</p>
                <h3>{companion.title}</h3>
                <p>{companion.description}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
