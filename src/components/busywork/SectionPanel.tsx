"use client";

import { useState } from "react";
import {
  addBusyworkIdea,
  removeBusyworkIdea,
  type PublicSession,
} from "@/lib/api-client";
import { sections } from "@/lib/busywork/copy";
import { hoursPeriodLabel, minutesToLabel } from "@/lib/busywork/map";
import type { IdeaKind } from "@/lib/busywork/schema";
import { IdeaCard } from "./IdeaCard";
import { IdeaComposer } from "./IdeaComposer";
import { errorClass, inputClass, labelClass, secondaryButtonClass } from "./styles";

function Heading({
  number,
  title,
  lead,
  prompt,
}: {
  number: string;
  title: string;
  lead: string;
  prompt: string;
}) {
  return (
    <header className="mb-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        {number} / 05
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-graphite">{lead}</p>
      <p className="mt-3 text-lg font-medium text-navy">{prompt}</p>
    </header>
  );
}

export function SectionPanel({
  step,
  session,
  onSession,
  onContinue,
}: {
  step: "value" | "boundary" | "automate" | "amplify" | "agent";
  session: PublicSession;
  onSession: (session: PublicSession) => void;
  onContinue: () => void;
}) {
  if (step === "value") {
    return <ValueSection session={session} onSession={onSession} onContinue={onContinue} />;
  }
  if (step === "boundary") {
    return (
      <TextSection
        copy={sections.boundary}
        kind="alwaysHuman"
        ideas={session.payload.alwaysHuman}
        session={session}
        onSession={onSession}
        onContinue={onContinue}
      />
    );
  }
  if (step === "automate") {
    return <AutomateSection session={session} onSession={onSession} onContinue={onContinue} />;
  }
  if (step === "amplify") {
    return <AmplifySection session={session} onSession={onSession} onContinue={onContinue} />;
  }
  return <AgentSection session={session} onSession={onSession} onContinue={onContinue} />;
}

async function addKind(
  kind: IdeaKind,
  input: unknown,
  onSession: (session: PublicSession) => void,
  setError: (value?: string) => void,
  setPending: (value: boolean) => void,
) {
  setPending(true);
  setError(undefined);
  const result = await addBusyworkIdea(kind, input);
  setPending(false);
  if (!result.ok) {
    setError(result.error);
    return false;
  }
  onSession(result.session);
  return true;
}

async function removeKind(
  kind: IdeaKind,
  id: string,
  onSession: (session: PublicSession) => void,
) {
  const result = await removeBusyworkIdea(kind, id);
  if (result.ok) onSession(result.session);
}

function ContinueRow({
  onContinue,
  disabled,
}: {
  onContinue: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        className={`${secondaryButtonClass} w-full sm:w-auto`}
        onClick={onContinue}
        disabled={disabled}
      >
        Continue
      </button>
    </div>
  );
}

function ValueSection({
  session,
  onSession,
  onContinue,
}: {
  session: PublicSession;
  onSession: (session: PublicSession) => void;
  onContinue: () => void;
}) {
  const copy = sections.value;
  const [highValue, setHighValue] = useState("");
  const [busywork, setBusywork] = useState("");
  const [pending, setPending] = useState<"highValue" | "busywork">();
  const [error, setError] = useState<string>();
  const [errorFor, setErrorFor] = useState<"highValue" | "busywork">();

  return (
    <div>
      <Heading
        number={copy.number}
        title={copy.title}
        lead={copy.lead}
        prompt={copy.prompt}
      />
      <p className="mb-6 text-sm text-graphite">
        For example: {copy.examples.join(" · ")}
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {session.payload.highValue.map((idea) => (
            <IdeaCard
              key={idea.id}
              title={idea.text}
              onRemove={() => removeKind("highValue", idea.id, onSession)}
            />
          ))}
          <IdeaComposer
            id="high-value"
            label={copy.highValueLabel}
            helper={copy.highValueHelper}
            placeholder={copy.highValuePlaceholder}
            value={highValue}
            onChange={setHighValue}
            pending={pending === "highValue"}
            error={errorFor === "highValue" ? error : undefined}
            onSubmit={async () => {
              setErrorFor("highValue");
              const ok = await addKind(
                "highValue",
                { text: highValue },
                onSession,
                setError,
                (value) => setPending(value ? "highValue" : undefined),
              );
              if (ok) setHighValue("");
            }}
          />
        </div>
        <div className="space-y-3">
          {session.payload.busywork.map((idea) => (
            <IdeaCard
              key={idea.id}
              title={idea.text}
              onRemove={() => removeKind("busywork", idea.id, onSession)}
            />
          ))}
          <IdeaComposer
            id="busywork"
            label={copy.busyworkLabel}
            helper={copy.busyworkHelper}
            placeholder={copy.busyworkPlaceholder}
            value={busywork}
            onChange={setBusywork}
            pending={pending === "busywork"}
            error={errorFor === "busywork" ? error : undefined}
            onSubmit={async () => {
              setErrorFor("busywork");
              const ok = await addKind(
                "busywork",
                { text: busywork },
                onSession,
                setError,
                (value) => setPending(value ? "busywork" : undefined),
              );
              if (ok) setBusywork("");
            }}
          />
        </div>
      </div>
      <ContinueRow onContinue={onContinue} />
    </div>
  );
}

