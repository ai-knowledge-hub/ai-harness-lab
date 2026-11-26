# Learning and interaction design

Working design, 24 November 2026. Read [the module purpose](README.md) first. This document distils research Phases 1–3; it is an editorial contract to test through the pilots, not a new runtime schema or approved page layout.

## Conceptual structure

Keep three independent dimensions: **the job** helps the reader find a lab; **the kind of mechanism** prevents category errors; **the computational principle** connects the knowledge. Do not turn each dimension into a competing navigation hierarchy.

| Conceptual family | Existing mechanisms | Question |
| --- | --- | --- |
| Structure and elimination | Binary Search | What information permits safe elimination? |
| Selective ordering and reuse | Heap, Rabin–Karp | What order or previous computation is actually needed? |
| Relationships and exploration | BFS, DFS, Union-Find | Which entities are connected, and how do we discover that? |
| Dependencies and optimisation | Topological Sort, Dijkstra | Which steps are eligible, and which path meets the cost model? |
| Finite resources and uncertainty | Bloom Filter, Circular Buffer, Token Bucket | What can be retained, approximated or admitted? |
| State and coordination | Approval State Machine, Lease-Based Ownership | What changes are legal, and what happens when workers disagree? |
| Authority and trust | Access Control, Audit Hash Chain | What is permitted, and what does the evidence establish? |

These families are conceptual groupings. Bloom Filter is not a prerequisite for Token Bucket, and access-control models are not prerequisites for hash chains.

The shared foundations are representation, computational cost, invariants, assumptions and guarantees. Introduce the needed concept within each guide and link to deeper treatment when available. The proposed optional foundation guide, *How Computers Turn Problems Into Computation*, would consolidate these ideas without becoming a gate to any lab. Its 1,200–1,800-word research range is a planning estimate to test, not a required page length.

Use genuine dependencies sparingly: graph/frontier vocabulary helps BFS and DFS; graph and priority-queue knowledge helps Dijkstra; directed dependencies help Topological Sort; explicit state and concurrency help the lease guide. Supply a short bridge for direct entrants. An unfamiliar term does not automatically require another published page.

## Inventory and guide briefs

Retain the current IDs in query links even if display names change. The following are educational targets distilled from the research, not certifications of the present implementations. Source discrepancies are recorded separately in [the implementation review](implementation-review.md).

