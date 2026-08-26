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

function notFound(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/_not-found";
  url.search = "";
  return NextResponse.rewrite(url);
}

function isAuthed(request: NextRequest) {
  return verifyEstimateToken(request.cookies.get(ESTIMATE_COOKIE)?.value);
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const { pathname } = request.nextUrl;

  if (hostnameFromHostHeader(host) === "www.kelarpacific.itneck.ai") {
    const url = request.nextUrl.clone();
    url.hostname = "kelarpacific.itneck.ai";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (isEstimateHost(host)) {
    if (pathname === "/api/estimate/login") return NextResponse.next();

    if (pathname.startsWith("/api/")) return notFound(request);

    const authed = await isAuthed(request);

    if (pathname === "/login") {
      if (authed) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.search = "";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    if (pathname === "/estimate" || pathname.startsWith("/estimate/")) {
      if (!authed) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.search = "";
        return NextResponse.redirect(url);
      }
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (pathname === "/") {
      if (!authed) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.search = "";
        return NextResponse.redirect(url);
      }
      const url = request.nextUrl.clone();
      url.pathname = "/estimate";
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
      if (authed) {
        const url = request.nextUrl.clone();
        url.pathname = "/estimate";
        url.search = "";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    if (pathname === "/estimate" || pathname.startsWith("/estimate/")) {
      if (!authed) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.search = "";
        url.searchParams.set(
          "next",
          `${pathname}${request.nextUrl.search}`,
        );
        return NextResponse.redirect(url);
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
