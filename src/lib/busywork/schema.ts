import { z } from "zod";

z.config({ jitless: true });

export const frequencies = ["daily", "weekly", "monthly"] as const;

export const frequencySchema = z.enum(frequencies);

export const frictionTypes = [
  "reentry",
  "copying",
  "searching",
  "repetitive",
  "waiting",
  "onboarding",
  "scheduling",
  "calculations",
  "spreadsheet_app",
  "single_person",
  "errors",
  "customer_wait",
  "low_value",
] as const;

export const frictionSchema = z.enum(frictionTypes);

function normalizeFrequency(value: unknown): unknown {
  if (value == null || value === "") return "weekly";
  return value === "several_times_a_week" ? "weekly" : value;
}

const ideaText = z
  .string()
  .trim()
  .min(2, "Please add a bit more detail.")
  .max(500, "Please keep this under 500 characters.");

export const textIdeaSchema = z.object({
  id: z.string().min(1).max(80),
  text: ideaText,
});

const peopleSchema = z.number().int().min(1).max(500).default(1);
const frustrationSchema = z.number().int().min(1).max(5).default(3);
const judgmentSchema = z.boolean().default(false);

export const workflowIdeaSchema = z.object({
  id: z.string().min(1).max(80),
  text: ideaText,
  prompt: z.string().trim().max(200).optional(),
  hours: z
    .number()
    .min(0, "Hours cannot be negative.")
    .max(744, "Hours cannot exceed 744.")
    .optional(),
  frequency: z.preprocess(normalizeFrequency, frequencySchema),
  friction: frictionSchema,
  people: peopleSchema,
  frustration: frustrationSchema,
  judgment: judgmentSchema,
});

export const contextSchema = z.object({
  teamSize: z.number().int().min(1).max(100000).optional(),
  hourlyCost: z.number().min(1).max(10000).optional(),
});

export const contextInputSchema = z.object({
  teamSize: z.union([z.number().int().min(1).max(100000), z.null()]),
  hourlyCost: z.union([z.number().min(1).max(10000), z.null()]),
});

export const payloadSchema = z.object({
  workflows: z.array(workflowIdeaSchema).default([]),
  alwaysHuman: z.array(textIdeaSchema).default([]),
  capacity: z.array(textIdeaSchema).default([]),
  context: contextSchema.default({}),
});

export type Frequency = z.infer<typeof frequencySchema>;
export type Friction = z.infer<typeof frictionSchema>;
export type TextIdea = z.infer<typeof textIdeaSchema>;
export type WorkflowIdea = z.infer<typeof workflowIdeaSchema>;
export type BusyworkContext = z.infer<typeof contextSchema>;
export type BusyworkPayload = z.infer<typeof payloadSchema>;

export const emptyPayload = (): BusyworkPayload => ({
  workflows: [],
  alwaysHuman: [],
  capacity: [],
  context: {},
});

export const joinSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name must be under 120 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(200, "Email must be under 200 characters.")
    .transform((value) => value.toLowerCase()),
  consent: z.boolean().refine((value) => value === true, {
    error: "Please confirm you agree to receive your sign-in link by email.",
  }),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type JoinInput = z.input<typeof joinSchema>;

export const addWorkflowSchema = z.object({
  text: ideaText,
  prompt: z.string().trim().max(200).optional(),
  hours: z
    .number()
    .min(0, "Hours cannot be negative.")
    .max(744, "Hours cannot exceed 744."),
  frequency: z.preprocess(normalizeFrequency, frequencySchema),
  friction: frictionSchema,
  people: peopleSchema,
  frustration: frustrationSchema,
  judgment: judgmentSchema,
});

export const addAlwaysHumanSchema = z.object({ text: ideaText });
export const addCapacitySchema = z.object({ text: ideaText });

export const ideaKindSchema = z.enum(["workflows", "alwaysHuman", "capacity"]);

