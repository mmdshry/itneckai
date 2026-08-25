export class FormulaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormulaError";
  }
}

export type Ast =
  | { type: "num"; value: number }
  | { type: "str"; value: string }
  | { type: "bool"; value: boolean }
  | { type: "ident"; name: string }
  | { type: "member"; object: Ast; property: string }
  | { type: "call"; name: string; args: Ast[] }
  | { type: "unary"; op: "-"; expr: Ast }
  | { type: "binary"; op: BinaryOp; left: Ast; right: Ast };

export type BinaryOp =
  | "+"
  | "-"
  | "*"
  | "/"
  | "^"
  | "=="
  | "!="
  | "<"
  | ">"
  | "<="
  | ">=";

export type FormulaValue = number | string | boolean;

export type SelectBinding = {
  kind: "select";
  id: string;
  label: string;
  value: number;
};

export type RepeaterBinding = {
  kind: "repeater";
  rows: Array<Record<string, unknown>>;
};

export type Binding = FormulaValue | SelectBinding | RepeaterBinding;

export type FormulaScope = {
  get(name: string): Binding | undefined;
};

type Token =
  | { kind: "num"; value: number }
  | { kind: "str"; value: string }
  | { kind: "ident"; value: string }
  | { kind: "op"; value: string }
  | { kind: "eof" };

const OPS = new Set([
  "+",
  "-",
  "*",
  "/",
  "^",
  "(",
  ")",
  ",",
  ".",
  "==",
  "!=",
  "<=",
  ">=",
  "<",
  ">",
]);

function isDigit(ch: string) {
  return ch >= "0" && ch <= "9";
}

function isIdentStart(ch: string) {
  return (ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z") || ch === "_";
}

function isIdentPart(ch: string) {
  return isIdentStart(ch) || isDigit(ch);
}

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = source.length;

  while (i < n) {
    const ch = source[i];
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      i += 1;
      continue;
    }
    if (isDigit(ch) || (ch === "." && i + 1 < n && isDigit(source[i + 1]))) {
      let j = i;
      let sawDot = false;
      if (source[j] === ".") {
        sawDot = true;
        j += 1;
      }
      while (j < n && isDigit(source[j])) j += 1;
      if (!sawDot && j < n && source[j] === ".") {
        sawDot = true;
        j += 1;
        while (j < n && isDigit(source[j])) j += 1;
      }
      const raw = source.slice(i, j);
      const value = Number(raw);
      if (!Number.isFinite(value)) {
        throw new FormulaError(`Invalid number "${raw}"`);
      }
      tokens.push({ kind: "num", value });
      i = j;
      continue;
    }
    if (ch === '"') {
      let j = i + 1;
      let out = "";
      while (j < n && source[j] !== '"') {
        if (source[j] === "\\" && j + 1 < n) {
          out += source[j + 1];
          j += 2;
          continue;
        }
        out += source[j];
        j += 1;
      }
      if (j >= n) throw new FormulaError("Unterminated string");
      tokens.push({ kind: "str", value: out });
      i = j + 1;
      continue;
    }
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (j < n && isIdentPart(source[j])) j += 1;
      tokens.push({ kind: "ident", value: source.slice(i, j) });
      i = j;
      continue;
    }
    const two = source.slice(i, i + 2);
    if (OPS.has(two)) {
      tokens.push({ kind: "op", value: two });
      i += 2;
      continue;
    }
    if (OPS.has(ch)) {
      tokens.push({ kind: "op", value: ch });
      i += 1;
      continue;
    }
    throw new FormulaError(`Unexpected character "${ch}"`);
  }

  tokens.push({ kind: "eof" });
  return tokens;
}

class Parser {
  private pos = 0;
  constructor(private tokens: Token[]) {}

  parse(): Ast {
    const expr = this.equality();
    this.expect("eof");
    return expr;
  }

  private peek(): Token {
    return this.tokens[this.pos] ?? { kind: "eof" };
  }

  private eat(): Token {
    const token = this.peek();
    this.pos += 1;
    return token;
  }

  private expect(kind: Token["kind"] | "op", value?: string) {
    const token = this.eat();
    if (kind === "op") {
      if (token.kind !== "op" || (value && token.value !== value)) {
        throw new FormulaError(`Expected "${value ?? kind}"`);
      }
      return token;
    }
    if (token.kind !== kind) {
      throw new FormulaError(`Unexpected token in formula`);
    }
    return token;
  }

  private matchOp(...ops: string[]): string | null {
    const token = this.peek();
    if (token.kind === "op" && ops.includes(token.value)) {
      this.eat();
      return token.value;
    }
    return null;
  }

  private equality(): Ast {
    let left = this.comparison();
    for (;;) {
      const op = this.matchOp("==", "!=");
      if (!op) break;
      left = { type: "binary", op: op as BinaryOp, left, right: this.comparison() };
    }
    return left;
  }

