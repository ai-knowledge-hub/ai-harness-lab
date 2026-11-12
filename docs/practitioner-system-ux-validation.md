# Practitioner reader-task and compatibility validation

Checked **12 November 2026** for [#63](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/63),
using merged `dev` at `569b15dfd9f4c919aa2bf52d7bfa16ccd851a7ae` (PR #74).
Branch: `feature/reader-task-validation`. This is **expert inspection and scripted browser
validation**. **No participant sessions have run and no reader-comprehension results
have been collected.** The screen-reader walkthrough remains pending in
[#62](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/62), as the user requested.

## Scope and evidence

This repeats T1–T6 from [#57’s neutral protocol](practitioner-system-ux-baseline.md#neutral-reader-task-protocol-for-63)
after #58–#61 and the confirmed fixes in merged #74. The merged base has the same tree
as reviewed `be4456f`; #62’s manual AT evidence is still outstanding. The
[10 November discovery fit check](discovery-fit-check.md) remains dated prior evidence:
T3 now reaches the coding guide added since that check. No sibling source was edited.

The local Astro production build ran at `http://127.0.0.1:4180`, with Node **22.23.5**
and pnpm **10.7.0** using the existing lockfile. Expert task probes used Playwright CLI
**0.1.24 / Chromium 157.0.8103.51**. Repository suites separately use pinned Playwright
**1.59.1**, Chromium and WebKit. Mobile viewports are browser emulation, not physical
phone tests. Local/preview evidence does not identify or verify a production rollout.

## Scripted expert walkthrough

Each task ran at **1440×900, 390×900 and 320×900 CSS pixels**, in dark and light themes,
with reduced-motion media: **36 task/condition observations**, six per task, with no
failed checks. These are prescribed expert paths, not participant first choices,
unaided completion scores, paraphrases or evidence that readers understood the copy.
The table records interface evidence and the interpretation an assessor should test.

| Task | Entry and observed path | Evidence exposed by the interface / interpretation still to test with readers |
| --- | --- | --- |
| **T1 · Roles and orientation** | Direct home, then direct `/learn/system-design/api-design`; inspect shared descriptor and family links; mobile Tracks opens by Enter and Escape returns focus | Harness explains engineering mechanisms. Publication says research for decisions; Skills says reusable resources to adapt. Both canonical destinations remain independent. The same roles are exposed on direct guide entry. Reader explanation of these roles is unmeasured. |
| **T2 · Mechanism without credentials** | `/learn/algorithms` → **Try the top-three campaign lab** → Heap → keyboard Next → Context/Run → Algorithms breadcrumb | Heap reaches step 2/6 and its authored explanation. Track and lab state the JS requirement and no installation/account/API-key requirement. This establishes a working prepared example, not live platform access or proof a reader chose an appropriate algorithm. |
| **T3 · Non-advertising coding task** | Direct `/learn/ai-engineering/verify-small-code-change`; inspect before/after checks, pinned download, local helper explanation and optional Publication link | Reading needs no install. Local example specifies Node 22/release 0.2.0; the helper produces a plan with `merge_authorized` false. Empty and valid input need independent checks on the candidate. The guide does not establish that a proposed repair or live package-service compatibility was verified. No package/helper was executed in this task. |
| **T4 · Partial subtotal** | Direct reporting case at `#report-outcomes`; open **Partial report** with Enter, retaining summary focus | Two received rows total **£30.50**; the full-period spend is unknown. The text retains the original scope, retries the missing batch using its marker, or labels the gap if recovery fails. Missing data is not a complete total or a zero. Actual reader paraphrases and causal interpretations remain uncollected. |
| **T5 · Optional resource and limits** | Direct `/learn/ai-engineering/control-plane` → **Try the offline mock lab** → inspect pinned 0.2.0 manifest and setup/limits | Python 3.9+, Skills repository and Go if building the CLI are separate setup requirements. Installation downloads a release; the subsequent fictional mock is offline. Live reads need separate verification and the release has no live write adapter. A reader may choose a relevant reading resource instead; no companion is mandatory. |
| **T6 · Recovery and ownership** | Legacy Approval query/fragment → Next → Token Bucket → browser Back → Approval → Algorithms breadcrumb → reporting retrieval section → owning-track return | Query/fragment context and Back selection work; a reader can return to the owning engineering track without going through home. The scripted route is one valid path, not the required participant route or evidence of intuitive recovery. |

No new product defect was confirmed by these checks. The application, test inventory,
independent reading snapshot and visual-state oracle are unchanged in this PR.
A rebuild after adding this document produced **52 byte-identical distribution files**,
including **35 HTML files**, compared with the pre-document build.
Screenshot spot checks covered the partial subtotal in both themes at 320px and the
coding plan/setup explanation at 390px. Code remains a labelled local scroll region.
The real attribution/lift guide also remains complete with zero editorial companions.

## Compatibility and selected destinations

| Check | Current evidence and boundary |
| --- | --- |
| Static reading | **27 samples:** nine direct surfaces × three widths, with page JS disabled. Home, AI track, API/coding guides, reporting case, lab, architecture guide, control-plane pattern and attribution/lift render with no unintended document overflow. Default dark theme was observed; the theme enhancement needs JS. Native Tracks toggles with Enter. |
| Static learning fallbacks | Reporting’s partial disclosure opens natively. The architecture retains all 18 nodes/five explanations. The lab shows the default Binary Search reference even on the Approval query, alongside its explicit JS requirement and reading alternative. Query selection/playback require JS. |
| Themes, motion and focus | The 36 task probes cover both themes/reduced motion; existing suites retain manual Play/Pause, slider, Context/Run, guard/focus and native reporting-disclosure checks. This is browser/DOM evidence, not a speech transcript. |
| Zoom | Fresh 320px reflow checks pass. Native 200%/400% Chrome evidence is reused from the [#62 audit](harness-accessible-interactions-audit.md#checked-behavior) on the identical application source; native zoom was not rerun here. Text-only/OS text scaling is unverified. No AT setting was changed in #63. |
| Links, indexing and provenance | Independent comparison preserves **16 retained routes, 14 sitemap entries and five download hashes**, retained prose/links/anchors/metadata and flat aliases. Reporting remains `noindex, follow`, outside the sitemap. The authoring check re-exercises published/draft/invalid/reserved-route policy and restores normal output before browser checks. |
| Browser compatibility | **28 e2e + 9 site + 11 pilot = 48 passing existing cases**, including all 15 labs/every independent frame, legacy/query/history, search/fragments, no-JS reading/downloads, island boundaries and cache recovery. No second permanent matrix or new test case was added. |
| JavaScript budget | The existing five-sample mobile benchmark measured **2,693 gzip bytes through the first successful Next** in every sample, within **63,477 bytes**; all paint samples were conclusive. This is a candidate budget check, not a new paired performance-improvement claim. |

At **20:35 UTC on 12 November**, three selected public pages returned HTTP 200:
[the Code Agent’s Playbook section](https://ai-knowledge-hub.org/library/agent-maintenance-security-harness/#separate-validation-of-a-change-from-evaluation-of-the-maintainer)
(with the fragment present), [Code Maintenance](https://skills.ai-knowledge-hub.org/plugins/engineering/code-maintenance-plugin)
and [the advertising mock package](https://skills.ai-knowledge-hub.org/plugins/marketing/chatgpt-advertising-experiment-plugin).
The [pinned coding archive](https://skills.ai-knowledge-hub.org/artifacts/engineering/code-maintenance-plugin/0.2.0.tar.gz)
returned 200 to **HEAD** as gzip; the [mock manifest](https://skills.ai-knowledge-hub.org/release-manifests/plugins/marketing/chatgpt-advertising-experiment-plugin/0.2.0.yaml)
returned 200 as YAML with version 0.2.0. This checks selected availability, not every
external link, fresh archive integrity, installation or operational compatibility.
The historical helper execution in the #32 record was not repeated or relabelled.

## Pending qualitative pilot

The study is **planned, not recruited or run**. Use the exact neutral T1–T6 prompts in
[#57](practitioner-system-ux-baseline.md#neutral-reader-task-protocol-for-63), one at a time,
without exposing the assessor answers above. Plan **3–5 people spanning coding and
non-coding work**, recording familiarity with reporting, APIs/agents and these sites
separately. Job title/coding ability is not a competence score. Recruitment, contact,
consent and any recording arrangements require separate authorization; none occurred.

| Planned slot (all unfilled) | Context to seek | Proposed order and T1 entry to vary carry-over |
| --- | --- | --- |
| A | Coding work | T3, T6, T1, T2, T4, T5; direct API guide |
| B | Non-coding work | T4, T1, T5, T2, T6, T3; home |
| C | Balance prior knowledge across the first two | T2, T5, T3, T4, T1, T6; AI engineering track |
| D–E, optional | Add a contrasting work context | Rotate another order/entry; record the actual choice |

Allow about 30–40 minutes, breaks and stopping at any time. Participants may use a
comfortable device/theme; record the actual browser, CSS viewport, JS, motion and zoom
settings. Do not ask for credentials, installation, a package run or a live action.
A valid alternative path is acceptable. Offer one neutral prompt before direct help,
and record when help began; time is not a comprehension threshold.

Use #57’s blank observation row. For each attempted task record **first choice, route,
recoveries, wrong expectations, explanation requests/help, completion category and
paraphrased reasoning**, plus the evidence the person used. Code explanations as
correct/partial/incorrect/not elicited with notes. **No rows have been collected**;
none of those fields can be inferred from the scripted expert paths. Retain important
mistaken expectations even if the final click is correct. Report individual anonymous
observations/limits; do not turn this sample’s clicks, timing or views into learning,
causal-improvement, adoption or statistical success claims.

## Commands and readiness

Run on the supported Node 22 engine, in order (authoring runs before browser checks):

```sh
pnpm check
pnpm check:authoring
pnpm check:routes
pnpm test:e2e
pnpm test:site
pnpm exec playwright test --config playwright.pilot.config.js
pnpm preview --ignore-lock --host 127.0.0.1 --port 4180
node scripts/measure-migration-baseline.mjs http://127.0.0.1:4180 --route /learn/system-design/chatgpt-ads
```

`check` passed with **32 unit tests**, zero Astro/TypeScript errors and the 18-page
production build. The remaining gates/results are recorded above. Temporary expert
probe scripts/JSON and screenshots are local artifacts under the task’s temporary
workspace and `output/playwright/ux63-*`; reproduction can use the explicit paths,
actions and required observations in the task/matrix tables, plus the retained suites.

**Technical compatibility checks pass; complete UX validation is still pending.**
There are no new confirmed fixes to ship from #63. The remaining evidence is the
participant pilot and #62’s screen-reader walkthrough. Keep #62 open per the user’s
instruction; do not treat its merged fixes or this record as completed speech testing.
This record does not establish full reader/AT readiness or authorize a release.
It changes no production deployment or sibling site. Any later release decision must
identify the source being released and acknowledge the still-unverified evidence.
