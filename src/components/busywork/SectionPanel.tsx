"use client";

import { useState } from "react";
import {
  addBusyworkIdea,
  removeBusyworkIdea,
  saveBusyworkContext,
  type PublicSession,
} from "@/lib/api-client";
import { discoveryQuestions, frictionLabels, sections } from "@/lib/busywork/copy";
import { effortLabel } from "@/lib/busywork/map";
import {
  frictionTypes,
  type Frequency,
  type Friction,
  type IdeaKind,
} from "@/lib/busywork/schema";
import { IdeaCard } from "./IdeaCard";
import { IdeaComposer } from "./IdeaComposer";
import { inputClass, labelClass, secondaryButtonClass } from "./styles";

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
        {number} / 03
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
  step: "observe" | "protect" | "capacity";
  session: PublicSession;
  onSession: (session: PublicSession) => void;
  onContinue: () => void;
}) {
  if (step === "observe") {
    return (
      <ObserveSection session={session} onSession={onSession} onContinue={onContinue} />
    );
  }
  if (step === "protect") {
    return (
      <TextSection
        copy={sections.protect}
        kind="alwaysHuman"
        ideas={session.payload.alwaysHuman}
        onSession={onSession}
        onContinue={onContinue}
      />
    );
  }
  return (
    <div>
      <TeamContext session={session} onSession={onSession} />
      <TextSection
        copy={sections.capacity}
        kind="capacity"
        ideas={session.payload.capacity}
        onSession={onSession}
        onContinue={onContinue}
      />
    </div>
  );
}

