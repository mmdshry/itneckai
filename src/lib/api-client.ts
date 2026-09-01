import type {
  ActionFailure,
  BusyworkEventName,
  IdeaKind,
  JoinInput,
  PublicSession,
} from "@/lib/busywork/schema";

async function readJson<T>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    return {
      ok: false,
      error: "Something went wrong. Please try again.",
    } as T;
  }
}

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return await readJson<T>(res);
  } catch {
    return {
      ok: false,
      error: "Something went wrong. Please try again.",
    } as T;
  }
}

export type { PublicSession };

export async function getBusyworkSession(): Promise<
  { ok: true; session: PublicSession | null } | ActionFailure
> {
  try {
    const res = await fetch("/api/busywork/session", { cache: "no-store" });
    return await readJson(res);
  } catch {
    return { ok: true, session: null };
  }
}

export async function joinBusywork(
  input: JoinInput & { turnstileToken?: string },
): Promise<{ ok: true; email: string; devLink?: string } | ActionFailure> {
  return postJson("/api/busywork/join", input);
}

export async function addBusyworkIdea(
  kind: IdeaKind,
  input: unknown,
): Promise<{ ok: true; session: PublicSession } | ActionFailure> {
  return postJson("/api/busywork/ideas", { action: "add", kind, input });
}

export async function removeBusyworkIdea(
  kind: IdeaKind,
  id: string,
): Promise<{ ok: true; session: PublicSession } | ActionFailure> {
  return postJson("/api/busywork/ideas", { action: "remove", kind, id });
}

export async function submitBusywork(opts?: {
  emailCopy?: boolean;
  turnstileToken?: string;
}): Promise<{ ok: true; session: PublicSession } | ActionFailure> {
  return postJson("/api/busywork/submit", opts ?? {});
}

export async function trackBusyworkEvent(
  name: BusyworkEventName,
  meta?: Record<string, unknown>,
): Promise<void> {
  await postJson("/api/busywork/events", { name, meta });
}

export async function submitContact(input: unknown) {
  return postJson<{
    ok: true;
  } | {
    ok: false;
    error: string;
    fieldErrors?: Record<string, string[]>;
  }>("/api/contact", input);
}

export async function submitItneckContact(input: unknown) {
  return postJson<{
    ok: true;
  } | {
    ok: false;
    error: string;
    fieldErrors?: Record<string, string[]>;
  }>("/api/itneck/contact", input);
}

export async function subscribeTechTalk(email: string) {
  return postJson<{ ok: true } | { ok: false; error: string }>(
    "/api/itneck/techtalk",
    { email },
  );
}
