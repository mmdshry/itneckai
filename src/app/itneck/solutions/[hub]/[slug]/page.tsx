import { redirect } from "next/navigation";
import { resolveLegacySolution } from "@/lib/itneck/solutions";

type Props = { params: Promise<{ hub: string; slug: string }> };

const legacyLeaves = [
  "cloud/microsoft-365-google-workspace",
  "cloud/vpn-solutions",
  "cloud/mobile-device-management",
  "cloud/cloud-backup",
  "cloud/disaster-recovery",
  "cloud/cloud-infrastructure-migration",
  "cloud/email-collaboration-migration",
  "network/internet-connectivity",
  "network/network-design-implementation",
  "network/firewall-security-configuration",
  "network/server-infrastructure-management",
  "network/monitoring-performance",
  "network/documentation-network-diagrams",
  "ai/ai-strategy-consultation",
  "ai/ai-automation-workflow",
  "ai/ai-microsoft-365-integration",
  "hardware-software/lifecycle-management",
  "hardware-software/physical-security",
  "hardware-software/ongoing-maintenance-support",
  "hardware-software/remote-monitoring-alert",
  "hardware-software/surveillance-cameras",
  "hardware-software/procurement",
  "managed-it/fully-managed-it-services",
  "managed-it/on-site-remote-support",
  "managed-it/co-managed-support",
  "managed-it/part-time-it-leadership",
  "managed-it/endpoint-management",
  "managed-it/server-support",
  "managed-it/help-desk-support",
  "cybersecurity/managed-detection-and-response",
  "cybersecurity/compliance-as-a-service",
  "cybersecurity/user-protection",
  "cybersecurity/infrastructure-security",
  "cybersecurity/security-consulting",
  "cybersecurity/cybersecurity-awareness-training",
];

export function generateStaticParams() {
  return legacyLeaves.map((path) => {
    const [hub, slug] = path.split("/");
    return { hub, slug };
  });
}

export default async function LegacySolutionLeafPage({ params }: Props) {
  const { hub, slug } = await params;
  const dest = resolveLegacySolution(hub, slug);
  redirect(dest ?? `/itneck/solutions/${hub}`);
}
