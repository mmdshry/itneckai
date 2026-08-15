import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SolutionLongform } from "@/components/itneck/SolutionLongform";
import { itneckAbsoluteUrl } from "@/lib/itneck/site";
import {
  getHub,
  resolveLegacySolution,
  solutionHubs,
} from "@/lib/itneck/solutions";

type Props = { params: Promise<{ hub: string }> };

export function generateStaticParams() {
  const current = solutionHubs.map((h) => ({ hub: h.slug }));
  const legacy = ["cloud", "network", "hardware-software", "ai"].map((hub) => ({
    hub,
  }));
  return [...current, ...legacy];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub: hubSlug } = await params;
  const hub = getHub(hubSlug);
  if (!hub) return {};
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: itneckAbsoluteUrl(`/solutions/${hub.slug}`) },
  };
}

export default async function SolutionCategoryPage({ params }: Props) {
  const { hub: hubSlug } = await params;
  const hub = getHub(hubSlug);
  if (hub) return <SolutionLongform page={hub} />;
  const dest = resolveLegacySolution(hubSlug);
  if (dest) redirect(dest);
  notFound();
}
