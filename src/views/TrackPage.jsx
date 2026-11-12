import { Link } from "react-router-dom";
import { algorithms } from "../visualizers/algorithms-data";
import { labPath, visualizerUrl } from "../content/site";
import { SiteLink } from "../components/SiteLink";
import { learningContent } from "../content/learning";
import { algorithmGroups, caseLinksForTrack, discoveryGroups, resolveDiscoveryLink } from "../content/discovery";

const resolve = (link) => resolveDiscoveryLink(learningContent, link);

function TrackResources({ id, title, resources }) {
  return (
    <section id={id} className="pilot-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <ul className="pilot-resources" role="list">
        {resources.map((resource) => (
          <li key={resource.href}>
            <p className="resource-kind">{resource.label}</p>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <SiteLink href={resource.href} className="text-link">{resource.action}</SiteLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AlgorithmPatterns() {
  return (
    <section id="patterns" className="pilot-section" aria-labelledby="patterns-title">
      <div>
        <h2 id="patterns-title">Choose a visualizer</h2>
        <Link to={labPath} className="text-link">Open all {algorithms.length} labs</Link>
      </div>
      <div className="track-patterns">
        {algorithmGroups.map(({ title, ids }) => (
          <div key={title}>
            <h3>{title}</h3>
            <ul role="list">
              {ids.map((id) => {
                const algorithm = algorithms.find((item) => item.id === id);
                return (
                  <li key={id}>
                    <Link to={visualizerUrl(id)}>
                      <strong>{algorithm.title}</strong>
                      <span>{algorithm.short}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TrackPage({ track }) {
  const { discovery } = learningContent;
  const page = discovery.tracks[track.slug];
  const next = resolve(page.start.next);
  const caseResources = caseLinksForTrack(discovery, track.slug).map(resolve);
  const showPatterns = track.slug === "algorithms";
  const groups = discoveryGroups.map(([id, title]) => ({
    id,
    title,
    resources: [
      ...(page[id] ?? []).map(resolve),
      ...(id === "examples" ? caseResources : []),
    ],
  })).filter((group) => group.resources.length > 0);

  return (
    <main id="main-content" className="track-page editorial-wrap pilot-track-page" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Harness</Link>
        <span aria-hidden="true">/</span>
        <span>{track.nav}</span>
      </nav>
      <header className="track-intro pilot-intro">
        <p className="eyebrow">Track {track.number}</p>
        <h1>{track.title}</h1>
        <p>{track.description}</p>
      </header>
      <nav className="track-jump" aria-label="On this track">
        <a href="#start-here">Start here</a>
        {showPatterns && <a href="#patterns">Choose a visualizer</a>}
        {groups.map(({ id, title }) => (
          <a key={id} href={`#${id}`}>{title}</a>
        ))}
      </nav>
      <section id="start-here" className="pilot-section track-start" aria-labelledby="start-here-title">
        <h2 id="start-here-title">Start here</h2>
        <div>
          <h3>{page.start.title}</h3>
          <ol className="track-method" role="list">
            {page.start.steps.map(([title, description], index) => (
              <li key={title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p><strong>{title}.</strong> {description}</p>
              </li>
            ))}
          </ol>
        </div>
        <SiteLink href={next.href} className="action-link">{next.action}</SiteLink>
      </section>
      {showPatterns && <AlgorithmPatterns />}
      {groups.map(({ id, title, resources }) => (
        <TrackResources key={id} id={id} title={title} resources={resources} />
      ))}
      {page.future?.length > 0 && (
        <section className="pilot-section track-future" aria-labelledby="future-title">
          <h2 id="future-title">In development</h2>
          <ul>{page.future.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}
      <Link className="text-link" to="/#tracks">
        Explore all five tracks
      </Link>
    </main>
  );
}
