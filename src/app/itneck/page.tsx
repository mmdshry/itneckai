import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PrimaryCta } from "@/components/ui";
import { homeHero, homePillars } from "@/lib/itneck/home";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";
import { solutionHubs } from "@/lib/itneck/solutions";

export const metadata: Metadata = {
  title: "Managed IT Services - Managed IT for Business",
  description:
    "We simplify and secure your technology, so your team can stay focused, productive, and moving forward.",
  alternates: { canonical: itneckAbsoluteUrl() },
  openGraph: {
    title: "ITneck | Technology Support",
    description:
      "We simplify and secure your technology, so your team can stay focused, productive, and moving forward.",
    url: itneckAbsoluteUrl(),
  },
};

export default function ItneckHomePage() {
  return (
    <div className="bg-[#02376b] text-white">
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src="/itneck/home/corporate-laptop.png"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02376b] via-[#02376b]/80 to-[#02376b]/40" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 md:pb-24">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#f9690e]">
            {homeHero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            {homeHero.title}
          </h1>
          <div className="mt-10">
            <PrimaryCta href={homeHero.primaryCta.href}>
              {homeHero.primaryCta.label}
            </PrimaryCta>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {homePillars.map((pillar, i) => (
              <li key={pillar}>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#f9690e]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {pillar}
                </h2>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#f9690e]">
            Solutions
          </p>
          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {solutionHubs.map((hub) => (
              <li key={hub.slug}>
                <Link
                  href={`/itneck/solutions/${hub.slug}`}
                  className="group flex flex-col gap-3 py-8 md:flex-row md:items-baseline md:justify-between md:gap-10"
                >
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-[#f9690e] md:text-4xl">
                    {hub.navLabel}
                  </h2>
                  <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-right">
                    {hub.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <PrimaryCta href={homeHero.primaryCta.href}>
              {homeHero.primaryCta.label}
            </PrimaryCta>
          </div>
        </div>
      </section>
    </div>
  );
}
