import { headers } from "next/headers";
import { publicOrigin } from "@/lib/site";

function isLocalHost(host: string): boolean {
  const name = host.split(":")[0]?.replace(/^\[|\]$/g, "") ?? "";
  return name === "localhost" || name === "127.0.0.1" || name === "::1";
}

/** Origin of the incoming request on local; production stays the public site URL. */
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
