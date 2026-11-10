import { Link } from "react-router-dom";
import { algorithms } from "../visualizers/algorithms-data";
import { visualizerUrl } from "../content/site";
import { SiteLink } from "../components/SiteLink";
import { learningContent, lessonsForTrack } from "../content/learning";
import { caseLinksForTrack, discoveryGroups, resolveDiscoveryLink } from "../content/discovery";

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

function PilotTrack({ track, pilot, caseResources }) {
  const next = resolve(pilot.start.next);
  const groups = discoveryGroups.map(([id, title]) => ({
    id,
    title,
    resources: [
      ...(pilot[id] ?? []).map(resolve).filter(Boolean),
      ...(id === "examples" ? caseResources : []),
    ],
  })).filter((group) => group.resources.length > 0);

  return (
    <>
      <header className="track-intro pilot-intro">
        <p className="eyebrow">Track {track.number}</p>
        <h1>{track.title}</h1>
        <p>{track.description}</p>
      </header>
      <nav className="track-jump" aria-label="On this track">
        <a href="#start-here">Start here</a>
        {groups.map(({ id, title }) => (
          <a key={id} href={`#${id}`}>{title}</a>
        ))}
      </nav>
      <section id="start-here" className="pilot-section track-start" aria-labelledby="start-here-title">
        <h2 id="start-here-title">Start here</h2>
        <div>
          <h3>{pilot.start.title}</h3>
          <ol className="track-method" role="list">
            {pilot.start.steps.map(([title, description], index) => (
              <li key={title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p><strong>{title}.</strong> {description}</p>
              </li>
            ))}
          </ol>
        </div>
        {next && <SiteLink href={next.href} className="action-link">{next.action}</SiteLink>}
      </section>
      {groups.map(({ id, title, resources }) => (
        <TrackResources key={id} id={id} title={title} resources={resources} />
      ))}
      {pilot.future?.length > 0 && (
        <section className="pilot-section track-future" aria-labelledby="future-title">
          <h2 id="future-title">In development</h2>
          <ul>{pilot.future.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}
    </>
  );
}

function StandardTrack({ track, caseLinks, caseResources }) {
  const trackGuides = lessonsForTrack(track.slug);
  const examples = [
    ...caseResources,
    ...trackGuides
      .filter((guide) => guide.kind === "case" && !caseLinks.some((link) => link.id === guide.id))
      .map((guide) => resolve({ kind: "guide", id: guide.id, action: "Read the case" })),
  ];

  return (
    <>
      <header className="track-intro">
        <p className="eyebrow">Track {track.number}</p>
        <h1>{track.title}</h1>
        <p className="track-question">{track.question}</p>
        <p>{track.description}</p>
      </header>
      {[
        { id: "platform", title: "How ad platforms work", description: "See how platforms choose ads and what advertisers can do with their APIs.", kinds: ["overview", "platform", "capabilities"] },
        { id: "principles", title: "Design a clear API", description: "Define what you can ask for and what the result should tell you.", kinds: ["principle"] },
      ].map((group) => {
        const guides = trackGuides.filter((guide) => group.kinds.includes(guide.kind));
        return guides.length > 0 && <section className="track-lessons" aria-labelledby={`track-${group.id}-title`} key={group.id}>
          <div className="editorial-section-head"><h2 id={`track-${group.id}-title`}>{group.title}</h2><p>{group.description}</p></div>
          <div className="resource-list">{guides.map((guide) => <Link key={guide.id} className="resource-row" to={guide.path}>
            <span className="resource-kind">{guide.format}{guide.publicationStatus === "draft" ? " · Preview" : ""}</span>
            <div><h3>{guide.title}</h3><p>{guide.description}</p></div><span className="resource-action">Read</span>
          </Link>)}</div>
        </section>;
      })}
      {examples.length > 0 && (
        <TrackResources id="examples" title="Worked examples" resources={examples} />
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
    </>
  );
}

export function TrackPage({ track }) {
  const pilot = learningContent.discovery.tracks[track.slug];
  const caseLinks = caseLinksForTrack(learningContent.discovery, track.slug);
  const caseResources = caseLinks.map(resolve).filter(Boolean);
  return (
    <main id="main-content" className={`track-page editorial-wrap${pilot ? " pilot-track-page" : ""}`} tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Harness</Link>
        <span aria-hidden="true">/</span>
        <span>{track.nav}</span>
      </nav>
      {pilot ? (
        <PilotTrack track={track} pilot={pilot} caseResources={caseResources} />
      ) : (
        <StandardTrack track={track} caseLinks={caseLinks} caseResources={caseResources} />
      )}
      <Link className="text-link" to="/#tracks">
        Explore all five tracks
      </Link>
    </main>
  );
}
