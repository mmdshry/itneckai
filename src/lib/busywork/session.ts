import { createHmac, randomBytes, createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "busywork_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export const MAGIC_LINK_TTL_MS = 20 * 60 * 1000;

function secret(): string {
  const value = process.env.BUSYWORK_SESSION_SECRET?.trim();
  if (value) return value;
  if (process.env.NODE_ENV !== "production") {
    return "dev-busywork-session-secret";
  }
  throw new Error("BUSYWORK_SESSION_SECRET is not configured.");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createMagicToken(): string {
  return randomBytes(32).toString("base64url");
}

export function signSessionId(sessionId: string): string {
  const mac = createHmac("sha256", secret()).update(sessionId).digest("base64url");
  return `${sessionId}.${mac}`;
}

export function verifySessionCookie(value: string | undefined): string | null {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const sessionId = value.slice(0, dot);
  const mac = value.slice(dot + 1);
  if (!sessionId || !mac) return null;
  try {
    const expected = createHmac("sha256", secret())
      .update(sessionId)
      .digest("base64url");
    const a = Buffer.from(mac);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return sessionId;
  } catch {
    return null;
  }
}

export async function readSessionId(): Promise<string | null> {
  const jar = await cookies();
  return verifySessionCookie(jar.get(SESSION_COOKIE)?.value);
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

export async function writeSessionCookie(sessionId: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, signSessionId(sessionId), COOKIE_OPTIONS);
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
