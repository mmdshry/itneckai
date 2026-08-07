import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner, Eyebrow, Section } from "@/components/ui";
import { solutionHubs } from "@/lib/itneck/solutions";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Fully managed IT, cybersecurity, cloud, network, AI, and hardware & software solutions from ITneck.",
  alternates: { canonical: itneckAbsoluteUrl("/solutions") },
};

export default function SolutionsHubPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Solutions</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          Solutions
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-graphite">
          From fully managed IT to cybersecurity, cloud, network, AI, and
          hardware — services tailored to keep your business simple and safe.
        </p>
        <ul className="mt-14 space-y-12">
          {solutionHubs.map((hub) => (
            <li key={hub.slug} className="border-t border-line pt-10">
              <Link
                href={`/itneck/solutions/${hub.slug}`}
                className="font-display text-2xl font-semibold text-cloud hover:text-cyan"
              >
                {hub.title}
              </Link>
              <p className="mt-3 max-w-3xl text-graphite">{hub.description}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {hub.leaves.map((leaf) => (
                  <li key={leaf.slug}>
                    <Link
                      href={`/itneck/solutions/${hub.slug}/${leaf.slug}`}
                      className="block border border-line bg-page px-4 py-3 text-sm text-navy transition-colors hover:border-navy/30 hover:bg-surface hover:text-cyan"
                    >
                      {leaf.title}
                      {leaf.badge ? (
                        <span className="ml-2 font-mono text-[10px] uppercase text-amber">
                          {leaf.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBanner
        heading="Let's find the right solution for your business"
        href="/itneck/contact"
        ctaLabel="Contact us"
      />
    </>
  );
}
