import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow, Section } from "@/components/ui";
import { ItneckContactForm } from "./ContactForm";
import { ItneckNapBlock } from "@/components/itneck/NapBlock";
import {
  itneckTopicByQuery,
  type ItneckCtaQuery,
} from "@/lib/itneck/cta";
import { itneckHelpTopics } from "@/lib/itneck/contact-schema";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";
import { contactFaqs } from "@/lib/itneck/support";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk with an Advisor about managed IT, cybersecurity, AI, backup, or technology strategy.",
  alternates: { canonical: itneckAbsoluteUrl("/contact") },
};

function resolveTopic(
  raw?: string,
): (typeof itneckHelpTopics)[number] | undefined {
  if (!raw) return undefined;
  if ((itneckHelpTopics as readonly string[]).includes(raw)) {
    return raw as (typeof itneckHelpTopics)[number];
  }
  if (raw in itneckTopicByQuery) {
    return itneckTopicByQuery[raw as ItneckCtaQuery];
  }
  return undefined;
}

export default async function ItneckContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const defaultTopic = resolveTopic(topic);

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          Talk with an Advisor
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-graphite">
          Tell us where technology is slowing the business down. We&apos;ll
          help you decide what to fix first.
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <ItneckContactForm defaultTopic={defaultTopic} />
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
