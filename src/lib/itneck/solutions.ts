import { aiAutomationPage } from "@/lib/itneck/solutions/ai-automation";
import { backupContinuityPage } from "@/lib/itneck/solutions/backup-continuity";
import { cybersecurityPage } from "@/lib/itneck/solutions/cybersecurity";
import { managedItPage } from "@/lib/itneck/solutions/managed-it";
import { technologyStrategyPage } from "@/lib/itneck/solutions/technology-strategy";
import type { SolutionPage } from "@/lib/itneck/solutions/types";

export type { SolutionPage, SolutionSection } from "@/lib/itneck/solutions/types";

export const solutionHubs: SolutionPage[] = [
  managedItPage,
  cybersecurityPage,
  aiAutomationPage,
  backupContinuityPage,
  technologyStrategyPage,
];

export function getHub(slug: string): SolutionPage | undefined {
  return solutionHubs.find((h) => h.slug === slug);
}

export function allSolutionPaths(): { hub: string }[] {
  return solutionHubs.map((h) => ({ hub: h.slug }));
}

export function solutionToc(page: SolutionPage): { id: string; label: string }[] {
  return page.sections
    .filter((s) => s.title || s.toc)
    .map((s) => ({
      id: s.id,
      label: s.toc ?? s.title ?? s.id,
    }));
}

/** Old hub/leaf URLs → new longform hubs. */
export const legacySolutionRedirects: Record<string, string> = {
  cloud: "/itneck/solutions/managed-it",
  "cloud/microsoft-365-google-workspace": "/itneck/solutions/managed-it",
  "cloud/vpn-solutions": "/itneck/solutions/managed-it",
  "cloud/mobile-device-management": "/itneck/solutions/managed-it",
  "cloud/cloud-backup": "/itneck/solutions/backup-continuity",
  "cloud/disaster-recovery": "/itneck/solutions/backup-continuity",
  "cloud/cloud-infrastructure-migration": "/itneck/solutions/technology-strategy",
  "cloud/email-collaboration-migration": "/itneck/solutions/managed-it",
  network: "/itneck/solutions/managed-it",
  "network/internet-connectivity": "/itneck/solutions/managed-it",
  "network/network-design-implementation": "/itneck/solutions/managed-it",
  "network/firewall-security-configuration": "/itneck/solutions/managed-it",
  "network/server-infrastructure-management": "/itneck/solutions/managed-it",
  "network/monitoring-performance": "/itneck/solutions/managed-it",
  "network/documentation-network-diagrams": "/itneck/solutions/managed-it",
  ai: "/itneck/solutions/ai-automation",
  "ai/ai-strategy-consultation": "/itneck/solutions/ai-automation",
  "ai/ai-automation-workflow": "/itneck/solutions/ai-automation",
  "ai/ai-microsoft-365-integration": "/itneck/solutions/ai-automation",
  "hardware-software": "/itneck/solutions/managed-it",
  "hardware-software/lifecycle-management": "/itneck/solutions/managed-it",
  "hardware-software/physical-security": "/itneck/solutions/cybersecurity",
  "hardware-software/ongoing-maintenance-support": "/itneck/solutions/managed-it",
  "hardware-software/remote-monitoring-alert": "/itneck/solutions/managed-it",
  "hardware-software/surveillance-cameras": "/itneck/solutions/cybersecurity",
  "hardware-software/procurement": "/itneck/solutions/managed-it",
  "managed-it/fully-managed-it-services": "/itneck/solutions/managed-it",
  "managed-it/on-site-remote-support": "/itneck/solutions/managed-it",
  "managed-it/co-managed-support": "/itneck/solutions/managed-it",
  "managed-it/part-time-it-leadership": "/itneck/solutions/technology-strategy",
  "managed-it/endpoint-management": "/itneck/solutions/managed-it",
  "managed-it/server-support": "/itneck/solutions/managed-it",
  "managed-it/help-desk-support": "/itneck/solutions/managed-it",
  "cybersecurity/managed-detection-and-response": "/itneck/solutions/cybersecurity",
  "cybersecurity/compliance-as-a-service": "/itneck/solutions/cybersecurity",
  "cybersecurity/user-protection": "/itneck/solutions/cybersecurity",
  "cybersecurity/infrastructure-security": "/itneck/solutions/cybersecurity",
  "cybersecurity/security-consulting": "/itneck/solutions/cybersecurity",
  "cybersecurity/cybersecurity-awareness-training":
    "/itneck/solutions/cybersecurity",
};

export function resolveLegacySolution(
  hub: string,
  slug?: string,
): string | undefined {
  const key = slug ? `${hub}/${slug}` : hub;
  return legacySolutionRedirects[key];
}
