import type { BusyworkPayload, Frequency, HireIdea, SuperhumanIdea } from "./schema";

export type OpportunityMap = {
  protect: string[];
  automate: string[];
  amplify: Array<{
    text: string;
    prepMinutes: number;
    performanceMinutes: number;
    ratio: number | null;
    bottleneck: boolean;
  }>;
  build: HireIdea[];
  robotHoursPerWeek: number;
  highValue: string[];
  busywork: string[];
};

export function hoursPeriodLabel(
  hours: number,
  frequency?: Frequency,
): string {
  const period =
    frequency === "daily" ? "day" : frequency === "monthly" ? "month" : "week";
  return `${hours} hrs / ${period}`;
}

export function minutesToLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  const rounded = Number.isInteger(hours) ? hours : Number(hours.toFixed(1));
  return `${rounded} hour${rounded === 1 ? "" : "s"}`;
}

export function prepRatio(idea: SuperhumanIdea): number | null {
  if (idea.performanceMinutes <= 0) return null;
  return idea.prepMinutes / idea.performanceMinutes;
}

export function buildOpportunityMap(payload: BusyworkPayload): OpportunityMap {
  const robotHoursPerWeek = payload.robotTasks.reduce(
    (sum, idea) => sum + idea.hoursPerWeek,
    0,
  );

  const automate = payload.robotTasks.map((idea) => idea.text);
  if (automate.length === 0) {
    automate.push(...payload.busywork.map((idea) => idea.text));
  }

  return {
    protect: payload.alwaysHuman.map((idea) => idea.text),
    automate,
    amplify: payload.superhuman.map((idea) => {
      const ratio = prepRatio(idea);
      return {
        text: idea.text,
        prepMinutes: idea.prepMinutes,
        performanceMinutes: idea.performanceMinutes,
        ratio,
        bottleneck: ratio !== null && ratio >= 3,
      };
    }),
    build: payload.hire,
    robotHoursPerWeek: Math.round(robotHoursPerWeek * 10) / 10,
    highValue: payload.highValue.map((idea) => idea.text),
    busywork: payload.busywork.map((idea) => idea.text),
  };
}

export function formatRatio(ratio: number): string {
  const rounded = Number.isInteger(ratio) ? String(ratio) : ratio.toFixed(1);
  return `${rounded}:1`;
}
