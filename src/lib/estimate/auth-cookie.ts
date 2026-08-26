const encoder = new TextEncoder();

export const ESTIMATE_COOKIE = "estimate_auth";
export const ESTIMATE_COOKIE_MAX_AGE = 8 * 60 * 60;

function toBase64Url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i += 1) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const bin = atob(padded + pad);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

function cookieSecret(): string {
  const dedicated = process.env.ESTIMATE_SESSION_SECRET?.trim();
  if (dedicated) return dedicated;
  const shared = process.env.BUSYWORK_SESSION_SECRET?.trim();
  if (shared) return shared;
  if (process.env.NODE_ENV !== "production") {
    return "dev-estimate-session-secret";
  }
  return "";
}

async function hmac(secret: string, message: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", key, encoder.encode(message));
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createEstimateToken(): Promise<string | null> {
  const secret = cookieSecret();
  if (!secret) return null;
  const exp = String(Date.now() + ESTIMATE_COOKIE_MAX_AGE * 1000);
  const mac = toBase64Url(await hmac(secret, exp));
  return `${exp}.${mac}`;
}

export async function verifyEstimateToken(
  value: string | undefined,
): Promise<boolean> {
  if (!value) return false;
  const secret = cookieSecret();
  if (!secret) return false;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return false;
  const expRaw = value.slice(0, dot);
  const macRaw = value.slice(dot + 1);
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = new Uint8Array(await hmac(secret, expRaw));
  const given = fromBase64Url(macRaw);
  if (!given) return false;
  return timingSafeEqualBytes(expected, given);
}

export const estimateCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: ESTIMATE_COOKIE_MAX_AGE,
};
