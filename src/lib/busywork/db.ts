import { mkdirSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./tables";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS busywork_contacts (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    consent_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS busywork_contacts_email_idx
    ON busywork_contacts (email)`,
  `CREATE TABLE IF NOT EXISTS busywork_sessions (
    id TEXT PRIMARY KEY,
    contact_id TEXT NOT NULL REFERENCES busywork_contacts(id),
    status TEXT NOT NULL DEFAULT 'draft',
    payload TEXT NOT NULL DEFAULT '{}',
    submitted_at INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS busywork_magic_links (
    id TEXT PRIMARY KEY,
    contact_id TEXT NOT NULL REFERENCES busywork_contacts(id),
    session_id TEXT NOT NULL REFERENCES busywork_sessions(id),
    token_hash TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    consumed_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS busywork_events (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES busywork_sessions(id),
    name TEXT NOT NULL,
    meta TEXT,
    created_at INTEGER NOT NULL
  )`,
];

let db: LibSQLDatabase<typeof schema> | null = null;
let client: Client | null = null;

export function sqliteFilePath(): string {
  if (process.env.BUSYWORK_SQLITE_PATH) {
    return process.env.BUSYWORK_SQLITE_PATH;
  }
  return path.join(process.cwd(), "data", "busywork.sqlite");
}

function fileUrl(filePath: string): string {
  return pathToFileURL(path.resolve(filePath)).href;
}

export function databaseConfigured(): boolean {
  return true;
}

export async function getDb() {
  if (db) return db;

  const filePath = sqliteFilePath();
  mkdirSync(path.dirname(filePath), { recursive: true });

  client = createClient({ url: fileUrl(filePath) });
  for (const statement of STATEMENTS) {
    await client.execute(statement);
  }

  db = drizzle(client, { schema });
  return db;
}
