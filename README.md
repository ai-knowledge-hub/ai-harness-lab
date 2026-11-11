# Harness · AI Knowledge Hub

Harness is the practical engineering companion to [AI Knowledge Hub](https://ai-knowledge-hub.org/). It covers system design, algorithms, software production, measurement, and agent engineering for people building and operating AI products.

The homepage offers five tracks and one featured worked case. System design and Software & production pilot the [new track structure](docs/harness-discovery-prototype.md): a reusable starting method, one recommended next step, and a clear distinction between available examples and future work.

It complements the [publication](https://ai-knowledge-hub.org/) for research and explanations and [Skills](https://skills.ai-knowledge-hub.org/) for reusable capabilities, tools, agents, and plugins.

## Develop and verify

```sh
pnpm install
pnpm dev
pnpm check
pnpm test:e2e
pnpm test:site
```

Use Node 22.23.4 or later. `pnpm check` runs strict TypeScript and Astro template checks, the unit/component suite, and the static Astro build. Browser tests use the built output, so run it before the browser commands. Playwright starts its own previews; install the required engines locally with `pnpm exec playwright install chromium webkit`. CI uses the version-matched official Playwright image with engines and OS libraries preinstalled; see the [CI coverage rationale](docs/harness-astro-site.md#ci-scope-and-cost).

`pnpm build` and `pnpm preview` serve the full Astro site. The earlier `build:astro-pilot` and `preview:astro-pilot` commands remain aliases. `pnpm test:astro-pilot` rebuilds and runs the retained guide checks and browser suite. `pnpm check:routes` verifies the independent route/download baseline; `pnpm check:authoring` checks the single-record authoring workflow. See the [site migration report](docs/harness-astro-site.md) and the [original pilot report](docs/harness-astro-pilot.md).

Use `.ts` for new or migrated typed modules and `.tsx` for React components that use JSX. `pnpm typecheck` checks these files while they coexist with the rest of the JavaScript app.

Run the synthetic ChatGPT Ads reporting experiment locally with `node scripts/chatgpt-ads-reporting-experiment.mjs`. The script, sample data and [experiment notes](docs/chatgpt-ads-reporting-experiment.md) live in the repository, outside the website build.

Run the local collector with `node scripts/collect-chatgpt-ads-report.mjs`. The [collector guide](docs/chatgpt-ads-reporting-collector.md) describes the synthetic scenarios, page limits and report output.

The [local adapter guide](docs/chatgpt-ads-reporting-adapters.md) shows how to read the same synthetic report from the CLI or a local MCP host.

## Routes

| Route | Content |
| --- | --- |
| `/` | Homepage and five-track orientation |
| `/learn/system-design` | System design |
| `/learn/system-design/advertising-platforms` | Advertising-platform overview |
| `/learn/system-design/chatgpt-ads` | ChatGPT Ads system introduction |
| `/learn/system-design/api-design` | Reusable API-design principles |
| `/learn/system-design/chatgpt-ads-apis` | Source-linked public capability map |
| `/learn/system-design/chatgpt-ads-reporting` | Reporting implementation case (preview) |
| `/learn/algorithms` | Algorithms & Data, including the full visualizer index |
| `/learn/software-production` | Software & production |
| `/learn/measurement-ml` | Measurement & ML |
| `/learn/ai-engineering` | AI Engineering & Harnesses |
| `/learn/algorithms/visualizers` | All 15 interactive visualizers |
| `/learn/ai-engineering/control-plane` | Agent control-plane reference pattern |
| `/algorithms`, `/patterns` | Compatibility redirects preserving query strings and anchors |
| `/examples` | Planned case index, available by direct URL |

A direct visualizer link uses `?algorithm=<id>#visualizer`, for example `/learn/algorithms/visualizers?algorithm=tokenBucket#visualizer`. Browser history restores the selected algorithm. The anchor targets the working area, including on phones.

The [React lab integration audit](docs/harness-react-lab.md) records the 15-visualizer baseline and desktop/mobile URL, history, playback and hydration checks. `pnpm exec playwright test tests/e2e/lab.spec.js` runs that focused matrix; the mobile project repeats only lab cases.

## Brand and content

- `src/content/site.js` owns the working identity, family URLs, five tracks, and curated resources.
- `src/layouts/SiteLayout.astro` and `src/components/{Header,Footer,TrackNavigation}.astro` own the shared shell.
- `src/views/TrackPage.jsx` renders each track at build time from that catalogue.
- `styles.css` owns the shared tokens, site shell, homepage, and track layouts. `src/styles/labs.css` retains the existing visualizer and reference-surface rules.
- `src/visualizers/algorithms-data.ts` retains the existing algorithms, code examples, steps, and practical context.
- `public/brand/provenance.json` records the exact copied optical artwork and its source hashes. No sibling checkout is imported at build or runtime.
- `docs/brand-tokens.reference.json` captures the selected shared brand foundation, version 0.1.0.
- [Rebrand implementation and verification](docs/rebrand-2026-11-07.md) records the first slice.

The reading theme defaults to dark. An explicit choice is stored under `harness-theme` and applied before rendering; unavailable browser storage falls back to the default. Artwork is static, text remains semantic HTML, and reduced motion is respected.

## Guide authoring and rendering

See [the content model and authoring guide](docs/learning-content.md) and [the foundation implementation record](docs/learning-foundation-2026-11-07.md). The system-design track separates platform references, reusable API-design principles and implementation cases. A shared context navigation connects the ChatGPT Ads system, public capability map, principles and reporting case. The Christmas article is a supporting case study; the main reference is evergreen. ChatGPT Ads includes a five-stage HTML/SVG architecture walkthrough with documented/reference-design labels, illustrative delivery outcomes, and a complete no-JavaScript fallback. Six native disclosures explain orchestrator responsibilities and distinguish source-backed behaviour from our interpretations. Clearly labelled downloads separate OpenAI’s external OpenAPI specification from Harness mock contracts and synthetic fixtures. The reporting case is a preview. The local collector runs with sample data, and live integration is planned.

`pnpm build` validates content and synthetic architecture fixtures, then uses Astro to generate route-specific HTML, metadata, a sitemap and robots file. Guides can be read without JavaScript. Draft guides remain noindex and are excluded from the sitemap. Only the lab route hydrates a React island; reading pages use the small typed shell and walkthrough scripts.

## Deployment

Vercel preview and production builds both use `pnpm build:deployment` → `pnpm build`, with the explicit Astro preset and `dist` output. Existing documents resolve from the filesystem; unknown routes return 404. Only fingerprinted `/_astro/` assets receive a one-year immutable browser cache. HTML and public reference downloads retain normal revalidation. Local builds do not deploy.

See the [cutover and rollback runbook](docs/harness-astro-cutover.md) for the verified candidate, production deployment to retain, release checks and rollback triggers. The former whole-site React/Vite entry, custom prerender builder and production selector have been retired. React remains the lab island and the build-time renderer for shared reading components.
