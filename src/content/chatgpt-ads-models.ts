// Hypothetical teaching states. These are neither provider events nor schemas.
export const intentStates = [
  { id: "training", label: "Training plan", message: "How should I prepare for my first half-marathon?", history: "No earlier constraints in this example.", goal: "Plan training", implication: "No specific product need has emerged." },
  { id: "weather", label: "Wet weather", message: "Most of my training will be outdoors, including in rainy weather.", history: "The runner is preparing for a half-marathon.", goal: "Adapt training to outdoor conditions", implication: "Weather is relevant context; it does not establish purchase intent." },
  { id: "shoes", label: "Worn-out shoes", message: "My current shoes are worn out. What should I look for in a replacement?", history: "Longer outdoor training runs, sometimes in wet weather.", goal: "Explore replacement running shoes", implication: "Footwear candidates may be useful; eligibility and timing remain separate." },
  { id: "price", label: "Under £120", message: "Preferably under £120.", history: "The preceding messages concerned replacement running shoes for outdoor training.", goal: "Explore replacement shoes with a price preference", implication: "Relevant history makes the incomplete message interpretable." },
  { id: "withdrawn", label: "Purchase intent withdrawn", message: "Actually, forget buying shoes. I want to understand how to avoid knee injuries.", history: "Shoe exploration and the £120 preference belong to an abandoned objective.", goal: "Understand injury prevention", implication: "Stale context: the earlier shopping objective must not drive current footwear selection." },
  { id: "missing", label: "Same phrase, missing history", message: "Preferably under £120.", history: "The preceding conversation is unavailable in this comparison.", goal: "Cannot identify the object of the price preference", implication: "Missing context: the price alone does not identify a product or an advertising opportunity." },
] as const;

export const orchestrationSteps = [
  { id: "retrieve", title: "Prepare queries and retrieve", detail: "Interpret current commercial intent, prepare queries and retrieve candidates from specialised indices. This describes responsibilities, not an internal endpoint name." },
  { id: "eligibility", title: "Check candidate eligibility", detail: "Targeting, policy, campaign and creative availability, budget, pacing and placement constraints can remove a relevant candidate." },
  { id: "quality", title: "Evaluate relevance and quality", detail: "Semantic fit, engagement predictions and historical performance can inform candidate evaluation. No complete scoring formula is supplied." },
  { id: "auction", title: "Nominate candidates to the auction", detail: "The orchestrator nominates candidates. The auction has authority over final admission, pacing, bid-related computation, quality-adjusted ranking, pricing and selection." },
  { id: "context", title: "Check the selected ad in context", detail: "A final contextual check can reject an auction winner. Selection alone is not permission to send, display or bill." },
] as const;
type Step = typeof orchestrationSteps[number]["id"];
export const orchestrationScenarios: { id: string; label: string; path: Step[]; outcome: string }[] = [
  { id: "eligible", label: "Eligible candidate", path: ["retrieve", "eligibility", "quality", "auction", "context"], outcome: "The candidate passes the illustrated checks. Sending and display still depend on the delivery boundaries." },
  { id: "ineligible", label: "Relevant but ineligible", path: ["retrieve", "eligibility"], outcome: "The shoe candidate is relevant but targets another country. Eligibility rejects it before an auction nomination." },
  { id: "empty", label: "Empty candidate set", path: ["retrieve"], outcome: "Retrieval finds no candidates. There is no candidate to evaluate or nominate to the auction." },
  { id: "revised", label: "Clarification and revised retrieval", path: ["retrieve", "retrieve", "eligibility", "quality", "auction", "context"], outcome: "The runner clarifies easy training rather than racing. The orchestrator revises its queries and retrieves again; this loop is not six mandatory tool calls." },
  { id: "rejected", label: "Winner rejected contextually", path: ["retrieve", "eligibility", "quality", "auction", "context"], outcome: "The auction selects a winner, but the final contextual review rejects it. No placement is sent in this branch." },
];

