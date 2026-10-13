import type {
  BusyworkContext,
  Frequency,
  Friction,
  WorkflowIdea,
} from "./schema";

export const DEFAULT_HOURLY_COST = 50;

export type OpportunityCategory =
  | "quick_win"
  | "high_impact"
  | "strategic"
  | "leave_alone";

export type ScoreBreakdown = {
  time: number;
  frequency: number;
  cost: number;
  friction: number;
  potential: number;
};

export type ScoredWorkflow = {
  scores: ScoreBreakdown;
  score: number;
  category: OpportunityCategory;
  solution: string;
  impact: string;
  recoverableHours: number | null;
  monthlyPersonHours: number | null;
  monthlyCost: number | null;
};

export type CapacitySummary = {
  hourlyCost: number;
  currentHoursPerMonth: number;
  recoverableHoursPerMonth: number;
  recoverableHoursPerYear: number;
  annualCapacityValue: number;
  teamSize: number | null;
  illustrationHoursPerYear: number | null;
  illustrationValue: number | null;
};

const structural: ReadonlySet<Friction> = new Set([
  "single_person",
  "spreadsheet_app",
  "waiting",
  "customer_wait",
  "onboarding",
]);

const potentialByFriction: Record<Friction, number> = {
  reentry: 5,
  copying: 5,
  repetitive: 5,
  searching: 4,
  calculations: 4,
  waiting: 4,
  scheduling: 4,
  onboarding: 4,
  errors: 4,
  single_person: 3,
  spreadsheet_app: 3,
  low_value: 3,
  customer_wait: 3,
};

/** Share of current person-hours that can realistically come back. */
const recoveryRate: Record<Friction, number> = {
  reentry: 0.75,
  copying: 0.75,
  repetitive: 0.67,
  onboarding: 0.67,
  scheduling: 0.67,
  waiting: 0.67,
  searching: 0.6,
  calculations: 0.6,
  errors: 0.6,
  spreadsheet_app: 0.5,
  single_person: 0.5,
  low_value: 0.5,
  customer_wait: 0.5,
};

