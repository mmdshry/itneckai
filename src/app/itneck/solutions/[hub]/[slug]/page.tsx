import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner, Eyebrow, PrimaryCta, Section } from "@/components/ui";
import {
  getLeaf,
  solutionHubs,
} from "@/lib/itneck/solutions";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

type Props = { params: Promise<{ hub: string; slug: string }> };

export function generateStaticParams() {
  return solutionHubs.flatMap((hub) =>
    hub.leaves.map((leaf) => ({ hub: hub.slug, slug: leaf.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub: hubSlug, slug } = await params;
  const found = getLeaf(hubSlug, slug);
  if (!found) return {};
  return {
    title: found.leaf.title,
    description: found.leaf.summary,
    alternates: {
      canonical: itneckAbsoluteUrl(
        `/solutions/${found.hub.slug}/${found.leaf.slug}`,
      ),
    },
  };
}

export default async function SolutionLeafPage({ params }: Props) {
  const { hub: hubSlug, slug } = await params;
  const found = getLeaf(hubSlug, slug);
  if (!found) notFound();
  const { hub, leaf } = found;

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
          <Link
            href={`/itneck/solutions/${hub.slug}`}
            className="hover:text-cyan"
          >
            {hub.title}
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-navy">{leaf.title}</span>
        </p>
        <div className="mt-6">
          <Eyebrow>{hub.navLabel}</Eyebrow>
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          {leaf.title}
          {leaf.badge ? (
            <span className="ml-3 align-middle font-mono text-sm uppercase text-amber">
              {leaf.badge}
            </span>
          ) : null}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-graphite">
          {leaf.summary}
        </p>
        {leaf.bullets && leaf.bullets.length > 0 ? (
          <ul className="mt-10 max-w-2xl space-y-3">
            {leaf.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-graphite">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                {b}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-10">
          <PrimaryCta href="/itneck/contact">Talk to us about this</PrimaryCta>
        </div>
      </Section>
      <CtaBanner
        heading="Ready to get started?"
        href="/itneck/contact"
        ctaLabel="Contact us"
      />
    </>
  );
}
