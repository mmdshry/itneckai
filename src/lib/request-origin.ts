import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { publicOrigin } from "@/lib/site";

function isLocalHost(host: string): boolean {
  const name = host.split(":")[0]?.replace(/^\[|\]$/g, "") ?? "";
  return name === "localhost" || name === "127.0.0.1" || name === "::1";
}

/** Public site URL in production; the incoming Host on local. */
export async function requestOrigin(): Promise<string> {
  if (process.env.NODE_ENV === "production") {
    return publicOrigin();
  }

  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    headerList.get("host")?.trim();
  if (!host) return publicOrigin();

  const proto =
    headerList.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (isLocalHost(host) ? "http" : "https");
  return `${proto}://${host}`;
}

/** Same rules for Route Handlers that already have the request. */
export function originFromRequest(request: NextRequest): string {
  if (process.env.NODE_ENV === "production") {
    return publicOrigin();
  }
  return request.nextUrl.origin;
}
