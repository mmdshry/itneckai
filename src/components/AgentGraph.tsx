import { productIcons } from "@/components/icons";

type Satellite = {
  icon: keyof typeof productIcons;
  label: string;
  x: number;
  y: number;
};

const CX = 240;
const CY = 210;

const satellites: Satellite[] = [
  { icon: "sharepoint", label: "SHAREPOINT", x: 240, y: 52 },
  { icon: "teams", label: "TEAMS", x: 386, y: 158 },
  { icon: "outlook", label: "OUTLOOK", x: 330, y: 340 },
  { icon: "m365", label: "M365", x: 150, y: 340 },
  { icon: "onedrive", label: "ONEDRIVE", x: 94, y: 158 },
];

/** Brand navy — stays fixed so the core node stays readable in dark mode. */
const BRAND_NAVY = "#02376b";

/**
 * The hero "Agent Graph": a central ai.neck Agent node connected to five
 * Microsoft product nodes. Rendered as static SVG animated purely with CSS
 * (see globals.css) — zero JavaScript, respects prefers-reduced-motion.
 */
export function AgentGraph() {
  return (
    <svg
      viewBox="0 0 480 400"
      role="img"
      aria-label="Diagram of an ai.neck agent at the center, connected to SharePoint, Teams, Outlook, Microsoft 365, and OneDrive."
      className="h-auto w-full max-w-lg"
    >
      <g aria-hidden="true">
        {/* Connector lines, drawn in with a staggered stroke animation */}
        {satellites.map((s, i) => (
          <line
            key={`link-${s.icon}`}
            x1={CX}
            y1={CY}
            x2={s.x}
            y2={s.y}
            stroke="var(--void-navy)"
            strokeOpacity="0.2"
            strokeWidth="1.5"
            className="graph-link"
            style={{ animationDelay: `${0.05 + i * 0.06}s` }}
          />
        ))}

        {/* Satellite nodes */}
        {satellites.map((s, i) => {
          const Icon = productIcons[s.icon];
          return (
            <g
              key={`node-${s.icon}`}
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
          );
        })}

        {/* Central agent node */}
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
      </g>
    </svg>
  );
}
