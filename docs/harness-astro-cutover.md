# Astro cutover and rollback · #47

This candidate makes Astro the only website build for local development, Vercel previews and production. It is a draft release change against `dev`; preparing and testing it does not promote production. The existing production domain remains on the previous renderer until a reviewed release reaches `main` or an operator promotes a staged production deployment.

## What is retired

The old `index.html`, whole-site React `App`, client hydration entry, SSR entry, custom Vite prerender builder and environment-selecting deployment script are removed. So are their preview configs and 21 duplicated legacy browser cases. The architecture component now emits complete build-time HTML and inert control templates; its obsolete React effects/state and renderer-selection props are gone. The existing TypeScript walkthrough enhancement owns browser interaction. Its complete no-JavaScript content, labels, links and all stage/outcome behaviours remain covered.

React stays for the interactive lab and build-time reading views under `StaticRouter`. Their authored guide model, 15 algorithm implementations, independent 88-frame oracle and five versioned downloads are preserved. Native `/algorithms` and `/patterns` compatibility documents keep query strings and fragments. The obsolete catch-all rewrite is removed: a nonexistent URL now gets Vercel's 404 instead of serving home with HTTP 200. `cleanUrls` and flat HTML aliases remain.

Preview parity preceded retirement: #53's hosted reading/navigation evidence and #54's desktop/mobile 15-lab audit are recorded in the [site report](harness-astro-site.md#preview-and-release-boundary) and [lab report](harness-react-lab.md#hosted-verification). The exact cleaned candidate is rebuilt and rechecked below; those prior results alone are not the release gate.

## Development and authoring

Use Node 22.23.4+ (verified locally with 22.23.5), pnpm 10.7.0 and the frozen lockfile. `pnpm dev` starts Astro; `pnpm build` validates the reference contracts and builds `dist`; `pnpm preview` serves the complete site. `build:deployment` is an alias for that same build in every environment. Original pilot command aliases remain for existing review instructions.

Add a default-exported `.ts` record satisfying `Guide` under `src/content/lessons/`. The registry discovers it automatically; route generation, discovery, metadata and sitemap share that record. Keep stable IDs, valid track/related IDs and unique section anchors. `index` is reserved. Drafts remain directly readable with `noindex, follow` and no sitemap entry. `pnpm check:authoring` exercises published/draft/invalid records and restores the normal build. See [authoring details](learning-content.md).

Run `pnpm check`, `pnpm check:authoring`, `pnpm check:routes`, `pnpm test:e2e`, `pnpm test:site` and `pnpm exec playwright test --config playwright.pilot.config.js`, in that order. Authoring rebuilds output, so it must finish before browser tests. CI retains the same checks in its preinstalled, version-matched Playwright container: 31 unit tests and 47 browser cases (28 main/desktop/mobile, 11 walkthrough/navigation, eight Chromium/WebKit site checks). The one removed unit test exercised the obsolete React-hydrated controls; actual Astro labels/stage interactions remain in the browser checks. No replacement suite or browser dimension is added.

## Dependency release review

The coordinated supported matrix is Astro 7.4.11, React integration 7.1.8 with its OXC peer 0.156.0, Vite 8.3.8, React Router 7.18.5 and Vitest/coverage 4.1.12. The Astro 7 compiler is checked against the independent text/link/metadata baseline; `compressHTML: true` explicitly retains the former inline spacing. The [official upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/) documents the compiler, whitespace and Vite changes.

This resolves the previously deferred Astro AVIF version match and removes Tinypool with the old test-runner worker stack, without a cross-major transitive override. The refreshed audit has zero critical matches, two high, one moderate and one low. Remaining matches are `jsdom → ws@8.20.0` (test-only WebSocket handling), `coverage-v8 → magicast → source-map-js@1.2.1` (test coverage/source-map processing), and `vite → esbuild@0.27.7` (Windows development-server file access). None ships as a network service: deployment is static, CI uses trusted repository tests and local previews bind to loopback. This is a reachability review, not a claim of zero vulnerabilities. Revisit these version matches before exposing tooling or accepting untrusted test/source-map/WebSocket input. [Registry evidence](reviews/2026-11-11-astro-cutover-dependencies.json).

## Vercel routing, caching and metadata

