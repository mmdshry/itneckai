import { frictionLabels } from "./copy";
import {
  scoreWorkflow,
  summarizeCapacity,
  type CapacitySummary,
  type OpportunityCategory,
  type ScoreBreakdown,
} from "./score";
import type { BusyworkPayload, Frequency, WorkflowIdea } from "./schema";

export type BusyWorkRow = {
  id: string;
  workflow: string;
  effort: string;
  problem: string;
  solution: string;
  impact: string;
  category: OpportunityCategory;
  score: number;
  scores: ScoreBreakdown;
  hoursPerMonth: number | null;
};

export type BusyWorkMap = {
  rows: BusyWorkRow[];
  hoursPerMonth: number;
  alwaysHuman: string[];
  capacity: string[];
  roi: CapacitySummary;
};

export function effortLabel(idea: {
  hours?: number;
  frequency: Frequency;
}): string {
  if (idea.hours == null) return "Not measured";
  const period =
    idea.frequency === "daily"
      ? "day"
      : idea.frequency === "monthly"
        ? "month"
        : "week";
  return `${idea.hours} hrs / ${period}`;
}

/** Rough month so daily, weekly, and monthly answers can sit on one map. */
export function toMonthlyHours(hours: number, frequency: Frequency): number {
  if (frequency === "daily") return hours * 20;
  if (frequency === "weekly") return hours * 4;
  return hours;
}

export function buildBusyWorkMap(payload: BusyworkPayload): BusyWorkMap {
  const scored = payload.workflows.map((idea) => ({
    idea,
    scored: scoreWorkflow(idea, payload.context),
  }));
  const rows = scored.map(({ idea, scored: result }) => rowFromWorkflow(idea, result));
  const hoursPerMonth = rows.reduce(
    (sum, row) => sum + (row.hoursPerMonth ?? 0),
    0,
  );

  return {
    rows,
    hoursPerMonth: Math.round(hoursPerMonth * 10) / 10,
    alwaysHuman: payload.alwaysHuman.map((idea) => idea.text),
    capacity: payload.capacity.map((idea) => idea.text),
    roi: summarizeCapacity(
      scored.map(({ scored: result }) => result),
      payload.context,
    ),
  };
}

function rowFromWorkflow(
  idea: WorkflowIdea,
  scored: ReturnType<typeof scoreWorkflow>,
): BusyWorkRow {
  const people =
    idea.people > 1 ? ` · ${idea.people} people` : "";
  return {
    id: idea.id,
    workflow: idea.text,
    effort: `${effortLabel(idea)}${people}`,
    problem: frictionLabels[idea.friction],
    solution: scored.solution,
    impact: scored.impact,
    category: scored.category,
    score: scored.score,
    scores: scored.scores,
    hoursPerMonth: scored.monthlyPersonHours,
  };
}
