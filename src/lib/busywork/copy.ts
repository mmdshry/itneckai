import type { Friction } from "./schema";

export const BUSYWORK_PATH = "/EndYourBusywork" as const;

export const persistLine =
  "One workflow at a time. We’ll review your map and follow up with you.";

export const joinCopy = {
  title: "Start the assessment",
  body: "We’ll email you a private link. No password. After you submit, we review the workflows and get in touch.",
  consent:
    "I agree to receive a sign-in link by email. Ai.neck will use my answers to follow up about the workflows I describe. You will not be added to a marketing list.",
} as const;

export const experience = {
  name: "End Your Busy Work",
  eyebrow: "End Your Busy Work",
  headline: "Find the work that should not require people.",
  supporting:
    "Your employees were not hired to copy information between systems, chase emails, build the same reports, or repeat the same administrative work every week.",
  promise:
    "Tell us where time is being lost. We look at the work first, simplify what we can, and use automation or AI only where it gives that time back.",
  effort: "About 5–8 minutes.",
  principles: [
    "See the work people actually do.",
    "Measure the time it costs.",
    "Simplify the process before automating it.",
  ],
} as const;

export const discoveryQuestions = [
  "What task do you hate doing every week?",
  "What do you repeatedly copy and paste?",
  "What takes 30 minutes that feels like it should take 3?",
  "What report do you build over and over?",
  "What information do employees constantly ask someone else for?",
  "Where do customers wait for your team?",
  "Where do mistakes happen because a step is manual?",
  "What happens after a lead, form, email, ticket, order, or request enters the business?",
  "Which processes would stop if one key employee were unavailable?",
] as const;

export const frictionLabels = {
  reentry: "Information entered more than once",
  copying: "Copying data between apps or spreadsheets",
  searching: "Searching for files, policies, or answers",
  repetitive: "The same email, report, or document, again",
  waiting: "Approvals or handoffs that create waiting",
  onboarding: "Manual customer or employee onboarding",
  scheduling: "Scheduling, follow-up, reminders, or status checks",
  calculations: "Repeated calculations, estimates, or summaries",
  spreadsheet_app: "A spreadsheet acting as an unofficial app",
  single_person: "Only one person knows the next step",
  errors: "Mistakes because a step is manual",
  customer_wait: "Customers waiting, where self-service could be faster",
  low_value: "Skilled people doing low-value admin",
} as const satisfies Record<Friction, string>;

export const sections = {
  observe: {
    nav: "Observe",
    number: "01",
    title: "Where are people losing time?",
    lead: "Name a workflow the team repeats. The useful question is not where to install AI. It is where people are spending time the business is already paying for.",
    prompt: "What work takes far longer than it should?",
    workflowLabel: "The workflow",
    workflowPlaceholder: "The work that keeps getting repeated…",
    hoursLabel: "Current effort",
    frequencyLabel: "How often",
    frictionLabel: "What’s getting in the way?",
    peopleLabel: "People doing this",
    frustrationLabel: "How disruptive is it?",
    frustrationHint: "1 is a mild annoyance. 5 stops other work.",
    judgmentLabel: "This step needs sensitive judgment or touches high-risk data.",
    questionsLabel: "Start from a question, if one fits.",
  },
  protect: {
    nav: "Protect",
    number: "02",
    title: "What should stay human?",
    lead: "Some steps should not be automated. Judgment, trust, and a personal decision are often the valuable part of the work.",
    prompt: "Where would removing the person make the outcome worse?",
    helper:
      "Think of final approvals, sensitive conversations, hiring decisions, and exceptions that need a person.",
    placeholder: "A step that should stay with a person…",
    examples: [
      "A difficult conversation with a customer",
      "The final decision on hiring someone",
    ],
  },
  capacity: {
    nav: "Capacity",
    number: "03",
    title: "What would the team do with the time back?",
    lead: "Recovered time is capacity for customers, delivery, and growth. It is not an automatic payroll cut.",
    prompt: "What would your team do with an extra five hours a week?",
    placeholder: "Work the team would take on if this time came back…",
    examples: [
      "More time with customers and open projects",
      "Faster follow-up on leads and estimates",
    ],
    contextTitle: "Your team",
    contextLead:
      "Optional. We use this only to illustrate recovered capacity. It is not a payroll cut.",
    teamSizeLabel: "People on the team",
    hourlyLabel: "Loaded cost per hour",
    hourlyHint: "Leave this blank to use $50, the example rate.",
  },
  map: {
    nav: "Map",
    title: "Your Busy Work Map",
    lead: "Here’s what you named. Submit the map and we’ll review the workflows and follow up. You can also email yourself a copy.",
    emailCta: "Submit my map",
    emailHelper: "We’ll review the workflows and follow up.",
    copyLabel: "Email me a copy of this map.",
    alreadySubmitted:
      "You already submitted this map. Change a workflow if you want to send an update.",
  },
} as const;

