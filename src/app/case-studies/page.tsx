import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRightIcon, CheckIcon} from "@/components/icons";
import {JsonLd} from "@/components/JsonLd";
import {CtaBanner, Eyebrow, GhostCta, Section} from "@/components/ui";
import {breadcrumbSchema} from "@/lib/schema";
import {absoluteUrl} from "@/lib/site";

export const metadata: Metadata = {
    title: "Documented Copilot Studio Patterns",
  description:
      "Three Copilot Studio discovery patterns ai.neck maps in the first working session: Policy Q&A, Teams approval, and Outlook meeting prep. Named case studies publish with client approval.",
  alternates: { canonical: absoluteUrl("/case-studies") },
  openGraph: {
      title: "Documented Copilot Studio Patterns | ai.neck",
    description:
        "Policy Q&A, Teams approval, and Outlook meeting prep — documented Microsoft patterns we walk through against your tenant.",
    url: absoluteUrl("/case-studies"),
  },
};

/*
  Honest proof until named case studies ship with client approval.
  Never fabricate client names, quotes, or metrics.
*/
const discoveryPatterns = [
  {
      name: "Policy Q&A",
      surface: "SharePoint + Copilot Studio",
      before: "Staff ping IT or HR with the same policy question every week.",
      after:
          "A Copilot Studio agent answers from the current SharePoint library, cites the source file, and inherits existing permissions.",
      outcome:
          "One authoritative answer instead of five stale copies — and fewer repeat tickets.",
      href: "/solutions/microsoft-copilot-agents/sharepoint",
  },
  {
      name: "Teams approval",
      surface: "Teams + Power Automate",
      before: "Purchase, access, and sign-off requests die in chat threads and inboxes.",
      after:
          "Requests land as Adaptive Cards in the channel where they came up; Power Automate runs the chain with an audit trail.",
      outcome:
          "Structured intake from the first message — no new portal for employees to forget.",
      href: "/solutions/microsoft-copilot-agents/teams",
  },
  {
      name: "Outlook meeting prep",
      surface: "Outlook + Microsoft Graph",
      before: "Meeting prep is a late-night scramble across mail and linked files.",
      after:
          "A Copilot Studio agent for Outlook assembles a Graph-grounded brief from permitted mail and documents before you walk in.",
      outcome:
          "Prep happens automatically; judgment stays with the human who reviews and sends.",
      href: "/solutions/microsoft-copilot-agents/outlook",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
          <Eyebrow>Documented patterns</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
            See documented Microsoft patterns — not invented metrics.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-graphite">
            Named client case studies publish only with approval and only with
            real numbers. Until then, these are the three Copilot Studio patterns
            we map in the first working session against your Microsoft 365 tenant.
        </p>
      </Section>

        <Section className="pt-0" aria-label="Discovery patterns">
        <div className="divide-y divide-line">
            {discoveryPatterns.map((pattern) => (
                <article key={pattern.name} className="py-10 first:pt-0">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                        {pattern.surface}
              </p>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-navy">
                        {pattern.name}
                    </h2>
                    <dl className="mt-6 grid gap-4 md:grid-cols-2">
                        <div>
                            <dt className="font-mono text-[10px] uppercase tracking-widest text-graphite">
                                Before
                            </dt>
                            <dd className="mt-2 text-sm leading-relaxed text-graphite">
                                {pattern.before}
                            </dd>
                        </div>
                        <div>
                            <dt className="font-mono text-[10px] uppercase tracking-widest text-graphite">
                                After
                            </dt>
                            <dd className="mt-2 text-sm leading-relaxed text-graphite">
                                {pattern.after}
                            </dd>
                        </div>
                    </dl>
                    <p className="mt-4 flex items-start gap-3 text-sm text-navy/90">
                        <CheckIcon className="mt-0.5 shrink-0 text-cyan"/>
                        {pattern.outcome}
              </p>
                    <Link
                        href={pattern.href}
                        className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-navy hover:text-cyan"
                    >
                        Copilot Studio agents for this surface
                        <ArrowRightIcon/>
                    </Link>
            </article>
          ))}
        </div>
            <div className="mt-10">
                <GhostCta href="/contact">Book a working session</GhostCta>
        </div>
      </Section>

        <CtaBanner heading="Want to map these patterns to your tenant?"/>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
        ])}
      />
    </>
  );
}
