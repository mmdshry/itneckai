"use client";

import { engineNumber, engineText, type EngineResult } from "@/lib/estimate/engine";
import { formatEstimateValue, formatPerSf, formatUsd } from "@/lib/estimate/format";
import {
  asRowArray,
  fieldByRole,
  type EstimateValues,
  type Field,
  type FormSchema,
} from "@/lib/estimate/schema";

function metricFields(schema: FormSchema): Field[] {
  return schema.fields.filter(
    (field) =>
      field.type === "computed" &&
      field.showInResults &&
      field.role !== "bid" &&
      field.role !== "perSf" &&
      field.role !== "hours" &&
      field.role !== "title",
  );
}

function rowAmount(row: Record<string, unknown>, itemFields: Field[]): unknown {
  for (const id of ["price", "discountedCost", "amount"]) {
    if (typeof row[id] === "number") return row[id];
  }
  const usd = itemFields.find((item) => item.format === "usd" && item.type === "computed");
  return usd ? row[usd.id] : undefined;
}

export function ResultsPanel({
  schema,
  values,
  result,
}: {
  schema: FormSchema;
  values: EstimateValues;
  result: EngineResult;
}) {
  const bidField = fieldByRole(schema, "bid");
  const perSfField = fieldByRole(schema, "perSf");
  const hoursField = fieldByRole(schema, "hours");
  const titleField = fieldByRole(schema, "title");
  const guardrailField = fieldByRole(schema, "guardrail");
  const bid = bidField ? engineNumber(result, bidField.id) : 0;
  const perSf = perSfField ? engineNumber(result, perSfField.id) : 0;
  const hours = hoursField ? engineNumber(result, hoursField.id) : 0;
  const title = titleField ? String(values[titleField.id] ?? "") : "";
  const guardrail = guardrailField ? engineText(result, guardrailField.id) : "";
  const escalate = guardrail.toLowerCase().includes("escalate");
  const detail = engineText(result, "guardrailDetail");
  const laborFlag = engineText(result, "laborNote").toLowerCase().includes("negative");
  const repeaters = schema.fields.filter((field) => field.type === "repeater" && field.showInResults);

  return (
    <aside
      className="estimate-results rounded-md border border-line bg-surface p-5 md:p-6"
      aria-live="polite"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-cyan">
        {bidField?.label ?? "Recommended bid"}
      </p>
      <p className="mt-1 text-sm text-graphite">{title.trim() || "Untitled project"}</p>
      <p className="mt-3 font-display text-4xl font-bold tracking-tight text-cloud">
        {formatUsd(bid)}
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-xs text-graphite">{perSfField?.label ?? "Price / SF"}</dt>
          <dd className="mt-1 text-lg font-semibold text-navy">{formatPerSf(perSf)}</dd>
        </div>
        <div>
          <dt className="text-xs text-graphite">{hoursField?.label ?? "Estimated hours"}</dt>
          <dd className="mt-1 text-lg font-semibold text-navy">
            {formatEstimateValue("hours", hours)}
          </dd>
        </div>
      </dl>

      {guardrail ? (
        <div
          className={`mt-6 rounded-md border px-4 py-3 text-sm ${
            escalate ? "border-amber/40 bg-page text-navy" : "border-line bg-page text-navy"
          }`}
        >
          <p className="font-medium">{guardrail}</p>
          {detail ? <p className="mt-1 text-graphite">{detail}</p> : null}
        </div>
      ) : null}

      <dl className="mt-6 grid gap-3 text-sm">
        {metricFields(schema)
          .filter((field) => field.id !== "guardrailDetail")
          .map((field) => (
            <div key={field.id} className="flex justify-between gap-3">
              <dt className="text-graphite">{field.label}</dt>
              <dd
                className={`text-right font-medium ${
                  field.id === "laborMargin" && laborFlag ? "text-red-600" : "text-navy"
                }`}
              >
                {formatEstimateValue(field.format, result.scalars[field.id])}
              </dd>
            </div>
          ))}
      </dl>

      {repeaters.map((field) => {
        const rows = result.rows[field.id] ?? asRowArray(values[field.id]);
        const labelKey = field.itemLabelField ?? "name";
        return (
          <div key={field.id} className="mt-6 border-t border-line pt-5">
            <h3 className="text-sm font-medium text-navy">{field.label}</h3>
            <ul className="mt-3 divide-y divide-line">
              {rows.map((row, index) => {
                const on = Boolean(row.included);
                const amount = rowAmount(row, field.itemFields ?? []);
                return (
                  <li
                    key={String(row._id ?? index)}
                    className="flex items-baseline justify-between gap-3 py-2 text-sm"
                  >
                    <span className={on ? "text-navy" : "text-ink-muted"}>
                      {String(row[labelKey] ?? `Row ${index + 1}`)}
                      {!on ? " · off" : ""}
                    </span>
                    <span className="font-medium text-navy">
                      {on ? formatEstimateValue("usd", amount) : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <p className="mt-6 border-t border-line pt-4 text-xs text-graphite">
        Sales-budget pricing before formal bid review. Fill only what you can
        stand behind — if the yellow inputs are a guess, escalate to PM.
      </p>
    </aside>
  );
}

export function MobileBidBar({
  bid,
  perSf,
}: {
  bid: number;
  perSf: number;
}) {
  return (
    <div className="estimate-no-print fixed inset-x-3 bottom-20 z-30 flex items-center justify-between gap-3 rounded-md border border-line bg-page px-4 py-3 shadow-lg lg:hidden">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-graphite">
          Bid
        </p>
        <p className="font-display text-lg font-bold text-cloud">
          {formatUsd(bid, true)}
        </p>
      </div>
      <p className="text-sm text-graphite">{formatPerSf(perSf)}</p>
    </div>
  );
}
