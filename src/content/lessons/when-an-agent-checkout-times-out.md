---
id: "when-an-agent-checkout-times-out"
title: "Eventual Consistency at the Checkout"
shortTitle: "Agentic commerce systems"
description: "Business Hub, ads and Wallet meet at the merchant checkout. Follow who owns each fact, where agreement breaks down, and who does the reconciliation."
trackId: "system-design"
kind: "case"
publicationStatus: "draft"
format: "System-design deep dive"
readingMinutes: 18
updatedAt: "2026-11-19"
introduction: "Read the announcements and you see a product strategy. Read them as a systems engineer and you see commercial facts, purchase approvals, payments and orders moving between systems that own different parts of the truth. When those records disagree, somebody has to reconcile them. In the documented fallback, that somebody is the shopper."
objectives:
  - "Map the owners of commercial facts, purchase authority, payment state and order state."
  - "Distinguish documented platform behavior from architectural inference and proposed guarantees."
  - "Design freshness checks, safe retries and reconciliation across the merchant boundary."
prerequisiteConceptIds:
  - "http-basics"
conceptIds:
  - "api-contracts"
relatedGuideIds:
  - "api-design"
  - "chatgpt-ads"
  - "chatgpt-ads-reporting"
sectionIds:
  - architecture-by-accretion
  - who-owns-what-state
  - consistency-at-the-seams
  - recheck-the-delivery-promise
  - trace-the-timeout
  - look-up-the-order-before-retrying
  - make-a-repeat-submit-safe
  - what-the-platform-needs
  - what-operators-can-do-now
  - christmas-peak
  - replay-the-failures
  - who-pays-for-the-gaps
  - sources-and-scope
---

## Architecture by accretion

