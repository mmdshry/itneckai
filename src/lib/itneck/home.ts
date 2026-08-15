import { itneckContactHref } from "@/lib/itneck/cta";

export const homeHero = {
  eyebrow: "TECHNOLOGY SUPPORT",
  title:
    "We simplify and secure your technology, so your team can stay focused, productive, and moving forward.",
  primaryCta: {
    label: "Talk with an Advisor",
    href: itneckContactHref("advisor"),
  },
} as const;

export const homePillars = [
  "Risk reduction",
  "Business continuity",
  "Operational efficiency",
  "Peace of mind for leadership",
] as const;
