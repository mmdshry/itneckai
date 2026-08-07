import { ogImage, ogSize } from "@/lib/og";
import { copilotProducts, getProduct } from "@/lib/copilot-agents";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "ai.neck — Microsoft Copilot agents";

export function generateStaticParams() {
  return copilotProducts.map((p) => ({ product: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: slug } = await params;
  const product = getProduct(slug);
  return ogImage(
    product?.headline ?? "Microsoft Copilot agents, built for your stack.",
    `COPILOT AGENTS · ${product?.short ?? "MICROSOFT 365"}`
  );
}
