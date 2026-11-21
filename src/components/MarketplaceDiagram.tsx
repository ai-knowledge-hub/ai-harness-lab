import type { CSSProperties } from "react";

type Node = { id: string; x: number; y: number; w?: number; h?: number; label: string; title: string; detail: string; uncertain?: boolean };
type Edge = { path: string; dashed?: boolean; label?: string; x?: number; y?: number };
type Diagram = { number: string; title: string; height: number; nodes: Node[]; edges: Edge[]; lanes?: { text: string; x: number; y: number }[]; steps: string[]; note: string };

const diagrams: Record<string, Diagram> = {
  partition: {
    number: "01", title: "One unit. Two replicas. A broken connection.", height: 625,
    lanes: [{ text: "THE REPLICAS BEGIN WITH THE SAME STOCK", x: 24, y: 25 }, { text: "TWO POSSIBLE RESERVATION CONTRACTS", x: 24, y: 275 }],
    nodes: [
      { id: "london", x: 24, y: 55, w: 324, h: 140, label: "London · reservation accepted", title: "Available: 0", detail: "The final grinder has been claimed." },
      { id: "new-york", x: 452, y: 55, w: 324, h: 140, label: "New York · stale replica", title: "Available: 1", detail: "The update has not crossed the partition.", uncertain: true },
      { id: "accept", x: 24, y: 310, w: 354, h: 140, label: "Accept against the local copy", title: "Two promises. One grinder.", detail: "Both regions accept; the no-oversell guarantee is lost.", uncertain: true },
      { id: "wait", x: 422, y: 310, w: 354, h: 140, label: "Require authoritative agreement", title: "Reservation waits or fails", detail: "Protect the inventory invariant while the authority is unreachable." },
      { id: "page", x: 24, y: 490, w: 752, h: 110, label: "A different operation", title: "The product page can still be available", detail: "Browsing and reserving stock need different guarantees." },
    ],
    edges: [{ path: "M348 125H452", dashed: true, label: "UPDATE BLOCKED", x: 400, y: 220 }, { path: "M614 195V250H201V310", dashed: true }, { path: "M614 195V250H599V310" }],
    steps: ["Both replicas initially show one grinder. London reserves it, leaving zero available there.", "A network partition blocks the update; New York still shows one.", "Accepting a second reservation against that stale copy risks overselling. Requiring authoritative agreement may delay or refuse that reservation.", "The product page can stay readable while an unsafe reservation is unavailable. These are different operations."],
    note: "Illustrative replicated-inventory example. CAP applies to the reservation guarantee; it does not require taking the whole marketplace offline.",
  },
  lifecycle: {
    number: "02", title: "An order outlives the checkout response", height: 560,
    lanes: [{ text: "AN ILLUSTRATIVE BUSINESS LIFECYCLE", x: 24, y: 25 }],
    nodes: [
      { id: "created", x: 24, y: 55, w: 224, label: "01 · order record", title: "Created", detail: "An order exists; payment may not." },
      { id: "pending", x: 288, y: 55, w: 224, label: "02 · payment", title: "Payment pending", detail: "Authorization and capture are distinct." },
      { id: "paid", x: 552, y: 55, w: 224, label: "03 · payment recorded", title: "Paid", detail: "The business still has to deliver." },
      { id: "fulfil", x: 552, y: 235, w: 224, label: "04 · logistics", title: "Fulfilment pending", detail: "Prepare and allocate the shipment." },
      { id: "shipped", x: 288, y: 235, w: 224, label: "05 · dispatch", title: "Shipped", detail: "The parcel leaves the merchant." },
      { id: "delivered", x: 24, y: 235, w: 224, label: "06 · receipt", title: "Delivered", detail: "The delivery is completed." },
      { id: "exceptions", x: 24, y: 415, w: 752, h: 110, label: "Additional business paths", title: "Cancellation · expiry · refund · dispute", detail: "Each has its own permitted transitions and durable evidence.", uncertain: true },
    ],
    edges: [{ path: "M248 115H288" }, { path: "M512 115H552" }, { path: "M664 175V235" }, { path: "M552 295H512" }, { path: "M288 295H248" }, { path: "M400 175V210H790V390H400V415", dashed: true }],
    steps: ["The main path is created → payment pending → paid → fulfilment pending → shipped → delivered.", "Creation is not payment, and payment is not delivery. Authorization can precede capture.", "Cancellation, expiry, refund and dispute add other paths; their exact transitions depend on the merchant contract."],
    note: "A teaching model, not Taobao’s internal state machine. A durable order record carries the lifecycle even when an individual response is lost.",
  },
  coordination: {
    number: "03", title: "Reserve and resolve, or commit and compensate", height: 660,
    lanes: [{ text: "TCC · SERVICES EXPOSE RESERVATION OPERATIONS", x: 24, y: 25 }, { text: "SAGA · EACH STEP COMMITS LOCALLY", x: 24, y: 345 }],
    nodes: [
      { id: "try", x: 24, y: 110, w: 224, label: "Try", title: "Reserve the grinder", detail: "Validate and hold the resource." },
      { id: "confirm", x: 456, y: 55, w: 320, h: 100, label: "Successful resolution", title: "Confirm", detail: "Consume the reservation." },
      { id: "cancel", x: 456, y: 205, w: 320, h: 100, label: "Alternative resolution", title: "Cancel", detail: "Release the reservation.", uncertain: true },
      { id: "reserve", x: 24, y: 380, w: 224, label: "Local commit 1", title: "Reserve inventory", detail: "An effect has been committed." },
      { id: "order", x: 288, y: 380, w: 224, label: "Local commit 2", title: "Create the order", detail: "The order is now durable." },
      { id: "capture", x: 552, y: 380, w: 224, label: "Local commit 3", title: "Capture payment", detail: "A financial effect has happened." },
      { id: "compensate", x: 24, y: 555, w: 752, h: 80, label: "A later failure can trigger compensation", title: "Release inventory · cancel order · initiate refund", detail: "New business operations, each with its own outcome and recovery needs.", uncertain: true },
    ],
    edges: [{ path: "M248 170H352V105H456" }, { path: "M352 170V255H456", dashed: true }, { path: "M248 440H288" }, { path: "M512 440H552" }, { path: "M664 500V555", dashed: true }],
    steps: ["TCC: Try reserves inventory. Confirm consumes that reservation, or Cancel releases it. Participating services must implement these operations.", "Saga: inventory, order and payment steps commit locally. A later failure can require compensating operations.", "A refund is a new financial operation, not atomic rollback. Saga does not guarantee isolation.", "Both patterns need durable state, idempotent resolution, timeout rules and recovery. Neither automatically includes a remote payment in a local database transaction."],
    note: "Explanatory patterns for the same purchase. The arrows are illustrative; they do not specify Alibaba’s checkout implementation or a universal compensation order.",
  },
  events: {
    number: "04", title: "A repeated event should not become a second stock movement", height: 570,
    lanes: [{ text: "ILLUSTRATIVE MERCHANT INTEGRATION", x: 24, y: 25 }],
    nodes: [
      { id: "event", x: 24, y: 55, w: 224, label: "Marketplace", title: "Inventory changes", detail: "Publish one event identity and its state." },
      { id: "consumer", x: 288, y: 55, w: 224, label: "Merchant ERP", title: "Apply once", detail: "Record the event identity with its effect." },
      { id: "ack", x: 552, y: 55, w: 224, label: "Acknowledgement", title: "Reply is lost", detail: "The sender cannot establish receipt.", uncertain: true },
      { id: "repeat", x: 288, y: 255, w: 224, label: "Same event, delivered again", title: "Already processed", detail: "Do not deduct inventory again." },
      { id: "authority", x: 24, y: 430, w: 340, h: 110, label: "Authoritative API", title: "Retrieve current state", detail: "A notification announces a change." },
      { id: "reconcile", x: 424, y: 430, w: 352, h: 110, label: "Reconciliation", title: "Compare and repair", detail: "Resolve divergence the event path missed." },
    ],
    edges: [{ path: "M248 115H288" }, { path: "M512 115H552" }, { path: "M136 175V315H288", dashed: true, label: "REDELIVER SAME ID", x: 150, y: 280 }, { path: "M400 175V255", dashed: true }, { path: "M364 485H424" }, { path: "M600 430V210H400V175", dashed: true }],
    steps: ["The marketplace publishes an inventory-change event. The ERP records its identity and applies its effect once.", "If the acknowledgement disappears, the same event can arrive again. The stored identity prevents a second stock movement.", "A snapshot describes the resulting quantity; a delta describes the movement. Do not apply both as separate deductions.", "Retrieve authoritative state and reconcile periodically to detect delayed, missed or incorrectly handled updates."],
    note: "A hypothetical lost-acknowledgement scenario. TikTok’s documented identifiers and snapshots support this integration discipline; this diagram does not depict its internal transport.",
  },
  checkout: {
    number: "05", title: "The order can be certain while the agent remains uncertain", height: 825,
    lanes: [{ text: "ILLUSTRATIVE PURCHASE · FICTIONAL IDENTIFIERS", x: 24, y: 25 }],
    nodes: [
      { id: "approve", x: 24, y: 55, w: 224, label: "Shopper", title: "Approve quote q18", detail: "One grinder, $89, agreed delivery." },
      { id: "persist", x: 288, y: 55, w: 224, label: "Agent", title: "Persist attempt att-42", detail: "Save the identity before submission." },
      { id: "payment", x: 552, y: 55, w: 224, label: "Merchant → provider", title: "Process payment", detail: "Retain the provider reference." },
      { id: "commit", x: 552, y: 240, w: 224, label: "Merchant order system", title: "Commit ord-704", detail: "The business effect is durable." },
      { id: "lost", x: 288, y: 240, w: 224, label: "Reply lost in transit", title: "Timeout ≠ failure", detail: "The agent does not yet know.", uncertain: true },
      { id: "lookup", x: 24, y: 425, w: 354, h: 125, label: "Authorized recovery exists", title: "Look up att-42", detail: "Merchant state returns confirmed order ord-704." },
      { id: "unknown", x: 422, y: 425, w: 354, h: 125, label: "No authoritative result available", title: "Keep the outcome unknown", detail: "Check receipt, order history or support before another purchase.", uncertain: true },
      { id: "confirmed", x: 24, y: 640, w: 354, h: 130, label: "Evidence supports confirmation", title: "Return the existing order", detail: "No second purchase is created." },
      { id: "handoff", x: 422, y: 640, w: 354, h: 130, label: "Bounded recovery and ownership", title: "Hand off a traceable case", detail: "Preserve approved terms, attempt and payment references.", uncertain: true },
    ],
    edges: [{ path: "M248 115H288" }, { path: "M512 115H552" }, { path: "M664 175V240" }, { path: "M552 300H512", dashed: true }, { path: "M400 360V392H201V425" }, { path: "M400 392H599V425", dashed: true }, { path: "M201 550V640" }, { path: "M599 550V640", dashed: true }],
    steps: ["The shopper approves q18. The agent durably saves attempt att-42 and submits the purchase.", "The merchant processes payment and commits ord-704. The confirmation is lost, leaving the agent with an unknown outcome.", "An authenticated lookup, where supported, can recover the existing order. Only report confirmation when the returned evidence supports it.", "Without authoritative recovery, preserve uncertainty and use a receipt, order history or support route. Retrying is safe only under the merchant’s documented idempotency contract.", "A new purchase must not be used merely to escape the first purchase’s uncertainty."],
    note: "A proposed merchant recovery contract, not an OpenAI API or universal Wallet capability. q18, att-42 and ord-704 are fictional.",
  },
};

