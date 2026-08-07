export type Partner = {
  name: string;
  href: string;
  logo: string;
  group: "clients" | "technology";
  /** Dark-glyph logos that need invert on black tiles */
  invertInDark?: boolean;
  /** Keep light tile in both themes (e.g. dark-text logos) */
  forceLightTile?: boolean;
};

export const partners: Partner[] = [
  // Clients
  {
    name: "Component Surfaces",
    href: "https://componentsurfaces.com/",
    logo: "/itneck/partners/component-surfaces.png",
    group: "clients",
  },
  {
    name: "Cellaxys",
    href: "https://cellaxys.com/",
    logo: "/itneck/partners/cellaxys.png",
    group: "clients",
    forceLightTile: true,
  },
  {
    name: "Primed Pain Institute",
    href: "https://primedpain.com/",
    logo: "/itneck/partners/primed-pain.png",
    group: "clients",
  },
  {
    name: "MSM Medical Systems Management",
    href: "http://www.msmmed.com/",
    logo: "/itneck/partners/msm-advisors.png",
    group: "clients",
  },
  {
    name: "Solaris",
    href: "https://solarisfarms.org/",
    logo: "/itneck/partners/solaris.png",
    group: "clients",
  },
  {
    name: "Meros",
    href: "https://meros.com/",
    logo: "/itneck/partners/meros.png",
    group: "clients",
  },
  {
    name: "Kelar Pacific",
    href: "https://kelarpacific.com/",
    logo: "/itneck/partners/kelar-pacific.png",
    group: "clients",
    invertInDark: true,
  },
  {
    name: "The Sanctuary",
    href: "https://thesanctuarynv.com/",
    logo: "/itneck/partners/the-sanctuary.png",
    group: "clients",
  },

  // Technology Partners & certifications
  {
    name: "Datto RMM",
    href: "https://www.datto.com/",
    logo: "/itneck/partners/datto-rmm.png",
    group: "technology",
    invertInDark: true,
  },
  {
    name: "Kaseya",
    href: "https://www.kaseya.com/",
    logo: "/itneck/partners/kaseya.png",
    group: "technology",
    invertInDark: true,
  },
  {
    name: "VMware",
    href: "https://www.vmware.com/",
    logo: "/itneck/partners/vmware.png",
    group: "technology",
  },
  {
    name: "AWS Cloud Practitioner",
    href: "https://aws.amazon.com/",
    logo: "/itneck/partners/aws-cloud-practitioner.png",
    group: "technology",
  },
  {
    name: "Microsoft Azure",
    href: "https://azure.microsoft.com/",
    logo: "/itneck/partners/microsoft-azure.png",
    group: "technology",
  },
  {
    name: "Microsoft Solutions Partner — Modern Work",
    href: "https://www.microsoft.com/",
    logo: "/itneck/partners/microsoft-solutions-partner.png",
    group: "technology",
    invertInDark: true,
  },
];

export const clientPartners = partners.filter((p) => p.group === "clients");
export const technologyPartners = partners.filter(
  (p) => p.group === "technology",
);
