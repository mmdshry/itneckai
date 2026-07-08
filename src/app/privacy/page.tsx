import type { Metadata } from "next";
import { Eyebrow, Section } from "@/components/ui";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ITneck AI handles the information you share with us: what we collect through the contact form, how we use it, and how to reach us about it.",
  alternates: { canonical: absoluteUrl("/privacy") },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <Section className="pt-32 md:pt-40">
      <Eyebrow>Privacy</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
        Privacy Policy
      </h1>
      <div className="mt-8 max-w-3xl space-y-8 leading-relaxed text-graphite">
        <p className="text-sm">Last updated: July 2026</p>

        <section>
          <h2 className="font-display text-xl font-semibold text-cloud">
            What we collect
          </h2>
          <p className="mt-3">
            When you submit our contact form, we collect the information you
            provide: your name, work email, company, optional phone number,
            and your message. We do not collect this information from any
            other source, and we do not buy or sell contact data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-cloud">
            How we use it
          </h2>
          <p className="mt-3">
            Contact form submissions are emailed to our team and used solely
            to respond to your inquiry and, if you engage us, to deliver our
            services. We do not add you to marketing lists without your
            explicit consent, and we do not share your information with third
            parties except the email delivery provider that transmits your
            message to us.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-cloud">
            Cookies and analytics
          </h2>
          <p className="mt-3">
            This site does not set advertising or tracking cookies. If we
            adopt analytics, we use privacy-first tooling configured without
            cross-site tracking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-cloud">
            Your choices
          </h2>
          <p className="mt-3">
            You can ask us to delete any information you&apos;ve submitted by
            emailing{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
            >
              {site.email}
            </a>{" "}
            or calling{" "}
            <a
              href={`tel:${site.phoneIntl}`}
              className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
            >
              {site.phone}
            </a>
            . We&apos;ll confirm the deletion within ten business days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-cloud">
            Contact
          </h2>
          <p className="mt-3">
            {site.name}, {site.address}. Questions about this policy can go to{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
            >
              {site.email}
            </a>
            .
          </p>
        </section>
      </div>
    </Section>
  );
}
