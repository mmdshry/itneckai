"use client";

import type { ComponentType, SVGProps } from "react";
import { ClockIcon, FileIcon, FolderIcon, MailIcon, M365Icon } from "@/components/icons";
import { GazeMascot } from "@/components/GazeMascot";
import { usePauseOffscreen } from "@/components/usePauseOffscreen";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const inputs: { Icon: Icon; label: string; delay: string; compact?: boolean }[] = [
  { Icon: MailIcon, label: "Email", delay: "0s" },
  { Icon: FileIcon, label: "Re-entry", delay: "0.7s" },
  { Icon: M365Icon, label: "Spreadsheets", delay: "1.4s" },
  { Icon: FolderIcon, label: "Searching", delay: "2.1s", compact: true },
  { Icon: ClockIcon, label: "Follow-up", delay: "2.8s", compact: true },
];

const bars = [
  { width: "88%", delay: "0.2s" },
  { width: "62%", delay: "0.7s" },
  { width: "76%", delay: "1.2s" },
];

export function WorkflowScene({ className = "" }: { className?: string }) {
  const { ref, paused } = usePauseOffscreen();

  return (
    <div
      ref={ref}
      className={`workflow-scene grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3 ${
        paused ? "is-paused" : ""
      } ${className}`}
      aria-hidden="true"
    >
      <ul className="flex flex-col items-end gap-2">
        {inputs.map((item) => (
          <li
            key={item.label}
            className={`workflow-chip items-center gap-1.5 rounded-full border border-line bg-page px-2 py-1 text-[11px] text-graphite sm:px-2.5 sm:text-xs ${
              item.compact ? "hidden sm:flex" : "flex"
            }`}
            style={{ animationDelay: item.delay }}
          >
            <item.Icon width={14} height={14} className="text-navy" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="relative">
        <span className="workflow-ring pointer-events-none absolute inset-y-[12%] -inset-x-1 rounded-full border border-dashed border-cyan/55" />
        <GazeMascot
          moods
          decorative
          priority
          className="relative w-[min(34vw,132px)] sm:w-[168px] lg:w-[min(220px,34vh)]"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-2.5">
        <div
          className="workflow-output flex w-fit items-center gap-1.5 rounded-md border border-line bg-page px-2.5 py-1.5 text-navy"
          style={{ animationDelay: "0.4s" }}
        >
          <ClockIcon width={14} height={14} className="text-cyan" />
          <span className="text-xs font-semibold sm:text-sm">+hrs</span>
        </div>
        <div className="max-w-[7.5rem] space-y-1.5">
          {bars.map((bar) => (
            <div key={bar.width} className="h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="workflow-bar h-full rounded-full bg-cyan"
                style={{ width: bar.width, animationDelay: bar.delay }}
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-graphite">
          Time back
        </p>
      </div>
    </div>
  );
}
