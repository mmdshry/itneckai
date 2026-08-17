"use client";

import type { FormEvent, ReactNode } from "react";
import { errorClass, inputClass, labelClass, primaryButtonClass } from "./styles";

export function ExampleChips({
  items,
  onPick,
}: {
  items: readonly string[];
  onPick: (value: string) => void;
}) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item}>
          <button
            type="button"
            onClick={() => onPick(item)}
            className="rounded-full border border-line px-3 py-1.5 text-xs text-graphite transition-colors hover:border-navy/30 hover:text-navy"
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function IdeaComposer({
  id,
  label,
  helper,
  placeholder,
  value,
  onChange,
  chips,
  onChip,
  children,
  onSubmit,
  pending,
  error,
  submitLabel = "Add this idea",
}: {
  id: string;
  label: string;
  helper?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  chips?: readonly string[];
  onChip?: (value: string) => void;
  children?: ReactNode;
  onSubmit: () => void;
  pending?: boolean;
  error?: string;
  submitLabel?: string;
}) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-line p-4 sm:p-5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {helper ? <p className="mt-1 text-sm text-graphite">{helper}</p> : null}
      <textarea
        id={id}
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        className={inputClass}
      />
      {chips && onChip ? <ExampleChips items={chips} onPick={onChip} /> : null}
      {children}
      {error ? <p className={errorClass}>{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className={`${primaryButtonClass} mt-4 w-full sm:w-auto`}
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
