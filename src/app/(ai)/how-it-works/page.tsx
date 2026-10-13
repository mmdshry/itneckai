import type { Metadata } from "next";
import Link from "next/link";
import { BrandSummary } from "@/components/BrandSummary";
import { BusyworkEntryLink } from "@/components/busywork/BusyworkEntryLink";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow, Section } from "@/components/ui";
import { chapters } from "@/lib/method";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Ai.neck starts with the business, not the technology: Discover the friction, Build the workflow, then Optimize what creates time back.",
  alternates: { canonical: absoluteUrl("/how-it-works") },
  openGraph: {
    title: "How It Works | Ai.neck",
    description:
      "Discover, Build, and Optimize — a short path from busy work to time back.",
    url: absoluteUrl("/how-it-works"),
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>How It Works</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          We do not start with AI. We start with your business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">
          We look at how work gets done, find where time and money are being
          lost, and build practical solutions around the highest-value
          opportunities.
        </p>
      </Section>

      <Section className="pt-0" aria-label="Discover, Build, and Optimize">
        <ol className="grid gap-4 md:grid-cols-3">
          {chapters.map((chapter) => (
            <li key={chapter.slug}>
              <Link
                href={`/how-it-works/${chapter.slug}`}
                className="flex h-full flex-col rounded-lg border border-line bg-page p-6 transition-colors hover:border-navy/30 hover:bg-surface"
              >
                <p className="font-display text-3xl font-semibold text-cyan">
                  {chapter.number}
                </p>
                <h2 className="mt-4 font-display text-2xl font-semibold text-navy">
                  {chapter.name}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">
                  {chapter.slug === "discover" &&
                    "Find the work slowing your business down."}
                  {chapter.slug === "build" &&
                    "Turn the right opportunities into working AI and automation."}
                  {chapter.slug === "optimize" &&
                    "Measure the impact, improve what works, and find the next opportunity."}
                </p>
                <p className="mt-6 text-sm font-medium text-navy">
                  {chapter.action}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <BrandSummary />

      <section className="border-y border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-navy md:text-3xl">
            Your next automation opportunity may already be hiding inside the
            work your team does every day.
          </h2>
          <BusyworkEntryLink
            from="how-it-works"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            End Your Busy Work
          </BusyworkEntryLink>
        </div>
      </section>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How It Works", path: "/how-it-works" },
        ])}
      />
    </>
  );
}