| ID / mechanism / kind | Intended understanding and required boundary | Experiment or transfer assessment |
| --- | --- | --- |
| `binary` · Binary Search · Algorithm | Elimination preserves the unresolved boundary when the predicate partitions a stable search space. Derive halving cost under indexed-access and predicate-cost assumptions. Date order alone does not establish the needed property. | Valid cumulative non-negative additions on a fixed snapshot; empty/no/all matches and repeated boundary values; fluctuating latency or CPA counterexample. Can the reader establish applicability before searching? |
| `bfs` · BFS · Algorithm | Queue/frontier order establishes shortest edge-count distance in an unweighted graph. Explain vertices, edges, representation and discovery versus processing. Depth does not establish business priority. | Cycle, repeated path and disconnected node; then weighted edges. Can the reader explain why fewest edges need not mean cheapest route? |
| `dfs` · DFS · Algorithm | Stack or call frames retain unfinished exploration. Separate visited vertices from the active recursion path. Memory depends on representation, branching and implementation. | Pair with BFS on the same graph; deep branch and directed cycle. Can the reader distinguish stack exhaustion from a graph cycle? |
| `heap` · Heap / bounded Top-K · Data structure and selection algorithm | Parent–child partial order provides access to the weakest retained candidate. Define score, tie policy, K, input mutability and final-output ordering. The current example ranks ROAS, while research examples often rank spend. | Show tree and array together; compare full sorting with bounded selection; change a discarded candidate's score. Can the reader explain what additional state/recomputation is needed? |
| `rabin` · Rabin–Karp · Algorithm | Reuse overlapping window computation; matching hashes identify candidates that require exact verification. State hash arithmetic, pattern-length handling and expected/worst-case costs. Keyword detection does not establish general prompt-injection safety. | Outgoing/incoming character contributions and a deliberate collision. Can the reader distinguish a hash candidate, a confirmed string match and a policy decision? |
| `topo` · Topological Sort · Algorithm | A ready vertex has no unresolved predecessors. Explain partial order, DAG assumptions and cycle detection. Valid ordering and dependency readiness do not establish a successful or optimal worker schedule. | Cycle, two eligible tasks and limited workers; distinguish eligible, running, completed and failed where the system extension models them. Can the reader separate ordering from execution? |
| `dijkstra` · Dijkstra · Algorithm | Relaxation and minimum accumulated tentative distance, with fixed non-negative additive weights. State queue implementation and its costs. A multi-objective, uncertain tool plan needs an explicit reduction before shortest-path reasoning applies. | Compare BFS, cheapest-outgoing-edge selection and Dijkstra; a negative-weight or changing-cost counterexample. Can the reader justify the cost model? |
| `union` · Union-Find · Data structure | Maintain disjoint sets representing supplied connectivity. Explain representatives, rank/size, path compression and amortised cost without calling it literally constant. Connectivity does not infer causation. | Parent-pointer view, compression, mistaken bridge and attempted deletion. Can the reader explain why a transitive cluster does not prove a common incident cause? |
| `bloom` · Bloom Filter · Probabilistic data structure | Distinguish definitely absent from possibly present, with the insertion-only state/hash assumptions made explicit. Define capacity, occupancy, memory/hash cost and the limits of the probability approximation. | Show query before insertion, a constructed false positive, and exact lookup after a positive result. Can the reader preserve correctness for payment/event deduplication? |
| `buffer` · Circular Buffer · Data structure | Logical order versus physical slots and modular wraparound. State capacity and overwrite/reject/block policy; constant-time append does not make arbitrary reads constant-time or concurrent access safe. | Fill and wrap; compare retention policies and producer/consumer imbalance. Can the reader distinguish last N events from last ten minutes? |
| `tokenBucket` · Token Bucket · Rate-control mechanism | Separate burst capacity, refill rate, request cost, clock and enforcement scope. Admission rate does not bound outstanding concurrency, total lifetime spend or every downstream resource. | Vary capacity/rate/cost/arrival timing independently; increase request duration without changing admission rate. Can the reader identify the need for a concurrency limit? |
| `approval` · Approval State Machine · Lifecycle/control mechanism | Distinguish state, event, guard, transition and atomic enforcement. Approval must concern the operation actually executed; unknown external outcomes need reconciliation. | Rejected and awaiting-approval paths, two workers racing, timeout after an external effect. Can the reader explain why entering EXECUTING is not exactly-once completion? |
| `leaseQueue` · Lease-Based Work Ownership · Coordination mechanism | Temporary ownership supports recovery; expiry does not stop a process. Separate claim atomicity, owner tokens, fencing at the protected resource, idempotency and business outcome. | Pause A → expire → grant B → resume A; compare stale writes with/without resource-side fencing. Can the reader identify what remains unprotected for an external API? |
| `permissionGraph` · Access Control (RBAC / ABAC) · Policy models | Distinguish identity, roles, attributes, relationships, policy decision and enforcement; define missing attributes and rule conflict/default semantics. A graph picture is not a policy specification. | Same role, different tenant/resource ownership, changed context and stale policy. Can the reader explain why a role alone does not grant access to every report? |
| `hashChain` · Audit Hash Chain · Integrity mechanism | Define encoding, hash commitments, verifier and independent trust anchor. Separate internal consistency, append-only history, authenticity and truth of the recorded event. | Alter an event, recompute subsequent hashes, compare with/without a trusted checkpoint; include suffix removal. Can the reader say what a valid chain does and does not prove? |

## Flexible guide architecture

Each guide should fulfil eight responsibilities. Combine or reorder them when the explanation benefits; do not make eight obligatory headings.

| Responsibility | Required contribution |
| --- | --- |
| Encounter the problem | Concrete input, desired result, constraint and useful straightforward baseline |
| Discover the principle | Property that permits a better approach; mathematical terms introduced when needed |
| Construct the mechanism | State, operations, representation and maintained invariant/contract |
| Observe execution | A guided Run trace with a reason to notice each material state change |
| Account for the cost | Derive relevant time, memory, lookup, coordination or recovery costs and compare alternatives |
| Challenge the guarantee | A boundary input or failure scenario; explain what conclusion no longer follows |
| Enter a real implementation | One strong primary-source implementation example; optionally one evidenced system case |
| Transfer the knowledge | Unfamiliar problem, expected reasoning, explanation and the limit of the answer |

Keep the classical algorithm name visible alongside a problem-led title, for example “Binary Search — How Much Can One Comparison Tell Us?” The research titles are drafts, not approved metadata.

The suggested Context ranges run from roughly 800–1,300 words for classical algorithms to 1,200–1,800 for coordination. Use them only to estimate editorial work. Fit the explanation to the actual reading surface; do not put 1,500 words into the current four-row grid merely because a range was proposed. Coordination and security need timing, enforcement and trust models rather than a compulsory Big-O badge.

## Run, Context and static reading

