"use client";

import Link from "next/link";
import { primaryButtonClass, secondaryButtonClass } from "./styles";

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
        We received your ideas. Our team will review them and follow up with
        you. Nothing was generated automatically.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/solutions" className={`${primaryButtonClass} w-full sm:w-auto`}>
          Explore more
        </Link>
        <Link href="/contact" className={`${secondaryButtonClass} w-full sm:w-auto`}>
          Contact
        </Link>
      </div>
    </div>
  );
}
