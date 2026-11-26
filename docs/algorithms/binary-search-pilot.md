# Binary Search pilot implementation

24 November 2026. Implements the user-supplied Context v2.0 and visual/interaction handoff within the existing lab. Local implementation; no publication or deployment was performed.

## Editorial basis and scope

The supplied [Phase 4.3.1 source](research/04-binary-search-context-v2.txt) is preserved unedited. The [shared research conversation](https://chatgpt.com/share/6b05f668-c704-83ed-82d3-72feee781db3) opened successfully in the browser even though the web fetch failed. Its final interactive prototype was inspected, including switching to the CPA scenario and advancing through the first invalid elimination. This was not a visual inspection of every earlier prototype in the conversation.

The user described the attachment as the approved version and requested this first refactor. The attachment itself retains its historical “approval candidate” label. Implementation follows the current request; no publication permission is inferred from controls or approval language inside the research page.

The six reader-facing sections are retained. Export damage to Python indentation/newlines and escaped mathematical notation was repaired; source URLs retain their destinations with tracking parameters removed. The text export lost the latency diagram and revealed solution body. The specified latency dataset and prefix-maximum contract supply those elements, with an explanation of the equivalence, preparation/storage costs, updates and limits. The optional Boolean-query proof comes from the handoff. None of the editorial production notes, checklists or research scores appear in the public Context.

The lesson implementation changes Binary Search only. It retains the lab route, `algorithm=binary`, catalogue label, unrelated query parameters, working-area fragment and the other 14 lessons. The shared hero copy was simplified in the later editorial pass; the broader module navigation and marketing-oriented title remain for later work.

## Content and rendering decision

[`binary-search.mdx`](../../src/content/labs/binary-search.mdx) is the single authored full explanation. It is outside the guide collection because it belongs to the existing workbench rather than introducing a new canonical guide route.

Astro renders the MDX as a static child of the existing React island. React receives the slot, not a second bundled implementation of the article. The ordinary entry opens Context, including in the initial HTML without JavaScript. A shared plain-English introduction leads to “Try the algorithm” or “Read the explanation”. Native nested disclosures expose the solution and optional proof. Headings remain outside summaries. Run retains its server-rendered markup in a hidden container until selected; playback and experiment selection require JavaScript. The user removed the browser-requirements note from the public introduction in the editorial pass.

Binary Search catalogue selection opens Context. Existing `?algorithm=binary` visualizer links retain their Run intent. Explicit `view=context` / `view=run` links select the corresponding surface, and `experiment=boundary|counterexample|growth` selects a shareable experiment. New Context experiment links include both values. Enhanced navigation preserves unrelated query parameters, keyboard focus and the working-area target; refresh and browser history restore the selected view/experiment. The other 14 pilots retain their existing entry behaviour.

The first server/client render remains the default Binary Search Context. Query-selected views and algorithms are applied after hydration. The selected algorithm, playback, history and scroll contracts remain covered by the retained regression matrix.

On 25 November the user approved the entry introduction, Context-first ordinary entry and one paragraph-order repair: Day 5 is inspected before the text says that only one record has been inspected. The [Phase 4.2 initial draft](https://chatgpt.com/s/t_6b0699a60ec88191a3db49bc64c74a06) was read in the browser to compare its teaching progression. Its historical production instructions were treated as research, not new authorization.

The subsequent user-requested Copywriting Studio pass removed all em dashes from the public Binary Search copy and removed the lab's browser-requirements note, circular reading link and associated ARIA description. The introduction now starts with the operation the reader can explore, rather than an inventory of internal system terms. The lesson explicitly identifies monotonicity as a property of the sequence; the CPA failure follows inspection, mistaken elimination and outcome, with the error attributed to the bound update. The reporting link explains the useful connection directly. Mathematical assumptions, costs, code, datasets and references remain intact.

The reviewed source and original fixture remain frozen. [`binary-search-editorial-edits.json`](../../tests/fixtures/binary-search-editorial-edits.json) records the four bounded prose revisions and their reasons. The copy checker applies those revisions, the punctuation replacements and the earlier paragraph move to the original expected copy before comparison. The shared hero replacement is checked explicitly before restoring historical wording for route parity. No new runtime dependency was added.

This is a validated format for the Binary Search pilot, not a universal schema for the remaining mechanisms. Bloom Filter and Lease-Based Ownership should test whether this presentation and contract still serve their different explanatory needs.

## Search and visual contract

[`binary-search.ts`](../../src/visualizers/binary-search.ts) contains one first-true procedure. Both normal and counterexample traces are generated through that procedure; the linear verifier does not choose the search result. The procedure searches elements in `[0,n)` and returns a boundary in `[0,n]`. `hi=n` is a sentinel position and is never dereferenced.

- Cumulative spend: `[100,250,400,650,650,850,1100,1250]`, threshold 650 → index 3 / Day 4, three evaluations.
- Fluctuating CPA: `[4,8,5,4,7,9,10]`, threshold 6 → search output 4 / Day 5, actual first match 1 / Day 2, first invalid update 1, three evaluations.
- Growth: analytical worst-case counts, labelled as counts rather than runtime measurements; no million-element array is allocated.
- Constructive assessment: prefix maxima of `[80,120,250,90,180,300,100]` are `[80,120,250,250,250,300,300]`. Their first crossing agrees with the raw sequence's first historical crossing.

Each iteration exposes inspection, conditional inference, bound update and independent verification. The initial frame has zero observations/evaluations. Inspection and update have separate frames so the reader can predict the bound change. Source-line highlights correspond to the displayed Python procedure.

Solid outlines and visible values identify observations, dotted outlines identify unresolved values, and dashed outlines identify inferences. For non-monotonic data, discarded predicates are labelled assumptions. After an invalid elimination, the verifier's counterexample is explicitly labelled and does not count as a search observation. Revealing all values also does not relabel them as search observations.

The complexity label concerns the algorithm alone. The teaching trace stores frames and the verifier performs additional work; the UI states this rather than claiming the entire visualization uses constant auxiliary space. Threshold/scenario changes reset the trace and prediction. Manual stepping and Context entry pause playback; autoplay does not create a live announcement for every frame.

| Asset | Implemented surface |
| --- | --- |
| BS-V01 · Initial observation | Static Context sequence after one inspection/update; show checked and inferred values before introducing bounds and invariants |
| BS-V02 · Predicate boundary | Static semantic spend/predicate table |
| BS-V03 · Invariant snapshot | Shared sequence renderer after two comparisons, with inclusive boundary positions |
| BS-V04 · Boundary search | Run, threshold form, prediction, reveal and retained playback controls |
| BS-V05 · Growth | Run, adjustable powers-of-two input size, common-scale bars and count table |
| BS-V06 · Invalid elimination | Context snapshot and Run using the same procedure as the successful trace |
| BS-V07 · Duplicate boundaries | Static Context table and bisect_left/bisect_right example |
| BS-V08 · Prefix maximum | Latency table and native solution disclosure with construction and reasoning |

Animation and highlighted reference code share the existing two-column workbench grid, as in BFS, so the procedure and its visual effect remain visible together. Below the existing 1,100px breakpoint the panels stack in reading order. Diagrams retain authored label sizes in a named, keyboard-scrollable region when their sequence exceeds the panel width. Context spans the full workbench width, using the existing typographic language, paragraph spacing and labelled local diagram/table scrollers. Smooth document scrolling is disabled on this lab surface: a focused no-JavaScript test reproduced unstable scrolling to deep disclosures with the inherited smooth-scroll rule, then passed after this scoped change.

## Files and ownership

| Owner | Files |
| --- | --- |
| Algorithm, trace and shared sequence renderer | `src/visualizers/binary-search.ts`; the Binary Search summary in `algorithms-data.ts` |
| Workbench experiments and interaction | `AlgorithmLabPage.tsx`, `BinarySearchTools.tsx` |
| One static Context source | `src/content/labs/binary-search.mdx`, passed through `LabPage.astro` and `AlgorithmLabIsland.tsx` |
| Static figures, equations and accessible code | `BinarySearchFigure.astro`, `BinarySearchEquation.astro`, `BinarySearchCode.astro` |
| Scoped layout | `src/styles/binary-search.css` |
| Independent editorial and trace expectations | `tests/fixtures/binary-search-reviewed-v2.txt`, `binary-search-editorial-edits.json`, `binary-search-novice-edits.json`, `binary-search-pilot.json` |
| Copy and retained-route verification | `scripts/check-binary-search-copy.mjs`, `check-astro-output.mjs` |
| Semantic/browser verification | `tests/unit/binary-search.test.ts`, existing lab/site specs |

The original #42 route text, lab inventory and visual-state fixture files remain unchanged. The route checker verifies the bounded shared-hero replacement and the complete Binary Search Context, code, links and figures before comparing historical text. Catalogue/bridge text, anchors, metadata, other labs and download hashes remain protected. The lab test uses a separately authored numerical trace for the new Binary Search states and retains the original visual hashes for the other 14 mechanisms.

## Evidence and remaining limits

The shipped TypeScript procedure was tested for every boundary at each size from 0 through 256: **33,153 configurations**, including empty/singleton/all-true/all-false predicates. Tests check valid access, preserved boundary, strict halving, correct result and the tight worst-case bound. Additional cases cover duplicates, threshold extremes, snapshot isolation, the deliberate counterexample, observation/reveal semantics and prefix-maximum transfer. The literal displayed Python code was independently extracted and executed across the same 33,153 configurations with zero failures.

Python bisect, Go sort.Search, and PostgreSQL index-type/ordering documentation were freshly retrieved on 24 November 2026 for the claims carried into the copy. These are documentation-backed examples. No PostgreSQL query was benchmarked or executed, and the reporting collector does not implement this threshold search.

Final repository and browser results are recorded below after verification. Browser success does not establish screen-reader speech quality or reader understanding. No participant study or assistive-technology walkthrough was conducted. The next editorial comparison remains Bloom Filter, followed by Lease-Based Ownership; their implementation is outside this pilot.

## Final verification

| Check | Observed result |
| --- | --- |
| `pnpm check` on Node 22.23.4 | 73 files checked with zero errors/warnings/hints; 79 unit/component tests pass; 18-page build passes |
| `pnpm check:authoring` | Typed, Markdown and MDX published/draft/invalid variants pass; temporary records removed and normal output restored before browser suites |
| `pnpm check:routes` | 15 retained historical routes, metadata/anchors/aliases, five exact download hashes and the independent approved-copy checks pass; original #42 fixtures unchanged |
| `pnpm test:e2e` | 34 desktop/mobile scenarios pass, including every state of all 15 labs in both themes, Binary Search interaction/static reading, Context-first entry and direct experiment refresh/history |
| `pnpm test:site` | 58 Chromium/WebKit scenarios pass, including the new 320px Binary Search flow, retained island isolation and first-stage reading-budget check |
| Independent displayed Python probe | 33,153 configurations; correct result, valid accesses and evaluation bound; zero failures |
| Documentation/provenance | 67 local reference links and four archived-source SHA-256 records checked; `git diff --check` passes |

25 November layout refinement: restored visible animation/code columns on desktop and retained full-width Context. `pnpm check` (zero diagnostics, 79 tests and build), `pnpm check:authoring`, `pnpm check:routes` and all four targeted Binary Search desktop/mobile browser cases passed again. Browser assertions checked side-by-side/stacked placement, keyboard stepping, synchronized code highlighting, equal Run/Context outer widths and no document overflow at 2,136, 1,440, 390 and 320px in both themes. The desktop capture at `output/playwright/binary-side-by-side-desktop.png` was visually inspected. Wide sequences scroll locally when the animation column cannot fit their authored label sizes. This is reflow evidence, not a native zoom, contrast or screen-reader certification.

During verification, the first pilot interaction run exposed the selector-label problem and the no-JavaScript deep-disclosure scroll instability. Both were corrected; the focused scenarios and final full suites then passed without raising timeouts or regenerating historical fixtures. Local servers/browser execution required sandbox permission for loopback access. No hosted checks, commit, push or deployment were performed.

The 25 November entry refinement passed `pnpm check` (zero diagnostics, 79 tests and build), authoring and route checks, all 34 main browser cases and all 58 Chromium/WebKit site cases. A direct counterexample refresh initially left the uncontrolled threshold field showing £650 despite the active £6 search; synchronizing the editable field fixed that observed discrepancy. The keyboard test now waits for navigated Context content to be visible before pressing Enter on its native solution summary; three repeated runs in each browser and the full site suite passed. Final captures at `output/playwright/binary-entry-1440.png` and `binary-entry-390.png` were inspected. Context spans the working area at 2,136, 1,440, 390 and 320px, with no document overflow and the retained side-by-side/stacked Run arrangement.

The subsequent editorial pass passed `pnpm check` (zero diagnostics, 79 tests and build), authoring checks, eight targeted main-browser scenarios covering Binary Search and discovery, and both Chromium/WebKit Binary Search cases. The final build and route/copy checks pass, including the absence of em dashes in the rendered Binary Search stage, the removed lab requirements note, preserved executable examples and original reference destinations. The earlier full-suite results above are retained as dated evidence; the editorial pass used targeted browser verification.

26 November paragraph consolidation: grouped connected sentences into paragraphs around the observation, search steps, correctness argument, cost trade-offs, counterexample and applications. Branch alternatives, figure/equation introductions and interactive prompts retain useful breaks. A whitespace-normalized comparison of the complete MDX before and after the change confirms identical words, punctuation, code, component order and links. This pass changes paragraph boundaries only; the editorial source and revision fixtures need no updates.

26 November newcomer reading: added short explanations of algorithm, threshold, predicate, zero-based index, bounds, invariant, interval brackets, sentinel, evaluation, worst case, Big O, auxiliary space and representation where they first matter. Later examples explain library tools, insertion boundaries, membership, database indexes, latency and prefix maxima. Candidate-capacity search and the optional Boolean-query proof now use the same vocabulary as the earlier explanation. The bounds paragraph explains the no-match position before diagrams name the sentinel; interval notation is introduced before the invariant figure.

The opening observation figure uses the same trace and renderer in a presentation that omits bounds, interval notation and invariant status. Its labels distinguish checked values from conclusions about unchecked values in plain English. Only Day 5's value is revealed; accessible text states that value and the non-decreasing assumption. Run and later figures retain the full search presentation. The existing observation/reveal unit case also checks these evidence boundaries. Python bisect, Go sort.Search and PostgreSQL index documentation were rechecked for the clarified implementation examples.

[`binary-search-novice-edits.json`](../../tests/fixtures/binary-search-novice-edits.json) records the bounded wording changes and their reasons. The original source and earlier revisions remain frozen. Supplement revisions are checked against the constructive solution and optional proof, while the rest are applied to the original expected copy before comparison. Code indentation, equations, source destinations and the search contract retain independent checks.

Newcomer-pass verification: `pnpm check` passed with zero diagnostics, 79 unit/component tests and the 18-page build. Authoring checks, the final build, route/copy checks, all six targeted desktop/mobile Binary Search scenarios and both Chromium/WebKit Binary Search scenarios passed. The default Run rendering retains its search state and code contract. The opening observation was inspected at 1,440px and 390px; assertions also covered 320px in both themes, one checked value, no premature bounds/invariant panel, readable SVG label scale and no document overflow. Captures are under `output/playwright/binary-novice-observation-*.png`. This is editorial and browser verification, not an observed learning outcome from a novice participant.

26 November animation/code alignment: Run now explains day/index numbering, T/F and the boundary markers beside the diagram. The Python panel connects `predicate(mid)` to the selected threshold, explains integer division and shows the current variable values. Inspection notes include the midpoint calculation; update notes explain why `hi = mid` retains the checked position as a possible answer while `lo = mid + 1` skips it. The eight frames, executable procedure, datasets and numerical results are unchanged. The final diagram explicitly states its returned answer, including the deliberate CPA error and no-match sentinel. SVG descriptions now include checked values, check outcomes and returned results. Dataset prompts explain the active example and distinguish revealing values from search observations; growth copy defines one check before comparing counts.

Alignment verification: `pnpm check` passed with zero diagnostics, 79 tests and the normal build; authoring and route/copy checks passed. All 34 desktop/mobile browser cases and all 58 Chromium/WebKit site cases passed. Additional browser assertions covered both search datasets in both themes at 2,136, 1,440, 390 and 320px: synchronized first-check variables, retained columns/stacking, authored SVG label scale and no document overflow. Desktop inspection, mobile code and the CPA return-state captures under `output/playwright/binary-*-after-*.png` were visually inspected. The displayed Python was independently executed across all 33,153 boundaries for sizes 0 through 256 and both teaching traces. These checks verify consistency and presentation, not learning outcomes from a novice participant.

## Post-publication editorial corrections

26 November 2026. The agreed follow-up addresses review issues 01, 03, 04 and 05. The prefix-maximum solution distinguishes the O(1) maximum calculation from amortised O(1) list append and explains the latter term; [CPython's complexity documentation](https://docs.python.org/3.14/builtins/time-complexity.html#notes) documents the occasional resize cost. The optional lower bound counts decision-tree leaves, with branch, depth and leaf meanings explained before the unchanged inequality and model restriction.

In the invariant section, the narrative explains preservation, the diagram retains the numerical state, its status identifies whether the invariant holds, and the caption explains the two possible answers when one record remains to inspect. Only this static figure uses the compact annotation; Run and the counterexample retain their detailed explanations. The SVG and its accessible description remain identical to the full presentation. The existing reporting link and fragment move beside the data-stability caveat, replacing the ending related-content block. The connection concerns changing data between reporting versions; the existing caveat still distinguishes concurrent changes during a search.

The [follow-up revision record](../../tests/fixtures/binary-search-followup-edits.json) is applied after the earlier editorial/novice records in the copy checker. Original research, approved source, earlier revision records, datasets, equations, reference code and existing destinations remain unchanged. The module's broader marketing-agent framing is explicitly recorded as Phase 6 editorial debt in the [module reference](README.md#decisions-and-evidence-status), pending the remaining pilots and approval of the broader track architecture.

Follow-up verification: `pnpm check` passed with zero diagnostics, 80 unit/component tests and the production build; authoring checks passed and restored the normal output before browser testing. All 34 desktop/mobile cases and 58 Chromium/WebKit site cases passed, including the amended static-reading assertions. The final caption clarification was rebuilt and the route/copy checks passed again. Visual assertions at 1,440, 390 and 320px in both themes confirmed readable SVG label scale, a single invariant status and no document overflow; the reporting link opened the intended section. Captures under `output/playwright/binary-editorial-*.png` were inspected. Reader learning and screen-reader speech were not assessed.
