import { ogImage, ogSize } from "@/lib/og";
import { getTopic, topics } from "@/lib/education";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Ai.neck University";

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  return ogImage(topic?.title ?? "Ai.neck University", "AI.NECK UNIVERSITY");
}
