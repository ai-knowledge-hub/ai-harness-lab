# Source review and implementation map

Bounded review, 24 November 2026, at `2430ee0845d51cb64bd87c80cf1368ffe5d56c36`. This is a review of the current teaching implementation, not a PR diff or production security audit. HEAD and comparison base are the same commit. Two pre-existing untracked documents, `docs/harness-web-stack-migration.md` and `docs/practitioner-system-plan-2026-11-11.md`, were left untouched.

The supplied research could not inspect most client-selected states. This review read all 15 records, Context definitions, reference snippets and renderers, plus the workbench, discovery and relevant tests. It adds focused executable probes for selected snippet defects. It does **not** certify every trace, complete all input/failure tests, inspect a live deployment, or establish reader comprehension.

Subsequent work: [the Binary Search pilot](binary-search-pilot.md) replaces the reviewed Binary Search implementation and addresses A3 under the approved v2.0 contract. This document remains the pre-refactor evidence record; the other mechanisms' findings are not marked fixed by that pilot.

## Findings to address first

These findings concern published teaching claims and illustrative code. The browser does not execute the Python snippets or call the depicted external systems. Consequently, the approval defect below is not evidence of an exploitable production approval bypass in this website. The research's “critical” lease priority describes editorial importance, not an observed production incident.

### A1 · Approval code executes after rejection or while awaiting approval