  private comparison(): Ast {
    let left = this.add();
    for (;;) {
      const op = this.matchOp("<", ">", "<=", ">=");
      if (!op) break;
      left = { type: "binary", op: op as BinaryOp, left, right: this.add() };
    }
    return left;
  }

  private add(): Ast {
    let left = this.mul();
    for (;;) {
      const op = this.matchOp("+", "-");
      if (!op) break;
      left = { type: "binary", op: op as BinaryOp, left, right: this.mul() };
    }
    return left;
  }

  private mul(): Ast {
    let left = this.unary();
    for (;;) {
      const op = this.matchOp("*", "/");
      if (!op) break;
      left = { type: "binary", op: op as BinaryOp, left, right: this.unary() };
    }
    return left;
  }

  private unary(): Ast {
    if (this.matchOp("-")) {
      return { type: "unary", op: "-", expr: this.unary() };
    }
    this.matchOp("+");
    return this.power();
  }

  private power(): Ast {
    const left = this.postfix();
    if (this.matchOp("^")) {
      return { type: "binary", op: "^", left, right: this.unary() };
    }
    return left;
  }

  private postfix(): Ast {
    let node = this.primary();
    for (;;) {
      if (this.matchOp(".")) {
        const token = this.peek();
        if (token.kind !== "ident") throw new FormulaError("Expected name after '.'");
        this.eat();
        node = { type: "member", object: node, property: token.value };
        continue;
      }
      if (this.matchOp("(")) {
        if (node.type !== "ident") {
          throw new FormulaError("Only named functions can be called");
        }
        const args: Ast[] = [];
        if (!this.matchOp(")")) {
          args.push(this.equality());
          while (this.matchOp(",")) args.push(this.equality());
          this.expect("op", ")");
        }
        node = { type: "call", name: node.name, args };
        continue;
      }
      break;
    }
    return node;
  }

  private primary(): Ast {
    const token = this.eat();
    if (token.kind === "num") return { type: "num", value: token.value };
    if (token.kind === "str") return { type: "str", value: token.value };
    if (token.kind === "ident") {
      const lower = token.value.toLowerCase();
      if (lower === "true") return { type: "bool", value: true };
      if (lower === "false") return { type: "bool", value: false };
      return { type: "ident", name: token.value };
    }
    if (token.kind === "op" && token.value === "(") {
      const expr = this.equality();
      this.expect("op", ")");
      return expr;
    }
    throw new FormulaError("Expected a value in formula");
  }
}

export function parseFormula(source: string): Ast {
  const trimmed = source.trim();
  if (!trimmed) throw new FormulaError("Empty formula");
  return new Parser(tokenize(trimmed)).parse();
}

export function collectDeps(ast: Ast): Set<string> {
  const deps = new Set<string>();
  walk(ast);

  function walk(node: Ast) {
    switch (node.type) {
      case "ident":
        deps.add(node.name);
        break;
      case "member":
        if (node.object.type === "ident") {
          deps.add(node.object.name);
          deps.add(`${node.object.name}.${node.property}`);
        } else {
          walk(node.object);
        }
        break;
      case "call":
        node.args.forEach(walk);
        break;
      case "unary":
        walk(node.expr);
        break;
      case "binary":
        walk(node.left);
        walk(node.right);
        break;
      default:
        break;
    }
  }

  return deps;
}

function asNumber(value: FormulaValue, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new FormulaError(`${label} must be a number`);
  }
  return value;
}

export function isTruthy(value: FormulaValue): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return value.length > 0;
}

export function valuesEqual(a: FormulaValue, b: FormulaValue): boolean {
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-12;
  }
  return a === b;
}

function unwrapIdent(value: Binding): FormulaValue {
  if (typeof value === "object" && value !== null && "kind" in value) {
    if (value.kind === "select") return value.value;
    throw new FormulaError("Cannot use a table as a number");
  }
  return value;
}

function memberOf(value: Binding, property: string): FormulaValue {
  if (typeof value === "object" && value !== null && "kind" in value) {
    if (value.kind === "select") {
      if (property === "id") return value.id;
      if (property === "label") return value.label;
      if (property === "value") return value.value;
      throw new FormulaError(`Unknown property "${property}"`);
    }
    throw new FormulaError(`Cannot read ".${property}" on a table`);
  }
  throw new FormulaError(`Cannot read ".${property}"`);
}

function repeaterPath(arg: Ast): { table: string; field: string } {
  if (arg.type === "member" && arg.object.type === "ident") {
    return { table: arg.object.name, field: arg.property };
  }
  throw new FormulaError("SUM/COUNTIF needs a table field like trades.price");
}

