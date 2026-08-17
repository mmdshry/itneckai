"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { trackBusyworkEvent } from "@/lib/api-client";
import {
  AmplifyIcon,
  AutomateIcon,
  BoundaryIcon,
  HireIcon,
} from "@/components/icons";
import { mapCopy } from "@/lib/busywork/copy";
import { formatRatio, minutesToLabel, type OpportunityMap } from "@/lib/busywork/map";
import { primaryButtonClass, secondaryButtonClass } from "./styles";

const contactHref = "/contact?topic=End+Your+Busywork&source=busywork";

export function OpportunityMapView({
  map,
  firstName,
  onBack,
}: {
  map: OpportunityMap;
  firstName: string;
  onBack: () => void;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        {mapCopy.title}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy md:text-4xl">
        {firstName}, here’s your starting specification.
      </h2>
      <p className="mt-4 max-w-2xl text-graphite">{mapCopy.intro}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <MapCard
          icon={<BoundaryIcon className="text-cyan" />}
          label={mapCopy.protect}
          hint={mapCopy.protectHint}
          items={map.protect}
        />
        <MapCard
          icon={<AutomateIcon className="text-cyan" />}
          label={mapCopy.automate}
          hint={mapCopy.automateHint}
          items={map.automate}
        />
        <MapCard
          icon={<AmplifyIcon className="text-cyan" />}
          label={mapCopy.amplify}
          hint={mapCopy.amplifyHint}
          items={map.amplify.map((idea) =>
            idea.ratio
              ? `${idea.text} (${formatRatio(idea.ratio)} — ${minutesToLabel(idea.prepMinutes)} prep / ${minutesToLabel(idea.performanceMinutes)} performance)`
              : idea.text,
          )}
        />
        <MapCard
          icon={<HireIcon className="text-cyan" />}
          label={mapCopy.build}
          hint={mapCopy.buildHint}
          items={map.build.map(
            (idea) => `${idea.responsibilities} — ${idea.kpi}`,
          )}
        />
      </div>

      <section className="mt-6 rounded-md border border-line bg-surface p-5">
        <h3 className="font-display text-lg font-semibold text-navy">
          {mapCopy.timeLabel}
        </h3>
        <p className="mt-2 text-navy">
          {mapCopy.hoursIdentified(map.robotHoursPerWeek)}
        </p>
        <p className="mt-2 text-sm text-graphite">{mapCopy.hoursDisclaimer}</p>
      </section>

      {map.highValue.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm text-graphite">Protect capacity for:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {map.highValue.map((item) => (
              <li
                key={item}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-navy"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-8 text-graphite">{mapCopy.outcome}</p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={contactHref}
          className={`${primaryButtonClass} w-full sm:w-auto`}
          onClick={() => {
            void trackBusyworkEvent("booking_cta_click");
          }}
        >
          {mapCopy.primaryCta}
        </Link>
        <Link href="/solutions" className={`${secondaryButtonClass} w-full sm:w-auto`}>
          {mapCopy.secondaryCta}
        </Link>
      </div>
      <p className="mt-4">
        <button
          type="button"
          className="text-sm text-navy underline underline-offset-4"
          onClick={onBack}
        >
          Back to my ideas
        </button>
      </p>
    </div>
  );
}

function MapCard({
  icon,
  label,
  hint,
  items,
}: {
  icon: ReactNode;
  label: string;
  hint: string;
  items: string[];
}) {
  return (
    <article className="rounded-md border border-line p-5">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h3 className="font-display text-lg font-semibold text-navy">{label}</h3>
          <p className="text-xs uppercase tracking-widest text-graphite">{hint}</p>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">No ideas captured in this lane yet.</p>
      ) : (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-graphite">
          {items.map((item, index) => (
            <li key={`${index}-${item}`}>{item}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
