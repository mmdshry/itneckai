export const guideTitle = "The AI Enterprise Guide";

export const guideDescription =
  "Buy the workflow, not the logo. ChatGPT Enterprise, Microsoft Copilot, and Claude Team compared on price, security, and ROI — with lessons to watch and the field notes below.";

export const guidePdf = {
  href: "/university/ai-enterprise-guide.pdf",
  filename: "ai-enterprise-guide.pdf",
} as const;

export const guideChapters = [
  { id: "hook", label: "Hook" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "copilot", label: "Copilot" },
  { id: "claude", label: "Claude" },
  { id: "matrix", label: "Matrix" },
  { id: "roi", label: "ROI" },
  { id: "verdict", label: "Verdict" },
] as const;

export const hookCards = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    detail: "Enterprise",
  },
  {
    id: "copilot",
    name: "Copilot",
    detail: "Microsoft 365",
  },
  {
    id: "claude",
    name: "Claude",
    detail: "Team",
  },
] as const;

export const guideTools = [
  {
    id: "chatgpt",
    kicker: "Option 1 of 3",
    title: "ChatGPT Enterprise",
    badge: "Automation Engine",
    points: [
      "Fastest content output & SOP workflows",
      "Custom GPTs built on your processes",
    ],
    price: "~$60/seat/mo (~150-seat min)",
  },
  {
    id: "copilot",
    kicker: "Option 2 of 3",
    title: "Microsoft Copilot",
    badge: "Inside Microsoft 365",
    points: [
      "Zero workflow change (Word, Excel, Teams, Outlook)",
      "Inherits M365 security & permissions",
    ],
    price: "$30/seat/mo + base license",
  },
  {
    id: "claude",
    kicker: "Option 3 of 3",
    title: "Claude Team",
    badge: "Deep Analysis & Precision",
    points: [
      "Massive document analysis & long-form reasoning",
      "Highest data accuracy for code & contracts",
    ],
    price: "$25/seat/mo (5-seat min)",
  },
] as const;

export const matrixColumns = ["ChatGPT", "Copilot", "Claude"] as const;

export const matrixRows = [
  {
    label: "Best for",
    cells: ["Automation", "Microsoft 365", "Deep analysis"],
  },
  {
    label: "Workflow",
    cells: ["Custom GPTs & SOPs", "Zero change", "Long-form reasoning"],
  },
  {
    label: "Seat / mo",
    cells: ["~$60", "$30 + base license", "$25"],
    emphasize: true,
  },
  {
    label: "Minimum",
    cells: ["~150 seats", "M365 base", "5 seats"],
  },
] as const;

export const securityNote = {
  lead: "Data excluded from AI training by default:",
  answer: "YES",
  detail: "(SOC 2, GDPR, HIPAA ready)",
} as const;

export const priceNote =
  "These seat prices are the figures in the guide, not a quote.";

export const roiSteps = ["Pilot", "Measure", "Scale"] as const;

export const tagline = ["Elevate.", "Secure.", "Scale."] as const;

export type MediaKind = "video" | "audio" | "pdf";

export type MediaLesson = {
  id: string;
  title: string;
  summary: string;
  kind: MediaKind;
  href: string;
  length: string;
  portrait?: boolean;
  downloadName?: string;
};

export const mediaLessons: MediaLesson[] = [
  {
    id: "guide-video",
    title: "The AI Enterprise Guide",
    summary:
      "The narrated walkthrough: buy the workflow, then compare price, seats, and which tool to pilot.",
    kind: "video",
    href: "/university/ai-enterprise-guide.mp4",
    length: "7 min",
  },
  {
    id: "guide-pdf",
    title: "The AI Enterprise Guide (PDF)",
    summary:
      "The 2026 comparison of ChatGPT Enterprise, Microsoft Copilot, and Claude Team — pricing, security, and ROI.",
    kind: "pdf",
    href: guidePdf.href,
    downloadName: guidePdf.filename,
    length: "10 pages",
  },
  {
    id: "busywork-audio",
    title: "How AI Can End Corporate Busywork",
    summary: "A spoken lesson on ending corporate busywork.",
    kind: "audio",
    href: "/university/end-corporate-busywork.m4a",
    length: "20 min",
  },
  {
    id: "read-write",
    title: "How AI's Read-Write Boundary Works",
    summary:
      "The agent reads company files in a read-only zone. A person approves. The write leaves only after that.",
    kind: "video",
    href: "/university/read-write-boundary.mp4",
    length: "1 min",
    portrait: true,
  },
  {
    id: "itu-1",
    title: "ChatGPT, Copilot, and Claude",
    summary:
      "Ten seconds on the job each tool is built for: automation, daily office work, or heavy analysis.",
    kind: "video",
    href: "/university/itu-1.mp4",
    length: "10 sec",
  },
  {
    id: "explainer",
    title: "The Explainer",
    summary:
      "Where a team loses hours — searching, chasing, meetings — and the time that comes back.",
    kind: "video",
    href: "/university/the-explainer.mp4",
    length: "5 min",
  },
];
