import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner, Section } from "@/components/ui";
import { blogPosts, getPost, type BlogBlock } from "@/lib/itneck/blog";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: itneckAbsoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: itneckAbsoluteUrl(`/blog/${post.slug}`),
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-10 font-display text-2xl font-semibold text-cloud">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 font-display text-xl font-semibold text-cloud">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-graphite">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    default:
      return (
        <p className="mt-4 leading-relaxed text-graphite">{block.text}</p>
      );
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <p className="text-sm text-graphite">
          <Link href="/itneck/blog" className="hover:text-cyan">
            Blog
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-navy">Article</span>
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-3xl font-bold tracking-tight text-cloud md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-graphite">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden className="mx-2">
            ·
          </span>
          {post.author}
        </p>
        <div className="relative mt-10 aspect-[16/9] max-w-4xl overflow-hidden rounded-md bg-surface">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
        <article className="mt-10 max-w-3xl">
          {post.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>
      </Section>

      {related.length > 0 ? (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="font-display text-2xl font-semibold text-cloud">
              Related posts
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/itneck/blog/${p.slug}`}
                    className="block text-sm font-medium text-navy hover:text-cyan"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CtaBanner
        heading="Have questions about this topic?"
        href="/itneck/contact"
        ctaLabel="Contact us"
      />
    </>
  );
}
