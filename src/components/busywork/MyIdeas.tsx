"use client";

import { useState, type ReactNode } from "react";
import { submitBusywork, type PublicSession } from "@/lib/api-client";
import { sections } from "@/lib/busywork/copy";
import { hoursPeriodLabel, minutesToLabel } from "@/lib/busywork/map";
import { ideaCount } from "@/lib/busywork/schema";
import { primaryButtonClass } from "./styles";

function Block({
  title,
  empty,
  children,
}: {
  title: string;
  empty: boolean;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md border border-line p-5">
      <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
      {empty ? (
        <p className="mt-2 text-sm text-ink-muted">
          Nothing here yet — you can jump back and add an idea.
        </p>
      ) : (
        <div className="mt-3 space-y-2 text-sm text-graphite">{children}</div>
      )}
    </section>
  );
}

export function MyIdeas({
  session,
  onSubmitted,
}: {
  session: PublicSession;
  onSubmitted: (session: PublicSession) => void;
}) {
  const copy = sections.ideas;
  const { payload } = session;
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [emailCopy, setEmailCopy] = useState(false);
  const empty = ideaCount(payload) === 0;

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        Review
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy md:text-4xl">
        {copy.title}
      </h2>
      <p className="mt-4 max-w-2xl text-graphite">{copy.lead}</p>

      <div className="mt-8 grid gap-4">
        <Block title="High-value work" empty={payload.highValue.length === 0}>
          <ul className="list-disc space-y-1 pl-5">
            {payload.highValue.map((idea) => (
              <li key={idea.id}>{idea.text}</li>
            ))}
          </ul>
        </Block>
        <Block title="Busywork" empty={payload.busywork.length === 0}>
          <ul className="list-disc space-y-1 pl-5">
            {payload.busywork.map((idea) => (
              <li key={idea.id}>{idea.text}</li>
            ))}
          </ul>
        </Block>
        <Block title="Always human" empty={payload.alwaysHuman.length === 0}>
          <ul className="list-disc space-y-1 pl-5">
            {payload.alwaysHuman.map((idea) => (
              <li key={idea.id}>{idea.text}</li>
            ))}
          </ul>
        </Block>
        <Block title="AI automation opportunity" empty={payload.robotTasks.length === 0}>
          <ul className="list-disc space-y-1 pl-5">
            {payload.robotTasks.map((idea) => (
              <li key={idea.id}>
                {idea.text} — {hoursPeriodLabel(idea.hoursPerWeek, idea.frequency)}
              </li>
            ))}
          </ul>
        </Block>
        <Block title="AI superhuman opportunity" empty={payload.superhuman.length === 0}>
          <ul className="list-disc space-y-1 pl-5">
            {payload.superhuman.map((idea) => (
              <li key={idea.id}>
                {idea.text} — Prep {minutesToLabel(idea.prepMinutes)}, performance{" "}
                {minutesToLabel(idea.performanceMinutes)}
              </li>
            ))}
          </ul>
        </Block>
        <Block title="What you’d hire someone to handle" empty={payload.hire.length === 0}>
          <ul className="list-disc space-y-1 pl-5">
            {payload.hire.map((idea) => (
              <li key={idea.id}>
                {idea.responsibilities} — Measure: {idea.kpi}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      {error ? (
        <p className="mt-6 rounded-md border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <label className="mt-8 flex items-start gap-3 text-sm text-navy">
        <input
          type="checkbox"
          checked={emailCopy}
          onChange={(e) => setEmailCopy(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-line"
        />
        <span>{copy.copyLabel}</span>
      </label>

      <button
        type="button"
        disabled={pending || empty}
        className={`${primaryButtonClass} mt-6 w-full sm:w-auto`}
        onClick={async () => {
          setPending(true);
          setError(undefined);
          try {
            const result = await submitBusywork({ emailCopy });
            if (!result.ok) {
              setError(result.error);
              return;
            }
            onSubmitted(result.session);
          } catch {
            setError("We couldn’t submit your ideas. Please try again.");
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? "Submitting…" : copy.emailCta}
      </button>
      <p className="mt-3 text-sm text-graphite">{copy.emailHelper}</p>
    </div>
  );
}
