import { z } from "zod";

z.config({ jitless: true });

export const FIELD_ID_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

export type FieldRole = "title" | "bid" | "perSf" | "hours" | "guardrail" | "metric";
export type FieldFormat =
  | "usd"
  | "hours"
  | "perSf"
  | "number"
  | "text"
  | "percent"
  | "factor"
  | "boolean";
export type FieldType = "text" | "number" | "select" | "switch" | "computed" | "repeater";

export type SelectOption = {
  id: string;
  label: string;
  value: number;
};

export type Field = {
  id: string;
  label: string;
  type: FieldType;
  sectionId: string;
  hint?: string;
  suffix?: string;
  placeholder?: string;
  hidden?: boolean;
  showInResults?: boolean;
  showInPrint?: boolean;
  role?: FieldRole;
  format?: FieldFormat;
  formula?: string;
  visibleWhen?: string;
  widget?: "segmented" | "select";
  inputScale?: "percent";
  defaultValue?: unknown;
  min?: number;
  max?: number;
  step?: number;
  options?: SelectOption[];
  itemFields?: Field[];
  itemLabelField?: string;
};

export type Section = {
  id: string;
  title: string;
};

export type FormSchema = {
  id: string;
  name: string;
  description?: string;
  sections: Section[];
  fields: Field[];
};

export type EstimateValues = Record<string, unknown>;

export type FormDocument = {
  schema: FormSchema;
  values: EstimateValues;
};

export type EstimateMode = "standard" | "advance";

const selectOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  value: z.number(),
});

const fieldSchema: z.ZodType<Field> = z.lazy(() =>
  z.object({
    id: z.string().regex(FIELD_ID_RE),
    label: z.string(),
    type: z.enum(["text", "number", "select", "switch", "computed", "repeater"]),
    sectionId: z.string().min(1),
    hint: z.string().optional(),
    suffix: z.string().optional(),
    placeholder: z.string().optional(),
    hidden: z.boolean().optional(),
    showInResults: z.boolean().optional(),
    showInPrint: z.boolean().optional(),
    role: z.enum(["title", "bid", "perSf", "hours", "guardrail", "metric"]).optional(),
    format: z
      .enum(["usd", "hours", "perSf", "number", "text", "percent", "factor", "boolean"])
      .optional(),
    formula: z.string().optional(),
    visibleWhen: z.string().optional(),
    widget: z.enum(["segmented", "select"]).optional(),
    inputScale: z.literal("percent").optional(),
    defaultValue: z.unknown().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    options: z.array(selectOptionSchema).optional(),
    itemFields: z.array(fieldSchema).optional(),
    itemLabelField: z.string().optional(),
  }),
);

export const formSchemaSchema: z.ZodType<FormSchema> = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  sections: z.array(z.object({ id: z.string().min(1), title: z.string() })),
  fields: z.array(fieldSchema),
});

export const formDocumentSchema: z.ZodType<FormDocument> = z.object({
  schema: formSchemaSchema,
  values: z.record(z.string(), z.unknown()),
});

export function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function newRowId(): string {
  return `r_${Math.random().toString(36).slice(2, 11)}`;
}

