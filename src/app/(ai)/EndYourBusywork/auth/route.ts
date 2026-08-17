import { NextRequest, NextResponse } from "next/server";
import { BUSYWORK_PATH } from "@/lib/busywork/copy";
import { consumeMagicToken } from "@/lib/busywork/repo";
import {
  COOKIE_OPTIONS,
  SESSION_COOKIE,
  signSessionId,
} from "@/lib/busywork/session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
  const dest = `${request.nextUrl.origin}${BUSYWORK_PATH}`;

  if (!token) {
    return NextResponse.redirect(`${dest}?error=invalid-link`);
  }

  try {
    const record = await consumeMagicToken(token);
    if (!record) {
      return NextResponse.redirect(`${dest}?error=invalid-link`);
    }
    const signed = signSessionId(record.sessionId);
    const response = NextResponse.redirect(`${dest}?joined=1`);
    response.cookies.set(SESSION_COOKIE, signed, COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error("Busywork magic link failed:", err);
    return NextResponse.redirect(`${dest}?error=invalid-link`);
  }
}
