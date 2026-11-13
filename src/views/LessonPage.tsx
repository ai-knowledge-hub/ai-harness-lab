import type { Guide, GuideSection } from "../content/guide-types";
import { Link } from "react-router-dom";
import { tracks, trackPath } from "../content/site";
import { getLesson, learningContent } from "../content/learning";
import { resolveDiscoveryLink } from "../content/discovery";
import { referenceContext } from "../content/reference-context";
import { SiteLink } from "../components/SiteLink";
import { LessonBlock } from "../components/LessonBlock";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function requireGuide(id: string) {
  const guide = getLesson(id);
  if (!guide) throw new Error(`Unknown guide: ${id}`);
  return guide;
}

function relatedContent<Item extends { id: string }>(items: Item[], ids: string[]) {
  return ids.map((id) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) throw new Error(`Unknown related content: ${id}`);
    return item;
  });
}

function lookup<Value>(entries: Partial<Record<string, Value>>, id: string) {
  return entries[id];
}

function Contents({ sections }: { sections: GuideSection[] }) {
  return (
    <nav aria-label="Guide contents">
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ReferenceContext({ lessonId, label }: { lessonId: string; label: string }) {
  return (
    <nav className="reference-context" aria-label="Reference context">
      <p className="eyebrow">{label}</p>
      <ol>
        {referenceContext.map((item) => (
          <li key={item.guideId}>
            <SiteLink
              href={requireGuide(item.guideId).path}
              aria-current={item.guideId === lessonId ? "page" : undefined}
            >
              <strong>{item.label}</strong>
              <span>{item.purpose}</span>
            </SiteLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function LessonPage({ lesson }: { lesson: Guide }) {
  const track = tracks.find((item) => item.slug === lesson.trackId);
  if (!track) throw new Error(`Unknown guide track: ${lesson.trackId}`);
  const prerequisites = relatedContent(learningContent.concepts, lesson.prerequisiteConceptIds);
  const projects = relatedContent(learningContent.projects, lesson.projectIds);
  const publications = relatedContent(learningContent.publications, lesson.publicationIds);
  const caseStudies = publications.filter((item) => item.kind === "case-study");
  const relatedReading = publications.filter((item) => item.kind !== "case-study");
  const nextLink = lookup(learningContent.discovery.nextByGuide, lesson.id);
  const next = resolveDiscoveryLink(learningContent, nextLink);
  const trackLinks = lookup(learningContent.discovery.caseTracks, lesson.id);
  const caseTracks = tracks.flatMap((track) => {
    const link = trackLinks && lookup(trackLinks, track.slug);
    return link ? [{ track, link }] : [];
  });
  const caseTracksByAnchor = new Map(
    caseTracks.map(({ track, link }) => [link.anchor, track]),
  );
  const hasReferenceContext = referenceContext.some((item) => item.guideId === lesson.id);
  const relatedGuides = lesson.relatedGuideIds
    .filter((id) => id !== nextLink?.id)
    .filter((id) => !trackLinks || !hasReferenceContext || !referenceContext.some((item) => item.guideId === id))
    .map(requireGuide);
  const capabilities = relatedContent(learningContent.capabilities, lesson.capabilityIds);
  const platforms = relatedContent(learningContent.platforms, lesson.platformIds);
  const videos = relatedContent(learningContent.videos, lesson.videoIds);
  return (
    <main id="main-content" className="lesson-page" tabIndex={-1}>
      <nav className="breadcrumbs editorial-wrap" aria-label="Breadcrumb">
        <Link to="/">Harness</Link>
        <span aria-hidden="true">/</span>
        <Link to={trackPath(track)}>{track.nav}</Link>
        <span aria-hidden="true">/</span>
        <span>{lesson.shortTitle ?? lesson.title}</span>
      </nav>
      <div className="lesson-layout editorial-wrap">
        <aside className="lesson-sidebar">
          <p className="eyebrow">In this guide</p>
          <Contents sections={lesson.sections} />
          <Link className="text-link" to={trackPath(track)}>
            Back to the track
          </Link>
        </aside>
        <article className="lesson-article" aria-labelledby="lesson-title">
          <header className="lesson-header">
            <p className="eyebrow">
              {track.title} · {lesson.format}
            </p>
            <h1 id="lesson-title">{lesson.title}</h1>
            <div className="lesson-meta">
              <span>{lesson.readingMinutes} min read</span>
              <span>
                Updated{" "}
                <time dateTime={lesson.updatedAt}>
                  {dateFormatter.format(
                    new Date(`${lesson.updatedAt}T00:00:00Z`),
                  )}
                </time>
              </span>
              {lesson.publicationStatus === "draft" && (
                <span>Guide preview</span>
              )}
            </div>
            <p className="lesson-lede">{lesson.introduction}</p>
          </header>
          {hasReferenceContext && !trackLinks && (
            <ReferenceContext lessonId={lesson.id} label="Read these guides in any order" />
          )}
          <details className="lesson-mobile-contents">
            <summary>On this page</summary>
            <Contents sections={lesson.sections} />
          </details>
          <section
            className="lesson-orientation"
            aria-labelledby="objectives-title"
          >
            <div>
              <h2 id="objectives-title">Use this guide to</h2>
              <ul>
                {lesson.objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{prerequisites.length ? "Before you start" : "Access"}</h2>
              {prerequisites.map((concept) => (
                <p key={concept.id}>{concept.description}</p>
              ))}
              <p className="lesson-access-note">
                No account or API key is needed for this guide.
              </p>
              <p className="lesson-task-requirements" data-task-requirements="guide">
                No installation is needed to read this guide.
              </p>
            </div>
          </section>
          {caseTracks.length > 0 && (
            <nav className="reference-context case-track-nav" aria-labelledby="case-tracks-title">
              <h2 id="case-tracks-title">Explore the case by track</h2>
              <ol role="list">
                {caseTracks.map(({ track, link }) => (
                  <li key={track.slug}>
                    <a href={`#${link.anchor}`}>
                      <strong>{track.nav}</strong>
                      <span>{link.action}</span>
                    </a>
                  </li>
                ))}
              </ol>
              {projects.some((project) => project.mode === "sample") && (
                <a className="text-link" href="#try-the-collector">Run the samples locally</a>
              )}
            </nav>
          )}
          {lesson.sections.map((section) => {
            const caseTrack = caseTracksByAnchor.get(section.id);
            return (
              <section
                className="lesson-section"
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                key={section.id}
              >
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                {section.blocks.map((block, index) => {
                  const blockId = `${lesson.id}-${section.id}-${index}`;
                  return (
                    <LessonBlock
                      key={index}
                      block={block}
                      blockId={blockId}
                    />
                  );
                })}
                {caseTrack && (
                  <Link className="text-link case-track-return" to={trackPath(caseTrack)}>
                    Explore {caseTrack.nav}
                  </Link>
                )}
              </section>
            );
          })}
          {next && (
            <section className="lesson-next" aria-labelledby="next-guide-title">
              <p className="eyebrow">Next · {next.label}</p>
              <h2 id="next-guide-title">{next.title}</h2>
              <p>{next.description}</p>
              <SiteLink href={next.href} className="text-link">{next.action}</SiteLink>
            </section>
          )}
          {hasReferenceContext && trackLinks && (
            <ReferenceContext lessonId={lesson.id} label="Guides and platform references" />
          )}
          {caseStudies.map((publication) => (
            <aside className="guide-case-study" aria-label="Supporting case study" key={publication.id}>
              <p className="eyebrow">Optional case study · Publication</p>
              <h2><a href={publication.href}>{publication.title}</a></h2>
              <p>{publication.relationship}</p>
            </aside>
          ))}
          {relatedGuides.length > 0 && (
            <section className="lesson-related" aria-labelledby="related-guides-title">
              <p className="eyebrow">Where to go next</p>
              <h2 id="related-guides-title">Related guides</h2>
              {relatedGuides.map((guide) => (
                <article key={guide.id}>
                  <span className="resource-kind">{guide.format}{guide.publicationStatus === "draft" ? " · Preview" : ""}</span>
                  <h3><SiteLink href={guide.path}>{guide.title}</SiteLink></h3>
                  <p>{guide.description}</p>
                </article>
              ))}
            </section>
          )}
          {(relatedReading.length > 0 || capabilities.length > 0) && (
            <section
              className="lesson-related"
              id="related-reading"
              aria-labelledby="related-reading-title"
            >
              <p className="eyebrow">Optional companions</p>
              <h2 id="related-reading-title">Related reading and resources</h2>
              {relatedReading.map((publication) => (
                <article key={publication.id}>
                  <h3>
                    <a href={publication.href}>{publication.title}</a>
                  </h3>
                  <p>{publication.relationship}</p>
                </article>
              ))}
              {capabilities.map((capability) => (
                <article key={capability.id}>
                  <span className="resource-kind">
                    Resource · Skills
                  </span>
                  <h3>
                    <a href={capability.href}>{capability.title}</a>
                  </h3>
                  <p>{capability.relationship}</p>
                </article>
              ))}
            </section>
          )}
          {platforms.length > 0 && (
            <section
              className="lesson-sources"
              id="sources"
              aria-labelledby="sources-title"
            >
              <h2 id="sources-title">Platform sources</h2>
              <p>Official sources used in this guide. Check your own ad account for the features you can access.</p>
              {platforms.map((platform) => (
                <details className="guide-source-group" key={platform.id}>
                  <summary>
                    {platform.title} · reviewed{" "}
                    <time dateTime={platform.checkedAt}>
                      {platform.checkedAt}
                    </time>
                  </summary>
                  <ul>
                    {platform.sources.map((source) => (
                      <li key={source.href}>
                        <a href={source.href}>{source.title}</a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </section>
          )}
          {(projects.length > 0 || videos.length > 0) && (
            <section id="try-the-collector" className="lesson-next" aria-labelledby="lesson-next-title">
              <p className="eyebrow">Build on this</p>
              <h2 id="lesson-next-title">Try the report collector</h2>
              {projects.map((project) => (
                <div className="lesson-project" key={project.id}>
                  <h3>
                    {project.title}{" "}
                    <span className="resource-kind">
                      {project.status === "planned"
                        ? "Planned build"
                        : project.mode === "sample"
                          ? "Run locally · Sample data"
                          : "Available build"}
                    </span>
                  </h3>
                  <p>{project.description}</p>
                  {project.status === "available" && (
                    <SiteLink
                      className="text-link"
                      href={project.href}
                      aria-label={project.mode === "sample" ? `Open run instructions for ${project.title}` : undefined}
                    >
                      {project.mode === "sample" ? "Open run instructions" : "Open the build"}
                    </SiteLink>
                  )}
                </div>
              ))}
              {videos.map((video) => (
                <p className="lesson-video-note" key={video.id}>
                  {video.status === "planned" ? (
                    "A video walkthrough is planned. The written reference is available independently."
                  ) : (
                    <a href={video.href ?? undefined}>{video.title}</a>
                  )}
                </p>
              ))}
              <Link className="text-link" to={trackPath(track)}>
                Continue exploring {track.nav.toLowerCase()}
              </Link>
            </section>
          )}
        </article>
      </div>
    </main>
  );
}