export type IdeaKind = z.infer<typeof ideaKindSchema>;

export const eventNameSchema = z.enum([
  "cta_click",
  "assessment_start",
  "contact_capture",
  "section_completed",
  "successful_submit",
  "booking_cta_click",
]);

export type BusyworkEventName = z.infer<typeof eventNameSchema>;

export function ideaCount(payload: BusyworkPayload): number {
  return (
    payload.workflows.length +
    payload.alwaysHuman.length +
    payload.capacity.length
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function textItem(item: unknown): { id: string; text: string } | null {
  if (!isRecord(item) || typeof item.text !== "string") return null;
  const text = item.text.trim().slice(0, 500);
  if (text.length < 2) return null;
  const id = typeof item.id === "string" && item.id ? item.id.slice(0, 80) : crypto.randomUUID();
  return { id, text };
}

function clampHours(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return undefined;
  return Math.min(value, 744);
}

function asFrequency(value: unknown): "daily" | "weekly" | "monthly" {
  if (value === "daily" || value === "monthly" || value === "weekly") return value;
  if (value === "several_times_a_week") return "weekly";
  return "weekly";
}

/**
 * Older assessments stored separate AI lanes (high-value, robot tasks,
 * superhuman, hire). Fold those into the busy-work map so a saved draft
 * still opens.
 */
export function migratePayload(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if (Array.isArray(value.workflows)) {
    return {
      workflows: value.workflows,
      alwaysHuman: value.alwaysHuman ?? [],
      capacity: [
        ...asArray(value.capacity),
        ...asArray(value.highValue).filter((item) => {
          const text = textItem(item)?.text;
          return text
            ? !asArray(value.capacity).some(
                (existing) => textItem(existing)?.text === text,
              )
            : false;
        }),
      ],
      context: isRecord(value.context) ? value.context : {},
    };
  }

  const workflows: unknown[] = [];

  for (const item of asArray(value.robotTasks)) {
    const text = textItem(item);
    if (!text || !isRecord(item)) continue;
    workflows.push({
      ...text,
      hours: clampHours(item.hoursPerWeek),
      frequency: asFrequency(item.frequency),
      friction: "repetitive",
    });
  }

  for (const item of asArray(value.busywork)) {
    const text = textItem(item);
    if (!text) continue;
    workflows.push({
      ...text,
      frequency: "weekly",
      friction: "repetitive",
    });
  }

  for (const item of asArray(value.superhuman)) {
    const text = textItem(item);
    if (!text || !isRecord(item)) continue;
    const prep = typeof item.prepMinutes === "number" ? item.prepMinutes : 0;
    workflows.push({
      ...text,
      hours: clampHours(Math.round((prep / 60) * 10) / 10),
      frequency: "weekly",
      friction: "searching",
    });
  }

  for (const item of asArray(value.hire)) {
    if (!isRecord(item) || typeof item.responsibilities !== "string") continue;
    const kpi = typeof item.kpi === "string" ? item.kpi.trim() : "";
    const text = (kpi ? `${item.responsibilities} — ${kpi}` : item.responsibilities)
      .trim()
      .slice(0, 500);
    if (text.length < 2) continue;
    workflows.push({
      id: typeof item.id === "string" && item.id ? item.id.slice(0, 80) : crypto.randomUUID(),
      text,
      frequency: "weekly",
      friction: "low_value",
    });
  }

  return {
    workflows,
    alwaysHuman: value.alwaysHuman ?? [],
    capacity: value.highValue ?? [],
    context: {},
  };
}

export function parsePayload(value: unknown): BusyworkPayload {
  const parsed = payloadSchema.safeParse(migratePayload(value));
  return parsed.success ? parsed.data : emptyPayload();
}

export type ActionFailure = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
};

export type PublicSession = {
  firstName: string;
  email: string;
  payload: BusyworkPayload;
  status: "draft" | "submitted";
  unchangedSinceSubmit: boolean;
};
