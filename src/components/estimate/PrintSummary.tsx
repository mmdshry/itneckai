import { type EngineResult } from "@/lib/estimate/engine";
import {
  formatEstimateValue,
  formatHours,
  formatPerSf,
  formatUsd,
} from "@/lib/estimate/format";
import {
  asRowArray,
  fieldByRole,
  type EstimateValues,
  type Field,
  type FormSchema,
} from "@/lib/estimate/schema";
import { site } from "@/lib/site";

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-neutral-300 py-1 text-[11pt] leading-snug">
      <dt className="text-neutral-600">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function displayInput(field: Field, value: unknown): string {
  if (field.type === "switch") return value ? "Yes" : "No";
  if (field.type === "select") {
    const option = field.options?.find((item) => item.id === value);
    return option?.label ?? String(value ?? "");
  }
  if (field.inputScale === "percent" && typeof value === "number") {
    return `${Math.round(value * 100)}%`;
  }
  if (field.suffix === "SF" && typeof value === "number") {
    return `${formatEstimateValue("number", value)} SF`;
  }
  if (field.format) return formatEstimateValue(field.format, value);
  if (typeof value === "number") return formatEstimateValue("number", value);
  return String(value ?? "");
}

export function PrintSummary({
  schema,
  values,
  result,
  printedAt,
}: {
  schema: FormSchema;
  values: EstimateValues;
  result: EngineResult;
  printedAt: Date;
}) {
  const bidField = fieldByRole(schema, "bid");
  const perSfField = fieldByRole(schema, "perSf");
  const hoursField = fieldByRole(schema, "hours");
  const titleField = fieldByRole(schema, "title");
  const guardrailField = fieldByRole(schema, "guardrail");
  const bid = bidField && typeof result.scalars[bidField.id] === "number" ? result.scalars[bidField.id] : 0;
  const perSf =
    perSfField && typeof result.scalars[perSfField.id] === "number" ? result.scalars[perSfField.id] : 0;
  const hours =
    hoursField && typeof result.scalars[hoursField.id] === "number" ? result.scalars[hoursField.id] : 0;
  const projectName = (
    titleField ? String(values[titleField.id] ?? "") : ""
  ).trim() || "Untitled project";
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(printedAt);
  const guardrail = guardrailField ? String(result.scalars[guardrailField.id] ?? "") : "";
  const strategy = result.scalars.pricingStrategy;
  const notes = result.scalars.notes;

  const inputPairs = schema.fields
    .filter(
      (field) =>
        field.showInPrint &&
        field.type !== "computed" &&
        field.type !== "repeater" &&
        field.role !== "title",
    )
    .map((field) => ({
      label: field.label,
      value: displayInput(field, values[field.id]),
    }));

  const metrics = schema.fields.filter(
    (field) =>
      field.type === "computed" &&
      field.showInPrint &&
      field.role !== "bid" &&
      field.role !== "perSf" &&
      field.role !== "hours" &&
      field.role !== "guardrail" &&
      field.id !== "guardrailDetail",
  );

  const repeaters = schema.fields.filter((field) => field.type === "repeater" && field.showInPrint);

  return (
    <article className="estimate-print hidden print:block" aria-hidden="true">
      <header className="flex items-end justify-between border-b-2 border-neutral-800 pb-2">
        <div>
          <p className="font-display text-xl font-bold tracking-tight">{site.name}</p>
          <p className="mt-0.5 text-[9pt] uppercase tracking-[0.16em] text-neutral-600">
            BIM sales budget
          </p>
        </div>
        <p className="text-right text-[10pt] text-neutral-600">
          {schema.name}
          <br />
          {date}
        </p>
      </header>

      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">{projectName}</h1>

      <div className="mt-3 grid grid-cols-3 gap-3 border border-neutral-300 px-3 py-2.5">
        <div>
          <p className="text-[8pt] uppercase tracking-widest text-neutral-600">
            {bidField?.label ?? "Bid"}
          </p>
          <p className="mt-0.5 font-display text-2xl font-bold">
            {formatUsd(typeof bid === "number" ? bid : 0)}
          </p>
        </div>
        <div>
          <p className="text-[8pt] uppercase tracking-widest text-neutral-600">Price / SF</p>
          <p className="mt-0.5 text-lg font-semibold">
            {formatPerSf(typeof perSf === "number" ? perSf : 0)}
          </p>
        </div>
        <div>
          <p className="text-[8pt] uppercase tracking-widest text-neutral-600">Hours</p>
          <p className="mt-0.5 text-lg font-semibold">
            {formatHours(typeof hours === "number" ? hours : 0)}
          </p>
        </div>
      </div>

      {guardrail ? (
        <p className="mt-3 border border-neutral-300 px-3 py-2 text-[10pt]">
          <span className="font-semibold">{guardrail}.</span>{" "}
          {typeof strategy === "string" ? `${strategy}. ` : ""}
          {typeof notes === "string" ? `${notes}.` : ""}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-x-8">
        <section>
          <h2 className="mb-1 text-[9pt] font-semibold uppercase tracking-widest">
            Project inputs
          </h2>
          <dl>
            {inputPairs.map((row) => (
              <Pair key={row.label} label={row.label} value={row.value} />
            ))}
          </dl>
        </section>
        <section>
          {repeaters.map((field) => {
            const rows = (result.rows[field.id] ?? asRowArray(values[field.id])).filter(
              (row) => row.included,
            );
            const itemFields = field.itemFields ?? [];
            const numeric = itemFields.filter(
              (item) => item.type === "computed" && item.format && item.format !== "text",
            );
            return (
              <div key={field.id}>
                <h2 className="mb-1 text-[9pt] font-semibold uppercase tracking-widest">
                  Included {field.label.toLowerCase()}
                </h2>
                {rows.length === 0 ? (
                  <p className="text-[10pt] text-neutral-600">None included.</p>
                ) : (
                  <table className="w-full border-collapse text-[10pt]">
                    <thead>
                      <tr className="border-b border-neutral-800 text-left">
                        <th className="py-1 font-semibold">Name</th>
                        {numeric.map((item) => (
                          <th key={item.id} className="py-1 text-right font-semibold">
                            {item.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={String(row._id ?? index)} className="border-b border-neutral-300">
                          <td className="py-1">
                            {String(row[field.itemLabelField ?? "name"] ?? "")}
                          </td>
                          {numeric.map((item) => (
                            <td key={item.id} className="py-1 text-right">
                              {formatEstimateValue(item.format, row[item.id])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
          <dl className="mt-3">
            {metrics.map((field) => (
              <Pair
                key={field.id}
                label={field.label}
                value={formatEstimateValue(field.format, result.scalars[field.id])}
              />
            ))}
          </dl>
        </section>
      </div>

      <footer className="mt-5 border-t border-neutral-800 pt-2 text-[9pt] text-neutral-600">
        <p>
          Sales-budget pricing before formal bid review — not a substitute for PM takeoff.
        </p>
        <p className="mt-1">
          {site.email} · {site.phone} · {site.address}
        </p>
      </footer>
    </article>
  );
}
