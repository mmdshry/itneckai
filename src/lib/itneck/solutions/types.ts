import type { SolutionCta } from "@/lib/itneck/cta";

export type SolutionSection = {
  id: string;
  /** Shown in the sticky TOC. Defaults to title when omitted. */
  toc?: string;
  title?: string;
  paragraphs?: string[];
  listIntro?: string;
  items?: string[];
  afterItems?: string[];
  result?: string;
  steps?: { title: string; body: string }[];
  crosslink?: { label: string; href: string };
};

export type SolutionPage = {
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  hero: {
    title: string;
    paragraphs: string[];
    primaryCta: SolutionCta;
    secondaryCta: SolutionCta;
  };
  sections: SolutionSection[];
  closing: {
    title: string;
    paragraphs: string[];
    primaryCta: SolutionCta;
    secondaryCta: SolutionCta;
  };
};
