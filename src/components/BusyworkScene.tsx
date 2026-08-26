"use client";

import type { CSSProperties } from "react";
import {
  ClockIcon,
  FileIcon,
  FolderIcon,
  IdeasIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/icons";
import { usePauseOffscreen } from "@/components/usePauseOffscreen";

const CX = 240;
const CY = 160;
const ORBIT = 118;
const BRAND_NAVY = "#02376b";

type TaskIcon = typeof MailIcon;

type Task = {
  Icon: TaskIcon;
  x: number;
  y: number;
};

function point(angleDeg: number): { x: number; y: number } {
  const a = (angleDeg * Math.PI) / 180;
  return {
    x: CX + ORBIT * Math.cos(a),
    y: CY + ORBIT * Math.sin(a),
  };
}

const tasks: Task[] = [
  { Icon: MailIcon, ...point(-90) },
  { Icon: PhoneIcon, ...point(-30) },
  { Icon: FolderIcon, ...point(30) },
  { Icon: FileIcon, ...point(90) },
  { Icon: ClockIcon, ...point(150) },
  { Icon: IdeasIcon, ...point(210) },
];

/**
 * Abstract stand-in for the busywork photo: a calm figure at the center
 * with work icons ping-ponging inward. Hovering the parent link gathers
 * the orbit (ending the busywork).
 */
export function BusyworkScene() {
  const { ref, paused } = usePauseOffscreen();

  return (
    <div
      ref={ref}
      className={`busywork-scene${paused ? " is-paused" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 480 320" className="h-auto w-full">
        <circle
          cx={CX}
          cy={CY}
          r="150"
          fill="none"
          stroke="var(--void-navy)"
          strokeOpacity="0.06"
        />

        <g className="busywork-orbit">
          {tasks.map((task, i) => {
            const dx = ((CX - task.x) * 0.38).toFixed(1);
            const dy = ((CY - task.y) * 0.38).toFixed(1);
            return (
              <g key={i}>
                <line
                  x1={CX}
                  y1={CY}
                  x2={task.x}
                  y2={task.y}
                  stroke="var(--void-navy)"
                  strokeOpacity="0.14"
                  strokeWidth="1.25"
                  className="busywork-link"
                  style={{ animationDelay: `${0.04 + i * 0.05}s` }}
                />
                <g
                  className="busywork-task"
                  style={
                    {
                      "--bw-dx": `${dx}px`,
                      "--bw-dy": `${dy}px`,
                      animationDelay: `${0.4 + i * 0.22}s`,
                    } as CSSProperties
                  }
                >
                  <circle
                    cx={task.x}
                    cy={task.y}
                    r="22"
                    fill="var(--page)"
                    stroke="var(--void-navy)"
                    strokeOpacity="0.18"
                    strokeWidth="1.5"
                  />
                  <task.Icon
                    x={task.x - 10}
                    y={task.y - 10}
                    width={20}
                    height={20}
                    stroke="var(--void-navy)"
                  />
                </g>
              </g>
            );
          })}
        </g>

        <g className="busywork-core">
          <circle
            cx={CX}
            cy={CY}
            r="48"
            fill="none"
            stroke="var(--signal-cyan)"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="busywork-ring"
          />
          <circle
            cx={CX}
            cy={CY}
            r="36"
            fill={BRAND_NAVY}
            stroke={BRAND_NAVY}
            strokeWidth="1.5"
          />
          <circle
            cx={CX}
            cy={CY - 7}
            r="6"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <path
            d={`M ${CX - 12} ${CY + 16} C ${CX - 12} ${CY + 3} ${CX + 12} ${CY + 3} ${CX + 12} ${CY + 16}`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
