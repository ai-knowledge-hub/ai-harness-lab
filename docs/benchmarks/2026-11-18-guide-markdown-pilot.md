# Harness Markdown pilot · 18 November 2026

[Issue #77](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/77) uses `main` at `cb45aafc87e9ac482c0207d229a2d07344b2758a` as its baseline. Attribution and Lift moved to Markdown. ChatGPT Ads moved to MDX with the existing walkthrough, orchestrator and downloads. Each guide still has one authored file and uses the shared catalogue for track discovery, routes and indexing.

## Authoring and reader checks

Markdown makes prose, links and table rows directly editable. MDX uses the same prose format around components. Both formats use validated frontmatter and preserve historical fragments through an ordered list of stable section IDs. Reordering sections requires reordering that list as well. Guides with cross-track return actions or other specialized components need their own parity checks before conversion. The [authoring guide](../learning-content.md#markdown-and-mdx-pilot) describes the format.

Both guides matched the current baseline for normalized reading text, link order and existing IDs. The built pages embed or reference the same first-party JavaScript bytes as before, including 2,693 gzip bytes on ChatGPT Ads and 1,470 on Attribution and Lift. The MDX version retains the five-stage static fallback and the stage, keyboard and outcome controls. The Markdown guide retains its table header roles and scrollable table at 320px with JavaScript disabled.

`pnpm check` passed with 32 unit tests. `pnpm check:authoring` exercised published and draft entries, invalid Markdown metadata and section mappings, duplicate paths across formats, and broken references. `pnpm check:routes` verified 16 historical routes, 14 eligible sitemap entries and all five download hashes. The pilot, site and end-to-end Playwright suites passed 50 cases across desktop, mobile, Chromium and WebKit.

## What an agent gets from Markdown

The [experiment script](../../scripts/experiments/check-guide-markdown.mjs) reads the static build, checks that both guides are discoverable from their track and the sitemap, and converts their reading content to Markdown. It removes navigation, scripts, templates and SVG, and resolves the remaining links to absolute addresses. It parses the Markdown to compare headings, link destinations, table values and the walkthrough's text fallback with their HTML equivalents. Both formats exposed the checked content. The Attribution table retained all values. ChatGPT Ads retained 17 distinct reading links, all five walkthrough stage headings and all six orchestrator step labels. A separate synthetic fenced block preserved code indentation. The pilot guides have no fenced blocks of their own.

| Guide | Full HTML bytes (gzip) | Extracted article HTML bytes (gzip) | Markdown bytes (gzip) |
| --- | ---: | ---: | ---: |
| Attribution and Lift | 10,733 (3,359) | 4,977 (2,051) | 3,419 (1,585) |
| ChatGPT Ads | 42,213 (10,051) | 28,638 (7,301) | 17,453 (5,657) |

Markdown was 44–53% smaller than full-page HTML and about 23% smaller than the extracted article HTML after gzip. The extraction comparison used the same reading content and absolute links for both representations. Markdown omits the interactive diagram geometry and explicit table row-header roles.

The experiment served three variants on loopback. HTML-only used the existing URL and sitemap. A linked `.md` alternate was discoverable through both an HTML alternate link and the HTTP `Link` header. The negotiated variant returned Markdown to a client requesting `Accept: text/markdown` and sent `Vary: Accept` for both formats. The Markdown representations pointed back to the canonical HTML URL. A draft remained readable at its HTML URL and had no Markdown alternate, including when the client requested Markdown.

## Decision

Continue the authoring pilot and keep canonical static HTML as the public delivery format. A Markdown alternate is worth testing with clients that can discover or request it. A client that requests Markdown gets a smaller body and can skip HTML extraction. The checked article content is already available to a client that processes HTML. If testing an alternate with real consumers, a linked static file is the simpler starting point for the current build. Negotiation adds cache and hosting behavior to verify. Production crawler uptake, search ranking and model answer quality remain unmeasured.

Reproduce from the pilot checkout with Node 22 and pnpm:

```sh
experiment_prefix=$(mktemp -d)
npm install --prefix "$experiment_prefix" --no-audit --no-fund turndown@7.2.5 turndown-plugin-gfm@1.0.2
pnpm build
node scripts/experiments/check-guide-markdown.mjs "$experiment_prefix"
```
