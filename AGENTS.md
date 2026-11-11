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

`pnpm check` runs TypeScript, unit/component tests, and the normal production
build. `pnpm test:e2e` checks that normal build. The combined Astro pilot requires
Node 22.12+; `pnpm test:astro-pilot` builds it and runs its integration checks and
the existing browser suite. See `docs/harness-astro-pilot.md` for the baseline,
measurements, and migration scope.
