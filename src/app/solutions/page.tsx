import type {Metadata} from "next";
import Link from "next/link";
import {CheckIcon} from "@/components/icons";
import {JsonLd} from "@/components/JsonLd";
import {CtaBanner, Eyebrow, GhostCta, Section} from "@/components/ui";
import {breadcrumbSchema, serviceSchema} from "@/lib/schema";
import {absoluteUrl} from "@/lib/site";

export const metadata: Metadata = {
    title: "AI Solutions for Microsoft 365",
  description:
      "Custom agents in Microsoft Copilot Studio for SharePoint, Teams, OneDrive, Outlook, and Microsoft 365 — plus supporting automation and data integration. By ai.neck.",
  alternates: { canonical: absoluteUrl("/solutions") },
  openGraph: {
      title: "AI Solutions for Microsoft 365 | ai.neck",
    description:
        "Copilot Studio agents inside Microsoft 365, with supporting automation and data integration when the workflow needs them.",
    url: absoluteUrl("/solutions"),
  },
};

const solutions = [
  {
    name: "Custom AI Agents",
    description:
      "Agents designed around a specific job in your business: answering from your knowledge base, monitoring a process, handling intake. We define the scope, ground the agent in your data, and deploy it where the work already happens.",
    points: [
      "Scoped to one measurable workflow — not a vague 'AI assistant'",
      "Grounded in your documents and systems, with sources cited",
      "Deployed inside existing tools, not another browser tab",
    ],
  },
  {
    name: "Process Automation",
    description:
      "The repetitive work between systems is where AI pays for itself first. We automate intake, routing, classification, data entry, and reporting — with humans kept in the loop where judgment is required.",
    points: [
      "Document and email intake, classification, and routing",
      "Approval chains and status reporting without manual chasing",
      "Human review checkpoints built in from the start",
    ],
  },
  {
    name: "AI Integration & Data",
    description:
      "AI is only as good as the data it can reach. We build the retrieval pipelines, connectors, and governance that let AI answer from your real information — without leaking what it shouldn't.",
    points: [
      "Retrieval pipelines over your actual document stores and databases",
      "Permission models enforced at the retrieval layer",
      "Vendor-neutral advice: the right model for the job, not the loudest one",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Solutions</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
            Copilot Studio agents — and the work that makes them stick.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-graphite">
            Our deepest specialty is{" "}
          <Link
            href="/solutions/microsoft-copilot-agents"
            className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
          >
              Microsoft Copilot Studio agents
          </Link>{" "}
            inside SharePoint, Teams, OneDrive, Outlook, and Microsoft 365.
            Custom agents, process automation, and data integration support that
            same stack when a workflow needs more than a single agent.
        </p>
      </Section>

      <Section className="pt-0">
        <div className="divide-y divide-line">
          {solutions.map((s) => (
            <article
              key={s.name}
              className="grid gap-6 py-10 first:pt-0 md:grid-cols-[1.2fr_1fr]"
            >
              <div>
                <h2 className="font-display text-2xl font-semibold text-navy">
                  {s.name}
                </h2>
                <p className="mt-3 leading-relaxed text-graphite">
                  {s.description}
                </p>
              </div>
              <ul className="space-y-3 self-center">
                {s.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckIcon className="mt-1 shrink-0 text-cyan" />
                    <span className="text-sm text-navy/90">{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {/* Featured: Copilot agents */}
          <article className="py-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
              Core specialty
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-navy">
              Microsoft Copilot Agents
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-graphite">
              Agents built in Copilot Studio and integrated through the Power
              Platform, deployed inside SharePoint, Teams, OneDrive, Outlook,
                and Microsoft 365. This is where we go deepest — a dedicated page
                per Microsoft 365 surface.
            </p>
            <div className="mt-6">
              <GhostCta href="/solutions/microsoft-copilot-agents">
                  Explore Copilot Studio agents
              </GhostCta>
            </div>
          </article>
        </div>

        <p className="mt-10 text-sm text-graphite">
          Not sure which of these fits your problem?{" "}
          <Link
            href="/contact"
            className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
          >
            Talk to us
          </Link>{" "}
          — the first conversation is a working session, not a sales pitch.
          You can also see{" "}
          <Link
            href="/industries"
            className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
          >
            the industries we serve
          </Link>{" "}
          and{" "}
          <Link
            href="/case-studies"
            className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
          >
            our case studies
          </Link>
          .
        </p>
      </Section>

        <CtaBanner heading="Ready to map a Copilot Studio agent to your Microsoft 365 stack?"/>
      <JsonLd
        data={serviceSchema({
            name: "AI Solutions for Microsoft 365",
          description:
              "Custom agents in Microsoft Copilot Studio for SharePoint, Teams, OneDrive, Outlook, and Microsoft 365, with supporting automation and data integration.",
          path: "/solutions",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />
    </>
  );
}
