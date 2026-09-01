import { clientIp, jsonNoStore } from "@/lib/http";
import { submitBusywork } from "@/lib/busywork/service";
import {
  TURNSTILE_FAILED_MESSAGE,
  isHumanRequest,
  turnstileTokenFromBody,
} from "@/lib/turnstile";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (!(await isHumanRequest(turnstileTokenFromBody(body), clientIp(request)))) {
    return jsonNoStore({ ok: false, error: TURNSTILE_FAILED_MESSAGE }, 403);
  }

  const emailCopy =
    Boolean(body) &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    (body as { emailCopy?: unknown }).emailCopy === true;

  const result = await submitBusywork({ emailCopy });
  return jsonNoStore(result, result.ok ? 200 : 400);
}
