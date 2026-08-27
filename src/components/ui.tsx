import type {ReactNode} from "react";
import {ArrowRightIcon} from "@/components/icons";
import { SiteLink } from "@/components/SiteLink";

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
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <SiteLink
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </SiteLink>
  );
}

export function GhostCta({
  href,
  children,
  className = "",
  variant = "default",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "onDark";
}) {
  const styles =
    variant === "onDark"
      ? "border-white/30 text-white hover:border-white/60 hover:bg-white/10"
      : "border-navy/20 text-navy hover:border-navy/40 hover:bg-surface";
  return (
    <SiteLink
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-6 text-base font-medium transition-colors ${styles} ${className}`}
    >
      {children}
      <ArrowRightIcon />
    </SiteLink>
  );
}

export function CtaBanner({
  heading = "Ready to see what an agent could do for your team?",
  href = "/contact",
  ctaLabel = "Book a working session",
}: {
  heading?: string;
  href?: string;
  ctaLabel?: string;
}) {
  return (
      <section aria-label={ctaLabel} className="border-y border-line bg-surface">
          <div
              className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-cloud md:text-3xl">
          {heading}
        </h2>
              <PrimaryCta href={href}>{ctaLabel}</PrimaryCta>
      </div>
    </section>
  );
}
