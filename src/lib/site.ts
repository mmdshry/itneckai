export const site = {
  name: "ai.neck",
  url: "https://www.itneck.com",
  tagline: "AI That Works Inside the Tools You Already Use.",
  description:
    "ai.neck designs, builds, and deploys custom AI solutions for companies of any size — with specialized depth in Microsoft Copilot Studio and Power Platform. We build agents that live inside SharePoint, Teams, OneDrive, Outlook, and Microsoft 365, so your team gets AI without learning a new tool.",
  email: "Support@ITneck.com",
  phone: "858-740-8878",
  phoneIntl: "+1-858-740-8878",
  address: "San Diego, CA",
  hours: [
    "Monday–Friday, 7:00 AM – 7:00 PM",
    "Saturday, 8:00 AM – 3:00 PM",
  ],
  instagram: "https://www.instagram.com/itneck/",
  linkedin: "https://www.linkedin.com/company/itneck/",
} as const;

export const headerNav = [
  { label: "Solutions", href: "/solutions" },
  { label: "Microsoft Copilot Agents", href: "/solutions/microsoft-copilot-agents" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [
  { label: "Solutions", href: "/solutions" },
  { label: "Microsoft Copilot Agents", href: "/solutions/microsoft-copilot-agents" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
] as const;

export function absoluteUrl(path: string): string {
  return `${site.url}${path === "/" ? "" : path}`;
}
