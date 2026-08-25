import { z } from "zod";
import { factoryDocument, factoryDraftDocuments } from "./factory";
import {
  cloneJson,
  formDocumentSchema,
  formSchemaSchema,
  type EstimateMode,
  type FormDocument,
  type FormSchema,
} from "./schema";

z.config({ jitless: true });

export const DRAFT_KEY = "ai.neck.estimate.v1.draft";
export const TEMPLATES_KEY = "ai.neck.estimate.v1.templates";

export type TemplateKind = "rate-card" | "quote";

export type SavedTemplate = {
  id: string;
  name: string;
  kind: TemplateKind;
  savedAt: string;
  sourceMode: EstimateMode;
  schema: FormSchema;
  values?: FormDocument["values"];
};

export type EstimateDraft = {
  version: 1;
  activeMode: EstimateMode;
  documents: {
    standard: FormDocument;
    advance: FormDocument;
  };
};

const draftSchema: z.ZodType<EstimateDraft> = z.object({
  version: z.literal(1),
  activeMode: z.enum(["standard", "advance"]),
  documents: z.object({
    standard: formDocumentSchema,
    advance: formDocumentSchema,
  }),
});

export const templateSchema: z.ZodType<SavedTemplate> = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["rate-card", "quote"]),
  savedAt: z.string(),
  sourceMode: z.enum(["standard", "advance"]),
  schema: formSchemaSchema,
  values: z.record(z.string(), z.unknown()).optional(),
});

function readJson(key: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

export function emptyDraft(activeMode: EstimateMode = "standard"): EstimateDraft {
  return {
    version: 1,
    activeMode,
    documents: factoryDraftDocuments(),
  };
}

export function loadDraft(activeMode: EstimateMode): EstimateDraft {
  const parsed = draftSchema.safeParse(readJson(DRAFT_KEY));
  if (!parsed.success) return emptyDraft(activeMode);
  return { ...parsed.data, activeMode };
}

export function saveDraft(draft: EstimateDraft) {
  writeJson(DRAFT_KEY, draft);
}

export function loadTemplates(): SavedTemplate[] {
  const parsed = z.array(templateSchema).safeParse(readJson(TEMPLATES_KEY));
  if (!parsed.success) return [];
  return parsed.data;
}

export function saveTemplates(templates: SavedTemplate[]) {
  writeJson(TEMPLATES_KEY, templates);
}

export function newTemplateId(): string {
  return `tpl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function factoryForMode(mode: EstimateMode): FormDocument {
  return factoryDocument(mode);
}

export function parseImportedTemplate(raw: unknown): SavedTemplate | null {
  const asTemplate = templateSchema.safeParse(raw);
  if (asTemplate.success) return asTemplate.data;
  const asDoc = formDocumentSchema.safeParse(raw);
  if (!asDoc.success) return null;
  return {
    id: newTemplateId(),
    name: asDoc.data.schema.name || "Imported form",
    kind: "quote",
    savedAt: new Date().toISOString(),
    sourceMode: asDoc.data.schema.id === "advance" ? "advance" : "standard",
    schema: asDoc.data.schema,
    values: asDoc.data.values,
  };
}
