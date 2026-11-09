# Harness · AI Knowledge Hub

Harness is the practical engineering companion to [AI Knowledge Hub](https://ai-knowledge-hub.org/). It connects system design, algorithms, software production, measurement, and agent engineering to marketing, growth, and go-to-market work.

The homepage and five track pages link to the existing interactive visualizers, agent control-plane reference pattern, and selected publication reading. Track outlines distinguish planned implementation guides and builds from available resources. YouTube walkthroughs and production project examples are in development.

It complements the [publication](https://ai-knowledge-hub.org/) for research and explanations and [Skills](https://skills.ai-knowledge-hub.org/) for reusable capabilities, tools, agents, and plugins.

## Develop and verify

```sh
pnpm install
pnpm dev
pnpm check
pnpm test:e2e
```

`pnpm check` runs the unit/component suite and production build. Browser tests use the production output, so run it before `pnpm test:e2e`. Playwright starts its own preview on port 4173; install its Chromium browser when needed with `pnpm exec playwright install chromium`.

Run the synthetic ChatGPT Ads reporting experiment locally with `node scripts/chatgpt-ads-reporting-experiment.mjs`. The script, sample data and [experiment notes](docs/chatgpt-ads-reporting-experiment.md) live in the repository, outside the website build.

Run the local collector with `node scripts/collect-chatgpt-ads-report.mjs`. The [collector guide](docs/chatgpt-ads-reporting-collector.md) describes the synthetic scenarios, page limits and report output.

## Routes

| Route | Content |
| --- | --- |
| `/` | Homepage and five-track orientation |
| `/learn/system-design` | Platforms & System Design |
| `/learn/system-design/advertising-platforms` | Advertising-platform overview |
| `/learn/system-design/chatgpt-ads` | ChatGPT Ads system introduction |
| `/learn/system-design/api-design` | Reusable API-design principles |
| `/learn/system-design/chatgpt-ads-apis` | Source-linked public capability map |
| `/learn/system-design/chatgpt-ads-reporting` | Reporting implementation case (preview) |
| `/learn/algorithms` | Algorithms & Data, including the full visualizer index |
| `/learn/software-production` | Software Design & Production |
| `/learn/measurement-ml` | Measurement & ML |
| `/learn/ai-engineering` | AI Engineering & Harnesses |
| `/learn/algorithms/visualizers` | All 15 interactive visualizers |
| `/learn/ai-engineering/control-plane` | Agent control-plane reference pattern |
| `/algorithms`, `/patterns` | Compatibility redirects preserving query strings and anchors |
| `/examples` | Retained planned case-study page |

A direct visualizer link uses `?algorithm=<id>#visualizer`, for example `/learn/algorithms/visualizers?algorithm=tokenBucket#visualizer`. Browser history restores the selected algorithm. The anchor targets the working area, including on phones.

## Brand and content

- `src/content/site.js` owns the working identity, family URLs, five tracks, and curated resources.
- `src/pages/TrackPage.jsx` renders each track from that catalogue.
- `styles.css` owns the shared tokens, site shell, homepage, and track layouts. `src/styles/labs.css` retains the existing visualizer and reference-surface rules.
- `src/visualizers/algorithms-data.js` retains the existing algorithms, code examples, steps, and practical context.
- `public/brand/provenance.json` records the exact copied optical artwork and its source hashes. No sibling checkout is imported at build or runtime.
- `docs/brand-tokens.reference.json` captures the selected shared brand foundation, version 0.1.0.
- [Rebrand implementation and verification](docs/rebrand-2026-11-07.md) records the first slice.

The reading theme defaults to dark. An explicit choice is stored under `harness-theme` and applied before rendering; unavailable browser storage falls back to the default. Artwork is static, text remains semantic HTML, and reduced motion is respected.

## Guide authoring and rendering

See [the content model and authoring guide](docs/learning-content.md) and [the foundation implementation record](docs/learning-foundation-2026-11-07.md). The system-design track separates platform references, reusable API-design principles and implementation cases. A shared context navigation connects the ChatGPT Ads system, public capability map, principles and reporting case. The Christmas article is a supporting case study; the main reference is evergreen. ChatGPT Ads includes a five-stage HTML/SVG architecture walkthrough with documented/reference-design labels, illustrative delivery outcomes, and a complete no-JavaScript fallback. Six native disclosures explain orchestrator responsibilities and distinguish source-backed behaviour from our interpretations. Clearly labelled downloads separate OpenAI’s external OpenAPI specification from Harness mock contracts and synthetic fixtures. The reporting case is a preview; a runnable connector and live integration remain planned.

`pnpm build` validates content and synthetic architecture fixtures, then generates route-specific HTML, metadata, a sitemap and robots file. Guides can be read without JavaScript. Draft guides remain noindex and are excluded from the sitemap. The existing React application hydrates matching pages and retains interactive visualizers.

## Deployment

This is a Vite/React static site with a client navigation fallback. `vercel.json` preserves direct route access; generated static files take precedence. Build with `pnpm build`. No deployment is performed by the local build.
