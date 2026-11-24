# Retire the standalone advertiser API guide

24 November 2026 · `codex/remove-chatgpt-ads-api-guide` · based on deployed `main` at `5eeb141`

The curriculum now uses API design for reusable contracts, the ChatGPT Ads case for architecture, and the reporting case for a worked implementation. The standalone advertiser capability catalogue is removed. Current product configuration details link directly to OpenAI’s documentation.

## Removed and retained

Removed `src/content/lessons/chatgpt-ads-apis.mdx`, its dedicated `AdsCapabilities` renderer, the `ads-capabilities` block variant, capability-only CSS and its curriculum download registration. Following the compatibility review, the published `public/references/chatgpt-ads/v1/capabilities.json` remains available as an archived download, with no active article or navigation entry.

Removed the guide from discovery, shared reference navigation, related-guide metadata, the README route list and browser reading loops. Updated the API-design callout and the main ChatGPT Ads article’s former guide link. The three remaining reference-navigation entries use three desktop columns.

The shared download renderer, architecture contracts/examples, reporting examples, reporting demonstrations and local collector/CLI/MCP tools remain: they support the retained case studies. All five published v1.0.0 files, including the API map and README, retain their original bytes and download URLs. The baseline hash checks have no retirement exceptions or replacement hashes.

Historical migration/article fixtures and the original reviewed v3.1 source remain unchanged. `tests/fixtures/api-guide-retirement.json` captures the four changed curriculum routes and the deliberate loss of the now-empty API-design related-reading wrapper. It contains no download overrides. The reviewed-copy validator allows the one required reference change to official documentation.

## Old URLs and validation

`vercel.json` permanently redirects the canonical old URL, trailing-slash URL and `.html` alias to `/learn/system-design/chatgpt-ads#advertiser-controls`. No old article or HTML alias is built. [Vercel configuration redirects](https://vercel.com/docs/routing/redirects/configuration-redirects) apply at hosting time; Astro preview returns 404 for the removed static page. Live redirect behaviour requires a Vercel preview/deployment and has not been tested locally.

The route gate checks that the old page and HTML alias are absent, all three redirect rules land on an existing section, no generated HTML links to the retired page or archived map, the sitemap omits the guide, retained routes match their snapshots, and all five original download hashes match. The browser reading check also requests every published download directly and checks its original hash.

Final compatibility checks passed on Node 22.23.4:

- `pnpm check`: clean Astro/TypeScript diagnostics, 74 unit/component tests and the 18-page production build.
- `pnpm check:routes`: 15 retained baseline routes, 13 eligible sitemap URLs, deliberate retirement, redirect configuration, reviewed prose and all five original download hashes.
- The six Chromium/WebKit no-JavaScript reading checks passed at 320, 768 and 1,440 pixels, including original download hashes.
- The end-to-end static reading check passed: the retired page returns 404 in Astro preview; all five published downloads return HTTP 200 with their original hashes.
- Temporarily appending one byte to each built copy of `capabilities.json` and `README.md` caused the route gate to reject each change. Both generated files were restored in `finally` blocks, all five hashes were rechecked, and the complete route gate passed again.
- `git diff --check`.

Before the compatibility correction, the retirement also passed `pnpm check:authoring`, all 56 site checks, all 28 end-to-end checks and all 11 pilot checks. The correction restores archive bytes and strict hash checks; it does not alter the retained article layouts or navigation.

The desktop three-column reference navigation was also inspected in the local production preview. Full responsive/browser checks retain no-JavaScript reading, keyboard operation and download coverage.

The user has approved pushing this branch for pull-request review. No production deployment has been performed. The two unrelated untracked planning documents are excluded.
