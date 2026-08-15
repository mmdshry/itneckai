import type { Metadata } from "next";
import Link from "next/link";
import { DualCtas } from "@/components/itneck/DualCtas";
import { Eyebrow, Section } from "@/components/ui";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";
import { solutionHubs } from "@/lib/itneck/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Managed IT Services, Cybersecurity & Compliance, AI & Automation, Backup & Business Continuity, and Technology Strategy & Transformation.",
  alternates: { canonical: itneckAbsoluteUrl("/solutions") },
};

export default function SolutionsHubPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Solutions</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-6xl">
          Solutions
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">
          We simplify and secure your technology, so your team can stay focused,
          productive, and moving forward.
        </p>
        <ul className="mt-16 divide-y divide-line border-y border-line">
          {solutionHubs.map((hub) => (
            <li key={hub.slug}>
              <Link
                href={`/itneck/solutions/${hub.slug}`}
                className="group flex flex-col gap-3 py-10 md:flex-row md:items-baseline md:justify-between md:gap-12"
              >
                <h2 className="font-display text-2xl font-semibold tracking-tight text-cloud transition-colors group-hover:text-cyan md:text-4xl">
                  {hub.navLabel}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-graphite md:text-right">
                  {hub.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-14">
          <DualCtas
            primary={{ label: "Talk With an Advisor", query: "advisor" }}
            secondary={{
              label: "Request an IT Assessment",
              query: "it-assessment",
            }}
          />
        </div>
      </Section>
    </>
  );
}
