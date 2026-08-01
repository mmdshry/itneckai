import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/*
  Abstract line icons referencing Microsoft products.
  Per brand guidance we deliberately do NOT reproduce official Microsoft
  logos/lockups — these are simple geometric glyphs evoking each product.
*/

function base(props: IconProps): IconProps {
  return {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

/** Stacked site pages — SharePoint */
export function SharePointIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="9" r="5.5" />
      <circle cx="16" cy="13" r="4.5" />
      <circle cx="10.5" cy="17.5" r="3" />
    </svg>
  );
}

/** People in conversation — Teams */
export function TeamsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9.5" r="2" />
      <path d="M3.5 19v-1.5a5.5 5.5 0 0 1 11 0V19" />
      <path d="M16 14.5a4 4 0 0 1 4.5 4V19" />
    </svg>
  );
}

/** Cloud with files — OneDrive */
export function OneDriveIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 17.5a4 4 0 0 1-.6-7.95 5.5 5.5 0 0 1 10.6 1.2A3.5 3.5 0 0 1 16.5 17.5Z" />
      <path d="M9.5 13.5h5" />
    </svg>
  );
}

/** Grid of apps — Microsoft 365 */
export function M365Icon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

/** Envelope — Outlook */
export function OutlookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function AgentIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="8" strokeDasharray="3.5 3" />
      <path d="M12 4v-1.5M12 21.5V20M4 12H2.5M21.5 12H20" />
    </svg>
  );
}

export const productIcons = {
  sharepoint: SharePointIcon,
  teams: TeamsIcon,
  onedrive: OneDriveIcon,
  m365: M365Icon,
  outlook: OutlookIcon,
} as const;

/* ---------- UI icons ---------- */

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base({ width: 16, height: 16, ...props })}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base({ width: 16, height: 16, ...props })}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base({ width: 18, height: 18, ...props })}>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base({ width: 18, height: 18, ...props })}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base({ width: 18, height: 18, ...props })}>
      <path d="M5.5 4h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L16 14l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base({ width: 18, height: 18, ...props })}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base({ width: 20, height: 20, ...props })}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.8" cy="7.2" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base({ width: 20, height: 20, ...props })}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M8 10.5V16M8 8v.01M12 16v-3a2 2 0 1 1 4 0v3" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base({ width: 20, height: 20, ...props })}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base({ width: 20, height: 20, ...props })}>
      <path d="M18 13.5A7.5 7.5 0 1 1 10.5 6 6 6 0 0 0 18 13.5Z" />
    </svg>
  );
}
