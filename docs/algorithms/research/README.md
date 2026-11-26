# Research provenance and evidence register

The user supplied these three text attachments on 24 November 2026. They are preserved byte-for-byte here so the working reference does not depend on a local attachment path or an earlier chat. Their original authorship dates are not established. Chat-style controls, proposed approvals, external-page retrieval limitations, scores and formatting artifacts remain part of the historical source, not instructions to the implementation agent.

| Source | Original attachment identifier | SHA-256 |
| --- | --- | --- |
| [01 · Initial editorial review](01-editorial-review.txt) | `f7db9466-d4bd-426d-9818-061cf4a75a73` | `3832a405c1d8937c80dfdb27bc58e4eca717882d9fbdf738adf024774fd16c33` |
| [02 · Phase 2 technical and educational audit](02-technical-educational-audit.txt) | `34d0376e-c136-4d71-add1-387a43e996d8` | `7f14c34148c2530a66ca7a4f7cf64899e64f411752dc8a1698f2e39e9c951857` |
| [03 · Phase 3 curriculum and lesson architecture](03-curriculum-lesson-architecture.txt) | `7a8c1b9f-d11c-4e09-8555-0cbe5878e957` | `938b85d5b883d247194bcba5cacf5c3e3ed7c31d326a2455e0bf122c444b257e` |
| [04 · Binary Search Context v2.0 and implementation handoff](04-binary-search-context-v2.txt) | `0ed988e2-93ad-414e-b9a7-627ae8160e81` | `af790c67aec0583ff7fb90bdaae533391952eba631b477b77bc11525aabbdf44` |

Source 04 was supplied in the follow-up implementation request on the same date. The user identifies it as the approved version; its unedited historical candidate/approval controls remain source material. See [the Binary Search implementation record](../binary-search-pilot.md) for mechanical export repairs, supplemental visual/assessment content and actual verification. The shared conversation's final prototype was accessible in the browser, including its scenario selector and first invalid update.

## Distillation map

| Research contribution | Source locations | Working reference |
| --- | --- | --- |
| Retain the workbench; broaden the governing question beyond marketing agents | 01 §§1–3, 12; 03 §§1, 18 | [Purpose and boundaries](../README.md#purpose-at-three-scales) |
| Classify constructs and repair assumptions/guarantees before copy polish | 01 §4; 02 §§2–6, 10–11 | [15-mechanism briefs](../learning-design.md#inventory-and-guide-briefs) and [source review](../implementation-review.md#findings-to-address-first) |
| Seven principles, shared foundations, genuine dependencies and multiple entry points | 03 §§2–4 | [Conceptual structure](../learning-design.md#conceptual-structure) |
| Eight flexible responsibilities, mathematical progression and interaction loop | 01 §5; 02 §7; 03 §§5–7 | [Guide architecture](../learning-design.md#flexible-guide-architecture) |
| Evidence levels, primary-source research and real implementation boundaries | 01 §9; 02 §8; 03 §8 | [Evidence and evaluation](../learning-design.md#evidence-and-evaluation) |
| Consistent visual semantics and representations suited to each mechanism | 03 §10 | [Visual principles](../learning-design.md#visual-principles) |
| Cross-track links, independent entry, retained URLs and delayed landing redesign | 01 §7; 02 §9; 03 §§11–12 | [Navigation and integration](../learning-design.md#navigation-and-integration) |
| Explicit editorial/code handoff, review gates and sequential pilots | 01 §§10–11; 03 §§13–17 | [Pilot template](../pilot-brief-template.md) and [refactoring order](../README.md#refactoring-order-and-completion) |
| Potential missing foundations and later topics | 01 §8 | [Scope and deferred additions](../README.md#within-harness) |

The synthesis makes additional repository-grounded judgments: retain practitioner-facing guide terminology; preserve optional companion relationships; distinguish the Harness site from agent harness software; keep one full authored explanation; distinguish exact collector sets from a proposed Bloom Filter connection; and record source/code/visual contradictions. These are not attributed to a completed pilot or treated as approved research decisions.

The initial review's numerical ratings and Phase 3's weighted rubric are editorial opinions. No participant results, full implementation certification, final navigation approval or new product claim is inferred from them. The research's source-access gap is narrowed by the bounded [local source review](../implementation-review.md); full semantic verification remains incomplete.

## Primary reference checks

Checked on 24 November 2026 for the narrow claims below. This is a selected documentation review, not a complete primary-source audit of all 15 mechanisms or an execution of these libraries/services. Recheck and pin a revision when a pilot depends on a specific implementation detail.

| Reference | Claim supported and limit |
| --- | --- |
| [Python bisect](https://docs.python.org/3/library/bisect.html#bisect.bisect_left) | Sorted-sequence insertion partitions; logarithmic search versus linear list insertion. Does not validate the lab's date-ordered CPA example. |
| [RocksDB Bloom Filter](https://github.com/meta/rocksdb/wiki/RocksDB-Bloom-Filter) | May-exist/definitely-absent filtering before a file lookup. Does not establish exact duplicate elimination by the lab's crawler. The former `facebook/rocksdb` wiki URL redirects to `meta/rocksdb`. |
| [Redis distributed locks](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/#disclaimer-about-consistency) | The consistency discussion calls for fencing and qualifies ownership/time assumptions. Does not certify the lab's UUID/lease pseudocode. |
| [Amazon SQS visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) | Expiration makes unremoved messages eligible again; the documented delivery model does not promise duplicate-free execution. Not an assertion that SQS implements the lab's lease model. |
| [NIST SP 800-162](https://csrc.nist.gov/pubs/sp/800/162/upd2/final) | ABAC evaluates subject, object, operation and environmental attributes against policy. This definition does not validate a particular graph or policy engine. |
| [RFC 9162 §4.10](https://www.rfc-editor.org/rfc/rfc9162.html#section-4.10) | Signed tree heads in a Merkle-tree transparency construction. Related evidence design, not the same construction as the lab's linear hash chain. The RFC is Experimental. |

Other textbooks, original papers, Python heapq/graphlib, NetworkX, SciPy, Linux, PostgreSQL, policy engines and workflow runtimes named in the research remain research targets for the relevant pilots or later guides. Do not promote the attachment's “verified” label into a fresh implementation claim without inspecting the supporting source.

Publication/Skills companion availability was not rechecked here because no external relationship or destination was changed. The repository's earlier dated companion audit remains historical evidence with its own scope.