function TextSection({
  copy,
  kind,
  ideas,
  session,
  onSession,
  onContinue,
}: {
  copy: typeof sections.boundary;
  kind: "alwaysHuman";
  ideas: PublicSession["payload"]["alwaysHuman"];
  session: PublicSession;
  onSession: (session: PublicSession) => void;
  onContinue: () => void;
}) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  void session;

  return (
    <div>
      <Heading
        number={copy.number}
        title={copy.title}
        lead={copy.lead}
        prompt={copy.prompt}
      />
      <p className="mb-6 text-sm text-graphite">
        For example: {copy.examples.join(" · ")}
      </p>
      <div className="space-y-3">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            title={idea.text}
            onRemove={() => removeKind(kind, idea.id, onSession)}
          />
        ))}
        <IdeaComposer
          id={kind}
          label="Always stay human"
          helper={copy.helper}
          placeholder={copy.placeholder}
          value={text}
          onChange={setText}
          pending={pending}
          error={error}
          onSubmit={async () => {
            const ok = await addKind(kind, { text }, onSession, setError, setPending);
            if (ok) setText("");
          }}
        />
      </div>
      <ContinueRow onContinue={onContinue} />
    </div>
  );
}

function AutomateSection({
  session,
  onSession,
  onContinue,
}: {
  session: PublicSession;
  onSession: (session: PublicSession) => void;
  onContinue: () => void;
}) {
  const copy = sections.automate;
  const [text, setText] = useState("");
  const [hours, setHours] = useState("4");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <div>
      <Heading
        number={copy.number}
        title={copy.title}
        lead={copy.lead}
        prompt={copy.prompt}
      />
      <p className="mb-6 text-sm text-graphite">
        For example: {copy.examples.join(" · ")}
      </p>
      <div className="space-y-3">
        {session.payload.robotTasks.map((idea) => (
          <IdeaCard
            key={idea.id}
            title={idea.text}
            meta={hoursPeriodLabel(idea.hoursPerWeek, idea.frequency)}
            onRemove={() => removeKind("robotTasks", idea.id, onSession)}
          />
        ))}
        <IdeaComposer
          id="robot-task"
          label="The task"
          placeholder={copy.placeholder}
          value={text}
          onChange={setText}
          pending={pending}
          error={error}
          onSubmit={async () => {
            const hoursPerWeek = Number(hours);
            const ok = await addKind(
              "robotTasks",
              {
                text,
                hoursPerWeek: Number.isFinite(hoursPerWeek) ? hoursPerWeek : -1,
              },
              onSession,
              setError,
              setPending,
            );
            if (ok) {
              setText("");
              setHours("4");
            }
          }}
        >
          <div className="mt-4 max-w-xs">
            <label htmlFor="robot-hours" className={labelClass}>
              {copy.hoursLabel}
            </label>
            <input
              id="robot-hours"
              type="number"
              min={0}
              max={744}
              step={0.5}
              inputMode="decimal"
              placeholder={copy.hoursPlaceholder}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className={`${inputClass} h-12`}
            />
          </div>
        </IdeaComposer>
      </div>
      <ContinueRow onContinue={onContinue} />
    </div>
  );
}

function DurationField({
  id,
  label,
  amount,
  unit,
  onAmount,
  onUnit,
}: {
  id: string;
  label: string;
  amount: string;
  unit: "minutes" | "hours";
  onAmount: (value: string) => void;
  onUnit: (value: "minutes" | "hours") => void;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={`${labelClass} leading-snug`}>
        {label}
      </label>
      <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <input
          id={id}
          type="number"
          min={0}
          step={0.5}
          inputMode="decimal"
          value={amount}
          onChange={(e) => onAmount(e.target.value)}
          className="h-12 min-w-0 w-full rounded-md border border-line bg-page px-3.5 py-3 text-sm text-navy"
        />
        <select
          aria-label={`${label} unit`}
          value={unit}
          onChange={(e) => onUnit(e.target.value as "minutes" | "hours")}
          className="h-12 w-[7.5rem] rounded-md border border-line bg-page px-3.5 py-3 text-sm text-navy"
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>
    </div>
  );
}

