import {
  GUARDRAIL_SF,
  LABOR_OFFSHORE_BURDEN,
  LABOR_OFFSHORE_SHARE,
  LABOR_PM_BURDEN,
  LABOR_PM_SHARE,
  LABOR_REVIEW_THRESHOLD,
  MEDICAL_TRADE_ESCALATE,
  STANDARD_CLIENT_FACTOR,
  STANDARD_COMPLEXITY_FACTOR,
  STANDARD_LOD_FACTOR,
  STANDARD_OFFSHORE_FACTOR,
  STANDARD_PRICING_FACTOR,
  STANDARD_TRADE_BENCHMARKS,
  STANDARD_TRADES,
  STANDARD_TYPE_FACTOR,
} from "./benchmarks";
import type {
  FactorChip,
  StandardInputs,
  StandardResult,
  StandardTradeResult,
} from "./types";

/** Excel / Google Sheets ROUND(value, 0) for non-negative hours. */
export function excelRound(value: number): number {
  return Math.round(value);
}

export function standardFactors(input: StandardInputs): FactorChip[] {
  return [
    { label: `LOD ${input.lod}`, factor: STANDARD_LOD_FACTOR[input.lod] },
    {
      label: `${input.complexity} complexity`,
      factor: STANDARD_COMPLEXITY_FACTOR[input.complexity],
    },
    {
      label: input.projectType,
      factor: STANDARD_TYPE_FACTOR[input.projectType],
    },
    {
      label: input.pricingMode,
      factor: STANDARD_PRICING_FACTOR[input.pricingMode],
    },
    {
      label: `Offshore ${input.offshore}`,
      factor: STANDARD_OFFSHORE_FACTOR[input.offshore],
    },
    {
      label: `${input.clientType} client`,
      factor: STANDARD_CLIENT_FACTOR[input.clientType],
    },
  ];
}

export function calculateStandard(input: StandardInputs): StandardResult {
  const factors = standardFactors(input);
  const combinedFactor = factors.reduce((acc, item) => acc * item.factor, 1);
  const sf = Math.max(0, input.squareFootage);

  const trades: StandardTradeResult[] = STANDARD_TRADES.map((id) => {
    const included = input.included[id] === "Yes";
    const bench = STANDARD_TRADE_BENCHMARKS[id];
    const adjPerSf = included ? bench.basePerSf * combinedFactor : 0;
    const price = included ? sf * adjPerSf : 0;
    const hours = included
      ? excelRound((sf / 1000) * bench.hoursPer1000Sf)
      : 0;
    return {
      id,
      included,
      basePerSf: bench.basePerSf,
      adjPerSf,
      price,
      hours,
    };
  });

  const recommendedBid = trades.reduce((sum, row) => sum + row.price, 0);
  const estimatedHours = trades.reduce((sum, row) => sum + row.hours, 0);
  const includedCount = trades.filter((row) => row.included).length;
  const lod350 = input.lod === "350";
  const highComplexity = input.complexity === "High";
  const largeJob = sf > GUARDRAIL_SF;
  const medicalStack =
    input.projectType === "Medical" && includedCount >= MEDICAL_TRADE_ESCALATE;

  const confidence =
    lod350 && highComplexity && largeJob
      ? "Low"
      : lod350 || highComplexity || largeJob
        ? "Medium"
        : "High";

  const winProbability =
    input.pricingMode === "Aggressive"
      ? "High"
      : input.pricingMode === "Competitive"
        ? "Medium"
        : "Low";

  const pricingStrategy =
    input.pricingMode === "Aggressive"
      ? "Lean pricing to win"
      : input.pricingMode === "Margin Protect"
        ? "Protect margin on complex scope"
        : "Balanced market pricing";

  const pmGuardrail =
    (lod350 && highComplexity) || medicalStack || largeJob
      ? "Escalate to PM"
      : "Sales can price";

  const offshoreHours = estimatedHours * LABOR_OFFSHORE_SHARE;
  const pmHours = estimatedHours * LABOR_PM_SHARE;
  const laborExpense =
    offshoreHours * LABOR_OFFSHORE_BURDEN + pmHours * LABOR_PM_BURDEN;
  const laborMargin = recommendedBid - laborExpense;

  return {
    trades,
    factors,
    combinedFactor,
    recommendedBid,
    totalPerSf: sf > 0 ? recommendedBid / sf : 0,
    estimatedHours,
    confidence,
    winProbability,
    pricingStrategy,
    pmGuardrail,
    notes:
      input.offshore === "ON"
        ? "Offshore team enabled"
        : "Offshore team not used",
    offshoreHours,
    pmHours,
    laborExpense,
    laborMargin,
    laborNeedsReview: laborMargin < LABOR_REVIEW_THRESHOLD,
  };
}
