"use client";

import { experience } from "@/lib/busywork/copy";
import { primaryButtonClass } from "./styles";
import { PersistLine } from "./PersistLine";

export function Welcome({
  onStart,
  error,
}: {
  onStart: () => void;
  error?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        {experience.eyebrow}
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl">
        {experience.headline}
      </h1>
      <p className="mt-6 text-lg text-graphite">{experience.supporting}</p>
      <p className="mt-4 text-base font-medium text-navy">{experience.promise}</p>
      <p className="mt-3 text-sm text-graphite">{experience.effort}</p>
      {error ? (
        <p className="mt-6 rounded-md border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      ) : null}
      <button type="button" className={`${primaryButtonClass} mt-8`} onClick={onStart}>
        Start
      </button>
      <div className="mt-8">
        <PersistLine />
      </div>
    </div>
  );
}
