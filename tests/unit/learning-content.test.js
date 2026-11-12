import { learningContent } from "../../src/content/learning";
import { validateLearningContent } from "../../src/content/validate-learning";
import { getPageMetadata } from "../../src/content/page-metadata";
import { resolveDiscoveryLink } from "../../src/content/discovery";

function changed(mutator) {
  const content = structuredClone(learningContent);
  mutator(content);
  return content;
}

describe("Learning content integrity", () => {
  it("rejects a cross-track case link to a missing section", () => {
    const content = changed((draft) => {
      const link = draft.discovery.caseTracks["chatgpt-ads-reporting"]["software-production"];
      link.anchor = "missing-section";
    });
    expect(() => validateLearningContent(content)).toThrow(
      "invalid destination guide/chatgpt-ads-reporting#missing-section",
    );
  });

  it("keeps a planned live project out of the available examples", () => {
    const content = changed((draft) => {
      draft.discovery.tracks["software-production"].examples.unshift({
        kind: "project",
        id: "live-advertising-reporting",
        action: "Run the live collector",
      });
    });
    expect(() => validateLearningContent(content)).toThrow(
      "invalid destination project/live-advertising-reporting",
    );
  });

  it("derives starter prerequisites from their source and rejects missing records", () => {
    const content = changed((draft) => {
      draft.concepts.find((concept) => concept.id === "http-basics").description = "Updated explanation of HTTP.";
    });
    const starter = resolveDiscoveryLink(content, content.discovery.tracks["system-design"].start.next);
    expect(starter.prerequisites).toEqual(["Updated explanation of HTTP."]);
    expect(() =>
      validateLearningContent(
        changed((content) =>
          content.lessons[0].prerequisiteConceptIds.push("missing-concept"),
        ),
      ),
    ).toThrow("unknown concepts reference missing-concept");
  });
  it("rejects duplicate canonical lesson paths", () => {
    expect(() =>
      validateLearningContent(
        changed((content) =>
          content.lessons.push({
            ...content.lessons[0],
            id: "duplicate-lesson",
          }),
        ),
      ),
    ).toThrow("duplicate path");
  });
  it("rejects a lesson that shadows the existing visualizer route", () => {
    expect(() =>
      validateLearningContent(
        changed((content) => {
          Object.assign(content.lessons[0], {
            id: "visualizers",
            trackId: "algorithms",
            path: "/learn/algorithms/visualizers",
          });
        }),
      ),
    ).toThrow("duplicate path");
  });
  it("rejects published content without a reading body", () => {
    expect(() =>
      validateLearningContent(
        changed((content) => {
          content.lessons[0].publicationStatus = "published";
          content.lessons[0].sections = [];
        }),
      ),
    ).toThrow("sections required");
  });
  it("reserves index guide IDs so neither drafts nor published guides overwrite a track", () => {
    for (const publicationStatus of ["draft", "published"]) {
      const content = changed((draft) => draft.lessons.push({
        ...draft.lessons[0],
        id: "index",
        trackId: "software-production",
        path: "/learn/software-production/index",
        publicationStatus,
      }));
      expect(() => validateLearningContent(content)).toThrow("guide ID index is reserved");
    }
  });
  it("rejects duplicate anchors that make a contents link ambiguous", () => {
    expect(() =>
      validateLearningContent(
        changed(
          (content) =>
            (content.lessons[0].sections[1].id =
              content.lessons[0].sections[0].id),
        ),
      ),
    ).toThrow("duplicate section anchor");
  });
  it("rejects an unknown block instead of silently omitting content", () => {
    expect(() =>
      validateLearningContent(
        changed((content) =>
          content.lessons[0].sections[0].blocks.push({ type: "unsupported" }),
        ),
      ),
    ).toThrow("invalid unsupported block");
  });
  it("rejects a source citation on a block that cannot render it", () => {
    const content = changed((draft) => {
      draft.lessons[0].sections[0].blocks.push({
        type: "callout",
        title: "Example",
        text: "A callout with an unsupported citation.",
        source: { title: "Source", href: "https://example.com/" },
      });
    });
    expect(() => validateLearningContent(content)).toThrow(
      "only paragraph blocks can cite a source",
    );
  });
  it("rejects a working destination for a planned video", () => {
    expect(() =>
      validateLearningContent(
        changed(
          (content) =>
            (content.videos[0].href = "https://example.com/invented-video"),
        ),
      ),
    ).toThrow("planned resources must not expose a working destination");
  });
  it("rejects verified-platform claims without verified account access", () => {
    expect(() =>
      validateLearningContent(
        changed(
          (content) => (content.platforms[0].status = "account-verified"),
        ),
      ),
    ).toThrow("account verification is inconsistent");
  });
  it("keeps draft lessons out of indexing while retaining a stable canonical", () => {
    const metadata = getPageMetadata("/learn/system-design/chatgpt-ads-reporting/");
    expect(metadata.robots).toBe("noindex, follow");
    expect(metadata.canonical).toBe(
      "https://harness.ai-knowledge-hub.org/learn/system-design/chatgpt-ads-reporting",
    );
    expect(metadata.title).toContain("How to collect ChatGPT Ads reports");
  });
});
