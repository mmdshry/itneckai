import type { CellObject, WorkBook, WorkSheet } from "xlsx";
import type { EngineResult } from "./engine";
import {
  INPUTS_SHEET,
  LOOKUPS_SHEET,
  REPEATER_FIRST_DATA_ROW,
  REPEATER_ID_ROW,
  REPEATER_LABEL_ROW,
  REPEATER_PAD,
  RESULTS_SHEET,
  SCHEMA_CHUNK,
  SCHEMA_MARKER,
  SCHEMA_SHEET,
  a1,
  formulaToExcel,
  lookupRangeName,
  quoteSheetName,
  selectIdName,
  selectLabelName,
  uniqueSheetName,
  type ExcelFormulaContext,
} from "./excelFormula";
import { estimatePrintTitle } from "./format";
import { asRowArray, type Field, type FormDocument } from "./schema";
import type { SavedTemplate, TemplateKind } from "./storage";

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function templateFileName(name: string, kind: TemplateKind): string {
  const slug = estimatePrintTitle(name).replace(/-BIM-estimate$/i, "");
  return `${slug || "template"}-${kind}.json`;
}

export function excelFileName(projectName: string): string {
  return `${estimatePrintTitle(projectName)}.xlsx`;
}

export type RepeaterLayout = {
  fieldId: string;
  sheet: string;
  columns: string[];
  colIndex: Record<string, number>;
  firstDataRow: number;
  lastDataRow: number;
  dataCount: number;
};

export type LookupIdRange = {
  start: number;
  end: number;
};

export type ExcelLayout = {
  selectIds: Set<string>;
  repeaters: Record<string, RepeaterLayout>;
  inputRows: Record<string, number>;
  resultRows: Record<string, number>;
  lookupIdRanges: Record<string, LookupIdRange>;
};

type DefinedName = { Name: string; Ref: string };

export type WorkbookData = {
  sheets: { name: string; ws: WorkSheet }[];
  names: DefinedName[];
  hidden: string[];
  layout: ExcelLayout;
};

function absRef(sheet: string, col0: number, row1: number): string {
  return `${quoteSheetName(sheet)}!${a1(col0, row1, true)}`;
}

function absRange(sheet: string, c1: number, r1: number, c2: number, r2: number): string {
  return `${quoteSheetName(sheet)}!${a1(c1, r1, true)}:${a1(c2, r2, true)}`;
}

function setCell(ws: WorkSheet, addr: string, cell: CellObject) {
  ws[addr] = cell;
}

function header(value: string): CellObject {
  return { t: "s", v: value };
}

function textCell(value: unknown): CellObject {
  return { t: "s", v: value == null ? "" : String(value) };
}

function numberFormat(field: Field): string | undefined {
  if (field.inputScale === "percent" || field.format === "percent" || field.suffix === "%") {
    return "0%";
  }
  if (field.format === "usd" || field.format === "perSf") return "$#,##0.00";
  if (field.suffix?.includes("$")) return "$#,##0.00";
  if (field.format === "hours") return "0.0";
  if (field.format === "factor") return "0.00";
  if (field.format === "number") return "#,##0.00";
  if (field.type !== "number") return undefined;
  if (field.suffix === "SF") return "#,##0";
  const step = field.step;
  if (typeof step === "number" && step > 0 && step < 0.01) return "0.0000";
  if (typeof step === "number" && step >= 1 && Number.isInteger(step)) return "0";
  return undefined;
}

function isNumericExcelFormat(z?: string): boolean {
  if (!z) return false;
  return (
    z === "0%" ||
    z === "0.0" ||
    z === "0.00" ||
    z === "0.0000" ||
    z === "0" ||
    z === "#,##0" ||
    z === "#,##0.00" ||
    z.startsWith("$#")
  );
}

function valueCell(field: Field, value: unknown): CellObject {
  const z = numberFormat(field);
  if (field.type === "switch") return { t: "b", v: Boolean(value) };
  if (field.type === "select") {
    return { t: "s", v: typeof value === "string" ? value : String(value ?? "") };
  }
  if (field.type === "number" || field.inputScale === "percent") {
    const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
    return z ? { t: "n", v: n, z } : { t: "n", v: n };
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return z ? { t: "n", v: value, z } : { t: "n", v: value };
  }
  if (typeof value === "boolean") return { t: "b", v: value };
  return textCell(value);
}

