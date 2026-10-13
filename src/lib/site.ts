export const site = {
  name: "Ai.neck",
  url: "https://itneck.ai",
  tagline: "End Your Busy Work.",
  description:
    "Ai.neck finds where a business is losing time, then uses AI and automation to give that time back.",
  email: "support@itneck.com",
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
  { label: "How It Works", href: "/how-it-works" },
  { label: "Team", href: "/team" },
  { label: "Ai.neck University", href: "/university" },
] as const;

export const footerNav = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Discover", href: "/how-it-works/discover" },
  { label: "Build", href: "/how-it-works/build" },
  { label: "Optimize", href: "/how-it-works/optimize" },
  { label: "Team", href: "/team" },
  { label: "Ai.neck University", href: "/university" },
  { label: "End Your Busy Work", href: "/EndYourBusywork" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
] as const;

export function publicOrigin(): string {
  const fromEnv = process.env.SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return site.url;
}

export function absoluteUrl(path: string, origin = publicOrigin()): string {
  const base = origin.replace(/\/$/, "");
  return `${base}${path === "/" ? "" : path}`;
}
