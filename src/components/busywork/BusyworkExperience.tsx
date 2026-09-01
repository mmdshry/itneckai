"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getBusyworkSession,
  trackBusyworkEvent,
  type PublicSession,
} from "@/lib/api-client";
import { workshopSteps, type WorkshopStep } from "@/lib/busywork/copy";
import { CheckEmail } from "./CheckEmail";
import { JoinForm } from "./JoinForm";
import { MyIdeas } from "./MyIdeas";
import { SectionPanel } from "./SectionPanel";
import { SubmittedThanks } from "./SubmittedThanks";
import { Welcome } from "./Welcome";
import { WorkshopShell } from "./WorkshopShell";

type Screen = "welcome" | "join" | "check-email" | "workshop" | "thanks";

const INVALID_LINK =
  "That sign-in link is invalid or has expired. Enter your email again and we’ll send a new one.";

function nextStep(step: WorkshopStep): WorkshopStep {
  const index = workshopSteps.indexOf(step);
  return workshopSteps[Math.min(index + 1, workshopSteps.length - 1)] ?? "ideas";
}

export function BusyworkExperience({
  turnstileSiteKey,
}: {
  turnstileSiteKey: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<PublicSession | null>(null);
  const [step, setStep] = useState<WorkshopStep>("value");
  const [email, setEmail] = useState("");
  const [devLink, setDevLink] = useState<string>();
  const [welcomeError, setWelcomeError] = useState<string>();

  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    const from = searchParams.get("from");
    void trackBusyworkEvent("assessment_start", from ? { from } : undefined);
    if (from) {
      void trackBusyworkEvent("cta_click", { from });
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("error") === "invalid-link") {
      setWelcomeError(INVALID_LINK);
    }

    const joined = searchParams.get("joined") === "1";
    const startValue = searchParams.get("start") === "value";
    const from = searchParams.get("from");

    void getBusyworkSession().then((result) => {
      if (result.ok && result.session) {
        setSession(result.session);
        setScreen("workshop");
        if (joined || startValue) {
          setStep("value");
        }
        if (joined || startValue) {
          const params = new URLSearchParams();
          if (from) params.set("from", from);
          const qs = params.toString();
          router.replace(qs ? `${pathname}?${qs}` : pathname);
        }
      } else if (startValue) {
        setScreen("welcome");
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
      }
      setLoading(false);
    });
  }, [searchParams, pathname, router]);

  const counts = useMemo(() => {
    const payload = session?.payload;
    return {
      value: (payload?.highValue.length ?? 0) + (payload?.busywork.length ?? 0),
      boundary: payload?.alwaysHuman.length ?? 0,
      automate: payload?.robotTasks.length ?? 0,
      amplify: payload?.superhuman.length ?? 0,
      agent: payload?.hire.length ?? 0,
      ideas: payload
        ? payload.highValue.length +
          payload.busywork.length +
          payload.alwaysHuman.length +
          payload.robotTasks.length +
          payload.superhuman.length +
          payload.hire.length
        : 0,
    } satisfies Record<WorkshopStep, number>;
  }, [session]);

  if (loading) {
    return (
      <p className="text-sm text-graphite" aria-live="polite">
        Loading your workshop…
      </p>
    );
  }

  if (screen === "welcome") {
    return (
      <Welcome
        error={welcomeError}
        onStart={() => {
          setWelcomeError(undefined);
          setScreen("join");
        }}
      />
    );
  }

  if (screen === "join") {
    return (
      <JoinForm
        siteKey={turnstileSiteKey}
        onSent={(sentEmail, link) => {
          setEmail(sentEmail);
          setDevLink(link);
          setScreen("check-email");
        }}
      />
    );
  }

  if (screen === "check-email") {
    return <CheckEmail email={email} devLink={devLink} />;
  }

  if (screen === "thanks") {
    return <SubmittedThanks />;
  }

  if (!session) {
    return (
      <Welcome
        error="Please join with the email link to continue."
        onStart={() => setScreen("join")}
      />
    );
  }

  return (
    <WorkshopShell step={step} onStep={setStep} counts={counts}>
      {step === "ideas" ? (
        <MyIdeas
          siteKey={turnstileSiteKey}
          session={session}
          onSubmitted={(next) => {
            setSession(next);
            setScreen("thanks");
          }}
        />
      ) : (
        <SectionPanel
          step={step}
          session={session}
          onSession={setSession}
          onContinue={() => setStep(nextStep(step))}
        />
      )}
    </WorkshopShell>
  );
}
