export type Chapter = {
  slug: "discover" | "build" | "optimize";
  number: string;
  name: string;
  action: string;
  cta: string;
  headline: string;
  lede: string;
  lists: { title: string; items: string[] }[];
  key: string;
  metaDescription: string;
};

export const chapters: Chapter[] = [
  {
    slug: "discover",
    number: "01",
    name: "Discover",
    action: "Explore Discover",
    cta: "Find My Busy Work",
    headline: "See the work. Find the friction. Measure the opportunity.",
    lede: "We observe how your business actually works — the handoffs, spreadsheets, emails, approvals, repeated tasks, searches, re-entry, and delays that quietly consume your team's time.",
    lists: [
      {
        title: "What We Look For",
        items: [
          "Repetitive work",
          "Manual data entry and duplicate entry",
          "Time spent searching for information",
          "Recurring reports and follow-up",
          "Slow approvals and handoffs",
          "Processes dependent on one person",
          "Work that creates unnecessary errors or delays",
        ],
      },
      {
        title: "What You Receive",
        items: [
          "Busy Work Map — where time and friction are being created",
          "Automation Opportunity Roadmap — what should be improved first",
          "Time and cost estimate — the business impact of the current process",
          "Recommended approach — automation, AI, integration, process improvement, or a combination",
        ],
      },
    ],
    key: "We do not automate something simply because we can. We identify where automation makes business sense.",
    metaDescription:
      "Ai.neck starts by watching how work actually gets done, then maps the friction worth removing.",
  },
  {
    slug: "build",
    number: "02",
    name: "Build",
    action: "Explore Build",
    cta: "Start With My Workflow",
    headline: "Build the solution around the problem — not the other way around.",
    lede: "Once the opportunity is clear, we design and implement the right solution for the workflow, the people using it, and the systems already inside the business.",
    lists: [
      {
        title: "What We Can Build",
        items: [
          "AI agents and internal assistants",
          "Workflow and approval automation",
          "Microsoft 365 and Power Automate solutions",
          "Knowledge and SOP assistants",
          "Customer intake and follow-up automation",
          "Reporting and data workflows",
          "Onboarding and operational workflows",
          "System integrations and custom AI applications",
        ],
      },
      {
        title: "How We Prioritize",
        items: [
          "Time saved",
          "Friction removed",
          "Risk reduced",
          "Business value created",
        ],
      },
    ],
    key: "The goal is not more technology. The goal is less work between your people and the result they are trying to create.",
    metaDescription:
      "Ai.neck turns the highest-value busy-work opportunities into practical AI, automation, and Microsoft 365 workflows.",
  },
  {
    slug: "optimize",
    number: "03",
    name: "Optimize",
    action: "Explore Optimize",
    cta: "End Your Busy Work",
    headline:
      "Automation is not finished when it launches. It is finished when it creates measurable value.",
    lede: "We measure what changed, refine the workflow, and continue looking for the next place where your team can recover time and capacity.",
    lists: [
      {
        title: "The Optimization Cycle",
        items: [
          "Measure time saved and adoption",
          "Review workflow performance",
          "Improve the automation based on real use",
          "Identify new bottlenecks",
          "Expand successful workflows",
          "Prioritize the next opportunity",
        ],
      },
      {
        title: "Business Outcome",
        items: [
          "Fewer repetitive tasks",
          "Faster execution",
          "Better use of talent",
          "More capacity without simply adding more people",
        ],
      },
    ],
    key: "We keep asking one question: Where can your business get time back next?",
    metaDescription:
      "Ai.neck measures what an automation changed, improves what people actually use, and finds the next place to recover time.",
  },
];

export function getChapter(slug: string) {
  return chapters.find((chapter) => chapter.slug === slug);
}
