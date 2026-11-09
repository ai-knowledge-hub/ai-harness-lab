# Practitioner reference slice

Visual thesis: a quiet typographic reference with sparse rules, explicit provenance and progressively disclosed system detail.
Content plan: establish each page's role; show the system or operation; inspect implementation boundaries; continue to the related case or download.
Interaction thesis: retain the staged HTML/SVG diagram, use native disclosures for the orchestrator, and give every page a small context navigation. No decorative motion; native disclosures also work without JavaScript.

Scope: API principles, ChatGPT Ads system, public capabilities and a separate reporting case. Downloads are Harness-owned illustrative contracts and synthetic fixtures, with OpenAI's OpenAPI linked separately. Account access and integration execution remain unverified/planned.

## Verification

- Branch `codex/practitioner-api-cases` starts at updated `dev`, `8eeddbb` (merged PR #18).
- `pnpm check`: 15 unit/component tests; production build renders 14 static routes and 13 indexable sitemap entries. The reporting case remains draft/noindex. Seven synthetic architecture fixtures validate at build time.
- `pnpm test:e2e`: all 14 browser scenarios pass, including existing visualizer/scroll/history regressions, static reading, native orchestrator disclosures, context navigation, deployed reference downloads, hydration and both-theme reflow from 320 to 1440px.
- Visual inspection: desktop dark capability map and expanded orchestrator; mobile light expanded orchestrator. Evidence in ignored `output/playwright/`.
- No credentials, live advertiser requests, media spend or deployment. Account access remains unverified.
