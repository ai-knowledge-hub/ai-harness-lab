# Astro pilot for the ChatGPT Ads guide

The pilot serves `/learn/system-design/chatgpt-ads` from Astro 6.4.8 using `@astrojs/react` 5.0.7 and React 19.2.5. It reuses the typed guide, reader, navigation, styles, and architecture component. Astro renders the page and complete diagram at build time. The walkthrough loads its React code when it becomes visible. A small browser script handles the reading theme and mobile menu.

Astro 6 requires Node 22.12 or later. The pilot CI build uses Node 22. The existing Vite checks continue to run on Node 20. [Astro 6 requirements](https://v6.docs.astro.build/en/install-and-setup/) · [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/)

## Build and preview

```sh
pnpm install --frozen-lockfile
pnpm build:astro-pilot
pnpm preview:astro-pilot --host 127.0.0.1 --port 4174
```

The Vercel build overlays the Astro page and its assets on the Vite build only for the `codex/astro-chatgpt-ads-pilot` preview. Both forms of the guide URL use the Astro HTML in that deployment. Links and reference downloads continue to use the rest of the site on the same host. The Astro page carries `noindex, follow` and the production canonical URL. [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)

## Authoring trial

The baseline's “Make report requests safe to retry” draft generated a second local Astro page when its typed record was placed in `pilot/src/guides/`. The route, section anchor, preview label, metadata, and noindex directive came from that one record. The original workflow touched three files to register the route and add track discovery. The pilot trial demonstrates the routing change. A full migration still needs to derive track discovery and sitemap eligibility from that record.

The pilot route uses Astro's `getStaticPaths` and generates its title, description, and canonical URL from the guide record. Track discovery and the public sitemap still come from the Vite build. The pilot validates the shared catalogue and checks that the pilot guide path agrees with its Astro route. [Baseline authoring trial](harness-migration-baseline.md#guide-authoring) · [Astro static routing](https://v6.docs.astro.build/en/guides/routing/)

## Measurements

To reproduce the comparison, serve the baseline build from port 4173. On the pilot branch, stage the preview with Node 22 and serve the combined output from port 4174.

```sh
VERCEL_ENV=preview VERCEL_GIT_COMMIT_REF=codex/astro-chatgpt-ads-pilot pnpm build:deployment
pnpm preview --host 127.0.0.1 --port 4174
```

Both builds used the baseline's mobile profile and measurement script. The baseline was the Vite output recorded for #42 at `cc921b2`. We served both outputs with Vite preview 7.3.2 on the same Apple M2 and ran two batches of five cold samples per build, alternating builds. Node 25.8.2 and Chromium 147.0.7727.15 were used for the comparison. [Measurement protocol](harness-migration-baseline.md#mobile-measurement)

```sh
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4173 --route /learn/system-design/chatgpt-ads
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4174 --route /learn/system-design/chatgpt-ads
```

| Build | FCP in ms, median (range) | LCP in ms, median (range) | Initial gzip bytes | Gzip bytes through first Next |
| --- | ---: | ---: | ---: | ---: |
| Vite baseline | 506 (488–660) | 506 (488–660) | 126,954 | 126,954 |
| Astro pilot | 474 (452–812) | 474 (452–864) | 2,603 | 68,465 |

The pilot reduced JavaScript through Next by **46.1%**. It exceeded the agreed **63,477-byte** limit by **4,988 bytes**. The React hydration runtime and walkthrough load when the diagram enters the viewport. Both pilot paint medians were within the **618 ms** limit.

## Compatibility and decision

The frozen install and both deployment build modes ran on Node 22.22.0. The preview rehearsal served the Astro guide at both URL forms and preserved the Vite home page. Browser checks covered reading and the complete diagram with JavaScript disabled, mobile contents anchors, linked routes, byte-identical downloads, theme persistence, keyboard navigation, stage changes, and delivery outcomes.

**No-go for the wider migration with this React island.** The guide preserved the tested behavior and reduced first-load JavaScript, but it missed the agreed budget once the reader started using the walkthrough. The pilot also leaves analytics and navigation from the Vite client router outside its scope. Open the wider migration only after a pilot meets the interaction budget and the authoring criteria.
