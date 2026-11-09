import { referenceContext } from "./reference-context";
import { referenceDownloads } from "./reference-downloads";
import { learningContent } from "./learning";
import { tracks, labPath, controlPath } from "./site";

export function validateLearningContent(content = learningContent) {
  const errors = [];
  const collections = [
    "concepts",
    "platforms",
    "projects",
    "publications",
    "capabilities",
    "videos",
    "lessons",
  ];
  const indexes = {};
  const fail = (message) => errors.push(message);
  const text = (value) => typeof value === "string" && value.trim().length > 0;
  const https = (value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  };
  for (const name of collections) {
    if (!Array.isArray(content[name])) {
      fail(`${name}: expected an array`);
      continue;
    }
    indexes[name] = new Set();
    for (const item of content[name]) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id ?? ""))
        fail(`${name}: invalid ID`);
      if (indexes[name].has(item.id)) fail(`${name}: duplicate ID ${item.id}`);
      indexes[name].add(item.id);
      if (!text(item.title)) fail(`${name}/${item.id}: title is required`);
      if (["publications", "capabilities"].includes(name) && !https(item.href))
        fail(`${name}/${item.id}: HTTPS destination required`);
    }
  }
  for (const link of referenceContext)
    if (!indexes.lessons?.has(link.guideId)) fail(`context: unknown guide ${link.guideId}`);
  const paths = new Set([labPath, controlPath]);
  const references = {
    prerequisiteConceptIds: "concepts",
    conceptIds: "concepts",
    projectIds: "projects",
    platformIds: "platforms",
    publicationIds: "publications",
    capabilityIds: "capabilities",
    videoIds: "videos",
    relatedGuideIds: "lessons",
  };
  for (const lesson of content.lessons ?? []) {
    const label = `lesson/${lesson.id}`;
    if (!tracks.some((track) => track.slug === lesson.trackId))
      fail(`${label}: unknown track`);
    if (
      !/^\/learn\/[a-z0-9-]+\/[a-z0-9-]+$/.test(lesson.path ?? "") ||
      lesson.path !== `/learn/${lesson.trackId}/${lesson.id}`
    )
      fail(`${label}: invalid canonical path`);
    if (paths.has(lesson.path)) fail(`${label}: duplicate path ${lesson.path}`);
    paths.add(lesson.path);
    if (!["overview", "platform", "capabilities", "principle", "case"].includes(lesson.kind))
      fail(`${label}: invalid reference kind`);
    if (!["draft", "published"].includes(lesson.publicationStatus))
      fail(`${label}: invalid publication status`);
    if (![lesson.description, lesson.introduction, lesson.format].every(text))
      fail(`${label}: incomplete reading metadata`);
    if (!Number.isInteger(lesson.readingMinutes) || lesson.readingMinutes < 1)
      fail(`${label}: reading time required`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(lesson.updatedAt ?? "") ||
      !Number.isFinite(Date.parse(lesson.updatedAt))
    )
      fail(`${label}: valid update date required`);
    if (
      !Array.isArray(lesson.objectives) ||
      !lesson.objectives.length ||
      !lesson.objectives.every(text)
    )
      fail(`${label}: intended outcomes required`);
    for (const [field, target] of Object.entries(references)) {
      if (!Array.isArray(lesson[field])) {
        fail(`${label}: ${field} must be an array`);
        continue;
      }
      for (const id of lesson[field])
        if (!indexes[target]?.has(id))
          fail(`${label}: unknown ${target} reference ${id}`);
    }
    const anchors = new Set();
    if (!Array.isArray(lesson.sections) || !lesson.sections.length)
      fail(`${label}: sections required`);
    for (const section of lesson.sections ?? []) {
      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id ?? "") ||
        anchors.has(section.id)
      )
        fail(`${label}: invalid or duplicate section anchor ${section.id}`);
      anchors.add(section.id);
      if (
        !text(section.title) ||
        !Array.isArray(section.blocks) ||
        !section.blocks.length
      )
        fail(`${label}/${section.id}: incomplete section`);
      for (const block of section.blocks ?? []) {
        const valid =
          ["ads-architecture", "ads-orchestrator", "ads-capabilities"].includes(block.type) ? true :
          block.type === "reference-downloads" ? Object.hasOwn(referenceDownloads, block.collection ?? "") :
          block.type === "paragraph"
            ? text(block.text)
            : block.type === "callout"
              ? text(block.title) && text(block.text)
              : block.type === "code"
                ? text(block.label) && text(block.language) && text(block.code)
                : block.type === "list"
                  ? Array.isArray(block.items) &&
                    block.items.length > 0 &&
                    block.items.every(text)
                  : block.type === "flow"
                    ? text(block.label) &&
                      Array.isArray(block.steps) &&
                      block.steps.length > 1 &&
                      block.steps.every(text)
                    : block.type === "table"
                      ? Array.isArray(block.columns) &&
                        block.columns.length > 0 &&
                        block.columns.every(text) &&
                        Array.isArray(block.rows) &&
                        block.rows.length > 0 &&
                        block.rows.every(
                          (row) =>
                            Array.isArray(row) &&
                            row.length === block.columns.length &&
                            row.every(text),
                        )
                      : false;
        if (block.source && !(text(block.source.title) && https(block.source.href)))
          fail(`${label}/${section.id}: invalid source reference`);
        if (!valid) fail(`${label}/${section.id}: invalid ${block.type} block`);
      }
    }
  }
  for (const name of ["projects", "videos"])
    for (const item of content[name] ?? []) {
      if (!["planned", "available"].includes(item.status))
        fail(`${name}/${item.id}: invalid availability`);
      if (item.status === "planned" && item.href !== null)
        fail(
          `${name}/${item.id}: planned resources must not expose a working destination`,
        );
      if (
        item.status === "available" &&
        !(
          https(item.href) ||
          (typeof item.href === "string" && item.href.startsWith("/"))
        )
      )
        fail(`${name}/${item.id}: available resource requires a destination`);
      for (const id of item.lessonIds ?? [])
        if (!indexes.lessons?.has(id))
          fail(`${name}/${item.id}: unknown lesson ${id}`);
    }
  for (const platform of content.platforms ?? []) {
    if (
      !["research-planned", "documented", "account-verified"].includes(
        platform.status,
      )
    )
      fail(`platform/${platform.id}: invalid research status`);
    if (
      !["unverified", "verified", "unavailable"].includes(
        platform.accountAccess,
      )
    )
      fail(`platform/${platform.id}: invalid account access`);
    if (
      platform.status === "account-verified" &&
      platform.accountAccess !== "verified"
    )
      fail(`platform/${platform.id}: account verification is inconsistent`);
    if (
      !platform.sources?.length ||
      !platform.sources.every(
        (source) => text(source.title) && https(source.href),
      )
    )
      fail(`platform/${platform.id}: official sources required`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(platform.checkedAt ?? ""))
      fail(`platform/${platform.id}: source review date required`);
  }
  if (errors.length)
    throw new Error(`Invalid learning content:\n- ${errors.join("\n- ")}`);
  return true;
}
