export type Partner = {
  name: string;
  href: string;
  logo: string;
  /** Dark-glyph logos that need invert on black tiles */
  invertInDark?: boolean;
  /** Keep light tile in both themes (e.g. dark-text logos) */
  forceLightTile?: boolean;
};

export const technologyPartners: Partner[] = [
  {
    name: "Datto RMM",
    href: "https://www.datto.com/",
    logo: "/itneck/partners/datto-rmm.png",
    invertInDark: true,
  },
  {
    name: "Kaseya",
    href: "https://www.kaseya.com/",
    logo: "/itneck/partners/kaseya.png",
    invertInDark: true,
  },
  {
    name: "VMware",
    href: "https://www.vmware.com/",
    logo: "/itneck/partners/vmware.png",
  },
  {
    name: "AWS Cloud Practitioner",
    href: "https://aws.amazon.com/",
    logo: "/itneck/partners/aws-cloud-practitioner.png",
  },
  {
    name: "Microsoft Azure",
    href: "https://azure.microsoft.com/",
    logo: "/itneck/partners/microsoft-azure.png",
  },
  {
    name: "Microsoft Solutions Partner — Modern Work",
    href: "https://www.microsoft.com/",
    logo: "/itneck/partners/microsoft-solutions-partner.png",
    invertInDark: true,
  },
];
