# First learning journey: foundation slice · 7 November 2026

## Scope

Implements the local-review foundation for [content model #11](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/11) and [reading experience #12](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/12). Branch: `codex/harness-learning-foundation`, from updated `dev` at `f20abb9d70f839b5bf12f024c67aeacfc2681a7e` (merged PR #9).

Visual thesis: retain the selected Op Art/Arial family while giving lessons a calm, solid reading surface, clear hierarchy and a useful contents rail. No new motif, asset, ambient motion or font is introduced.

Content plan: lesson title/context → objectives/prerequisites → principle and contract → reporting semantics/failures → platform context → evaluation questions → publication/Skills/source relationships → planned build/video.

Interaction thesis: ordinary navigable links and stable anchors, native mobile disclosure, saved reading themes, keyboard-accessible wide code, and meaningful HTML without client JavaScript. The existing playback and navigation regressions remain in the browser suite.

## GitHub plan

[Epic #10](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/10) has seven native subissues:

1. [#11 Content model](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/11)
2. [#12 Lesson reader](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/12)
3. [#13 ChatGPT Ads capability and account research](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/13)
4. [#14 Complete lesson and interactive exercise](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/14)
5. [#15 Runnable reporting example](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/15)
6. [#16 CLI/MCP interfaces](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/16)
7. [#17 Publication, Skills and tutorial package](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/17)

ChatGPT Ads is the first planned platform, adapting the owner's proposal around the Christmas pilot article. Google Ads remains a comparison/fallback after capability research.

## Evidence and limitations

The official [Advertiser API overview](https://developers.openai.com/ads/api-overview), [reporting guide](https://developers.openai.com/ads/reporting), and [authentication reference](https://developers.openai.com/ads/api-reference/authentication) were read on 7 November 2026. They describe an advertising API and an account-scoped Advertiser API key. No owner account, feature eligibility or live integration was verified in this slice. A general ChatGPT account does not establish those facts.

The publication's local `chatgpt-ads-christmas-pilot.md` informed the curated commercial context. Its live article URL returned HTTP 200 with the expected title on 7 November 2026. Its attribution-versus-incrementality distinction carries into the teaching questions. Publication files were not edited and their claims were not re-certified.

The API-design page is a draft foundation preview. Its reporting envelope is an explicitly illustrative application contract, not a provider request/response schema or real account data. Full platform research, interactive exercise, connector, agent interface and video remain separate issues. No API calls, credentials, campaign creation, spend, external publication or deployment are part of this implementation.

## Verification

The content model includes negative tests for broken references, duplicate paths/anchors, empty lessons, unsupported blocks, planned-resource links and unsupported verified-account claims. Browser checks cover static/no-JavaScript reading, canonical metadata, noindex/sitemap behaviour, hydration, saved theme, contents navigation and responsive reflow, alongside existing visualizers and review regressions.

Final results:

- `pnpm check`: 12 unit/component tests pass; the client and temporary renderer build successfully, generating 10 HTML routes and 9 indexable sitemap entries. The draft lesson is noindex and excluded from the sitemap.
- `pnpm test:e2e`: all 13 browser scenarios pass against the production preview, including native desktop/mobile contents navigation without JavaScript, saved-theme hydration, page metadata, lesson reflow at five widths in both themes, and all pre-existing visualizer/review regressions.
- Static lesson files and canonical metadata were independently inspected; the temporary renderer is absent from deployment output. Desktop dark/light and phone light captures were inspected under ignored `output/playwright/`.
- The production preview has the expected local-only Vercel Analytics script 404; no React hydration errors were observed in the lesson navigation/theme check. Analytics setup was not changed.
- `git diff --check` passes. Dependencies and lockfile are unchanged. `vercel.json` adds only clean URL handling for generated HTML; nothing was deployed.

The branch remains uncommitted for local review. Issues #11 and #12 stay open pending review/PR; #13 records the separate ChatGPT Ads research and account-readiness work.

## Practitioner positioning follow-up

Public copy now presents Harness as practical how-to guidance: guides, implementation decisions, walkthroughs and reference builds. Navigation and reader labels use Engineering tracks, Practical guides, Guide contents and Use this guide to. Educational framing was removed from the current public copy while retaining technical explanations, source qualifications and real publication titles. Existing routes and internal schema/component names remain stable.

## Test trimming follow-up

Removed three route smoke tests already covered by the browser suite and the authored-content acceptance test already exercised by the build. Visualizer tests now assert selection and changing step state without depending on explanatory prose. The retained 12 unit/component tests, production build, all 13 browser scenarios and `git diff --check` pass.
