const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const TURNSTILE_FAILED_MESSAGE =
  "Verification failed. Please try again.";

export function turnstileSecretConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

export function turnstileRequired(): boolean {
  if (process.env.NODE_ENV === "production") return true;
  return turnstileSecretConfigured();
}

export function turnstileTokenFromBody(body: unknown): string {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "";
  const token = (body as { turnstileToken?: unknown }).turnstileToken;
  return typeof token === "string" ? token : "";
}

export async function isHumanRequest(
  token: unknown,
  ip: string,
): Promise<boolean> {
  const value = typeof token === "string" ? token.trim() : "";
  if (!turnstileRequired()) return true;
  // The widget often cannot reach Cloudflare from a local browser. A missing
  // token must not block development. A token that is present is still checked.
  if (process.env.NODE_ENV !== "production" && !value) return true;
  return verifyTurnstileToken(value, ip);
}

export async function verifyTurnstileToken(
  token: string,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret || !token.trim()) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  try {
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
