import type { referenceDownloads } from "./reference-downloads";

type SourceCitation = {
  title: string;
  href: string;
};

export type GuideBlock = { source?: SourceCitation } & (
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "code"; label: string; language: string; code: string }
  | { type: "flow"; label: string; steps: string[] }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "ads-architecture" }
  | { type: "ads-orchestrator" }
  | { type: "ads-capabilities" }
  | { type: "ads-reporting-reference" }
  | { type: "reference-downloads"; collection: keyof typeof referenceDownloads }
);

export type GuideSection = {
  id: string;
  title: string;
  blocks: GuideBlock[];
};

export type Guide = {
  id: string;
  path: `/learn/${string}/${string}`;
  trackId: string;
  title: string;
  shortTitle?: string;
  description: string;
  kind: "overview" | "platform" | "capabilities" | "principle" | "case";
  publicationStatus: "draft" | "published";
  format: string;
  readingMinutes: number;
  updatedAt: string;
  introduction: string;
  objectives: string[];
  prerequisiteConceptIds: string[];
  conceptIds: string[];
  projectIds: string[];
  platformIds: string[];
  publicationIds: string[];
  capabilityIds: string[];
  videoIds: string[];
  relatedGuideIds: string[];
  sections: GuideSection[];
};
