import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { getPageMetadata, staticPaths } from "./content/page-metadata";
import { validateLearningContent } from "./content/validate-learning";

export { staticPaths, validateLearningContent };
export function renderPage(path) {
  return {
    markup: renderToString(
      <StaticRouter location={path}>
        <App />
      </StaticRouter>,
    ),
    metadata: getPageMetadata(path),
  };
}
