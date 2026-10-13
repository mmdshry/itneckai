import { ogImage, ogSize } from "@/lib/og";
import { categories, getCategory } from "@/lib/university/categories";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Ai.neck University";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  return ogImage(category?.name ?? "Ai.neck University", "AI.NECK UNIVERSITY");
}
