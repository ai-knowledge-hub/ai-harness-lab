# Harness migration baseline

Captured on 10 November 2026 for [issue #42](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/42). The reference is [dev at `cc921b2`](https://github.com/ai-knowledge-hub/ai-harness-lab/commit/cc921b22699796c92fd30c9d33dcc7cce981f08f), including the control-plane guide changes from PR #39. The `main` head at capture was [`fc1958a`](https://github.com/ai-knowledge-hub/ai-harness-lab/commit/fc1958a27a3095a940b2867e0c3e538fd1f1ad91), with the same source tree. Compare newly added or changed content with the route inventory before cutover.

## Static routes and metadata

The reference build produced 16 pages and 14 sitemap entries. Each canonical URL is the site origin `https://harness.ai-knowledge-hub.org` followed by the path below. Except for home, append ` · Harness · AI Knowledge Hub` to the title in the table. The HTML title, description, and canonical URL also supply `og:title`, `og:description`, and `og:url`. A sitemap entry corresponds to `index, follow`. The two pages without an entry remain directly readable and use `noindex, follow`.

| Path | Title | Sitemap | Description |
| --- | --- | --- | --- |
| `/` | Harness · AI Knowledge Hub | Yes | Practical engineering for building, operating, and evaluating AI products. Explore five tracks, reusable guides, and worked examples. |
| `/examples` | Planned case studies | No | Practical engineering for building, operating, and evaluating AI products. Explore five tracks, reusable guides, and worked examples. |
| `/learn/ai-engineering` | AI Engineering & Harnesses | Yes | Use agents to build and check software, or design the tools and rules that let a running agent do a job. |
| `/learn/ai-engineering/control-plane` | Agent control plane | Yes | Use agents to build and check software, or design the tools and rules that let a running agent do a job. |
| `/learn/ai-engineering/verify-small-code-change` | Verify a small code change with an agent | Yes | Give an agent a bounded repair, check the changed behaviour, and record the evidence before accepting the change. |
| `/learn/algorithms` | Algorithms & Data | Yes | Choose how to find, sort, and check data, then use a small example to see how your approach behaves. |
| `/learn/algorithms/visualizers` | Algorithm visualizers | Yes | Choose how to find, sort, and check data, then use a small example to see how your approach behaves. |
| `/learn/measurement-ml` | Measurement & ML | Yes | Measure whether a change helped, and use that evidence to decide what to try next. |
| `/learn/measurement-ml/attribution-and-lift` | How to compare attributed conversions and lift | Yes | Use a fictional campaign to compare orders credited to ads with the extra orders an experiment estimates the ads caused. |
| `/learn/software-production` | Software & production | Yes | Design work you can retry, inspect, and recover after a failure. |
| `/learn/system-design` | System design | Yes | Map who does what, where data moves, and what each part promises. |
| `/learn/system-design/advertising-platforms` | How advertising platforms work | Yes | See how platforms choose ads, what people see and which results advertisers can measure. |
| `/learn/system-design/api-design` | API design principles | Yes | Define what someone can ask an API to do, who has permission, and how to tell whether the task is finished. |
| `/learn/system-design/chatgpt-ads` | How ChatGPT Ads works | Yes | See how ChatGPT Ads chooses and shows ads, what advertisers can control and what reports can tell you. |
| `/learn/system-design/chatgpt-ads-apis` | ChatGPT Ads APIs for advertisers | Yes | See which ChatGPT Ads tools let you set up ads, send conversion data and read performance reports. |
| `/learn/system-design/chatgpt-ads-reporting` | How to collect ChatGPT Ads reports | No | Request campaign results, check which data you received and show readers what is missing. |

All 16 generated HTML files contained a main heading and the expected canonical and Open Graph metadata. The 15 nested routes had identical flat HTML and directory-index copies. The live site returned the same 14 canonical sitemap entries, and both forms of the sampled API design route served the same canonical URL. The robots file permits crawling and points to the sitemap. [Live sitemap](https://harness.ai-knowledge-hub.org/sitemap.xml) · [Live robots.txt](https://harness.ai-knowledge-hub.org/robots.txt)

## Deep links and interaction

| Entry or action | Behavior to preserve |
| --- | --- |
| `/#tracks` | The track index is a real HTML anchor. Revisiting the anchor after scrolling brings it back into view. |
| `/learn/system-design/api-design#define-the-contract` and `#make-failures-useful` | Section links work with JavaScript disabled, including through the mobile contents disclosure. |
| `/learn/system-design/chatgpt-ads#visual-deep-dive` | The complete map and five stage explanations are available in the initial HTML. The enhanced guide adds the stage controls and delivery outcomes. Keep `#reference-downloads` and `#across-five-tracks` addressable. |
| `/learn/system-design/chatgpt-ads-reporting#complete-retrieval`, `#report-outcomes`, and `#bounded-agent-tool` | Track links open the intended section of the same draft case. Its preview label and noindex policy remain visible in the appropriate surfaces. |
| `/learn/ai-engineering/verify-small-code-change#run-the-skills-example` | The anchor and the guide's link to the offline example remain available. |
| `/learn/algorithms/visualizers?algorithm=tokenBucket#visualizer` | Direct load selects Token Bucket and targets the working area. Missing and unknown IDs select Binary Search. Back restores selection. Switching algorithms preserves the current working position. Reselecting the current algorithm resets playback without adding a history entry. |
| `/algorithms?algorithm=tokenBucket#visualizer` | The client navigates to `/learn/algorithms/visualizers?algorithm=tokenBucket#visualizer`, preserving both query and fragment. |
| `/patterns?source=baseline#offline-mock-lab` | The client navigates to `/learn/ai-engineering/control-plane?source=baseline#offline-mock-lab`, preserving both query and fragment. |

The live legacy URLs returned HTTP 200 with the home HTML before React navigated. Preserve the reader's destination and URL state during migration. The local suite also verified the 15 visualizers, both themes and saved theme selection, mobile reflow, keyboard menu dismissal, guide navigation, and reporting outcomes. [Browser tests](../tests/e2e/smoke.spec.js) · [Reference reporting tests](../tests/e2e/reporting-reference.spec.js)

## Versioned downloads

The five files below were byte-identical in source, build, and the live HTTP 200 responses under `/references/chatgpt-ads/v1/`. The live site returned `text/markdown` for the notes and `application/json` for the four JSON files. The official Ads OpenAPI link points to the provider. [Reference catalog](../src/content/reference-downloads.js)

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `README.md` | 2406 | `b484bfb564d16dead1c6fc0decdfb2280f567982d2569e1683b1b755ab49bd03` |
| `architecture-contracts.schema.json` | 24966 | `97c05e83caa12a1439ccaef6ffbef742c1a6bd2c2a5174576c424ad7d7ad1aea` |
| `architecture-examples.json` | 4397 | `9fe3eea63738865e28523564e68ddad4afd9d1333c3c1176d9729efb5d86e2d0` |
| `capabilities.json` | 3741 | `609629c101e2205bf7ede4280577623c9f6d6c09f6c095f694dc6440e9330d5f` |
| `reporting-examples.json` | 1798 | `f6f20fc7ff873857b45491ab2bf56fe2d2b9b497a0d3264543eb69f7f6957896` |

## Guide authoring

The trial added the small “Make report requests safe to retry” guide to System design in a disposable checkout. It used one paragraph section with the `reuse-the-request-id` anchor, the existing `http-basics` and `api-contracts` concepts, and a related link to `api-design`.

1. Create `src/content/lessons/retry-safe-report-requests.js` with the guide record, `trackId: "system-design"`, `kind: "principle"`, and `publicationStatus: "draft"`.
2. Import the record in `src/content/learning.js` and add it to `learningContent.lessons`. At this point, `pnpm build` failed with `discovery/tracks/system-design: missing primary guide retry-safe-report-requests`.
3. Add a `{ kind: "guide", id: "retry-safe-report-requests", action: "Learn when to retry" }` entry to the System design track's `guides` group in `src/content/discovery.js`. The build then generated the draft route, static section anchor, and track listing with a preview label. The draft had `noindex, follow` and no sitemap entry.
4. Change the guide status to `published` and rebuild. The track link stayed in place, the preview label disappeared, and the canonical URL entered the sitemap with `index, follow`.

A standard guide therefore touches three files today. The pilot should repeat this exercise with one authored record and preserve the deliberate choice of how the guide appears in track discovery. The trial guide exists only in the disposable checkout. [Content validation](../src/content/validate-learning.js) · [Track discovery](../src/content/discovery.js)

## Build and browser checks

- `pnpm install --frozen-lockfile` and `pnpm check` passed locally with Node 25.8.2 and pnpm 10.7.0. Vitest passed 29 tests, and Vite 7.3.2 produced the 16-page build.
- `CI=1 pnpm test:e2e --workers=2` passed all 18 tests against that production build with Playwright 1.59.1.
- The matching [GitHub Browser Smoke run](https://github.com/ai-knowledge-hub/ai-harness-lab/actions/runs/42860380817) stopped before tests. The runner reported that Chromium was unsupported on Ubuntu 26.04 x64. The workflow also omits the build that the preview server needs on a fresh checkout. Track these separately from migration regressions. [Browser Smoke workflow](../.github/workflows/browser-smoke.yml)

## Mobile measurement

Use the built site on localhost with Playwright 1.59.1 and Chromium 147.0.7727.15. This run used Node 25.8.2 on an Apple M2 with macOS 26.6.2. The viewport was 390 × 844 CSS pixels, DPR 3, with mobile and touch emulation. Each navigation used a fresh browser context with cache disabled and service workers blocked. Chromium throttling was set to 4× CPU slowdown, 150 ms latency, 1.6 Mbit/s download, and 750 kbit/s upload. Run five sequential rounds in each of two browser launches, rotating through all four routes per round. [Playwright CDP sessions](https://playwright.dev/docs/api/class-cdpsession)

In the baseline checkout, use the following commands. Leave the preview running while measuring from a second terminal.

```sh
pnpm install --frozen-lockfile
pnpm build
node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort
```

```sh
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4173 > mobile-a.json
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4173 > mobile-b.json
```

For the Astro pilot, run the same guide-only command twice against each preview. This works when the preview serves only the pilot route.

```sh
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4173 --route /learn/system-design/chatgpt-ads
```

Paint and interaction use separate cold navigations. The paint navigation stays at the top of the page without clicks or scrolling. At five seconds from navigation start, the script takes first contentful paint (FCP) and the latest largest contentful paint (LCP) candidate. Any pending image, font, stylesheet, or script request, any incomplete or failed viewport image, loading fonts, or missing paint data makes the sample inconclusive. Pending requests are counted even when their effect on the viewport is unknown. An inconclusive sample has null measurements and reasons in `paintInconclusive`. If any sample is inconclusive, the script prints the results and exits with status 2. Resolve the cause before comparing the two builds. [Largest Contentful Paint specification](https://www.w3.org/TR/largest-contentful-paint/)

In the separate navigation, the script counts JavaScript one second after the load event. The count adds normalized gzip bytes of same-origin script responses, once per URL, and independently gzipped executable inline scripts. For the architecture guide and visualizer, the script scrolls to the component, checks it starts at step 1, clicks **Next**, and checks step 2 in that component before counting cumulative JavaScript. This includes code loaded on first use. The timings reflect the local preview and its transfer encoding.

| Route | FCP in ms, median (range) | LCP in ms, median (range) | Initial gzip bytes | Gzip bytes through first Next |
| --- | ---: | ---: | ---: | ---: |
| `/` | 554 (536–640) | 1284 (1268–1328) | 126,954 | — |
| `/learn/system-design/api-design` | 504 (476–588) | 504 (476–588) | 126,954 | — |
| `/learn/system-design/chatgpt-ads` | 518 (496–616) | 518 (496–616) | 126,954 | 126,954 |
| `/learn/algorithms/visualizers` | 524 (512–552) | 524 (512–552) | 126,954 | 126,954 |

All 40 script measurements returned the same initial JavaScript count. Across the four routes, the two batches' median paint times differed by 4–16 ms. Use medians and keep the sample ranges in the comparison.

## Astro pilot acceptance

- The architecture guide must use **63,477 gzip bytes or fewer** through the first successful stage change. That is a 50% reduction from the 126,954-byte baseline and includes code loaded when the reader reaches the walkthrough.
- Use the same browser, machine, throttle settings, and two batches of five samples for each build. Allow a median FCP or LCP increase of up to the greater of 100 ms or 10% of the baseline median. On the architecture guide, both limits are 618 ms. If a result is within 40 ms of either limit, repeat both builds on the same machine before deciding.
- Repeat the guide authoring trial and compare the files and steps required. Verify the guide without JavaScript, the first interactive stage change, mobile and keyboard operation, and the compatibility cases above. Recheck routes and indexing on the deployed preview before cutover.