function formulaCell(formula: string, cached: unknown, z?: string): CellObject {
  if (typeof cached === "boolean") return { t: "b", f: formula, v: cached };
  if (typeof cached === "number" && Number.isFinite(cached)) {
    return z ? { t: "n", f: formula, v: cached, z } : { t: "n", f: formula, v: cached };
  }
  if (isNumericExcelFormat(z)) {
    return z ? { t: "n", f: formula, v: 0, z } : { t: "n", f: formula, v: 0 };
  }
  return { t: "s", f: formula, v: cached == null ? "" : String(cached) };
}

function finishSheet(ws: WorkSheet, maxCol0: number, maxRow1: number) {
  ws["!ref"] = `A1:${a1(maxCol0, maxRow1)}`;
}

export function scalarContext(layout: ExcelLayout): ExcelFormulaContext {
  return {
    ident(name) {
      return name;
    },
    member(object, property) {
      if (property === "id") return selectIdName(object);
      if (property === "label") return selectLabelName(object);
      return object;
    },
    tableColumn(table, field) {
      const spec = layout.repeaters[table];
      if (!spec) throw new Error(`Unknown table "${table}"`);
      const col = spec.colIndex[field];
      if (col == null) throw new Error(`Unknown column "${table}.${field}"`);
      const letter = a1(col, spec.firstDataRow).replace(/\d+$/, "");
      return `${quoteSheetName(spec.sheet)}!${letter}${spec.firstDataRow}:${letter}${spec.lastDataRow}`;
    },
  };
}

export function rowContext(
  layout: ExcelLayout,
  repeaterId: string,
  row1: number,
): ExcelFormulaContext {
  const spec = layout.repeaters[repeaterId];
  const parent = scalarContext(layout);
  return {
    ident(name) {
      if (spec && name in spec.colIndex) return a1(spec.colIndex[name], row1);
      return parent.ident(name);
    },
    member: parent.member,
    tableColumn: parent.tableColumn,
  };
}

function buildLayout(doc: FormDocument): ExcelLayout {
  const used = new Set<string>([
    INPUTS_SHEET.toLowerCase(),
    RESULTS_SHEET.toLowerCase(),
    LOOKUPS_SHEET.toLowerCase(),
    SCHEMA_SHEET.toLowerCase(),
  ]);
  const selectIds = new Set<string>();
  const inputRows: Record<string, number> = {};
  const resultRows: Record<string, number> = {};
  const repeaters: Record<string, RepeaterLayout> = {};

  let inputRow = 2;
  for (const field of doc.schema.fields) {
    if (field.type === "repeater" || field.type === "computed") continue;
    if (field.type === "select") selectIds.add(field.id);
    inputRows[field.id] = inputRow;
    inputRow += 1;
  }

  let resultRow = 2;
  for (const field of doc.schema.fields) {
    if (field.type !== "computed") continue;
    resultRows[field.id] = resultRow;
    resultRow += 1;
  }

  for (const field of doc.schema.fields) {
    if (field.type !== "repeater") continue;
    const columns = (field.itemFields ?? [])
      .filter((item) => item.id !== "_id")
      .map((item) => item.id);
    columns.push("_id");
    const colIndex: Record<string, number> = {};
    columns.forEach((id, index) => {
      colIndex[id] = index;
    });
    const dataCount = asRowArray(doc.values[field.id]).length;
    const totalRows = Math.max(dataCount, 1) + REPEATER_PAD;
    repeaters[field.id] = {
      fieldId: field.id,
      sheet: uniqueSheetName(field.label || field.id, used),
      columns,
      colIndex,
      firstDataRow: REPEATER_FIRST_DATA_ROW,
      lastDataRow: REPEATER_FIRST_DATA_ROW + totalRows - 1,
      dataCount,
    };
  }

  return { selectIds, repeaters, inputRows, resultRows, lookupIdRanges: {} };
}

function collectNames(layout: ExcelLayout): DefinedName[] {
  const names: DefinedName[] = [];
  for (const [id, row] of Object.entries(layout.inputRows)) {
    if (layout.selectIds.has(id)) {
      names.push({ Name: selectIdName(id), Ref: absRef(INPUTS_SHEET, 1, row) });
      names.push({ Name: selectLabelName(id), Ref: absRef(INPUTS_SHEET, 3, row) });
      names.push({ Name: id, Ref: absRef(INPUTS_SHEET, 4, row) });
    } else {
      names.push({ Name: id, Ref: absRef(INPUTS_SHEET, 1, row) });
    }
  }
  for (const [id, row] of Object.entries(layout.resultRows)) {
    names.push({ Name: id, Ref: absRef(RESULTS_SHEET, 1, row) });
  }
  return names;
}

