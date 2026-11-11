# Astro shell, tracks and guides

> #47 update: the [cutover runbook](harness-astro-cutover.md) supersedes the retained-renderer commands and release boundary below. The old renderer and its duplicate browser run are removed; use Node 22.23.4+ within 22.x and the current README commands. Earlier measurements and verification remain historical evidence.


Implementation for [#45](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/45), following the successful [#44 pilot](harness-astro-pilot.md). Main was updated through [PR #52](https://github.com/ai-knowledge-hub/ai-harness-lab/pull/52) at `a90b4ca` before this branch was created.

## Rendering and authoring

Astro now owns the document, shared header/footer, track navigation, home, tracks, guides, reference routes, sitemap and robots file. The existing React reading components render only at build time inside a static router. Their browser output is ordinary HTML links; navigating from a track or related guide requests the destination Astro document. Reading pages do not load React, React Router or the lab island.

The typed guide catalogue eagerly discovers default exports in `src/content/lessons/*.ts`. Each record supplies its canonical path, metadata, publication state and sections. Existing curated starting paths and cross-track actions remain intact. An unlisted guide automatically joins its primary track's guide, example or reference group according to its kind. Authors can still customise the curated action independently. Validation continues to reject duplicate paths, invalid metadata and unknown relationships.

`pnpm check:authoring` temporarily adds one typed record, builds a published route with an anchor, canonical/OG metadata, track action and sitemap entry, and checks two architecture blocks receive independent templates and IDs. It then verifies draft preview/noindex/sitemap exclusion and build failures for an invalid reference and the reserved guide ID `index`. That ID would make a flat HTML alias collide with its track document; shared validation rejects it in both renderers, and alias creation also refuses to overwrite an existing document. A `finally` block removes the fixture and restores the normal build. The original #42 trial required three files; the standard Astro trial requires one.

The architecture walkthrough shares its server-rendered content and inert control templates with the retained React renderer. A TypeScript enhancement supplies stage/outcome controls. Missing or failed JavaScript leaves all nodes, explanations and sample outcomes readable. Inactive explanations use feature-detected `hidden="until-found"`; `beforematch` synchronises the selected stage and diagram. Browsers without that capability retain all five explanations below the interactive map. Initial and changed explanation fragments reveal and scroll to their stage. Every stage button includes its visible label in its accessible name.

The only hydrated React island is the existing 15-visualizer lab. It hydrates the server-rendered default in place before applying the actual query, keeping the scrolling target connected even when its module arrives late. Query selection, Back, invalid/default IDs, playback, filters and working-position behaviour remain covered by the existing suite. `/algorithms` and `/patterns` preserve query strings and fragments when replacing their compatibility address. Their static fallback content remains readable without JavaScript.

## Run and verify

Use Node 22.23.4 or later within 22.x and the frozen pnpm lockfile:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm check:routes
pnpm check:authoring
pnpm exec playwright install chromium webkit
pnpm exec playwright test --config playwright.pilot.config.js
pnpm test:e2e
pnpm test:site
pnpm preview --host 127.0.0.1 --port 4174
```

Run the authoring check before browser checks because it temporarily rebuilds the output. The former pilot build/preview commands now alias the full Astro site. `src/pages` contains native routes; existing React bodies are in `src/views`. The final build emits 18 document routes: the 16 baseline routes plus the two compatibility addresses. Nested routes retain identical flat `.html` and directory-index copies. Fourteen canonical URLs remain eligible for the sitemap.

Local verification on Node 22.22.0 passed strict TypeScript and Astro diagnostics, 32 unit/component tests, 18 retained browser tests, 11 guide/navigation checks, eight Chromium/WebKit search/accessibility/island checks, and all 18 checks on the retained production renderer. A temporary malformed `GuideSection` passed to the actual `.astro` guide route was rejected with TS2740, confirming template handoffs are checked.

`tests/fixtures/reading-baseline.json` was captured independently from the preserved #42 Vite artifact (`cc921b2`, preserved checkout `5c8d173`), rather than generated from the candidate catalogue. `pnpm check:routes` compares all 16 routes' full no-JavaScript reading text, baseline anchors, exact links, canonical/OG metadata and indexing, plus five SHA-256 download hashes. Text normalisation ignores serialization whitespace and inert templates. The fixture includes the reporting draft and coding-agent guide; the current catalogue is also checked so future records cannot silently omit their route/discovery/indexing. The robots file remains byte-identical to the baseline.

## Performance

The unchanged reviewed #42 script measures home, API design, ChatGPT Ads and the lab against the independent artifact. Paint uses a separate five-second untouched navigation; outstanding rendering assets make a sample inconclusive. Script measurement verifies stage 1 before a successful Next to stage 2. Two alternating batches of five cold samples per build use identical local Vite 7.3.2 transport, Chromium 147.0.7727.15, Node 25.8.2, Apple M2, a 390 × 844 viewport at DPR 3, fourfold CPU throttling, 150 ms latency, 1.6 Mb/s download and 0.75 Mb/s upload. Artifacts were built with Node 22.22.0.

All 80 route samples were conclusive. Each row below aggregates ten samples per build and retains the full valid range. Byte counts were identical in every sample of that route/build. See [raw measurements and artifact identities](benchmarks/2026-11-11-astro-site/README.md), including machine-readable aggregates.

| Route / build | FCP ms, median (range) | LCP ms, median (range) | Initial gzip bytes | Gzip bytes through Next |
| --- | ---: | ---: | ---: | ---: |
| Home · Vite baseline | 540 (520–700) | 1,288 (1,268–1,356) | 126,954 | — |
| Home · Astro | 506 (496–632) | 872 (856–916) | 1,500 | — |
| API design · Vite baseline | 482 (476–504) | 482 (476–504) | 126,954 | — |
| API design · Astro | 456 (440–480) | 456 (440–480) | 1,500 | — |
| ChatGPT Ads · Vite baseline | 502 (480–540) | 502 (480–540) | 126,954 | 126,954 |
| ChatGPT Ads · Astro | 484 (472–504) | 484 (472–504) | 2,726 | 2,726 |
| Lab · Vite baseline | 514 (500–520) | 514 (500–520) | 126,954 | 126,954 |
| Lab · Astro React island | 428 (420–448) | 482 (464–536) | 96,751 | 96,751 |

The Ads guide reduces JavaScript through Next by **97.9%**, leaving **60,751 bytes** below the **63,477-byte** reading limit. Home and API design also meet that limit. The Ads FCP/LCP median is 484 ms, below both the original 618 ms gate and the refreshed paired-baseline gate of 602 ms (502 + 100 ms). Every route meets its paired baseline allowance of the greater of 100 ms or 10%; none is within the 40 ms repeat band. The lab's 96,751-byte island is reported separately: the reading budget does not apply to the lab, whose dedicated integration/performance decision remains #46.

The reading count includes the analytics SDK and executable inline theme script. Loopback previews suppress the Vercel-only analytics request, as they do not have its hosting endpoint. Hosted verification must separately check the platform analytics script; local synthetic timings are not real-user production measurements.

The review follow-up reserves the guide ID `index` and prevents flat-alias overwrites. Its authoring regression first failed on the reviewed head, then passed with shared validation. A direct check of the actual mirror hook also confirmed that a conflicting alias fails without changing the existing track bytes. Rebuilding after the fix preserved every document and JavaScript hash in the measured artifact manifest, so the performance results above remain applicable.

## Preview and release boundary

Vercel previews build the full Astro site. Shared TypeScript controls preserve saved-theme selection, dark default, native mobile disclosure and Escape/focus behaviour. The official analytics SDK is injected once per hosted document with the Astro framework tag and optional public observability configuration. Published guides use their existing `index, follow` metadata through both direct and site navigation. The reporting draft and planned examples page remain directly accessible with `noindex, follow` and no sitemap entry.

Production deliberately retains the compatibility renderer through `pnpm build:legacy`. `pnpm build:deployment` copies that output to `dist` only when `VERCEL_ENV=production`; other builds use Astro. This PR does not authorise production cutover or retire the old entry point. #46 owns the dedicated lab integration/performance audit; #47 owns production cutover, renderer retirement and the hosting-header inventory. The dependency reachability review and remaining version matches are recorded [separately](reviews/2026-11-11-astro-site-dependencies.md).

Hosted verification on 11 November 2026 used the authenticated in-app browser and [PR #53's preview](https://ai-harness-lab-git-codex-astro-shell-tr-ca7ec3-dessigs-projects.vercel.app). Home → System design → ChatGPT Ads → Advertiser APIs reached native Astro documents, with zero reading-page islands and the existing published canonical/robots metadata. Next advanced stage 1 to stage 2. Choosing light mode persisted across guide navigation. The versioned `capabilities.json` URL displayed the expected reference, rather than a fallback page. The reporting draft and `/examples` loaded directly with `noindex, follow`; the hosted sitemap contained the expected 14 canonical URLs and excluded both. Each inspected reading document injected one analytics script with `data-sdkn="@vercel/analytics/astro"`, using the hosting-provided observability path. The guide inspection recorded no warning/error console entries. This verifies SDK integration, not analytics-dashboard ingestion or production traffic.

The frozen install, types, unit tests, Astro build, independent baseline, authoring trial, all browser suites and retained renderer also passed in [Linux PR CI](https://github.com/ai-knowledge-hub/ai-harness-lab/actions/runs/43015225000).

## CI scope and cost

The failed run at `739ff59` stopped in browser installation: the runner could not resolve `azure.archive.ubuntu.com` while downloading Ubuntu packages. No browser tests ran in that job. CI now uses the official `mcr.microsoft.com/playwright:v1.59.1-noble` image, with browsers and OS dependencies preinstalled, matching the exactly pinned Playwright package. It still installs project dependencies from the frozen lockfile. There is no per-run `apt` installation, test-failure retry or ignored failure. The job has a 15-minute limit and newer commits cancel superseded runs. [Official container guidance](https://playwright.dev/docs/ci#via-containers) · [Version matching](https://playwright.dev/docs/docker#image-tags).

One workflow handles pull requests, main pushes and manual runs. The former Browser Smoke workflow repeated the same Astro suite on every main push and has been removed. The authoring trial already restores and builds the normal app, so its output supplies the independent baseline and browser tests without another identical build. The single `astro check` invocation covers TypeScript, TSX and Astro templates; four temporary mutations verified it rejects malformed Binary Search source/registry data, a section passed as a block, and malformed actual Astro route props. No mutation harness is added to the repository. [Astro type checking](https://docs.astro.build/en/guides/typescript/#type-checking).

| Retained check | Distinct outcome protected |
| --- | --- |
| 32 unit/component tests | Content/route validation, typed renderers and local reporting/CLI/MCP contracts; inexpensive checks without a browser |
| Independent artifact comparison | Original reading text, links, anchors, indexing and five download hashes, independent of the candidate catalogue |
| One-record authoring trial | A new guide propagates to routes/discovery/sitemap; drafts, bad references, repeated diagrams and reserved IDs behave correctly |
| 18 Astro browser cases | Existing navigation, all 15 labs, history/scroll/playback, responsive themes, rendered CSS and no-JavaScript references |
| 11 walkthrough/navigation cases | Both diagram widths, all adjacent stage transitions, failed-script fallback, three incoming document-navigation paths, and six outgoing links with JS on/off |
| Eight site cases | Reading/lab isolation and delayed hydration in Chromium; label/search/fragment behaviour in Chromium and WebKit, whose hidden-content support differs |
| 18 retained-renderer browser cases | The still-deployed React/Vite implementation; this second runtime remains necessary until #47 removes it |

The browser total is **55 rather than 60 per full verification**. The five removed repetitions exercised identical native links at a second viewport; the navigation cases remain on mobile, desktop entry remains in the main suite, and diagram/responsive checks retain both widths. The walkthrough also no longer repeats theme/menu/contents assertions already exercised by the main suite against both renderers. Temporary breakages of theme persistence, Escape dismissal and the shared contents anchors were each detected by those retained main-suite tests before removing the duplicate assertions. Its keyboard stage transitions, outcomes and script-failure checks remain. The older main walkthrough case is retained because it checks actual edge opacity, dashed proposal styling, SVG marker targets and reduced motion beyond the pilot's state assertions. WebKit remains restricted to three cases with browser-specific value. The 80-sample performance experiment stays a manual measurement, outside normal CI. Test fixtures and runners are not emitted into the website bundle.
