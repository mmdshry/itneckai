import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusyworkEntryLink } from "@/components/busywork/BusyworkEntryLink";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/ui";
import { getTopic, topicNeighbors, topics } from "@/lib/education";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  const path = `/university/${topic.slug}`;
  return {
    title: topic.title,
    description: topic.metaDescription,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: `${topic.title} | Ai.neck University`,
      description: topic.metaDescription,
      url: absoluteUrl(path),
    },
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const path = `/university/${topic.slug}`;
  const { previous, next } = topicNeighbors(topic.slug);

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-graphite">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/university" className="hover:text-cyan">
                Ai.neck University
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-cyan">
              {topic.title}
            </li>
          </ol>
        </nav>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-cyan">
          {String(topic.series).padStart(2, "0")} of {String(topics.length).padStart(2, "0")}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          {topic.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">
          {topic.intro}
        </p>
      </Section>

      <Section className="pt-0">
        <figure>
          <Image
            src={topic.poster}
            alt={topic.posterAlt}
            width={1290}
            height={1500}
            className="mx-auto h-auto w-full max-w-3xl rounded-lg border border-line bg-surface"
          />
          <figcaption className="mx-auto mt-3 max-w-3xl text-sm text-graphite">
            The poster is a map. The explanations below are the text to read.
          </figcaption>
        </figure>
      </Section>

      <Section className="pt-0" aria-label="Ideas in this map">
        <h2 className="font-display text-2xl font-semibold text-navy">
          Fifteen ideas
        </h2>
        <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {topic.concepts.map((concept, index) => (
            <li key={concept.slug}>
              <a
                href={`#${concept.slug}`}
                className="flex min-h-11 items-baseline gap-2 rounded-md px-2 py-2 text-sm text-navy hover:bg-surface hover:text-cyan"
              >
                <span className="font-mono text-xs text-cyan">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {concept.name}
              </a>
            </li>
          ))}
        </ol>
      </Section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {topic.concepts.map((concept, index) => (
          <article
            key={concept.slug}
            id={concept.slug}
            className="scroll-mt-24 border-t border-line py-10"
          >
            <p className="font-mono text-xs text-cyan">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-navy">
              {concept.name}
            </h2>
            <div className="mt-4 grid gap-6 text-sm leading-relaxed text-graphite md:grid-cols-2">
              <p>{concept.definition}</p>
              <p>
                <span className="font-medium text-navy">How it works. </span>
                {concept.mechanism}
              </p>
              <p>
                <span className="font-medium text-navy">Where you meet it. </span>
                {concept.practice}
              </p>
              <p>
                <span className="font-medium text-navy">Where the label misleads. </span>
                {concept.limit}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Section className="flex flex-wrap items-center justify-between gap-4">
        {previous ? (
          <Link href={`/university/${previous.slug}`} className="text-sm font-medium text-navy hover:text-cyan">
            Previous: {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/university/${next.slug}`} className="text-sm font-medium text-navy hover:text-cyan">
            Next: {next.title}
          </Link>
        ) : (
          <span />
        )}
      </Section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-navy md:text-3xl">
            Your next automation opportunity may already be hiding inside the
            work your team does every day.
          </h2>
          <BusyworkEntryLink
            from={`university-${topic.slug}`}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            End Your Busy Work
          </BusyworkEntryLink>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Ai.neck University", path: "/university" },
          { name: topic.title, path },
        ])}
      />
      <JsonLd
        data={itemListSchema({
          name: topic.title,
          path,
          items: topic.concepts.map((concept) => ({
            name: concept.name,
            path: `${path}#${concept.slug}`,
          })),
        })}
      />
    </>
  );
}
