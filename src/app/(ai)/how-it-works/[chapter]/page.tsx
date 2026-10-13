import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusyworkEntryLink } from "@/components/busywork/BusyworkEntryLink";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/ui";
import { chapters, getChapter } from "@/lib/method";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ chapter: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return chapters.map((chapter) => ({ chapter: chapter.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return {};
  const path = `/how-it-works/${chapter.slug}`;
  return {
    title: chapter.name,
    description: chapter.metaDescription,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: `${chapter.name} | Ai.neck`,
      description: chapter.metaDescription,
      url: absoluteUrl(path),
    },
  };
}

export default async function ChapterPage({ params }: Props) {
  const { chapter: slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const path = `/how-it-works/${chapter.slug}`;

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-graphite">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/how-it-works" className="hover:text-cyan">
                How It Works
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-cyan">
              {chapter.name}
            </li>
          </ol>
        </nav>
        <p className="mt-8 font-display text-3xl font-semibold text-cyan">
          {chapter.number}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          {chapter.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">
          {chapter.lede}
        </p>
      </Section>

      <Section className="grid gap-12 pt-0 md:grid-cols-2">
        {chapter.lists.map((list) => (
          <div key={list.title}>
            <h2 className="font-display text-2xl font-semibold text-navy">
              {list.title}
            </h2>
            <ul className="mt-5 space-y-3">
              {list.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-graphite">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section className="pt-0">
        <p className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-navy">
          {chapter.key}
        </p>
        <BusyworkEntryLink
          from={chapter.slug}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          {chapter.cta}
        </BusyworkEntryLink>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How It Works", path: "/how-it-works" },
          { name: chapter.name, path },
        ])}
      />
    </>
  );
}
