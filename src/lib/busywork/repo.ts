import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import {
  emptyPayload,
  parsePayload,
  type BusyworkEventName,
  type BusyworkPayload,
} from "./schema";
import {
  busyworkContacts,
  busyworkEvents,
  busyworkMagicLinks,
  busyworkSessions,
} from "./tables";
import { createMagicToken, hashToken, MAGIC_LINK_TTL_MS } from "./session";

export type BusyworkRecord = {
  sessionId: string;
  contactId: string;
  firstName: string;
  email: string;
  status: "draft" | "submitted";
  payload: BusyworkPayload;
  submittedAt: Date | number | string | null;
  updatedAt: Date | number | string | null;
};

async function loadRecord(sessionId: string): Promise<BusyworkRecord | null> {
  const db = await getDb();
  const rows = await db
    .select({
      sessionId: busyworkSessions.id,
      contactId: busyworkContacts.id,
      firstName: busyworkContacts.firstName,
      email: busyworkContacts.email,
      status: busyworkSessions.status,
      payload: busyworkSessions.payload,
      submittedAt: busyworkSessions.submittedAt,
      updatedAt: busyworkSessions.updatedAt,
    })
    .from(busyworkSessions)
    .innerJoin(
      busyworkContacts,
      eq(busyworkSessions.contactId, busyworkContacts.id),
    )
    .where(eq(busyworkSessions.id, sessionId))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  return {
    sessionId: row.sessionId,
    contactId: row.contactId,
    firstName: row.firstName,
    email: row.email,
    status: row.status === "submitted" ? "submitted" : "draft",
    payload: parsePayload(row.payload),
    submittedAt: row.submittedAt ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}

export async function getRecordBySessionId(
  sessionId: string,
): Promise<BusyworkRecord | null> {
  return loadRecord(sessionId);
}

export async function upsertJoin(opts: {
  firstName: string;
  email: string;
}): Promise<{ record: BusyworkRecord; token: string }> {
  const db = await getDb();
  const now = new Date();
  const email = opts.email.toLowerCase();

  const existing = await db
    .select()
    .from(busyworkContacts)
    .where(eq(busyworkContacts.email, email))
    .limit(1);

  let contactId: string;
  if (existing[0]) {
    contactId = existing[0].id;
    if (existing[0].firstName !== opts.firstName) {
      await db
        .update(busyworkContacts)
        .set({ firstName: opts.firstName })
        .where(eq(busyworkContacts.id, contactId));
    }
  } else {
    contactId = crypto.randomUUID();
    await db.insert(busyworkContacts).values({
      id: contactId,
      firstName: opts.firstName,
      email,
      consentAt: now,
    });
  }

  const sessions = await db
    .select()
    .from(busyworkSessions)
    .where(eq(busyworkSessions.contactId, contactId))
    .orderBy(desc(busyworkSessions.createdAt))
    .limit(1);

  let sessionId: string;
  if (sessions[0]) {
    sessionId = sessions[0].id;
  } else {
    sessionId = crypto.randomUUID();
    await db.insert(busyworkSessions).values({
      id: sessionId,
      contactId,
      status: "draft",
      payload: emptyPayload(),
    });
  }

  const token = createMagicToken();
  await db.insert(busyworkMagicLinks).values({
    id: crypto.randomUUID(),
    contactId,
    sessionId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_MS),
  });

  const record = await loadRecord(sessionId);
  if (!record) {
    throw new Error("Failed to load End Your Busywork session.");
  }
  return { record, token };
}

function timestampMs(value: Date | number | string | null | undefined): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) return asNumber;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export async function consumeMagicToken(
  token: string,
): Promise<BusyworkRecord | null> {
  const db = await getDb();
  const tokenHash = hashToken(token);
  const links = await db
    .select()
    .from(busyworkMagicLinks)
    .where(eq(busyworkMagicLinks.tokenHash, tokenHash))
    .limit(1);
  const link = links[0];
  if (!link || timestampMs(link.expiresAt) <= Date.now()) {
    return null;
  }
  if (!link.consumedAt) {
    await db
      .update(busyworkMagicLinks)
      .set({ consumedAt: new Date() })
      .where(eq(busyworkMagicLinks.id, link.id));
  }
  return loadRecord(link.sessionId);
}

export async function savePayload(
  sessionId: string,
  payload: BusyworkPayload,
): Promise<BusyworkRecord | null> {
  const db = await getDb();
  await db
    .update(busyworkSessions)
    .set({ payload, updatedAt: new Date() })
    .where(eq(busyworkSessions.id, sessionId));
  return loadRecord(sessionId);
}

export async function markSubmitted(
  sessionId: string,
): Promise<BusyworkRecord | null> {
  const db = await getDb();
  await db
    .update(busyworkSessions)
    .set({
      status: "submitted",
      submittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(busyworkSessions.id, sessionId));
  return loadRecord(sessionId);
}

export async function getLastSubmitContentHash(
  sessionId: string,
): Promise<string | null> {
  const db = await getDb();
  const rows = await db
    .select({ meta: busyworkEvents.meta })
    .from(busyworkEvents)
    .where(
      and(
        eq(busyworkEvents.sessionId, sessionId),
        eq(busyworkEvents.name, "successful_submit"),
      ),
    )
    .orderBy(desc(busyworkEvents.createdAt))
    .limit(1);
  const hash = rows[0]?.meta?.contentHash;
  return typeof hash === "string" && hash.length > 0 ? hash : null;
}

export async function recordEvent(opts: {
  sessionId?: string | null;
  name: BusyworkEventName;
  meta?: Record<string, unknown>;
}): Promise<void> {
  const db = await getDb();
  await db.insert(busyworkEvents).values({
    id: crypto.randomUUID(),
    sessionId: opts.sessionId ?? null,
    name: opts.name,
    meta: opts.meta ?? null,
  });
}