export function MarketplaceDiagram({ kind }: { kind: keyof typeof diagrams }) {
  const diagram = diagrams[kind];
  const id = `marketplace-${kind}`;
  return (
    <figure className="marketplace-diagram" data-diagram={kind}>
      <figcaption id={`${id}-caption`}><span>{diagram.number} /</span> {diagram.title}</figcaption>
      <p className="marketplace-diagram-hint" id={`${id}-hint`}>Scroll across to follow the diagram. A text explanation is available below.</p>
      <div className="marketplace-diagram-scroll" tabIndex={0} role="region" aria-labelledby={`${id}-caption`} aria-describedby={`${id}-hint`}>
        <div className="marketplace-diagram-map" style={{ minHeight: diagram.height }}>
          <svg width="800" height={diagram.height} viewBox={`0 0 800 ${diagram.height}`} aria-hidden="true" focusable="false">
            <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor" /></marker></defs>
            {diagram.edges.map((edge, index) => <path key={index} d={edge.path} className={edge.dashed ? "marketplace-edge marketplace-edge-uncertain" : "marketplace-edge"} markerEnd={`url(#${id}-arrow)`} />)}
          </svg>
          {diagram.lanes?.map((lane) => <p className="marketplace-lane" key={lane.text} style={{ left: lane.x, top: lane.y }}>{lane.text}</p>)}
          {diagram.edges.filter((edge) => edge.label).map((edge) => <span className="marketplace-edge-label" key={edge.label} style={{ left: edge.x, top: edge.y }}>{edge.label}</span>)}
          <ul className="marketplace-nodes" role="list" aria-label="Diagram components">
            {diagram.nodes.map((node) => <li key={node.id} data-node={node.id} className={node.uncertain ? "marketplace-node marketplace-node-uncertain" : "marketplace-node"} style={{ left: node.x, top: node.y, width: node.w ?? 224, minHeight: node.h ?? 120 } as CSSProperties}>
              <span>{node.label}</span><strong>{node.title}</strong><p>{node.detail}</p>
            </li>)}
          </ul>
        </div>
      </div>
      <p className="marketplace-diagram-note">{diagram.note}</p>
      <details className="marketplace-diagram-description"><summary>Read diagram {diagram.number} as text</summary><ol>{diagram.steps.map((step) => <li key={step}>{step}</li>)}</ol></details>
    </figure>
  );
}