const solutions: Record<Friction, string> = {
  reentry: "Simplify the process first, then a form plus workflow automation.",
  copying: "Simplify the process first, then a form, a workflow, or an integration.",
  searching: "A knowledge or SOP assistant, after the source material is cleaned up.",
  repetitive: "Simplify the process first, then templates and document automation.",
  waiting:
    "Simplify the process first, then an approval workflow, often in Power Automate.",
  onboarding: "Simplify the process first, then an automated onboarding workflow.",
  calculations: "An estimating or summarizing assistant for the repetitive parts.",
  scheduling: "Reminders and follow-up automation for the status checks.",
  spreadsheet_app:
    "Simplify the process first, then a list or app (Microsoft Lists or Dataverse) instead of the spreadsheet.",
  single_person:
    "Simplify the process first, then a workflow that does not depend on one person.",
  errors:
    "Simplify the process first, then a checklist or form that removes the manual step.",
  low_value: "Move the admin steps into the tools the team already uses.",
  customer_wait:
    "A faster intake or self-service path for requests that do not need a person.",
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function monthlyFromFrequency(hours: number, frequency: Frequency): number {
  if (frequency === "daily") return hours * 20;
  if (frequency === "weekly") return hours * 4;
  return hours;
}

/** 1 below 2 hours, then steps at 5, 10, and 20. 20 hours and above, including 40, is a 5. */
function timeScore(hours: number): number {
  if (hours < 2) return 1;
  if (hours < 5) return 2;
  if (hours < 10) return 3;
  if (hours < 20) return 4;
  return 5;
}

function costScore(amount: number, friction: Friction): number {
  let score = 1;
  if (amount >= 2500) score = 5;
  else if (amount >= 1000) score = 4;
  else if (amount >= 500) score = 3;
  else if (amount >= 250) score = 2;
  if (friction === "errors") score = Math.min(5, score + 1);
  return score;
}

function frequencyScore(frequency: Frequency): number {
  if (frequency === "daily") return 5;
  if (frequency === "weekly") return 3;
  return 1;
}

function overall(scores: ScoreBreakdown): number {
  const sum =
    scores.time +
    scores.frequency +
    scores.cost +
    scores.friction +
    scores.potential;
  return Math.round(((sum - 5) / 20) * 100);
}

function categorize(opts: {
  judgment: boolean;
  score: number;
  monthlyPersonHours: number | null;
  monthlyCost: number | null;
  friction: Friction;
}): OpportunityCategory {
  if (opts.judgment || opts.score < 40) return "leave_alone";
  const hours = opts.monthlyPersonHours ?? 0;
  if (hours >= 40 && structural.has(opts.friction)) return "strategic";
  if (hours >= 20 || (opts.monthlyCost ?? 0) >= 1000) return "high_impact";
  return "quick_win";
}

export function hourlyRate(context: BusyworkContext): number {
  return context.hourlyCost ?? DEFAULT_HOURLY_COST;
}

export function scoreWorkflow(
  idea: Pick<
    WorkflowIdea,
    "hours" | "frequency" | "friction" | "people" | "frustration" | "judgment"
  >,
  context: BusyworkContext,
): ScoredWorkflow {
  const people = idea.people ?? 1;
  const monthlyPersonHours =
    idea.hours == null ? null : round1(monthlyFromFrequency(idea.hours, idea.frequency) * people);
  const rate = hourlyRate(context);
  const monthlyCost =
    monthlyPersonHours == null ? null : round1(monthlyPersonHours * rate);

  const scores: ScoreBreakdown = {
    time: monthlyPersonHours == null ? 1 : timeScore(monthlyPersonHours),
    frequency: frequencyScore(idea.frequency),
    cost: monthlyCost == null ? 1 : costScore(monthlyCost, idea.friction),
    friction: idea.frustration ?? 3,
    potential: potentialByFriction[idea.friction],
  };
  const score = overall(scores);
  const category = categorize({
    judgment: idea.judgment === true,
    score,
    monthlyPersonHours,
    monthlyCost,
    friction: idea.friction,
  });

  let recoverableHours: number | null = null;
  let impact = "Add a time estimate to size the impact.";
  if (category === "leave_alone") {
    impact = "Keep with people";
    recoverableHours = 0;
  } else if (monthlyPersonHours != null) {
    recoverableHours = round1(monthlyPersonHours * recoveryRate[idea.friction]);
    impact = `~${recoverableHours} hrs recovered / month`;
  }

  return {
    scores,
    score,
    category,
    solution: solutions[idea.friction],
    impact,
    recoverableHours,
    monthlyPersonHours,
    monthlyCost,
  };
}

export function summarizeCapacity(
  rows: Pick<ScoredWorkflow, "category" | "recoverableHours" | "monthlyPersonHours">[],
  context: BusyworkContext,
): CapacitySummary {
  const currentHoursPerMonth = round1(
    rows.reduce((sum, row) => sum + (row.monthlyPersonHours ?? 0), 0),
  );
  const recoverableHoursPerMonth = round1(
    rows.reduce((sum, row) => {
      if (row.category === "leave_alone") return sum;
      return sum + (row.recoverableHours ?? 0);
    }, 0),
  );
  const recoverableHoursPerYear = round1(recoverableHoursPerMonth * 12);
  const rate = hourlyRate(context);
  const teamSize = context.teamSize ?? null;
  const illustrationHoursPerYear =
    teamSize == null ? null : round1(teamSize * 3 * 52);

  return {
    hourlyCost: rate,
    currentHoursPerMonth,
    recoverableHoursPerMonth,
    recoverableHoursPerYear,
    annualCapacityValue: Math.round(recoverableHoursPerYear * rate),
    teamSize,
    illustrationHoursPerYear,
    illustrationValue:
      illustrationHoursPerYear == null
        ? null
        : Math.round(illustrationHoursPerYear * rate),
  };
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
