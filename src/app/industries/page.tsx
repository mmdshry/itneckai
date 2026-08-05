import type {Metadata} from "next";
import Link from "next/link";
import {ArrowRightIcon, CheckIcon} from "@/components/icons";
import {JsonLd} from "@/components/JsonLd";
import {CtaBanner, Eyebrow, Section} from "@/components/ui";
import {industries} from "@/lib/industries";
import {breadcrumbSchema, serviceSchema} from "@/lib/schema";
import {absoluteUrl} from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
      "ai.neck builds Microsoft Copilot agents for healthcare, professional services, manufacturing, construction, government contractors, nonprofits, and SMBs.",
  alternates: { canonical: absoluteUrl("/industries") },
  openGraph: {
    title: "Industries We Serve | ai.neck",
    description:
        "Microsoft Copilot Studio agents for healthcare, professional services, manufacturing, construction (AEC), government contractors, nonprofits, and SMBs.",
    url: absoluteUrl("/industries"),
  },
};

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
            a stack. Teams that already live in SharePoint, Teams, Outlook,
            OneDrive, and Microsoft 365 get value from Copilot Studio agents
            fastest, because there&apos;s nothing new to roll out. Here&apos;s how
            priority patterns map to your industry — not a hard limit on what we
            can build.
        </p>
      </Section>

        <Section className="pt-0" aria-label="Industries we serve">
            <div className="divide-y divide-line">
          {industries.map((industry) => (
              <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="group grid gap-4 py-10 first:pt-0 last:pb-0 md:grid-cols-[1fr_1.2fr]"
              >
                  <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                          {industry.short} · {industry.buyer}
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-semibold text-navy">
                          {industry.name}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-graphite">
                          {industry.hook}
                      </p>
                      <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-navy group-hover:text-cyan">
                          {industry.name} in depth
                          <ArrowRightIcon className="transition-transform group-hover:translate-x-1"/>
                      </p>
                  </div>
                  <ul className="flex flex-wrap content-center gap-2 self-center">
                      {industry.focusAreas.map((area) => (
                          <li
                              key={area.name}
                              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-navy/80"
                          >
                              <CheckIcon className="shrink-0 text-cyan"/>
                              {area.name}
                          </li>
                      ))}
                  </ul>
              </Link>
          ))}
        </div>
        <p className="mt-10 text-sm text-graphite">
            Don&apos;t see your industry? The pattern matters more than the label
            — see{" "}
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
            data={serviceSchema({
                name: "Industry Microsoft Copilot Agent Development",
                description:
                    "Design and deployment of Microsoft Copilot Studio agents for healthcare, professional services, manufacturing, construction, government contractors, nonprofits, and SMBs.",
                path: "/industries",
            })}
        />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ])}
      />
    </>
  );
}
