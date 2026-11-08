import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import "../styles.css";

const application = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>
);
const root = document.getElementById("root");
const path = window.location.pathname.replace(/\/+$/, "") || "/";
const algorithmQuery = new URLSearchParams(window.location.search).has(
  "algorithm",
);
// Fallback URLs and query-selected algorithms need their own initial state,
// rather than hydration against a different page or the default algorithm.
if (
  root.hasChildNodes() &&
  root.dataset.renderedPath === path &&
  !algorithmQuery
)
  ReactDOM.hydrateRoot(root, application);
else ReactDOM.createRoot(root).render(application);
