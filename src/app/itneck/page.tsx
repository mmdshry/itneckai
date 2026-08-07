import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CtaBanner,
  Eyebrow,
  GhostCta,
  PrimaryCta,
  Section,
} from "@/components/ui";
import { ItneckNapBlock } from "@/components/itneck/NapBlock";
import {
  homeAdvantages,
  homeContactIntro,
  homeHero,
  homeNarrative,
  homePillars,
  homeServiceCards,
  homeServices,
  homeSocialProof,
  homeStatsBlock,
  homeTeam,
} from "@/lib/itneck/home";
import {
  clientPartners,
  technologyPartners,
  type Partner,
} from "@/lib/itneck/partners";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";
import { testimonials } from "@/lib/itneck/testimonials";

function PartnerGrid({ items }: { items: Partner[] }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {items.map((partner) => (
        <li key={partner.name}>
          <a
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-32 items-center justify-center border border-line bg-[#f5f7fa] px-5 transition-colors hover:border-navy/30${
              partner.forceLightTile ? "" : " dark:bg-black"
            }`}
            aria-label={`${partner.name} (opens in a new tab)`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={partner.logo}
              alt={partner.name}
              className={`max-h-20 w-full object-contain${
                partner.invertInDark ? " dark:invert" : ""
              }`}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

export const metadata: Metadata = {
  title: "Managed IT Services - Managed IT for Business",
  description:
    "We make tech easy to use and safe, so your team can work better without stress. Managed IT, cybersecurity, cloud, and network services in San Diego.",
  alternates: { canonical: itneckAbsoluteUrl() },
  openGraph: {
    title: "Keep Technology Simple and Safe | ITneck",
    description:
      "We simplify technology and keep it secure, so your team can stay focused, productive, and stress-free.",
    url: itneckAbsoluteUrl(),
  },
};

export default function ItneckHomePage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>{homeHero.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-cloud md:text-6xl">
              {homeHero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
              {homeHero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PrimaryCta href="/itneck/contact">Contact us</PrimaryCta>
              <GhostCta href="/itneck/solutions">View solutions</GhostCta>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface">
            <Image
              src="/itneck/home/corporate-laptop.png"
              alt="Technology that stays simple and safe"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </Section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {homePillars.map((pillar) => (
            <div key={pillar.title}>
              <h2 className="font-display text-xl font-semibold text-cloud">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-graphite">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <Eyebrow>2025</Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-cloud md:text-4xl">
          Keep Technology Simple and Secure
        </h2>
        <p className="mt-4 max-w-2xl text-graphite">
          We simplify technology and keep it secure, so your team can stay
          focused, productive, and stress-free.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeServices.map((s) => (
            <li key={s.abbr}>
              <Link
                href={s.href}
                className="block border border-line bg-page p-5 transition-colors hover:border-navy/30 hover:bg-surface"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                  {s.abbr}
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-cloud">
                  {s.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="!pt-0">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-cloud md:text-4xl">
              {homeNarrative.heading}
            </h2>
            <p className="mt-4 text-lg text-graphite">{homeNarrative.lead}</p>
            {homeNarrative.paragraphs.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-graphite">
                {p}
              </p>
            ))}
            <div className="mt-8">
              <GhostCta href="/itneck/about">View more</GhostCta>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface">
            <Image
              src="/itneck/home/corporate-people.png"
              alt="People working with technology that stays in the background"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 md:py-24">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-md">
            <Image
              src="/itneck/home/family.jpg"
              alt="Helping businesses and families"
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-cloud">
              {homeStatsBlock.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-graphite">
              {homeStatsBlock.body}
            </p>
            <p className="mt-4 font-medium text-navy">{homeStatsBlock.goal}</p>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {homeStatsBlock.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-sm text-graphite">{stat.label}</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-cloud">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <GhostCta href="/itneck/about">View more</GhostCta>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <Eyebrow>Advantages</Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-cloud">
          Advantages of becoming a client of our company.
        </h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeAdvantages.map((item, i) => (
            <li
              key={item}
              className="border border-line bg-page p-5"
            >
              <span className="font-mono text-xs text-cyan">{i + 1}.</span>
              <p className="mt-2 font-display text-lg font-semibold text-cloud">
                {item}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          it all starts with you.
        </p>
        <p className="mt-3 max-w-2xl text-lg text-graphite">
          We treat your business like our own — because your tech, your growth,
          and your peace of mind matter to us.
        </p>
      </Section>

      <Section className="!pt-0">
        <ul className="grid gap-6 md:grid-cols-2">
          {homeServiceCards.map((card) => (
            <li
              key={card.title}
              className="flex flex-col border border-line bg-page p-6"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                {card.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-cloud">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">
                {card.body}
              </p>
              <Link
                href={card.href}
                className="mt-5 text-sm font-medium text-navy underline decoration-line underline-offset-4 hover:text-cyan hover:decoration-cyan"
              >
                Learn more
              </Link>
            </li>
          ))}
        </ul>
        <dl className="mt-12 flex flex-wrap gap-10">
          {homeSocialProof.metrics.map((m) => (
            <div key={m.label}>
              <dt className="text-sm text-graphite">{m.label}</dt>
              <dd className="mt-1 font-display text-4xl font-semibold text-cloud">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
        <h2 className="mt-12 font-display text-2xl font-semibold text-cloud">
          {homeSocialProof.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-graphite">{homeSocialProof.body}</p>
        <div className="mt-6">
          <GhostCta href="/itneck/about">Learn More</GhostCta>
        </div>
      </Section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-cloud">
            {homeTeam.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-graphite">{homeTeam.body}</p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homeTeam.captions.map((caption, i) => (
              <li key={caption}>
                <div className="relative aspect-square overflow-hidden rounded-md bg-page">
                  <Image
                    src={`/itneck/team/${i + 1}.jpg`}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <p className="mt-3 font-display text-sm font-semibold text-cloud">
                  {caption}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section>
        <Eyebrow>Our Partners</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-cloud">
          Our Partners
        </h2>
        <p className="mt-4 max-w-2xl text-graphite">
          The clients we support and the technology partners that power secure,
          reliable IT.
        </p>

        <h3 className="mt-12 font-mono text-xs uppercase tracking-widest text-cyan">
          Clients
        </h3>
        <PartnerGrid items={clientPartners} />

        <h3 className="mt-12 font-mono text-xs uppercase tracking-widest text-cyan">
          Technology Partners
        </h3>
        <PartnerGrid items={technologyPartners} />
      </Section>

      <Section>
        <Eyebrow>Reviews</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-cloud">
          Recent reviews from our customers
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <li key={t.title} className="border border-line bg-page p-6">
              <h3 className="font-display text-lg font-semibold text-cloud">
                {t.title}
              </h3>
              <blockquote className="mt-3 text-sm leading-relaxed text-graphite">
                <p>{t.quote}</p>
              </blockquote>
              <p className="mt-4 text-sm font-medium text-navy">
                {t.name}{" "}
                <span className="font-normal text-graphite">{t.role}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="!pt-0">
        <Eyebrow>{homeContactIntro.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold text-cloud">
          {homeContactIntro.heading}
        </h2>
        <p className="mt-4 max-w-2xl text-graphite">{homeContactIntro.body}</p>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <ItneckNapBlock />
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface">
            <Image
              src="/itneck/home/corporate-conf.png"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </Section>

      <CtaBanner
        heading="Ready for IT that just works?"
        href="/itneck/contact"
        ctaLabel="Contact us"
      />
    </>
  );
}
