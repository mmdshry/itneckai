import { ADVANCE_DEFAULT_HOURS_PER_SF, ADVANCE_TRADES, STANDARD_TRADES } from "./benchmarks";
import type { AdvanceInputs, StandardInputs, YesNo } from "./types";

function allNo<T extends string>(ids: readonly T[]): Record<T, YesNo> {
  return Object.fromEntries(ids.map((id) => [id, "No"])) as Record<T, YesNo>;
}

/** Yellow-cell example on Standard MEP Estimator. */
export const defaultStandardInputs: StandardInputs = {
  projectName: "Example School",
  squareFootage: 8000,
  floors: 2,
  projectType: "School",
  lod: "350",
  complexity: "Medium",
  pricingMode: "Competitive",
  clientType: "New",
  offshore: "ON",
  included: {
    ...allNo(STANDARD_TRADES),
    Plumbing: "Yes",
  },
};

/** Yellow-cell example on Advance Estimator. */
export const defaultAdvanceInputs: AdvanceInputs = {
  projectName: "",
  squareFootage: 34280,
  floors: 4,
  projectType: "Commercial",
  lod: "LOD 400",
  complexity: "Medium",
  offshore: "Off",
  offshoreShare: 0.5,
  onshoreRate: 95,
  offshoreRate: 42,
  pmMarkup: 0.12,
  bidDiscount: 0.15,
  includeMeetings: "Yes",
  meetingCount: 4,
  meetingRate: 1200,
  includeProcessPlan: "No",
  processPlanFee: 2500,
  included: {
    ...allNo(ADVANCE_TRADES),
    Plumbing: "Yes",
  },
  hoursPerSf: { ...ADVANCE_DEFAULT_HOURS_PER_SF },
};
