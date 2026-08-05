import type {Metadata} from "next";
import {JsonLd} from "@/components/JsonLd";
import {NapBlock} from "@/components/NapBlock";
import {Eyebrow, Section} from "@/components/ui";
import {breadcrumbSchema} from "@/lib/schema";
import {absoluteUrl} from "@/lib/site";
import {ContactForm} from "./ContactForm";

export const metadata: Metadata = {
    title: "Contact Us — Book a working session",
  description:
      "Book a working session with ai.neck. Tell us about your Microsoft 365 stack and where a Copilot Studio agent would earn its keep — we typically reply within one business day. San Diego, CA.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
      title: "Contact Us — Book a working session | ai.neck",
    description:
        "Tell us about your Microsoft 365 stack and where a Copilot Studio agent would earn its keep. We typically reply within one business day.",
    url: absoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          Tell us what&apos;s not working yet.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-graphite">
          The first conversation is a working session: your stack, your
          workflows, and where an agent would earn its keep. No slide deck.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
              <h2 className="sr-only">Working session request form</h2>
            <ContactForm />
          </div>

          <aside
            aria-label="Direct contact information"
            className="h-fit border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
          >
            <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">
              Prefer to reach out directly?
            </h2>
            <NapBlock className="mt-5" />
            <p className="mt-6 border-t border-line pt-5 text-sm text-graphite">
              Phone and email reach a person, not a queue. If you email us,
              include your Microsoft 365 setup and what you&apos;re trying to
              automate — it makes the first call twice as useful.
            </p>
          </aside>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </>
  );
}
