import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow, Section } from "@/components/ui";
import { ItneckNapBlock } from "@/components/itneck/NapBlock";
import { ItneckContactForm } from "./ContactForm";
import { contactFaqs } from "@/lib/itneck/support";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Need help with your IT systems? Let's talk — your solution is just one message away. We help businesses grow with smarter IT solutions.",
  alternates: { canonical: itneckAbsoluteUrl("/contact") },
};

export default function ItneckContactPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Contact us</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          Need help with your IT systems? Let&apos;s talk
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-graphite">
          Your solution is just one message away. We help businesses grow with
          smarter IT solutions.
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <ItneckContactForm />
          </div>
          <div>
            <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-md bg-surface">
              <Image
                src="/itneck/contact/visual.png"
                alt=""
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <ItneckNapBlock />
          </div>
        </div>
      </Section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <Eyebrow>Process of reaching out and getting IT support</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold text-cloud">
            Frequently Asked Questions
          </h2>
          <ul className="mt-10 space-y-4">
            {contactFaqs.map((faq) => (
              <li key={faq.q} className="border border-line bg-page p-5">
                <details>
                  <summary className="cursor-pointer font-display text-lg font-semibold text-cloud">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">
                    {faq.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