export function uniqueFieldId(schema: FormSchema, base: string): string {
  const used = new Set<string>();
  function walk(fields: Field[]) {
    for (const field of fields) {
      used.add(field.id);
      if (field.itemFields) walk(field.itemFields);
    }
  }
  walk(schema.fields);
  if (!used.has(base) && FIELD_ID_RE.test(base)) return base;
  let n = 2;
  while (used.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}

export function uniqueSectionId(schema: FormSchema, base: string): string {
  const used = new Set(schema.sections.map((section) => section.id));
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}

export function fieldById(schema: FormSchema, id: string): Field | undefined {
  return schema.fields.find((field) => field.id === id);
}

export function fieldByRole(schema: FormSchema, role: FieldRole): Field | undefined {
  return schema.fields.find((field) => field.role === role);
}

export function defaultForField(field: Field): unknown {
  if (field.defaultValue !== undefined) return cloneJson(field.defaultValue);
  switch (field.type) {
    case "text":
      return "";
    case "number":
      return field.min ?? 0;
    case "switch":
      return false;
    case "select":
      return field.options?.[0]?.id ?? "";
    case "repeater":
      return [];
    case "computed":
      return null;
  }
}

export function blankRow(itemFields: Field[]): Record<string, unknown> {
  const row: Record<string, unknown> = { _id: newRowId() };
  for (const field of itemFields) {
    if (field.type === "computed") continue;
    row[field.id] = defaultForField(field);
  }
  return row;
}

export function defaultValues(schema: FormSchema): EstimateValues {
  const values: EstimateValues = {};
  for (const field of schema.fields) {
    if (field.type === "computed") continue;
    values[field.id] = defaultForField(field);
  }
  return values;
}

function clearRepeaterRows(field: Field): unknown[] {
  const catalog = Array.isArray(field.defaultValue) ? field.defaultValue : [];
  const itemFields = field.itemFields ?? [];
  return catalog.map((raw) => {
    const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const row = blankRow(itemFields);
    for (const item of itemFields) {
      if (item.type === "computed") continue;
      if (item.type === "switch") {
        row[item.id] = false;
        continue;
      }
      if (item.id in source) row[item.id] = cloneJson(source[item.id]);
    }
    return row;
  });
}

/** Keep catalogs (trade names/rates) but empty project scalars. */
export function clearedValues(schema: FormSchema): EstimateValues {
  const values: EstimateValues = {};
  for (const field of schema.fields) {
    if (field.type === "computed") continue;
    if (field.type === "repeater") {
      values[field.id] = clearRepeaterRows(field);
      continue;
    }
    if (field.type === "text") {
      values[field.id] = "";
      continue;
    }
    if (field.type === "number") {
      values[field.id] = field.min ?? 0;
      continue;
    }
    if (field.type === "switch") {
      values[field.id] = false;
      continue;
    }
    if (field.type === "select") {
      values[field.id] = field.options?.[0]?.id ?? "";
    }
  }
  return values;
}

export function coerceNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function asRowArray(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.map((row) =>
    row && typeof row === "object" ? (row as Record<string, unknown>) : {},
  );
}

export function replaceFormulaIdent(formula: string, ident: string): string {
  const trimmed = formula.trim();
  if (!trimmed) return ident;
  return `${trimmed} * ${ident}`;
}

export function appendToFormula(formula: string, piece: string): string {
  const trimmed = formula.trim();
  if (!trimmed) return piece;
  return `${trimmed} + ${piece}`;
}

export function renameFieldId(schema: FormSchema, from: string, to: string): FormSchema {
  const next = cloneJson(schema);
  const re = new RegExp(`\\b${from}\\b`, "g");
  function walk(fields: Field[]) {
    for (const field of fields) {
      if (field.id === from) field.id = to;
      if (field.formula) field.formula = field.formula.replace(re, to);
      if (field.visibleWhen) field.visibleWhen = field.visibleWhen.replace(re, to);
      if (field.itemLabelField === from) field.itemLabelField = to;
      if (field.itemFields) walk(field.itemFields);
    }
  }
  walk(next.fields);
  return next;
}

export function migrateValuesOnRename(
  values: EstimateValues,
  from: string,
  to: string,
): EstimateValues {
  if (from === to || !(from in values)) return values;
  const next = { ...values, [to]: values[from] };
  delete next[from];
  return next;
}

/** Snapshot trade catalog into schema defaults when saving a rate-card. */
export function schemaWithValueDefaults(
  schema: FormSchema,
  values: EstimateValues,
): FormSchema {
  const next = cloneJson(schema);
  next.fields = next.fields.map((field) => {
    if (field.type === "computed") return field;
    if (field.type === "repeater") {
      const rows = asRowArray(values[field.id]).map((row) => {
        const copy = { ...row };
        for (const item of field.itemFields ?? []) {
          if (item.type === "switch") copy[item.id] = false;
        }
        return copy;
      });
      return { ...field, defaultValue: rows };
    }
    if (field.id in values) {
      return { ...field, defaultValue: cloneJson(values[field.id]) };
    }
    return field;
  });
  return next;
}

export function mergeRateCardValues(
  schema: FormSchema,
  previous: EstimateValues,
): EstimateValues {
  const values = defaultValues(schema);
  for (const field of schema.fields) {
    if (field.type === "computed") continue;
    if (field.type === "repeater") {
      values[field.id] = defaultForField(field);
      continue;
    }
    if (field.id in previous) values[field.id] = cloneJson(previous[field.id]);
  }
  return values;
}
