import { getCollection, render } from "astro:content";
import type { Guide } from "./guide-types";

// Each authored file is its registration. Both formats share route, metadata,
// discovery and sitemap validation.
const records = import.meta.glob<Guide>("./lessons/*.ts", { eager: true, import: "default" });
const authored = await Promise.all((await getCollection("authoredGuides")).map(async (entry): Promise<Guide> => {
  const { sectionIds, ...metadata } = entry.data;
  const { headings } = await render(entry);
  // Astro also reports generated headings such as the footnotes label.
  const sectionSlugs = new Set(sectionIds.map((id) => `${id}-title`));
  const sections = headings
    .filter(({ depth, slug }) => depth === 2 && sectionSlugs.has(slug))
    .map(({ slug, text }) => ({ id: slug.slice(0, -"-title".length), title: text }));
  if (sections.length !== sectionIds.length || sections.some(({ id }, index) => id !== sectionIds[index])) {
    throw new Error(`Guide ${metadata.id} must have one level-two heading per section ID in order`);
  }
  return {
    ...metadata,
    path: `/learn/${metadata.trackId}/${metadata.id}`,
    contentEntryId: entry.id,
    sections,
  };
}));

export const guides: Guide[] = [...Object.values(records), ...authored].sort((a, b) => a.path.localeCompare(b.path));
