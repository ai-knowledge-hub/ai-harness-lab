import { site, tracks, trackPath, labPath, controlPath } from "./site";
import { getLessonByPath, lessons, normalizePath } from "./learning";

export const staticPaths = [
  "/",
  ...tracks.map(trackPath),
  labPath,
  controlPath,
  "/examples",
  ...lessons.map((lesson) => lesson.path),
];
export function getPageMetadata(pathname) {
  const path = normalizePath(pathname);
  const lesson = getLessonByPath(path);
  const track = tracks.find((item) => path.startsWith(trackPath(item)));
  const name =
    lesson?.title ??
    (path === labPath
      ? "Algorithm visualizers"
      : path === controlPath
        ? "Agent control plane"
        : path === "/examples"
          ? "Planned case studies"
          : track?.title);
  return {
    title: name
      ? `${name} · Harness · AI Knowledge Hub`
      : "Harness · AI Knowledge Hub",
    description: lesson?.description ?? track?.description ?? site.description,
    canonical: `${site.origin}${path}`,
    robots:
      lesson?.publicationStatus === "draft" || path === "/examples"
        ? "noindex, follow"
        : "index, follow",
  };
}
