# Practitioner UX baseline and reader-task protocol

Checked **12 November 2026** for [#57](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/57), before implementing [#55](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/55)'s next changes. This is repository inspection and an expert browser walkthrough. **No participant study has run.** Existing task paths work; the next slice should improve direct-entry orientation without rebuilding them.

## Target, ownership and evidence

- **Source:** merged `main` at `6e3906a6dd03102f827c575613491b9599bf7e83` (PR #68). Branch `feature/practitioner-ux-baseline` starts there. The documentation candidate targets `dev`, preserving the reviewed `dev` → `main` release flow; its ancestry also brings the already-released #68 maintenance changes back to `dev`.
- **Renderer:** Astro 7.4.11 generates static pages. React 19 renders reading views at build time; only `/learn/algorithms/visualizers` hydrates React. The architecture walkthrough uses the shared HTML plus TypeScript enhancement. There is no whole-site React Router navigation or Vite rendering selector.
- **Runtime:** repository checks use Node 22.23.5, pnpm 10.7.0 and the existing lockfile. The supported engine is Node 22.23.4+ within 22.x. This contributor requirement is separate from the requirements of a versioned external sample.
- **Local browser evidence:** the built `dist` served at `http://127.0.0.1:4180`, inspected with temporary Playwright CLI 0.1.24 / Chromium 157.0.8103.39. CLI tooling and diagnostics were kept outside the application dependencies and CI. Existing repository browser suites separately use pinned Playwright 1.59.1, Chromium and WebKit.
- **Hosted evidence:** public GETs and deployment identity were checked after #68. Production deployment [`9EwJPjuWFCAUHfwmmdCFYBNHkNPJ`](https://vercel.com/dessigs-projects/ai-harness-lab/9EwJPjuWFCAUHfwmmdCFYBNHkNPJ) is Ready and assigned to `harness.ai-knowledge-hub.org`; GitHub's Production deployment `7730150430` identifies the same source SHA. Existing and fresh missing Astro assets now revalidate. [#47's closure record](https://github.com/ai-knowledge-hub/ai-harness-lab/issues/47) and [the cutover follow-up](harness-astro-cutover.md#live-recovery-policy-verification--12-november-2026) contain the observations. These HTTP checks do not establish hosted reader understanding or repeat the whole live browser audit.
- **Prior evidence:** [the #32 discovery fit check](discovery-fit-check.md) is a dated expert walkthrough of the earlier renderer. Its suggestions are not current failures. In particular, the small-code-change guide and its direct Publication/Skills links now exist. The [15-lab integration record](harness-react-lab.md) and independent visual-state oracle remain owned by completed #46; this task reuses them.

Migration #41 and #42–#47 are delivered; #68 is merged and the cache follow-up is verified. #57 does not reopen the migration, replace its shell, alter production policy, or authorize a release. Reporting research/live operation remains with #10/#13–#16; video remains with #56/#17. Publication owns shared family wording and destinations. Harness owns its local explanations, prerequisites and relationship data; sibling sources were not edited.

| Current owner | Responsibility for the next issues |
| --- | --- |
| `src/content/site.js`; `src/components/Header.astro`, `Footer.astro`, `TrackNavigation.astro`; `src/layouts/SiteLayout.astro`; `src/scripts/shell.ts` | Local identity, canonical family destinations, native navigation and theme. #58 should extend these owners. |
| `src/content/discovery.js`, `learning.js`, `guides.ts`, `lessons/*.ts`; `src/views/TrackPage.jsx`, `LessonPage.tsx` | Five starting methods, guide objectives/prerequisites, availability and optional companions. #59/#60 reuse these collections and conditional sections. |
| `src/views/AlgorithmLabPage.tsx`, `PatternsPage.jsx`; `src/components/AlgorithmLabIsland.tsx`, `Architecture.astro`; `src/scripts/architecture.ts` | Lab controls, reference pattern, build-time reading and guide enhancement. #62 owns confirmed interaction/accessibility follow-ups. |
| Root `styles.css`; `src/styles/{labs,lessons,ads-architecture}.css` | Shared geometry and reading/diagram reflow. #61 investigates measured states, coordinating shell changes with #58. |

The earlier `src/App.jsx`, `src/pages/*Page.jsx` and `src/styles.css` references are not the current shell/view/style owners. Astro route files under `src/pages/` remain active.

## Route and content audit

All twelve routes below were inspected directly on the built output. Each identifies **AI Knowledge Hub / Harness** in the masthead and exposes Publication and Skills in desktop navigation, the mobile Tracks disclosure and the footer, using `https://ai-knowledge-hub.org` and `https://skills.ai-knowledge-hub.org`. The footer says “Practical engineering for AI products.” The home family section explains the two other sites' jobs; the shared shell supplies their names without those explanations. This is an observable placement difference, not proof that readers misunderstand it.

| Checked route | Task, prerequisites and available action | Companion/status evidence |
| --- | --- | --- |
| `/` | “Build and operate AI products”; guides, labs and worked examples; choose a track or featured case. No installation/persona gate. | Descriptive Publication/Skills family section. Featured reporting case says Preview. |
| `/learn/system-design` | “Map the system before choosing components”; actors, boundaries and useful result; **Read API design principles**. | Platform/API references and reporting case are available. No local runtime stated or needed for reading. |
| `/learn/algorithms` | Name the operation and limits, try a small example; **Try the top-three campaign lab** (Heap). All 15 visualizer links are grouped by operation. | Reporting section and Deterministic Core reference are optional. Browser interaction requirement is not stated next to the recommended lab action. |
| `/learn/software-production` | Ownership, safe retries, completed results; **Explore the lease queue lab**. Separate collector action says **Run locally · Sample data**, checkout + Node 20+, no account. | A pinned collector document owns those sample instructions. Future durable service is text under In development, without a run link. |
| `/learn/measurement-ml` | Name a decision, outcome and comparison; **Compare credited conversions and lift**. | Reporting interpretation, geographic-experiment research and prototype write-up. Forecast/allocation work is In development, without working-looking actions. |
| `/learn/ai-engineering` | Distinguishes using a coding agent from designing a running agent's system; **Verify a small code change with an agent**. | Approval lab, control-plane pattern and Skills resources are available. This fixes the missing-guide/link observation in #32. |
| `/learn/system-design/api-design` | Defines API and HTTP in ordinary language, objectives and **Before you start**; explicitly no account/API key to read. | Read guides in any order; related reading and case are optional. Breadcrumb/sidebar recover to System design. |
| `/learn/ai-engineering/verify-small-code-change` | Non-advertising installer example; empty + valid input, independent checks, record limits; no account to read. | Node 22 + pinned Skills 0.2.0 helper; output is a **plan**, `merge_authorized: false`. Proposed `go test` is not an observed repair result. Playbook and package links are already present. |
| `/learn/system-design/chatgpt-ads-reporting` | Objectives, explained HTTP, no account to read. Introduction says fictional collector and live setup in development. Cross-track links and returns are available. | **Guide preview**, `noindex, follow`, absent from sitemap. Prepared examples say Fictional data. Local collector/CLI/MCP have run-instruction links; live account is Planned build without a link. Video is planned and written guidance independent. |
| `/learn/algorithms/visualizers?algorithm=approval#visualizer` | With JS, selects Approval State Machine; Next changes step and explanation. Run/Context, Play/Pause, Reset and Speed are present. No credentials or install required to inspect. | Breadcrumb goes to Algorithms & Data; related essays state a reason. Without JS the server's Binary Search example and inactive controls remain, without a JS requirement or clearly identified static alternative (F2 below). |
| `/learn/ai-engineering/control-plane` | Identity, gateway, policy, inspection and audit reference; owning-track breadcrumb. The offline mock section states Python 3.9+, Skills checkout, Go if building its CLI, and pinned plugin 0.2.0. | Source article + Skills manifest/catalogue/repository are contextual. Installation downloads the release; the subsequent mock is fictional/offline. Live read needs separate verification; no live write adapter. Separate Harness sample is identified. |
| `/learn/system-design/chatgpt-ads` | No account to read; five-stage explanation, manual controls and native disclosures. | Source-backed, illustrative and proposed-build labels remain distinct. Complete diagram/prose exists without JS; references/downloads do not depend on an account. |

Companions are not a completion requirement. `LessonPage.tsx` conditionally renders related reading, guides and capability sections only when populated. This source inspection is not a rendered all-empty-companion fixture or a fresh verification of external packages. #60 should exercise an absent-companion example and check selected external URLs, fragments and readiness at implementation time. No cross-site crawler was added here.

## Compatibility observations and limits

For reproducibility, build the exact source, run `pnpm preview --ignore-lock --host 127.0.0.1 --port 4180`, then enter each route above directly. Inspect `document.documentElement.clientWidth` and `.scrollWidth` after the selected lab heading appears; the nondefault lab initially shares the server-rendered default until hydration. Switch themes with the real toggle. For menu states, open Tracks, measure, press Escape and check focus returns to its summary. Read-only geometry checks do not substitute for inspecting content or focus.

| Local check | Observed result / boundary |
| --- | --- |
| 12 routes × dark/light × 320, 390, 1440 CSS px; height 900 | **72/72** closed-menu samples had equal client/scroll widths (320/320, 390/390, 1440/1440). No unintended document overflow reproduced. |
| Same routes/themes, menu open at 320/390 | **48/48** equal widths; Escape closed menu and focused its summary. Native disclosure also opens with JS disabled. |
| 1280px reference desktop reduced to 640 and 320 CSS px, light theme | **24/24** equal widths. These are **200%/400% zoom-equivalent reflow widths**, not measurements of native browser zoom, text enlargement or OS text scaling. Those remain targeted checks for #61; do not label them passed from these dimensions. |
| Reporting's five native example disclosures + complete architecture diagram, 320/390, light/reduced motion | **12/12** equal widths after expansion. £30.50 partial subtotal prose is readable in the 320px view. |
| Approval and Token Bucket after Next, 320px, both themes | **4/4** samples remain 320/320 at step 2 of 6. Full independent rendered-state coverage for all 15 labs remains in the existing lab suite. |
| JS disabled, 390 × 844 | All twelve page headings, reading text, shell links and native Tracks disclosures render. Reporting's Partial report disclosure opens and explains the missing batch/subtotal. Lab query selection/playback do not operate; see F2. Existing smoke/pilot tests also cover static guide contents, downloads and complete architecture fallback. |
| Keyboard activation, 390px, light | First Tab reaches visible Skip to content (2px outline); Enter focuses `main-content`. Tracks → AI engineering works. Approval Next produces step 2/6, “Approval required”, retaining button focus; Context opens; Run/Reset/Play/Pause/Speed activate from keyboard (range changes 1050→1051). This checks these paths, not every sequential focus stop or assistive-technology announcement. |
| Reduced motion, 390px | Token Bucket remains manually step-able (2/6); Play is available rather than autoplaying. Architecture Next reaches stage 2/5; document scroll behaviour is `auto`. Existing suite checks reduced-motion architecture animation rules. |
| Visual spot checks | Local screenshots inspected for API guide at 1440px and partial reporting/Token Bucket at 320px. Screenshots/temporary diagnostic scripts are excluded from the PR and CI. |

The body's `min-width: 320px` is not evidence of a defect at 320px. No CSS change is justified by the sampled dimensions. #61 should retain this negative result and check actual zoom/text scaling and any changed shell geometry before closing its remaining scope. Local scroll regions can still have keyboard/readability problems despite zero document overflow.

**Not performed:** a new hosted UX walkthrough, native browser zoom or OS text-scale check, physical-device testing, screen-reader speech/reading-order walkthrough, contrast certification or participant study. #62 retains screen-reader and announcement checks; #63 retains reader evidence. Neither DOM snapshots nor a green test run establishes WCAG conformance or practitioner comprehension.

## Findings and follow-up ownership

| ID / evidence class | Observation and repeatable check | Owner / smallest next action |
| --- | --- | --- |
| F1 · confirmed content placement | Direct-load API guide, reporting case, lab or track. Masthead names Harness; family nav says Publication/Skills. Their task descriptions are on home, while the shared footer's local description is broad. | **#58 next:** concise local descriptor and accessible family-role orientation on direct entry, reusing `site.js` and the existing shell. Preserve canonical destinations, optical artwork, five tracks, static reading and independent items. Do not add a gate or funnel. Whether readers need more than this is a #63 question. |
| F2 · confirmed missing requirement notice | Disable JS, load the approval URL above: heading inside `#visualizer` is Binary Search; control UI remains and no main-content JS requirement is stated. `AlgorithmLabPage.tsx`/`LabPage.astro` contain no such notice. Enabling JS restores query selection and controls. | **#62:** communicate the interactive requirement and a useful reading alternative; coordinate action-level wording with **#59**. Retain expected default SSR/hydration and all 15 state contracts. This is an inherited affordance gap, not a claim that the Astro migration broke JS-disabled interactive playback. |
| P1 · existing success to preserve | Every track has a method and recommended action; guides explain access; reporting separates fictional sample, missing data and planned live work; the coding helper is explicitly a plan. | **#59:** audit the action/requirements pairing, adding only missing information. Do not reimplement #25–#32 or mistake pinned external-sample runtimes for this app's contributor engine. |
| P2 · existing success / bounded follow-up | Companion relevance prose and conditional sections already exist; family links are independent. Current link placement is not proof of a working live account/package. | **#60:** selected destination/fragment/readiness verification and empty-companion rendering. No confirmed broken external destination is claimed by this audit. |
| H1 · overflow hypothesis not reproduced | All dimensions above match. No offending document-overflow element was found in these states. | **#61:** retain the result; check native zoom/text scaling and changed states before choosing a patch. Do not remove minimum width or hide overflow speculatively. |
| H2 · comprehension / AT evidence pending | There are no participant observations, screen-reader results or measured live-announcement usability in this record. | **#62/#63:** gather the specifically missing evidence; do not convert expert completion into reader success. |

## Neutral reader-task protocol for #63

Plan a **3–5-person qualitative pilot**, spanning coding and non-coding work. Record familiarity with ad reporting, APIs/agents and these sites separately; do not treat job title or ability to code as a competence score. Recruitment, contact and recording arrangements need separate authorization. None were initiated here. If participants are unavailable, record the study as pending and run the expert compatibility checks separately.

Use the same six task IDs before/after changes. Record exact source SHA, deployed URL/environment when applicable, browser/device, viewport, theme, JS/motion/zoom settings, entry route and task order. Rotate starting surfaces and task order across participants to limit carry-over from home. Do not require a three-site journey. Supply one prompt at a time without the assessor's expected answer or a prescribed path; ask “What would you do next?” or “What does this tell you?” rather than pointing at a link. Do not ask anyone to provide credentials, install a package or run a live action to complete this study.

| ID / starting surface | Prompt shown to reader | Assessor-only evidence of understanding (not shown as hints) |
| --- | --- | --- |
| T1 · direct API guide; vary home/track entry across readers | “You landed here from a shared link. What is this site useful for? If you wanted background evidence or something reusable to adapt, where would you look, and why?” | Identifies Harness's mechanism/implementation role, Publication's research/context/decision role and Skills' reusable-resource role. Explains the choice in their words; no requirement to visit every site. Record any inference that all three are mandatory. |
| T2 · Algorithms & data track | “You receive campaign records one at a time and can keep only the best three. Find something here that helps you inspect how that works. What would you need to try it?” | A suitable mechanism (the curated Heap path is one), relevant explanation and changed step; browser JS, no provider credentials or local install for the lab. Accept a justified alternative; record attempts and recovery instead of insisting on a particular click sequence. |
| T3 · direct small-code-change guide | “You want an agent to fix an installer that accepts an empty package name. What can you learn here, what could you try locally, and what would convince you the repair worked?” | Distinguishes reading from Node 22/pinned 0.2.0 local helper. Helper prints a plan; suggested `go test`/`merge_authorized: false` is not observed repair evidence. Looks for empty and valid-input checks on the candidate, and identifies unverified live compatibility. |
| T4 · reporting case, `#report-outcomes` | “A colleague wants the spend for the full period. Look at the partial example and explain what you can tell them, what is unknown and what you would do next.” | £30.50 covers the two received rows only; missing batch means unknown full total. Preserve scope, retry/recover the missing batch or label partial. Missing values are not zero; completeness/freshness/attribution do not establish causal lift. Do not prime these distinctions in the prompt. |
| T5 · direct control-plane pattern | “Find one resource that could help you investigate or try this further. Why that one? What does it provide, what would it require and what would still need checking?” | Chooses an optional, relevant resource and explains its limits. For mock: pinned 0.2.0, Python/Skills setup (Go if building CLI), download needs network then fictional offline run, no verified live read/write. For reading: context is not a runnable integration. Do not force a Skills choice or package installation. |
| T6 · reporting cross-track section or direct lab | “Continue exploring the engineering area this belongs to without starting over at the homepage. Show where you would go and explain your choice.” | Finds the owning track breadcrumb/section return (lab → Algorithms & Data; reporting primary → System design or justified section owner). Retains context and can recover if first choice is wrong. A different valid path is not a failure. |

For each task record: first choice; attempted path; unaided completion, completion after help, not completed or not attempted; recoveries; explanation requests; expected vs observed requirement; paraphrased reasoning and the evidence the reader relied on. Preserve important misunderstandings even when the eventual click is correct. Use a simple explanation code **correct / partial / incorrect / not elicited**, with notes; do not aggregate this small sample into a statistical success rate. Time/clicks describe friction, not learning, causal improvement or adoption.

Offer at most one neutral prompt before offering direct help; record both and the stopping point. Let readers stop at any time; a short task timebox can keep the session manageable but is not a comprehension threshold. Capture no account secrets. Report anonymized observations and limitations, not invented participant results.

Reusable blank observation row (currently **no rows collected**):

```text
Participant alias / prior knowledge / study consent reference:
Source SHA / environment URL / browser / viewport / theme / JS / motion / zoom:
Task ID / order / starting URL:
First choice and route taken:
Unaided | helped | not completed | not attempted:
Recovery / prompt or help supplied:
Reader explanation (paraphrase) / correct | partial | incorrect | not elicited:
Requirement expected vs observed / evidence and limits recognized:
Follow-up owner / severity / unresolved question:
```

#63 should repeat tasks on direct home/track/guide/case/lab entry, including the non-advertising coding task, and the compatibility matrix after #58–#62. Investigate critical mistaken expectations (for example, treating the partial subtotal as a complete total or the mock as verified live access) even if navigation succeeds. Decide the smallest correction from the observation; do not claim a general learning/adoption improvement from this pilot. Record fixes, inherited limits, reader evidence still pending and release readiness separately.

## Verification on this baseline

Commands run in order against the unchanged application source:

```sh
pnpm check
pnpm check:authoring
pnpm check:routes
pnpm test:e2e
pnpm test:site
pnpm exec playwright test --config playwright.pilot.config.js
```

- `check`: Astro/TypeScript **0 errors, warnings or hints** across 58 files; **31 unit tests**; reference validation and **18-page** Astro build pass.
- Authoring: one-record published/draft/invalid cases pass; normal output restored before route/browser checks. No authoring fixture was left behind.
- Independent output comparison: **16 baseline routes, 14 sitemap URLs, five exact download hashes**, text/links/anchors/metadata and flat aliases pass. This is the #42 fixture comparison, not a snapshot regenerated from the candidate.
- Existing browser suites: **28 main desktop/mobile + nine Chromium/WebKit site + 11 pilot = 48 passing cases**. The cache-enabled 404→200 guard also passed separately during #47 closure. No new test, retry, dependency, fixture or CI job was added for #57.
- The first local main-browser invocation could not bind `127.0.0.1:4173` inside the restricted sandbox (`EPERM`), before tests began. It passed with local-server access outside that restriction. This is an execution-environment limitation, not an application failure; no code/test change was made to suppress it. No application failure was reproduced in the listed checks.
- Exact merged-main [Linux CI](https://github.com/ai-knowledge-hub/ai-harness-lab/actions/runs/43168221587) is independently green. Local and hosted evidence are distinct.

The additional viewport/keyboard diagnostics are a one-time baseline inspection, not a second permanent browser suite. Reuse `tests/e2e/discovery.spec.js`, `smoke.spec.js`, `reporting-reference.spec.js`, `lab.spec.js` and the current site/pilot checks when behaviour changes. Retain all 15 visualizers' independent rendered-state assertions and the existing 63,477-gzip-byte first-stage reading budget. This documentation-only slice does not rerun the performance experiment or establish native zoom/AT/reader results. **Next implementation: #58**, then #59/#60; #61/#62 retain their bounded checks, and #63 applies this protocol. Completion of this record does not authorize deployment.
