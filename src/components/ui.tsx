import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/icons";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
      {children}
    </p>
  );
}

export function Section({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}

export function PrimaryCta({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-amber px-6 text-base font-semibold text-navy transition-transform hover:-translate-y-0.5"
    >
      {children}
    </Link>
  );
}

export function GhostCta({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-cyan/50 px-6 text-base font-medium text-cyan transition-colors hover:border-cyan hover:bg-cyan/10"
    >
      {children}
      <ArrowRightIcon />
    </Link>
  );
}

export function CtaBanner({
  heading = "Ready to see what an agent could do for your team?",
}: {
  heading?: string;
}) {
  return (
    <section aria-label="Book a consultation" className="border-y border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-cloud md:text-3xl">
          {heading}
        </h2>
        <PrimaryCta href="/contact">Book a Consultation</PrimaryCta>
      </div>
    </section>
  );
}
