import type { Metadata } from "next";
import { BrandSummary } from "@/components/BrandSummary";
import { JsonLd } from "@/components/JsonLd";
import { TeamGrid } from "@/components/TeamGrid";
import { Eyebrow, Section } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

const approach = [
  "We do not arrive with a predetermined solution.",
  "We listen for the operational pain before we talk about technology.",
  "We watch how the work actually gets done, not only how the document describes it.",
  "We ask the people doing the work what slows them down, not only the executives.",
  "We turn a vague frustration into time, cost, and delay you can measure.",
  "We challenge unnecessary steps before we automate them.",
  "We recommend doing nothing when automation does not make business sense.",
  "We design for adoption, not only for a technical finish.",
  "We measure the outcome after people are using the workflow.",
  "We keep looking for the next place to return time.",
] as const;

const questions = [
  "What problem did we remove?",
  "How much time, friction, or cost did we reduce?",
  "What new capacity did we create?",
  "What should we improve next?",
] as const;

export const metadata: Metadata = {
  title: "Team",
  description:
    "Ai.neck brings technology, automation, and operational thinking to the way work actually happens.",
  alternates: { canonical: absoluteUrl("/team") },
  openGraph: {
    title: "Team | Ai.neck",
    description:
      "Technology should understand the business before it tries to change it.",
    url: absoluteUrl("/team"),
  },
};

export default function TeamPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Team</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          Technology should understand the business before it tries to change it.
        </h1>
        <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-graphite">
          <p>
            Ai.neck brings together technology, automation, AI, and operational
            thinking to solve real business problems.
          </p>
          <p>
            We work alongside leadership and employees to understand how work
            actually happens, then design practical solutions that fit the
            business.
          </p>
        </div>
        <TeamGrid />
      </Section>

      <Section className="pt-0" aria-labelledby="approach-title">
        <h2
          id="approach-title"
          className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-navy"
        >
          How we approach your problems
        </h2>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {approach.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-graphite">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0" aria-labelledby="standard-title">
        <h2
          id="standard-title"
          className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-navy"
        >
          Every engagement answers four questions
        </h2>
        <p className="mt-4 max-w-2xl text-graphite">
          The standard is not whether we delivered an AI solution. The standard
          is whether the business is measurably better because of it.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {questions.map((question, index) => (
            <li key={question} className="rounded-lg border border-line p-5">
              <p className="font-mono text-xs text-cyan">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 font-display text-lg font-semibold text-navy">
                {question}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <BrandSummary />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Team", path: "/team" },
        ])}
      />
    </>
  );
}
