"use client";

import { categoryCopy, mapCopy, roiCopy, scoreLabels } from "@/lib/busywork/copy";
import type { BusyWorkMap, BusyWorkRow } from "@/lib/busywork/map";
import { formatUsd, type OpportunityCategory, type ScoreBreakdown } from "@/lib/busywork/score";

const badgeClass: Record<OpportunityCategory, string> = {
  quick_win: "border-cyan/40 bg-cyan/10 text-navy",
  high_impact: "border-amber/40 bg-amber/15 text-navy",
  strategic: "border-navy bg-navy text-white",
  leave_alone: "border-line bg-page text-graphite",
};

const columns = [
  mapCopy.columns.workflow,
  mapCopy.columns.effort,
  mapCopy.columns.problem,
  mapCopy.columns.solution,
  mapCopy.columns.impact,
  mapCopy.columns.category,
] as const;

export function BusyWorkMapView({ map }: { map: BusyWorkMap }) {
  const { roi } = map;
  const rate = formatUsd(roi.hourlyCost);

  return (
    <div>
      <p className="text-sm font-medium text-navy">{roiCopy.preliminary}</p>

      {map.rows.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">{mapCopy.emptyWorkflows}</p>
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-widest text-graphite">
                  {columns.map((column) => (
                    <th key={column} className="py-3 pr-4 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {map.rows.map((row) => (
                  <tr key={row.id} className="border-b border-line align-top">
                    <td className="py-3 pr-4 text-navy">{row.workflow}</td>
                    <td className="py-3 pr-4 whitespace-nowrap text-graphite">{row.effort}</td>
                    <td className="py-3 pr-4 text-graphite">{row.problem}</td>
                    <td className="py-3 pr-4 text-graphite">{row.solution}</td>
                    <td className="py-3 pr-4 text-graphite">{row.impact}</td>
                    <td className="py-3">
                      <CategoryCell row={row} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 grid gap-3 md:hidden">
            {map.rows.map((row) => (
              <li key={row.id} className="rounded-md border border-line p-4">
                <p className="text-sm font-medium text-navy">{row.workflow}</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <Field label={mapCopy.columns.effort} value={row.effort} />
                  <Field label={mapCopy.columns.problem} value={row.problem} />
                  <Field label={mapCopy.columns.solution} value={row.solution} />
                  <Field label={mapCopy.columns.impact} value={row.impact} />
                </dl>
                <div className="mt-3">
                  <CategoryCell row={row} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {(Object.keys(categoryCopy) as OpportunityCategory[]).map((key) => (
          <li key={key} className="rounded-md border border-line p-4">
            <p className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass[key]}`}>
              {categoryCopy[key].name}
            </p>
            <p className="mt-2 text-sm text-navy">{categoryCopy[key].action}</p>
            <p className="mt-1 text-sm text-graphite">{categoryCopy[key].definition}</p>
          </li>
        ))}
      </ul>

      <section className="mt-6 rounded-md border border-line bg-surface p-5">
        <h3 className="font-display text-lg font-semibold text-navy">{roiCopy.title}</h3>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-graphite">
          <p>{roiCopy.current(roi.currentHoursPerMonth)}</p>
          <p>{roiCopy.recoverable(roi.recoverableHoursPerMonth)}</p>
          <p>{roiCopy.value(formatUsd(roi.annualCapacityValue))}</p>
          <p>{roiCopy.rate(rate)}</p>
          {roi.teamSize != null &&
          roi.illustrationHoursPerYear != null &&
          roi.illustrationValue != null ? (
            <p>
              {roiCopy.illustration(
                roi.teamSize,
                String(roi.illustrationHoursPerYear),
                formatUsd(roi.illustrationValue),
              )}
            </p>
          ) : null}
        </div>
        <p className="mt-3 text-sm text-graphite">{roiCopy.disclaimer}</p>
        <h4 className="mt-5 text-sm font-medium text-navy">{roiCopy.metricsTitle}</h4>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {roiCopy.metrics.map((metric) => (
            <li key={metric} className="text-sm text-graphite">
              {metric}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <NoteList title={mapCopy.protect} items={map.alwaysHuman} />
        <NoteList title={mapCopy.capacity} items={map.capacity} />
      </div>

      <p className="mt-6 text-sm text-graphite">{mapCopy.solutionNote}</p>
      <p className="mt-4 text-graphite">{mapCopy.outcome}</p>
    </div>
  );
}

function CategoryCell({ row }: { row: BusyWorkRow }) {
  const copy = categoryCopy[row.category];
  return (
    <details className="min-w-36">
      <summary className="cursor-pointer list-none">
        <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass[row.category]}`}>
          {copy.name}
          <span className="font-mono">{row.score}</span>
        </span>
      </summary>
      <p className="mt-2 text-xs text-graphite">{copy.action}</p>
      <ScoreList scores={row.scores} />
    </details>
  );
}

function ScoreList({ scores }: { scores: ScoreBreakdown }) {
  const items = [
    ["time", scores.time],
    ["frequency", scores.frequency],
    ["cost", scores.cost],
    ["friction", scores.friction],
    ["potential", scores.potential],
  ] as const;
  return (
    <dl className="mt-2 space-y-1">
      {items.map(([key, value]) => (
        <div key={key} className="flex justify-between gap-3 text-xs text-graphite">
          <dt>{scoreLabels[key]}</dt>
          <dd className="font-mono text-navy">{value}/5</dd>
        </div>
      ))}
    </dl>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-ink-muted">{label}</dt>
      <dd className="text-graphite">{value}</dd>
    </div>
  );
}

function NoteList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-md border border-line p-5">
      <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">Nothing captured yet.</p>
      ) : (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-graphite">
          {items.map((item, index) => (
            <li key={`${index}:${item}`}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
