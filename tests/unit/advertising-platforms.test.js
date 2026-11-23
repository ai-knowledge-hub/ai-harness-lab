import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allocate, exampleBidders, pace, pacingPolicies, reserveBudget, reportObservation, estimateLift } from "../../src/content/advertising-platform-models";
import { platformSources } from "../../src/content/advertising-platform-sources";

describe("reviewed advertising-platform lesson", () => {
  const source = readFileSync("tests/fixtures/advertising-platforms-reviewed-v3.1.md", "utf8");
  const authored = readFileSync("src/content/lessons/advertising-platforms.mdx", "utf8");
  const tightening = JSON.parse(readFileSync("tests/fixtures/advertising-platforms-tightening.json", "utf8"));
  it("preserves reviewed words and calculations outside the explicitly approved tightening", () => {
    let actual = authored.slice(authored.indexOf("A retailer has"), authored.indexOf("\n## Source register"));
    actual = actual.replace(/<PlatformCitation source="(S\d+)" \/>/g, "[$1]")
      .replace(/<PlatformVisual kind="[a-z]+" \/>/g, "")
      .replace(/<span [^>]*\/>/g, "")
      .replaceAll("bᵢ", "\\(b_i\\)").replaceAll("qᵢ", "\\(q_i\\)");
    const equations = {
      contribution: "0.05\\times£60=£3",
      ranking: "S_i=b_iq_i",
      threshold: "b_{\\text{threshold}}=\\frac{1.50}{0.9}\\approx£1.67",
      lift: "3.0\\%-2.5\\%=0.5\\text{ percentage points}",
    };
    for (const [kind, latex] of Object.entries(equations)) actual = actual.replace(`<LessonEquation kind="${kind}" />`, `\\[\n${latex}\n\\]`);
    const expected = source.slice(source.indexOf("A retailer has"), source.indexOf("\n---\n\n## Source register"));
    const normalize = text => text.replace(/^## \d+\. /gm, "## ").replaceAll(" — ", ": ").replace(/\s+/g, " ").trim();
    let approved = normalize(expected);
    for (const { before, after } of tightening) {
      const original = normalize(before);
      expect(approved.split(original)).toHaveLength(2);
      approved = normalize(approved.replace(original, normalize(after)));
    }
    expect(normalize(actual)).toBe(approved);
    expect(authored).not.toContain("—");
    expect(authored.match(/```text[\s\S]*?```/g)).toEqual(source.match(/```text[\s\S]*?```/g));
  });
  it("resolves all source placeholders and retains the four precision corrections", () => {
    const ids = [...authored.matchAll(/<PlatformCitation source="(S\d+)"/g)].map(match => match[1]);
    expect(new Set(ids).size).toBe(11);
    for (const id of ids) expect(platformSources[id].url).toMatch(/^https:\/\//);
    expect(platformSources.S2.url).toBe("https://doi.org/10.1287/mnsc.2018.3174");
    expect(platformSources.S7.url).toContain("metrics.conversions_by_conversion_date");
    expect(platformSources.S11.url).toContain("bid-manager/guides/faq");
    for (const phrase of ["eligibility and placement", "strictly higher score", "CPM units", "intention-to-treat effect"]) expect(authored).toContain(phrase);
    expect(authored).not.toMatch(/\[S\d+\]/);
  });
});

describe("allocation teaching model", () => {
  it("separates the highest bid, winning score and competitive threshold", () => {
    const result = allocate(exampleBidders);
    expect(result.winner.name).toBe("Our retailer");
    expect(result.thresholdPence).toBeCloseTo(166.6666667);
    expect(result.minimumWinningPence).toBe(167);
    expect(result.winner.bidPence).toBeLessThan(exampleBidders[1].bidPence);
  });
  it("excludes disqualified and nonpositive scores, including an empty auction", () => {
    expect(allocate(exampleBidders.map(b => ({ ...b, eligible: false }))).winner).toBeNull();
    expect(allocate(exampleBidders.map(b => ({ ...b, qualityPercent: 0 }))).winner).toBeNull();
    expect(allocate(exampleBidders.map((b, i) => ({ ...b, eligible: i !== 0 }))).winner.name).toBe("Competitor A");
    expect(allocate([exampleBidders[0]]).thresholdPence).toBeNull();
  });
  it("uses a deterministic tie rule and returns the smallest winning penny bid", () => {
    const result = allocate([{ name: "Earlier", bidPence: 100, qualityPercent: 100, eligible: true }, { name: "Later", bidPence: 201, qualityPercent: 50, eligible: true }]);
    expect(result.winner.name).toBe("Later");
    expect(result.thresholdPence).toBe(200);
    expect(result.minimumWinningPence).toBe(201);
    const tie = allocate([{ ...exampleBidders[0], bidPence: 200, qualityPercent: 100 }, { ...exampleBidders[1], bidPence: 200, qualityPercent: 100 }]);
    expect(tie.tied).toBe(true);
    expect(tie.winner.name).toBe("Our retailer");
  });
  it("never ranks a smaller score above a larger eligible score across the input range", () => {
    for (const bidPence of [0, 1, 99, 200, 9999, 10000]) for (const qualityPercent of [0, 1, 50, 90, 100]) {
      const result = allocate([{ ...exampleBidders[0], bidPence, qualityPercent }, ...exampleBidders.slice(1)]);
      for (const row of result.rows.filter(row => row.eligible)) expect(result.winner.scoreUnits).toBeGreaterThanOrEqual(row.scoreUnits);
    }
    expect(() => allocate([{ ...exampleBidders[0], bidPence: NaN }])).toThrow();
  });
});

describe("pacing, reservations and observation boundaries", () => {
  it("keeps the £1,000 envelope and opportunity capacities under every policy", () => {
    for (const policy of pacingPolicies) for (const morning of [0, 2, 50, 100]) for (const evening of [0, 5, 50, 100]) {
      const result = pace(policy, morning, evening);
      expect(result.morning + result.evening).toBe(1000);
      expect(Math.max(result.morning, result.evening)).toBeLessThanOrEqual(800);
      expect(result.expectedPurchases).toBeGreaterThanOrEqual(0);
      expect(result.expectedPurchases).toBeLessThanOrEqual(1000);
    }
    expect(pace("early").expectedPurchases).toBe(26);
    expect(pace("even").expectedPurchases).toBe(35);
    expect(pace("forecast").expectedPurchases).toBe(44);
    expect(() => pace("even", -1)).toThrow();
  });
  it("exposes overspending versus safe but stranded allowances without inventing a charge", () => {
    expect(reserveBudget("independent").committedPence).toBe(1600);
    expect(reserveBudget("atomic").committedPence).toBe(800);
    expect(reserveBudget("allowances").committedPence).toBe(0);
    for (const strategy of ["independent", "atomic", "allowances"]) {
      expect(reserveBudget(strategy, true).committedPence).toBe(reserveBudget(strategy).committedPence);
      expect(reserveBudget(strategy, true).billablePence).toBeNull();
      expect(reserveBudget(strategy, true).explanation).toMatch(/reconcil/);
    }
  });
  it("changes an event's date basis without fabricating aggregate conversion-date totals", () => {
    expect(reportObservation("interaction", "wednesday").reportingDay).toBe("Monday");
    expect(reportObservation("conversion", "wednesday").reportingDay).toBe("Tuesday");
    expect(reportObservation("conversion", "wednesday").mondayCount).toBe(11);
    expect(reportObservation("interaction", "tuesday", true).mondayCount).toBe(8);
    expect(reportObservation("interaction", "wednesday", true).mondayCount).toBe(10);
  });
  it("calculates the assignment-based lift and approximate interval with explicit zero-control handling", () => {
    const result = estimateLift();
    expect(result.treatment).toBe(0.03);
    expect(result.control).toBe(0.025);
    expect(result.difference * 100).toBeCloseTo(0.5);
    expect(result.relativeLift).toBeCloseTo(0.2);
    expect(result.low * 100).toBeCloseTo(0.0468, 3);
    expect(result.high * 100).toBeCloseTo(0.9532, 3);
    expect(estimateLift(0, 0).relativeLift).toBeNull();
    expect(() => estimateLift(10001, 250)).toThrow();
  });
});
