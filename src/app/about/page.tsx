import type {Metadata} from "next";
import Link from "next/link";
import {JsonLd} from "@/components/JsonLd";
import {NapBlock} from "@/components/NapBlock";
import {CtaBanner, Eyebrow, Section} from "@/components/ui";
import {breadcrumbSchema} from "@/lib/schema";
import {absoluteUrl} from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
      "ai.neck is a San Diego AI company that builds custom agents in Microsoft Copilot Studio for SharePoint, Teams, OneDrive, Outlook, and Microsoft 365.",
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    title: "About Us | ai.neck",
    description:
        "San Diego-based Copilot Studio specialists — agents grounded in Microsoft 365 and delivered inside the apps your team already uses.",
    url: absoluteUrl("/about"),
  },
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          About ai.neck
        </h1>
        <div className="mt-8 grid gap-12 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-graphite">
            <p>
                ai.neck is a San Diego, California-based AI company built for one
                purpose: making AI useful inside the software companies already
                run on. Our core work is designing, building, and deploying
                Copilot Studio agents across SharePoint, Teams, OneDrive,
                Microsoft 365, and Outlook — grounded in your tenant, with your
                permissions enforced. When a workflow needs adjacent automation
                or data integration, we handle that too.
            </p>
            <p>
              Our team works directly with your IT and operations leaders to
                identify where an agent creates real leverage, then builds it —
                no rip-and-replace, no new tool for employees to learn.
            </p>
            <p className="text-base">
              Curious what that looks like in practice? Start with{" "}
              <Link
                href="/solutions/microsoft-copilot-agents"
                className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
              >
                  our Copilot Studio agents
              </Link>{" "}
              or{" "}
              <Link
                href="/contact"
                className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
              >
                  book a working session
              </Link>
              .
            </p>
          </div>

          <aside
            aria-label="Contact information"
            className="h-fit border-t border-line pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0"
          >
            <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">
              Reach us
            </h2>
            <NapBlock className="mt-4" />
          </aside>
        </div>
      </Section>

      <CtaBanner />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
    </>
  );
}
