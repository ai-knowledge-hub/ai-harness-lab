# Astro pilot for the ChatGPT Ads guide

This records the completed #44 pilot. #45 replaces its build setup with the
[full Astro site](harness-astro-site.md); the pilot commands now alias that site.
The sections below retain the historical pilot implementation and measurements;
use the full-site report for current build, preview and authoring instructions.

The pilot serves `/learn/system-design/chatgpt-ads` from Astro 6.4.8 using `@astrojs/react` 5.0.7 and React 19.2.5 for build-time rendering. It reuses the typed guide, reader, navigation, styles, and architecture component. The browser receives complete HTML and a small TypeScript module for the walkthrough, reading theme, and mobile menu. It loads no React hydration runtime.

The original React island measured 68,465 gzip bytes through first Next and missed the 63,477-byte gate. On 11 November 2026, the user approved changing #44's React-island requirement to Astro/TypeScript controls. The optimisation keeps content, node positions, connections, and outcomes in the shared React renderer and content records. Astro supplies inert control templates; the script enhances the diagram when it becomes visible. A missing script leaves all 18 nodes, five explanations, and three outcomes readable. [Astro scripts and event handling](https://v6.docs.astro.build/en/guides/client-side-scripts/)

Astro 6 requires Node 22.12 or later. The pilot CI build uses Node 22. The existing Vite checks continue to run on Node 20. [Astro 6 requirements](https://v6.docs.astro.build/en/install-and-setup/) · [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/)

## Build and preview

```sh
pnpm install --frozen-lockfile
pnpm build:astro-pilot
pnpm preview:astro-pilot --host 127.0.0.1 --port 4174
```

`build:astro-pilot` builds the combined site into `dist/`, and `preview:astro-pilot` serves that directory. The home page, tracks, linked guides, and downloads are available on the same origin. `build:astro-page` generates the isolated Astro files in `pilot/dist/` for the staging step and authoring trial; use the combined preview for browsing the site.

The combined builder sets `VITE_ASTRO_PILOT=true` for the Vite build. Incoming track, related-guide, and reference-context links use React Router's `reloadDocument` option for the pilot route, including query strings and fragments. They request the staged Astro document and its `noindex, follow` metadata. The production deployment builder explicitly disables that flag. [React Router document navigation](https://reactrouter.com/api/components/Link#reloaddocument)

The Vercel build selects the combined output only for the `codex/astro-chatgpt-ads-pilot` preview. Both forms of the guide URL use the Astro HTML in that deployment. The Astro page carries the production canonical URL. [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)

To rebuild and run the pilot checks and the existing browser suite against the combined output:

```sh
pnpm test:astro-pilot
```

## Authoring trial

The baseline's “Make report requests safe to retry” draft generated a second local Astro page when its typed record was placed in `pilot/src/guides/`. The route, section anchor, preview label, metadata, and noindex directive came from that one record. The original workflow touched three files to register the route and add track discovery. The pilot trial demonstrates the routing change. A full migration still needs to derive track discovery and sitemap eligibility from that record.

The pilot route uses Astro's `getStaticPaths` and generates its title, description, and canonical URL from the guide record. Track discovery and the public sitemap still come from the Vite build. The pilot validates the shared catalogue and checks that the pilot guide path agrees with its Astro route. [Baseline authoring trial](harness-migration-baseline.md#guide-authoring) · [Astro static routing](https://v6.docs.astro.build/en/guides/routing/)

## Measurements

To reproduce the comparison, serve the baseline build from port 4173. On the pilot branch, stage the preview with Node 22 and serve the combined output from port 4174.

```sh
pnpm build:astro-pilot
pnpm preview:astro-pilot --host 127.0.0.1 --port 4174
```

Both builds used the unchanged baseline mobile profile and measurement script. The baseline was the Vite application recorded for #42 at `cc921b2`, preserved in the baseline checkout at `5c8d173` (the intervening commits only added the benchmark and its documentation). The optimised application is at `bb21aad`. On 11 November 2026, we served both outputs with Vite preview 7.3.2 on the same Apple M2 and ran two batches of five cold samples per build in baseline/Astro/baseline/Astro order. Node 25.8.2 and Chromium 147.0.7727.15 were used for measurement; the artifacts were built with Node 22.22.0. Paint used an untouched navigation, separately from the stage-1-to-2 interaction navigation. All 20 samples were conclusive. [Measurement protocol](harness-migration-baseline.md#mobile-measurement) · [Raw samples and artifact identities](benchmarks/2026-11-11-astro-pilot/README.md)

```sh
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4173 --route /learn/system-design/chatgpt-ads
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4174 --route /learn/system-design/chatgpt-ads
```

| Build | FCP in ms, median (range) | LCP in ms, median (range) | Initial gzip bytes | Gzip bytes through first Next |
| --- | ---: | ---: | ---: | ---: |
| Vite baseline | 494 (488–620) | 494 (488–620) | 126,954 | 126,954 |
| Astro + TypeScript pilot | 458 (448–620) | 458 (448–620) | 1,515 | 1,515 |

The optimised pilot reduced JavaScript through Next by **98.8%**, leaving **61,962 bytes** below the agreed **63,477-byte** limit. The measurement includes the shell/walkthrough module and executable inline theme script. The walkthrough requires no further JavaScript download after entering the viewport. The paint medians pass both the original **618 ms** limit and the stricter **594 ms** limit derived from this paired baseline (494 + 100 ms); neither is within the protocol's 40 ms repeat band. The ranges retain every valid sample, including the 620 ms first-run values.

## Compatibility and decision

The frozen install, type check, and both deployment build modes ran on Node 22.22.0. The preview rehearsal served identical Astro HTML at both URL forms and preserved the Vite home page. All 30 unit/component tests and 18 existing Playwright tests passed. All 31 normal Vite HTML files matched the baseline after normalising the JavaScript filename; sitemap, robots, and downloads matched byte for byte.

`pnpm test:astro-pilot` now runs 16 pilot checks (eight cases at mobile and desktop widths), followed by all 18 existing browser checks against the combined build. Both suites run in PR CI. The pilot checks cover the full reference without JavaScript or with a failed module download, all five stages, all eight adjacent forward/back transitions, stage selection, complete-view return, both disabled boundaries, all three outcomes and edge emphasis, diagram height, theme persistence, keyboard flow, mobile navigation, and overflow. A temporary no-op Next handler made the suite fail at the expected stage-2 assertion; restoring the handler passed.

The preview integration regressions were reproduced before fixing them: a hydrated track link made no document request, and the isolated Astro preview returned 404 after following its home link. The added checks require an actual Astro document response from hydrated track, related-guide, and reference-context links; verify metadata, saved theme, stage controls, reload and browser Back; and follow six internal destinations with JavaScript enabled and disabled. The existing browser suite asserts reader-visible diagram state for either renderer and explicitly expects preview-only noindex metadata. All 18 existing tests also pass on the normal build.

The integration fixes preserve the measured Astro HTML byte for byte (SHA-256 `53665ab64cd561ad1f78350f42191f2166e85b6ab5705255c9b4b44507f9cd3a`) and its browser module, so the recorded 1,515-byte JavaScript result is unchanged. The paired timing results above remain the dated measurements from `bb21aad`.

**Go for the content-page Astro migration in #45 with static rendering and TypeScript controls.** This pilot passes the byte and paint gates, preserves the tested reader behaviour, and demonstrates native routing from one authored record. #45 must complete track discovery, sitemap eligibility, analytics, and navigation parity before production cutover. React-heavy algorithm labs retain their separate integration and performance decision in #46. The original no-go applies to the earlier React-hydrated walkthrough, which remains documented above.
