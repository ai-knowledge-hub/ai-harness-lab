# React lab integration with Astro

> #47 update: the [cutover runbook](harness-astro-cutover.md) supersedes the retained-renderer commands and release boundary below. The old renderer and its duplicate browser run are removed; use Node 22.23.4+ and the current README commands. Earlier measurements and verification remain historical evidence.


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
| All 15 labs, every step | Both desktop and mobile, dark and light; fixed baseline step counts, independent diagram-state fingerprints and exact step labels, active reference-code line, Next/Back boundaries, Context/Run and Reset |
| Shared playback controls | Speed range endpoints via keyboard, Play, Pause and automatic stop at the last step |
| All 15 query links | Direct load and refresh select the intended lab and reveal `#visualizer`, retaining an unrelated query parameter |
| Operation filters and history | Exact baseline membership for every operation group; Back/Forward restore selection, reset the step and stop playback |
| Working position and reselection | Switching preserves the pre-click position; reselecting valid/default/invalid selections preserves URL/history/scroll and resets playback |
| Compatibility addresses | `/algorithms` and `/patterns` preserve query and fragment on direct entry and refresh |
| Island boundary | Every baseline reading route avoids the lab entry; a delayed nondefault lab query hydrates without replacing the scrolling target |

The Astro lab matrix exercises all **88/88 steps in four viewport/theme combinations** (352 step states), plus 176 states in the retained desktop renderer's two themes. This is DOM/SVG state and integration coverage, not pixel-level or mathematical verification of each algorithm or full browser/platform coverage.

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

## Mobile comparison

The unchanged reviewed #42 benchmark measured the independent artifact and application `644e62c` in baseline/Astro/baseline/Astro order, with five cold samples per batch. All **20 samples were conclusive**, using separate uninterrupted paint and stage-1-to-2 interaction navigations. Both artifacts used the same Vite preview transport on Apple M2; Node 25.8.2 and Chromium 147.0.7727.15 ran the unchanged 390 × 844/DPR 3, fourfold CPU, 150 ms/1.6 Mb/s profile. Artifacts were built with Node 22.22.0. [Raw samples, reproduction and artifact hashes](benchmarks/2026-11-11-react-lab/README.md).

| Build | FCP ms, median (range) | LCP ms, median (range) | Initial gzip bytes | Gzip bytes through Next |
| --- | ---: | ---: | ---: | ---: |
| Independent Vite baseline | 508 (496–724) | 508 (496–724) | 126,954 | 126,954 |
| Audited Astro React lab | 430 (416–540) | 470 (452–584) | 96,751 | 96,751 |

The lab transfers **30,203 fewer gzip bytes (23.8%)** through its first successful Next. Its byte count matches the #45 lab measurement; the reselection fix introduces no added runtime dependency. Both paint medians are below the refreshed paired allowance of 608 ms (508 + 100), with more than the protocol's 40 ms repeat margin. The 63,477-byte budget belongs to reading pages; this interactive lab is measured separately. Local script counts include the analytics SDK but exclude the platform-only script absent on loopback. #47 must still measure the exact final production candidate.

## Hosted verification

On 11 November 2026, the authenticated in-app browser inspected [PR #54's preview](https://ai-harness-lab-git-codex-astro-react-lab-dessigs-projects.vercel.app), built from `644e62c`. All 15 catalogue selections and Next-to-step-2 transitions worked at the desktop size and at 390 × 844. The phone checks also verified home → Algorithms track → Heap, saved light theme, one React island, canonical metadata, Back to BFS and Forward to Dijkstra, and unchanged URLs when reselecting the missing/invalid-query Binary Search fallback. The `/algorithms?source=lab-audit&algorithm=leaseQueue#visualizer` and `/patterns?source=lab-audit#offline-mock-lab` entries and refreshes preserved their complete destination query and fragment. The browser error log was empty.

Strict Astro/TypeScript checks, 32 unit/component tests, the independent route/download comparison, both builds and all 68 browser cases passed locally. The implementation also passed the complete container-based [Linux PR workflow](https://github.com/ai-knowledge-hub/ai-harness-lab/actions/runs/43068850032) and Vercel. Evidence-only follow-up changes leave the measured application hashes unchanged and strengthen the redirect assertion to exact URL equality. Production remains on the retained renderer pending #47.

## Review follow-up: verify each rendered frame

The first audit advanced the counter and required a nonempty diagram, which allowed an always-step-zero renderer to pass on both viewports and themes. `tests/fixtures/lab-visual-states.json` now freezes 88 reference diagram fingerprints and their labels from the independent #42 data and renderer at `cc921b2`; source-file SHA-256 hashes are included. CI reads the frozen expectations and never regenerates them from the candidate renderer.

`tests/support/visual-state.js` preserves the visualization subtree's element structure, geometry, fill/stroke attributes, classes and text. It normalises attribute/class order and insignificant whitespace, and excludes role/ARIA metadata. The selected-step counter, code highlight and panel title are outside that subtree. Thus an advancing label or accessible name cannot substitute for a changing diagram. Every step compares its diagram fingerprint with the independently captured state and its panel label with the reference label. Soft diagram assertions report failures across all labs instead of stopping at the first frozen algorithm.

The compact fixture adds no image snapshots, browser matrix, runtime dependency or application-code changes. The review verification first reproduced the old false pass, then checked two temporary renderer mutations: all frames frozen while SVG labels still advance, and rendering the next frame instead of the intended one. The frozen-with-advancing-labels mutation was rejected for all 15 labs on desktop and mobile in both themes; the wrong-next-frame mutation was rejected for all 15 on desktop. The restored normal renderer passed every reference frame. Existing responsive/theme and interaction checks remain in place. This checks rendered HTML/SVG state rather than screenshots or external CSS paint correctness.
