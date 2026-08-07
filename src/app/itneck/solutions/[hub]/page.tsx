import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner, Eyebrow, Section } from "@/components/ui";
import { getHub, solutionHubs } from "@/lib/itneck/solutions";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

type Props = { params: Promise<{ hub: string }> };

export function generateStaticParams() {
  return solutionHubs.map((h) => ({ hub: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub: hubSlug } = await params;
  const hub = getHub(hubSlug);
  if (!hub) return {};
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: itneckAbsoluteUrl(`/solutions/${hub.slug}`) },
  };
}

export default async function SolutionCategoryPage({ params }: Props) {
  const { hub: hubSlug } = await params;
  const hub = getHub(hubSlug);
  if (!hub) notFound();

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <p className="text-sm text-graphite">
          <Link href="/itneck/solutions" className="hover:text-cyan">
            Solutions
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-navy">{hub.title}</span>
        </p>
        <div className="mt-6">
          <Eyebrow>{hub.navLabel}</Eyebrow>
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          {hub.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-graphite">{hub.description}</p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {hub.leaves.map((leaf) => (
            <li key={leaf.slug}>
              <Link
                href={`/itneck/solutions/${hub.slug}/${leaf.slug}`}
                className="block h-full border border-line bg-page p-6 transition-colors hover:border-navy/30 hover:bg-surface"
              >
                <h2 className="font-display text-xl font-semibold text-cloud">
                  {leaf.title}
                  {leaf.badge ? (
                    <span className="ml-2 font-mono text-[10px] uppercase text-amber">
                      {leaf.badge}
                    </span>
                  ) : null}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-graphite">
                  {leaf.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBanner
        heading={`Talk to us about ${hub.title}`}
        href="/itneck/contact"
        ctaLabel="Contact us"
      />
    </>
  );
}
