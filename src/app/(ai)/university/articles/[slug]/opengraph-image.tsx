import { ogImage, ogSize } from "@/lib/og";
import { articles, getArticle } from "@/lib/university/articles";
import { getCategory } from "@/lib/university/categories";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Ai.neck University";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const category = article ? getCategory(article.category) : undefined;
  return ogImage(
    article?.title ?? "Ai.neck University",
    category?.name.toUpperCase() ?? "AI.NECK UNIVERSITY",
  );
}
