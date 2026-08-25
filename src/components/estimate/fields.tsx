"use client";

import { formatFactor } from "@/lib/estimate/format";
import type { ReactNode } from "react";

export function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md border border-line bg-page p-5 md:p-6">
      <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">
        {title}
      </h2>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

export const fieldLabelClass = "block text-sm font-medium text-navy";
export const fieldHintClass = "mt-1 text-xs text-graphite";
export const inputClass =
  "w-full rounded-md border border-line bg-page px-3.5 py-3 text-sm text-navy placeholder:text-ink-muted";

export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = "any",
  suffix,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number | "any";
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(event) => {
            const next = event.target.value;
            onChange(next === "" ? 0 : Number(next));
          }}
          className={`${inputClass} ${suffix ? "pr-12" : ""}`}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-muted">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <p className={fieldHintClass}>{hint}</p> : null}
    </div>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1.5 ${inputClass}`}
        autoComplete="off"
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | readonly { value: string; label: string }[];
}) {
  const items = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
  return (
    <div>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1.5 ${inputClass} cursor-pointer`}
      >
        {items.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: readonly { value: T; label: string }[] | readonly T[];
  onChange: (value: T) => void;
}) {
  const items = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <fieldset>
      <legend className={fieldLabelClass}>{legend}</legend>
      <div
        role="radiogroup"
        aria-label={legend}
        className="mt-1.5 flex flex-wrap gap-1.5"
      >
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <label
              key={item.value}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-md border px-3.5 text-sm font-medium transition-colors ${
                selected
                  ? "border-amber bg-amber text-white"
                  : "border-line bg-page text-navy hover:border-navy/30"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={item.value}
                checked={selected}
                onChange={() => onChange(item.value)}
                className="sr-only"
              />
              {item.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SwitchField({
  id,
  label,
  checked,
  onChange,
  description,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-navy">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-graphite">{description}</p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${
          checked ? "bg-amber" : "bg-line"
        }`}
      >
        <span
          className={`mt-0.5 inline-block h-6 w-6 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
        <span className="sr-only">{checked ? "Yes" : "No"}</span>
      </button>
    </div>
  );
}

export function FactorChips({
  items,
}: {
  items: readonly { label: string; factor: number }[];
}) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item.label}
          className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-navy"
        >
          {item.label}{" "}
          <span className="text-cyan">{formatFactor(item.factor)}</span>
        </li>
      ))}
    </ul>
  );
}
