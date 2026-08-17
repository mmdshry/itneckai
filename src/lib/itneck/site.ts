export const itneckSite = {
  name: "ITneck",
  tagline:
    "We simplify and secure your technology, so your team can stay focused, productive, and moving forward.",
  description:
    "We simplify and secure your technology, so your team can stay focused, productive, and moving forward. Managed IT, cybersecurity, AI, backup, and technology strategy.",
  email: "support@itneck.com",
  phone: "858-740-8878",
  phoneIntl: "+1-858-740-8878",
  address: "San Diego, CA",
  hours: ["Monday–Friday 7:00–19:00", "Saturday 8:00–15:00"],
  instagram: "https://www.instagram.com/itneck/",
  linkedin: "https://www.linkedin.com/company/itneck/",
  x: "https://x.com/ITnecks",
  basePath: "/itneck",
  url: "https://www.itneck.com",
} as const;

export const itneckHeaderNav = [
  { label: "Home", href: "/itneck" },
  { label: "Solutions", href: "/itneck/solutions", mega: true },
  { label: "AI", href: "/itneck/solutions/ai-automation" },
  { label: "About you", href: "/itneck/about" },
  { label: "About ITneck", href: "/itneck/about-itneck" },
  { label: "Resources", href: "/itneck/blog" },
  { label: "Contact", href: "/itneck/contact" },
] as const;

export const itneckFooterNav = [
  { label: "Home", href: "/itneck" },
  { label: "Solutions", href: "/itneck/solutions" },
  { label: "AI", href: "/itneck/solutions/ai-automation" },
  { label: "About you", href: "/itneck/about" },
  { label: "About ITneck", href: "/itneck/about-itneck" },
  { label: "Resources", href: "/itneck/blog" },
  { label: "Contact", href: "/itneck/contact" },
  { label: "Support", href: "/itneck/support" },
  { label: "Privacy Policy", href: "/itneck/privacy" },
] as const;

export function itneckPath(path = ""): string {
  if (!path || path === "/") return itneckSite.basePath;
  return `${itneckSite.basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export function itneckAbsoluteUrl(path = ""): string {
  const p = itneckPath(path);
  return `${itneckSite.url}${p === "/" ? "" : p}`;
}
