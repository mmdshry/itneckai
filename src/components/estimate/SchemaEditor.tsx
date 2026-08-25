"use client";

import {
  appendToFormula,
  cloneJson,
  defaultForField,
  FIELD_ID_RE,
  migrateValuesOnRename,
  renameFieldId,
  replaceFormulaIdent,
  uniqueFieldId,
  uniqueSectionId,
  type Field,
  type FieldFormat,
  type FieldRole,
  type FieldType,
  type FormDocument,
} from "@/lib/estimate/schema";
import { fieldLabelClass, inputClass } from "./fields";

const TYPES: FieldType[] = ["text", "number", "select", "switch", "computed", "repeater"];
const ROLES: Array<FieldRole | ""> = ["", "title", "bid", "perSf", "hours", "guardrail", "metric"];
const FORMATS: Array<FieldFormat | ""> = [
  "",
  "usd",
  "hours",
  "perSf",
  "number",
  "text",
  "percent",
  "factor",
  "boolean",
];

function tinyInput(className = "") {
  return `${inputClass} py-2 ${className}`;
}

function FieldEditor({
  field,
  onChange,
  onDelete,
  onMove,
  nested,
}: {
  field: Field;
  onChange: (next: Field) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  nested?: boolean;
}) {
  function patch(partial: Partial<Field>) {
    onChange({ ...field, ...partial });
  }

  return (
    <div className={`grid gap-3 rounded-md border border-line p-3 ${nested ? "bg-page" : "bg-surface"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className={tinyInput("min-w-[8rem] flex-1")}
          value={field.label}
          onChange={(event) => patch({ label: event.target.value })}
          aria-label="Field label"
        />
        <input
          className={tinyInput("w-36 font-mono text-xs")}
          value={field.id}
          onChange={(event) => patch({ id: event.target.value })}
          aria-label="Field id"
        />
        <select
          className={tinyInput("w-36")}
          value={field.type}
          onChange={(event) => patch({ type: event.target.value as FieldType })}
          aria-label="Field type"
        >
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button type="button" className="cursor-pointer text-sm text-graphite" onClick={() => onMove(-1)}>
          Up
        </button>
        <button type="button" className="cursor-pointer text-sm text-graphite" onClick={() => onMove(1)}>
          Down
        </button>
        <button type="button" className="cursor-pointer text-sm text-red-600" onClick={onDelete}>
          Delete
        </button>
      </div>
      <input
        className={tinyInput()}
        value={field.hint ?? ""}
        placeholder="Hint"
        onChange={(event) => patch({ hint: event.target.value || undefined })}
      />
      {field.type === "computed" ? (
        <label className="grid gap-1 text-xs text-graphite">
          Formula
          <textarea
            className={`${tinyInput()} min-h-16 font-mono text-xs`}
            value={field.formula ?? ""}
            placeholder='IF(included, basePerSf * squareFootage * combinedFactor, 0)'
            onChange={(event) => patch({ formula: event.target.value })}
          />
        </label>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <select
          className={tinyInput("w-36")}
          value={field.role ?? ""}
          onChange={(event) =>
            patch({ role: (event.target.value || undefined) as FieldRole | undefined })
          }
        >
          {ROLES.map((role) => (
            <option key={role || "none"} value={role}>
              {role ? `role: ${role}` : "no role"}
            </option>
          ))}
        </select>
        <select
          className={tinyInput("w-36")}
          value={field.format ?? ""}
          onChange={(event) =>
            patch({ format: (event.target.value || undefined) as FieldFormat | undefined })
          }
        >
          {FORMATS.map((format) => (
            <option key={format || "none"} value={format}>
              {format ? `format: ${format}` : "no format"}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-1 text-xs text-navy">
          <input
            type="checkbox"
            checked={Boolean(field.hidden)}
            onChange={(event) => patch({ hidden: event.target.checked })}
          />
          Hidden
        </label>
        <label className="inline-flex items-center gap-1 text-xs text-navy">
          <input
            type="checkbox"
            checked={Boolean(field.showInResults)}
            onChange={(event) => patch({ showInResults: event.target.checked })}
          />
          Results
        </label>
        <input
          className={tinyInput("w-24")}
          value={field.suffix ?? ""}
          placeholder="suffix"
          onChange={(event) => patch({ suffix: event.target.value || undefined })}
        />
        <input
          className={tinyInput("w-40 font-mono text-xs")}
          value={field.visibleWhen ?? ""}
          placeholder="visibleWhen formula"
          onChange={(event) => patch({ visibleWhen: event.target.value || undefined })}
        />
      </div>
      {field.type === "select" ? (
        <div className="grid gap-2">
          <p className={fieldLabelClass}>Options (id / label / factor)</p>
          {(field.options ?? []).map((option, index) => (
            <div key={`${option.id}-${index}`} className="flex flex-wrap gap-2">
              <input
                className={tinyInput("w-28 font-mono text-xs")}
                value={option.id}
                onChange={(event) => {
                  const options = [...(field.options ?? [])];
                  options[index] = { ...option, id: event.target.value };
                  patch({ options });
                }}
              />
              <input
                className={tinyInput("min-w-[8rem] flex-1")}
                value={option.label}
                onChange={(event) => {
                  const options = [...(field.options ?? [])];
                  options[index] = { ...option, label: event.target.value };
                  patch({ options });
                }}
              />
              <input
                className={tinyInput("w-24")}
                type="number"
                step="any"
                value={option.value}
                onChange={(event) => {
                  const options = [...(field.options ?? [])];
                  options[index] = { ...option, value: Number(event.target.value) };
                  patch({ options });
                }}
              />
              <button
                type="button"
                className="cursor-pointer text-sm text-red-600"
                onClick={() =>
                  patch({ options: (field.options ?? []).filter((_, i) => i !== index) })
                }
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-navy"
            onClick={() => {
              const options = [...(field.options ?? [])];
              const id = `opt${options.length + 1}`;
              options.push({ id, label: id, value: 1 });
              patch({ options });
            }}
          >
            Add option
          </button>
        </div>
      ) : null}
      {field.type === "repeater" ? (
        <div className="grid gap-2">
          <p className={fieldLabelClass}>Row fields</p>
          {(field.itemFields ?? []).map((item, index) => (
            <FieldEditor
              key={item.id}
              field={item}
              nested
              onChange={(next) => {
                const itemFields = [...(field.itemFields ?? [])];
                itemFields[index] = next;
                patch({ itemFields });
              }}
              onDelete={() =>
                patch({
                  itemFields: (field.itemFields ?? []).filter((_, i) => i !== index),
                })
              }
              onMove={(dir) => {
                const itemFields = [...(field.itemFields ?? [])];
                const to = index + dir;
                if (to < 0 || to >= itemFields.length) return;
                [itemFields[index], itemFields[to]] = [itemFields[to], itemFields[index]];
                patch({ itemFields });
              }}
            />
          ))}
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-navy"
            onClick={() => {
              const itemFields = [...(field.itemFields ?? [])];
              itemFields.push({
                id: `col${itemFields.length + 1}`,
                label: "New column",
                type: "number",
                sectionId: field.sectionId,
              });
              patch({ itemFields });
            }}
          >
            Add column
          </button>
        </div>
      ) : null}
    </div>
  );
}

function newField(type: FieldType, sectionId: string, id: string): Field {
  const base: Field = { id, label: "New field", type, sectionId, showInPrint: true };
  if (type === "select") {
    return {
      ...base,
      widget: "segmented",
      options: [
        { id: "A", label: "A", value: 1 },
        { id: "B", label: "B", value: 1.1 },
      ],
      defaultValue: "A",
    };
  }
  if (type === "computed") {
    return { ...base, formula: "0", format: "number", hidden: true, showInResults: true };
  }
  if (type === "repeater") {
    return {
      ...base,
      itemLabelField: "name",
      itemFields: [
        { id: "name", label: "Name", type: "text", sectionId },
        { id: "included", label: "Included", type: "switch", sectionId },
        { id: "amount", label: "Amount", type: "number", sectionId, min: 0 },
      ],
      defaultValue: [],
    };
  }
  if (type === "number") return { ...base, min: 0, defaultValue: 0 };
  if (type === "switch") return { ...base, defaultValue: false };
  return { ...base, defaultValue: "" };
}

export function SchemaEditor({
  document: doc,
  onChange,
}: {
  document: FormDocument;
  onChange: (next: FormDocument) => void;
}) {
  const { schema, values } = doc;

  function setSchema(nextSchema: typeof schema, nextValues = values) {
    onChange({ schema: nextSchema, values: nextValues });
  }

  function updateField(index: number, next: Field) {
    const prev = schema.fields[index];
    let nextSchema = cloneJson(schema);
    if (prev.id !== next.id && FIELD_ID_RE.test(next.id)) {
      nextSchema = renameFieldId(
        { ...nextSchema, fields: nextSchema.fields.map((field, i) => (i === index ? next : field)) },
        prev.id,
        next.id,
      );
      setSchema(nextSchema, migrateValuesOnRename(values, prev.id, next.id));
      return;
    }
    nextSchema.fields[index] = next;
    setSchema(nextSchema);
  }

  const firstSection = schema.sections[0]?.id ?? "project";

  return (
    <div className="estimate-no-print mb-8 rounded-md border border-amber/40 bg-surface p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan">Customize form</p>
      <p className="mt-1 text-sm text-graphite">
        Add fields, options, trades, and formulas. Field ids are used in formulas (no eval).
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          className={tinyInput()}
          value={schema.name}
          onChange={(event) => setSchema({ ...schema, name: event.target.value })}
          aria-label="Form name"
        />
        <input
          className={tinyInput()}
          value={schema.description ?? ""}
          onChange={(event) => setSchema({ ...schema, description: event.target.value })}
          aria-label="Form description"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="min-h-10 cursor-pointer rounded-md border border-navy/20 px-3 text-sm text-navy"
          onClick={() => {
            const id = uniqueSectionId(schema, "section");
            setSchema({
              ...schema,
              sections: [...schema.sections, { id, title: "New section" }],
            });
          }}
        >
          Add section
        </button>
        {TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className="min-h-10 cursor-pointer rounded-md border border-navy/20 px-3 text-sm text-navy"
            onClick={() => {
              const id = uniqueFieldId(schema, type === "computed" ? "metric" : type);
              const field = newField(type, firstSection, id);
              const nextValues = { ...values };
              if (field.type !== "computed") nextValues[field.id] = defaultForField(field);
              setSchema({ ...schema, fields: [...schema.fields, field] }, nextValues);
            }}
          >
            Add {type}
          </button>
        ))}
        <button
          type="button"
          className="min-h-10 cursor-pointer rounded-md bg-navy px-3 text-sm text-white"
          onClick={() => {
            const id = uniqueFieldId(schema, "factor");
            const field = newField("select", firstSection, id);
            field.label = "New factor";
            const nextValues = { ...values, [id]: "A" };
            const nextFields = schema.fields.map((item) => {
              if (item.id === "combinedFactor" || item.id === "combinedHoursFactor") {
                return { ...item, formula: replaceFormulaIdent(item.formula ?? "", id) };
              }
              return item;
            });
            setSchema({ ...schema, fields: [...nextFields, field] }, nextValues);
          }}
        >
          Add multiplier
        </button>
        <button
          type="button"
          className="min-h-10 cursor-pointer rounded-md bg-navy px-3 text-sm text-white"
          onClick={() => {
            const id = uniqueFieldId(schema, "fee");
            const field = newField("number", firstSection, id);
            field.label = "Extra fee";
            field.format = "usd";
            field.suffix = "$";
            field.showInResults = true;
            field.role = "metric";
            const nextValues = { ...values, [id]: 0 };
            const nextFields = schema.fields.map((item) => {
              if (item.role === "bid") {
                return { ...item, formula: appendToFormula(item.formula ?? "", id) };
              }
              return item;
            });
            setSchema({ ...schema, fields: [...nextFields, field] }, nextValues);
          }}
        >
          Add fee to bid
        </button>
      </div>

      <div className="mt-6 grid gap-6">
        {schema.sections.map((section, sectionIndex) => (
          <section key={section.id}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <input
                className={tinyInput("min-w-[10rem] flex-1")}
                value={section.title}
                onChange={(event) => {
                  const sections = schema.sections.map((item, i) =>
                    i === sectionIndex ? { ...item, title: event.target.value } : item,
                  );
                  setSchema({ ...schema, sections });
                }}
              />
              <button
                type="button"
                className="cursor-pointer text-sm text-red-600"
                onClick={() => {
                  if (schema.sections.length < 2) return;
                  const fields = schema.fields.map((field) =>
                    field.sectionId === section.id ? { ...field, sectionId: firstSection } : field,
                  );
                  setSchema({
                    ...schema,
                    sections: schema.sections.filter((_, i) => i !== sectionIndex),
                    fields,
                  });
                }}
              >
                Delete section
              </button>
            </div>
            <div className="grid gap-3">
              {schema.fields.map((field, index) =>
                field.sectionId === section.id ? (
                  <FieldEditor
                    key={`${field.id}-${index}`}
                    field={field}
                    onChange={(next) => updateField(index, next)}
                    onDelete={() => {
                      const nextValues = { ...values };
                      delete nextValues[field.id];
                      setSchema(
                        { ...schema, fields: schema.fields.filter((_, i) => i !== index) },
                        nextValues,
                      );
                    }}
                    onMove={(dir) => {
                      const fields = [...schema.fields];
                      const to = index + dir;
                      if (to < 0 || to >= fields.length) return;
                      [fields[index], fields[to]] = [fields[to], fields[index]];
                      setSchema({ ...schema, fields });
                    }}
                  />
                ) : null,
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
