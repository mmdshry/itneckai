"use client";

import { persistLine } from "@/lib/busywork/copy";

export function PersistLine() {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
      {persistLine}
    </p>
  );
}
