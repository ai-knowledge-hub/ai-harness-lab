# Algorithms & Data: purpose and refactoring reference

Prepared 24 November 2026 from three supplied research documents and the repository at `2430ee0845d51cb64bd87c80cf1368ffe5d56c36`.

This is an internal working reference for the module's editorial and implementation work. It records the direction, existing constraints, source findings and decisions to test through the pilots. Subsequent approvals and implementation are recorded explicitly; the initial research alone does not certify a pilot or the whole refactor.

## Read and use this reference

| Document | Use it for |
| --- | --- |
| This page | Purpose, boundaries, publication-system relationships and implementation order |
| [Learning and interaction design](learning-design.md) | Conceptual structure, all 15 mechanism briefs, navigation and educational acceptance criteria |
| [Pilot brief template](pilot-brief-template.md) | Turning a researched pilot into an explicit content, visual and code handoff |
| [Binary Search pilot](binary-search-pilot.md) | The first implementation, approved-source preservation, chosen reading format and verification evidence |
| [Source review and implementation map](implementation-review.md) | Current code ownership, confirmed discrepancies, verification limits and follow-up checks |
| [Research provenance](research/README.md) | Unedited supplied material, traceability and independently checked source references |

Read these alongside [content authoring](../learning-content.md), the [practitioner UX baseline](../practitioner-system-ux-baseline.md), and the [Astro deployment contract](../harness-astro-cutover.md). Those existing contracts remain applicable. Update this reference when a pilot changes a recommendation; record the reason and evidence rather than silently treating a proposal as a historical decision.

## Recommendation

Retain the interactive workbench and all 15 mechanisms. Refactor the educational model around **computational reasoning: deriving an appropriate mechanism from the structure, constraints and required guarantees of a problem**.

The research identifies a strong opportunity: system-design guides explain how components compose into a system; this module can explain why the underlying mechanisms work and where their guarantees end. Readers should be able to move between those levels in either direction.

The work is more substantial than expanding Context copy. Explanation, displayed reference code, input data, visual states and exercises must teach the same model. The present workbench has valuable interaction and navigation, but its steps are authored snapshots independent of the displayed code. A richer explanation alone will not correct a contradictory demonstration.

## Purpose at three scales

### As a standalone module

Help a reader answer: **How does the structure of this problem determine what a computer can do efficiently and reliably?**

An individual guide/lab should support four practical tasks:

1. Recognise the operation: what goes in, what must come out, and which straightforward approach becomes insufficient.
2. Understand the mechanism: representation, state, operations, invariant and the reason it works.
3. Inspect the limits: costs, assumptions, alternative choices and the consequences of breaking an assumption.
4. Transfer the reasoning: predict behaviour and justify a choice in an unfamiliar example.

Readers include practitioners who know some programming and readers entering from a systems article without formal algorithm training. Define the mathematical concepts needed for the local problem; retain implementation detail and deeper reasoning for those who need them. A reader should gain a complete explanation without installing software, possessing an account, or following a companion-site link.

The browser workbench supplies prepared examples, manual stepping and code inspection. It is not currently a general code runner, arbitrary-input simulator or production control system. Future experiments should say exactly what the reader can change and what the simulation models.

### Within Harness

Algorithms & Data provides a mechanism-level reference shared across all five tracks. Its contribution is not limited to agent optimisation or marketing examples. Marketing remains a useful domain, alongside examples from storage, networks, repositories, workflows and other AI engineering work.

The track links mathematical foundations to mechanisms, documented implementations and system behaviour. It does not need to cover all of computer science. Preserve the foundations needed to explain the existing inventory before commissioning more labs.

The research identifies future gaps: arrays/hash tables and exact membership, sorting, stacks/queues, trees and indexes; later possibilities include inverted indexes, consistent hashing, sampling/sketches, dynamic programming and approximate nearest-neighbour search. Keep these as a research backlog. They do not enlarge the current 15-mechanism refactoring or require new visualizers during the pilots.

