"use client";

import { useRouter } from "next/navigation";
import { productIcons } from "@/components/icons";
import { usePauseOffscreen } from "@/components/usePauseOffscreen";

type Satellite = {
  icon: keyof typeof productIcons;
  slug: string;
  label: string;
  name: string;
  x: number;
  y: number;
};

const CX = 240;
const CY = 210;
const HUB_R = 42;
const SAT_R = 28;

const satellites: Satellite[] = [
  {
    icon: "sharepoint",
    slug: "sharepoint",
    label: "SHAREPOINT",
    name: "SharePoint",
    x: 240,
    y: 52,
  },
  {
    icon: "teams",
    slug: "teams",
    label: "TEAMS",
    name: "Teams",
    x: 386,
    y: 158,
  },
  {
    icon: "outlook",
    slug: "outlook",
    label: "OUTLOOK",
    name: "Outlook",
    x: 330,
    y: 340,
  },
  {
    icon: "m365",
    slug: "microsoft-365",
    label: "M365",
    name: "Microsoft 365",
    x: 150,
    y: 340,
  },
  {
    icon: "onedrive",
    slug: "onedrive",
    label: "ONEDRIVE",
    name: "OneDrive",
    x: 94,
    y: 158,
  },
];

/** Brand navy — stays fixed so the core node stays readable in dark mode. */
const BRAND_NAVY = "#02376b";

function spokePath(x: number, y: number) {
  const dx = x - CX;
  const dy = y - CY;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const x1 = CX + ux * HUB_R;
  const y1 = CY + uy * HUB_R;
  const x2 = x - ux * SAT_R;
  const y2 = y - uy * SAT_R;
  return {
    x1,
    y1,
    x2,
    y2,
    d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`,
  };
}

/**
 * Hero Agent Graph: a central ai.neck Agent node connected to five
 * Microsoft product nodes. CSS ping-pong packets travel each spoke;
 * hover/focus highlights that conversation. Respects prefers-reduced-motion.
 */
export function AgentGraph() {
  const router = useRouter();
  const { ref, paused } = usePauseOffscreen();

  return (
    <div
      ref={ref}
      className={`agent-graph w-full max-w-lg${paused ? " is-paused" : ""}`}
    >
      <svg
        viewBox="0 0 480 400"
        role="group"
        aria-label="Diagram of an ai.neck agent at the center, connected to SharePoint, Teams, Outlook, Microsoft 365, and OneDrive. Each app is a link to that Copilot agent page."
        className="h-auto w-full"
      >
        {satellites.map((s, i) => {
          const Icon = productIcons[s.icon];
          const spoke = spokePath(s.x, s.y);
          return (
            <g key={s.icon} className="graph-spoke">
              <line
                x1={spoke.x1}
                y1={spoke.y1}
                x2={spoke.x2}
                y2={spoke.y2}
                stroke="transparent"
                strokeWidth="14"
              />
              <line
                x1={spoke.x1}
                y1={spoke.y1}
                x2={spoke.x2}
                y2={spoke.y2}
                stroke="var(--void-navy)"
                strokeOpacity="0.2"
                strokeWidth="1.5"
                className="graph-link"
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              />
              <circle
                r="3.25"
                fill="var(--signal-cyan)"
                className="graph-packet"
                style={{
                  offsetPath: `path("${spoke.d}")`,
                  animationDelay: `${0.85 + i * 0.48}s`,
                }}
              />
              <a
                href={`/solutions/microsoft-copilot-agents/${s.slug}`}
                className="graph-node-link"
                aria-label={`Copilot Studio agents for ${s.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    `/solutions/microsoft-copilot-agents/${s.slug}`,
                  );
                }}
              >
                <g
                  className="graph-node"
                  style={{ animationDelay: `${0.3 + i * 0.06}s` }}
                >
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r="27"
                    fill="var(--page)"
                    stroke="var(--void-navy)"
                    strokeOpacity="0.2"
                    strokeWidth="1.5"
                    className="graph-sat"
                  />
                  <Icon
                    x={s.x - 12}
                    y={s.y - 12}
                    width={24}
                    height={24}
                    stroke="var(--void-navy)"
                  />
                  <text
                    x={s.x}
                    y={s.y + 44}
                    textAnchor="middle"
                    fill="var(--graphite)"
                    fontSize="10"
                    letterSpacing="0.12em"
                    fontFamily="var(--font-jetbrains), monospace"
                  >
                    {s.label}
                  </text>
                </g>
              </a>
            </g>
          );
        })}

        <g className="graph-node" style={{ animationDelay: "0.55s" }}>
          <circle
            cx={CX}
            cy={CY}
            r="52"
            fill="none"
            stroke="var(--signal-cyan)"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="graph-ring"
          />
          <g className="graph-core">
            <circle
              cx={CX}
              cy={CY}
              r="40"
              fill={BRAND_NAVY}
              stroke={BRAND_NAVY}
              strokeWidth="1.5"
            />
            <text
              x={CX}
              y={CY - 2}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="600"
              fontFamily="var(--font-inter), sans-serif"
            >
              ai.neck
            </text>
            <text
              x={CX}
              y={CY + 14}
              textAnchor="middle"
              fill="var(--signal-cyan)"
              fontSize="12"
              fontWeight="600"
              fontFamily="var(--font-inter), sans-serif"
            >
              Agent
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
