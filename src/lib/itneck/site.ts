export const itneckSite = {
  name: "ITneck",
  tagline: "Keep Technology Simple and Safe",
  description:
    "We make tech easy to use and safe, so your team can work better without stress. Fully managed IT, cybersecurity, cloud, and network services in San Diego.",
  email: "Support@ITneck.com",
  phone: "858-740-8878",
  phoneIntl: "+1-858-740-8878",
  address: "San Diego, CA",
  hours: [
    "Monday–Friday 7:00–19:00",
    "Saturday 8:00–15:00",
  ],
  instagram: "https://www.instagram.com/itneck/",
  linkedin: "https://www.linkedin.com/company/itneck/",
  x: "https://x.com/ITnecks",
  basePath: "/itneck",
  url: "https://www.itneck.com",
} as const;

export const itneckHeaderNav = [
  { label: "Home", href: "/itneck" },
  { label: "Solutions", href: "/itneck/solutions", mega: true },
  { label: "Blog", href: "/itneck/blog" },
  { label: "About YOU", href: "/itneck/about" },
  { label: "Contact us", href: "/itneck/contact" },
] as const;

export const itneckFooterNav = [
  { label: "Home", href: "/itneck" },
  { label: "Solutions", href: "/itneck/solutions" },
  { label: "Blog", href: "/itneck/blog" },
  { label: "About YOU", href: "/itneck/about" },
  { label: "Contact us", href: "/itneck/contact" },
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
