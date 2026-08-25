import {
  ADVANCE_COMPLEXITY_FACTOR,
  ADVANCE_LOD_FACTOR,
  ADVANCE_TRADE_NOTES,
  ADVANCE_TRADES,
  ADVANCE_TYPE_FACTOR,
  FLOOR_PREMIUM_PER_LEVEL,
} from "./benchmarks";
import type {
  AdvanceInputs,
  AdvanceResult,
  AdvanceTradeResult,
  FactorChip,
} from "./types";

export function advanceFactors(input: AdvanceInputs): {
  factors: FactorChip[];
  floorMultiplier: number;
} {
  const extraFloors = Math.max(0, input.floors - 1);
  const floorMultiplier = 1 + extraFloors * FLOOR_PREMIUM_PER_LEVEL;
  return {
    floorMultiplier,
    factors: [
      {
        label: input.projectType,
        factor: ADVANCE_TYPE_FACTOR[input.projectType],
      },
      { label: input.lod, factor: ADVANCE_LOD_FACTOR[input.lod] },
      {
        label: `${input.complexity} complexity`,
        factor: ADVANCE_COMPLEXITY_FACTOR[input.complexity],
      },
      { label: "Extra floors", factor: floorMultiplier },
    ],
  };
}

export function blendedBillingRate(input: AdvanceInputs): number {
  if (input.offshore !== "On") return input.onshoreRate;
  const share = Math.min(1, Math.max(0, input.offshoreShare));
  return input.onshoreRate * (1 - share) + input.offshoreRate * share;
}

export function calculateAdvance(input: AdvanceInputs): AdvanceResult {
  const { factors, floorMultiplier } = advanceFactors(input);
  const typeFactor = ADVANCE_TYPE_FACTOR[input.projectType];
  const lodFactor = ADVANCE_LOD_FACTOR[input.lod];
  const complexityFactor = ADVANCE_COMPLEXITY_FACTOR[input.complexity];
  const sf = Math.max(0, input.squareFootage);
  const rate = blendedBillingRate(input);
  const markup = 1 + Math.max(0, input.pmMarkup);
  const discount = 1 - Math.min(1, Math.max(0, input.bidDiscount));

  const trades: AdvanceTradeResult[] = ADVANCE_TRADES.map((id) => {
    const included = input.included[id] === "Yes";
    const hoursPerSf = Math.max(0, input.hoursPerSf[id]);
    const hours = included
      ? hoursPerSf * sf * typeFactor * lodFactor * complexityFactor * floorMultiplier
      : 0;
    const baseCost = hours * rate * markup;
    const discountedCost = baseCost * discount;
    return {
      id,
      note: ADVANCE_TRADE_NOTES[id],
      included,
      hoursPerSf,
      hours,
      blendedRate: rate,
      baseCost,
      discountedCost,
    };
  });

  const modelingTotal = trades.reduce((sum, row) => sum + row.discountedCost, 0);
  const coordinationTotal =
    input.includeMeetings === "Yes"
      ? Math.max(0, input.meetingCount) * Math.max(0, input.meetingRate)
      : 0;
  const processPlanTotal =
    input.includeProcessPlan === "Yes" ? Math.max(0, input.processPlanFee) : 0;
  const grandTotal = modelingTotal + coordinationTotal + processPlanTotal;
  const totalHours = trades.reduce((sum, row) => sum + row.hours, 0);

  return {
    trades,
    factors,
    floorMultiplier,
    blendedRate: rate,
    modelingTotal,
    coordinationTotal,
    processPlanTotal,
    grandTotal,
    pricePerSf: sf > 0 ? grandTotal / sf : 0,
    totalHours,
  };
}
