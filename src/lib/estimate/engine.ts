import {
  asRowArray,
  coerceNumber,
  type EstimateValues,
  type Field,
  type FormDocument,
  type FormSchema,
  type SelectOption,
} from "./schema";
import {
  collectDeps,
  evaluateFormula,
  FormulaError,
  isTruthy,
  parseFormula,
  type Binding,
  type FormulaValue,
  type RepeaterBinding,
  type SelectBinding,
} from "./formula";

export type EngineResult = {
  scalars: Record<string, FormulaValue>;
  rows: Record<string, Array<Record<string, unknown>>>;
  errors: Record<string, string>;
};

function selectBinding(field: Field, selectedId: unknown): SelectBinding {
  const options = field.options ?? [];
  const id = typeof selectedId === "string" ? selectedId : "";
  const option: SelectOption | undefined =
    options.find((item) => item.id === id) ?? options[0];
  return {
    kind: "select",
    id: option?.id ?? id,
    label: option?.label ?? id,
    value: option?.value ?? 0,
  };
}

function asFormulaValue(value: unknown): FormulaValue {
  if (typeof value === "boolean" || typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value == null) return 0;
  return String(value);
}

type NodeKind = "field" | "item";

type Node = {
  key: string;
  kind: NodeKind;
  field: Field;
  repeaterId?: string;
};

function allNodes(schema: FormSchema): Node[] {
  const nodes: Node[] = [];
  for (const field of schema.fields) {
    if (field.type === "repeater") {
      nodes.push({ key: `field:${field.id}`, kind: "field", field });
      for (const item of field.itemFields ?? []) {
        nodes.push({
          key: `item:${field.id}.${item.id}`,
          kind: "item",
          field: item,
          repeaterId: field.id,
        });
      }
    } else {
      nodes.push({ key: `field:${field.id}`, kind: "field", field });
    }
  }
  return nodes;
}

function formulaDeps(formula: string | undefined): string[] {
  if (!formula?.trim()) return [];
  try {
    return [...collectDeps(parseFormula(formula))];
  } catch {
    return [];
  }
}

function resolveDepKeys(
  dep: string,
  schema: FormSchema,
  nodeMap: Map<string, Node>,
): string[] {
  if (nodeMap.has(`field:${dep}`)) return [`field:${dep}`];
  const dot = dep.indexOf(".");
  if (dot > 0) {
    const table = dep.slice(0, dot);
    const field = dep.slice(dot + 1);
    const itemKey = `item:${table}.${field}`;
    if (nodeMap.has(itemKey)) return [itemKey, `field:${table}`];
    if (nodeMap.has(`field:${table}`)) return [`field:${table}`];
  }
  for (const field of schema.fields) {
    if (field.type !== "repeater") continue;
    if ((field.itemFields ?? []).some((item) => item.id === dep)) {
      return [`item:${field.id}.${dep}`];
    }
  }
  return [];
}

function topoKeys(schema: FormSchema): { order: string[]; cycle: boolean } {
  const nodes = allNodes(schema);
  const nodeMap = new Map(nodes.map((node) => [node.key, node]));
  const incoming = new Map<string, Set<string>>();
  for (const node of nodes) incoming.set(node.key, new Set());

  function addEdge(from: string, to: string) {
    if (from === to) return;
    incoming.get(to)?.add(from);
  }

  for (const node of nodes) {
    if (node.field.type !== "computed") continue;
    for (const dep of formulaDeps(node.field.formula)) {
      for (const key of resolveDepKeys(dep, schema, nodeMap)) {
        addEdge(key, node.key);
      }
    }
  }

  const ready: string[] = [];
  const remaining = new Map(incoming);
  for (const [key, deps] of remaining) {
    if (deps.size === 0) ready.push(key);
  }
  const order: string[] = [];
  while (ready.length) {
    const key = ready.pop()!;
    order.push(key);
    remaining.delete(key);
    for (const [other, deps] of remaining) {
      if (deps.delete(key) && deps.size === 0) ready.push(other);
    }
  }
  return { order, cycle: remaining.size > 0 };
}

function parentScope(
  schema: FormSchema,
  values: EstimateValues,
  scalars: Record<string, FormulaValue>,
  rows: Record<string, Array<Record<string, unknown>>>,
  ready: Set<string>,
): (name: string) => Binding | undefined {
  return (name: string) => {
    const field = schema.fields.find((item) => item.id === name);
    if (!field) return undefined;
    if (!ready.has(`field:${name}`)) return undefined;
    if (field.type === "select") return selectBinding(field, values[name]);
    if (field.type === "repeater") {
      const binding: RepeaterBinding = { kind: "repeater", rows: rows[name] ?? [] };
      return binding;
    }
    if (name in scalars) return scalars[name];
    if (field.type === "number") return coerceNumber(values[name]);
    if (field.type === "switch") return Boolean(values[name]);
    if (field.type === "text") return String(values[name] ?? "");
    return undefined;
  };
}

