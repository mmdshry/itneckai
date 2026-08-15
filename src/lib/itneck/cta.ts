import { itneckHelpTopics } from "@/lib/itneck/contact-schema";

export type ItneckCtaQuery =
  | "advisor"
  | "it-assessment"
  | "security-advisor"
  | "security-assessment"
  | "ai-advisor"
  | "ai-assessment"
  | "bc-assessment"
  | "technology-advisor"
  | "technology-assessment";

export const itneckTopicByQuery: Record<
  ItneckCtaQuery,
  (typeof itneckHelpTopics)[number]
> = {
  advisor: "Talk With an Advisor",
  "it-assessment": "Request an IT Assessment",
  "security-advisor": "Talk With a Security Advisor",
  "security-assessment": "Request a Security Assessment",
  "ai-advisor": "Talk With an AI Advisor",
  "ai-assessment": "Request an AI Readiness Assessment",
  "bc-assessment": "Request a Business Continuity Assessment",
  "technology-advisor": "Talk With a Technology Advisor",
  "technology-assessment": "Request a Technology Assessment",
};

export function itneckContactHref(query: ItneckCtaQuery): string {
  return `/itneck/contact?topic=${query}`;
}

export type SolutionCta = {
  label: string;
  query: ItneckCtaQuery;
};
