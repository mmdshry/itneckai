import { clientIp, jsonNoStore } from "@/lib/http";
import { joinBusywork } from "@/lib/busywork/service";
import {
  TURNSTILE_FAILED_MESSAGE,
  isHumanRequest,
  turnstileTokenFromBody,
} from "@/lib/turnstile";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore(
      { ok: false, error: "Please correct the highlighted fields and try again." },
      400,
    );
  }

  if (!(await isHumanRequest(turnstileTokenFromBody(body), clientIp(request)))) {
    return jsonNoStore({ ok: false, error: TURNSTILE_FAILED_MESSAGE }, 403);
  }

  const result = await joinBusywork(body);
  return jsonNoStore(result, result.ok ? 200 : 400);
}
