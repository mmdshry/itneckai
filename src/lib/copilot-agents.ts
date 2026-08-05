export type CopilotProduct = {
  slug: string;
  name: string;
  /** Short label used in the Agent Graph and status pills */
  short: string;
  icon: "sharepoint" | "teams" | "onedrive" | "m365" | "outlook";
  title: string;
  metaDescription: string;
  headline: string;
    /** Before → after pain hook for marketing surfaces */
    painHook: string;
  whatWeBuild: string;
  useCases: { name: string; detail: string }[];
  outcomes: string[];
};

export const copilotProducts: CopilotProduct[] = [
  {
    slug: "sharepoint",
    name: "SharePoint",
    short: "SHAREPOINT",
    icon: "sharepoint",
      title: "Copilot Studio Agents for SharePoint | ai.neck",
    metaDescription:
        "Custom Copilot Studio agents for SharePoint: document Q&A, intranet knowledge assistants, and permission-aware search. Built by ai.neck in Copilot Studio.",
      headline: "Copilot Studio agents that turn SharePoint into answers, not archives.",
      painHook:
          "Before: the same policy question hits IT and HR every week. After: staff ask in plain language and get a cited answer from the current library — permissions intact.",
    whatWeBuild:
        "Most companies store years of policies, procedures, and project documents in SharePoint — and nobody can find any of it. We build Copilot Studio agents that ground their answers in your SharePoint content, respect your existing permission model, and respond inside the tools your team already has open.",
    useCases: [
      {
        name: "Document Q&A agents",
        detail:
          "Employees ask a question in plain language; the agent answers from your document libraries and cites the source file, so people stop re-asking IT and HR the same questions.",
      },
      {
        name: "Intranet knowledge assistants",
        detail:
          "A single assistant on your intranet home page that knows your policies, benefits, onboarding docs, and procedures — and always points to the current version.",
      },
      {
        name: "Permission-aware search agents",
        detail:
          "Answers are filtered by the asking user's SharePoint permissions. Someone without access to a library never sees content from it — the agent inherits your security model instead of bypassing it.",
      },
    ],
    outcomes: [
      "Fewer repeated questions to IT, HR, and operations",
      "One authoritative answer instead of five stale copies of a document",
      "Existing SharePoint permissions enforced automatically",
    ],
  },
  {
    slug: "teams",
    name: "Teams",
    short: "TEAMS",
    icon: "teams",
      title: "Copilot Studio Agents for Microsoft Teams | ai.neck",
    metaDescription:
        "Custom Copilot Studio agents for Microsoft Teams: meeting-embedded assistants, approval workflow bots, and Adaptive Card request forms. Built by ai.neck in Copilot Studio.",
      headline: "Copilot Studio agents that work where your team already talks.",
      painHook:
          "Before: approvals die in chat and inboxes. After: requests land as Adaptive Cards in the channel, routed with Power Automate and a full audit trail.",
    whatWeBuild:
        "Teams is where decisions happen, so it is where agents earn their keep. We build Copilot Studio agents that join channels and meetings as first-class participants: answering questions, routing approvals, and turning chat messages into structured, tracked requests via Adaptive Cards.",
    useCases: [
      {
        name: "Meeting-embedded agents",
        detail:
          "An agent available during and after meetings that answers questions about the project, pulls relevant documents, and drafts follow-up items — grounded in your company data, not the open internet.",
      },
      {
        name: "Channel-based approval and workflow bots",
        detail:
          "Purchase requests, access requests, and sign-offs handled in the channel where they come up, with the approval chain executed through Power Automate and a full audit trail.",
      },
      {
        name: "Adaptive Card request forms",
        detail:
          "Leave requests, IT tickets, and facilities requests submitted through structured cards inside Teams — no separate portal, no email thread, and the data lands in the right system every time.",
      },
    ],
    outcomes: [
      "Requests get structured data from the start instead of free-text chat",
      "Approvals stop dying in inboxes",
      "No new portal for employees to learn or forget",
    ],
  },
  {
    slug: "onedrive",
    name: "OneDrive",
    short: "ONEDRIVE",
    icon: "onedrive",
      title: "Copilot Studio Agents for OneDrive | ai.neck",
    metaDescription:
        "Custom Copilot Studio agents for OneDrive: file summarization, smart organization and retention, and content classification. Built by ai.neck in Copilot Studio.",
      headline: "Copilot Studio agents that keep personal file storage from becoming a liability.",
      painHook:
          "Before: work-in-progress files vanish into personal drives. After: summaries, labels, and moves to the right SharePoint library happen with an agent — not a cleanup weekend.",
    whatWeBuild:
        "OneDrive is where work-in-progress lives — and where documents quietly go to disappear. We build Copilot Studio agents that summarize, classify, and organize files as they accumulate, so knowledge stays findable and retention policy is applied by software instead of by hope. Highest leverage for lean teams and document-heavy practices where personal drives hold critical drafts.",
    useCases: [
      {
        name: "File-summary agents",
        detail:
          "Ask for the gist of a 60-page proposal or the differences between two contract drafts and get a grounded summary with pointers to the relevant sections.",
      },
      {
        name: "Smart organization and retention agents",
        detail:
          "Agents that flag stale files, suggest moves to the correct SharePoint library, and apply retention labels based on content — keeping personal storage compliant without manual cleanup drives.",
      },
      {
        name: "Content-classification assistants",
        detail:
          "Automatic tagging of documents by type, client, and sensitivity as they are created, so downstream search, DLP, and governance tooling actually has metadata to work with.",
      },
    ],
    outcomes: [
      "Institutional knowledge stops leaving with departing employees",
      "Retention and sensitivity labels applied consistently",
      "Less time spent hunting for the right version of a file",
    ],
  },
  {
    slug: "microsoft-365",
    name: "Microsoft 365",
    short: "M365",
    icon: "m365",
      title: "Copilot Studio Agents for Microsoft 365 | ai.neck",
    metaDescription:
        "Cross-app Copilot Studio agents for Microsoft 365 that read and write across the Graph: orchestration across Teams, SharePoint, Outlook, and OneDrive. Built by ai.neck in Copilot Studio.",
      headline: "One Copilot Studio agent, every app: orchestration across the Microsoft Graph.",
      painHook:
          "Before: onboarding or status checks bounce between apps by hand. After: one agent coordinates SharePoint, Teams, Outlook, and OneDrive end to end — still inside your Graph permissions.",
    whatWeBuild:
        "The highest-value agents don't live in one app — they coordinate several. Using Microsoft Graph connectors, Power Platform, and Copilot Studio, we build agents that read and write across Teams, SharePoint, Outlook, and OneDrive to execute complete business processes, not just answer questions.",
    useCases: [
      {
        name: "Cross-app orchestration agents",
        detail:
          "A single request — \"onboard this new hire\" — triggers the agent to create the SharePoint workspace, schedule Outlook meetings, post the Teams welcome, and assign the checklist, end to end.",
      },
      {
        name: "Company-wide knowledge agents",
        detail:
          "One assistant that answers from everything the asking user can access across the Graph — files, mail, chats, and sites — instead of one silo at a time.",
      },
      {
        name: "Process status and reporting agents",
        detail:
          "Ask where a client project stands and the agent assembles the answer from the project site, recent mail threads, and channel activity — with links to every source.",
      },
    ],
    outcomes: [
      "Multi-step processes execute without a human relay between apps",
      "Answers draw on all permitted sources, not one silo",
      "Existing Microsoft 365 licensing and security model, fully reused",
    ],
  },
  {
    slug: "outlook",
    name: "Outlook",
    short: "OUTLOOK",
    icon: "outlook",
      title: "Copilot Studio Agents for Outlook | ai.neck",
    metaDescription:
        "Custom Copilot Studio agents for Outlook: inbox triage, meeting-prep briefings, and auto-drafted replies grounded in company data. Built by ai.neck in Copilot Studio.",
      headline: "Copilot Studio agents that give your team their inbox back.",
      painHook:
          "Before: meeting prep is a late-night scramble across mail and files. After: a Graph-grounded brief lands before you walk in — drafted by a Copilot Studio agent, reviewed by you.",
    whatWeBuild:
        "Email is still where external business happens, and it is still where hours disappear. We build Copilot Studio agents for Outlook that triage, brief, and draft — grounded in your company's actual data — so people spend their attention on judgment calls, not sorting. These are custom Studio agents, not a substitute for Microsoft’s licensed Microsoft 365 Copilot SKU.",
    useCases: [
      {
        name: "Inbox triage agents",
        detail:
          "Incoming mail categorized, prioritized, and routed by content — customer escalations surfaced immediately, newsletters filed, action items extracted into task lists.",
      },
      {
        name: "Meeting-prep briefings",
        detail:
          "Before each external meeting, the agent assembles a brief: recent correspondence with the attendees, open items, and relevant documents — delivered to your inbox before you walk in.",
      },
      {
        name: "Auto-drafted responses grounded in company data",
        detail:
          "Draft replies to routine requests written from your pricing sheets, policies, and past correspondence — the human reviews and sends, the agent does the assembly.",
      },
    ],
    outcomes: [
      "High-priority mail surfaced instead of buried",
      "Meeting prep happens automatically instead of the night before",
      "Routine replies drafted from company data, reviewed by a human",
    ],
  },
];

export function getProduct(slug: string): CopilotProduct | undefined {
  return copilotProducts.find((p) => p.slug === slug);
}
