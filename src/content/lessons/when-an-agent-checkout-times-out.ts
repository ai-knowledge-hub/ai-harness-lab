import type { Guide } from "../guide-types";

export const agentCheckoutTimeoutGuide = {
  id: "when-an-agent-checkout-times-out",
  path: "/learn/system-design/when-an-agent-checkout-times-out",
  title: "When an Agent Checkout Times Out",
  shortTitle: "Agent checkout timeout",
  description: "Follow a stale delivery promise through checkout, then verify whether the merchant created an order before trying again.",
  trackId: "system-design",
  kind: "case",
  publicationStatus: "draft",
  format: "Worked example",
  readingMinutes: 7,
  updatedAt: "2026-11-18",
  introduction: "It’s 12 December. A shopping agent finds an $89 coffee grinder advertised for Christmas delivery. At checkout, the merchant gives a later date. The shopper accepts it, the agent submits the order, and the request times out. The shop might already have the order. What can the agent verify before it takes another action?",
  objectives: [
    "Recheck a delivery promise and bind the shopper’s approval to the revised terms.",
    "Distinguish a timed-out request from a failed purchase.",
    "Use merchant evidence to return an existing order, safely resume the same attempt, or hand off an unresolved case.",
  ],
  prerequisiteConceptIds: ["http-basics"],
  conceptIds: ["api-contracts"],
  projectIds: [],
  platformIds: [],
  publicationIds: [],
  capabilityIds: [],
  videoIds: [],
  relatedGuideIds: ["api-design"],
  sections: [
    {
      id: "recheck-the-delivery-promise",
      title: "Recheck the delivery promise",
      blocks: [
        {
          type: "paragraph",
          text: "The catalogue still says delivery by 24 December. At checkout, the merchant checks the grinder variant, stock, shipping address and delivery capacity. The current quote is $89 including shipping, with delivery by 28 December. The agent shows the new date and waits. The shopper decides the grinder will still make a good gift and approves the revised terms.",
        },
        {
          type: "paragraph",
          text: "Give the quote an identifier and an expiry. In this example, quote q18 records the item, quantity, delivered total and currency, shipping destination and delivery date. The merchant binds the shopper’s approval to those terms. At submission, checkout verifies the approval and reserves the stock and delivery capacity for those terms before it starts payment. If the date or any other material term changes again, show the new quote and ask the shopper to approve it.",
        },
        {
          type: "callout",
          title: "Where the delivery date comes from",
          text: "The agent can use the catalogue to find a candidate. The merchant’s live checkout supplies the delivery terms for this item and destination. The shopper decides whether those terms still meet their needs.",
        },
      ],
    },
    {
      id: "trace-the-timeout",
      title: "Trace the checkout timeout",
      blocks: [
        {
          type: "paragraph",
          text: "In this fictional merchant API, approving q18 creates a durable checkout attempt, att-42. The agent saves that reference before submitting. It represents one intended purchase and gives both the checkout service and the agent a way to recognise it after a restart.",
        },
        {
          type: "table",
          columns: ["Time on 12 December", "What the merchant records", "What the agent sees"],
          rows: [
            ["10:02:00", "Quote q18 approved. Attempt att-42 is ready.", "Shopper approved $89 and delivery by 28 December."],
            ["10:02:03", "Checkout claims att-42 for processing.", "Submit request sent."],
            ["10:02:06", "Payment succeeds. Checkout saves order ord-704 against att-42 and commits the order.", "Still waiting for a reply."],
            ["10:02:13", "Order ord-704 is confirmed.", "The request times out. Order outcome unknown to the agent."],
            ["10:02:14", "Status lookup returns confirmed and ord-704.", "Agent can show the existing confirmation."],
          ],
        },
        {
          type: "paragraph",
          text: "At 10:02:13 the agent knows it stopped waiting. The merchant may have received the request, started payment or committed the order. A late email or a pending card authorisation adds evidence but cannot settle all three questions. Ask the merchant for the state of this purchase attempt.",
        },
      ],
    },
    {
      id: "look-up-the-order-before-retrying",
      title: "Look up the order before retrying",
      blocks: [
        {
          type: "code",
          label: "The status lookup in the worked example",
          language: "HTTP",
          code: "POST /checkout-attempts/att-42/submit\n→ Client times out waiting for the response\n\nGET /checkout-attempts/att-42\n→ 200 OK\n{ \"state\": \"confirmed\", \"order_id\": \"ord-704\" }",
        },
        {
          type: "paragraph",
          text: "This read-only lookup uses the merchant’s checkout record. The server authenticates the caller and checks that they can see this attempt for this shopper and merchant. The reference helps find the record. Access still depends on the caller’s authority.",
        },
        {
          type: "table",
          columns: ["What the lookup establishes", "What the agent does"],
          rows: [
            ["Confirmed, with an order reference", "Return the existing order confirmation. End the purchase attempt."],
            ["Ready, with a current approval", "Resubmit the same attempt with the same terms if the checkout contract treats repeated submissions as one operation. The delayed first request may still arrive."],
            ["Processing or unresolved payment", "Check status again within a short, bounded wait. If it remains unresolved, hand off the attempt reference to merchant support."],
            ["Quote changed or expired before processing began", "Verify that the old attempt is terminal with no payment or order. Then get a new quote and shopper approval before starting a replacement."],
            ["Lookup unavailable or record missing", "Keep the outcome unknown. Use the merchant’s order history or support to resolve it."],
          ],
        },
        {
          type: "callout",
          title: "What the shopper sees while you check",
          text: "“The checkout timed out. I’m checking whether the shop placed your order.” When the lookup confirms it, report the order reference and the merchant’s delivery terms. If the lookup stays inconclusive, tell the shopper it is still unclear whether the order went through and give them the attempt reference for support.",
        },
      ],
    },
    {
      id: "make-a-repeat-submit-safe",
      title: "Make a repeat submission safe",
      blocks: [
        {
          type: "paragraph",
          text: "On the merchant side, claim att-42 atomically before starting payment so that two requests for the same attempt cannot both start it. While one worker is processing, a second request returns that state. After completion, it returns the saved result. Enforce the one-order-per-attempt rule in the order store and reject a repeat submit with changed terms. Keep the same attempt reference across worker restarts. A new reference identifies a separate purchase.",
        },
        {
          type: "paragraph",
          text: "Payment has its own failure boundary. A worker can lose the processor’s reply or stop after payment succeeds and before the merchant saves the order. Persist the processor request reference before calling it and use that provider’s idempotency and status rules. Idempotency means repeating the same operation under its contract has the same intended effect as doing it once. If payment is uncertain, keep the attempt open for reconciliation. The merchant matches the processor outcome to its order record and resolves any paid attempt that lacks an order. If the provider’s retry window has expired, verify the existing payment with the provider or hand it off for reconciliation.",
          source: {
            title: "Stripe’s idempotency rules and retention window",
            href: "https://docs.stripe.com/api/idempotent_requests",
          },
        },
        {
          type: "paragraph",
          text: "This example gives the merchant control of both submit and lookup. In a browser-only checkout, the agent may have only the confirmation screen, the shopper’s order history or merchant support. OpenAI’s Wallet guidance tells the shopper to check for merchant confirmation before trying again when the result is unclear. Use the checks available in that checkout and hand off if they cannot settle the outcome.",
          source: {
            title: "OpenAI’s Wallet purchase and confirmation guidance",
            href: "https://help.openai.com/en/articles/20001654-making-purchases-with-chatgpt-wallet",
          },
        },
      ],
    },
    {
      id: "replay-the-failures",
      title: "Replay the failures in a test checkout",
      blocks: [
        {
          type: "paragraph",
          text: "Use one grinder, a test payment provider and a way to inspect the merchant’s attempt, payment and order records. Change where the failure occurs and compare the records with what the agent tells the shopper.",
        },
        {
          type: "table",
          columns: ["Failure to introduce", "Evidence that the checkout handled it"],
          rows: [
            ["Change the promised date after approval and before checkout starts payment.", "The old approval produces zero orders and zero charges. The agent presents the revised terms."],
            ["Hold the first submission in transit through the status lookup. Release it alongside the repeat submit.", "The lookup initially returns ready. Only one request claims att-42. The final records show one order and one successful charge."],
            ["Drop the response immediately after the merchant commits the order.", "Lookup returns ord-704. The agent reports it and issues no new submit. The final records show one order and one successful charge."],
            ["Interrupt the worker after payment succeeds but before the order is saved.", "The agent reports that it is checking the order. The merchant reconciles the existing payment. The test records show no second charge while the outcome is unresolved."],
            ["Make status lookup unavailable after a timed-out submit.", "The agent stops after its read budget and hands off the attempt. It claims neither purchase success nor failure and sends no new submit."],
          ],
        },
        {
          type: "paragraph",
          text: "The checkout passes when a stale promise cannot authorise a purchase, a lost reply cannot turn one purchase into two, and the shopper hears only what the records support.",
        },
      ],
    },
  ],
} satisfies Guide;

export default agentCheckoutTimeoutGuide;
