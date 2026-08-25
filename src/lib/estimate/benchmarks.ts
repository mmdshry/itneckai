import type {
  AdvanceComplexity,
  AdvanceLod,
  AdvanceProjectType,
  AdvanceTradeId,
  ClientType,
  PricingMode,
  StandardComplexity,
  StandardLod,
  StandardOffshore,
  StandardProjectType,
  StandardTradeId,
} from "./types";

export const STANDARD_TRADES: readonly StandardTradeId[] = [
  "Plumbing",
  "Electrical",
  "Low Voltage",
  "HVAC",
] as const;

export const ADVANCE_TRADES: readonly AdvanceTradeId[] = [
  "Plumbing",
  "HVAC Piping",
  "HVAC Mechanical",
  "Electrical Power/Site",
  "Electrical LV/Tech/FA",
] as const;

export const ADVANCE_TRADE_NOTES: Record<AdvanceTradeId, string> = {
  Plumbing: "Strong fit / usually competitive",
  "HVAC Piping": "Mechanical piping",
  "HVAC Mechanical": "Duct/mechanical modeling",
  "Electrical Power/Site": "Power + site scope",
  "Electrical LV/Tech/FA": "Low voltage / tech / FA",
};

/** Benchmarks sheet rows 2–5. Hours are midpoints of the MEP Guide ranges. */
export const STANDARD_TRADE_BENCHMARKS: Record<
  StandardTradeId,
  { basePerSf: number; hoursPer1000Sf: number; marketRange: string }
> = {
  Plumbing: { basePerSf: 0.48, hoursPer1000Sf: 7, marketRange: "0.45–0.50" },
  Electrical: { basePerSf: 0.32, hoursPer1000Sf: 6, marketRange: "0.30–0.35" },
  "Low Voltage": { basePerSf: 0.11, hoursPer1000Sf: 2.5, marketRange: "0.10–0.12" },
  HVAC: { basePerSf: 0.53, hoursPer1000Sf: 9, marketRange: "0.50–0.55" },
};

export const STANDARD_LOD_FACTOR: Record<StandardLod, number> = {
  "200": 0.9,
  "300": 1,
  "350": 1.15,
};

export const STANDARD_COMPLEXITY_FACTOR: Record<StandardComplexity, number> = {
  Low: 0.9,
  Medium: 1,
  High: 1.2,
};

export const STANDARD_TYPE_FACTOR: Record<StandardProjectType, number> = {
  TI: 0.9,
  School: 1,
  Medical: 1.2,
};

export const STANDARD_PRICING_FACTOR: Record<PricingMode, number> = {
  Aggressive: 0.9,
  Competitive: 1,
  "Margin Protect": 1.1,
};

export const STANDARD_OFFSHORE_FACTOR: Record<StandardOffshore, number> = {
  ON: 0.8,
  OFF: 1,
};

export const STANDARD_CLIENT_FACTOR: Record<ClientType, number> = {
  New: 1,
  Repeat: 1.02,
  Strategic: 0.97,
};

export const STANDARD_PROJECT_TYPES: readonly StandardProjectType[] = [
  "School",
  "TI",
  "Medical",
];

export const STANDARD_LODS: readonly StandardLod[] = ["200", "300", "350"];

export const STANDARD_COMPLEXITIES: readonly StandardComplexity[] = [
  "Low",
  "Medium",
  "High",
];

export const PRICING_MODES: readonly PricingMode[] = [
  "Aggressive",
  "Competitive",
  "Margin Protect",
];

export const CLIENT_TYPES: readonly ClientType[] = [
  "New",
  "Repeat",
  "Strategic",
];

/** Hours allocation panel (Standard I14 / H15:H16 / J15:J16). */
export const LABOR_OFFSHORE_SHARE = 0.88;
export const LABOR_PM_SHARE = 0.12;
export const LABOR_OFFSHORE_BURDEN = 32;
export const LABOR_PM_BURDEN = 220;
/** Negative margin beyond this requires PM review (Excel I20). */
export const LABOR_REVIEW_THRESHOLD = -300;

export const GUARDRAIL_SF = 50_000;
export const MEDICAL_TRADE_ESCALATE = 3;

/** Default hours/SF from Advance Estimator C29:C33 (yellow inputs). */
export const ADVANCE_DEFAULT_HOURS_PER_SF: Record<AdvanceTradeId, number> = {
  Plumbing: 0.006,
  "HVAC Piping": 0.003,
  "HVAC Mechanical": 0.007,
  "Electrical Power/Site": 0.0042,
  "Electrical LV/Tech/FA": 0.0016,
};

/**
 * Inferred from Benchmarks + extra Advanced dropdowns.
 * The original Rates sheet lived in an external workbook that is not in this copy.
 */
export const ADVANCE_TYPE_FACTOR: Record<AdvanceProjectType, number> = {
  TI: 0.9,
  School: 1,
  Commercial: 1,
  Multifamily: 1,
  Hospitality: 1,
  Other: 1,
  Industrial: 1.1,
  Government: 1.1,
  Medical: 1.2,
  Lab: 1.2,
};

export const ADVANCE_LOD_FACTOR: Record<AdvanceLod, number> = {
  "LOD 200": 0.9,
  "LOD 300": 1,
  "LOD 350": 1.15,
  "LOD 400": 1.3,
  Other: 1,
};

export const ADVANCE_COMPLEXITY_FACTOR: Record<AdvanceComplexity, number> = {
  Low: 0.9,
  Medium: 1,
  High: 1.2,
  "Very High": 1.4,
};

export const ADVANCE_PROJECT_TYPES: readonly AdvanceProjectType[] = [
  "School",
  "TI",
  "Medical",
  "Lab",
  "Commercial",
  "Multifamily",
  "Industrial",
  "Hospitality",
  "Government",
  "Other",
];

export const ADVANCE_LODS: readonly AdvanceLod[] = [
  "LOD 200",
  "LOD 300",
  "LOD 350",
  "LOD 400",
  "Other",
];

export const ADVANCE_COMPLEXITIES: readonly AdvanceComplexity[] = [
  "Low",
  "Medium",
  "High",
  "Very High",
];

export const FLOORS_MIN = 1;
export const FLOORS_MAX = 20;
export const FLOOR_PREMIUM_PER_LEVEL = 0.08;