Context establishes what to notice, why it matters and when the explanation applies. Run makes the relevant state and transformation observable. A useful loop is: read the question → predict → inspect a step → explain the invariant → change a constraint → reconsider the guarantee.

Retain manual controls and the existing two views where they serve this loop. Experiments can be scenarios inside Run; new top-level tabs are not implied. Mode switching should preserve enough state to resume the reader's investigation, with playback paused as it is today.

For the pilots, choose between a statically rendered explanation at the lab and a canonical static guide linked from Context. Either choice must keep **one authored full explanation**, preserve existing lab query links and leave reading independent of hydration. A short derived Context summary plus a canonical guide can work; two separately edited full lessons will drift. A nondefault query currently requires JavaScript to select its lab; do not claim that all 15 full guides already render without it.

## Visual principles

Preserve approved artwork, shell typography, tokens and useful existing diagrams. Choose new visuals only where the learning objective needs them.

- Use shared meanings for unprocessed information, current operation, established result, eliminated state and violated assumption. Labels, shapes or patterns must accompany colour.
- Expose current state, operation, reason and maintained property. Visually distinguish tentative from settled, discovery from processing, and ownership from physical execution.
- Use sequences/intervals for search; frontiers for traversal; trees plus storage for heaps/DSU; bit/hash state for membership; capacity plus time for resource control; and parallel worker timelines for leases.
- Make before/after semantics explicit. If a snapshot compresses several operations, say so. If it switches actions or branches, identify the new scenario instead of implying a legal transition from the previous frame.
- Label authored traces, conceptual simulations and actual computed outputs honestly. Displayed code and visual steps must agree even if the animation is deliberately scripted.
- Retain keyboard operation, focus, readable local diagram scrollers, reduced-motion behaviour, concise step announcements and both themes. Actual assistive-technology behaviour needs targeted review; labels alone are not certification.

## Navigation and integration

Keep the current operation-oriented landing page and the familiar algorithm names during pilots. The existing four landing-page groups and the workbench's operation filters are already different views of the same inventory; the seven conceptual families do not need a third visible filter system.

A later landing update can introduce the broader purpose, a concise starting method, the existing recommended Heap action, an optional foundations reference and a few useful system cases. Do not advertise unpublished foundations or planned packages as working destinations. Retain `/learn/algorithms`, the visualizer route, current `algorithm` IDs, `#visualizer`, other query parameters, history and the compatibility alias.

Cross-links must answer a question raised by nearby copy. Give a reader the option to go down to a mechanism or up to its system consequences and return to their original section. Keep one canonical owner for cross-track guides.

| Existing destination | Potential bridge to verify in surrounding copy |
| --- | --- |
| API Design | Token Bucket for admission versus concurrency; Access Control for decision versus enforcement |
| Marketplace checkout-timeout guide (currently draft) | State Machine or Leases for legal transitions, uncertain outcomes and stale workers; retain preview status |
| Advertising reporting case (currently draft) | Exact identity/completeness versus approximate membership; bounded retention versus durable recovery evidence |
| Advertising Platforms | Heap for bounded ranking, if the surrounding explanation actually raises this selection problem |
| AI engineering/control-plane references | State, authority and evidence boundaries without suggesting the lab operates a real control plane |

Database indexing, new streaming lessons and new Skills packages are research directions. They are not current destinations. The cross-link matrix is an editorial opportunity list, not proof those mechanisms are used by the cited products or collector.

## Evidence and evaluation

For every consequential claim record its text, source/section or code revision, review date, assumptions and whether it concerns an illustrative example, documented implementation or observed system. Prefer the original paper, official documentation or source code for technical claims. Pin source revisions when an implementation detail matters. Historical and visual teaching references enrich a guide where useful; they are not mandatory preambles.

The research's provisional rubric is technical correctness 25%, first-principles reasoning 20%, progression 15%, visual learning 15%, transfer 15%, evidence 10%, with each dimension scored 0–5. Its weighted score is `sum(weight × rating / 5)` out of 100. The suggested 85 threshold has not been calibrated. A material error in explanation, code or demonstrated behaviour blocks readiness regardless of score.

The review should establish that the reader can identify the problem and applicability, explain why the mechanism works, account for costs, state guarantees and assumptions, recognise failure, interpret a documented implementation, transfer the idea, use the visual to reason, and predict a changed constraint. Record reviewer judgments separately from observed reader reasoning.

For each pilot collect an observe/predict/transfer prompt and expected explanation before testing it. Record actual answers, where help was needed and remaining confusion; do not infer comprehension from correct clicks. Compare what the three different mechanism families reveal about the shared format before scaling production.
