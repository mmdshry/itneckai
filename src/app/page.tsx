import type { Metadata } from "next";
import Link from "next/link";
import { AgentGraph } from "@/components/AgentGraph";
import { ArrowRightIcon, CheckIcon, productIcons } from "@/components/icons";
import { CtaBanner, Eyebrow, GhostCta, PrimaryCta, Section } from "@/components/ui";
import { copilotProducts } from "@/lib/copilot-agents";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "ITneck AI | Microsoft Copilot Agents & AI Solutions",
  description:
    "ITneck AI builds custom AI solutions and Microsoft Copilot agents that work inside SharePoint, Teams, OneDrive, Outlook, and Microsoft 365. San Diego, CA.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "ITneck AI | Microsoft Copilot Agents & AI Solutions",
    description:
      "Custom AI solutions with specialized depth in Microsoft Copilot Studio — agents that work inside the tools your team already uses.",
    url: absoluteUrl("/"),
  },
};

const generalSolutions = [
  {
    name: "Custom AI Agents",
    href: "/solutions",
    description:
      "Purpose-built agents for your specific workflows — grounded in your data, deployed where the work happens.",
  },
  {
    name: "Process Automation",
    href: "/solutions",
    description:
      "AI-driven automation for the repetitive work between systems: intake, routing, classification, reporting.",
  },
  {
    name: "AI Integration & Data",
    href: "/solutions",
    description:
      "Connecting AI to your actual data sources safely — pipelines, retrieval, and governance done right.",
  },
  {
    name: "Microsoft Copilot Agents",
    href: "/solutions/microsoft-copilot-agents",
    description:
      "Our deepest specialty: agents built in Copilot Studio that live inside SharePoint, Teams, OneDrive, Outlook, and Microsoft 365.",
    featured: true,
  },
];

const processSteps = [
  {
    name: "Discovery & Audit",
    description:
      "We map your Microsoft 365 tenant, data sources, and the workflows where AI creates measurable leverage — and where it doesn't.",
  },
  {
    name: "Agent Design in Copilot Studio",
    description:
      "We design and build the agent: knowledge grounding, conversation flows, actions, and the permission model it must respect.",
  },
  {
    name: "Integration & Testing",
    description:
      "The agent is wired into your stack via Power Automate and Microsoft Graph, then tested against real scenarios with your team.",
  },
  {
    name: "Deployment & Training",
    description:
      "We deploy to production, train your people, and hand over documentation — with support as usage grows.",
  },
];

