import { useEffect, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AlgorithmLabPage } from "./pages/AlgorithmLabPage";
import { ExamplesPage } from "./pages/ExamplesPage";
import { HomePage } from "./pages/HomePage";
import { PatternsPage } from "./pages/PatternsPage";
import { TrackPage } from "./pages/TrackPage";
import { LessonPage } from "./pages/LessonPage";
import { lessons } from "./content/learning";
import { getPageMetadata } from "./content/page-metadata";
import { site, tracks, trackPath, labPath, controlPath } from "./content/site";

function TrackNavigation({ onNavigate }) {
  const { pathname } = useLocation();
  return (
    <nav className="track-navigation" aria-label="Engineering tracks">
      {tracks.map((track) => (
        <Link
          key={track.slug}
          to={trackPath(track)}
          aria-current={
            pathname.startsWith(trackPath(track)) ? "page" : undefined
          }
          onClick={onNavigate}
        >
          {track.nav}
        </Link>
      ))}
    </nav>
  );
}

function Header() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "light" ? "light" : "dark",
    );
  }, []);
  const mobileMenu = useRef(null);
  function closeMenu() {
    if (mobileMenu.current?.open) {
      mobileMenu.current.open = false;
      mobileMenu.current.querySelector("summary").focus();
    }
  }
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("harness-theme", next);
    } catch {
      /* Reading remains available when storage is disabled. */
    }
  }
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="masthead-row">
        <Link
          className="site-brand"
          to="/"
          onClick={closeMenu}
          aria-label="AI Knowledge Hub Harness home"
        >
          <span>{site.family}</span>
          <span className="product-label">{site.name}</span>
        </Link>
        <div className="header-actions">
          <nav className="family-navigation" aria-label="AI Knowledge Hub">
            <a href={site.publication}>Publication</a>
            <a href={site.skills}>Skills</a>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <details
            className="mobile-navigation"
            ref={mobileMenu}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeMenu();
            }}
          >
            <summary>Tracks</summary>
            <div className="mobile-menu">
              <TrackNavigation onNavigate={closeMenu} />
              <nav aria-label="Companion sites">
                <a href={site.publication}>Publication</a>
                <a href={site.skills}>Skills</a>
              </nav>
            </div>
          </details>
        </div>
      </div>
      <div className="desktop-navigation">
        <TrackNavigation />
      </div>
    </header>
  );
}

function PageEffects() {
  const { pathname, search, hash, key } = useLocation();
  const previousLocation = useRef({ pathname, search, hash });
  useEffect(() => {
    const previous = previousLocation.current;
    const metadata = getPageMetadata(pathname);
    document.title = metadata.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = metadata.description;
    for (const [selector, tag, attributes] of [
      [
        'link[rel="canonical"]',
        "link",
        { rel: "canonical", href: metadata.canonical },
      ],
      [
        'meta[name="robots"]',
        "meta",
        { name: "robots", content: metadata.robots },
      ],
      ...Object.entries({
        "og:title": metadata.title,
        "og:description": metadata.description,
        "og:url": metadata.canonical,
      }).map(([property, content]) => [
        `meta[property="${property}"]`,
        "meta",
        { property, content },
      ]),
    ]) {
      const element =
        document.querySelector(selector) ??
        document.head.appendChild(document.createElement(tag));
      for (const [name, value] of Object.entries(attributes))
        element.setAttribute(name, value);
    }
    if (previous.pathname !== pathname) {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    }
    // A new navigation key can revisit the same anchor. Query-only selections
    // in the visualizer should keep the reader's current scroll position.
    const queryOnly =
      previous.pathname === pathname &&
      previous.hash === hash &&
      previous.search !== search;
    if (!queryOnly) {
      if (hash)
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "instant" });
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    previousLocation.current = { pathname, search, hash };
  }, [pathname, search, hash, key]);
  return null;
}

function LegacyRoute({ to }) {
  const { search, hash } = useLocation();
  return <Navigate replace to={`${to}${search}${hash}`} />;
}

function Footer() {
  return (
    <footer className="site-footer">
      <Link className="footer-brand" to="/">
        AI Knowledge Hub <span>Harness</span>
      </Link>
      <p>Practical engineering for AI-powered growth.</p>
      <nav aria-label="Footer">
        <a href={site.publication}>Publication</a>
        <a href={site.skills}>Skills</a>
        <Link to="/#tracks">Engineering tracks</Link>
      </nav>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <PageEffects />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {lessons.map((lesson) => (
          <Route
            key={lesson.id}
            path={lesson.path}
            element={<LessonPage lesson={lesson} />}
          />
        ))}
        {tracks.map((track) => (
          <Route
            key={track.slug}
            path={trackPath(track)}
            element={<TrackPage key={track.slug} track={track} />}
          />
        ))}
        <Route path={labPath} element={<AlgorithmLabPage />} />
        <Route path={controlPath} element={<PatternsPage />} />
        <Route path="/algorithms" element={<LegacyRoute to={labPath} />} />
        <Route path="/patterns" element={<LegacyRoute to={controlPath} />} />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
