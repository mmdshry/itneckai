import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner, Eyebrow, Section } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Results from ai.neck's Microsoft Copilot agent and AI solution deployments. Client case studies published as they are approved for release.",
  alternates: { canonical: absoluteUrl("/case-studies") },
  openGraph: {
    title: "Case Studies | ai.neck",
    description:
      "Results from ai.neck's Microsoft Copilot agent and AI deployments.",
    url: absoluteUrl("/case-studies"),
  },
};

/*
  PLACEHOLDER CONTENT — swap in real client data here as case studies are
  approved for publication. Never fabricate client names, quotes, or metrics.
  Each published case study should include: client industry & size, the
  problem, what was built (which apps, which agents), and measured outcomes.
*/
const placeholders = [
  {
    label: "Case study in preparation",
    summary:
      "A SharePoint knowledge agent deployment for a professional services firm. Publication pending client approval.",
  },
  {
    label: "Case study in preparation",
    summary:
      "A Teams-based approval workflow rollout for a finance operations team. Publication pending client approval.",
  },
  {
    label: "Case study in preparation",
    summary:
      "An Outlook triage and meeting-prep agent for an executive team. Publication pending client approval.",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Case Studies</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          Proof over promises.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-graphite">
          We publish case studies only with client approval and only with real
          numbers. The first set is being prepared now. Until then, we&apos;re
          glad to walk through anonymized deployments on a call.
        </p>
      </Section>

      <Section className="pt-0">
        <div className="divide-y divide-line">
          {placeholders.map((item, i) => (
            <article key={i} className="py-8 first:pt-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-graphite">
                {item.label}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
                {item.summary}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <CtaBanner heading="Want to hear the details before they're published?" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
        ])}
      />
    </>
  );
}
