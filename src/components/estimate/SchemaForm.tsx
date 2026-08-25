"use client";

import {
  engineNumber,
  isFieldVisible,
  type EngineResult,
} from "@/lib/estimate/engine";
import { formatEstimateValue } from "@/lib/estimate/format";
import {
  asRowArray,
  blankRow,
  coerceNumber,
  type EstimateValues,
  type Field,
  type FormDocument,
  type FormSchema,
} from "@/lib/estimate/schema";
import {
  FactorChips,
  FieldGroup,
  NumberField,
  SegmentedControl,
  SelectField,
  SwitchField,
  TextField,
} from "./fields";

function numberDisplay(field: Field, raw: unknown): number {
  const value = coerceNumber(raw, typeof field.defaultValue === "number" ? field.defaultValue : 0);
  if (field.inputScale === "percent") return Math.round(value * 1000) / 10;
  return value;
}

function numberStore(field: Field, displayed: number): number {
  const next = field.inputScale === "percent" ? displayed / 100 : displayed;
  const min = field.min ?? Number.NEGATIVE_INFINITY;
  const max = field.max ?? Number.POSITIVE_INFINITY;
  return Math.min(max, Math.max(min, next));
}

function InputField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = `est-${field.id}`;
  if (field.type === "text") {
    return (
      <TextField
        id={id}
        label={field.label}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={onChange}
      />
    );
  }
  if (field.type === "number") {
    return (
      <NumberField
        id={id}
        label={field.label}
        value={numberDisplay(field, value)}
        onChange={(next) => onChange(numberStore(field, next))}
        min={field.inputScale === "percent" ? (field.min ?? 0) * 100 : field.min}
        max={field.inputScale === "percent" ? (field.max ?? 1) * 100 : field.max}
        step={field.inputScale === "percent" ? 1 : field.step}
        suffix={field.suffix}
        hint={field.hint}
      />
    );
  }
  if (field.type === "switch") {
    return (
      <SwitchField
        id={id}
        label={field.label}
        checked={Boolean(value)}
        onChange={onChange}
        description={field.hint}
      />
    );
  }
  if (field.type === "select") {
    const options = field.options ?? [];
    const selected = typeof value === "string" ? value : (options[0]?.id ?? "");
    if (field.widget === "select") {
      return (
        <SelectField
          id={id}
          label={field.label}
          value={selected}
          options={options.map((option) => ({ value: option.id, label: option.label }))}
          onChange={onChange}
        />
      );
    }
    return (
      <SegmentedControl
        legend={field.label}
        name={id}
        value={selected}
        options={options.map((option) => ({ value: option.id, label: option.label }))}
        onChange={onChange}
      />
    );
  }
  return null;
}

