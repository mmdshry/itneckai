import type {NextConfig} from "next";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
      // unload=* lets the Copilot Studio iframe register unload handlers
      // without Permissions-Policy console noise (Chrome restricts unload by default).
    key: "Permissions-Policy",
      value:
          "camera=(), microphone=(), geolocation=(), interest-cohort=(), unload=*",
  },
  {
    // 'unsafe-inline' for script-src is required by Next.js SSG bootstrap data;
    // switch to nonce-based CSP only if the site moves to dynamic rendering.
    // 'unsafe-eval' is only for next dev (webpack + React Refresh). Production
    // stays without it so Zod's jitless config remains effective.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      isDev
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com"
        : "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
        "frame-src 'self' https://challenges.cloudflare.com https://copilotstudio.microsoft.com https://*.powerplatform.com",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
    // Pin tracing to this app; a lockfile in the user home confuses Next's root detection.
    outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: ["kelarpacific.itneck.ai", "kelarpacific.localhost"],
  experimental: {
    // Site-wide CSS is ~7KB; inlining it removes a render-blocking request.
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/end-your-busywork",
        destination: "/EndYourBusywork",
        permanent: true,
      },
      { source: "/about", destination: "/team", permanent: true },
      { source: "/solutions", destination: "/how-it-works/build", permanent: true },
      {
        source: "/solutions/:path*",
        destination: "/how-it-works/build",
        permanent: true,
      },
      { source: "/industries", destination: "/how-it-works", permanent: true },
      {
        source: "/industries/:path*",
        destination: "/how-it-works",
        permanent: true,
      },
      {
        source: "/case-studies",
        destination: "/how-it-works/discover",
        permanent: true,
      },
      {
        source: "/itneck/ai",
        destination: "/itneck/solutions/ai-automation",
        permanent: true,
      },
      {
        source: "/itneck/solutions/ai",
        destination: "/itneck/solutions/ai-automation",
        permanent: true,
      },
      {
        source: "/itneck/solutions/ai/:path*",
        destination: "/itneck/solutions/ai-automation",
        permanent: true,
      },
      {
        source: "/itneck/solutions/cloud",
        destination: "/itneck/solutions/managed-it",
        permanent: true,
      },
      {
        source: "/itneck/solutions/cloud/cloud-backup",
        destination: "/itneck/solutions/backup-continuity",
        permanent: true,
      },
      {
        source: "/itneck/solutions/cloud/disaster-recovery",
        destination: "/itneck/solutions/backup-continuity",
        permanent: true,
      },
      {
        source: "/itneck/solutions/cloud/:path*",
        destination: "/itneck/solutions/managed-it",
        permanent: true,
      },
      {
        source: "/itneck/solutions/network",
        destination: "/itneck/solutions/managed-it",
        permanent: true,
      },
      {
        source: "/itneck/solutions/network/:path*",
        destination: "/itneck/solutions/managed-it",
        permanent: true,
      },
      {
        source: "/itneck/solutions/hardware-software",
        destination: "/itneck/solutions/managed-it",
        permanent: true,
      },
      {
        source: "/itneck/solutions/hardware-software/:path*",
        destination: "/itneck/solutions/managed-it",
        permanent: true,
      },
      {
        source: "/itneck/solutions/managed-it/:path+",
        destination: "/itneck/solutions/managed-it",
        permanent: true,
      },
      {
        source: "/itneck/solutions/cybersecurity/:path+",
        destination: "/itneck/solutions/cybersecurity",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