**Confirmed by an executable snippet probe.** In [`algorithms-data.ts:107`](../../src/visualizers/algorithms-data.ts#L107), both conditional branches are followed by unconditional assignments to `executing` and `execute(action)`. The animation separately asserts that rejection never reaches execution. A reader copying the snippet would receive the opposite control flow.

The literal displayed snippet was extracted and executed with inert policy/action/approver stubs and an `execute` function that only appends to a local list. Both `policy.rejects=True` and `requires_approval=True` without acceptance called the stub once and ended in `executed`. No real operation occurred.

Correct the guard/control flow and the approval-event model together. Show denied/waiting cases that do not execute, then distinguish transition enforcement from the external effect. Existing component tests check selection/stepping; the baseline visual hashes cannot detect disagreement between displayed code and scripted state.

### A2 · Lease copy teaches an unsupported single-executor guarantee

**Confirmed by direct inspection of claims; failure schedule is a model-level counterexample, not a running queue experiment.** [`algorithms-data.ts:486`](../../src/visualizers/algorithms-data.ts#L486) says “Single executor guarantee”; the Context promises that duplicate workers cannot execute simultaneously. The snippet at line 126 uses a UUID ownership token, expiry and heartbeat, with no resource-side fencing or external idempotency contract. The authored states do not show a paused worker resuming after expiry. A UUID owner token is not an ordered fencing token.

Counterexample to cover: A acquires ownership and pauses; its lease expires; B acquires ownership; A resumes and still attempts an effect. Expiry changes coordination state without stopping A's process. Redis's official documentation calls for fencing and warns against assuming that ownership lasts while a process is alive. SQS also documents duplicate-delivery limits for visibility timeouts. These sources support the guarantee boundary, not the correctness of this illustrative snippet. See [Redis locking](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/#disclaimer-about-consistency) and [SQS visibility](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html).

Rename the display concept to Lease-Based Work Ownership while retaining `leaseQueue` links. Specify claim/renew/release atomicity and owner checks; show stale execution, and explain where a protected resource can enforce fencing. Do not substitute an exactly-once promise. Baseline playback only presents cooperative ownership and crash recovery.

### A3 · Binary Search generalises from date order; its target marker also contradicts its scale

**Confirmed by snippet and coordinate probes.** [`binary-search.ts:35`](../../src/visualizers/binary-search.ts#L35) justifies elimination by saying CPA is sorted by date. For the selected threshold, the displayed fixture happens to have a partitioned predicate, so its result is correct. The last value falls from 7.40 to 7.10, but both satisfy the threshold; that fall alone does not invalidate this particular search.

Executing the literal displayed function with inert `{value, day}` records and target `6` gave:

| Values in date order | Linear first match, one-based day | Snippet result |
| --- | --- | --- |
| `4.2, 4.55, 5.1, 5.8, 6.25, 7.4, 7.1` (displayed values) | 5 | 5 |
| `4, 7, 4, 5, 8, 9, 10` (counterexample) | 2 | 5 |

The second case demonstrates why date order is insufficient. Explain the false-then-true predicate, stable input, invariant, boundaries and no-match behaviour. Non-negative cumulative additions on a fixed snapshot are a suitable illustrative valid case; corrections/refunds or a changing snapshot need separate treatment. Python's [bisect partition contract](https://docs.python.org/3/library/bisect.html#bisect.bisect_left) provides a documented sorted-sequence reference; it also distinguishes search cost from list insertion cost.

Separately, [`binary-search.ts:81`](../../src/visualizers/binary-search.ts#L81) places the target line at `y=215`. The bar mapping is `y=270-(value/8)*220`, so target `6` belongs at `y=105`; `215` represents value `2`. Derive the marker from the same scale as the bars. This is a source-coordinate finding; no fresh screenshot was taken. A baseline hash preserves the existing mismatch unless the intended change is reviewed explicitly.

### A4 · Bloom Filter combines probabilistic text, lossy code and contradictory before/after state

**Confirmed by direct inspection.** The snippet at [`algorithms-data.ts:61`](../../src/visualizers/algorithms-data.ts#L61) skips every positive membership result. That is an approximate crawler policy, not exact duplicate elimination. A false positive can discard an unseen URL. If loss is acceptable, state it; otherwise use a positive response to consult an exact store. RocksDB's [filter documentation](https://github.com/meta/rocksdb/wiki/RocksDB-Bloom-Filter) describes the may-exist/definitely-absent distinction and its use before file lookup; it does not establish correctness of this crawler.

The first authored Bloom state at line 382 says no bits are set for the URL, but `bits` already contains all three active positions. [`renderBloom`](../../src/visualizers/renderers.js#L179) displays those positions as 1 while `seen:false` produces “definitely new”. Later new-item frames also show bits after insertion while explaining the earlier query. Make query and insertion separate, or label the combined frame's phases explicitly. Add a constructed false positive; the current repeated URL is a true-positive example, not one.

The existing checks protect the authored bit display, not its temporal agreement with the note or membership operation.

### A5 · Access-control snippet leaves the no-match decision undefined

**Confirmed by an executable snippet probe.** The snippet beginning at [`algorithms-data.ts:136`](../../src/visualizers/algorithms-data.ts#L136) assigns `decision` only after a matching rule. With an empty rule list, wrapping the literal snippet in a function and supplying inert identity/resource stubs raised `UnboundLocalError` at its return. A nonempty list with no matching rule has the same missing assignment.

Specify default-deny or another explicit policy default, rule-order/conflict semantics, missing-attribute handling and enforcement. Test those decisions independently of the illustrative graph. NIST's [ABAC definition](https://csrc.nist.gov/pubs/sp/800/162/upd2/final) concerns evaluation of subject, object, operation and environmental attributes against policy; it does not turn traversal into a complete authorisation model. Existing playback does not evaluate rules.

### A6 · Hash-chain and Union-Find labels promote narrower results into stronger conclusions

**Confirmed claims and model omissions by direct inspection; no cryptographic or DSU implementation was executed.** The hash-chain record at [`algorithms-data.ts:526`](../../src/visualizers/algorithms-data.ts#L526) promises proof against silent edits. Its short hashes and `verified` field are authored values. No hashing or independently trusted checkpoint is computed by [`renderHashChain`](../../src/visualizers/renderers.js#L404). The present tamper example changes one event without recomputing its suffix; it does not address a rewritten internally consistent history or truncation.

Define the attacker, encoding, verifier and independent commitment; compare internal consistency with a trusted checkpoint. A toy rewrite/recompute experiment is needed before claiming that boundary is taught. [RFC 9162](https://www.rfc-editor.org/rfc/rfc9162.html#section-4.10) provides a related example using signed tree heads and Merkle proofs; it is not evidence that a linear chain supplies the same construction.

Likewise, the Union-Find record at [`algorithms-data.ts:428`](../../src/visualizers/algorithms-data.ts#L428) and [`renderUnion:266`](../../src/visualizers/renderers.js#L266) label connected groups “root causes”. Supplied connections do not establish causation. Teach connectivity and label the incident inference separately; show a mistaken bridge. Current snapshots present groups, not parent pointers, rank or path-compression execution. The visual and prose can agree while jointly teaching an unsupported inference, so snapshot preservation alone is insufficient.

## Current implementation boundaries

| Surface | Owner and implication |
| --- | --- |
| Track identity and canonical URLs | [`site.js`](../../src/content/site.js): `labPath`, `visualizerUrl`, family URLs and track descriptions |
| Starting method, four landing groups, cross-track entry points | [`discovery.js`](../../src/content/discovery.js); [`TrackPage.jsx`](../../src/views/TrackPage.jsx) renders these at build time |
| Definitions, code strings and prepared step arrays | [`algorithms-data.ts`](../../src/visualizers/algorithms-data.ts); Binary Search is separately typed in [`binary-search.ts`](../../src/visualizers/binary-search.ts) |
| Present Context shape | `algorithmContext`: four strings, `why`, `optimizes`, `stillUsed`, `remember`; no sections, sources, exercises or scenario contract |
| Playback and interaction | [`AlgorithmLabPage.tsx`](../../src/views/AlgorithmLabPage.tsx): state indexes prepared snapshots; timers advance indexes; changing modes pauses playback |
| Visual rendering | [`render-visualization.ts`](../../src/visualizers/render-visualization.ts) selects a snapshot and delegates to string/SVG renderers in [`renderers.js`](../../src/visualizers/renderers.js) |
| Hydration and static default | [`AlgorithmLabIsland.tsx`](../../src/components/AlgorithmLabIsland.tsx), [`LabPage.astro`](../../src/components/LabPage.astro): static Binary Search first, then query selection after mounting |
| Reading guides | Existing Markdown/MDX collection, schema, validators and build-time reader; see [authoring contract](../learning-content.md) |
| Teaching styles | [`labs.css`](../../src/styles/labs.css), shared [`styles.css`](../../styles.css); reuse existing semantics and tokens before introducing another system |

The producer → consumer path is authored records → build/static default → hydrated query selection → snapshot playback/rendering → reader interpretation. Reference code is another authored representation, not the producer of snapshots. Reset/history replay that representation; they do not recover a real distributed job. No provider action or financial effect is reachable from this lab path.

The current page explicitly states JavaScript requirements and a default-reading alternative (`AlgorithmLabPage.tsx:165`); manual status updates are concise, while autoplay sets the live region to `off`. Earlier UX research recorded missing notices before these changes. Preserve the current implementation rather than reopening that obsolete gap as an observed defect.

## Remaining mechanism checks

These are bounded follow-up requirements, not additional proven failures.

| Mechanism | What to verify during its revision |
| --- | --- |
| BFS | Queue order, discovery versus processing, repeated paths/cycles, max-depth boundary; remove any inference that shallow pages necessarily have higher traffic |
| DFS | Actual stack state and order; directory sorting cost beyond a bare traversal bound; cycles/symlinks where modelled; qualify blanket memory claims |
| Heap | ROAS/spend example consistency, K=0/1, ties, score updates, tree/array mapping and final sorted-output cost |
| Rabin–Karp | Window bounds versus the actual renderer text; hash update and candidate verification; pattern lengths, collision-heavy cost and security-claim limits |
| Topological Sort | Cycle detection absent from the displayed loop; distinguish dependency waves from task completion; label compressed frames and worker assumptions |
| Dijkstra | Tentative-distance/settlement trace including the warehouse branch; duplicate priority entries and stale-entry handling; match complexity claims to the implementation |
| Circular Buffer | Capacity limits, wraparound and latest-N order; qualify append versus query cost and concurrency assumptions |
| Token Bucket | Elapsed-time/request-cost accounting, clock and admission policy; distinguish per-process/global enforcement, rate, concurrency and total budget |

For all 15, verify normal input, meaningful boundaries and an assumption/failure scenario against an independently stated result. A case outside a precondition must teach that the guarantee is lost; it need not fail for every such input. Coordination/security lessons need schedules and trust/enforcement scenarios, not just extra scalar inputs.

## Cross-track truth and ownership

The current [reporting case](../../src/content/lessons/chatgpt-ads-reporting.mdx) distinguishes event identity, aggregate-row identity, snapshot reconciliation, pagination and scope completeness. [`collect.mjs`](../../scripts/reporting/collect.mjs) uses exact `Set`s for received row keys and visited cursors. It rejects duplicate keys and reports bounded partial/failure states. It does not implement a Bloom filter, a ring buffer or binary search.

The research's reporting/Bloom connection is therefore an educational contrast to develop, not a description to copy into the collector. Do not replace an exact check with a probabilistic one or bounded diagnostic memory with durable recovery evidence merely to make a cross-link appear implemented.

Publication and Skills catalogue relationships already have independent ownership and optionality in [the authoring guide](../learning-content.md#optional-companion-selection-and-upkeep). No sibling repositories, packages, account access or live deployments were audited here. Future links require selected destination/readiness verification when changed.

## Implementation and verification plan

Keep conceptual metadata, authored explanation and simulation contracts distinct. A pilot brief should state the input model, scenario, invariant, expected states, code mapping and failure meaning before choosing TypeScript fields. Prefer explicit types for the pilot over expanding `Record<string, unknown>` into a generic content engine. Static reading should use the existing guide pipeline or a comparably small build-time surface, with one source for the full explanation.

| Protected outcome | Cheapest useful evidence | Existing check to retain/extend |
| --- | --- | --- |
| Correct algorithm result and invariant | Small independent oracle, e.g. linear first-match reference, plus boundary cases | Add semantic coverage at the model/snippet level where the pilot introduces an executable model |
| Approval, policy and stale-worker reasoning | Decision table or deterministic worker schedule with inert effects; test rejected/unknown/stale paths | Reuse unit/component coverage for visible decisions; do not call a mock a real permission boundary |
| Explanation/code/diagram agreement | Review scenario states against the technical contract, including labels, scale and line mapping | Existing lab rendered-state suite, with intentional fixture changes justified by reviewed behaviour |
| URL/history/playback and keyboard use | Real browser interaction through direct links, mode changes and Back/Forward | [`lab.spec.js`](../../tests/e2e/lab.spec.js), discovery and smoke checks |
| Static reading, links, fragments and island isolation | Built output and JS-disabled/browser checks | Authoring/route checks and existing site suite |
| Transferable understanding | An unfamiliar reasoning task and observed answer | Editorial rubric plus reader protocol, recorded separately from CI |

Do not regenerate the independent #42 baseline merely to turn a changed fixture green. For a deliberate content/visual correction, identify the old assertion, intended new behaviour and smallest specific expectation change. Keep unrelated route text and download hashes protected.

For application changes use Node 22.23.4+ in 22.x and the repository's checks:

```sh
pnpm check
pnpm check:authoring
pnpm check:routes
pnpm test:e2e
pnpm test:site
```

`check:authoring` mutates and restores a temporary content record: run it before browser suites, not concurrently. Apply focused semantic tests before the broad gates. The 63,477-gzip-byte budget through the first successful stage change protects the reading experience; the existing lab island is measured separately, as recorded in [the site migration report](../harness-astro-site.md). Do not move the lab into reading pages or broaden that exception silently.

For actual browser-platform decisions and targeted accessibility/performance/security changes, retrieve focused Modern Web Guidance guides with `DISABLE_TELEMETRY=1`, verify against code and browser behaviour, keep the optional plugin outside the repo, and use Baseline Widely Available or documented fallbacks. This documentation-only review made no browser-platform implementation choice and performed no fresh browser audit.

## Evidence obtained in this documentation work

- Read the three supplied documents, current module sources and relevant repository contracts/tests. Review/discovery scanners confirmed the repository/head and unchanged application comparison.
- Extracted literal Binary Search, Approval and Access Control snippets for small Python probes with inert stubs. Observed the outcomes recorded above. Checked the threshold marker mathematically from its source scale.
- Checked six primary references for bounded claims: Python bisect, RocksDB Bloom Filter, Redis distributed locks, SQS visibility, NIST ABAC and RFC 9162. See [the dated register](research/README.md#primary-reference-checks).
- Documentation checks passed: 76 local links and their applicable heading/source-line targets, all 15 inventory IDs, new reference whitespace, and three byte-identical source archives with matching recorded SHA-256 hashes. `git diff --check` passed for the tracked documentation changes.
- No application code was changed or provider/worker integration executed. Full Astro/unit/browser suites, performance measurement, screenshots, assistive-technology walkthroughs and participant testing were not run for this documentation change. Current green test status is not asserted.

This narrows the source-access gap in Phase 2. Full semantic verification of the 15 mechanisms, the user's pilot drafts, final reading layout and comparative pilot evaluation remain outstanding.
