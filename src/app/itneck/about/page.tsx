import type { Metadata } from "next";
import Image from "next/image";
import { CtaBanner, Eyebrow, Section } from "@/components/ui";
import { ItneckNapBlock } from "@/components/itneck/NapBlock";
import { aboutContent } from "@/lib/itneck/about";
import { itneckAbsoluteUrl, itneckSite } from "@/lib/itneck/site";

export const metadata: Metadata = {
  title: "About YOU",
  description:
    "You're the kind of leader who's not afraid to invest in doing things right. Welcome to ITneck — IT that works, so you can.",
  alternates: { canonical: itneckAbsoluteUrl("/about") },
  openGraph: {
    title: "About YOU | ITneck",
    url: itneckAbsoluteUrl("/about"),
  },
};

export default function ItneckAboutPage() {
  const c = aboutContent;
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>About YOU</Eyebrow>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-cloud md:text-5xl">
              {c.hero.heading}
            </h1>
            {c.hero.paragraphs.map((p) => (
              <p key={p} className="mt-5 text-lg leading-relaxed text-graphite">
                {p}
              </p>
            ))}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface">
            <Image
              src="/itneck/about/hero.jpg"
              alt="About ITneck"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </Section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h2 className="font-display text-3xl font-semibold text-cloud">
            {c.focus.heading}
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-graphite">
            {c.focus.body}
          </p>
          <p className="mt-6 font-display text-xl font-semibold text-cloud">
            {c.focus.welcome}
          </p>
          <p className="mt-2 text-graphite">{c.focus.tagline}</p>
        </div>
      </section>

      <Section>
        <h2 className="font-display text-3xl font-semibold text-cloud">
          {c.building.heading}
        </h2>
        {c.building.paragraphs.map((p) => (
          <p key={p} className="mt-4 max-w-3xl leading-relaxed text-graphite">
            {p}
          </p>
        ))}
        <h3 className="mt-12 font-display text-2xl font-semibold text-cloud">
          {c.wants.heading}
        </h3>
        <p className="mt-4 max-w-3xl leading-relaxed text-graphite">
          {c.wants.intro}
        </p>
        <p className="mt-6 font-medium text-navy">You want:</p>
        <ul className="mt-3 space-y-2 text-graphite">
          {c.wants.youWant.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-cyan" aria-hidden>
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-medium text-navy">{c.wants.closer}</p>
      </Section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
            {c.motto}
          </p>
          <h2 className="mt-4 font-display text-2xl font-semibold text-cloud">
            {c.planning}
          </h2>
          <p className="mt-2 font-mono text-sm uppercase tracking-widest text-amber">
            {c.love}
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {c.counters.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-2xl font-semibold text-cloud">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs uppercase tracking-wide text-graphite">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-cloud">
              {c.history.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-graphite">{c.history.body}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-cloud">
              {c.expertise.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-graphite">
              {c.expertise.body}
            </p>
          </div>
        </div>
        <aside className="mt-12 border-t border-line pt-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">
            Reach us
          </h2>
          <ItneckNapBlock className="mt-4" />
          <ul className="mt-6 flex flex-wrap gap-4 text-sm">
            <li>
              <a
                href={itneckSite.instagram}
                className="text-navy underline underline-offset-4 hover:text-cyan"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={itneckSite.linkedin}
                className="text-navy underline underline-offset-4 hover:text-cyan"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={itneckSite.x}
                className="text-navy underline underline-offset-4 hover:text-cyan"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
            </li>
            <li>
              <a
                href={`mailto:${itneckSite.email}`}
                className="text-navy underline underline-offset-4 hover:text-cyan"
              >
                Email
              </a>
            </li>
          </ul>
        </aside>
      </Section>

      <CtaBanner
        heading="Ready to stop chasing fixes?"
        href="/itneck/contact"
        ctaLabel="Contact us"
      />
    </>
  );
}
