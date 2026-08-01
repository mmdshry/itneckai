import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared 1200×630 Open Graph image template. */
export function ogImage(title: string, eyebrow = "AI SOLUTIONS · MICROSOFT COPILOT SPECIALISTS") {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(ellipse at 80% 10%, rgba(249,105,14,0.1), transparent 55%)",
          color: "#02376b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#02376b" />
            <circle cx="32" cy="32" r="9" fill="#f9690e" />
            <circle
              cx="32"
              cy="32"
              r="22"
              fill="none"
              stroke="#f9690e"
              strokeWidth="3"
              strokeDasharray="8 7"
            />
            <circle cx="32" cy="10" r="4.5" fill="#ffffff" />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
            ai.neck
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 5,
              color: "#f9690e",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#5c6678",
          }}
        >
          <div style={{ display: "flex" }}>www.itneck.com</div>
          <div style={{ display: "flex", color: "#f9690e" }}>
            San Diego, California
          </div>
        </div>
      </div>
    ),
    ogSize
  );
}
