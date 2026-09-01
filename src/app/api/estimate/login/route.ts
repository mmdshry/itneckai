import { clientIp, jsonNoStore } from "@/lib/http";
import { isRateLimited } from "@/lib/busywork/rate-limit";
import {
  createEstimateToken,
  ESTIMATE_COOKIE,
  estimateCookieOptions,
} from "@/lib/estimate/auth-cookie";
import {
  estimateAuthConfigured,
  estimateCredentialsMatch,
} from "@/lib/estimate/credentials";
import {
  TURNSTILE_FAILED_MESSAGE,
  turnstileRequired,
  verifyTurnstileToken,
} from "@/lib/turnstile";
import { isEstimateHost } from "@/lib/hosts";

export const dynamic = "force-dynamic";

function safeNext(requested: unknown, host: string | null): string {
  if (isEstimateHost(host)) return "/";
  if (
    typeof requested === "string" &&
    requested.startsWith("/estimate") &&
    !requested.startsWith("//") &&
    !requested.includes("://")
  ) {
    return requested;
  }
  return "/estimate";
}

export async function POST(request: Request) {
  if (!estimateAuthConfigured()) {
    return jsonNoStore(
      { ok: false, error: "Sign-in is not configured." },
      503,
    );
  }

  const ip = clientIp(request);
  if (isRateLimited(`estimate-login:${ip}`, 8)) {
    return jsonNoStore(
      { ok: false, error: "Too many attempts. Please wait a few minutes." },
      429,
    );
  }

  let body: {
    username?: unknown;
    password?: unknown;
    next?: unknown;
    turnstileToken?: unknown;
  };
  try {
    body = (await request.json()) as {
      username?: unknown;
      password?: unknown;
      next?: unknown;
      turnstileToken?: unknown;
    };
  } catch {
    return jsonNoStore({ ok: false, error: "Invalid credentials" }, 400);
  }

  if (turnstileRequired()) {
    const captcha =
      typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    const human = await verifyTurnstileToken(captcha, ip);
    if (!human) {
      return jsonNoStore(
        { ok: false, error: TURNSTILE_FAILED_MESSAGE },
        403,
      );
    }
  }

  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!estimateCredentialsMatch(username, password)) {
    return jsonNoStore({ ok: false, error: "Invalid credentials" }, 401);
  }

  const token = await createEstimateToken();
  if (!token) {
    return jsonNoStore(
      { ok: false, error: "Sign-in is not configured." },
      503,
    );
  }

  const host = request.headers.get("host");
  const res = jsonNoStore({
    ok: true,
    next: safeNext(body.next, host),
  });
  res.cookies.set(ESTIMATE_COOKIE, token, estimateCookieOptions);
  return res;
}