function rowScope(
  parentGet: (name: string) => Binding | undefined,
  itemFields: Field[],
  row: Record<string, unknown>,
): (name: string) => Binding | undefined {
  return (name: string) => {
    const item = itemFields.find((field) => field.id === name);
    if (item) {
      if (item.type === "select") return selectBinding(item, row[name]);
      if (name in row) return asFormulaValue(row[name]);
      if (item.type === "number") return coerceNumber(row[name]);
      if (item.type === "switch") return Boolean(row[name]);
      if (item.type === "text") return String(row[name] ?? "");
    }
    return parentGet(name);
  };
}

function seedInputs(
  schema: FormSchema,
  values: EstimateValues,
): {
  scalars: Record<string, FormulaValue>;
  rows: Record<string, Array<Record<string, unknown>>>;
  ready: Set<string>;
} {
  const scalars: Record<string, FormulaValue> = {};
  const rows: Record<string, Array<Record<string, unknown>>> = {};
  const ready = new Set<string>();

  for (const field of schema.fields) {
    if (field.type === "computed") continue;
    if (field.type === "repeater") {
      const itemFields = field.itemFields ?? [];
      rows[field.id] = asRowArray(values[field.id]).map((row, index) => {
        const next: Record<string, unknown> = {
          _id: typeof row._id === "string" ? row._id : `r_${index}`,
        };
        for (const item of itemFields) {
          if (item.type === "computed") continue;
          if (item.type === "number") next[item.id] = coerceNumber(row[item.id]);
          else if (item.type === "switch") next[item.id] = Boolean(row[item.id]);
          else if (item.type === "select") {
            next[item.id] =
              typeof row[item.id] === "string"
                ? row[item.id]
                : (item.options?.[0]?.id ?? "");
          } else next[item.id] = String(row[item.id] ?? "");
          ready.add(`item:${field.id}.${item.id}`);
        }
        return next;
      });
      ready.add(`field:${field.id}`);
      continue;
    }
    ready.add(`field:${field.id}`);
    if (field.type === "number") scalars[field.id] = coerceNumber(values[field.id]);
    else if (field.type === "switch") scalars[field.id] = Boolean(values[field.id]);
    else if (field.type === "text") scalars[field.id] = String(values[field.id] ?? "");
    else if (field.type === "select") {
      scalars[field.id] = selectBinding(field, values[field.id]).value;
    }
  }

  return { scalars, rows, ready };
}

export function evaluateDocument(doc: FormDocument): EngineResult {
  const { schema, values } = doc;
  const errors: Record<string, string> = {};
  const seeded = seedInputs(schema, values);
  const { scalars, rows, ready } = seeded;
  const { order, cycle } = topoKeys(schema);
  const nodeMap = new Map(allNodes(schema).map((node) => [node.key, node]));

  if (cycle) {
    errors._cycle = "A formula refers to itself. Check computed fields for a loop.";
  }

  for (const key of order) {
    const node = nodeMap.get(key);
    if (!node || node.field.type !== "computed") continue;
    const formula = node.field.formula ?? "";
    try {
      parseFormula(formula);
    } catch (error) {
      errors[node.kind === "item" ? `${node.repeaterId}.${node.field.id}` : node.field.id] =
        error instanceof FormulaError ? error.message : "Invalid formula";
      continue;
    }

    if (node.kind === "field") {
      const get = parentScope(schema, values, scalars, rows, ready);
      try {
        scalars[node.field.id] = evaluateFormula(formula, { get });
        ready.add(key);
      } catch (error) {
        errors[node.field.id] =
          error instanceof FormulaError ? error.message : "Could not evaluate formula";
      }
      continue;
    }

    const repeaterId = node.repeaterId!;
    const repeater = schema.fields.find((field) => field.id === repeaterId);
    const itemFields = repeater?.itemFields ?? [];
    const getParent = parentScope(schema, values, scalars, rows, ready);
    try {
      rows[repeaterId] = (rows[repeaterId] ?? []).map((row) => {
        const value = evaluateFormula(formula, {
          get: rowScope(getParent, itemFields, row),
        });
        return { ...row, [node.field.id]: value };
      });
      ready.add(key);
    } catch (error) {
      errors[`${repeaterId}.${node.field.id}`] =
        error instanceof FormulaError ? error.message : "Could not evaluate formula";
    }
  }

  return { scalars, rows, errors };
}

export function engineNumber(
  result: EngineResult,
  id: string,
  fallback = 0,
): number {
  const value = result.scalars[id];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function engineText(result: EngineResult, id: string, fallback = ""): string {
  const value = result.scalars[id];
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
}

export function engineBool(result: EngineResult, id: string): boolean {
  const value = result.scalars[id];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value.length > 0;
  return false;
}

export function isFieldVisible(
  field: Field,
  doc: FormDocument,
  result: EngineResult,
): boolean {
  if (field.hidden) return false;
  if (!field.visibleWhen?.trim()) return true;
  try {
    const get = parentScope(
      doc.schema,
      doc.values,
      result.scalars,
      result.rows,
      new Set(allNodes(doc.schema).map((node) => node.key)),
    );
    return isTruthy(evaluateFormula(field.visibleWhen, { get }));
  } catch {
    return true;
  }
}

export function selectFactors(
  schema: FormSchema,
  values: EstimateValues,
): Array<{ label: string; factor: number }> {
  return schema.fields
    .filter((field) => field.type === "select")
    .map((field) => {
      const bound = selectBinding(field, values[field.id]);
      return { label: bound.label, factor: bound.value };
    });
}
