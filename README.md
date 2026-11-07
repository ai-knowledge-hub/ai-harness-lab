# Harness · AI Knowledge Hub

Harness is the practical engineering companion to [AI Knowledge Hub](https://ai-knowledge-hub.org/). It connects system design, algorithms, software production, measurement, and agent engineering to marketing, growth, and go-to-market work.

The homepage and five track pages link to the existing interactive visualizers, agent control-plane reference pattern, and selected publication reading. Curriculum outlines distinguish future lessons and builds from available resources. YouTube tutorials and production project walkthroughs are in development.

It complements the [publication](https://ai-knowledge-hub.org/) for research and explanations and [Skills](https://skills.ai-knowledge-hub.org/) for reusable capabilities, tools, agents, and plugins.

## Develop and verify

```sh
pnpm install
pnpm dev
pnpm check
pnpm test:e2e
```

`pnpm check` runs the unit/component suite and production build. Browser tests use the production output, so run it before `pnpm test:e2e`. Playwright starts its own preview on port 4173; install its Chromium browser when needed with `pnpm exec playwright install chromium`.

## Routes

| Route | Content |
| --- | --- |
| `/` | Homepage and five-track orientation |
| `/learn/system-design` | Platforms & System Design |
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
- `styles.css` owns the shared tokens, site shell, homepage, and track layouts. `src/styles/labs.css` retains the existing learning-surface rules.
- `src/visualizers/algorithms-data.js` retains the existing algorithms, code examples, steps, and practical context.
- `public/brand/provenance.json` records the exact copied optical artwork and its source hashes. No sibling checkout is imported at build or runtime.
- `docs/brand-tokens.reference.json` captures the selected shared brand foundation, version 0.1.0.
- [Rebrand implementation and verification](docs/rebrand-2026-11-07.md) records the first slice.

The reading theme defaults to dark. An explicit choice is stored under `harness-theme` and applied before rendering; unavailable browser storage falls back to the default. Artwork is static, text remains semantic HTML, and reduced motion is respected.

## Deployment

This is an existing Vite/React single-page app. `vercel.json` preserves direct access to routes. Build with `pnpm build`; this rebrand does not change hosting or deploy the site.
