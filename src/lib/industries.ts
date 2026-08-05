import type { CopilotProduct } from "@/lib/copilot-agents";

export type RelatedProductSlug = CopilotProduct["slug"];

export type Industry = {
  slug: string;
  name: string;
  short: string;
  /** Decision-maker we speak to on this vertical */
  buyer: string;
  /** One-line hook used on the industries hub */
  hook: string;
  title: string;
  metaDescription: string;
  headline: string;
  intro: string;
  focusAreas: { name: string; detail: string }[];
  agentPatterns: { name: string; detail: string; groundedIn: string }[];
  howWeHelp: string[];
  relatedProducts: RelatedProductSlug[];
};

export const industries: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare",
    short: "HEALTHCARE",
    buyer: "Ops, compliance, and IT leaders",
    hook: "For ops and compliance leaders: policy and admin knowledge that stays inside your Microsoft 365 permissions — HIPAA-aware tenants.",
    title: "Healthcare Copilot Studio Agents | ai.neck",
    metaDescription:
      "Copilot Studio agents for healthcare administration: policy Q&A, credentialing docs, and HIPAA-aware Microsoft 365 knowledge assistants. By ai.neck.",
    headline:
      "Agents that answer from your current policies — without leaving your Microsoft 365 security boundary.",
    intro:
      "Healthcare teams already keep policies, credentialing files, and administrative procedures in SharePoint and Teams. Copilot Studio agents ground answers in that content, inherit existing permissions, and cite the source document — so staff get the current version instead of a stale copy in email. We design those agents for administrative and knowledge workflows on Microsoft 365; clinical diagnosis is out of scope. Priority surfaces below are where we usually start — not a hard limit on what we can build.",
    focusAreas: [
      {
        name: "HIPAA",
        detail:
          "Microsoft 365 and Azure offer HIPAA Business Associate Agreements and compliance documentation for covered entities that configure the platform correctly. Agents we build stay inside your tenant, use Graph grounding with your permission model, and do not invent a bypass around DLP or access controls you already enforce.",
      },
    ],
    agentPatterns: [
      {
        name: "SharePoint policy and procedure Q&A",
        detail:
          "Staff ask plain-language questions about scheduling rules, credentialing steps, or administrative policies. A Copilot Studio agent grounded in SharePoint libraries answers from the controlled document set and cites the source file — the same document Q&A pattern Microsoft documents for SharePoint knowledge agents.",
        groundedIn: "SharePoint + Copilot Studio",
      },
      {
        name: "Teams channel knowledge assistant",
        detail:
          "An agent in an operations or compliance channel that answers from approved SharePoint content during the conversation where the question came up — matching Microsoft’s Teams-embedded agent pattern, without opening a separate portal.",
        groundedIn: "Teams + SharePoint",
      },
      {
        name: "Outlook meeting prep from permitted mail and files",
        detail:
          "Before credentialing reviews or vendor calls, a Copilot Studio agent for Outlook assembles recent correspondence and linked documents the user is already allowed to see — grounded in Graph data, not the open web. Complements Microsoft’s licensed Microsoft 365 Copilot features; it does not replace that SKU.",
        groundedIn: "Outlook + Microsoft Graph",
      },
    ],
    howWeHelp: [
      "Map which SharePoint libraries and Teams sites should ground the agent",
      "Build Copilot Studio agents that inherit your existing Microsoft 365 permissions",
      "Wire Power Automate only where intake or routing already belongs in your process",
      "Keep scope on administrative and knowledge work — not clinical decision support",
    ],
    relatedProducts: ["sharepoint", "teams", "outlook", "microsoft-365"],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    short: "PRO SERVICES",
    buyer: "Managing partners and firm IT",
    hook: "For managing partners: billable hours back when Copilot Studio agents prep from Outlook, SharePoint, and engagement archives.",
    title: "Professional Services Copilot Studio Agents | ai.neck",
    metaDescription:
      "Copilot Studio agents for law firms, CPA firms, and consultants: engagement briefings, matter Q&A, and Outlook triage grounded in Microsoft 365. By ai.neck.",
    headline:
      "Client work runs on documents and deadlines. Agents that read yours give billable staff their time back.",
    intro:
      "Professional services firms already live in Outlook, SharePoint, and Teams. Copilot Studio agents that ground answers in engagement archives, matter files, and firm policies — while respecting who can see which library — match how Microsoft positions knowledge agents and meeting prep for document-heavy teams. Priority surfaces below are where we usually start — not a hard limit on what we can build.",
    focusAreas: [
      {
        name: "Law firms",
        detail:
          "Matter correspondence, precedent libraries, and closing binders are permission-sensitive SharePoint content. Agents answer only from what the asking attorney or staffer can already access — the permission-aware Graph grounding model Microsoft documents for Copilot Studio.",
      },
      {
        name: "CPA firms",
        detail:
          "Engagement letters, workpapers, and recurring client Q&A live across mail and file libraries. Agents that draft from firm templates and surface the right prior-year file reduce chase time before every deadline.",
      },
      {
        name: "Consultants",
        detail:
          "Proposal libraries, delivery playbooks, and client status threads become a single knowledge surface when a Graph-grounded agent can assemble answers across SharePoint, Teams, and Outlook.",
      },
    ],
    agentPatterns: [
      {
        name: "Engagement and matter document Q&A",
        detail:
          "Ask what the engagement letter says about scope, or where the latest deliverable lives. The agent answers from SharePoint libraries with citations — Microsoft’s documented SharePoint knowledge-agent pattern applied to client workspaces.",
        groundedIn: "SharePoint + Copilot Studio",
      },
      {
        name: "Outlook triage and meeting-prep briefings",
        detail:
          "Incoming client mail prioritized; before a partner meeting, a Copilot Studio agent for Outlook pulls recent threads and linked files the user can access — the triage and meeting-prep pattern Microsoft documents for Microsoft 365, delivered as a custom Studio agent grounded in your firm data.",
        groundedIn: "Outlook + Microsoft Graph",
      },
      {
        name: "Teams intake and approval Adaptive Cards",
        detail:
          "New-matter intake, conflict checks, or expense approvals submitted as Adaptive Cards in Teams, with Power Automate executing the routing and audit trail — a documented Copilot Studio + Power Platform workflow pattern.",
        groundedIn: "Teams + Power Automate",
      },
    ],
    howWeHelp: [
      "Identify high-churn libraries (proposals, playbooks, matter templates) for grounding",
      "Build permission-aware Copilot Studio agents for partners and staff",
      "Connect Outlook and Teams workflows where intake already creates delays",
      "Keep answers cited to firm documents — not open-web improvisation",
    ],
    relatedProducts: [
      "sharepoint",
      "outlook",
      "teams",
      "onedrive",
      "microsoft-365",
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    short: "MANUFACTURING",
    buyer: "Plant ops and quality leaders",
    hook: "For plant ops: SOPs and quality docs answered in Teams — grounded in the controlled document, not tribal knowledge.",
    title: "Manufacturing Copilot Studio Agents | ai.neck",
    metaDescription:
      "Copilot Studio agents for manufacturing: SOP Q&A in Teams, warehouse and supply-chain document search, and CMMC-aware Microsoft 365 planning. By ai.neck.",
    headline:
      "The controlled SOP is in SharePoint. The question is on the floor. Agents close that gap.",
    intro:
      "Manufacturers store SOPs, quality records, and work instructions in SharePoint, then answer the same questions on the line by tribal knowledge. Copilot Studio agents grounded in those libraries — and available in Teams — follow Microsoft’s documented pattern for operational knowledge assistants. Where CMMC or supply-chain compliance applies, tenant and data boundaries are planned on Microsoft’s published cloud guidance, not invented claims. We prioritize SharePoint, Teams, and Microsoft 365 orchestration first; Outlook agents are available when owner or supplier mail is the bottleneck, but floor Q&A usually ships earlier.",
    focusAreas: [
      {
        name: "ERP",
        detail:
          "ERP remains the system of record for transactions. Agents help people find related procedures, exception playbooks, and training docs in Microsoft 365 that sit beside ERP — via Graph connectors and approved knowledge sources Microsoft documents for Copilot Studio.",
      },
      {
        name: "Production",
        detail:
          "Line supervisors and operators ask procedure questions in Teams; the agent cites the current controlled document instead of a printed binder that may be out of date.",
      },
      {
        name: "Warehouse",
        detail:
          "Receiving, put-away, and inventory exception procedures answered from SharePoint work instructions with source citations.",
      },
      {
        name: "Supply chain",
        detail:
          "Supplier quality manuals, logistics playbooks, and escalation trees become searchable through a Graph-grounded agent for planners who already have access to those libraries.",
      },
      {
        name: "CMMC readiness",
        detail:
          "For manufacturers in the defense supply chain, CMMC and controlled unclassified information requirements drive Microsoft 365 / GCC planning and data boundaries. We help you place agents only on content and tenants that match that plan — we do not claim to certify CMMC compliance.",
      },
    ],
    agentPatterns: [
      {
        name: "Teams SOP assistant grounded in SharePoint",
        detail:
          "Operators ask “what’s the lockout procedure for line 3?” in a Teams channel. The agent answers from the current SOP library and cites the file — Microsoft’s Teams + SharePoint knowledge agent pattern for frontline and operations teams.",
        groundedIn: "Teams + SharePoint",
      },
      {
        name: "Quality and controlled-document Q&A",
        detail:
          "QA and engineering query controlled document libraries without downloading every PDF. Copilot Studio document Q&A with citations keeps the controlled copy authoritative.",
        groundedIn: "SharePoint + Copilot Studio",
      },
      {
        name: "Exception and request Adaptive Cards",
        detail:
          "Material shortages, scrap reports, or maintenance requests submitted via Adaptive Cards in Teams and routed with Power Automate — structured intake instead of lost chat messages.",
        groundedIn: "Teams + Power Automate",
      },
    ],
    howWeHelp: [
      "Select the controlled libraries that should ground floor-facing agents",
      "Deploy Teams-embedded Copilot Studio agents for production and warehouse channels",
      "Align agent scope with any CMMC / GCC tenant boundaries you are planning",
      "Keep ERP as system of record; agents assist with Microsoft 365 knowledge around it",
    ],
    relatedProducts: ["sharepoint", "teams", "microsoft-365"],
  },
  {
    slug: "construction",
    name: "Construction (AEC)",
    short: "CONSTRUCTION",
    buyer: "PMs and field operations leads",
    hook: "For PMs and field leads: RFIs and project files become answerable across the project’s Microsoft 365 footprint.",
    title: "Construction & AEC Copilot Studio Agents | ai.neck",
    metaDescription:
      "Copilot Studio agents for construction and AEC: project document Q&A, Teams field connectivity, and Microsoft 365 project knowledge. By ai.neck.",
    headline:
      "Project documentation is scattered across mail and SharePoint. Agents make it answerable on site.",
    intro:
      "General contractors and specialty trades already run projects on Microsoft 365 — SharePoint project sites, Teams channels, and Outlook threads with owners and subs. Copilot Studio agents that ground answers in that project footprint follow the same Graph-grounded, permission-aware patterns Microsoft documents for cross-app knowledge and Teams assistants. Priority surfaces below are where we usually start — not a hard limit on what we can build.",
    focusAreas: [
      {
        name: "General contractors",
        detail:
          "Project sites hold RFIs, submittals, meeting minutes, and owner correspondence. A Graph-grounded agent assembles status from files and mail the PM is allowed to see.",
      },
      {
        name: "Specialty trades",
        detail:
          "Trade-specific specs, safety procedures, and punch lists live in shared libraries. Agents answer from those sources inside Teams instead of forwarding PDFs in group texts.",
      },
      {
        name: "Field connectivity",
        detail:
          "Field crews already on Teams mobile can query a channel agent for the latest drawing package note or safety procedure — Microsoft’s mobile Teams agent surface applied to jobsite questions.",
      },
      {
        name: "Microsoft 365",
        detail:
          "No new field portal: agents deploy into SharePoint, Teams, and Outlook you already license, inheriting project site permissions.",
      },
    ],
    agentPatterns: [
      {
        name: "Project SharePoint knowledge agent",
        detail:
          "PMs and supers ask where the latest RFI response or submittal lives. The agent answers from the project library with citations — SharePoint document Q&A as Microsoft documents it for Copilot Studio.",
        groundedIn: "SharePoint + Copilot Studio",
      },
      {
        name: "Teams project and field channel agent",
        detail:
          "Questions asked in the project channel get answers grounded in that project’s SharePoint content, available on desktop and mobile Teams — Microsoft’s channel-embedded agent pattern.",
        groundedIn: "Teams + SharePoint",
      },
      {
        name: "Outlook owner and sub correspondence prep",
        detail:
          "Before owner meetings, a Copilot Studio agent for Outlook pulls recent mail and linked project files the user can access — meeting-prep grounded in Graph.",
        groundedIn: "Outlook + Microsoft Graph",
      },
    ],
    howWeHelp: [
      "Ground agents per project site or portfolio library — not the entire tenant by default",
      "Deploy Teams channel agents for office and field crews already on mobile Teams",
      "Respect project permission groups so trade partners only see what they should",
      "Use Power Automate for structured RFI or punch intake when chat is not enough",
    ],
    relatedProducts: ["sharepoint", "teams", "outlook", "microsoft-365"],
  },
  {
    slug: "government-contractors",
    name: "Government Contractors",
    short: "GOVCON",
    buyer: "Compliance and security leads",
    hook: "For compliance leads: CMMC, NIST 800-171, FAR/DFARS, and Microsoft GCC planning — agents only where your tenant boundary allows.",
    title: "Government Contractor Copilot Studio Agents | ai.neck",
    metaDescription:
      "Copilot Studio for government contractors: GCC planning, CMMC-aware Microsoft 365 boundaries, and permission-grounded knowledge agents. By ai.neck.",
    headline:
      "Compliance drives your cloud boundary. Agents have to respect that boundary — or they don’t ship.",
    intro:
      "Government contractors evaluate Microsoft 365 Commercial vs GCC / GCC High based on CMMC, NIST SP 800-171, and FAR/DFARS cyber clauses. Microsoft publishes those cloud and compliance offerings; Copilot Studio availability depends on the environment you choose. We help you plan where agents fit inside that boundary and build Graph-grounded assistants only on approved knowledge sources — we do not issue CMMC certifications or substitute for your assessor. We prioritize SharePoint, Teams, and Microsoft 365 orchestration inside the approved cloud; Outlook agents follow when mail workflows clear the same boundary review.",
    focusAreas: [
      {
        name: "CMMC",
        detail:
          "CMMC requirements shape how Controlled Unclassified Information is stored and who can access it. Agent grounding stays inside libraries and tenants that match your CMMC system security plan.",
      },
      {
        name: "NIST 800-171",
        detail:
          "Access control, audit, and media protection controls in NIST SP 800-171 map to Microsoft 365 configuration and logging. Agents inherit those controls via Graph permissions — they do not create a parallel data path.",
      },
      {
        name: "FAR/DFARS",
        detail:
          "Contract cyber clauses often drive the same cloud and CUI decisions. We align agent scope with the Microsoft environment your contracts require.",
      },
      {
        name: "Microsoft GCC planning",
        detail:
          "Choosing Commercial, GCC, or GCC High is a Microsoft licensing and compliance architecture decision. We help you plan Copilot Studio and agent deployment against Microsoft’s published availability for that cloud.",
      },
    ],
    agentPatterns: [
      {
        name: "Policy and SSP document Q&A inside the approved tenant",
        detail:
          "Staff query security policies, onboarding checklists, and approved procedures stored in SharePoint within the GCC or Commercial tenant you selected — Copilot Studio document grounding with citations, scoped to that environment.",
        groundedIn: "SharePoint + Copilot Studio",
      },
      {
        name: "Permission-aware Graph knowledge assistants",
        detail:
          "Answers filtered by the asking user’s existing SharePoint and Teams permissions — Microsoft’s documented permission inheritance model for Copilot Studio, critical when CUI and non-CUI libraries coexist.",
        groundedIn: "Microsoft Graph",
      },
      {
        name: "Teams request routing with audit trail",
        detail:
          "Access requests and exception approvals via Adaptive Cards and Power Automate, producing structured logs that support operational audit expectations — a standard Power Platform pattern inside your governed tenant.",
        groundedIn: "Teams + Power Automate",
      },
    ],
    howWeHelp: [
      "Clarify Commercial vs GCC / GCC High against your contract and CUI needs",
      "Place Copilot Studio agents only on approved knowledge sources in that cloud",
      "Enforce permission-aware grounding — no agent that bypasses your ACLs",
      "Document what the agent can and cannot answer relative to your SSP",
    ],
    relatedProducts: ["sharepoint", "teams", "microsoft-365"],
  },
  {
    slug: "nonprofits",
    name: "Nonprofits",
    short: "NONPROFITS",
    buyer: "Executive directors and lean IT",
    hook: "For lean nonprofit IT: Microsoft nonprofit licensing and program knowledge — agents that reuse the stack you already get funded for.",
    title: "Nonprofit Copilot Studio Agents | ai.neck",
    metaDescription:
      "Copilot Studio agents for nonprofits: Microsoft 365 nonprofit licensing, SharePoint knowledge assistants, and budget-conscious Teams workflows. By ai.neck.",
    headline:
      "Your grant and program knowledge is already in Microsoft 365. Agents make it usable without a new platform.",
    intro:
      "Eligible nonprofits can obtain Microsoft 365 through Microsoft’s nonprofit licensing programs. Copilot Studio agents that answer from SharePoint policies, program playbooks, and Teams channels reuse that stack — the same Graph-grounded patterns Microsoft documents — so staff and volunteers get answers without buying another knowledge base. We prioritize SharePoint and Teams first (where volunteer and program questions land); Outlook agents are a follow-on when donor or board mail volume justifies them.",
    focusAreas: [
      {
        name: "Microsoft nonprofit licensing",
        detail:
          "Microsoft publishes nonprofit offers for Microsoft 365. We help you design agents against the apps and licenses you actually hold — including where Copilot Studio requires additional SKUs.",
      },
      {
        name: "Budget-conscious IT",
        detail:
          "Prefer agents inside Teams and SharePoint you already run over new SaaS portals. One grounded assistant often replaces a stack of tribal FAQ docs.",
      },
      {
        name: "Security",
        detail:
          "Donor, beneficiary, and HR files stay behind existing SharePoint permissions and Microsoft 365 security controls. Agents inherit that model instead of copying data elsewhere.",
      },
    ],
    agentPatterns: [
      {
        name: "Program and policy SharePoint assistant",
        detail:
          "Staff and volunteers ask about grant procedures, volunteer handbooks, or board policies. Copilot Studio answers from SharePoint with citations to the current document.",
        groundedIn: "SharePoint + Copilot Studio",
      },
      {
        name: "Teams volunteer and program channel agent",
        detail:
          "Questions in program channels get answers grounded in approved libraries — Microsoft’s Teams-embedded agent pattern for distributed teams.",
        groundedIn: "Teams + SharePoint",
      },
      {
        name: "Help-desk style Adaptive Card intake",
        detail:
          "IT and facilities requests submitted as Adaptive Cards in Teams and routed with Power Automate — structured tickets without a separate help-desk product when volume is modest.",
        groundedIn: "Teams + Power Automate",
      },
    ],
    howWeHelp: [
      "Align agent scope with your Microsoft nonprofit licensing and Copilot Studio entitlements",
      "Ground assistants in program and policy libraries staff already use",
      "Keep donor and sensitive data behind existing Microsoft 365 permissions",
      "Start with one high-churn FAQ surface before expanding",
    ],
    relatedProducts: ["sharepoint", "teams", "microsoft-365"],
  },
  {
    slug: "smb",
    name: "Small & Mid-Sized Businesses",
    short: "SMB",
    buyer: "Owners and lean IT leads",
    hook: "For lean Microsoft 365 teams without a big IT staff: Copilot Studio agents on the stack you already pay for.",
    title: "SMB Copilot Studio Agents | ai.neck",
    metaDescription:
      "Copilot Studio agents for small and mid-sized businesses: help-desk bots in Teams, SharePoint knowledge assistants, and Microsoft 365 workflows. By ai.neck.",
    headline:
      "You already run the business on Microsoft 365. Agents turn that stack into answers and intake — not another login.",
    intro:
      "SMBs use Microsoft 365 for mail, files, and chat every day — often without a large IT department. Copilot Studio agents for FAQ, policy Q&A, and Adaptive Card intake are the same patterns Microsoft documents for Teams and SharePoint — sized to a lean team instead of an enterprise CoE. OneDrive is a priority here because personal drives often hold the only copy of critical drafts. Priority surfaces below are where we usually start — not a hard limit on what we can build.",
    focusAreas: [
      {
        name: "Workplace knowledge",
        detail:
          "Standard operating procedures, onboarding checklists, and how-to docs in SharePoint become a single assistant instead of a tribal chat thread with the one person who knows.",
      },
      {
        name: "Security awareness",
        detail:
          "Security awareness policies and incident reporting procedures answered from the approved library; sensitive security runbooks stay permission-gated via Graph.",
      },
      {
        name: "Files and cloud",
        detail:
          "OneDrive and SharePoint organization, retention labels, and cross-app orchestration on Microsoft Graph — file chaos becomes searchable knowledge.",
      },
      {
        name: "First-line intake",
        detail:
          "Password reset FAQ, device setup guides, and ticket intake via Teams Adaptive Cards plus Power Automate — Microsoft’s documented help-desk style agent pattern for lean teams.",
      },
    ],
    agentPatterns: [
      {
        name: "IT and HR knowledge agent in SharePoint",
        detail:
          "Employees ask common IT and workplace questions; the agent answers from current policy and how-to libraries with citations — SharePoint knowledge agents as Microsoft documents them for Copilot Studio.",
        groundedIn: "SharePoint + Copilot Studio",
      },
      {
        name: "Teams help-desk Adaptive Cards",
        detail:
          "Support requests submitted as structured cards in Teams, routed with Power Automate into the queue or mailbox you already use — no separate portal for first-line intake.",
        groundedIn: "Teams + Power Automate",
      },
      {
        name: "Outlook triage for a lean inbox",
        detail:
          "Shared mailboxes and owner inboxes get prioritization and draft replies grounded in company FAQs and past correspondence — a Copilot Studio agent for Outlook sized to small-team volume.",
        groundedIn: "Outlook + Microsoft Graph",
      },
    ],
    howWeHelp: [
      "Pick the top repeated IT and ops questions worth grounding first",
      "Deploy a Teams help-desk agent with Adaptive Card intake",
      "Keep everything inside your existing Microsoft 365 tenant and licenses",
      "Expand to Outlook and cross-app agents only after the FAQ agent sticks",
    ],
    relatedProducts: [
      "sharepoint",
      "teams",
      "outlook",
      "onedrive",
      "microsoft-365",
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function getIndustriesForProduct(
  productSlug: RelatedProductSlug,
): Industry[] {
  return industries.filter((i) => i.relatedProducts.includes(productSlug));
}