export type DeliveryInput = { server: "ready" | "timeout"; context: "pass" | "reject"; arrival: "on-time" | "late" };
type DeliveryOutcome = { id: "timeout" | "rejected" | "late" | "on-time"; title: string; detail: string; contextReached: boolean; arrivalReached: boolean; sent: boolean; displayEligible: boolean };
export function deliveryOutcome(input: DeliveryInput): DeliveryOutcome {
  if (input.server === "timeout") return { id: "timeout", title: "Server-side timeout", detail: "No completed placement is sent. Contextual review and frontend arrival are not reached in this experiment.", contextReached: false, arrivalReached: false, sent: false, displayEligible: false };
  if (input.context === "reject") return { id: "rejected", title: "Contextual rejection", detail: "The selected candidate is blocked before sending. Frontend arrival is not reached.", contextReached: true, arrivalReached: false, sent: false, displayEligible: false };
  if (input.arrival === "late") return { id: "late", title: "Sent but not displayed", detail: "The creative and neutral preamble were sent, but arrived after the display window. Sending does not establish an impression.", contextReached: true, arrivalReached: true, sent: true, displayEligible: false };
  return { id: "on-time", title: "Eligible for display; confirmation separate", detail: "The bundle arrives within the display window after passing review. Actual display and acknowledgement still require evidence; billing is not inferred.", contextReached: true, arrivalReached: true, sent: true, displayEligible: true };
}

export const independentStates = [
  { id: "ready", label: "Ad selection completes", result: "An optional sponsored placement can proceed to its delivery checks." },
  { id: "slow", label: "Ad selection is slow", result: "The organic answer does not wait. The advertising opportunity may expire." },
  { id: "unavailable", label: "Advertising service unavailable", result: "No ad result is available. The organic answer remains on its independent path." },
  { id: "empty", label: "No suitable ad", result: "The advertising path returns no suitable candidate. The organic answer remains available." },
] as const;

export const diagnosticStates = [
  { id: "ineligible", label: "Ineligible turn", evidence: "An eligibility decision ends the opportunity before a serving session proceeds.", operations: "Inspect turn eligibility; do not diagnose this as a failed retrieval.", quality: "Was declining the opportunity appropriate for the current conversation?", business: "No ad display is established. Campaign reporting is not an internal eligibility trace." },
  { id: "no-retrieval", label: "Session without retrieval", evidence: "A session starts, but no retrieval is requested.", operations: "Distinguish a deliberate stop from a retrieval tool failure.", quality: "Was there enough current commercial intent to justify retrieval?", business: "The session alone establishes neither an impression nor advertiser spend." },
  { id: "empty", label: "Empty retrieval", evidence: "A retrieval request completes with no candidates.", operations: "Investigate query interpretation and inventory coverage before auction pricing.", quality: "Could a better query retrieve suitable inventory for the actual objective?", business: "An empty retrieval result is not a campaign-performance row or an impression." },
  { id: "eligibility", label: "Hydration or eligibility rejection", evidence: "Candidates are retrieved but cannot be hydrated or fail serving constraints.", operations: "Inspect availability, targeting, policy, budget or other applicable constraints.", quality: "Keep topical relevance separate from eligibility.", business: "Retrieved candidates do not establish displayed advertisements or billable events." },
  { id: "context", label: "Contextual rejection", evidence: "A selected candidate fails the final contextual review before sending.", operations: "Identify the final review outcome rather than classifying this as empty retrieval.", quality: "Was the selected ad suitable for the immediate conversation?", business: "An auction winner is not evidence of a user-facing impression." },
  { id: "timeout", label: "Server-side timeout", evidence: "No completed placement is sent before the server-side deadline.", operations: "Investigate work completion against the server-side deadline.", quality: "A missing placement alone cannot tell you whether the candidates were relevant.", business: "The lack of display cannot be attributed to poor creative from this evidence alone." },
  { id: "late", label: "Late frontend arrival", evidence: "A bundle is sent but misses the frontend display window.", operations: "Separate sending from frontend arrival and display.", quality: "Relevance and auction validity do not establish timely delivery.", business: "A send record alone does not establish an impression, acknowledgement or charge." },
  { id: "displayed", label: "Displayed result", evidence: "The illustrative trace contains display evidence; acknowledgement and later interactions are separate observations.", operations: "Inspect display, acknowledgement and interaction evidence separately.", quality: "Use appropriate feedback; display alone does not prove usefulness.", business: "Use the published reporting contract. Attributed conversions do not establish incremental purchases." },
] as const;