export const categoryCopy = {
  quick_win: {
    name: "Quick Win",
    action: "Prioritize early",
    definition: "Low complexity, clear value, short implementation path.",
  },
  high_impact: {
    name: "High Impact",
    action: "Build the business case and implement",
    definition: "Significant measurable savings or capacity recovery.",
  },
  strategic: {
    name: "Strategic",
    action: "Roadmap and phase",
    definition: "A larger change that can materially transform operations.",
  },
  leave_alone: {
    name: "Leave Alone",
    action: "Do not automate simply because we can",
    definition: "Low return, high risk, or a place where human judgment is more valuable.",
  },
} as const;

export const scoreLabels = {
  time: "Time",
  frequency: "Frequency",
  cost: "Cost",
  friction: "Friction",
  potential: "Automation potential",
} as const;

export const roiCopy = {
  title: "Recovered capacity",
  preliminary: "Preliminary — we confirm this after reviewing the work.",
  current: (hours: number) =>
    `About ${hours} person-hours a month in the workflows you measured.`,
  recoverable: (hours: number) =>
    `About ${hours} of those hours a month look recoverable. That is ${Math.round(hours * 12)} hours a year.`,
  value: (amount: string) =>
    `At the rate below, that is about ${amount} of annual capacity — time you are already paying for, pointed at customers, delivery, and growth.`,
  disclaimer:
    "This is recovered capacity, not a guaranteed payroll saving. Daily effort is counted across 20 working days, and weekly effort across 4 weeks. A step marked for judgment stays with people.",
  rate: (amount: string) => `Using ${amount} per hour.`,
  illustration: (people: number, hours: string, amount: string) =>
    `If each of your ${people} people got 3 hours a week back, that is ${hours} hours a year, about ${amount} of capacity.`,
  metricsTitle: "How we will measure it",
  metrics: [
    "Hours recovered per month",
    "Time-to-complete before vs. after",
    "Number of manual steps removed",
    "Error and rework reduction",
    "Response time improvement",
    "Employee interruptions avoided",
    "Additional customer or project capacity",
    "Additional bids, estimates, or transactions processed",
    "Reduction in dependency on key individuals",
    "Adoption rate of the new workflow",
  ],
} as const;

export const nextSteps = [
  { name: "Find", outcome: "The highest-value opportunities, in order." },
  { name: "Redesign", outcome: "A simpler process before any technology." },
  { name: "Automate", outcome: "The improvement that fits the workflow." },
  { name: "Measure again", outcome: "What actually changed, and what to do next." },
] as const;

export const mapCopy = {
  columns: {
    workflow: "Workflow",
    effort: "Current effort",
    problem: "Problem",
    solution: "Potential solution",
    impact: "Business impact",
    category: "Category",
  },
  emptyWorkflows: "No workflows yet. Add one in Observe.",
  timeLabel: "Time in these workflows",
  hoursIdentified: (hours: number) =>
    hours > 0
      ? `About ${hours} hours a month in the workflows you measured`
      : "Add a time estimate on a workflow to see the monthly effort.",
  hoursDisclaimer:
    "This is time the work takes today, not a guaranteed savings figure. Daily effort is counted across 20 working days, and weekly effort across 4 weeks. We look at the workflow before estimating what can actually come back.",
  protect: "Keep with people",
  capacity: "Time back would go to",
  solutionNote:
    "A solution comes after we see the work. It might be a simpler process, a form, an integration, Microsoft 365, or AI. Automating a bad process only makes a bad process faster.",
  primaryCta: "Review this map with us",
  secondaryCta: "See How It Works",
  outcome:
    "End Your Busy Work. Find the work that should not require people. Give your team their time back.",
} as const;

export const workshopSteps = [
  "observe",
  "protect",
  "capacity",
  "map",
] as const;

export type WorkshopStep = (typeof workshopSteps)[number];