function TeamContext({
  session,
  onSession,
}: {
  session: PublicSession;
  onSession: (session: PublicSession) => void;
}) {
  const copy = sections.capacity;
  const [teamSize, setTeamSize] = useState(
    session.payload.context.teamSize?.toString() ?? "",
  );
  const [hourly, setHourly] = useState(
    session.payload.context.hourlyCost?.toString() ?? "",
  );
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function save(nextTeam: string, nextHourly: string) {
    const team = nextTeam.trim() === "" ? null : Number(nextTeam);
    const cost = nextHourly.trim() === "" ? null : Number(nextHourly);
    if (team !== null && (!Number.isInteger(team) || team < 1 || team > 100000)) {
      setError("Enter a whole number of people, or leave it blank.");
      return;
    }
    if (cost !== null && (!Number.isFinite(cost) || cost < 1 || cost > 10000)) {
      setError("Enter an hourly cost between 1 and 10,000, or leave it blank.");
      return;
    }
    const current = session.payload.context;
    if ((current.teamSize ?? null) === team && (current.hourlyCost ?? null) === cost) {
      setError(undefined);
      return;
    }
    setPending(true);
    setError(undefined);
    const result = await saveBusyworkContext({ teamSize: team, hourlyCost: cost });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSession(result.session);
  }

  return (
    <section className="mb-8 rounded-md border border-line p-5">
      <h3 className="font-display text-xl font-semibold text-navy">{copy.contextTitle}</h3>
      <p className="mt-2 text-sm text-graphite">{copy.contextLead}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="team-size" className={labelClass}>
            {copy.teamSizeLabel}
          </label>
          <input
            id="team-size"
            type="number"
            min={1}
            max={100000}
            inputMode="numeric"
            value={teamSize}
            disabled={pending}
            onChange={(e) => setTeamSize(e.target.value)}
            onBlur={() => void save(teamSize, hourly)}
            className={`${inputClass} h-12`}
          />
        </div>
        <div>
          <label htmlFor="hourly-cost" className={labelClass}>
            {copy.hourlyLabel}
          </label>
          <input
            id="hourly-cost"
            type="number"
            min={1}
            max={10000}
            step={1}
            inputMode="decimal"
            placeholder="50"
            value={hourly}
            disabled={pending}
            onChange={(e) => setHourly(e.target.value)}
            onBlur={() => void save(teamSize, hourly)}
            className={`${inputClass} h-12`}
          />
          <p className="mt-1.5 text-xs text-graphite">{copy.hourlyHint}</p>
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </section>
  );
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

function ContinueRow({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        className={`${secondaryButtonClass} w-full sm:w-auto`}
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  );
}

function ObserveSection({
  session,
  onSession,
  onContinue,
}: {
  session: PublicSession;
  onSession: (session: PublicSession) => void;
  onContinue: () => void;
}) {
  const copy = sections.observe;
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState<string>();
  const [hours, setHours] = useState("4");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [friction, setFriction] = useState<Friction>("repetitive");
  const [people, setPeople] = useState("1");
  const [frustration, setFrustration] = useState(3);
  const [judgment, setJudgment] = useState(false);
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
      <p className="text-sm font-medium text-navy">{copy.questionsLabel}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {discoveryQuestions.map((question) => {
          const selected = prompt === question;
          return (
            <li key={question}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setPrompt(selected ? undefined : question)}
                className={`rounded-full border px-3 py-1.5 text-left text-xs transition-colors ${
                  selected
                    ? "border-cyan bg-cyan/10 text-navy"
                    : "border-line text-graphite hover:border-navy/30 hover:text-navy"
                }`}
              >
                {question}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 space-y-3">
        {session.payload.workflows.map((idea) => (
          <IdeaCard
            key={idea.id}
            title={idea.text}
            meta={`${effortLabel(idea)}${
              idea.people > 1 ? ` · ${idea.people} people` : ""
            } · ${frictionLabels[idea.friction]}`}
            onRemove={() => removeKind("workflows", idea.id, onSession)}
          />
        ))}
        <IdeaComposer
          id="workflow"
          label={copy.workflowLabel}
          helper={prompt ? `Answering: ${prompt}` : undefined}
          placeholder={copy.workflowPlaceholder}
          value={text}
          onChange={setText}
          pending={pending}
          error={error}
          submitLabel="Add this workflow"
          onSubmit={async () => {
            const hoursValue = Number(hours);
            const peopleValue = Number(people);
            const ok = await addKind(
              "workflows",
              {
                text,
                prompt,
                hours: Number.isFinite(hoursValue) ? hoursValue : -1,
                frequency,
                friction,
                people: Number.isInteger(peopleValue) ? peopleValue : 0,
                frustration,
                judgment,
              },
              onSession,
              setError,
              setPending,
            );
            if (ok) {
              setText("");
              setJudgment(false);
            }
          }}
        >
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="workflow-hours" className={labelClass}>
                {copy.hoursLabel}
              </label>
              <input
                id="workflow-hours"
                type="number"
                min={0}
                max={744}
                step={0.5}
                inputMode="decimal"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className={`${inputClass} h-12`}
              />
            </div>
            <div>
              <label htmlFor="workflow-frequency" className={labelClass}>
                {copy.frequencyLabel}
              </label>
              <select
                id="workflow-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className={`${inputClass} h-12`}
              >
                <option value="daily">Each day</option>
                <option value="weekly">Each week</option>
                <option value="monthly">Each month</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="workflow-friction" className={labelClass}>
                {copy.frictionLabel}
              </label>
              <select
                id="workflow-friction"
                value={friction}
                onChange={(e) => setFriction(e.target.value as Friction)}
                className={inputClass}
              >
                {frictionTypes.map((item) => (
                  <option key={item} value={item}>
                    {frictionLabels[item]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="workflow-people" className={labelClass}>
                {copy.peopleLabel}
              </label>
              <input
                id="workflow-people"
                type="number"
                min={1}
                max={500}
                step={1}
                inputMode="numeric"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className={`${inputClass} h-12`}
              />
            </div>
            <div>
              <p className={labelClass}>{copy.frustrationLabel}</p>
              <p className="mt-1 text-xs text-graphite">{copy.frustrationHint}</p>
              <div className="mt-2 flex gap-2" role="group" aria-label={copy.frustrationLabel}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={frustration === value}
                    onClick={() => setFrustration(value)}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-md border text-sm ${
                      frustration === value
                        ? "border-cyan bg-cyan/10 text-navy"
                        : "border-line text-graphite hover:border-navy/30"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-start gap-3 text-sm text-navy sm:col-span-2">
              <input
                type="checkbox"
                checked={judgment}
                onChange={(e) => setJudgment(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-line"
              />
              <span>{copy.judgmentLabel}</span>
            </label>
          </div>
        </IdeaComposer>
      </div>
      <ContinueRow onContinue={onContinue} />
    </div>
  );
}

function TextSection({
  copy,
  kind,
  ideas,
  onSession,
  onContinue,
}: {
  copy: typeof sections.protect | typeof sections.capacity;
  kind: "alwaysHuman" | "capacity";
  ideas: PublicSession["payload"]["alwaysHuman"];
  onSession: (session: PublicSession) => void;
  onContinue: () => void;
}) {
  const [text, setText] = useState("");
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
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            title={idea.text}
            onRemove={() => removeKind(kind, idea.id, onSession)}
          />
        ))}
        <IdeaComposer
          id={kind}
          label={kind === "alwaysHuman" ? "Keep with a person" : "The time back"}
          helper={"helper" in copy ? copy.helper : undefined}
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
