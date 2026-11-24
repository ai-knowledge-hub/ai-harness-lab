# ChatGPT Ads v3.1 implementation review

24 November 2026 · review branch `codex/chatgpt-ads-reviewed-article` · not deployed

## Preview and editorial integrity

Local review URL: [How ChatGPT Ads Works](http://127.0.0.1:4178/learn/system-design/chatgpt-ads). This preview uses the production Astro build and requires the local preview process to remain running.

`tests/fixtures/chatgpt-ads-reviewed-v3.1.md` is byte-identical to the supplied editorial source (SHA-256 `8b5cad89839dde9449e53e06869e997ef67f217f7ef4bcab7da399231eb2c705`). The user-approved selective consolidation joins related paragraphs without changing any words or their order. Three subsequent user-approved editorial cuts remove 47 words: the repeated path-separation statement in section 4, the three repeated outcome definitions after section 5's table, and the repeated reporting-access distinction before the sourced explanation in section 6. No other wording changes accompany those cuts. Questions, key distinctions, examples and the closing principle retain useful short pauses. The existing “The ad experience” heading houses the opening under the site's section-wrapper convention. The seven numbered sections, conclusion, optional lab and source list retain their order and all remaining wording. The supplied subtitle appears in the header. Editorial comments and implementation instructions do not appear in the reading copy.

`scripts/check-chatgpt-reviewed-copy.mjs` compares the independently rendered source against the built article, excluding the new figures, equivalent equation syntax and the retained opening heading. It applies an explicit list of the three approved editorial cuts to the expected text, asserting each occurs exactly once in the unchanged source fixture. It checks all reviewed links and the equations' actual MathML text. The advertiser-guide mention is now a link to the repository's existing `/learn/system-design/chatgpt-ads-apis` route. Internal absolute URLs become equivalent root-relative links; resource anchors retain native downloads.

## Visual inventory

| Visual | Interaction and teaching behaviour | Static fallback |
| --- | --- | --- |
| V1 · evolving intent | Choose each conversation moment, missing history or withdrawn purchase intent. The current message, relevant history and illustrative objective change together. | Four-turn sequence and both alternative branches remain readable. |
| V2 · iterative orchestration | Trace candidate outcomes and step through responsibilities. The LLM hub calls specialised tools; the auction retains admission, selection and pricing authority. Revised queries return to retrieval. Empty and ineligible branches stop early; contextual rejection follows selection. | All five responsibility explanations and a branch summary are available through native disclosures. |
| V3 · independent paths | Change advertising to ready, slow, unavailable or empty. The organic answer stays available in every state. Each path has its own interface output. | Both paths and failure-case explanations render at build time. |
| V4 · two delivery boundaries | Ready/timeout, pass/reject and on-time/late produce four terminal outcomes. Upstream failure disables downstream inputs and labels their retained values irrelevant. Feedback changes immediately without navigation or focus movement. | The reviewed four-outcome table remains, alongside the static lifecycle diagram and explanation. |
| V5 · missing-ad diagnostics | Choose any of eight branches and switch between operational, quality and business questions. Hypothetical evidence and the investigation update together. | All eight branches have native disclosures containing their evidence and all three investigation lenses. |

All figures are explicitly hypothetical teaching models. No private topology, endpoint names, production thresholds, retention design, user records, acknowledgement protocol, impression guarantee or billing inference is introduced. Controls are inserted only after their optional module loads, so failed enhancement leaves complete reading content. Native labels, fieldsets, radio buttons, selects and polite status regions supply keyboard and accessibility semantics. Boundary buttons preserve focus using enforced `aria-disabled` states. Figures stack on narrow screens; equations use labelled, keyboard-accessible regions. No animation is required to understand a state change; reduced-motion styles suppress any inherited motion. No React island is added.

## Evidence verification

The exact three source URLs returned HTTP 200 without changing destination on 24 November 2026. [Machine-readable URL results](benchmarks/2026-11-24-chatgpt-ads-source-check.json) record titles, final URLs and review time. The documentation's Markdown alternatives were also inspected to locate the relevant metric definitions.

| Source | Verified scope and retained limits |
| --- | --- |
| [OpenAI engineering account](https://openai.com/index/building-chatgpt-ad-stack/) | Describes eligible-turn working state, relevant history, conditional personalisation, iterative tools, ANN retrieval, eligibility, auction authority, separate answer generation, neutral preambles, timing boundaries and lifecycle feedback. These descriptions do not disclose full infrastructure, prompts or retention. |
| [Advertiser reporting](https://developers.openai.com/ads/reporting) | CTR is returned as a ratio; `0.025` is displayed as 2.5%. Cost metrics use finalised activity, while recent delivery and conversion metrics have different processing stages. The public reporting contract is distinct from a complete internal decision trace. No other access arrangement is inferred. |
| [Advertiser API overview](https://developers.openai.com/ads/api-overview) | Supports the described campaign, creative and reporting responsibilities. No changing bidding-product catalogue or private tool control is added. |

Arithmetic checks: 250 / 10,000 = 0.025 = 2.5%; £300 / 250 = £1.20. The second quantity remains a calculation from the hypothetical displayed values and is not equated with returned `cpc`. Twelve attributed conversions remain separate from twelve incremental purchases. These are not live account results.

## Compatibility and implementation files

The canonical route, existing published indexing, shared shell and primary track membership are retained. Stable sections include `the-ad-experience`, `orchestrator-detail`, `visual-deep-dive`, `advertiser-controls`, `reference-downloads` and `sources`. Former reporting/optimisation anchors land beside the corresponding new explanations. Historical stage fragments map to independent paths, orchestration, delivery, reporting and the optional lab. Old drawing-only fragments land beside the conceptual paths. The original reading and Markdown-migration fixtures are frozen; the replacement has its own editorial fixture.

The shared contents labels omit a heading's leading numeric prefix because the navigation already supplies its own ordinal. Desktop and mobile navigation therefore display one number per entry while the reviewed body headings retain their original numbers. Fragment targets remain unchanged.

The three architecture downloads and all five existing reference-download hashes remain unchanged. The guide's source list replaces the previous generated source appendix, avoiding duplicate `sources` IDs. Related guides and the existing optional publication companion are retained.

Primary implementation files:

- `src/content/lessons/chatgpt-ads.mdx`: reviewed copy, metadata, integration and historical fragments.
- `src/components/ChatGPTAdsVisual.astro`, `ChatGPTAdsEquation.astro`, `ChatGPTAdsEnhancements.astro`: static figures, native equations and scoped enhancement loading.
- `src/content/chatgpt-ads-models.ts`, `src/scripts/chatgpt-ads-visuals.ts`, `src/styles/chatgpt-ads-visuals.css`: explicit teaching states, local interactions and Harness styling.
- `scripts/check-chatgpt-reviewed-copy.mjs`, `tests/fixtures/chatgpt-ads-reviewed-v3.1.md`, `tests/fixtures/chatgpt-ads-article.json`: independent editorial and rendered-output checks.
- `tests/unit/chatgpt-ads-models.test.js`, `tests/site/chatgpt-ads.spec.js`: priority invariants, all visual branches, accessibility, downloads, responsive rendering and script-budget coverage. Existing site, pilot and end-to-end assertions now target the replacement visuals and preserved navigation.

## Validation and screenshots

All checks ran on Node 22.23.4:

- `pnpm check`: clean Astro/TypeScript diagnostics, 74 unit/component tests and production build passed. The build validated all seven synthetic reference events.
- `pnpm check:authoring`: passed typed, Markdown and MDX published/draft/invalid variants and restored the source before browser tests.
- `pnpm check:routes`: passed the original route and download-hash gates, the new editorial snapshot, independent reviewed-copy comparison and exact MathML checks.
- `pnpm test:site`: all 56 Chromium/WebKit checks passed. The final 20 article-specific checks passed again after the last orchestration and feedback refinements, with no skipped or flaky checks.
- `pnpm test:e2e`: all 28 checks passed; the final delivery-flow assertion also passed after the feedback refinement.
- `pnpm exec playwright test --config playwright.pilot.config.js`: all 11 entry-path, fallback and resource checks passed.
- `git diff --check`: passed.

The measured scripts through the first successful responsibility change total 5,583 gzip bytes in both Chromium and WebKit, below the 63,477-byte gate. No lab island is requested. The eight V4 input combinations satisfy upstream priority; all eight V5 branches are checked through their three investigation lenses. Native keyboard focus, radio/select operation, reduced motion, failed enhancement and JavaScript-disabled reading are covered. The screenshots were inspected at 320, 768 and 1,440 CSS pixels in light/dark themes, including the final mobile disabled-control state.

Sixteen local review screenshots are saved under `output/playwright/chatgpt-ads-reviewed/` (an ignored artifact directory):

- Each of V1–V5: `chatgpt-<intent|orchestration|independence|delivery|diagnostics>-light-1440.png`, the corresponding `light-768.png`, and `dark-320.png`.
- `chatgpt-delivery-controls-mobile.png`: interactive timeout state with downstream inputs disabled and the organic answer retained.
- `screenshots.json` lists the complete inventory. Re-running the article-specific browser checks regenerates equivalent screenshots in the requested Playwright output directory.

## Outstanding review items

No known implementation blockers remain from these checks. The user has approved pushing the review branch and opening a pull request. Production deployment remains subject to explicit approval. No production deployment, live advertiser operation or v1 resource change was performed as part of this implementation.

The separate lab follow-up is confirmed against current files: the auction example contains `winner.bid: 1.2` and `pricing.price: 1.35`, without a complete unit/pricing contract that makes them directly comparable. There is no explicit server-timeout example in the seven current architecture events. `arrival_delta_ms` already has an illustrative, non-provider description; `render_deadline_ms` still warrants clarification in any future lab revision. These observations are recorded for a separately versioned lab change, as requested. The reviewed optional-lab prose already explains that the examples are hypothetical, non-exhaustive and do not define a complete pricing rule.
