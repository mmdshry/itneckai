export const categories = [
  {
    slug: "end-your-busy-work",
    name: "End Your Busy Work",
    description: "The repetitive work that quietly uses the hours you already pay for.",
  },
  {
    slug: "ai-in-the-real-world",
    name: "AI in the Real World",
    description: "What AI actually changes in a growing company, without the slogans.",
  },
  {
    slug: "automation-opportunities",
    name: "Automation Opportunities",
    description: "How to decide what to automate, what to phase, and what to leave alone.",
  },
  {
    slug: "microsoft-ai",
    name: "Microsoft + AI",
    description: "Practical uses of Microsoft 365, Power Automate, and Copilot.",
  },
  {
    slug: "business-efficiency",
    name: "Business Efficiency",
    description: "Time, friction, cost, and the capacity a team gets back.",
  },
  {
    slug: "before-and-after",
    name: "Before & After Workflows",
    description: "The same workflow, before the fix and after it.",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