function buildLookups(doc: FormDocument, names: DefinedName[], layout: ExcelLayout): WorkSheet {
  const ws: WorkSheet = {};
  setCell(ws, "A1", header("Field id"));
  setCell(ws, "B1", header("Option id"));
  setCell(ws, "C1", header("Label"));
  setCell(ws, "D1", header("Value"));
  let row = 2;
  for (const field of doc.schema.fields) {
    if (field.type !== "select" || !field.options?.length) continue;
    const start = row;
    for (const option of field.options) {
      setCell(ws, a1(0, row), textCell(field.id));
      setCell(ws, a1(1, row), textCell(option.id));
      setCell(ws, a1(2, row), textCell(option.label));
      setCell(ws, a1(3, row), { t: "n", v: option.value });
      row += 1;
    }
    const end = row - 1;
    layout.lookupIdRanges[field.id] = { start, end };
    names.push({
      Name: lookupRangeName(field.id),
      Ref: absRange(LOOKUPS_SHEET, 1, start, 3, end),
    });
  }
  finishSheet(ws, 3, Math.max(1, row - 1));
  ws["!cols"] = [{ wch: 18 }, { wch: 16 }, { wch: 28 }, { wch: 12 }];
  return ws;
}

function buildInputs(doc: FormDocument, layout: ExcelLayout): WorkSheet {
  const ws: WorkSheet = {};
  setCell(ws, "A1", header("Label"));
  setCell(ws, "B1", header("Value"));
  setCell(ws, "C1", header("Field id"));
  setCell(ws, "D1", header("Select label"));
  setCell(ws, "E1", header("Select value"));
  let maxRow = 1;
  for (const field of doc.schema.fields) {
    if (field.type === "repeater" || field.type === "computed") continue;
    const row = layout.inputRows[field.id];
    maxRow = Math.max(maxRow, row);
    setCell(ws, a1(0, row), textCell(field.label));
    setCell(ws, a1(1, row), valueCell(field, doc.values[field.id]));
    setCell(ws, a1(2, row), textCell(field.id));
    if (field.type === "select") {
      const table = lookupRangeName(field.id);
      const idName = selectIdName(field.id);
      setCell(ws, a1(3, row), {
        t: "s",
        f: `IFERROR(VLOOKUP(${idName},${table},2,FALSE),"")`,
        v: field.options?.find((item) => item.id === doc.values[field.id])?.label ?? "",
      });
      setCell(ws, a1(4, row), {
        t: "n",
        f: `IFERROR(VLOOKUP(${idName},${table},3,FALSE),0)`,
        v: field.options?.find((item) => item.id === doc.values[field.id])?.value ?? 0,
      });
    }
  }
  finishSheet(ws, 4, maxRow);
  ws["!cols"] = [{ wch: 28 }, { wch: 18 }, { wch: 22 }, { wch: 22 }, { wch: 14 }];
  return ws;
}

function buildResults(
  doc: FormDocument,
  result: EngineResult,
  layout: ExcelLayout,
  ctx: ExcelFormulaContext,
): WorkSheet {
  const ws: WorkSheet = {};
  setCell(ws, "A1", header("Label"));
  setCell(ws, "B1", header("Value"));
  setCell(ws, "C1", header("Role"));
  setCell(ws, "D1", header("Field id"));
  let maxRow = 1;
  for (const field of doc.schema.fields) {
    if (field.type !== "computed") continue;
    const row = layout.resultRows[field.id];
    maxRow = Math.max(maxRow, row);
    setCell(ws, a1(0, row), textCell(field.label));
    const cached = result.scalars[field.id];
    const z = numberFormat(field);
    if (field.formula) {
      try {
        setCell(ws, a1(1, row), formulaCell(formulaToExcel(field.formula, ctx), cached, z));
      } catch {
        setCell(ws, a1(1, row), valueCell(field, cached));
      }
    } else {
      setCell(ws, a1(1, row), valueCell(field, cached));
    }
    setCell(ws, a1(2, row), textCell(field.role ?? ""));
    setCell(ws, a1(3, row), textCell(field.id));
  }
  finishSheet(ws, 3, maxRow);
  ws["!cols"] = [{ wch: 28 }, { wch: 22 }, { wch: 14 }, { wch: 22 }];
  return ws;
}

