import { ogImage, ogSize } from "@/lib/og";
import { getIndustry, industries } from "@/lib/industries";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "ai.neck — Industries";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  return ogImage(
    industry?.headline ?? "Industries served by ai.neck",
    `INDUSTRIES · ${industry?.short ?? "MICROSOFT 365"}`
  );
}