`vercel.json` explicitly selects Astro, `pnpm build:deployment`, `dist` and clean URLs. There is no wildcard rewrite. Only content-fingerprinted `/_astro/` assets receive `Cache-Control: public, max-age=31536000, immutable`; HTML, sitemap, robots and reference downloads retain normal host revalidation. Do not extend immutable caching to those stable URLs. See [Vercel header configuration](https://vercel.com/docs/project-configuration) and [cache header behaviour](https://vercel.com/docs/caching/cache-control-headers).

The production homepage response captured before cutover was HTTP 200, `text/html; charset=utf-8`, `Cache-Control: public, max-age=0, must-revalidate`, an ETag, HSTS `max-age=63072000`, and `x-vercel-cache: HIT`. No explicit CSP, frame or MIME-sniffing header appeared in that response. This task inventories that existing policy; a strict CSP needs a separate tested nonce/hash and analytics policy. No untested security-header bundle is imposed here.

Hosted candidate checks and measurements are recorded after the candidate deployment completes. Protected preview page inspection can use the already authenticated in-app browser; the Vercel connector currently returns a team-scope 403. Do not infer HTTP status/cache headers or analytics ingestion from a DOM inspection alone.

## Known-good production and release procedure

On 11 November 2026, Vercel's deployment details showed **Ready / Production**, assigned to `harness.ai-knowledge-hub.org`, from `main` commit `a90b4ca6f20ffa8dc912ba8913f7bd7ab343a4fe` (merged #52). Retain this immutable deployment before releasing:

- Deployment ID: `dpl_EfydaxKVeN1tef23B65ZdCH2g5EM`.
- [Deployment details](https://vercel.com/dessigs-projects/ai-harness-lab/EfydaxKVeN1tef23B65ZdCH2g5EM).
- Immutable URL: `https://ai-harness-o05jntawa-dessigs-projects.vercel.app`.
- Team `dessigs-projects`, project `ai-harness-lab`. Reconfirm that it remains a valid rollback candidate immediately before release; do not delete it.

After review, merge to `dev`, then prepare the normal reviewed `dev` → `main` release. Verify CI and the deployment's source SHA, Node support, build command and environment. A `main` push may automatically assign production domains under the existing Git integration. For an operator-controlled release, stage a production deployment without assigning domains (`vercel deploy --prod --skip-domain --scope dessigs-projects`), test that exact production deployment, then promote it. Promoting a preview rebuilds with production variables, so a tested preview is not proof of the production artifact. Do not change protection or retrieve/publish credentials to automate these checks.

Before assigning the production domain, verify direct and site navigation to all retained routes, mobile menu/theme persistence, published and draft robots/canonicals, all 14 sitemap URLs, robots, five download hashes, aliases with query/hash, all 15 lab selections/Next, a refreshed nondefault lab and browser history. Check an unknown route and a missing asset return HTTP 404; `.html` clean-URL redirects resolve correctly. Inspect actual HTML and fingerprinted script/CSS response headers, a repeat cache hit, and one hosted analytics script tagged `@vercel/analytics/astro`. Check SDK requests and console errors; dashboard ingestion requires observation in the owner's analytics account.

Immediately after release, repeat home → track → guide → download, direct/refresh lab query and history, alias query/hash, draft noindex, sitemap/robots, missing URL/asset status, HTML/asset cache headers and analytics delivery on the production domain. Observe real traffic/errors and mobile responsiveness before declaring #47 complete. These post-release checks cannot be marked passed by a draft PR. Close #47 and epic #41 only after their remaining release acceptance criteria are met.

## Rollback trigger and recovery

Roll back immediately if any retained route serves the wrong document/404, the draft becomes indexable, a download hash changes, the lab cannot select/advance/restore a query, hydration replaces the working target, analytics fails across routes, or caching serves stale HTML/missing fingerprinted assets. A repeatable final benchmark gate failure also blocks promotion. Record the affected SHA/URL and symptom; do not weaken the independent oracle to ship.

From the verified project/team, use Vercel's Instant Rollback UI targeting the retained production deployment, or `vercel rollback https://ai-harness-o05jntawa-dessigs-projects.vercel.app --scope dessigs-projects`. This restores the old deployed artifact without needing the retired source in the new branch. Rollback stops automatic production-domain assignment; use an explicitly reviewed promotion to resume it after a fix. See [Instant Rollback](https://vercel.com/docs/instant-rollback).

Repeat the critical production checks after rollback and retain the failed candidate for diagnosis. A source fallback is to revert this cutover change on the release branch and rebuild, but it is slower and is not the immediate rollback plan.
