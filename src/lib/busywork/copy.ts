export const BUSYWORK_PATH = "/EndYourBusywork" as const;

export const persistLine =
  "One idea at a time. We’ll review your answers and follow up with you.";

export const joinCopy = {
  title: "Join the workshop",
  body: "We’ll email you a private link to start. No password. After you submit, our team reviews your ideas and gets in touch.",
  consent:
    "I agree to receive a sign-in link by email. ai.neck will use my answers to follow up about AI opportunities. You will not be added to a marketing list.",
} as const;

export const experience = {
  name: "End Your Busywork",
  eyebrow: "End Your Busywork",
  headline:
    "Find the work AI should handle — and protect the work only humans should do.",
  supporting:
    "In a few guided questions, identify repetitive work to automate, expert work AI can accelerate, and the first agents you would hire to make your business run better.",
  promise:
    "Redesign how work gets done. Automate the repetitive. Amplify the valuable. Protect the human.",
  effort: "About 5–8 minutes.",
  microcopy:
    "See where AI can remove repetitive work, strengthen your best work, and help design the agents your business actually needs.",
} as const;

export const sections = {
  value: {
    nav: "Value",
    number: "01",
    title: "What’s your high-value work? What’s your busywork?",
    lead: "High-value work is the work only you can do best. Busywork is what keeps you from doing more of it.",
    prompt:
      "What work creates the most value for you — and what work keeps pulling you away from it?",
    highValueLabel: "High-value work",
    highValueHelper: "What do you wish you had more time to do?",
    highValuePlaceholder: "Work where I create the most value…",
    busyworkLabel: "Busywork",
    busyworkHelper: "What work keeps getting in the way?",
    busyworkPlaceholder: "Work that keeps pulling me away…",
    examples: [
      "Following up on emails and updating records",
      "Preparing reports and entering data into different systems",
    ],
  },
  boundary: {
    nav: "Boundary",
    number: "02",
    title: "What should always stay human?",
    lead: "Think of the moments where your judgment, trust, empathy, or personal connection matters most — work you would never want AI to fully take over.",
    prompt: "What should always remain human?",
    helper:
      "Think: trust, empathy, sensitive conversations, final approvals, leadership judgment, strategic decisions.",
    placeholder: "Moments that need my judgment, trust, or human touch…",
    examples: [
      "Having an important conversation with a customer",
      "Making the final decision on hiring someone",
    ],
  },
  automate: {
    nav: "Automate",
    number: "03",
    title: "What work could AI take off your plate?",
    lead: "What repetitive or routine work do you do over and over that doesn’t require much human judgment or creativity?",
    prompt: "What repetitive task would you gladly never do manually again?",
    placeholder: "A repetitive task AI could handle for me…",
    hoursLabel: "Hours per week",
    hoursPlaceholder: "e.g. 8",
    examples: [
      "Entering the same information into different systems",
      "Sending routine follow-ups or reminders",
    ],
  },
  amplify: {
    nav: "Amplify",
    number: "04",
    title: "Where could AI make you superhuman?",
    lead: "What important work depends on your expertise, but takes too much time to research, prepare, or organize before you can do the part that really matters?",
    prompt: "Where are you the expert, but preparation consumes most of the time?",
    placeholder: "A task where AI could help me prepare, analyze, or perform better…",
    prepLabel: "Preparation time per week",
    performanceLabel: "Decision / performance time per week",
    bottleneck:
      "Your expertise is not the bottleneck. Preparation is.",
    examples: [
      "Preparing reports and research before an important client meeting",
      "Reviewing lots of information before making a business decision",
    ],
  },
  agent: {
    nav: "Agent",
    number: "05",
    title: "What would you hire someone to handle?",
    lead: "If you could hire one capable A player today, what would you want them to completely take off your plate?",
    prompt: "What would you never want to think about again?",
    responsibilitiesLabel: "What they would do",
    responsibilitiesPlaceholder: "A responsibility I’d want completely off my plate…",
    kpiLabel: "How to measure",
    kpiPlaceholder: "How I’d know it’s working well…",
    examples: [
      "Following up with leads and keeping the CRM updated",
      "Preparing weekly reports and sending updates to the team",
    ],
  },
  ideas: {
    nav: "My Ideas",
    title: "My ideas",
    lead: "Here’s everything you entered. Submit these ideas to our team — we’ll review them and get in touch. You can also email yourself a copy.",
    emailCta: "Submit my ideas",
    emailHelper: "We’ll review what you entered and follow up.",
    copyLabel: "Email me a copy of the ideas I entered.",
  },
} as const;

export const mapCopy = {
  title: "Your AI Opportunity Map",
  intro:
    "You’ve identified what should stay human, what can be automated, and where AI can amplify your expertise. These ideas are the starting specification for the AI agents and automations your business actually needs.",
  protect: "Protect",
  protectHint: "Always-human work",
  automate: "Automate",
  automateHint: "Robot tasks",
  amplify: "Amplify",
  amplifyHint: "Superhuman moments",
  build: "Build",
  buildHint: "AI-agent roles",
  timeLabel: "Time opportunity",
  hoursIdentified: (hours: number) =>
    `${hours} hours/week identified as automation opportunity`,
  hoursDisclaimer:
    "This is current time spent on the tasks you named — not a guaranteed savings figure. We assess the workflow before estimating what can actually be automated.",
  primaryCta: "Turn my best idea into an AI agent",
  secondaryCta: "Explore more",
  outcome:
    "You’ve identified where AI can help redesign how work gets done: automate the repetitive, amplify the valuable, and protect the human work that matters most.",
} as const;

export const workshopSteps = [
  "value",
  "boundary",
  "automate",
  "amplify",
  "agent",
  "ideas",
] as const;

export type WorkshopStep = (typeof workshopSteps)[number];
