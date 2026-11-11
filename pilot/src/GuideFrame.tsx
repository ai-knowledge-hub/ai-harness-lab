import type { ReactNode } from "react";
import { StaticRouter } from "react-router-dom";
import { Header, Footer } from "../../src/App";
import { LessonPage } from "../../src/pages/LessonPage";
import type { Guide } from "../../src/content/guide-types";

export function GuideFrame({ guide, architecture, architectureId }: {
  guide: Guide;
  architecture?: ReactNode;
  architectureId?: string;
}) {
  return (
    <StaticRouter location={guide.path}>
      <Header />
      <LessonPage lesson={guide} architecture={architectureId ? { id: architectureId, content: architecture } : undefined} />
      <Footer />
    </StaticRouter>
  );
}
