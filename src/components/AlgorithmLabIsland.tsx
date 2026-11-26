import { BrowserRouter, StaticRouter } from "react-router-dom";
import { AlgorithmLabPage } from "../views/AlgorithmLabPage";
import { labPath } from "../content/site";
import type { ReactNode } from "react";

// The first render matches the static default lab. The existing DOM is hydrated
// in place; the lab then reads the real query without replacing a reader's
// scrolling target while the island loads.
export default function AlgorithmLabIsland({ children }: { children?: ReactNode }) {
  const content = <AlgorithmLabPage deferQueryUntilMounted binaryContext={children} />;
  return typeof window === "undefined"
    ? <StaticRouter location={labPath}>{content}</StaticRouter>
    : <BrowserRouter>{content}</BrowserRouter>;
}
