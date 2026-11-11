import { StaticRouter } from "react-router-dom";
import { HomePage } from "../views/HomePage";
import { TrackPage } from "../views/TrackPage";
import { LessonPage } from "../views/LessonPage";
import { PatternsPage } from "../views/PatternsPage";
import { ExamplesPage } from "../views/ExamplesPage";
import type { Guide } from "../content/guide-types";
import { tracks } from "../content/site";

type Page = { kind: "home" | "control" | "examples" }
  | { kind: "track"; track: typeof tracks[number] }
  | { kind: "guide"; guide: Guide };

// React is used only at build time for these existing reading components.
// The Astro layout owns the shell; no router or renderer is sent to readers.
export function StaticPage({ path, page }: {
  path: string; page: Page;
}) {
  return (
    <StaticRouter location={path}>
      {page.kind === "home" && <HomePage />}
      {page.kind === "track" && <TrackPage track={page.track} />}
      {page.kind === "guide" && <LessonPage lesson={page.guide} staticArchitecture />}
      {page.kind === "control" && <PatternsPage />}
      {page.kind === "examples" && <ExamplesPage />}
    </StaticRouter>
  );
}
