# Working on Harness

Use Modern Web Guidance on demand for browser-platform decisions and targeted
accessibility, performance, or security reviews. Install the official
`modern-web-guidance@googlechrome` plugin in the local Codex harness; keep its
skill and guide catalogue outside this application repository. Setup and
temporary CLI commands are preserved in [PR #51](https://github.com/ai-knowledge-hub/ai-harness-lab/pull/51).

Search with a short, focused capability query, retrieve the matching guides, and
verify recommendations against this project's code and browser behaviour. A
focused component review uses search/retrieve, rather than `legacy-scan`.
Use `DISABLE_TELEMETRY=1` for CLI queries. Normal installation, builds, and CI
must work without the optional local plugin.

Browser support defaults to Baseline Widely Available. For newer capabilities,
follow the retrieved guide's feature detection and fallback recommendations.
The project does not opt in to Origin Trials or volatile features. Preserve
reading and reference downloads without JavaScript, keyboard operation, and the
pilot's 63,477-gzip-byte budget through the first successful stage change.

The Astro site requires Node 22.23.4+. `pnpm check` runs strict TypeScript and Astro
template diagnostics, unit/component tests, and the Astro build. `pnpm test:e2e`
checks the retained browser behaviour; `pnpm test:site` checks search, fragments,
accessibility, and island boundaries in Chromium/WebKit. `pnpm check:routes`
compares the independent #42 snapshot and download hashes. `pnpm check:authoring`
temporarily adds one record, tests published/draft/invalid variants, restores
the source, and rebuilds. Run it before browser tests, not concurrently.

The original pilot command remains an alias for the full Astro site. Vercel
preview and production use the same Astro build; no legacy renderer or catch-all
SPA fallback remains. Keep the native compatibility pages and build-time React
reading views, and hydrate React only on the lab route. See
`docs/harness-astro-cutover.md` for deployment verification, release and rollback.
