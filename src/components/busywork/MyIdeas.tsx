"use client";

import { useMemo, useRef, useState } from "react";
import {
  TurnstileField,
  type TurnstileFieldHandle,
} from "@/components/TurnstileField";
import { submitBusywork, type PublicSession } from "@/lib/api-client";
import { sections } from "@/lib/busywork/copy";
import { buildBusyWorkMap } from "@/lib/busywork/map";
import { ideaCount } from "@/lib/busywork/schema";
import { BusyWorkMapView } from "./OpportunityMap";
import { primaryButtonClass } from "./styles";

export function MyIdeas({
  session,
  onSubmitted,
  siteKey,
}: {
  session: PublicSession;
  onSubmitted: (session: PublicSession) => void;
  siteKey: string;
}) {
  const copy = sections.map;
  const map = useMemo(() => buildBusyWorkMap(session.payload), [session.payload]);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [emailCopy, setEmailCopy] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileFieldHandle>(null);
  const empty = ideaCount(session.payload) === 0;
  const unchanged = session.unchangedSinceSubmit === true;
  const captchaBlocking = Boolean(siteKey) && !turnstileToken;

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Review</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy md:text-4xl">
        {copy.title}
      </h2>
      <p className="mt-4 max-w-2xl text-graphite">{copy.lead}</p>

      <div className="mt-8">
        <BusyWorkMapView map={map} />
      </div>

      {unchanged ? (
        <p className="mt-6 rounded-md border border-line bg-page px-4 py-3 text-sm text-graphite">
          {copy.alreadySubmitted}
        </p>
      ) : error ? (
        <p className="mt-6 rounded-md border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <label className="mt-8 flex items-start gap-3 text-sm text-navy">
        <input
          type="checkbox"
          checked={emailCopy}
          onChange={(e) => setEmailCopy(e.target.checked)}
          disabled={unchanged}
          className="mt-1 h-4 w-4 shrink-0 rounded border-line"
        />
        <span>{copy.copyLabel}</span>
      </label>

      {siteKey && !unchanged ? (
        <div className="mt-6">
          <TurnstileField
            ref={turnstileRef}
            siteKey={siteKey}
            onToken={setTurnstileToken}
            onLoadError={() =>
              setError("Could not load verification. Refresh and try again.")
            }
          />
        </div>
      ) : null}

      <button
        type="button"
        disabled={pending || empty || unchanged || captchaBlocking}
        className={`${primaryButtonClass} mt-6 w-full sm:w-auto`}
        onClick={async () => {
          if (unchanged) return;
          setPending(true);
          setError(undefined);
          try {
            const result = await submitBusywork({ emailCopy, turnstileToken });
            if (!result.ok) {
              setError(result.error);
              turnstileRef.current?.reset();
              return;
            }
            onSubmitted(result.session);
          } catch {
            setError("We couldn’t submit your map. Please try again.");
            turnstileRef.current?.reset();
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? "Submitting…" : unchanged ? "Already submitted" : copy.emailCta}
      </button>
      <p className="mt-3 text-sm text-graphite">{copy.emailHelper}</p>
    </div>
  );
}
