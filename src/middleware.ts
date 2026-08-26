import { NextResponse, type NextRequest } from "next/server";
import {
  ESTIMATE_COOKIE,
  verifyEstimateToken,
} from "@/lib/estimate/auth-cookie";
import {
  hostnameFromHostHeader,
  isApexHost,
  isEstimateHost,
  isLocalHost,
} from "@/lib/hosts";

function publicOrigin(request: NextRequest): string {
  const host = request.headers.get("host")?.trim();
  if (!host) return request.nextUrl.origin;
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const hostname = hostnameFromHostHeader(host);
  const proto =
    forwarded ||
    (hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
      ? "http"
      : "https");
  return `${proto}://${host}`;
}

function redirectTo(
  request: NextRequest,
  pathname: string,
  status: 307 | 308 = 307,
) {
  const url = new URL(pathname, publicOrigin(request));
  url.search = "";
  return NextResponse.redirect(url, status);
}

function notFound(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/_not-found";
  url.search = "";
  // next start -H 127.0.0.1 builds nextUrl as localhost:3001. X-Forwarded-Proto
  // https would rewrite to https://localhost:3001/_not-found (nothing listens).
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    url.protocol = "http:";
  }
  return NextResponse.rewrite(url);
}

function isAuthed(request: NextRequest) {
  return verifyEstimateToken(request.cookies.get(ESTIMATE_COOKIE)?.value);
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const { pathname } = request.nextUrl;

  if (hostnameFromHostHeader(host) === "www.kelarpacific.itneck.ai") {
    const dest = new URL(
      `${pathname}${request.nextUrl.search}`,
      "https://kelarpacific.itneck.ai",
    );
    return NextResponse.redirect(dest, 308);
  }

  if (isEstimateHost(host)) {
    if (pathname === "/api/estimate/login") return NextResponse.next();

    if (pathname.startsWith("/api/")) return notFound(request);

    const authed = await isAuthed(request);

    if (pathname === "/login") {
      if (authed) return redirectTo(request, "/");
      return NextResponse.next();
    }

    if (pathname === "/estimate" || pathname.startsWith("/estimate/")) {
      if (!authed) return redirectTo(request, "/login");
      return redirectTo(request, "/");
    }

    if (pathname === "/") {
      if (!authed) return redirectTo(request, "/login");
      const url = request.nextUrl.clone();
      url.pathname = "/estimate";
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
        url.protocol = "http:";
      }
      return NextResponse.rewrite(url);
    }

    return notFound(request);
  }

  if (isApexHost(host)) {
    if (
      pathname === "/estimate" ||
      pathname.startsWith("/estimate/") ||
      pathname === "/login" ||
      pathname.startsWith("/api/estimate")
    ) {
      return notFound(request);
    }
    return NextResponse.next();
  }

  if (isLocalHost(host)) {
    const authed = await isAuthed(request);

    if (pathname === "/login") {
      if (authed) return redirectTo(request, "/estimate");
      return NextResponse.next();
    }

    if (pathname === "/estimate" || pathname.startsWith("/estimate/")) {
      if (!authed) {
        const dest = new URL("/login", publicOrigin(request));
        dest.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
        return NextResponse.redirect(dest);
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|brand|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|woff2)).*)",
  ],
};
