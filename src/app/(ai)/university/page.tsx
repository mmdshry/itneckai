import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandSummary } from "@/components/BrandSummary";
import { JsonLd } from "@/components/JsonLd";
import {
  EnterpriseGuide,
  MediaLessons,
} from "@/components/university/EnterpriseGuide";
import { Eyebrow, Section } from "@/components/ui";
import { topics } from "@/lib/education";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { latestArticles } from "@/lib/university/articles";
import { categories } from "@/lib/university/categories";

const description =
  "Short articles, examples, and insights on AI, automation, operational efficiency, Microsoft 365, and the changing way businesses get work done.";

export const metadata: Metadata = {
  title: "Ai.neck University",
  description,
  alternates: { canonical: absoluteUrl("/university") },
  openGraph: {
    title: "Ai.neck University | Ai.neck",
    description,
    url: absoluteUrl("/university"),
  },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export default function UniversityPage() {
  const posts = latestArticles();

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Ai.neck University</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          Practical ideas for doing less busy work and creating more business capacity.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">
          {description}
        </p>
        <nav aria-label="Ai.neck University categories" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/university/category/${category.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-navy transition-colors hover:border-navy/30 hover:text-cyan"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section className="pt-0" aria-labelledby="latest-articles-title">
        <h2
          id="latest-articles-title"
          className="font-display text-3xl font-semibold tracking-tight text-navy"
        >
          Latest
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {posts.map((article) => {
            const category = categories.find((item) => item.slug === article.category);
            return (
              <li key={article.slug}>
                <Link
                  href={`/university/articles/${article.slug}`}
                  className="flex h-full flex-col rounded-lg border border-line bg-page p-5 transition-colors hover:border-navy/30 hover:bg-surface"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                    {category?.name}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-navy">
                    {article.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">
                    {article.summary}
                  </p>
                  <p className="mt-4 text-xs text-graphite">
                    {formatDate(article.date)} · {article.readMinutes} min read
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <BrandSummary />

      <div id="enterprise-guide">
        <EnterpriseGuide />
        <MediaLessons />
      </div>

      <Section className="pt-0" aria-labelledby="field-notes-title">
        <Eyebrow>AI in the Real World</Eyebrow>
        <h2
          id="field-notes-title"
          className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-navy md:text-4xl"
        >
          Six maps of AI ideas.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-graphite">
          Each poster mixes levels, tasks, and product shapes. The notes say
          what each label means, how it works, where you meet it, and where the
          chart overclaims.
        </p>
        <ol className="mt-10 grid gap-6 md:grid-cols-2">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={`/university/${topic.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-page transition-colors hover:border-navy/30"
              >
                <Image
                  src={topic.poster}
                  alt=""
                  width={1290}
                  height={1500}
                  className="aspect-[4/5] w-full bg-surface object-cover object-top"
                />
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                    {String(topic.series).padStart(2, "0")} · 15 ideas
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-navy group-hover:text-cyan">
                    {topic.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">
                    {topic.summary}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Ai.neck University", path: "/university" },
        ])}
      />
      <JsonLd
        data={itemListSchema({
          name: "Ai.neck University",
          path: "/university",
          items: [
            ...posts.map((article) => ({
              name: article.title,
              path: `/university/articles/${article.slug}`,
            })),
            ...topics.map((topic) => ({
              name: topic.title,
              path: `/university/${topic.slug}`,
            })),
          ],
        })}
      />
    </>
  );
}
