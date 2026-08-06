import type {NextConfig} from "next";
import path from "path";

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
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
        "frame-src 'self' https://copilotstudio.microsoft.com https://*.powerplatform.com",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
    // Pin tracing to this app; a lockfile in the user home confuses Next's root detection.
    outputFileTracingRoot: path.join(__dirname),
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
};

export default nextConfig;
