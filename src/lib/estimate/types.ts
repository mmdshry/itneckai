export type EstimateMode = "standard" | "advance";

export type StandardLod = "200" | "300" | "350";
export type StandardProjectType = "School" | "TI" | "Medical";
export type StandardComplexity = "Low" | "Medium" | "High";
export type PricingMode = "Aggressive" | "Competitive" | "Margin Protect";
export type ClientType = "New" | "Repeat" | "Strategic";
export type StandardOffshore = "ON" | "OFF";
export type StandardTradeId =
  | "Plumbing"
  | "Electrical"
  | "Low Voltage"
  | "HVAC";

export type AdvanceLod =
  | "LOD 200"
  | "LOD 300"
  | "LOD 350"
  | "LOD 400"
  | "Other";
export type AdvanceProjectType =
  | "School"
  | "TI"
  | "Medical"
  | "Lab"
  | "Commercial"
  | "Multifamily"
  | "Industrial"
  | "Hospitality"
  | "Government"
  | "Other";
export type AdvanceComplexity = "Low" | "Medium" | "High" | "Very High";
export type AdvanceOffshore = "On" | "Off";
export type AdvanceTradeId =
  | "Plumbing"
  | "HVAC Piping"
  | "HVAC Mechanical"
  | "Electrical Power/Site"
  | "Electrical LV/Tech/FA";

export type YesNo = "Yes" | "No";

export type FactorChip = {
  label: string;
  factor: number;
};

export type StandardInputs = {
  projectName: string;
  squareFootage: number;
  floors: number;
  projectType: StandardProjectType;
  lod: StandardLod;
  complexity: StandardComplexity;
  pricingMode: PricingMode;
  clientType: ClientType;
  offshore: StandardOffshore;
  included: Record<StandardTradeId, YesNo>;
};

export type StandardTradeResult = {
  id: StandardTradeId;
  included: boolean;
  basePerSf: number;
  adjPerSf: number;
  price: number;
  hours: number;
};

export type StandardResult = {
  trades: StandardTradeResult[];
  factors: FactorChip[];
  combinedFactor: number;
  recommendedBid: number;
  totalPerSf: number;
  estimatedHours: number;
  confidence: "Low" | "Medium" | "High";
  winProbability: "Low" | "Medium" | "High";
  pricingStrategy: string;
  pmGuardrail: "Escalate to PM" | "Sales can price";
  notes: string;
  offshoreHours: number;
  pmHours: number;
  laborExpense: number;
  laborMargin: number;
  laborNeedsReview: boolean;
};

export type AdvanceInputs = {
  projectName: string;
  squareFootage: number;
  floors: number;
  projectType: AdvanceProjectType;
  lod: AdvanceLod;
  complexity: AdvanceComplexity;
  offshore: AdvanceOffshore;
  offshoreShare: number;
  onshoreRate: number;
  offshoreRate: number;
  pmMarkup: number;
  bidDiscount: number;
  includeMeetings: YesNo;
  meetingCount: number;
  meetingRate: number;
  includeProcessPlan: YesNo;
  processPlanFee: number;
  included: Record<AdvanceTradeId, YesNo>;
  hoursPerSf: Record<AdvanceTradeId, number>;
};

export type AdvanceTradeResult = {
  id: AdvanceTradeId;
  note: string;
  included: boolean;
  hoursPerSf: number;
  hours: number;
  blendedRate: number;
  baseCost: number;
  discountedCost: number;
};

export type AdvanceResult = {
  trades: AdvanceTradeResult[];
  factors: FactorChip[];
  floorMultiplier: number;
  blendedRate: number;
  modelingTotal: number;
  coordinationTotal: number;
  processPlanTotal: number;
  grandTotal: number;
  pricePerSf: number;
  totalHours: number;
};
