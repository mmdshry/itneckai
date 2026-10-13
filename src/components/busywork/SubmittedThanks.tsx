"use client";

import Link from "next/link";
import { trackBusyworkEvent } from "@/lib/api-client";
import { mapCopy, nextSteps } from "@/lib/busywork/copy";
import { primaryButtonClass, secondaryButtonClass } from "./styles";

const contactHref = "/contact?topic=End+Your+Busywork&source=busywork";

export function SubmittedThanks() {
  return (
    <div className="max-w-lg">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        Submitted
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-navy">
        Thanks — we’ll be in touch soon.
      </h1>
      <p className="mt-4 text-graphite">
        We received your Busy Work Map. We’ll look at the workflows, the time
        they take, and where a simpler process or automation can give that
        time back.
      </p>
      <h2 className="mt-8 font-display text-xl font-semibold text-navy">
        What happens next
      </h2>
      <ol className="mt-4 space-y-3">
        {nextSteps.map((step, index) => (
          <li key={step.name} className="text-sm text-graphite">
            <span className="font-mono text-xs text-cyan">
              {String(index + 1).padStart(2, "0")}
            </span>{" "}
            <span className="font-medium text-navy">{step.name}.</span> {step.outcome}
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={contactHref}
          className={`${primaryButtonClass} w-full sm:w-auto`}
          onClick={() => {
            void trackBusyworkEvent("booking_cta_click");
          }}
        >
          {mapCopy.primaryCta}
        </Link>
        <Link href="/how-it-works" className={`${secondaryButtonClass} w-full sm:w-auto`}>
          {mapCopy.secondaryCta}
        </Link>
      </div>
    </div>
  );
}
