# React lab integration with Astro

Implementation and audit for [#46](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/46), based on merged #53 at `9f904d0`. #45 is closed. Production cutover and removal of the compatibility renderer remain in #47.

## Integration boundary

Astro owns `/learn/algorithms/visualizers`, the document metadata, shared navigation and surrounding shell. The existing lab is a single `client:load` React island. React Router is scoped to the lab's query-driven selection. Breadcrumbs and the surrounding site use native document links. No new router, runtime dependency or duplicate visualizer implementation is introduced.

The static document contains the complete default Binary Search view. The island hydrates that DOM in place before applying the actual query, preserving the scrolling target while the module loads. The delayed-module check now requests Token Bucket: it asserts the initial Binary Search fallback, successful query selection, working Next, the same connected target, stable scroll and no hydration errors. Reading pages retain zero islands; the network check now covers all 15 baseline reading routes rather than seven representative routes.

The audit found one missing default-selection case. With no `algorithm` parameter, or an invalid value, Binary Search is already active. Reselecting it compared against the raw query and unnecessarily added `?algorithm=binary` and a history entry. Selection now compares the effective active ID, so reselecting a default or explicit selection resets and stops playback while preserving URL, history length and working position. The new browser assertion failed on the merged base before this one-line shared fix. It covers absent, invalid and explicit queries, both with and without `#visualizer`.

## Verification without a broad browser matrix

`tests/fixtures/labs.json` records the 15 IDs, titles, operation groups and step counts directly from the independent #42 source at `cc921b2`, preserved in checkout `5c8d173`. It is not generated from the candidate registry. There are **88 authored steps** in that inventory. Authored algorithms, reference code and renderer implementations are unchanged.

The four existing lab cases were moved from the general smoke file into `tests/e2e/lab.spec.js`, then extended and joined by three missing integration cases. The normal browser command has one desktop project and a mobile project restricted to this lab file. The retained-renderer command runs desktop only; the rest of the website, pilot and WebKit checks are not multiplied.

| Surface | Checked outcome |
| --- | --- |
| All 15 labs, every step | Both desktop and mobile, dark and light; fixed baseline step counts, nonempty visualization and step explanation label, active reference-code line, Next/Back boundaries, Context/Run and Reset |
| Shared playback controls | Speed range endpoints via keyboard, Play, Pause and automatic stop at the last step |
| All 15 query links | Direct load and refresh select the intended lab and reveal `#visualizer`, retaining an unrelated query parameter |
| Operation filters and history | Exact baseline membership for every operation group; Back/Forward restore selection, reset the step and stop playback |
| Working position and reselection | Switching preserves the pre-click position; reselecting valid/default/invalid selections preserves URL/history/scroll and resets playback |
| Compatibility addresses | `/algorithms` and `/patterns` preserve query and fragment on direct entry and refresh |
| Island boundary | Every baseline reading route avoids the lab entry; a delayed nondefault lab query hydrates without replacing the scrolling target |

The Astro lab matrix exercises all **88/88 steps in four viewport/theme combinations** (352 step states), plus 176 states in the retained desktop renderer's two themes. This is integration coverage, not a claim of mathematical verification of each algorithm or full browser/platform coverage.

The complete CI portfolio becomes 28 normal browser cases (14 site cases and seven lab cases at two widths), 11 walkthrough/navigation cases, eight targeted site/Chromium-WebKit cases, and 21 retained-renderer desktop cases: **68 total**. The additional work is confined to the #46 lab requirements. The preinstalled Playwright image, single workflow, frozen dependencies and 15-minute bound from #53 remain unchanged. No test runner or fixture is emitted into the website bundle.

## Reproduce

Use Node 22.12+ and the frozen lockfile:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm check:routes
pnpm exec playwright test tests/e2e/lab.spec.js
pnpm test:e2e
pnpm test:site
pnpm exec playwright test --config playwright.pilot.config.js
pnpm build:legacy
pnpm exec playwright test --config playwright.legacy.config.js
```

The existing independent comparison still protects all 16 baseline routes, metadata, anchors, links, 14 sitemap entries and five download hashes. The lab's JavaScript/performance measurements and hosted preview verification are recorded with the PR evidence. #47 retains the final production-candidate measurements, hosting/header/dependency checks, rollback plan and renderer retirement.
