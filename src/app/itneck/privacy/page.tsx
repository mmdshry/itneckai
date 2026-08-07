import type { Metadata } from "next";
import { Eyebrow, Section } from "@/components/ui";
import { privacySections } from "@/lib/itneck/support";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for ITNECK — how we protect your privacy and personal information.",
  alternates: { canonical: itneckAbsoluteUrl("/privacy") },
};

export default function ItneckPrivacyPage() {
  return (
    <Section className="pt-32 md:pt-40">
      <Eyebrow>Legal</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-graphite">
        At ITNECK, we are committed to protecting your privacy and the personal
        information you provide while using our website.
      </p>
      <div className="mt-12 max-w-3xl space-y-10">
        {privacySections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-xl font-semibold text-cloud">
              {section.heading}
            </h2>
            <p className="mt-3 leading-relaxed text-graphite">{section.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
