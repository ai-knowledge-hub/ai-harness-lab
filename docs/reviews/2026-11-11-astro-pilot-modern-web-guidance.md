# Astro pilot review with Modern Web Guidance — 11 November 2026

Reviewed the merged pilot at `740f5bff98a070036ac802338a0d81e845c7b0ad`
(PR #50, application changes through `5f679f2`). #44 is complete and closed.
This review prepares the quality gate before #45 expands the migration.

## Findings to resolve before carrying the walkthrough into #45

### [P2] Keep inactive explanations searchable and reachable by fragments

At [architecture.ts:61](../../pilot/src/architecture.ts#L61), every inactive
explanation goes through `show()`, which applies both `hidden` and
`display: none` at lines 7–10. Initialisation always selects stage 1 and has no
fragment or `beforematch` handling. This makes the reference text unavailable
to browser search and hides the destination of a direct explanation link.

Reproduced in Chromium 147.0.7727.15 and WebKit 26.4:

1. Open `/learn/system-design/chatgpt-ads#chatgpt-ads-visual-deep-dive-0-stage-4`.
2. After enhancement, the address still targets explanation 5, but its heading
   is hidden and the control reports `Stage 1 of 5`.
3. From the normal staged view, browser `window.find()` cannot locate
   `The dashed boxes show our plan`.
4. Select **Show complete diagram**; the same search succeeds.

Choose a searchable disclosure pattern or keep a linear reference available.
If using `hidden="until-found"`, follow the guide's `beforematch` state
synchronisation and Safari fallback; retaining `display:none` defeats that
feature. Preserve fragment navigation on initial load and subsequent hash
changes, the selected-stage state, and accessibility. Add direct-link and
search/reveal regressions before expanding the pattern.

Authority: [search-hidden-content](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-behaviors/search-hidden-content.md),
including its rule, “Synchronize UI state”.

### [P2] Include the visible stage labels in accessible names

At [Architecture.astro:17](../../pilot/src/Architecture.astro#L17), `aria-label`
uses the long stage title and overrides the short visible label. Four controls
fail the label-in-name requirement:

| Visible label | Accessible name |
| --- | --- |
| Tools | Stage 2: Find ads that could fit the conversation |
| Delivery | Stage 3: See when a selected ad appears |
| Reports | Stage 4: Find the results advertisers can read |
| Our build | Stage 5: See how you could collect reports |

A speech-input user naming a visible control gets a different accessible name.
The same naming pattern also exists in the shared React walkthrough at
[ChatGPTAdsArchitecture.jsx:89](../../src/components/ChatGPTAdsArchitecture.jsx#L89).
Use the visible label in the name and put additional explanation in a
description, or include the short label verbatim in the longer name. Verify
both renderers, including all five controls. The DOM name/text comparison was
reproduced in both engines; actual speech-recognition software was not tested.

Authority: [accessibility](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/accessibility/accessibility.md),
“Do include a control's visible text in its accessible name” (WCAG 2.5.3).

## Dependency and deployment security follow-up

`pnpm audit --json` returned 54 distinct advisory URLs in existing dependencies.
Its severity summary reports 4 critical, 27 high, 26 moderate, and 5 low version
matches. These are registry results, not 62 proven exploits. The original
lockfile records the dependency versions. Rerun the audit for current advisory
details and paths; the registry catalogue is maintained upstream. None of the
returned advisory paths included Modern Web Guidance, and this integration
does not change application dependencies.

The four critical matches require a separate dependency upgrade/reachability
triage before widening the migration:

- **Astro AVIF processing:** [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2)
  affects Astro below 7.2.8 when an attacker can supply an AVIF image for
  optimisation. The current pilot has static output, no image-service endpoint,
  and no imported `astro:assets` image components or AVIF sources. Introducing
  remote/user-supplied image processing changes that exposure.
- **Vitest UI/API:** [GHSA-5xrq-8626-4rwp](https://github.com/advisories/GHSA-5xrq-8626-4rwp)
  includes Vitest below 3.2.6. Exposure depends on the UI/API or Browser Mode
  configuration. The inspected CI uses `vitest run`, with no configured UI/API
  server. This is a developer-tool finding, not a demonstrated reader-page path.
- **Tinypool worker options:** [GHSA-5gmw-xhrv-c9v3](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3)
  and [GHSA-85c8-ppgw-ccpr](https://github.com/advisories/GHSA-85c8-ppgw-ccpr)
  affect the Vitest dependency. Their code-execution paths require prototype
  pollution and relevant worker/run options; those prerequisites have not been
  demonstrated in this project.

The remaining React Router, Vite, Astro, and transitive-tool advisories also
need classification and a tested upgrade plan. This focused review did not
exhaustively assess every advisory or run exploit payloads.

The browser-source review confirmed that the pilot clones trusted build-time
templates and assigns text through `textContent`. Saved theme input is limited
to `light` and `dark`; there is no pilot authentication or private-data API.
The repo has no explicit application CSP/header policy. Before production
cutover in #47, inventory the actual hosting headers, inline theme script,
styles, analytics, and preview toolbar, then design and test the appropriate
policy. This local review does not establish the hosted security configuration.
The [security guide](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/security/security.md)
requires inspection before enforcing policies; a blanket CSP/Trusted Types
change could break the React pages and deployment tooling.

## Evidence and checks

- Used `modern-web-guidance@1.0.0`, with skill revision
  `2026_11_09-5bcc021b`, and CLI telemetry disabled. The tool is now installed
  in the local harness instead of vendored into the application repository.
- Searched separately for hidden content, keyboard navigation, safe DOM updates,
  script work, and dark themes. Retrieved `search-hidden-content`,
  `accessibility`, `security`, `performance`, and `dark-mode` in full.
- `pnpm check`: TypeScript, all **30 unit/component tests**, and the normal
  **16-route / 14-sitemap-entry build** passed on Node 22.22.0.
- `pnpm test:astro-pilot`: all **16 pilot checks** and **18 existing browser
  tests** passed against the combined preview. They do not cover the two findings.
- Focused Chromium and WebKit probes reproduced the findings. Root native
  `color-scheme` changed from dark to light correctly; reduced-motion mode
  disabled node animation in both engines.
- The guide HTML still has SHA-256
  `53665ab64cd561ad1f78350f42191f2166e85b6ab5705255c9b4b44507f9cd3a`, matching
  the measured pilot. The integration adds a local harness setup and documentation,
  so the dated **1,515-gzip-byte** result remains applicable. Timing benchmarks
  were not rerun for this setup/documentation-only change.
- The source CSS imports are bundled by Vite; no runtime CSS `@import` chain
  was introduced. Existing theme choices and motion styling were retained.

[Focused browser evidence and reproduction steps](https://github.com/ai-knowledge-hub/ai-harness-lab/pull/51)
are preserved in the PR description. This is a targeted browser/platform review;
it does not replace assistive-technology testing or a complete application
security assessment. Resolve the two P2 findings and triage dependency updates
before #45 expands these patterns.
