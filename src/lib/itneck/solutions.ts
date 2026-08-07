export type SolutionLeaf = {
  slug: string;
  title: string;
  summary: string;
  bullets?: string[];
  badge?: "hot" | "new";
};

export type SolutionHub = {
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  leaves: SolutionLeaf[];
};

export const solutionHubs: SolutionHub[] = [
  {
    slug: "managed-it",
    title: "Fully Managed IT Services",
    navLabel: "Fully Managed IT Services",
    description:
      "Comprehensive support that includes unlimited on-site and remote support, endpoint management, server maintenance, and help desk—all tailored to keep systems running smoothly and users productive.",
    leaves: [
      {
        slug: "fully-managed-it-services",
        title: "Fully Managed IT Services",
        summary:
          "Comprehensive support that includes unlimited on-site and remote support, endpoint management, server maintenance, and help desk—all tailored to keep systems running smoothly and users productive.",
        bullets: [
          "Unlimited on-site and remote support",
          "Endpoint management",
          "Server maintenance",
          "Help desk support",
          "Predictable monthly costs",
        ],
      },
      {
        slug: "on-site-remote-support",
        title: "On Site & Remote Support",
        summary:
          "Fast, reliable help wherever your team works—on site when needed, remote when speed matters most.",
        bullets: [
          "On-site technicians in San Diego",
          "Secure remote assistance",
          "Priority ticket handling",
          "Business-hours and extended coverage options",
        ],
      },
      {
        slug: "co-managed-support",
        title: "Co-Managed Support",
        summary:
          "Flexible support models where we work alongside your in-house IT to fill strategic or operational gaps.",
        bullets: [
          "Augment your internal IT team",
          "Shared tooling and escalation paths",
          "After-hours and specialty coverage",
          "Documentation and knowledge transfer",
        ],
      },
      {
        slug: "part-time-it-leadership",
        title: "Part-time for IT Leadership",
        summary:
          "Part-time IT leadership to guide strategy, vendors, and priorities without a full-time CIO hire.",
        bullets: [
          "Technology roadmap planning",
          "Vendor and budget guidance",
          "Security and compliance oversight",
          "Executive-ready reporting",
        ],
      },
      {
        slug: "endpoint-management",
        title: "Endpoint management",
        summary:
          "Centralized management of laptops, desktops, and devices so every endpoint stays patched, secure, and productive.",
        badge: "hot",
        bullets: [
          "Patch and update automation",
          "Inventory and compliance reporting",
          "Remote troubleshooting",
          "Standardized device builds",
        ],
      },
      {
        slug: "server-support",
        title: "Server Support",
        summary:
          "Proactive monitoring, maintenance, and recovery for on-prem and cloud servers that keep your business online.",
        bullets: [
          "24/7 health monitoring",
          "Backup verification",
          "Performance tuning",
          "Incident response and recovery",
        ],
      },
      {
        slug: "help-desk-support",
        title: "Help Desk Support",
        summary:
          "Responsive help desk support that gets your users unblocked quickly—without the chaos of ticket black holes.",
        badge: "hot",
        bullets: [
          "Friendly first-line support",
          "Clear SLAs and escalations",
          "User onboarding assistance",
          "Knowledge base and self-help where useful",
        ],
      },
    ],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    navLabel: "Cyber Security",
    description:
      "Managed Detection & Response, compliance, user protection, infrastructure security, and consulting—built for businesses that need to stay secure and compliant.",
    leaves: [
      {
        slug: "managed-detection-and-response",
        title: "Managed Detection and Response",
        summary:
          "Continuous monitoring to detect and respond to threats in real time.",
        badge: "hot",
        bullets: [
          "24/7 threat monitoring",
          "Log analysis and SIEM",
          "Rapid incident response",
          "AI-driven detection",
        ],
      },
      {
        slug: "compliance-as-a-service",
        title: "Compliance as a Service",
        summary:
          "We help you meet industry standards with confidence.",
        bullets: [
          "Gap assessments",
          "Policy and control guidance",
          "Evidence collection support",
          "Ongoing compliance monitoring",
        ],
      },
      {
        slug: "user-protection",
        title: "User Protection",
        summary:
          "Equip your team with the tools and knowledge to avoid threats.",
        bullets: [
          "Email and identity protection",
          "Multi-factor authentication",
          "Endpoint hardening",
          "Phishing defense",
        ],
      },
      {
        slug: "infrastructure-security",
        title: "Infrastructure Security",
        summary:
          "Secure your organization from the ground up with expert guidance.",
        bullets: [
          "Network segmentation",
          "Firewall and perimeter hardening",
          "Server and cloud security baselines",
          "Vulnerability management",
        ],
      },
      {
        slug: "security-consulting",
        title: "Security Consulting",
        summary:
          "Strategic security advice tailored to your risk profile, industry, and growth plans.",
        bullets: [
          "Security roadmap workshops",
          "Architecture reviews",
          "Vendor and tool selection",
          "Executive briefings",
        ],
      },
      {
        slug: "cybersecurity-awareness-training",
        title: "Cybersecurity Awareness Training",
        summary:
          "User protection and awareness training so your people become a strong human firewall.",
        badge: "new",
        bullets: [
          "Phishing simulations",
          "Role-based training",
          "Ongoing education programs",
          "Measurable improvement tracking",
        ],
      },
    ],
  },
  {
    slug: "cloud",
    title: "Cloud Solutions",
    navLabel: "Cloud",
    description:
      "Microsoft 365 & Google Workspace management, VPN & MDM, cloud backup & disaster recovery, infrastructure setup, and email migration.",
    leaves: [
      {
        slug: "microsoft-365-google-workspace",
        title: "Microsoft 365 & Google Workspace Management",
        summary:
          "Simplify and secure your business productivity tools.",
        badge: "hot",
        bullets: [
          "Tenant administration",
          "License optimization",
          "Security baselines",
          "User lifecycle management",
        ],
      },
      {
        slug: "vpn-solutions",
        title: "Cloud & On-Premise VPN Solutions",
        summary:
          "Secure access for devices wherever your team works.",
        badge: "hot",
        bullets: [
          "Site-to-site and remote access VPN",
          "Zero-trust friendly designs",
          "Client setup and support",
          "Performance and reliability tuning",
        ],
      },
      {
        slug: "mobile-device-management",
        title: "Mobile Device Management (MDM)",
        summary:
          "Secure access and management for company and BYOD devices.",
        badge: "new",
        bullets: [
          "Microsoft Intune and leading MDM platforms",
          "Policy enforcement (PIN, encryption, apps)",
          "Remote wipe and lock",
          "BYOD and corporate-owned support",
        ],
      },
      {
        slug: "cloud-backup",
        title: "Cloud Backup",
        summary:
          "Keep your data safe and recoverable, no matter what.",
        badge: "hot",
        bullets: [
          "Automated cloud backups",
          "Retention policies",
          "Restore testing",
          "Ransomware-resilient options",
        ],
      },
      {
        slug: "disaster-recovery",
        title: "Disaster Recovery",
        summary:
          "Plans and systems that get your business back online quickly after an outage or incident.",
        bullets: [
          "RTO/RPO planning",
          "Failover strategies",
          "Documented runbooks",
          "Periodic DR drills",
        ],
      },
      {
        slug: "cloud-infrastructure-migration",
        title: "Cloud Infrastructure Setup & Migration",
        summary:
          "We help you transition to the cloud seamlessly.",
        bullets: [
          "Architecture design",
          "Workload migration",
          "Hybrid cloud options",
          "Post-migration optimization",
        ],
      },
      {
        slug: "email-collaboration-migration",
        title: "Email & Collaboration Platform Migration",
        summary:
          "Move email and collaboration platforms with minimal disruption to your team.",
        bullets: [
          "Mailbox and calendar migration",
          "Teams / Workspace cutover planning",
          "User training and support",
          "DNS and security configuration",
        ],
      },
    ],
  },
  {
    slug: "network",
    title: "Network Services",
    navLabel: "Network Management",
    description:
      "Internet connectivity, network design, firewall configuration, infrastructure management, monitoring, and documentation.",
    leaves: [
      {
        slug: "internet-connectivity",
        title: "Internet Connectivity",
        summary:
          "Fast, reliable connectivity tailored to your business requirements.",
        bullets: [
          "ISP selection and provisioning",
          "Failover and redundancy",
          "Circuit troubleshooting",
          "QoS for critical apps",
        ],
      },
      {
        slug: "network-design-implementation",
        title: "Network Design & Implementation",
        summary:
          "Networks designed for security, performance, and growth.",
        bullets: [
          "LAN/WAN design",
          "Wi-Fi planning and install",
          "Switching and routing",
          "Clean cable and rack builds",
        ],
      },
      {
        slug: "firewall-security-configuration",
        title: "Firewall & Security Configuration",
        summary:
          "Secure and optimize your perimeter and internal systems.",
        bullets: [
          "Firewall setup and hardening",
          "Rule reviews",
          "VPN and remote access policies",
          "Intrusion prevention basics",
        ],
      },
      {
        slug: "server-infrastructure-management",
        title: "Server & Infrastructure Management",
        summary:
          "Ongoing care for the servers and infrastructure your business depends on.",
        badge: "hot",
        bullets: [
          "Lifecycle management",
          "Capacity planning",
          "Patching and hardening",
          "Health reporting",
        ],
      },
      {
        slug: "monitoring-performance",
        title: "Monitoring & Performance Optimization",
        summary:
          "Track uptime and performance while keeping issues visible before users feel them.",
        badge: "new",
        bullets: [
          "Uptime and performance dashboards",
          "Alert tuning",
          "Bottleneck analysis",
          "Continuous improvement recommendations",
        ],
      },
      {
        slug: "documentation-network-diagrams",
        title: "Documentation & Network Diagrams",
        summary:
          "Keep your network well-documented so changes stay safe and support stays fast.",
        bullets: [
          "Living network diagrams",
          "Credential and asset inventories",
          "Change logs",
          "Handoff-ready documentation",
        ],
      },
    ],
  },
  {
    slug: "ai",
    title: "AI Services",
    navLabel: "AI",
    description:
      "AI strategy & consultation, automation & workflow optimization, and AI integration with Microsoft 365.",
    leaves: [
      {
        slug: "ai-strategy-consultation",
        title: "AI Strategy & Consultation",
        summary:
          "Discover how artificial intelligence can benefit your operations.",
        badge: "hot",
        bullets: [
          "Use-case discovery workshops",
          "Risk and readiness assessment",
          "Roadmap and ROI guidance",
          "Vendor-neutral recommendations",
        ],
      },
      {
        slug: "ai-automation-workflow",
        title: "AI Automation & Workflow Optimization",
        summary:
          "Streamline repetitive tasks and boost productivity with AI-powered workflows.",
        bullets: [
          "Process automation design",
          "Ticket and ops workflow AI",
          "Document and data workflows",
          "Measurement and iteration",
        ],
      },
      {
        slug: "ai-microsoft-365-integration",
        title: "AI Integration with Microsoft 365",
        summary:
          "Bring AI into the tools your team already uses—Microsoft 365, Copilot, and related services.",
        bullets: [
          "Microsoft 365 Copilot readiness",
          "SharePoint / Teams / Outlook integrations",
          "Governance and permissions",
          "User enablement",
        ],
      },
    ],
  },
  {
    slug: "hardware-software",
    title: "Hardware & Software",
    navLabel: "Hardware and Software",
    description:
      "Lifecycle & procurement, physical security & surveillance, ongoing maintenance, and remote monitoring & alerting.",
    leaves: [
      {
        slug: "lifecycle-management",
        title: "Lifecycle Management",
        summary:
          "We handle sourcing, setup, and ongoing device maintenance across the full hardware lifecycle.",
        bullets: [
          "Refresh planning",
          "Standardized builds",
          "Warranty tracking",
          "Secure retirement and disposal",
        ],
      },
      {
        slug: "physical-security",
        title: "Physical Security",
        summary:
          "From cameras to secure access solutions, we've got your premises covered.",
        badge: "hot",
        bullets: [
          "Access control systems",
          "Alarm and monitoring integration",
          "Policy and procedure alignment",
          "Vendor coordination",
        ],
      },
      {
        slug: "ongoing-maintenance-support",
        title: "Ongoing Maintenance & Support",
        summary:
          "Keep hardware and software healthy with scheduled maintenance and responsive support.",
        bullets: [
          "Preventive maintenance",
          "Firmware and driver updates",
          "Break/fix support",
          "Health reporting",
        ],
      },
      {
        slug: "remote-monitoring-alert",
        title: "Remote Monitoring & Alert",
        summary:
          "Stay informed of critical issues before they escalate.",
        bullets: [
          "Agent-based monitoring",
          "Smart alerting",
          "Escalation workflows",
          "Monthly health reviews",
        ],
      },
      {
        slug: "surveillance-cameras",
        title: "Surveillance Cameras",
        summary:
          "Professional surveillance camera design, install, and support for business premises.",
        badge: "hot",
        bullets: [
          "Camera placement design",
          "NVR / cloud recording options",
          "Remote viewing setup",
          "Maintenance and upgrades",
        ],
      },
      {
        slug: "procurement",
        title: "Procurement",
        summary:
          "Sourcing the right hardware and software at the right price—configured and ready for your team.",
        bullets: [
          "Vendor sourcing",
          "Quote comparison",
          "Licensing guidance",
          "Delivery and staging",
        ],
      },
    ],
  },
];

export function getHub(slug: string): SolutionHub | undefined {
  return solutionHubs.find((h) => h.slug === slug);
}

export function getLeaf(
  hubSlug: string,
  leafSlug: string,
): { hub: SolutionHub; leaf: SolutionLeaf } | undefined {
  const hub = getHub(hubSlug);
  if (!hub) return undefined;
  const leaf = hub.leaves.find((l) => l.slug === leafSlug);
  if (!leaf) return undefined;
  return { hub, leaf };
}

export function allSolutionPaths(): { hub: string; leaf?: string }[] {
  const paths: { hub: string; leaf?: string }[] = [];
  for (const hub of solutionHubs) {
    paths.push({ hub: hub.slug });
    for (const leaf of hub.leaves) {
      paths.push({ hub: hub.slug, leaf: leaf.slug });
    }
  }
  return paths;
}
