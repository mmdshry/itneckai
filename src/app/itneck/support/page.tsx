import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow, Section } from "@/components/ui";
import { supportLinks } from "@/lib/itneck/support";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

export const metadata: Metadata = {
  title: "Support",
  description:
    "ITneck client portal and remote support tools — Pulseway and Datto RMM for Windows and Mac.",
  alternates: { canonical: itneckAbsoluteUrl("/support") },
};

export default function ItneckSupportPage() {
  return (
    <Section className="pt-32 md:pt-40">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>Support</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
            Support
          </h1>
          <p className="mt-4 text-graphite">
            Access the client portal or download remote support agents to
            connect with our team.
          </p>
          <ul className="mt-10 space-y-3">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-line bg-page px-5 py-4 text-sm font-medium text-navy transition-colors hover:border-navy/30 hover:bg-surface hover:text-cyan"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface">
          <Image
            src="/itneck/support/window.jpg"
            alt="Remote support"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </Section>
  );
}
