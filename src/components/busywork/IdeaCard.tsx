"use client";

import { CloseIcon } from "@/components/icons";

export function IdeaCard({
  title,
  meta,
  onRemove,
}: {
  title: string;
  meta?: string;
  onRemove: () => void;
}) {
  return (
    <article className="flex items-start justify-between gap-3 rounded-md border border-line bg-surface px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-navy">{title}</p>
        {meta ? <p className="mt-1 text-xs text-graphite">{meta}</p> : null}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-md text-graphite hover:bg-page hover:text-navy"
        aria-label="Remove this idea"
      >
        <CloseIcon />
      </button>
    </article>
  );
}
