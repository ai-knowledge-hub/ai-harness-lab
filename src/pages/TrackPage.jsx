import { Link } from "react-router-dom";
import { algorithms } from "../visualizers/algorithms-data";
import { visualizerUrl } from "../content/site";
import { SiteLink } from "../components/SiteLink";
import { lessonsForTrack } from "../content/learning";

export function TrackPage({ track }) {
  return (
    <main id="main-content" className="track-page editorial-wrap" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Harness</Link>
        <span aria-hidden="true">/</span>
        <span>{track.nav}</span>
      </nav>
      <header className="track-intro">
        <p className="eyebrow">Track {track.number}</p>
        <h1>{track.title}</h1>
        <p className="track-question">{track.question}</p>
        <p>{track.description}</p>
        {track.application && (
          <>
            <p className="track-application">{track.application}</p>
            <Link className="text-link" to="/learn/system-design/chatgpt-ads#across-five-tracks">
              Follow the ChatGPT Ads workflow
            </Link>
          </>
        )}
      </header>
      {lessonsForTrack(track.slug).length > 0 && (
        <section
          className="track-lessons"
          aria-labelledby="track-lessons-title"
        >
          <div className="editorial-section-head">
            <h2 id="track-lessons-title">Start with the platform</h2>
            <p>Get the system map, inspect the first platform, then design the integration.</p>
          </div>
          <div className="resource-list">
            {lessonsForTrack(track.slug).map((lesson) => (
              <Link key={lesson.id} className="resource-row" to={lesson.path}>
                <span className="resource-kind">
                  {lesson.format}
                  {lesson.publicationStatus === "draft" ? " · Preview" : ""}
                </span>
                <div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.description}</p>
                </div>
                <span className="resource-action">Read</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="track-outline" aria-labelledby="outline-title">
        <div className="editorial-section-head">
          <h2 id="outline-title">Where this track goes deeper</h2>
          <p>
            These are the implementation areas. Further guides and builds are in development.
          </p>
        </div>
        <ol className="outline-list">
          {track.topics.map(([title, description], index) => (
            <li key={title}>
              <span className="track-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      {track.resources.length > 0 && (
        <section className="track-resources" aria-labelledby="resources-title">
          <div className="editorial-section-head">
            <h2 id="resources-title">Supporting references</h2>
            <p>Available patterns and related analysis for the work above.</p>
          </div>
          <div className="resource-list">
            {track.resources.map((resource) => (
              <SiteLink
                href={resource.href}
                className="resource-row"
                key={resource.href}
              >
                <span className="resource-kind">{resource.kind}</span>
                <div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                </div>
                <span className="resource-action">
                  {resource.href.startsWith("/") ? "Explore" : "Read"}
                </span>
              </SiteLink>
            ))}
          </div>
        </section>
      )}
      {track.slug === "algorithms" && (
        <section
          className="algorithm-index"
          aria-labelledby="algorithm-index-title"
        >
          <div className="editorial-section-head">
            <h2 id="algorithm-index-title">Choose a visualizer</h2>
            <p>
              {algorithms.length} patterns with reference code and practical
              context.
            </p>
          </div>
          <div className="algorithm-index-list">
            {algorithms.map((algorithm) => (
              <Link to={visualizerUrl(algorithm.id)} key={algorithm.id}>
                <span className="resource-kind">{algorithm.operation}</span>
                <h3>{algorithm.title}</h3>
                <p>{algorithm.short}</p>
                <span className="algorithm-complexity">
                  {algorithm.complexity}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <Link className="text-link" to="/#tracks">
        Explore all five tracks
      </Link>
    </main>
  );
}
