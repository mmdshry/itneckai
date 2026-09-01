import { z } from "zod";

z.config({ jitless: true });

export const frequencies = [
  "daily",
  "weekly",
  "monthly",
] as const;

export const frequencySchema = z.enum(frequencies);

function normalizeFrequency(value: unknown): unknown {
  return value === "several_times_a_week" ? "weekly" : value;
}

const ideaText = z
  .string()
  .trim()
  .min(2, "Please add a bit more detail.")
  .max(500, "Please keep this under 500 characters.");

export const textIdeaSchema = z.object({
  id: z.string().uuid(),
  text: ideaText,
});

export const robotTaskIdeaSchema = z.object({
  id: z.string().uuid(),
  text: ideaText,
  hoursPerWeek: z
    .number()
    .min(0, "Hours cannot be negative.")
    .max(744, "Hours cannot exceed 744."),
  frequency: z.preprocess(normalizeFrequency, frequencySchema.optional()),
});

export const superhumanIdeaSchema = z.object({
  id: z.string().uuid(),
  text: ideaText,
  prepMinutes: z
    .number()
    .min(0, "Preparation time cannot be negative.")
    .max(10080, "Please enter a realistic preparation time."),
  performanceMinutes: z
    .number()
    .min(0, "Decision / performance time cannot be negative.")
    .max(10080, "Please enter a realistic performance time."),
});

export const hireIdeaSchema = z.object({
  id: z.string().uuid(),
  responsibilities: ideaText,
  kpi: ideaText,
});

export const payloadSchema = z.object({
  highValue: z.array(textIdeaSchema).default([]),
  busywork: z.array(textIdeaSchema).default([]),
  alwaysHuman: z.array(textIdeaSchema).default([]),
  robotTasks: z.array(robotTaskIdeaSchema).default([]),
  superhuman: z.array(superhumanIdeaSchema).default([]),
  hire: z.array(hireIdeaSchema).default([]),
});

export type Frequency = z.infer<typeof frequencySchema>;
export type TextIdea = z.infer<typeof textIdeaSchema>;
export type RobotTaskIdea = z.infer<typeof robotTaskIdeaSchema>;
export type SuperhumanIdea = z.infer<typeof superhumanIdeaSchema>;
export type HireIdea = z.infer<typeof hireIdeaSchema>;
export type BusyworkPayload = z.infer<typeof payloadSchema>;

export const emptyPayload = (): BusyworkPayload => ({
  highValue: [],
  busywork: [],
  alwaysHuman: [],
  robotTasks: [],
  superhuman: [],
  hire: [],
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
  consent: z
    .boolean()
    .refine((value) => value === true, {
      error: "Please confirm you agree to receive your sign-in link by email.",
    }),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type JoinInput = z.input<typeof joinSchema>;

export const addHighValueSchema = z.object({ text: ideaText });
export const addBusyworkSchema = z.object({ text: ideaText });
export const addAlwaysHumanSchema = z.object({ text: ideaText });

export const addRobotTaskSchema = z.object({
  text: ideaText,
  hoursPerWeek: z
    .number()
    .min(0, "Hours cannot be negative.")
    .max(744, "Hours cannot exceed 744."),
  frequency: frequencySchema.default("weekly"),
});

export const addSuperhumanSchema = z.object({
  text: ideaText,
  prepMinutes: z
    .number()
    .min(0, "Preparation time cannot be negative.")
    .max(10080, "Please enter a realistic preparation time."),
  performanceMinutes: z
    .number()
    .min(0, "Decision / performance time cannot be negative.")
    .max(10080, "Please enter a realistic performance time."),
});

export const addHireSchema = z.object({
  responsibilities: ideaText,
  kpi: ideaText,
});

export const ideaKindSchema = z.enum([
  "highValue",
  "busywork",
  "alwaysHuman",
  "robotTasks",
  "superhuman",
  "hire",
]);

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
    payload.highValue.length +
    payload.busywork.length +
    payload.alwaysHuman.length +
    payload.robotTasks.length +
    payload.superhuman.length +
    payload.hire.length
  );
}

export function parsePayload(value: unknown): BusyworkPayload {
  const parsed = payloadSchema.safeParse(value);
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
