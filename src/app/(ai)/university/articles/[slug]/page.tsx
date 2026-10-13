import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusyworkEntryLink } from "@/components/busywork/BusyworkEntryLink";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/ui";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { articles, getArticle } from "@/lib/university/articles";
import { getCategory } from "@/lib/university/categories";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const path = `/university/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: `${article.title} | Ai.neck University`,
      description: article.metaDescription,
      url: absoluteUrl(path),
    },
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const path = `/university/articles/${article.slug}`;

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
            <li>
              <Link
                href={`/university/category/${article.category}`}
                className="hover:text-cyan"
              >
                {category?.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-cyan">
              {article.title}
            </li>
          </ol>
        </nav>
        <h1 className="mt-8 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-graphite">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          {" · "}
          {article.readMinutes} min read
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">
          {article.summary}
        </p>
      </Section>

      {article.beforeAfter ? (
        <Section className="grid gap-4 pt-0 md:grid-cols-2">
          <div className="rounded-lg border border-line p-6">
            <h2 className="font-display text-xl font-semibold text-navy">Before</h2>
            <ul className="mt-4 space-y-3">
              {article.beforeAfter.before.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-graphite">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-surface p-6">
            <h2 className="font-display text-xl font-semibold text-navy">After</h2>
            <ul className="mt-4 space-y-3">
              {article.beforeAfter.after.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-graphite">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {article.sections.map((section) => (
          <article key={section.heading} className="max-w-2xl border-t border-line py-10">
            <h2 className="font-display text-2xl font-semibold text-navy">
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-graphite">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.bullets ? (
              <ul className="mt-4 space-y-2">
                {section.bullets.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-graphite">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-navy md:text-3xl">
            Your next automation opportunity may already be hiding inside the
            work your team does every day.
          </h2>
          <BusyworkEntryLink
            from={`university-article-${article.slug}`}
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
          { name: category?.name ?? "Category", path: `/university/category/${article.category}` },
          { name: article.title, path },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: article.title,
          description: article.metaDescription,
          path,
          date: article.date,
        })}
      />
    </>
  );
}