function buildRepeater(
  field: Field,
  doc: FormDocument,
  result: EngineResult,
  layout: ExcelLayout,
): WorkSheet {
  const spec = layout.repeaters[field.id];
  const ws: WorkSheet = {};
  const itemFields = field.itemFields ?? [];
  const evaluated = result.rows[field.id] ?? asRowArray(doc.values[field.id]);
  spec.columns.forEach((id, col) => {
    const item = itemFields.find((entry) => entry.id === id);
    setCell(ws, a1(col, REPEATER_ID_ROW), textCell(id));
    setCell(ws, a1(col, REPEATER_LABEL_ROW), textCell(item?.label || id));
  });
  const total = spec.lastDataRow - spec.firstDataRow + 1;
  for (let i = 0; i < total; i += 1) {
    const row1 = spec.firstDataRow + i;
    const data = evaluated[i] ?? {};
    spec.columns.forEach((id, col) => {
      const item = itemFields.find((entry) => entry.id === id);
      const addr = a1(col, row1);
      if (id === "_id") {
        setCell(ws, addr, textCell(typeof data._id === "string" ? data._id : ""));
        return;
      }
      if (!item) return;
      if (item.type === "computed" && item.formula) {
        try {
          const f = formulaToExcel(item.formula, rowContext(layout, field.id, row1));
          setCell(ws, addr, formulaCell(f, data[item.id], numberFormat(item)));
        } catch {
          setCell(ws, addr, valueCell(item, data[item.id]));
        }
        return;
      }
      setCell(ws, addr, valueCell(item, data[item.id]));
    });
  }
  finishSheet(ws, spec.columns.length - 1, spec.lastDataRow);
  ws["!rows"] = [{ hidden: true }];
  ws["!cols"] = spec.columns.map((id) =>
    id === "_id" ? { hidden: true, wch: 14 } : { wch: 16 },
  );
  return ws;
}

function buildSchemaSheet(template: SavedTemplate): WorkSheet {
  const json = JSON.stringify(template);
  const chunks: string[] = [];
  for (let i = 0; i < json.length; i += SCHEMA_CHUNK) {
    chunks.push(json.slice(i, i + SCHEMA_CHUNK));
  }
  const ws: WorkSheet = {};
  setCell(ws, "A1", textCell(SCHEMA_MARKER));
  setCell(ws, "A2", { t: "n", v: chunks.length });
  chunks.forEach((chunk, index) => {
    setCell(ws, a1(0, 3 + index), textCell(chunk));
  });
  finishSheet(ws, 0, 2 + chunks.length);
  ws["!cols"] = [{ wch: 40 }];
  return ws;
}

export function buildEstimateWorkbookData(
  doc: FormDocument,
  result: EngineResult,
  template: SavedTemplate,
): WorkbookData {
  const layout = buildLayout(doc);
  const names = collectNames(layout);
  const ctx = scalarContext(layout);
  const sheets: { name: string; ws: WorkSheet }[] = [
    { name: LOOKUPS_SHEET, ws: buildLookups(doc, names, layout) },
    { name: INPUTS_SHEET, ws: buildInputs(doc, layout) },
  ];
  for (const field of doc.schema.fields) {
    if (field.type !== "repeater") continue;
    sheets.push({
      name: layout.repeaters[field.id].sheet,
      ws: buildRepeater(field, doc, result, layout),
    });
  }
  sheets.push({ name: RESULTS_SHEET, ws: buildResults(doc, result, layout, ctx) });
  sheets.push({ name: SCHEMA_SHEET, ws: buildSchemaSheet(template) });
  return { sheets, names, hidden: [SCHEMA_SHEET], layout };
}

export function assembleEstimateWorkbook(
  XLSX: {
    utils: {
      book_new: () => WorkBook;
      book_append_sheet: (wb: WorkBook, ws: WorkSheet, name: string) => void;
      book_set_sheet_visibility: (wb: WorkBook, sheet: number | string, vis: number) => void;
    };
  },
  data: WorkbookData,
): WorkBook {
  const wb = XLSX.utils.book_new();
  for (const sheet of data.sheets) {
    XLSX.utils.book_append_sheet(wb, sheet.ws, sheet.name);
  }
  for (const name of data.hidden) {
    XLSX.utils.book_set_sheet_visibility(wb, name, 1);
  }
  wb.Workbook = { ...(wb.Workbook ?? {}), Names: data.names };
  return wb;
}

function attr(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match?.[1];
}

