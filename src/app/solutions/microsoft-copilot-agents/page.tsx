import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, productIcons } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner, Eyebrow, Section } from "@/components/ui";
import { copilotProducts } from "@/lib/copilot-agents";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Microsoft Copilot Agent Development",
  description:
    "ai.neck builds custom Copilot agents in Copilot Studio for SharePoint, Teams, OneDrive, Outlook, and Microsoft 365 — deployed where your team works.",
  alternates: { canonical: absoluteUrl("/solutions/microsoft-copilot-agents") },
  openGraph: {
    title: "Microsoft Copilot Agent Development | ai.neck",
    description:
      "Custom Copilot agents for SharePoint, Teams, OneDrive, Outlook, and Microsoft 365 — built in Copilot Studio, deployed where your team works.",
    url: absoluteUrl("/solutions/microsoft-copilot-agents"),
  },
};

export default function CopilotAgentsHubPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Microsoft Copilot Agents</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          Copilot agents that live inside your Microsoft 365 stack.
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-graphite">
          We design agents in Microsoft Copilot Studio, integrate them through
          Power Automate and the Power Platform, and deploy them inside the
          apps your employees already work in. The agent inherits your
          existing permissions and licensing — your team gets AI without
          learning a new tool.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {[
            "Built in Copilot Studio",
            "Integrated via Power Platform",
            "Grounded in your data via Microsoft Graph",
            "Your permission model, enforced",
          ].map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 text-sm text-navy/90"
            >
              <CheckIcon className="shrink-0 text-cyan" /> {point}
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0" aria-label="Copilot agents by product">
        <div className="divide-y divide-line">
          {copilotProducts.map((product) => {
            const Icon = productIcons[product.icon];
            return (
              <Link
                key={product.slug}
                href={`/solutions/microsoft-copilot-agents/${product.slug}`}
                className="group grid gap-4 py-10 first:pt-0 last:pb-0 md:grid-cols-[1fr_1.2fr]"
              >
                <div>
                  <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan">
                    <Icon width={16} height={16} /> {product.short} · Connected
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-navy">
                    {product.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">
                    {product.whatWeBuild}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-navy group-hover:text-cyan">
                    {product.name} agents in depth
                    <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
                <ul className="space-y-2 self-center">
                  {product.useCases.map((uc) => (
                    <li
                      key={uc.name}
                      className="flex items-start gap-2 text-sm text-navy/90"
                    >
                      <CheckIcon className="mt-0.5 shrink-0 text-cyan" />
                      {uc.name}
                    </li>
                  ))}
                </ul>
              </Link>
            );
          })}
        </div>
      </Section>

      <CtaBanner heading="Which of these would move the needle first for your team?" />
      <JsonLd
        data={serviceSchema({
          name: "Microsoft Copilot Agent Development",
          description:
            "Design, development, and deployment of custom Microsoft Copilot agents for SharePoint, Teams, OneDrive, Outlook, and Microsoft 365.",
          path: "/solutions/microsoft-copilot-agents",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          {
            name: "Microsoft Copilot Agents",
            path: "/solutions/microsoft-copilot-agents",
          },
        ])}
      />
    </>
  );
}
