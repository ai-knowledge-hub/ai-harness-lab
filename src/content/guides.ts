import type { Guide } from "./guide-types";

// Each guide record is its registration. Routes, metadata, discovery and the
// sitemap all consume this catalogue, including records added after #42.
const records = import.meta.glob<Guide>("./lessons/*.ts", { eager: true, import: "default" });
export const guides: Guide[] = Object.values(records).sort((a, b) => a.path.localeCompare(b.path));
