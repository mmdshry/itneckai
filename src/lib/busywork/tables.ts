import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { BusyworkPayload } from "./schema";

export const busyworkContacts = sqliteTable("busywork_contacts", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  email: text("email").notNull().unique(),
  consentAt: integer("consent_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const busyworkSessions = sqliteTable("busywork_sessions", {
  id: text("id").primaryKey(),
  contactId: text("contact_id")
    .notNull()
    .references(() => busyworkContacts.id),
  status: text("status").notNull().default("draft"),
  payload: text("payload", { mode: "json" }).$type<BusyworkPayload>().notNull(),
  submittedAt: integer("submitted_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const busyworkMagicLinks = sqliteTable("busywork_magic_links", {
  id: text("id").primaryKey(),
  contactId: text("contact_id")
    .notNull()
    .references(() => busyworkContacts.id),
  sessionId: text("session_id")
    .notNull()
    .references(() => busyworkSessions.id),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  consumedAt: integer("consumed_at", { mode: "timestamp_ms" }),
});

export const busyworkEvents = sqliteTable("busywork_events", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").references(() => busyworkSessions.id),
  name: text("name").notNull(),
  meta: text("meta", { mode: "json" }).$type<Record<string, unknown> | null>(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});
