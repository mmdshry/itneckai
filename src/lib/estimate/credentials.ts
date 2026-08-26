import { createHash, timingSafeEqual } from "crypto";

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function estimateAuthConfigured(): boolean {
  return Boolean(
    process.env.ESTIMATE_AUTH_USER?.trim() &&
      process.env.ESTIMATE_AUTH_PASSWORD,
  );
}

export function estimateCredentialsMatch(
  username: string,
  password: string,
): boolean {
  const expectedUser = process.env.ESTIMATE_AUTH_USER ?? "";
  const expectedPass = process.env.ESTIMATE_AUTH_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;
  const userOk = timingSafeEqual(digest(username), digest(expectedUser));
  const passOk = timingSafeEqual(digest(password), digest(expectedPass));
  return userOk && passOk;
}
