import { getCategory, type CategorySlug } from "@/lib/university/categories";

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  category: CategorySlug;
  title: string;
  summary: string;
  date: string;
  readMinutes: number;
  metaDescription: string;
  sections: ArticleSection[];
  beforeAfter?: { before: string[]; after: string[] };
};

export const articles: Article[] = [
  {
    slug: "the-work-your-team-should-not-be-doing",
    category: "end-your-busy-work",
    title: "The work your team should not be doing",
    summary:
      "Busy work is the copying, chasing, and rebuilding that quietly uses hours you are already paying for.",
    date: "2026-10-06",
    readMinutes: 5,
    metaDescription:
      "How to spot the repetitive work your team should not be doing, and why the first question is where time is being lost.",
    sections: [
      {
        heading: "Hired for the work, stuck with the admin",
        paragraphs: [
          "Your employees were not hired to copy information between systems, chase emails, build the same reports, or repeat the same administrative work every week.",
          "That work rarely shows up as a project. It shows up as the hour before a meeting, the spreadsheet someone rebuilds on Friday, and the question that interrupts a manager for the fourth time.",
        ],
      },
      {
        heading: "What busy work looks like",
        paragraphs: [
          "The useful question is not where to install AI. It is where people are losing time. These are the patterns we look for first.",
        ],
        bullets: [
          "Information entered more than once, or copied between applications and spreadsheets.",
          "The same email, report, or document prepared again and again.",
          "Manual steps in customer or employee onboarding.",
          "Repeated searching for policies, files, SOPs, or answers.",
          "Approvals and handoffs that create waiting.",
          "A process that stops if one person is out.",
          "Manual scheduling, follow-up, reminders, and status checks.",
          "Repetitive calculations, estimates, summaries, or classifications.",
          "Skilled people spending their day on low-value admin.",
          "Excel files acting as unofficial applications or databases.",
          "Customer requests that could move faster through a form or self-service.",
        ],
      },
      {
        heading: "Start with one workflow",
        paragraphs: [
          "A bad process automated becomes a faster bad process. Name one workflow, count the hours, and simplify the steps before you add a tool.",
          "The End Your Busy Work assessment is built for that. It asks what the team hates doing, what gets copied, and what would happen with five hours back a week.",
        ],
      },
    ],
  },
  {
    slug: "what-ai-actually-does-in-a-growing-company",
    category: "ai-in-the-real-world",
    title: "What AI actually does in a growing company",
    summary:
      "In a real company, AI is useful when it drafts, finds, or sorts the work people already repeat.",
    date: "2026-10-07",
    readMinutes: 5,
    metaDescription:
      "A practical look at where AI helps a growing company: drafts, search, summaries, and the judgment that should stay human.",
    sections: [
      {
        heading: "It is a tool for a specific job",
        paragraphs: [
          "Most companies do not need a new platform. They need a faster way through work that already has a pattern: the follow-up email, the estimate, the SOP question, the meeting notes that never become tasks.",
          "AI is one option among several. The better answer might be a form, a Power Automate flow, a cleaner SharePoint library, or a step you can delete.",
        ],
      },
      {
        heading: "Where it earns its place",
        paragraphs: [
          "The useful cases are narrow and measurable. Someone can point at the hour they got back.",
        ],
        bullets: [
          "Drafting the first version of a recurring email, quote, or summary, for a person to check.",
          "Answering the same internal question from the files and SOPs the company already trusts.",
          "Turning meeting notes into owners and dates, instead of a document nobody opens.",
          "Classifying incoming requests so the right person sees them sooner.",
        ],
      },
      {
        heading: "What should stay with a person",
        paragraphs: [
          "A difficult customer conversation, a hiring decision, and an exception that needs judgment are not busy work. Removing the person there makes the outcome worse.",
          "The goal is not to automate 100% of a process. It is less work between your people and the result they are trying to create.",
        ],
      },
    ],
  },
  {
    slug: "how-to-tell-a-real-automation-opportunity",
    category: "automation-opportunities",
    title: "How to tell a real automation opportunity from a distraction",
    summary:
      "Not every manual step should be automated. Score the time, the cost, and how much of it can safely change.",
    date: "2026-10-08",
    readMinutes: 6,
    metaDescription:
      "A simple way to score automation opportunities and sort them into Quick Win, High Impact, Strategic, or Leave Alone.",
    sections: [
      {
        heading: "Five questions before a build",
        paragraphs: [
          "We do not automate something simply because we can. Each workflow gets the same lens.",
        ],
        bullets: [
          "Time: how many employee hours does it consume?",
          "Frequency: how often does it happen?",
          "Cost: what does it cost in labor, errors, delay, or lost opportunity?",
          "Friction: how frustrating, error-prone, or disruptive is it?",
          "Automation potential: how much of it can realistically and safely be improved?",
        ],
      },
      {
        heading: "Four ways to treat the answer",
        paragraphs: [
          "The score is there to choose an action, not to decorate a slide.",
        ],
        bullets: [
          "Quick Win: low complexity, clear value, a short path. Prioritize it early.",
          "High Impact: significant time or capacity. Build the case and implement it.",
          "Strategic: a larger change that can reshape how the operation runs. Roadmap it and phase it.",
          "Leave Alone: low return, high risk, or a place where human judgment is the valuable part. Do not automate it simply because you can.",
        ],
      },
      {
        heading: "A preliminary score is not the decision",
        paragraphs: [
          "The End Your Busy Work map can suggest a category from what you tell us. We still look at the real workflow before anyone builds. A number does not replace watching the work.",
        ],
      },
    ],
  },
  {
    slug: "start-with-the-microsoft-tools-you-already-pay-for",
    category: "microsoft-ai",
    title: "Start with the Microsoft tools you already pay for",
    summary:
      "A lot of busy work can move into Microsoft 365, Power Automate, and Copilot before you buy anything new.",
    date: "2026-10-09",
    readMinutes: 5,
    metaDescription:
      "Why Microsoft 365, Power Automate, and Copilot are often the first place to remove busy work.",
    sections: [
      {
        heading: "Meet people in the tools they already open",
        paragraphs: [
          "A new portal that nobody opens has no return. Whenever it is practical, the workflow should land in Outlook, Teams, SharePoint, or the forms the team already uses.",
          "That is why Microsoft 365 is often the first place we look. The licenses are already there. The permissions and the files are already there.",
        ],
      },
      {
        heading: "What each piece is for",
        paragraphs: [
          "The products are not interchangeable. Picking the logo first is how projects miss the workflow.",
        ],
        bullets: [
          "A form plus Power Automate, when the problem is re-entry, routing, or an approval that sits in an inbox.",
          "SharePoint or Lists, when the source of truth is a spreadsheet that has become an unofficial database.",
          "Copilot or a grounded assistant, when people keep searching for the same policy, file, or SOP.",
          "A custom application only when the existing tools cannot hold the workflow safely.",
        ],
      },
      {
        heading: "Security is part of the design",
        paragraphs: [
          "Data access, permissions, privacy, and auditability have to be decided before anything is turned on. An assistant that can see more than the person using it is not a shortcut. It is a risk.",
        ],
      },
    ],
  },
  {
    slug: "recovered-time-is-capacity-not-a-payroll-cut",
    category: "business-efficiency",
    title: "Recovered time is capacity, not a payroll cut",
    summary:
      "The honest result of removing busy work is hours your team can spend on customers, delivery, and growth.",
    date: "2026-10-10",
    readMinutes: 5,
    metaDescription:
      "Why recovered time should be counted as business capacity, with a worked example of 30 people and three hours a week.",
    sections: [
      {
        heading: "Do not sell the hours as guaranteed savings",
        paragraphs: [
          "A workflow that takes eight hours a month does not automatically become eight hours of payroll you can remove. Some of that time comes back. Some of it was waiting, rework, or a step a person still needs to check.",
          "The stronger message is recovered capacity. People spend the hours on customers, projects, and decisions instead of on the admin.",
        ],
      },
      {
        heading: "A 30-person example",
        paragraphs: [
          "A 30-person company that recovers 3 hours per employee each week creates about 90 hours of additional capacity a week, or 4,680 hours a year.",
          "At a $50 loaded hourly cost, that is roughly $234,000 of annual employee capacity. It can be redirected toward customers, revenue, delivery, and growth. It is not a promise that the payroll line will drop by that amount.",
          "We help companies buy back time they are already paying for.",
        ],
      },
      {
        heading: "What is worth measuring",
        paragraphs: [
          "Pick the measures before the build, and check them after people are actually using the workflow.",
        ],
        bullets: [
          "Hours recovered per month, and time-to-complete before versus after.",
          "Manual steps removed, and fewer errors or less rework.",
          "Faster response, and fewer interruptions for the same answer.",
          "More customer, project, bid, or transaction capacity.",
          "Less dependence on one person, and the adoption rate of the new workflow.",
        ],
      },
    ],
  },
  {
    slug: "customer-intake-before-and-after",
    category: "before-and-after",
    title: "Customer intake, before and after",
    summary:
      "The same intake workflow, counted honestly: eight hours a month of re-entry, and about six hours that can come back.",
    date: "2026-10-12",
    readMinutes: 5,
    metaDescription:
      "A before-and-after look at customer intake, from manual re-entry to a form and workflow, with the hours attached.",
    beforeAfter: {
      before: [
        "A request arrives by email, phone, or a forwarded message.",
        "Someone re-types it into a spreadsheet and a second system.",
        "Follow-up depends on who remembers to check the inbox.",
        "About 8 hours a month, mostly manual re-entry.",
      ],
      after: [
        "The request lands in one form.",
        "A workflow creates the record, routes it, and sends the routine follow-up.",
        "A person still handles the exception and the conversation that needs judgment.",
        "About 6 hours a month recovered, and a faster first response.",
      ],
    },
    sections: [
      {
        heading: "Before: the work hides in the handoff",
        paragraphs: [
          "Customer intake often looks small. Eight hours a month does not sound like a project. Across a year it is nearly two working weeks, and the customer is waiting the whole time.",
          "The problem is not that people are slow. The problem is that the same details are typed again, and the next step lives in someone's memory.",
        ],
      },
      {
        heading: "The fix is a simpler path, then automation",
        paragraphs: [
          "The first change is to stop collecting the same facts twice. A form plus a workflow can create the record, notify the right person, and send the routine confirmation.",
          "That is a Quick Win when the path is short and the value is obvious. It is not a reason to remove the person who handles a sensitive or unusual request.",
        ],
      },
      {
        heading: "The same lens on the rest of the week",
        paragraphs: [
          "Intake is one row on a Busy Work Map. The same columns — workflow, current effort, problem, potential solution, business impact — apply to meeting follow-up, estimating, onboarding, and the SOP questions that interrupt a manager.",
          "One map is enough to see which row to do first.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function articlesIn(category: CategorySlug) {
  return articles
    .filter((article) => article.category === category)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function latestArticles() {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date));
}

export function articleCategory(article: Article) {
  return getCategory(article.category);
}
