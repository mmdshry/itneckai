import type { Metadata } from "next";
import { CtaBanner, Eyebrow, Section } from "@/components/ui";
import { aboutContent, aboutItneck } from "@/lib/itneck/about";
import { itneckContactHref } from "@/lib/itneck/cta";
import { technologyPartners, type Partner } from "@/lib/itneck/partners";
import { itneckAbsoluteUrl, itneckSite } from "@/lib/itneck/site";
import { testimonials } from "@/lib/itneck/testimonials";

export const metadata: Metadata = {
  title: "About ITneck",
  description:
    "ITneck is a San Diego technology partner for managed IT, cybersecurity, AI, backup, and technology strategy.",
  alternates: { canonical: itneckAbsoluteUrl("/about-itneck") },
};

function PartnerGrid({ items }: { items: Partner[] }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
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

export default function AboutItneckPage() {
  const c = aboutContent;
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>{aboutItneck.eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-6xl">
          {aboutItneck.heading}
        </h1>
        {aboutItneck.intro.map((p) => (
          <p key={p} className="mt-5 max-w-3xl text-lg leading-relaxed text-graphite">
            {p}
          </p>
        ))}
        <p className="mt-6 max-w-3xl text-lg text-graphite">{itneckSite.tagline}</p>
      </Section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
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
            <p className="mt-4 leading-relaxed text-graphite">{c.expertise.body}</p>
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <Eyebrow>Partners</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-cloud">
          Technology Partners
        </h2>
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

      <CtaBanner
        heading="Talk with an Advisor"
        href={itneckContactHref("advisor")}
        ctaLabel="Talk with an Advisor"
      />
    </>
  );
}
