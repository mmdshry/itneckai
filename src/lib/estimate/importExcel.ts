import type { CellObject, WorkBook, WorkSheet } from "xlsx";
import {
  INPUTS_SHEET,
  LOOKUPS_SHEET,
  REPEATER_FIRST_DATA_ROW,
  REPEATER_ID_ROW,
  RESULTS_SHEET,
  SCHEMA_MARKER,
  SCHEMA_SHEET,
  a1,
  uniqueSheetName,
} from "./excelFormula";
import {
  cloneJson,
  newRowId,
  type EstimateValues,
  type Field,
  type FormDocument,
  type FormSchema,
} from "./schema";
import { parseImportedTemplate, type SavedTemplate } from "./storage";

function cell(ws: WorkSheet | undefined, addr: string): CellObject | undefined {
  if (!ws) return undefined;
  const value = ws[addr];
  if (!value || typeof value !== "object") return undefined;
  return value as CellObject;
}

function cellV(ws: WorkSheet | undefined, addr: string): unknown {
  return cell(ws, addr)?.v;
}

function cellText(ws: WorkSheet | undefined, addr: string): string {
  const value = cellV(ws, addr);
  if (value == null) return "";
  return String(value).trim();
}

function maxRow(ws: WorkSheet | undefined): number {
  const ref = ws?.["!ref"];
  if (typeof ref !== "string") return 0;
  const match = ref.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function readSchemaJson(wb: WorkBook): unknown | null {
  const ws = wb.Sheets[SCHEMA_SHEET];
  if (!ws) return null;
  if (cellText(ws, "A1") !== SCHEMA_MARKER) return null;
  const countRaw = cellV(ws, "A2");
  const count = typeof countRaw === "number" ? countRaw : Number(countRaw);
  if (!Number.isFinite(count) || count < 1) return null;
  let json = "";
  for (let i = 0; i < count; i += 1) {
    json += String(cellV(ws, a1(0, 3 + i)) ?? "");
  }
  try {
    return JSON.parse(json) as unknown;
  } catch {
    return null;
  }
}

function asBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  const text = String(value ?? "").trim().toLowerCase();
  return text === "true" || text === "yes" || text === "on" || text === "1";
}

function asNumber(value: unknown, percent = false): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (percent && value > 1 && value <= 100) return value / 100;
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/%/g, "").trim());
    if (Number.isFinite(parsed)) {
      if (percent && parsed > 1 && parsed <= 100) return parsed / 100;
      return parsed;
    }
  }
  return 0;
}

function asSelect(field: Field, value: unknown): string {
  const text = String(value ?? "").trim();
  if (!text) return field.options?.[0]?.id ?? "";
  if (field.options?.some((option) => option.id === text)) return text;
  const byLabel = field.options?.find(
    (option) => option.label.toLowerCase() === text.toLowerCase(),
  );
  return byLabel?.id ?? text;
}

function coerceInput(field: Field, value: unknown): unknown {
  if (field.type === "switch") return asBoolean(value);
  if (field.type === "select") return asSelect(field, value);
  if (field.type === "number") return asNumber(value, field.inputScale === "percent");
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value;
  return String(value ?? "");
}

function overlayInputs(schema: FormSchema, values: EstimateValues, wb: WorkBook) {
  const ws = wb.Sheets[INPUTS_SHEET];
  if (!ws) return;
  const last = maxRow(ws);
  for (let row = 2; row <= last; row += 1) {
    const id = cellText(ws, a1(2, row));
    if (!id) continue;
    const field = schema.fields.find((item) => item.id === id);
    if (!field || field.type === "computed" || field.type === "repeater") continue;
    values[id] = coerceInput(field, cellV(ws, a1(1, row)));
  }
}

function repeaterSheetNames(schema: FormSchema): Record<string, string> {
  const used = new Set(
    [INPUTS_SHEET, RESULTS_SHEET, LOOKUPS_SHEET, SCHEMA_SHEET].map((name) => name.toLowerCase()),
  );
  const names: Record<string, string> = {};
  for (const field of schema.fields) {
    if (field.type !== "repeater") continue;
    names[field.id] = uniqueSheetName(field.label || field.id, used);
  }
  return names;
}

function findRepeaterSheet(
  wb: WorkBook,
  field: Field,
  expectedName?: string,
): WorkSheet | undefined {
  if (expectedName && wb.Sheets[expectedName]) return wb.Sheets[expectedName];
  if (field.label && wb.Sheets[field.label]) return wb.Sheets[field.label];
  if (wb.Sheets[field.id]) return wb.Sheets[field.id];
  const ids = new Set((field.itemFields ?? []).map((item) => item.id));
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    const first = cellText(ws, "A1");
    if (first && ids.has(first)) return ws;
  }
  return undefined;
}

function overlayRepeater(
  field: Field,
  values: EstimateValues,
  wb: WorkBook,
  expectedName?: string,
) {
  const ws = findRepeaterSheet(wb, field, expectedName);
  if (!ws) return;
  const last = maxRow(ws);
  const itemFields = field.itemFields ?? [];
  const colOf: Record<string, number> = {};
  for (let col = 0; col < 40; col += 1) {
    const id = cellText(ws, a1(col, REPEATER_ID_ROW));
    if (!id) break;
    colOf[id] = col;
  }
  const labelKey = field.itemLabelField ?? "name";
  const rows: Array<Record<string, unknown>> = [];
  for (let row = REPEATER_FIRST_DATA_ROW; row <= last; row += 1) {
    const next: Record<string, unknown> = {};
    for (const item of itemFields) {
      if (item.type === "computed") continue;
      const col = colOf[item.id];
      if (col == null) continue;
      next[item.id] = coerceInput(item, cellV(ws, a1(col, row)));
    }
    const idCol = colOf._id;
    const existingId = idCol != null ? cellText(ws, a1(idCol, row)) : "";
    const label = String(next[labelKey] ?? "").trim();
    if (!label && !existingId) continue;
    next._id = existingId || newRowId();
    rows.push(next);
  }
  if (rows.length) values[field.id] = rows;
}

export function overlayWorkbookValues(doc: FormDocument, wb: WorkBook): EstimateValues {
  const values = cloneJson(doc.values);
  overlayInputs(doc.schema, values, wb);
  const sheets = repeaterSheetNames(doc.schema);
  for (const field of doc.schema.fields) {
    if (field.type === "repeater") overlayRepeater(field, values, wb, sheets[field.id]);
  }
  return values;
}

export function parseEstimateWorkbook(
  wb: WorkBook,
  fallback?: FormDocument,
): SavedTemplate | null {
  const fromSchema = parseImportedTemplate(readSchemaJson(wb));
  const base: SavedTemplate | null = fromSchema
    ? fromSchema
    : fallback
      ? {
          id: "imported-xlsx",
          name: fallback.schema.name || "Imported workbook",
          kind: "quote",
          savedAt: new Date().toISOString(),
          sourceMode: fallback.schema.id === "advance" ? "advance" : "standard",
          schema: cloneJson(fallback.schema),
          values: cloneJson(fallback.values),
        }
      : null;
  if (!base) return null;
  const doc: FormDocument = {
    schema: base.schema,
    values: base.values ?? {},
  };
  return {
    ...base,
    kind: "quote",
    values: overlayWorkbookValues(doc, wb),
  };
}

export function isExcelFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".xlsx") || name.endsWith(".xlsm") || name.endsWith(".xls");
}