The research's curriculum is an **internal knowledge architecture**: dependencies and useful routes through ideas. Public copy follows the repository's practitioner framing—guides, labs, worked examples and things a reader can do. Do not impose a course sequence, enrolment, completion gate or prerequisite journey. See [the existing terminology rule](../learning-content.md#practitioner-guides-and-content-authoring).

### Within Publication, Harness and Skills

| Surface | Owns | What an algorithms reader can obtain there | Boundary |
| --- | --- | --- | --- |
| AI Knowledge Hub Publication | Research, arguments, source context and its own article URLs | Why a technology or engineering question matters; evidence and broader implications | An essay is not verification of a lab or proof of a deployed system |
| Harness | Explanations, lab models, experiments, worked examples and reference fixtures | Why a mechanism works, how to choose it, how to inspect its assumptions and what an implementation must preserve | A simulation or illustrative snippet is not an operational service |
| Skills | Reusable skills, tools, agents and plugins, with package-owned setup and readiness | A relevant resource to inspect, adapt or run under its stated requirements | Guidance, installation, runtime discovery, account access and permission to act are distinct claims |

These are complementary responsibilities, not mandatory stages of a funnel. An algorithms guide is complete with no Publication or Skills companion. Add a companion only when it serves the reader's current question, and state what opening it provides. Reuse the existing canonical relationship records; do not duplicate package versions, setup or live-readiness claims in the module.

“Harness” here names the publication's engineering site. An agent **harness** is runtime software that manages an agent's context, state, tools and execution. A Harness lab may explain that software; the website is not itself evidence of a working runtime. Likewise, a reusable **skill** is a resource type, while **Skills** names the companion catalogue.

There are no required build or runtime imports between the three sites. Cross-site editorial relevance creates links and ownership agreements, not an automatic dependency or shared execution authority. A future reusable editorial skill may encode the validated review method; creating it is a separate task after the pilots.

## Principles to carry into implementation

1. **Start with the abstraction.** Define the problem representation before choosing the mechanism. A date-ordered series, a value-ordered series and a monotonic threshold predicate are different properties.
2. **Explain correctness through a maintained property.** Show what remains true and why the next operation preserves it. For coordination and security, include the enforcement and trust boundary.
3. **Account for what is saved and sacrificed.** Derive computational costs under an explicit model. Explain information loss, approximation, retention and recovery costs as well as speed.
4. **Keep local and system guarantees separate.** A valid transition, lease, membership response or log digest does not establish the larger business outcome.
5. **Make interaction do explanatory work.** Use observe → predict → experiment. Each guide needs a boundary case or failure scenario that tests the reader's model.
6. **Retain mathematical substance.** Move from intuition to an observable pattern, then notation and its engineering consequence. Explain symbols and assumptions; offer deeper proofs where necessary.
7. **Distinguish evidence levels.** Label hypothetical applications, documented implementations and demonstrated system behaviour separately. A plausible application list is not implementation evidence.
8. **Preserve independent use.** Keep local explanations, static reading, accessible controls, stable links and useful return paths. Companion content adds depth without becoming a requirement.

## Decisions and evidence status

| Item | Working position | Status |
| --- | --- | --- |
| Retain 15 mechanisms and the workbench | Preserve investment while repairing educational and technical gaps | Research recommendation supported by source inspection; no removal proposed |
| Use seven conceptual families | Use as editorial metadata and production organisation | Direction approved in the supplied shared conversation; no seven-section navigation change implied |
| Shared foundations | Explain representation, cost, invariants, assumptions and guarantees locally; one optional reference guide | Editorial direction approved; scope/format still to validate and no new page exists |
| Eight educational responsibilities | Use a flexible coverage contract rather than fixed visible headings | Approved architecture; Binary Search fulfils it through six narrative sections |
| Binary Search → Bloom Filter → Lease-Based Ownership pilots | Learn sequentially across mathematical, probabilistic and distributed explanations | Approved sequence; Binary Search v2.0 supplied and implemented, later pilots pending |
| Heap as entry point | Retain the current practical starting action during pilots | Existing behaviour; reconsider after pilot evidence |
| Full Context presentation | Keep one authored explanation; make essential reading available as static HTML | Binary Search uses one static MDX slot/native disclosure; test suitability in subsequent pilots |
| Larger navigation or visual redesign | Change only after the pilots expose a specific reader need | Deferred |
| Weighted score and word ranges | Use for editorial calibration, not automated proof or publication authority | Provisional research suggestions |

The [Binary Search pilot](binary-search-pilot.md) records the first reading-format decision and its evidence. Its implementation does not establish that the same format is appropriate for every mechanism or authorize publication of the remaining proposals.

## Reader journeys that the design must support

| Entry and purpose | Useful local result | Optional continuation | Failure to prevent |
| --- | --- | --- | --- |
| Direct Binary Search link: find a first threshold crossing | Understand the monotonic predicate, inspect a valid trace and reject a fluctuating counterexample | A documented sorted-sequence API or an existing related guide | Inferring applicability from chronological order |
| Reporting case: reduce repeated lookups | Understand approximate membership versus exact business identity and completeness | Bloom Filter experiment, then return to the same case section | Replacing authoritative duplicate/completeness checks with a probabilistic result |
| Worker-recovery question from Software & production | Explain expiry, stale workers, resource-side enforcement and uncertain outcomes | A documented queue or a relevant Skills package, if one exists | Treating a simulated lease or installed package as exactly-once execution |

The synthetic collector currently uses exact sets for row keys and visited cursors. A Bloom Filter link would teach a contrast; it would not describe that collector's implementation. The [source review](implementation-review.md) records this boundary.

## Refactoring order and completion

1. Use the pilot briefs to compare the incoming drafts with the actual code and visual states. Keep research proposals and observed defects separate.
2. Correct known misleading guarantees and code/diagram contradictions in bounded changes. These corrections need not wait for a larger navigation redesign.
3. Validate Binary Search's explanation, experiment and static reading format; carry the lessons into Bloom Filter, then Lease-Based Ownership. Do not overwrite the user's drafts with inferred copy.
4. Choose the smallest content/rendering contract that supports all three. Avoid designing a universal lesson engine from the present four-string Context shape.
5. Revise the other twelve mechanisms in conceptual batches, with the same evidence and agreement checks.
6. Update landing-page language, justified cross-track links and discovery only after the destinations are usable. Retain the operation-oriented entry model and familiar algorithm names.

A revised mechanism is ready when its explanation, snippet and visual trace agree; its costs and conditional guarantees are supported; a normal case and meaningful boundary/failure case are verified; and a transfer question has expected reasoning. A completed refactor additionally preserves URL/history behaviour, static reading and downloads, keyboard use, motion preferences, theme readability, island boundaries and the applicable performance budget.

Track editorial review, implementation verification and reader evidence separately. Passing structural/browser checks does not establish learning. A reader's ability to justify a choice in a new problem is stronger educational evidence than playback completion or time on page. Use the existing [reader-task protocol](../practitioner-system-ux-baseline.md#neutral-reader-task-protocol-for-63) as a starting point; no participant findings have been collected by this work.
