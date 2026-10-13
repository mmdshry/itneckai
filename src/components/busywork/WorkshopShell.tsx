"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";
import { BoundaryIcon, IdeasIcon, ValueIcon, AmplifyIcon } from "@/components/icons";
import { persistLine, sections, workshopSteps, type WorkshopStep } from "@/lib/busywork/copy";

const stepMeta: Record<
  WorkshopStep,
  { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  observe: { label: sections.observe.nav, Icon: ValueIcon },
  protect: { label: sections.protect.nav, Icon: BoundaryIcon },
  capacity: { label: sections.capacity.nav, Icon: AmplifyIcon },
  map: { label: sections.map.nav, Icon: IdeasIcon },
};

export function WorkshopShell({
  step,
  onStep,
  counts,
  children,
}: {
  step: WorkshopStep;
  onStep: (step: WorkshopStep) => void;
  counts: Record<WorkshopStep, number>;
  children: ReactNode;
}) {
  const index = workshopSteps.indexOf(step);
  const progressLabel =
    step === "map" ? "Review" : `${index + 1} of 3`;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <nav
        aria-label="Assessment sections"
        className="lg:sticky lg:top-24 lg:w-56 lg:shrink-0"
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          {progressLabel}
        </p>
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
          {workshopSteps.map((item) => {
            const { label, Icon } = stepMeta[item];
            const active = item === step;
            const filled = counts[item] > 0;
            return (
              <li key={item} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onStep(item)}
                  aria-current={active ? "step" : undefined}
                  className={`flex min-h-11 w-full items-center gap-2 rounded-md border px-3 text-sm transition-colors ${
                    active
                      ? "border-cyan bg-cyan/10 text-navy"
                      : "border-line text-graphite hover:border-navy/30 hover:text-navy"
                  }`}
                >
                  <Icon className={active ? "text-cyan" : filled ? "text-navy" : "text-ink-muted"} />
                  <span>{label}</span>
                  {filled && item !== "map" ? (
                    <span className="ml-auto font-mono text-xs text-ink-muted">
                      {counts[item]}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-w-0 flex-1">
        {children}
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
          {persistLine}
        </p>
      </div>
    </div>
  );
}
