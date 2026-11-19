import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = z.string().refine((value) => value.trim().length > 0);

const authoredGuides = defineCollection({
  loader: glob({ base: "./src/content/lessons", pattern: "*.{md,mdx}", generateId: ({ entry }) => entry }),
  schema: z.strictObject({
    id,
    trackId: id,
    title: text,
    shortTitle: text.optional(),
    description: text,
    kind: z.enum(["overview", "platform", "capabilities", "principle", "case"]),
    publicationStatus: z.enum(["draft", "published"]),
    format: text,
    readingMinutes: z.number().int().positive(),
    updatedAt: z.iso.date(),
    introduction: text,
    objectives: z.array(text).min(1),
    prerequisiteConceptIds: z.array(id).default([]),
    conceptIds: z.array(id).default([]),
    projectIds: z.array(id).default([]),
    platformIds: z.array(id).default([]),
    publicationIds: z.array(id).default([]),
    capabilityIds: z.array(id).default([]),
    videoIds: z.array(id).default([]),
    relatedGuideIds: z.array(id).default([]),
    sectionIds: z.array(id).min(1),
  }),
});

export const collections = { authoredGuides };