const industries = [
  "Professional Services",
  "Healthcare Administration",
  "Finance Operations",
  "Manufacturing",
  "Legal",
  "Construction & Real Estate",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(52,214,196,0.08),transparent_60%)]"
        />
        <Section className="grid items-center gap-12 pt-32 md:grid-cols-2 md:pt-40">
          <div>
            <Eyebrow>AI Solutions · Microsoft Copilot Specialists</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-cloud sm:text-5xl lg:text-6xl">
              AI That Works Inside the Tools You Already Use.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-graphite">
              ITneck AI designs, builds, and deploys custom AI solutions — with
              specialized depth in Microsoft Copilot Studio. Agents that live
              inside SharePoint, Teams, OneDrive, Outlook, and Microsoft 365.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PrimaryCta href="/contact">Book a Consultation</PrimaryCta>
              <GhostCta href="/solutions/microsoft-copilot-agents">
                See Copilot Agent Solutions
              </GhostCta>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <AgentGraph />
          </div>
        </Section>

        {/* Trust bar */}
        <div className="border-y border-line bg-surface/60">
          <p className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-4 font-mono text-xs uppercase tracking-widest text-graphite sm:px-6">
            <span className="text-cyan">Built on</span>
            <span>Microsoft 365</span>
            <span>Copilot Studio</span>
            <span>Power Platform</span>
            <span>Azure AI</span>
            <span>Microsoft Graph</span>
          </p>
        </div>
      </div>

      {/* Solutions overview */}
      <Section aria-labelledby="solutions-heading">
        <Eyebrow>What we do</Eyebrow>
        <h2
          id="solutions-heading"
          className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-cloud md:text-4xl"
        >
          Every AI problem. One partner.
        </h2>
        <p className="mt-4 max-w-2xl text-graphite">
          ITneck AI solves AI problems broadly — automation, custom tooling,
          data and AI integration — for companies of any size. And we go
          deepest where it matters most for Microsoft-native businesses.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {generalSolutions.map((s) => (
            <li key={s.name}>
              <Link
                href={s.href}
                className={`group block h-full rounded-lg border p-6 transition-all hover:-translate-y-1 ${
                  s.featured
                    ? "border-cyan/50 bg-surface hover:border-cyan"
                    : "border-line bg-surface/50 hover:border-cyan/50"
                }`}
              >
                <h3 className="flex items-center justify-between font-display text-xl font-semibold text-cloud">
                  {s.name}
                  <ArrowRightIcon className="text-cyan opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite">
                  {s.description}
                </p>
                {s.featured && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan">
                    <CheckIcon width={12} height={12} /> Core specialty
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Copilot agent solutions — the differentiator */}
      <div className="border-y border-line bg-surface/40">
        <Section aria-labelledby="copilot-heading">
          <Eyebrow>Microsoft Copilot Agent Solutions</Eyebrow>
          <h2
            id="copilot-heading"
            className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-cloud md:text-4xl"
          >
            Agents built in Copilot Studio, deployed where your employees
            already work.
          </h2>
          <p className="mt-4 max-w-3xl text-graphite">
            We design agents in Microsoft Copilot Studio, integrate them
            through Power Automate and the Power Platform, and deploy them
            inside the Microsoft 365 apps your team opens every morning. No
            new tool to learn. No rip-and-replace.
          </p>

          <div className="mt-12 space-y-6">
            {copilotProducts.map((product) => {
              const Icon = productIcons[product.icon];
              return (
                <article
                  key={product.slug}
                  className="grid gap-6 rounded-lg border border-line bg-navy p-6 transition-colors hover:border-cyan/40 md:grid-cols-[1fr_1.2fr] md:p-8"
                >
                  <div>
                    <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan">
                      <Icon width={16} height={16} /> {product.short} ·
                      Connected
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold text-cloud">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-graphite">
                      {product.whatWeBuild}
                    </p>
                    <Link
                      href={`/solutions/microsoft-copilot-agents/${product.slug}`}
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-cyan hover:underline"
                    >
                      {product.name} Copilot agents
                      <ArrowRightIcon />
                    </Link>
                  </div>
                  <ul className="space-y-3 self-center">
                    {product.useCases.map((uc) => (
                      <li key={uc.name} className="flex items-start gap-3">
                        <CheckIcon className="mt-1 shrink-0 text-cyan" />
                        <span className="text-sm text-cloud/90">
                          <strong className="font-medium">{uc.name}.</strong>{" "}
                          <span className="text-graphite">{uc.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </Section>
      </div>

      {/* Process */}
      <Section aria-labelledby="process-heading">
        <Eyebrow>How it works</Eyebrow>
        <h2
          id="process-heading"
          className="mt-3 font-display text-3xl font-semibold tracking-tight text-cloud md:text-4xl"
        >
          From audit to deployed agent.
        </h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-4">
          {processSteps.map((step, i) => (
            <li
              key={step.name}
              className="rounded-lg border border-line bg-surface/50 p-6"
            >
              <p className="font-mono text-xs text-cyan">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-cloud">
                {step.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Industries */}
      <div className="border-y border-line bg-surface/40">
        <Section aria-labelledby="industries-heading">
          <Eyebrow>Who we serve</Eyebrow>
          <h2
            id="industries-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-cloud md:text-4xl"
          >
            Built for teams that already run on Microsoft 365.
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {industries.map((industry) => (
              <li
                key={industry}
                className="rounded-lg border border-line bg-navy px-5 py-4 text-sm text-cloud/90"
              >
                {industry}
              </li>
            ))}
          </ul>
          <Link
            href="/industries"
            className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-cyan hover:underline"
          >
            See how we work with your industry
            <ArrowRightIcon />
          </Link>
        </Section>
      </div>

      {/* Proof / case studies placeholder */}
      <Section aria-labelledby="proof-heading">
        <Eyebrow>Proof</Eyebrow>
        <h2
          id="proof-heading"
          className="mt-3 font-display text-3xl font-semibold tracking-tight text-cloud md:text-4xl"
        >
          Results, not demos.
        </h2>
        <p className="mt-4 max-w-2xl text-graphite">
          Case studies are being prepared with client approval. In the
          meantime, we&apos;re happy to walk you through anonymized examples of
          deployed agents on a call.
        </p>
        <div className="mt-8">
          <GhostCta href="/case-studies">View Case Studies</GhostCta>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
