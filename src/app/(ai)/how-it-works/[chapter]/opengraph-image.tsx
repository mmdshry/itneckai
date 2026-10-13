import { ogImage, ogSize } from "@/lib/og";
import { chapters, getChapter } from "@/lib/method";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "How It Works — Ai.neck";

export function generateStaticParams() {
  return chapters.map((chapter) => ({ chapter: chapter.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const chapter = getChapter(slug);
  return ogImage(chapter?.headline ?? "How It Works", `HOW IT WORKS · ${chapter?.name ?? ""}`);
}
