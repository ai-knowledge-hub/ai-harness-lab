export type Bidder = { name: string; bidPence: number; qualityPercent: number; eligible: boolean };
export const exampleBidders: Bidder[] = [
  { name: "Our retailer", bidPence: 200, qualityPercent: 90, eligible: true },
  { name: "Competitor A", bidPence: 300, qualityPercent: 50, eligible: true },
  { name: "Competitor B", bidPence: 150, qualityPercent: 80, eligible: true },
];

export function allocate(bidders: Bidder[]) {
  if (bidders.some(b => !Number.isInteger(b.bidPence) || b.bidPence < 0 || b.bidPence > 10000 || !Number.isInteger(b.qualityPercent) || b.qualityPercent < 0 || b.qualityPercent > 100)) throw new Error("Use bids from £0 to £100 and quality from 0 to 1, in hundredths.");
  // Integer score units make equal scores equal, including after input edits.
  const rows = bidders.map((b, index) => ({ ...b, index, scoreUnits: b.bidPence * b.qualityPercent }));
  const ranked = rows.filter(b => b.eligible && b.scoreUnits > 0).sort((a, b) => b.scoreUnits - a.scoreUnits || a.index - b.index);
  const winner = ranked[0] ?? null, runner = ranked[1] ?? null;
  const thresholdPence = winner && runner ? runner.scoreUnits / winner.qualityPercent : null;
  let minimumWinningPence = thresholdPence === null ? null : Math.ceil(thresholdPence);
  if (winner && runner && minimumWinningPence !== null && minimumWinningPence * winner.qualityPercent === runner.scoreUnits && winner.index > runner.index) minimumWinningPence++;
  return { rows, winner, runner, thresholdPence, minimumWinningPence, tied: Boolean(winner && runner && winner.scoreUnits === runner.scoreUnits) };
}

export const pacingPolicies = ["early", "even", "forecast"] as const;
export type PacingPolicy = typeof pacingPolicies[number];
export const pacingNames: Record<PacingPolicy, string> = { early: "Spend early", even: "Even split", forecast: "Follow the forecast" };
export function pace(policy: PacingPolicy, morningProbability = 2, eveningProbability = 5) {
  if (![morningProbability, eveningProbability].every(p => Number.isFinite(p) && p >= 0 && p <= 100)) throw new Error("Probabilities must be between 0% and 100%.");
  // A separate teaching model: £1 per opportunity; 800 available per period.
  const morning = policy === "early" ? 800 : policy === "even" || morningProbability === eveningProbability ? 500 : morningProbability > eveningProbability ? 800 : 200;
  const evening = 1000 - morning;
  return { policy, morning, evening, expectedPurchases: (morning * morningProbability + evening * eveningProbability) / 100 };
}

export type BudgetStrategy = "independent" | "atomic" | "allowances";
export function reserveBudget(strategy: BudgetStrategy, failedWorker = false) {
  const allowance = strategy === "allowances";
  const workers = [
    { name: "Worker A", observedPence: allowance ? 500 : 1000, committedPence: allowance ? 0 : 800 },
    { name: "Worker B", observedPence: allowance ? 500 : strategy === "atomic" ? 200 : 1000, committedPence: strategy === "independent" ? 800 : 0 },
  ];
  const committedPence = workers.reduce((total, worker) => total + worker.committedPence, 0);
  const explanation = strategy === "independent"
    ? "Both workers read £10 and approve £8. Commitments reach £16, exceeding the limit by £6."
    : strategy === "atomic"
      ? "A reserves £8 atomically. B sees £2 and cannot reserve another £8. The £10 reservation limit is protected."
      : "Each worker has a £5 allowance. Neither can approve an £8 request. The £10 is protected but stranded until allowances are safely reassigned.";
  const failure = !failedWorker ? ""
    : allowance ? " Worker A fails: its £5 allowance stays assigned until reconciliation; failure alone does not free it."
      : " Worker A fails after approval: retain its £8 commitment until the outcome is reconciled; do not automatically spend it again.";
  return { workers, committedPence, remainingPence: 1000 - committedPence, explanation: explanation + failure, billablePence: null };
}

export function reportObservation(basis: "interaction" | "conversion", snapshot: "tuesday" | "wednesday", correction = false) {
  const received = snapshot === "wednesday";
  const adjusted = received && correction;
  return {
    reportingDay: basis === "interaction" ? "Monday" : "Tuesday",
    eventState: received ? "The illustrated purchase record has arrived." : "The illustrated purchase has not happened yet; its record is unavailable.",
    mondayCount: received ? adjusted ? 10 : 11 : 8,
    correctionState: !correction ? "No later correction selected." : received ? "Separate hypothetical later correction: one previously counted purchase is removed, changing 11 to 10." : "The selected later correction has not occurred at this snapshot; the observed count stays 8.",
  };
}

export function estimateLift(treatmentPurchases = 300, controlPurchases = 250, customersPerGroup = 10000) {
  if (!Number.isInteger(customersPerGroup) || customersPerGroup <= 0 || ![treatmentPurchases, controlPurchases].every(n => Number.isInteger(n) && n >= 0 && n <= customersPerGroup)) throw new Error("Use valid purchase counts and a positive group size.");
  const treatment = treatmentPurchases / customersPerGroup, control = controlPurchases / customersPerGroup;
  const difference = treatment - control;
  const se = Math.sqrt((treatment * (1 - treatment) + control * (1 - control)) / customersPerGroup);
  return { treatment, control, difference, relativeLift: control === 0 ? null : difference / control, low: difference - 1.96 * se, high: difference + 1.96 * se };
}

export const pounds = (pence: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
