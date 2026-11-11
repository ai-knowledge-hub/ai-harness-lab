import { BrowserRouter, StaticRouter } from "react-router-dom";
import { AlgorithmLabPage } from "../views/AlgorithmLabPage";
import { labPath } from "../content/site";

// The first render matches the static default lab. The existing DOM is hydrated
// in place; the lab then reads the real query without replacing a reader's
// scrolling target while the island loads.
export default function AlgorithmLabIsland() {
  const content = <AlgorithmLabPage deferQueryUntilMounted />;
  return typeof window === "undefined"
    ? <StaticRouter location={labPath}>{content}</StaticRouter>
    : <BrowserRouter>{content}</BrowserRouter>;
}
