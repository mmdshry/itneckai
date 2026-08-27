import { site } from "@/lib/site";

export const ESTIMATE_ORIGIN = "https://kelarpacific.itneck.ai";

const ESTIMATE_HOSTS = new Set([
  "kelarpacific.itneck.ai",
  "www.kelarpacific.itneck.ai",
  "kelarpacific.localhost",
]);

const APEX_HOSTS = new Set(["itneck.ai", "www.itneck.ai"]);

export function hostnameFromHostHeader(hostHeader: string | null): string {
  return (hostHeader ?? "").split(":")[0]?.trim().toLowerCase() ?? "";
}

export function isEstimateHost(hostHeader: string | null): boolean {
  return ESTIMATE_HOSTS.has(hostnameFromHostHeader(hostHeader));
}

export function isApexHost(hostHeader: string | null): boolean {
  return APEX_HOSTS.has(hostnameFromHostHeader(hostHeader));
}

export function isLocalHost(hostHeader: string | null): boolean {
  const host = hostnameFromHostHeader(hostHeader);
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
}

export function isAbsoluteHttpUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function withOrigin(path: string, origin?: string): string {
  if (!origin) return path;
  if (isAbsoluteHttpUrl(path)) return path;
  const base = origin.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function estimatePublicPath(hostHeader: string | null): "/" | "/estimate" {
  return isEstimateHost(hostHeader) ? "/" : "/estimate";
}

export function estimateModeHref(
  hostHeader: string | null,
  mode: "standard" | "advance",
): string {
  const base = estimatePublicPath(hostHeader);
  if (mode === "advance") {
    return base === "/" ? "/?mode=advance" : "/estimate?mode=advance";
  }
  return base;
}

export function marketingOriginForHost(hostHeader: string | null): string | undefined {
  return isEstimateHost(hostHeader) ? site.url : undefined;
}
