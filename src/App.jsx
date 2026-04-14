import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AlgorithmLabPage } from "./pages/AlgorithmLabPage";
import { ExamplesPage } from "./pages/ExamplesPage";
import { HomePage } from "./pages/HomePage";
import { PatternsPage } from "./pages/PatternsPage";

function Header() {
  const location = useLocation();
  const isAlgorithms = location.pathname.startsWith("/algorithms");
  const isPatterns = location.pathname.startsWith("/patterns");
  const isExamples = location.pathname.startsWith("/examples");

  return (
    <header className="topbar">
      <div className="masthead">
        <Link className="brand" to="/" aria-label="AI Harness Lab home">
          <span className="brand-mark"></span>
          <span className="brand-copy">
            <span className="brand-title">AI Harness Lab</span>
            <span className="brand-subtitle">Marketing AI systems manual</span>
          </span>
        </Link>
      </div>

      <div className="nav-columns">
        <nav className="topnav topnav-primary" aria-label="Primary navigation">
          <Link to="/" aria-current={location.pathname === "/" ? "page" : undefined}>
            Home
          </Link>
          <Link to="/algorithms" aria-current={isAlgorithms ? "page" : undefined}>
            Algorithms
          </Link>
          <Link to="/patterns" aria-current={isPatterns ? "page" : undefined}>
            Patterns
          </Link>
          <Link to="/examples" aria-current={isExamples ? "page" : undefined}>
            Examples
          </Link>
        </nav>

        <nav className="topnav topnav-secondary" aria-label="Ecosystem links">
          <span className="topnav-label">Ecosystem</span>
          <a href="https://ai-news-hub.performics-labs.com/" target="_blank" rel="noreferrer">
            News Hub
          </a>
          <a href="https://skills.ai-knowledge-hub.org/" target="_blank" rel="noreferrer">
            Skills Guide
          </a>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/algorithms" element={<AlgorithmLabPage />} />
        <Route path="/patterns" element={<PatternsPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