function worksheetZipPath(
  files: Record<string, Uint8Array>,
  sheetName: string,
  strFromU8: (data: Uint8Array) => string,
): string | undefined {
  const workbook = files["xl/workbook.xml"];
  const rels = files["xl/_rels/workbook.xml.rels"];
  if (!workbook || !rels) return undefined;
  const wbXml = strFromU8(workbook);
  const sheetTag = wbXml.match(new RegExp(`<sheet\\b[^>]*\\bname="${sheetName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*\\/?>`));
  if (!sheetTag) return undefined;
  const rid = attr(sheetTag[0], "r:id");
  if (!rid) return undefined;
  const relXml = strFromU8(rels);
  const relTag = relXml.match(new RegExp(`<Relationship\\b[^>]*\\bId="${rid}"[^>]*\\/?>`));
  if (!relTag) return undefined;
  const target = attr(relTag[0], "Target");
  if (!target) return undefined;
  const normalized = target.replace(/^\//, "").replace(/^xl\//, "");
  return `xl/${normalized}`;
}

export function buildInputListValidationsXml(layout: ExcelLayout): string {
  const items: string[] = [];
  for (const [id, range] of Object.entries(layout.lookupIdRanges)) {
    const row = layout.inputRows[id];
    if (!row || range.end < range.start) continue;
    const sqref = a1(1, row);
    const formula = absRange(LOOKUPS_SHEET, 1, range.start, 1, range.end);
    items.push(
      `<dataValidation type="list" allowBlank="1" sqref="${sqref}"><formula1>${formula}</formula1></dataValidation>`,
    );
  }
  if (!items.length) return "";
  return `<dataValidations count="${items.length}">${items.join("")}</dataValidations>`;
}

function insertDataValidations(sheetXml: string, validationsXml: string): string {
  if (!validationsXml || sheetXml.includes("<dataValidations")) return sheetXml;
  if (sheetXml.includes("<ignoredErrors")) {
    return sheetXml.replace("<ignoredErrors", `${validationsXml}<ignoredErrors`);
  }
  return sheetXml.replace("</worksheet>", `${validationsXml}</worksheet>`);
}

type ZipTools = {
  unzipSync: (data: Uint8Array) => Record<string, Uint8Array>;
  zipSync: (data: Record<string, Uint8Array>) => Uint8Array;
  strToU8: (str: string) => Uint8Array;
  strFromU8: (data: Uint8Array) => string;
};

export function injectInputListValidations(
  xlsxBytes: Uint8Array,
  layout: ExcelLayout,
  zip: ZipTools,
): Uint8Array {
  const xml = buildInputListValidationsXml(layout);
  if (!xml) return xlsxBytes;
  const files = zip.unzipSync(xlsxBytes);
  const path = worksheetZipPath(files, INPUTS_SHEET, zip.strFromU8);
  if (!path || !files[path]) return xlsxBytes;
  const patched = insertDataValidations(zip.strFromU8(files[path]), xml);
  files[path] = zip.strToU8(patched);
  return zip.zipSync(files);
}

function toUint8Array(raw: Uint8Array | ArrayBuffer): Uint8Array {
  return raw instanceof Uint8Array ? raw : new Uint8Array(raw);
}

function downloadBytes(filename: string, bytes: Uint8Array, mime: string) {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  const blob = new Blob([copy], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function writeEstimateXlsxBytes(
  XLSX: {
    write: (wb: WorkBook, opts: { bookType: "xlsx"; type: "array" }) => ArrayBuffer | Uint8Array;
    utils: {
      book_new: () => WorkBook;
      book_append_sheet: (wb: WorkBook, ws: WorkSheet, name: string) => void;
      book_set_sheet_visibility: (wb: WorkBook, sheet: number | string, vis: number) => void;
    };
  },
  zip: ZipTools,
  data: WorkbookData,
): Promise<Uint8Array> {
  const wb = assembleEstimateWorkbook(XLSX, data);
  const raw = toUint8Array(XLSX.write(wb, { bookType: "xlsx", type: "array" }));
  return injectInputListValidations(raw, data.layout, zip);
}

export async function downloadExcel(
  filename: string,
  doc: FormDocument,
  result: EngineResult,
  template: SavedTemplate,
) {
  const XLSX = await import("xlsx");
  const zip = await import("fflate");
  const data = buildEstimateWorkbookData(doc, result, template);
  const bytes = await writeEstimateXlsxBytes(XLSX, zip, data);
  downloadBytes(
    filename,
    bytes,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
