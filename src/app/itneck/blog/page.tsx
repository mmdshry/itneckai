import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow, Section } from "@/components/ui";
import { blogPosts } from "@/lib/itneck/blog";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "IT insights, tech trends, and updates from ITneck — cybersecurity, cloud, MDM, RMM, and more.",
  alternates: { canonical: itneckAbsoluteUrl("/blog") },
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Section className="pt-32 md:pt-40">
      <Eyebrow>Learn</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
        Blog
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-graphite">
        Monthly IT insights, tech trends, and practical guidance for growing
        businesses.
      </p>
      <ul className="mt-14 grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/itneck/blog/${post.slug}`}
              className="group block overflow-hidden border border-line bg-page transition-colors hover:border-navy/30"
            >
              <div className="relative aspect-[16/10] bg-surface">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  className="object-cover transition-transform group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <time
                  dateTime={post.date}
                  className="font-mono text-xs text-graphite"
                >
                  {formatDate(post.date)}
                </time>
                <h2 className="mt-2 font-display text-xl font-semibold text-cloud group-hover:text-cyan">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-graphite">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