function roundTo(value: number, digits: number): number {
  if (digits <= 0) return Math.round(value);
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function evaluateAst(ast: Ast, scope: FormulaScope): FormulaValue {
  switch (ast.type) {
    case "num":
      return ast.value;
    case "str":
      return ast.value;
    case "bool":
      return ast.value;
    case "ident": {
      const bound = scope.get(ast.name);
      if (bound === undefined) throw new FormulaError(`Unknown name "${ast.name}"`);
      return unwrapIdent(bound);
    }
    case "member": {
      if (ast.object.type !== "ident") {
        throw new FormulaError("Invalid property access");
      }
      const bound = scope.get(ast.object.name);
      if (bound === undefined) {
        throw new FormulaError(`Unknown name "${ast.object.name}"`);
      }
      return memberOf(bound, ast.property);
    }
    case "unary":
      return -asNumber(evaluateAst(ast.expr, scope), "Value");
    case "binary": {
      const left = evaluateAst(ast.left, scope);
      const right = evaluateAst(ast.right, scope);
      switch (ast.op) {
        case "+":
          return asNumber(left, "Left") + asNumber(right, "Right");
        case "-":
          return asNumber(left, "Left") - asNumber(right, "Right");
        case "*":
          return asNumber(left, "Left") * asNumber(right, "Right");
        case "/": {
          const denom = asNumber(right, "Divisor");
          if (denom === 0) return 0;
          return asNumber(left, "Dividend") / denom;
        }
        case "^":
          return asNumber(left, "Base") ** asNumber(right, "Exponent");
        case "==":
          return valuesEqual(left, right);
        case "!=":
          return !valuesEqual(left, right);
        case "<":
          return asNumber(left, "Left") < asNumber(right, "Right");
        case ">":
          return asNumber(left, "Left") > asNumber(right, "Right");
        case "<=":
          return asNumber(left, "Left") <= asNumber(right, "Right");
        case ">=":
          return asNumber(left, "Left") >= asNumber(right, "Right");
      }
      break;
    }
    case "call":
      return evaluateCall(ast.name, ast.args, scope);
  }
}

const FUNCS = new Set([
  "IF",
  "AND",
  "OR",
  "NOT",
  "MIN",
  "MAX",
  "ABS",
  "ROUND",
  "SUM",
  "COUNTIF",
]);

function evaluateCall(name: string, args: Ast[], scope: FormulaScope): FormulaValue {
  const fn = name.toUpperCase();
  if (!FUNCS.has(fn)) throw new FormulaError(`Unknown function ${name}`);

  if (fn === "SUM") {
    if (args.length !== 1) throw new FormulaError("SUM needs one argument");
    const { table, field } = repeaterPath(args[0]);
    const bound = scope.get(table);
    if (!bound || typeof bound !== "object" || bound.kind !== "repeater") {
      throw new FormulaError(`"${table}" is not a table`);
    }
    return bound.rows.reduce((sum, row) => {
      const cell = row[field];
      return sum + (typeof cell === "number" && Number.isFinite(cell) ? cell : 0);
    }, 0);
  }

  if (fn === "COUNTIF") {
    if (args.length !== 2) throw new FormulaError("COUNTIF needs a table field and a value");
    const { table, field } = repeaterPath(args[0]);
    const needle = evaluateAst(args[1], scope);
    const bound = scope.get(table);
    if (!bound || typeof bound !== "object" || bound.kind !== "repeater") {
      throw new FormulaError(`"${table}" is not a table`);
    }
    return bound.rows.reduce((count, row) => {
      const cell = row[field];
      if (
        cell === needle ||
        (typeof cell === "number" && typeof needle === "number" && valuesEqual(cell, needle))
      ) {
        return count + 1;
      }
      return count;
    }, 0);
  }

  const values = args.map((arg) => evaluateAst(arg, scope));

  switch (fn) {
    case "IF":
      if (values.length !== 3) throw new FormulaError("IF needs 3 arguments");
      return isTruthy(values[0]) ? values[1] : values[2];
    case "AND":
      if (values.length < 1) throw new FormulaError("AND needs arguments");
      return values.every(isTruthy);
    case "OR":
      if (values.length < 1) throw new FormulaError("OR needs arguments");
      return values.some(isTruthy);
    case "NOT":
      if (values.length !== 1) throw new FormulaError("NOT needs 1 argument");
      return !isTruthy(values[0]);
    case "MIN":
      return Math.min(...values.map((value) => asNumber(value, "MIN")));
    case "MAX":
      return Math.max(...values.map((value) => asNumber(value, "MAX")));
    case "ABS":
      if (values.length !== 1) throw new FormulaError("ABS needs 1 argument");
      return Math.abs(asNumber(values[0], "ABS"));
    case "ROUND": {
      if (values.length < 1 || values.length > 2) {
        throw new FormulaError("ROUND needs 1 or 2 arguments");
      }
      const digits = values.length === 2 ? asNumber(values[1], "Digits") : 0;
      return roundTo(asNumber(values[0], "ROUND"), digits);
    }
    default:
      throw new FormulaError(`Unknown function ${name}`);
  }
}

export function evaluateFormula(source: string, scope: FormulaScope): FormulaValue {
  return evaluateAst(parseFormula(source), scope);
}
