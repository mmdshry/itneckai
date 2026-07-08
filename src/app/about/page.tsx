import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { NapBlock } from "@/components/NapBlock";
import { CtaBanner, Eyebrow, Section } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ITneck AI is a San Diego, California-based AI solutions company specializing in Microsoft Copilot agents for SharePoint, Teams, OneDrive, and Outlook.",
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    title: "About Us | ITneck AI",
    description:
      "San Diego-based AI solutions company specializing in Microsoft Copilot agents across the Microsoft 365 ecosystem.",
    url: absoluteUrl("/about"),
  },
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          About ITneck AI
        </h1>
        <div className="mt-8 grid gap-12 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-graphite">
            <p>
              ITneck AI is a San Diego, California-based AI solutions company
              built for one purpose: making artificial intelligence actually
              useful inside the software companies already run on. We work
              across the full spectrum of AI-related challenges, and we go
              deepest where it matters most for Microsoft-native businesses —
              designing, building, and deploying Copilot agents across
              SharePoint, Teams, OneDrive, Microsoft 365, and Outlook.
            </p>
            <p>
              Our team works directly with your IT and operations leaders to
              identify where AI creates real leverage, then builds it — no
              rip-and-replace, no new tool for employees to learn.
            </p>
            <p className="text-base">
              Curious what that looks like in practice? Start with{" "}
              <Link
                href="/solutions/microsoft-copilot-agents"
                className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
              >
                our Copilot agent solutions
              </Link>{" "}
              or{" "}
              <Link
                href="/contact"
                className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
              >
                book a consultation
              </Link>
              .
            </p>
          </div>

          <aside
            aria-label="Contact information"
            className="h-fit rounded-lg border border-line bg-surface/50 p-6"
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
