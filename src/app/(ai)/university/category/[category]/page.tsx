import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow, Section } from "@/components/ui";
import { topics } from "@/lib/education";
import { guideDescription, guideTitle } from "@/lib/education/enterprise-guide";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { articlesIn } from "@/lib/university/articles";
import { categories, getCategory } from "@/lib/university/categories";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const path = `/university/category/${category.slug}`;
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: `${category.name} | Ai.neck University`,
      description: category.description,
      url: absoluteUrl(path),
    },
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const posts = articlesIn(category.slug);
  const path = `/university/category/${category.slug}`;
  const showGuide = category.slug === "microsoft-ai";
  const showPosters = category.slug === "ai-in-the-real-world";

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
              {category.name}
            </li>
          </ol>
        </nav>
        <Eyebrow>Ai.neck University</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          {category.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">
          {category.description}
        </p>
      </Section>

      <Section className="pt-0" aria-label="Articles">
        <ul className="grid gap-4 md:grid-cols-2">
          {posts.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/university/articles/${article.slug}`}
                className="flex h-full flex-col rounded-lg border border-line p-5 transition-colors hover:border-navy/30 hover:bg-surface"
              >
                <h2 className="font-display text-2xl font-semibold text-navy">
                  {article.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">
                  {article.summary}
                </p>
                <p className="mt-4 text-xs text-graphite">
                  {formatDate(article.date)} · {article.readMinutes} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {showGuide ? (
        <Section className="pt-0" aria-labelledby="guide-link-title">
          <h2
            id="guide-link-title"
            className="font-display text-2xl font-semibold text-navy"
          >
            In this category
          </h2>
          <Link
            href="/university#enterprise-guide"
            className="mt-6 flex max-w-2xl flex-col rounded-lg border border-line p-5 transition-colors hover:border-navy/30 hover:bg-surface"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
              Guide
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-navy">
              {guideTitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-graphite">
              {guideDescription}
            </p>
          </Link>
        </Section>
      ) : null}

      {showPosters ? (
        <Section className="pt-0" aria-labelledby="poster-link-title">
          <h2
            id="poster-link-title"
            className="font-display text-2xl font-semibold text-navy"
          >
            Field notes
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/university/${topic.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-line transition-colors hover:border-navy/30"
                >
                  <Image
                    src={topic.poster}
                    alt=""
                    width={1290}
                    height={1500}
                    className="aspect-[4/5] w-full bg-surface object-cover object-top"
                  />
                  <span className="p-4 font-display text-lg font-semibold text-navy">
                    {topic.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Ai.neck University", path: "/university" },
          { name: category.name, path },
        ])}
      />
      <JsonLd
        data={itemListSchema({
          name: category.name,
          path,
          items: posts.map((article) => ({
            name: article.title,
            path: `/university/articles/${article.slug}`,
          })),
        })}
      />
    </>
  );
}
