import { FormulaError, parseFormula, type Ast } from "./formula";

export function encodeCol(index0: number): string {
  let n = index0 + 1;
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

export function quoteSheetName(name: string): string {
  if (/^[A-Za-z0-9_]+$/.test(name)) return name;
  return `'${name.replace(/'/g, "''")}'`;
}

export function a1(col0: number, row1: number, abs = false): string {
  const col = encodeCol(col0);
  return abs ? `$${col}$${row1}` : `${col}${row1}`;
}

export function sheetRange(
  sheet: string,
  col0: number,
  rowStart1: number,
  rowEnd1: number,
): string {
  const col = encodeCol(col0);
  return `${quoteSheetName(sheet)}!${col}${rowStart1}:${col}${rowEnd1}`;
}

export type ExcelFormulaContext = {
  ident(name: string): string;
  member(object: string, property: string): string;
  tableColumn(table: string, field: string): string;
};

const PREC = {
  eq: 1,
  cmp: 2,
  add: 3,
  mul: 4,
  pow: 5,
  unary: 6,
  primary: 7,
} as const;

function wrap(text: string, prec: number, parent: number): string {
  return prec < parent ? `(${text})` : text;
}

function excelString(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function emit(ast: Ast, ctx: ExcelFormulaContext, parent: number): string {
  switch (ast.type) {
    case "num":
      return String(ast.value);
    case "str":
      return excelString(ast.value);
    case "bool":
      return ast.value ? "TRUE" : "FALSE";
    case "ident":
      return ctx.ident(ast.name);
    case "member": {
      if (ast.object.type !== "ident") {
        throw new FormulaError("Invalid property access");
      }
      return ctx.member(ast.object.name, ast.property);
    }
    case "unary":
      return wrap(`-${emit(ast.expr, ctx, PREC.unary)}`, PREC.unary, parent);
    case "binary": {
      if (ast.op === "/") {
        const right = emit(ast.right, ctx, PREC.primary);
        const left = emit(ast.left, ctx, PREC.primary);
        const div = `IF((${right})=0,0,(${left})/(${right}))`;
        return wrap(div, PREC.primary, parent);
      }
      if (ast.op === "==") {
        return wrap(
          `${emit(ast.left, ctx, PREC.eq)}=${emit(ast.right, ctx, PREC.eq)}`,
          PREC.eq,
          parent,
        );
      }
      if (ast.op === "!=") {
        return wrap(
          `${emit(ast.left, ctx, PREC.eq)}<>${emit(ast.right, ctx, PREC.eq)}`,
          PREC.eq,
          parent,
        );
      }
      const prec =
        ast.op === "+" || ast.op === "-"
          ? PREC.add
          : ast.op === "*"
            ? PREC.mul
            : ast.op === "^"
              ? PREC.pow
              : PREC.cmp;
      const op =
        ast.op === "<" || ast.op === ">" || ast.op === "<=" || ast.op === ">="
          ? ast.op
          : ast.op;
      return wrap(
        `${emit(ast.left, ctx, prec)}${op}${emit(ast.right, ctx, prec)}`,
        prec,
        parent,
      );
    }
    case "call": {
      const fn = ast.name.toUpperCase();
      if (fn === "SUM") {
        if (ast.args.length !== 1) throw new FormulaError("SUM needs one argument");
        const path = tablePath(ast.args[0]);
        return `SUM(${ctx.tableColumn(path.table, path.field)})`;
      }
      if (fn === "COUNTIF") {
        if (ast.args.length !== 2) {
          throw new FormulaError("COUNTIF needs a table field and a value");
        }
        const path = tablePath(ast.args[0]);
        return `COUNTIF(${ctx.tableColumn(path.table, path.field)},${emit(ast.args[1], ctx, 0)})`;
      }
      const args = ast.args.map((arg) => emit(arg, ctx, 0)).join(",");
      return `${fn}(${args})`;
    }
  }
}

function tablePath(ast: Ast): { table: string; field: string } {
  if (ast.type === "member" && ast.object.type === "ident") {
    return { table: ast.object.name, field: ast.property };
  }
  throw new FormulaError("SUM/COUNTIF needs a table field like trades.price");
}

export function formulaToExcel(source: string, ctx: ExcelFormulaContext): string {
  return emit(parseFormula(source), ctx, 0);
}

export function selectValueName(fieldId: string): string {
  return fieldId;
}

export function selectIdName(fieldId: string): string {
  return `${fieldId}_id`;
}

export function selectLabelName(fieldId: string): string {
  return `${fieldId}_label`;
}

export function lookupRangeName(fieldId: string): string {
  return `Lookups_${fieldId}`;
}

const SHEET_ILLEGAL = new Set([":", "\\", "/", "?", "*", "[", "]"]);

export function uniqueSheetName(label: string, used: Set<string>): string {
  const cleaned =
    [...label]
      .map((ch) => (SHEET_ILLEGAL.has(ch) ? " " : ch))
      .join("")
      .replace(/\s+/g, " ")
      .trim() || "Sheet";
  let name = cleaned.slice(0, 31);
  let n = 2;
  while (used.has(name.toLowerCase())) {
    const suffix = ` ${n}`;
    name = `${cleaned.slice(0, Math.max(1, 31 - suffix.length))}${suffix}`;
    n += 1;
  }
  used.add(name.toLowerCase());
  return name;
}

export const INPUTS_SHEET = "Inputs";
export const RESULTS_SHEET = "Results";
export const LOOKUPS_SHEET = "Lookups";
export const SCHEMA_SHEET = "_Schema";
export const SCHEMA_MARKER = "ITNECK_ESTIMATE_SCHEMA_V1";
export const REPEATER_PAD = 40;
export const SCHEMA_CHUNK = 30000;
export const REPEATER_ID_ROW = 1;
export const REPEATER_LABEL_ROW = 2;
export const REPEATER_FIRST_DATA_ROW = 3;