function toMinutes(amount: string, unit: "minutes" | "hours"): number {
  const value = Number(amount);
  if (!Number.isFinite(value)) return Number.NaN;
  return unit === "hours" ? value * 60 : value;
}

function AmplifySection({
  session,
  onSession,
  onContinue,
}: {
  session: PublicSession;
  onSession: (session: PublicSession) => void;
  onContinue: () => void;
}) {
  const copy = sections.amplify;
  const [text, setText] = useState("");
  const [prep, setPrep] = useState("4");
  const [prepUnit, setPrepUnit] = useState<"minutes" | "hours">("hours");
  const [perf, setPerf] = useState("15");
  const [perfUnit, setPerfUnit] = useState<"minutes" | "hours">("minutes");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <div>
      <Heading
        number={copy.number}
        title={copy.title}
        lead={copy.lead}
        prompt={copy.prompt}
      />
      <p className="mb-6 text-sm text-graphite">
        For example: {copy.examples.join(" · ")}
      </p>
      <div className="space-y-3">
        {session.payload.superhuman.map((idea) => (
          <IdeaCard
            key={idea.id}
            title={idea.text}
            meta={`Prep ${minutesToLabel(idea.prepMinutes)} · Performance ${minutesToLabel(idea.performanceMinutes)}`}
            onRemove={() => removeKind("superhuman", idea.id, onSession)}
          />
        ))}
        <IdeaComposer
          id="superhuman"
          label="The task"
          placeholder={copy.placeholder}
          value={text}
          onChange={setText}
          pending={pending}
          error={error}
          onSubmit={async () => {
            const ok = await addKind(
              "superhuman",
              {
                text,
                prepMinutes: toMinutes(prep, prepUnit),
                performanceMinutes: toMinutes(perf, perfUnit),
              },
              onSession,
              setError,
              setPending,
            );
            if (ok) setText("");
          }}
        >
          <div className="mt-4 grid gap-4">
            <DurationField
              id="prep-time"
              label={copy.prepLabel}
              amount={prep}
              unit={prepUnit}
              onAmount={setPrep}
              onUnit={setPrepUnit}
            />
            <DurationField
              id="perf-time"
              label={copy.performanceLabel}
              amount={perf}
              unit={perfUnit}
              onAmount={setPerf}
              onUnit={setPerfUnit}
            />
          </div>
        </IdeaComposer>
      </div>
      <ContinueRow onContinue={onContinue} />
    </div>
  );
}

function AgentSection({
  session,
  onSession,
  onContinue,
}: {
  session: PublicSession;
  onSession: (session: PublicSession) => void;
  onContinue: () => void;
}) {
  const copy = sections.agent;
  const [responsibilities, setResponsibilities] = useState("");
  const [kpi, setKpi] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <div>
      <Heading
        number={copy.number}
        title={copy.title}
        lead={copy.lead}
        prompt={copy.prompt}
      />
      <p className="mb-6 text-sm text-graphite">
        For example: {copy.examples.join(" · ")}
      </p>
      <div className="space-y-3">
        {session.payload.hire.map((idea) => (
          <IdeaCard
            key={idea.id}
            title={idea.responsibilities}
            meta={`Measure: ${idea.kpi}`}
            onRemove={() => removeKind("hire", idea.id, onSession)}
          />
        ))}
        <form
          className="rounded-md border border-line p-4 sm:p-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = await addKind(
              "hire",
              { responsibilities, kpi },
              onSession,
              setError,
              setPending,
            );
            if (ok) {
              setResponsibilities("");
              setKpi("");
            }
          }}
        >
          <label htmlFor="hire-do" className={labelClass}>
            {copy.responsibilitiesLabel}
          </label>
          <textarea
            id="hire-do"
            rows={3}
            value={responsibilities}
            placeholder={copy.responsibilitiesPlaceholder}
            onChange={(e) => setResponsibilities(e.target.value)}
            className={inputClass}
          />
          <label htmlFor="hire-kpi" className={`${labelClass} mt-4`}>
            {copy.kpiLabel}
          </label>
          <textarea
            id="hire-kpi"
            rows={2}
            value={kpi}
            placeholder={copy.kpiPlaceholder}
            onChange={(e) => setKpi(e.target.value)}
            className={inputClass}
          />
          {error ? <p className={errorClass}>{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {pending ? "Saving…" : "Add this idea"}
          </button>
        </form>
      </div>
      <ContinueRow onContinue={onContinue} />
    </div>
  );
}
