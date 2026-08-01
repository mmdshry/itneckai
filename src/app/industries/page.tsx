import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner, Eyebrow, Section } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "ai.neck builds Microsoft Copilot agents and AI solutions for professional services, healthcare admin, finance ops, manufacturing, legal, and more.",
  alternates: { canonical: absoluteUrl("/industries") },
  openGraph: {
    title: "Industries We Serve | ai.neck",
    description:
      "AI solutions and Microsoft Copilot agents for professional services, healthcare administration, finance operations, manufacturing, and more.",
    url: absoluteUrl("/industries"),
  },
};

const industries = [
  {
    name: "Professional Services",
    description:
      "Consulting, accounting, and agency work runs on documents, email, and deadlines. Agents that prep client briefings from Outlook and SharePoint, answer from engagement archives, and automate intake give billable staff their hours back.",
  },
  {
    name: "Healthcare Administration",
    description:
      "For the administrative side of healthcare — scheduling, credentialing, policy compliance — agents that answer from current policy documents and route requests correctly reduce errors where errors are expensive.",
  },
  {
    name: "Finance Operations",
    description:
      "Close processes, reconciliations, and audit prep involve chasing the same documents and status updates every cycle. Agents that assemble reporting from across the Graph and triage exception queues shorten every close.",
  },
  {
    name: "Manufacturing",
    description:
      "SOPs, quality documentation, and maintenance records live in SharePoint but rarely reach the floor. Agents that answer procedural questions in Teams — grounded in the current controlled document — close that gap.",
  },
  {
    name: "Legal",
    description:
      "Matter files, precedent documents, and correspondence are exactly the kind of permission-sensitive content Copilot agents handle well: answers grounded in what the asking user is allowed to see, with sources cited.",
  },
  {
    name: "Construction & Real Estate",
    description:
      "Project documentation, RFIs, and vendor correspondence scattered across mail and file shares become answerable when an agent can read across the project's Microsoft 365 footprint.",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Industries</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          If your business runs on Microsoft 365, we speak your language.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-graphite">
          The common thread across our clients isn&apos;t a vertical — it&apos;s
          a stack. Teams that already live in SharePoint, Teams, and Outlook
          get value from agents fastest, because there&apos;s nothing new to
          roll out.
        </p>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-10 md:grid-cols-2">
          {industries.map((industry) => (
            <article key={industry.name}>
              <h2 className="font-display text-xl font-semibold text-navy">
                {industry.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-graphite">
                {industry.description}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm text-graphite">
          Don&apos;t see your industry? The pattern matters more than the
          label — see{" "}
          <Link
            href="/solutions"
            className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
          >
            what we build
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
          >
            tell us about your stack
          </Link>
          .
        </p>
      </Section>

      <CtaBanner heading="Want to know what an agent would do in your industry?" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ])}
      />
    </>
  );
}