In November 2026, OpenAI brought several commercial surfaces into sharper focus: new target bidding options from 9 November, Business Hub in the 10 November release notes, and Wallet on 13 November. Supply, demand and payment now sit within the same product family. Their release dates fit comfortably into one week. Their guarantees require rather more room. [Bidding changes](https://help.openai.com/en/articles/20001634-bidding-strategies-and-how-pricing-works-in-chatgpt-ads), [Business Hub release](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), [Wallet launch](https://openai.com/index/introducing-chatgpt-wallet/).

A marketplace is a distributed system in the most practical sense: several parties hold records, exchange messages and make decisions before every other party has observed the result. A product description, an approved purchase, a card authorization and an accepted order answer different questions. Putting them into one conversation does not make them one transaction.

The question worth asking is **where the platform supplies agreement, where it leaves uncertainty, and who pays to resolve it**. The public documentation gives us enough to examine those boundaries. It does not give us OpenAI’s private service topology or a complete consistency specification.

The most revealing instruction is mundane. If checkout fails or becomes unclear, the shopper should check the merchant’s confirmation before trying again. A person has become the link between a conversation and an order record. That is an architectural responsibility hiding in a help article. [Wallet checkout recovery guidance](https://help.openai.com/en/articles/20001654-making-purchases-with-chatgpt-wallet).

## Who owns what state

Start with ownership. Business information helps discovery. An ad system selects a sponsored placement. A shopper authorizes a purchase. A merchant accepts an order. A payment provider records the financial outcome. Each can work correctly while the overall experience remains uncertain.

<figure class="system-diagram">
<figcaption id="commerce-topology-caption">01 / The marketplace has several owners of truth</figcaption>
<p class="system-diagram-hint">Scroll across on a small screen. <a href="/diagrams/commerce-state-owners.svg">Open the full diagram</a>.</p>
<div class="system-diagram-viewport" role="region" aria-labelledby="commerce-topology-caption" tabindex="0">
<img src="/diagrams/commerce-state-owners.svg" width="840" height="760" loading="lazy" alt="Three separate paths: merchant information reaches discovery through Business Hub; campaigns reach sponsored placements through ad tools; shopper approval reaches merchant checkout through a dot and Wallet. Checkout connects to order and payment records, which need reconciliation." />
</div>
</figure>

This is a map of responsibilities and possible journeys, not a claim about internal network calls. The discovery and advertising paths are separate. OpenAI describes an ad orchestrator that calls retrieval, scoring and auction tools; the auction handles final selection and pricing. That describes coordination inside the ad stack. It does not establish a transaction spanning a sponsored placement and a merchant order. [OpenAI’s ad-stack engineering account](https://openai.com/index/building-chatgpt-ad-stack/).

For checkout, the division is explicit: the customer approves in ChatGPT, the merchant’s checkout processes payment, and the business handles the order and fulfilment. Wallet can work through existing checkout forms without a Wallet-specific integration. We should therefore avoid inventing a universal order-status API that every merchant already exposes. [Merchant payment responsibilities](https://developers.openai.com/commerce/guides/accept-payments).

| Record | Who can establish it? | What it does not establish |
| --- | --- | --- |
| Product description or feed entry | Merchant supplies information; discovery surfaces may present a copy | The current offer for this variant, address and moment |
| Sponsored placement | Advertising delivery and measurement systems | Shopper approval or an accepted order |
| Purchase approval | Shopper, within the terms shown | Merchant acceptance or successful payment |
| Order acceptance | Merchant order system | That the agent received the confirmation |
| Payment outcome | Processor, network and issuer records, interpreted under their contracts | That the merchant saved and will fulfil the corresponding order |
| Attributed conversion | Measurement pipeline under its event and attribution rules | A fresh order-status lookup or proof of incremental sales |

There can be a clear system of record for an order: the merchant’s. The harder problem is whether the agent can identify and read that record after an interrupted exchange. **Authority over a fact and access to evidence of that fact are separate properties.**

## Consistency at the seams

It is tempting to label the conversation AP and payments CP, then declare the marketplace a CAP problem. Those labels skip the work. CAP concerns particular consistency and availability guarantees under network partitions; generating a response says little about replicated-state consistency, and CP does not mean money moves exactly once. [Gilbert and Lynch’s CAP paper](https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf).

More useful questions are concrete: how old may a commercial fact be, what does an approval authorize, what identifies a repeated operation, and what evidence closes an unknown outcome?

| Boundary | Documented behavior | Guarantee to ask for |
| --- | --- | --- |
| Business update → customer answer | Changes can take time to appear; answers may use other sources | Visibility of the accepted version and a stated freshness bound |
| Feed → live purchase | The feed supports discovery; the live site or plugin checks the current offer | Revalidation and an enforceable quote at submission |
| Approval → merchant acceptance | Material changes require new approval; submission does not guarantee acceptance | A durable association between approved terms and the purchase attempt |
| Checkout → conversation | A failed exchange can leave the result unclear to the shopper | Authenticated status lookup or a defined recovery route |
| Order event → advertising report | Event deduplication and reporting delays have published rules | Traceable event identity and clear report timing |

The first two boundaries are acknowledged in the [Business Hub update guidance](https://help.openai.com/en/articles/20001635-setting-up-your-business-on-chatgpt) and [product-feed guide](https://developers.openai.com/commerce/guides/submit-product-feeds). The approval boundary is specified in the [Wallet terms](https://openai.com/policies/chatgpt-wallet-terms/). These are different contracts. Calling the whole platform “eventually consistent” would obscure the distinctions we need to engineer against.

Measurement deserves its own clock. OpenAI documents daily processing for conversion and purchase outcomes, with recent results subject to revision. An order that does not yet appear in an ad report may still be perfectly real. Waiting for attribution to settle is a poor checkout recovery protocol. [Reporting freshness](https://developers.openai.com/ads/reporting).

## Recheck the delivery promise

It is 12 December. A shopping agent finds an $89 coffee grinder advertised for delivery by Christmas. The merchant’s delivery capacity has changed. At checkout, the current date is 28 December.

The failure begins before payment: a commercial fact survives beyond the conditions that made it true. A copy can be accurate when published and misleading when acted upon. The merchant needs to know where the old promise remains visible; the shopper needs the current terms before deciding.

<figure class="system-diagram">
<figcaption id="commerce-freshness-caption">02 / A copied promise and a live offer have different lifetimes</figcaption>
<p class="system-diagram-hint">Scroll across on a small screen. <a href="/diagrams/commerce-fact-freshness.svg">Open the full diagram</a>.</p>
<div class="system-diagram-viewport" role="region" aria-labelledby="commerce-freshness-caption" tabindex="0">
<img src="/diagrams/commerce-fact-freshness.svg" width="840" height="430" loading="lazy" alt="An earlier feed snapshot and customer answer both say 24 December. A separate live checkout returns quote q18 for 28 December; the shopper approves the revision, then submission validates and reserves those terms. Updating a copy and authorizing a purchase are separate boundaries." />
</div>
</figure>

We do not know the end-to-end propagation time for this hypothetical correction. Business Hub explicitly warns that updates take time to appear. That supports a staleness risk; it does not establish an unbounded delay, a particular replica chain, or a measured failure rate. Nor does correcting a feed prove that an answer already present in a conversation has been corrected.

OpenAI already documents the important boundary: feeds support discovery, while a live website or plugin checks the current offer when the customer acts. Its feed schema also distinguishes discovery, Ads and checkout requirements. A feed upload should never be mistaken for a reservation. [Feed behavior](https://developers.openai.com/commerce/guides/submit-product-feeds), [feed schema and integration scope](https://developers.openai.com/commerce/specs/file-upload/products).

In our worked example, the shopper still wants the grinder and accepts the later date. The merchant creates quote q18 with a price, currency, variant, quantity, destination, delivery commitment and expiry. Submission validates the approval against that quote and reserves the resources needed to honour it. Another material change requires another decision. This quote-and-reservation design is our proposed merchant contract; the specific identifiers and API below are fictional.

The distinction matters: a fresh read can become stale between checking and acting. The purchase needs terms that the merchant can enforce, or a refusal and a new quote when it cannot.

## Trace the checkout timeout

Approving q18 creates a durable purchase attempt, att-42, in our merchant design. The agent saves the reference before submitting. The merchant processes the request, payment succeeds, and order ord-704 is committed. The reply never reaches the agent.

<figure class="system-diagram">
<figcaption id="commerce-timeout-caption">03 / The order can be certain while the observer remains uncertain</figcaption>
<p class="system-diagram-hint">Scroll across on a small screen. <a href="/diagrams/commerce-checkout-timeout.svg">Open the full diagram</a>.</p>
<div class="system-diagram-viewport" role="region" aria-labelledby="commerce-timeout-caption" tabindex="0">
<img src="/diagrams/commerce-checkout-timeout.svg" width="840" height="580" loading="lazy" alt="Sequence: the agent submits att-42; the merchant requests payment, receives success and commits ord-704. The response is lost, so the agent times out with an unknown outcome. A later authenticated status lookup returns the already confirmed order." />
</div>
</figure>

At 10:02:13, “the request timed out” is a statement about the agent’s observation. “The order failed” would be an unsupported claim about the merchant’s state. The reply can be lost after the business effect has happened.

This is a familiar distributed-operation problem. Amazon’s Builders’ Library describes the same ambiguity when a resource-creation request receives no response: retrying can create an unwanted second resource unless the service provides suitable idempotency semantics. [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

OpenAI’s recovery guidance recognises the practical consequence: check merchant confirmation or order status before repeating an unclear purchase. That documents a recovery responsibility. It does not prove that OpenAI has no internal reconciliation machinery. The externally visible question is whether recovery is available to this shopper, with this merchant, after this failure.

## Look up the order before retrying

Here is the recovery path for our fictional merchant API:

```HTTP title="The status lookup in the worked example"
POST /checkout-attempts/att-42/submit
→ Client times out waiting for the response

GET /checkout-attempts/att-42
→ 200 OK
{ "state": "confirmed", "order_id": "ord-704" }
```

The merchant authenticates the caller and checks access to this shopper’s attempt. A reference identifies a record; possession of it alone grants no authority. The lookup reads the merchant’s durable state, so the agent can return the existing confirmation without creating another purchase.

| What the lookup establishes | What the agent does |
| --- | --- |
| Confirmed, with an order reference | Return the existing confirmation and end the attempt. |
| Ready, with current approval | Retry the same attempt only under a contract that makes delayed and repeated submissions safe. |
| Processing or unresolved payment | Use a bounded status-check budget; hand off if the outcome remains unresolved. |
| Quote changed or expired before processing | Establish that the old attempt is terminal with no payment or order before approving a replacement. |
| Lookup unavailable or record missing | Preserve the unknown outcome; use order history or merchant support. |

Browser checkout may expose only a confirmation page, receipt or order history. An API in a diagram does not create a capability in somebody else’s website. The agent needs a recovery route that actually exists, and a truthful account of what it has established.

The shopper should hear: “The checkout timed out. I’m checking whether the shop placed your order.” If the records remain inconclusive, the outcome remains unknown. Fluency is not evidence.

## Make a repeat submission safe

Safe retries begin with the identity of an intended purchase. In our design, att-42 survives worker restarts, late requests and repeat submissions. The merchant atomically claims it before beginning work and enforces one accepted order per attempt. A repeat with changed terms is rejected; a completed repeat returns the saved outcome.

Deduplicating on card, cart and amount would be too coarse. A shopper can legitimately buy the same thing twice. Amazon’s discussion of caller-provided request identifiers makes this distinction explicit: identical parameters do not necessarily express identical intent. A new intended purchase needs a new identity. [Request identity and different intent](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

Payment introduces another boundary. A worker can stop after the processor accepts payment but before the merchant saves the order. Persist the provider request reference before the call, reuse its idempotency key within the provider’s contract, and reconcile an uncertain result before beginning another charge. Stripe’s API v1, for example, allows idempotency keys to be pruned after at least 24 hours; reusing a pruned key can create a new request. A retry key is a scoped guarantee with a lifetime. [Stripe’s idempotency contract](https://docs.stripe.com/api/idempotent_requests).

An outbox solves a related local problem: commit an order and a notification record in the same database transaction, then relay the notification. The relay and its consumers must tolerate duplicates. This makes order-event publication recoverable; it does not make a remote payment call atomic with the order database. [Transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html).

The useful invariant is concrete: one intended purchase must not silently become two orders or two charges. An unresolved payment must remain visible until records agree or a defined remedy closes it. “Exactly once” earns its meaning only when we specify the operation, identity, retention window and failure boundary.

## What the platform needs to make explicit

The following is a proposed public contract, not a report of missing private services. Some pieces already exist within individual products. The design opportunity is to make their composition understandable and testable across the merchant boundary.

### A durable purchase identity and a recoverable outcome

Connect approved terms, the merchant’s attempt reference, payment references and the final order. Give an authorized agent a supported way to recover the result, or state which merchant evidence the shopper must use. Keep the merchant authoritative for order acceptance and the payment provider authoritative for its own financial events. A common reference can connect those authorities without creating a second competing order ledger.

### A freshness contract for commercial facts

Show when an update was received, accepted and made active on each supported surface. Distinguish those acknowledgements from evidence that an answer actually used the new version. Specify how stale a price, availability claim or delivery promise may be and when checkout must revalidate it.

For urgent corrections, define revocation behavior. The feed schema already has search-eligibility controls; the question is how quickly a change affects relevant surfaces and what acknowledgement the merchant receives. A stop-sell instruction with a deadline is more useful than update-and-hope. A deadline for removing a discovery claim still needs an enforceable live checkout boundary.

### Reconciliation as a product capability

Give ambiguous purchases a recovery lifecycle: who owns the investigation, what evidence is required, how long automated checks continue, and when a human receives the case. The unknown state must be first-class. Handing a shopper an uncertainty and a support address transfers work; it does not remove it.

### Measurement that respects the audience boundary

The current eligibility rules matter: OpenAI says Plus, Pro and Business users do not see ads, while Wallet’s documented rollout is to eligible US Pro users in dots. These are distinct product populations at this point in time. They are not a network partition, and their separation need not be a defect. [Ad eligibility](https://help.openai.com/en/articles/20001207-ads-in-chatgpt-the-basics), [Wallet availability](https://help.openai.com/en/articles/20001654-making-purchases-with-chatgpt-wallet).

The implication is narrower and useful: an advertiser cannot assume its measured ad audience represents Wallet shoppers. Target CPA optimizes toward a conversion goal within its eligible opportunities; that fact alone says nothing about performance in a different population. Evaluate each funnel on its own evidence. A shared product brand does not establish a shared sample.

### Auditability where decisions create obligations

Retain the facts shown, their versions, the approved terms, the policy checks and the observed outcome. For ad decisions, a useful audit trail records the relevant candidates and decision inputs under appropriate privacy controls. Reproducible components and recorded model decisions help explain what happened without pretending that a seed alone reproduces an entire changing distributed system.

The platform does not need a global transaction over every advertisement, answer and card network. It needs explicit contracts at the points where one system’s claim becomes another system’s obligation.

## What operators can do now

Merchants can design against these boundaries without knowing the platform’s internal service graph. The governing principle is ownership: your order system owns accepted orders, your payment provider owns its financial events, and every copied commercial claim needs a path back to an enforceable current offer.

| Risk at the boundary | Action within the operator’s control | System-design primitive |
| --- | --- | --- |
| An old delivery promise survives a correction | Version source facts, record accepted updates, and check customer-visible answers after material changes. Treat sampled checks as evidence, not universal proof. | Provenance and staleness monitoring |
| Facts change between discovery and purchase | Validate the variant, destination, price and delivery terms; issue an expiring quote and reserve or reject at submission. | Revalidation and reservations |
| A timeout invites a second purchase | Keep a durable attempt identity, deduplicate under an explicit contract, and expose authorized status recovery where possible. | Idempotency and recovery |
| Payment succeeds before order persistence | Persist provider references and reconcile unresolved payments to orders or a documented remedy. | Durable workflow and reconciliation |
| An urgent correction needs several updates | Coordinate website corrections, feed updates, relevant ad pauses and customer support in one runbook. Track completion per surface. | Operational coordination |
| Browser and server report one sale twice | Use the same event identity and Pixel ID according to the documented deduplication rules. | Idempotent event consumption |
| Reports lag orders or use different scopes | Compare matched periods, currencies, event definitions and attribution windows; use experiments when asking about additional sales caused. | Measurement discipline |
| Agent visits trigger fraud controls | Follow verified-agent access guidance and review risk-provider configuration while preserving customer authentication and authorization checks. | Identity verification and risk controls |

Conversion deduplication is already documented: matching browser and server events must reuse the appropriate event identifier and Pixel ID. That deduplicates measurement events, not purchases. Two real orders with two real event identities will still be two orders. [Conversions API deduplication](https://developers.openai.com/ads/conversions-api).

OpenAI also documents the browser-risk problem: cloud browser traffic can accidentally trigger bot-oriented controls, and support for relaying user signals is rolling out. Configure these deliberately with your risk provider. A forwarded header is not customer authorization, and agent identification is not permission to skip fraud checks. [Payment and risk guidance](https://developers.openai.com/commerce/guides/accept-payments), [verified cloud browser access](https://developers.openai.com/commerce/guides/enable-browser-access).

## Christmas peak, with the arithmetic exposed

Return to the grinder. How much could one stale delivery claim cost? We can model the exposure, provided we keep assumptions separate from measurements.

| Assumption in this illustration | Value |
| --- | --- |
| Relevant conversations per day | 7,000 |
| Time an old promise remains visible | 12 hours |
| Share of those exposures becoming affected orders | 2% |
| Additional loss per affected order | $25 |

That gives 7,000 × 12 / 24 = **3,500 exposures**, then 3,500 × 2% = **70 affected orders**, and 70 × $25 = **$1,750 in additional losses**. At that loss per order, $10,000 would require 400 affected orders. None of these quantities is an observed OpenAI metric or a claim about its feed latency.

The model is deliberately simple. Repeat conversations can involve the same person; a corrected checkout can prevent a bad purchase; some shoppers will accept the later date. Estimate the affected-order share from those outcomes instead of treating every stale answer as an inevitable return. Keep lost contribution, refunds, support cost and additional handling separate so the same loss is not counted twice.

The argument survives honest arithmetic. A stale promise creates avoidable decisions, reapproval and support work even when checkout prevents the financial loss. A duplicate order creates a different class of work. Measure its incidence separately before attaching a cost.

At low volume, eventual consistency can hide in a support queue. At seasonal peaks, it invoices you.

## Replay the failures in a test checkout

Use a test payment provider and inspect the merchant’s attempt, payment and order records. Make the failure observable at each boundary. The test passes when the composed system preserves the intended purchase and reports only what its evidence supports.

| Failure to introduce | Evidence that the system handled it |
| --- | --- |
| A delivery promise changes after discovery | Checkout presents current terms; changed material terms require new approval. |
| Terms change after approval but before payment | The old approval cannot authorize the changed purchase; checkout rejects or re-quotes before taking an incompatible action. |
| The first submit arrives late, alongside a retry | Both use the same attempt identity; only one order and intended charge result. |
| The reply is lost after order commit | Recovery returns the existing order; the agent creates no new purchase. |
| A worker stops after payment succeeds | Reconciliation recovers the payment outcome without an unverified second charge. |
| Status lookup is unavailable | The agent reports uncertainty, stops at its read budget and hands off a traceable case. |
| A conversion is sent by browser and server | Measurement deduplicates the event while the merchant still retains its independent order record. |

The stale fact, uncertain order and delayed report should be tested together as well as separately. A team can pass every component test and still leave the shopper trying to reconcile the whole purchase.

## Who pays for the gaps

### The firewall feedback loop

A merchant sees the sale; it also sees the correction, complaint and reconciliation work that follows. If the second grows faster than the first, restricting agent traffic can become a rational local decision. One blocked checkout is a compatibility problem. Many merchants making the same decision would become a marketplace problem. This is a failure path to watch, not a claim that such an exodus is happening.

### The optimization loop learns what it can observe

An advertiser can meet an attribution target while misunderstanding its commercial result. Delayed conversions, duplicated events, different audience populations and cancelled orders all change what a reported success means. Before blaming an auction, inspect the evidence feeding the conclusion. A distinct Wallet population does not by itself prove that ad bidding is biased or mispriced; it does defeat the assumption that one funnel measures the other.

### Delegation multiplies the recovery burden

Delegation raises the stakes. OpenAI’s Wallet announcement describes an ambition for purchases pre-approved within spending, category or time limits. As less human attention accompanies each transaction, recovery needs to become more explicit. A human checking an order history is a workable fallback; scaling unattended purchasing around that fallback leaves an obvious operational gap. [Wallet’s stated direction](https://openai.com/index/introducing-chatgpt-wallet/).

Authorization also has to survive the journey. A payment credential can enable a transaction without proving that the current item, delivery date or recurring obligation matches the shopper’s intent. The approved terms and the merchant’s final action need to remain connected. An audit should be able to follow that connection without reconstructing it from a persuasive conversation.

The platform delivers a user as part of its consistency mechanism whenever it asks that user to connect records the software could not conclusively connect. The shopper checks the receipt. The merchant corrects the campaign. The operator reconciles payment and order state. Each action may be sensible; together they describe the work still carried by people at the seams.

The modules are shipped. The system has to be judged by what happens between them.

## Sources and scope

Product behavior and availability were checked against primary documentation on **19 November 2026**. Eligibility and interfaces can change. The topology is a responsibility map; the quote, attempt and status API are a proposed merchant design. The diagrams do not expose OpenAI internals. The peak-season figures are illustrative assumptions. The platform requirements and projected failure paths are analysis and recommendations.

The linked product sources establish business-update delays, live-offer validation, approval limits, checkout recovery, ad eligibility, reporting timing and event deduplication. They do not establish a universal propagation SLA, the absence of private coordination services, a measured duplicate-order rate, or inevitable commercial harm.

For the mechanisms behind the recommendations, see [Gilbert and Lynch on CAP](https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf), [Amazon on safe retries and request identity](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/), [Stripe’s API idempotency contract](https://docs.stripe.com/api/idempotent_requests), and [Chris Richardson’s transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html). For related Harness material, continue with [API design](/learn/system-design/api-design), [ChatGPT Ads](/learn/system-design/chatgpt-ads), and the [reporting worked example](/learn/system-design/chatgpt-ads-reporting).
