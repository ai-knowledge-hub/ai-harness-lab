# Platform reference slice · 7 November 2026

Harness now introduces advertising systems before reporting implementation. The publication supplies optional supporting cases. The existing five tracks and visualizer routes remain canonical.

## Composition and discovery

Visual thesis: quiet Arial reading surfaces, clear section hierarchy and sparse rules within the existing Op Art family. No new imagery, fonts or ambient motion.

Content order: track purpose → advertising-platform overview → ChatGPT Ads introduction → API-design preview → deeper implementation areas. The other four track pages explain their practical scope and their role in the shared ChatGPT Ads workflow before showing supporting references. The homepage's starting points now lead to the platform overview and introduction.

Interaction: ordinary links and contents anchors, native source disclosures, saved themes and keyboard-accessible horizontal scrolling for wide comparisons. Platform diagrams are labelled conceptual models; they do not claim vendor-internal topology.

## Routes and content

- `/learn/system-design/advertising-platforms`: published overview of user experience, delivery, measurement, reporting, platform differences and integration boundaries.
- `/learn/system-design/chatgpt-ads`: published introduction grounded in selected official documentation, with a map across the five tracks.
- `/learn/system-design/api-design`: existing draft/noindex guide, revised around an evergreen reporting contract.

The Christmas publication relationship renders as a labelled supporting case study after the guide body. It no longer defines the core reporting task or planned project. Related guides resolve through stable registry IDs. Inline source references and conditional sections keep introductory pages independent of the API-design template's planned build.

Official introductory sources were reviewed on 7 November 2026: Google Ads overview, Meta's ad-transparency explanation, Amazon Marketing Cloud, TikTok for Business, the DV360 API FAQ, and OpenAI's advertiser experience, API overview, authentication, Insights, reporting and conversion-optimisation documentation. Sources are linked beside specific claims or in the page's source disclosures. This is introductory source review; complete capability dossiers, account verification and live connector behaviour remain separate work.

## Verification

- `pnpm check`: 12 unit/component tests and production build pass. Static rendering emits 12 routes, with 11 indexable sitemap entries; the API-design preview remains excluded.
- Existing browser scenarios were extended for platform discovery, all four cross-track workflow links, supporting-case placement, evergreen guide body, published static HTML and responsive reflow. No additional unit test cases were introduced.
- Desktop light/dark and phone layouts were visually inspected. Wide tables retain readable columns in a labelled, focusable scroll region; a 390px phone has no document overflow.
- `pnpm test:e2e`: all 13 scenarios pass, including the retained visualizer, scrolling and history regressions.
- The preview has the existing local Vercel Analytics script 404; the browser checks found no hydration errors.
- `git diff --check` passes. No dependencies or lockfile changes. Nothing committed, pushed or deployed.

Review captures are under ignored `output/playwright/`.

## Staged architecture follow-up · 8 November 2026

The ChatGPT Ads page now includes a five-stage HTML/SVG decomposition at `#visual-deep-dive`: answer/ad separation, the orchestration loop, delivery checks, reporting, and the proposed Harness integration. Stage controls, Previous/Next and complete view are user-driven. Delivery examples distinguish timely arrival, late arrival and a failed final context check; they are illustrations, not traffic simulations or live results.

The published basis is [OpenAI's engineering account](https://openai.com/index/building-chatgpt-ad-stack/), alongside its [reporting reference](https://developers.openai.com/ads/reporting), reviewed on 8 November. Solid nodes identify documented responsibilities. Dashed nodes identify the proposed worker and evidence store. Provenance is explicit in node data and independent of stage placement. Layout, grouping and implementation implications are our explanatory choices. No internal logs-to-Insights pipeline or vendor storage/deployment topology is asserted.

Visual thesis: retain quiet reading surfaces and neutral, labelled component boxes. Interaction thesis: progressively add components, fade new elements briefly and highlight illustrative delivery branches. Reduced motion removes the reveal animation. The 800px logical diagram scrolls within its labelled, keyboard-focusable region on narrow screens; narrative and controls reflow normally.

Static HTML includes the full diagram, every stage explanation and all delivery outcomes. The hydrated version adds controls. Content-derived DOM/SVG IDs avoid server/client routing-tree differences: a focused browser check reproduced dangling marker references before the correction and verifies every rendered connector now resolves.

Verification: 12 unit/component tests, production build and all 14 browser scenarios pass. The existing static-reading case now checks the complete diagram without JavaScript; one new browser scenario covers stage transitions, keyboard selection, explicit proposed labels, outcome changes, complete/staged round trips, reduced motion and 320px document overflow. The existing guide navigation check also monitors hydration errors. Desktop dark/light and mobile light captures were inspected under ignored `output/playwright/`. The preview still has its expected local Vercel Analytics 404.

No dependencies, credentials, API calls, commits, pushes or deployment were introduced. The user's development server remains untouched.

### Local-review correction: late delivery versus rejection

The delivery examples previously shared a boolean that dimmed the bundle path for both late arrival and context rejection. An extension of the existing browser scenario reproduced the error before the fix: the late-arrival bundle edge had opacity 0.18 instead of 1. The map now separates the final context check from frontend timing. Rejection stops before the bundle, while a late bundle can reach the frontend and remain undisplayed. Each outcome has its own highlighted path and explanation; neither is counted as an impression.

The existing scenario checks the rendered branch styling for timely, late and rejected outcomes. All 12 unit/component tests, production build, 14 browser scenarios and `git diff --check` pass. Late and rejected branches were visually inspected on the owner's running local development site. No additional test cases or dependencies were introduced; changes remain uncommitted.
