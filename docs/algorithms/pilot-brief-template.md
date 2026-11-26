# Pilot guide and lab brief

Use one copy per mechanism. This is an internal editorial/engineering handoff, not an application schema. Replace prompts with evidence or an explicit unknown. A filled brief is not approval; record editorial review, technical review, implementation verification and reader evidence independently.

## Identity and status

- Mechanism, current lab ID and retained URL:
- Proposed guide title and any canonical reading route:
- Kind: algorithm / data structure / probabilistic structure / control / coordination / policy / integrity:
- Author, reviewers and last review date:
- Editorial: draft / reviewed / accepted, with evidence:
- Technical claims: unreviewed / reviewed, with unresolved claims:
- Implementation: unchanged / specified / implemented / verified, with commit:
- Reader evidence: not collected / collected, with limits:

## Reader and practical outcome

State the central question, reader's starting knowledge and concrete change in their reasoning. Define any genuine prerequisite locally or give an optional explanation. List three to five observable objectives using actions such as predict, justify, distinguish or diagnose.

Record the running example's input, desired output and constraint. Explain what the straightforward baseline does and why another mechanism might help. Label the scenario as illustrative unless its real-world use is evidenced.

## Technical contract

| Field | Required answer |
| --- | --- |
| Representation | What objects, relationships, values and identities exist? |
| Operations | What can change state and what does each operation return? |
| Preconditions | Input properties, stable snapshot, hashing, clock, concurrency or trust assumptions |
| Invariant | What remains true at the relevant execution boundary? |
| Correctness reasoning | Why do operations preserve the invariant and establish the result? |
| Guarantee | Exact result or conditional/probabilistic statement, including no-result semantics |
| Cost model | Meaning of n/K/V/E, primitive costs, memory, expected/amortised/worst-case distinctions where relevant |
| System boundary | What does this mechanism not establish about the external outcome? |
| Alternatives | At least one plausible alternative and the constraint that changes the choice |

For coordination: specify actors, ownership, time, protected resource, atomic transition/claim, external effect and recovery after an unknown result. For security/integrity: specify attacker, authoritative identity/policy/checkpoint, decision versus enforcement and missing/stale evidence.

## Claim-to-source register

| Claim ID and exact claim | Evidence kind | Primary source / section / revision | Checked date | Scope and unresolved limits |
| --- | --- | --- | --- | --- |
| Replace with claim | Illustrative / documented implementation / observed system | Replace with evidence | Replace with date | Replace with qualification |

A research candidate or a library's existence is not proof of a product's internal design. Prefer one strong documented example over a list of possible applications. Preserve live/deployed/account-verified status with its actual owner.

## Context copy and interaction handoff

Supply the complete draft or its stable file location. Map its sections to the eight [educational responsibilities](learning-design.md#flexible-guide-architecture). Identify the single source of the full explanation and how static reading and Context obtain it.

| Scenario | Input and changed assumption | Prediction asked before reveal | Expected result and why | Observable state / code mapping |
| --- | --- | --- | --- | --- |
| Normal | Replace | Replace | Replace | Replace |
| Boundary | Replace | Replace | Replace | Replace |
| Broken assumption or failure schedule | Replace | Replace | Replace | Replace |

For each scenario specify initial state, operations, material intermediate states, final state and whether the trace is computed or authored. Define before/after semantics, reset and scenario-switch behaviour. Identify a failure's meaning: incorrect result, missing guarantee, rejected action, partial result, or uncertain outcome. Include the independent expected-value model; do not calculate expected results solely through the code under review.

Specify the visual model, learning purpose, labels/legend, invariant display, code-line synchronisation, static explanation, keyboard/focus behaviour, announcements and reduced-motion treatment. Reuse the present brand and layout where it works. Note compressed frames or branch changes explicitly.

## Transfer exercise

Give an unfamiliar domain and ask for a decision or prediction. Supply the expected reasoning, a plausible misconception and an explanation of why it fails. Include a follow-up that changes one constraint. Keep the assessor's expected answer separate from the prompt shown to a reader.

## Integration and code change list

List proposed changes by actual file/owner: content, data, snippet, scenario model, renderer, Context, landing/discovery, metadata and tests. For each, state the discrepancy being resolved and acceptance evidence.

List existing related guides and a specific question each link answers. Preserve their draft status and return path. Publication and Skills companions are optional; leave them absent if none improves this guide. Identify proposed destinations as future work without active-looking links. Record ID/query/fragment compatibility and any intentionally revised fixture.

## Readiness record

- Technical claims and snippet/visual agreement: evidence and remaining gaps.
- Normal, boundary and failure scenario: independent result, command/schedule, observed outcome.
- Static reading, URLs/history, keyboard, motion, themes, fragments, islands and applicable budget: checks and limits.
- Editorial progression and transfer reasoning: review outcome, distinct from browser success.
- Reader observations: actual explanations and help needed, or explicitly pending.
- Open decisions, owner and next evidence required:

Do not average away a material correctness error. Treat the research's word ranges, rubric and 85/100 suggestion as calibration aids. Use the repository checks in [the implementation plan](implementation-review.md#implementation-and-verification-plan) for code changes, with authoring checks before browser suites.

## Three-pilot comparison

Run the research sequence Binary Search → Bloom Filter → Lease-Based Ownership. For the current drafts, check these starting points:

- Binary Search: monotonic predicate, fixed snapshot, result boundaries, truthful chart scale and fluctuating counterexample.
- Bloom Filter: conditional absent/present semantics, query versus insertion state, an actual false positive and authoritative lookup policy.
- Lease-Based Ownership: parallel worker timeline, expiry versus execution, enforced fencing boundary and unknown external outcomes.

After each pilot record what the shared format explained well, what it distorted and what should change for the next pilot. After all three, decide the reading surface, minimal content types, scenario contract and any navigation change from that evidence. Heap remains the current entry-point lab while those decisions are tested.