function RepeaterField({
  field,
  rows,
  result,
  customize,
  onChange,
}: {
  field: Field;
  rows: Array<Record<string, unknown>>;
  result: EngineResult;
  customize: boolean;
  onChange: (rows: Array<Record<string, unknown>>) => void;
}) {
  const itemFields = field.itemFields ?? [];
  const computedItems = itemFields.filter((item) => item.type === "computed" && !item.hidden);
  const inputItems = itemFields.filter((item) => item.type !== "computed");
  const evaluated = result.rows[field.id] ?? rows;
  const labelKey = field.itemLabelField ?? "name";

  function patchRow(index: number, key: string, value: unknown) {
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  return (
    <div className="grid gap-4">
      {rows.map((row, index) => {
        const evalRow = evaluated[index] ?? row;
        const included = Boolean(row.included);
        const title = String(row[labelKey] ?? `Row ${index + 1}`);
        const note = typeof row.note === "string" ? row.note : undefined;
        const market = typeof row.marketRange === "string" ? row.marketRange : undefined;
        return (
          <article
            key={String(row._id ?? index)}
            className={`rounded-md border p-4 transition-colors ${
              included ? "border-amber/40 bg-surface" : "border-line bg-page"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {inputItems.some((item) => item.id === "included") ? (
                  <SwitchField
                    id={`${field.id}-${index}-included`}
                    label={title || "Included"}
                    checked={included}
                    onChange={(checked) => patchRow(index, "included", checked)}
                    description={
                      note ||
                      (market && typeof row.basePerSf === "number"
                        ? `Market ${market} · base ${formatEstimateValue("perSf", row.basePerSf)} · ${row.hoursPer1000} hr / 1,000 SF`
                        : field.hint)
                    }
                  />
                ) : (
                  <p className="text-sm font-medium text-navy">{title}</p>
                )}
              </div>
              <button
                type="button"
                className="shrink-0 cursor-pointer text-sm text-graphite underline-offset-2 hover:text-navy hover:underline"
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>

            {(customize || included) && (
              <div className="mt-4 grid gap-4 border-t border-line pt-4">
                {inputItems
                  .filter((item) => item.id !== "included")
                  .filter((item) => customize || item.id === "hoursPerSf")
                  .map((item) => (
                    <InputField
                      key={item.id}
                      field={item}
                      value={row[item.id]}
                      onChange={(value) => patchRow(index, item.id, value)}
                    />
                  ))}
                {included && computedItems.length > 0 ? (
                  <dl
                    className={`grid gap-3 text-sm ${
                      computedItems.length > 3 ? "sm:grid-cols-4" : "grid-cols-3"
                    }`}
                  >
                    {computedItems.map((item) => (
                      <div key={item.id}>
                        <dt className="text-xs text-graphite">{item.label}</dt>
                        <dd className="mt-1 font-medium text-navy">
                          {formatEstimateValue(item.format, evalRow[item.id])}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            )}
          </article>
        );
      })}
      <button
        type="button"
        className="min-h-11 cursor-pointer rounded-md border border-dashed border-navy/30 px-4 text-sm font-medium text-navy hover:bg-surface"
        onClick={() => onChange([...rows, blankRow(itemFields)])}
      >
        Add {field.itemLabelField ? "row" : "item"}
      </button>
    </div>
  );
}

export function SchemaForm({
  document: doc,
  result,
  customize,
  onChange,
}: {
  document: FormDocument;
  result: EngineResult;
  customize: boolean;
  onChange: (next: FormDocument) => void;
}) {
  const { schema, values } = doc;

  function setValue(id: string, value: unknown) {
    onChange({ schema, values: { ...values, [id]: value } });
  }

  return (
    <div className="grid gap-5">
      {schema.sections.map((section) => {
        const fields = schema.fields.filter(
          (field) => field.sectionId === section.id && isFieldVisible(field, doc, result),
        );
        if (fields.length === 0) return null;
        const collapse = /labor|rates/i.test(section.id);
        const body = (
          <div className="grid gap-5">
            {fields.map((field) => {
              if (field.type === "repeater") {
                return (
                  <RepeaterField
                    key={field.id}
                    field={field}
                    rows={asRowArray(values[field.id])}
                    result={result}
                    customize={customize}
                    onChange={(rows) => setValue(field.id, rows)}
                  />
                );
              }
              if (field.type === "computed") {
                if (field.format === "factor") {
                  const chips = schema.fields
                    .filter(
                      (item) =>
                        item.type === "select" && (field.formula ?? "").includes(item.id),
                    )
                    .map((item) => {
                      const selected =
                        typeof values[item.id] === "string"
                          ? values[item.id]
                          : item.options?.[0]?.id;
                      const option =
                        item.options?.find((entry) => entry.id === selected) ??
                        item.options?.[0];
                      return {
                        label: option?.label ?? item.label,
                        factor: option?.value ?? 1,
                      };
                    });
                  return (
                    <div key={field.id}>
                      <p className="text-sm font-medium text-navy">{field.label}</p>
                      {field.hint ? (
                        <p className="mt-1 text-xs text-graphite">{field.hint}</p>
                      ) : null}
                      {chips.length > 0 ? (
                        <div className="mt-3">
                          <FactorChips items={chips} />
                        </div>
                      ) : null}
                      <p className="mt-2 font-mono text-xs text-graphite">
                        Combined {formatEstimateValue("factor", result.scalars[field.id])}
                      </p>
                    </div>
                  );
                }
                return (
                  <p key={field.id} className="text-sm text-navy">
                    <span className="text-graphite">{field.label}: </span>
                    {formatEstimateValue(field.format, result.scalars[field.id])}
                  </p>
                );
              }
              return (
                <InputField
                  key={field.id}
                  field={field}
                  value={values[field.id]}
                  onChange={(value) => setValue(field.id, value)}
                />
              );
            })}
          </div>
        );

        if (collapse) {
          return (
            <details key={section.id} className="rounded-md border border-line bg-page p-5 md:p-6">
              <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-cyan">
                {section.title}
              </summary>
              <div className="mt-5">{body}</div>
            </details>
          );
        }

        return (
          <FieldGroup key={section.id} title={section.title}>
            {body}
          </FieldGroup>
        );
      })}
      {Object.keys(result.errors).length > 0 ? (
        <p className="text-sm text-red-600" role="alert">
          Formula error: {Object.values(result.errors)[0]}
        </p>
      ) : null}
    </div>
  );
}

export function bidFromResult(schema: FormSchema, result: EngineResult): number {
  const bid = schema.fields.find((field) => field.role === "bid");
  return bid ? engineNumber(result, bid.id) : 0;
}

export function perSfFromResult(schema: FormSchema, result: EngineResult): number {
  const field = schema.fields.find((item) => item.role === "perSf");
  return field ? engineNumber(result, field.id) : 0;
}

export function titleFromValues(schema: FormSchema, values: EstimateValues): string {
  const field = schema.fields.find((item) => item.role === "title");
  if (!field) return "";
  return String(values[field.id] ?? "");
}
