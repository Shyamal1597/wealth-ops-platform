/**
 * SQLite-backed client store, replacing the old data/clients.json flat file
 * (which held 220K+ records and was fully read/written into memory on every
 * login-related request — not viable long-term, and not safe under concurrent
 * writes since a whole-file read-modify-write is not atomic).
 *
 * Note on CLAUDE.md rule #1 ("never use in-memory singletons for shared state
 * — each API route is a separate module bundle"): that rule is about state
 * that lives ONLY in a JS variable with no disk backing (e.g. a Map), where
 * each bundle's copy is genuinely a different, disconnected object. This is
 * different: every bundle opens its own better-sqlite3 connection, but every
 * one of those connections points at the same file (data/clients.db) via
 * WAL mode, so state written by one route is immediately visible to another
 * — the file is the shared state, same as the old JSON approach, just with
 * real indexing and atomic writes instead of a 37MB read+parse+stringify+write
 * on every request.
 */
import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export interface ClientRecord {
  clientId: string;
  name: string;
  email?: string;
  mobile?: string;
  password?: string;
  accountStatus?: string;
  accountOpenDate?: string;
  requiresActivation?: boolean;
}

interface ClientRow {
  clientId: string;
  name: string;
  email: string | null;
  mobile: string | null;
  password: string | null;
  accountStatus: string | null;
  accountOpenDate: string | null;
  requiresActivation: number;
  createdAt: string | null;
  createdBy: string | null;
}

const DB_PATH = join(process.cwd(), 'data', 'clients.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  // Fail loudly rather than silently opening/creating an EMPTY clients.db if
  // the one-time migration (scripts/migrate-clients-to-sqlite.js) hasn't run
  // yet. Without this check, deploying this code before migrating would make
  // every client login fail with a generic "invalid credentials" — a full,
  // confusing client-portal outage instead of a clear startup error.
  const jsonBackupExists = existsSync(join(dataDir, 'clients.json'));
  if (!existsSync(DB_PATH) && jsonBackupExists) {
    throw new Error(
      'data/clients.db does not exist yet, but data/clients.json does. ' +
      'Run `node scripts/migrate-clients-to-sqlite.js` before starting the app with this code.'
    );
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL'); // allows concurrent readers alongside the writer
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      clientId           TEXT PRIMARY KEY,
      name               TEXT NOT NULL,
      email              TEXT,
      mobile             TEXT,
      password           TEXT,
      accountStatus      TEXT,
      accountOpenDate    TEXT,
      requiresActivation INTEGER NOT NULL DEFAULT 0,
      createdAt          TEXT,
      createdBy          TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_clients_email  ON clients(email);
    CREATE INDEX IF NOT EXISTS idx_clients_mobile ON clients(mobile);
    CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(accountStatus);

    -- Replaces data/client-otps.json. That was a whole-file read-modify-write
    -- on every OTP request (login OTP, admin resend, profile mobile/email
    -- change verification) — the same non-atomic-write race the clients
    -- table above was built to fix, except *more* exposed here since OTP
    -- requests are bursty around login rather than occasional profile edits.
    -- A row-level SQLite write does not have that race.
    CREATE TABLE IF NOT EXISTS otps (
      otpKey    TEXT PRIMARY KEY,
      otp       TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      extra     TEXT
    );
  `);

  return db;
}

export interface OtpRecord {
  otp: string;
  expiresAt: number;
  extra?: Record<string, unknown>;
}

export function setOtp(key: string, otp: string, expiresAt: number, extra?: Record<string, unknown>): void {
  getDb()
    .prepare(`INSERT INTO otps (otpKey, otp, expiresAt, extra) VALUES (?, ?, ?, ?)
              ON CONFLICT(otpKey) DO UPDATE SET otp = excluded.otp, expiresAt = excluded.expiresAt, extra = excluded.extra`)
    .run(key, otp, expiresAt, extra ? JSON.stringify(extra) : null);
}

export function getOtp(key: string): OtpRecord | null {
  const row = getDb().prepare('SELECT * FROM otps WHERE otpKey = ?').get(key) as
    | { otpKey: string; otp: string; expiresAt: number; extra: string | null }
    | undefined;
  if (!row) return null;
  return {
    otp: row.otp,
    expiresAt: row.expiresAt,
    extra: row.extra ? JSON.parse(row.extra) : undefined,
  };
}

export function deleteOtp(key: string): void {
  getDb().prepare('DELETE FROM otps WHERE otpKey = ?').run(key);
}

function rowToRecord(row: ClientRow): ClientRecord {
  return {
    clientId: row.clientId,
    name: row.name,
    email: row.email ?? undefined,
    mobile: row.mobile ?? undefined,
    password: row.password ?? undefined,
    accountStatus: row.accountStatus ?? undefined,
    accountOpenDate: row.accountOpenDate ?? undefined,
    requiresActivation: !!row.requiresActivation,
  };
}

export function findClientById(clientId: string): ClientRecord | null {
  const row = getDb()
    .prepare('SELECT * FROM clients WHERE clientId = ?')
    .get(clientId) as ClientRow | undefined;
  return row ? rowToRecord(row) : null;
}

/** Looks up a client by email OR mobile matching the given contact string (used by forgot-client-id). */
export function findClientByContact(contact: string): ClientRecord | null {
  const row = getDb()
    .prepare('SELECT * FROM clients WHERE email = ? OR mobile = ? LIMIT 1')
    .get(contact, contact) as ClientRow | undefined;
  return row ? rowToRecord(row) : null;
}

/** Partial update by clientId. Only provided fields are changed. Returns the updated record, or null if not found. */
export function updateClient(clientId: string, updates: Partial<ClientRecord>): ClientRecord | null {
  const existing = findClientById(clientId);
  if (!existing) return null;

  const merged: ClientRecord = { ...existing, ...updates };

  getDb()
    .prepare(
      `UPDATE clients SET name = ?, email = ?, mobile = ?, password = ?,
       accountStatus = ?, accountOpenDate = ?, requiresActivation = ?
       WHERE clientId = ?`
    )
    .run(
      merged.name,
      merged.email ?? null,
      merged.mobile ?? null,
      merged.password ?? null,
      merged.accountStatus ?? null,
      merged.accountOpenDate ?? null,
      merged.requiresActivation ? 1 : 0,
      clientId
    );

  // merged already reflects exactly what was just written — no need to re-SELECT it.
  return merged;
}

/**
 * Creates a new client, always starting at requiresActivation = true (matches
 * how every existing client record behaves — no separate first-login path).
 * Returns null if the clientId already exists (caller should treat as 409).
 */
export function createClient(
  data: { clientId: string; name: string; email?: string; mobile?: string },
  createdBy?: string
): ClientRecord | null {
  if (findClientById(data.clientId)) return null;

  getDb()
    .prepare(
      `INSERT INTO clients (clientId, name, email, mobile, requiresActivation, createdAt, createdBy)
       VALUES (?, ?, ?, ?, 1, ?, ?)`
    )
    .run(
      data.clientId,
      data.name,
      data.email ?? null,
      data.mobile ?? null,
      new Date().toISOString(),
      createdBy ?? null
    );

  return findClientById(data.clientId);
}

export interface BulkCreateResult {
  inserted: number;
  skipped: Array<{ clientId: string; reason: string }>;
}

/** Bulk insert (e.g. from a CSV upload), wrapped in one transaction. Duplicates/invalid rows are skipped, not fatal. */
export function bulkCreateClients(
  records: Array<{ clientId: string; name: string; email?: string; mobile?: string }>,
  createdBy?: string
): BulkCreateResult {
  const database = getDb();
  const result: BulkCreateResult = { inserted: 0, skipped: [] };

  const insertStmt = database.prepare(
    `INSERT INTO clients (clientId, name, email, mobile, requiresActivation, createdAt, createdBy)
     VALUES (?, ?, ?, ?, 1, ?, ?)`
  );
  const existsStmt = database.prepare('SELECT 1 FROM clients WHERE clientId = ?');
  const now = new Date().toISOString();

  const runAll = database.transaction((rows: typeof records) => {
    const seenInBatch = new Set<string>();
    for (const r of rows) {
      if (!r.clientId || !r.name) {
        result.skipped.push({ clientId: r.clientId || '(missing)', reason: 'Missing Client ID or name' });
        continue;
      }
      if (!r.email && !r.mobile) {
        result.skipped.push({ clientId: r.clientId, reason: 'Needs at least one of email or mobile' });
        continue;
      }
      if (seenInBatch.has(r.clientId)) {
        result.skipped.push({ clientId: r.clientId, reason: 'Duplicate within this upload' });
        continue;
      }
      if (existsStmt.get(r.clientId)) {
        result.skipped.push({ clientId: r.clientId, reason: 'Client ID already exists' });
        continue;
      }
      seenInBatch.add(r.clientId);
      insertStmt.run(r.clientId, r.name, r.email ?? null, r.mobile ?? null, now, createdBy ?? null);
      result.inserted++;
    }
  });

  runAll(records);
  return result;
}

export interface ListClientsOptions {
  search?: string;
  status?: 'active' | 'pending' | 'all';
  page?: number;
  limit?: number;
}

export function listClients(opts: ListClientsOptions = {}): { clients: ClientRecord[]; total: number } {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(200, Math.max(1, opts.limit ?? 25));
  const offset = (page - 1) * limit;

  const where: string[] = [];
  const params: unknown[] = [];

  if (opts.search) {
    where.push('(clientId LIKE ? OR name LIKE ? OR email LIKE ? OR mobile LIKE ?)');
    const term = `%${opts.search}%`;
    params.push(term, term, term, term);
  }
  if (opts.status === 'active') {
    where.push('requiresActivation = 0');
  } else if (opts.status === 'pending') {
    where.push('requiresActivation = 1');
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const database = getDb();

  const total = (
    database.prepare(`SELECT COUNT(*) as c FROM clients ${whereSql}`).get(...params) as { c: number }
  ).c;

  const rows = database
    .prepare(`SELECT * FROM clients ${whereSql} ORDER BY createdAt DESC, clientId ASC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset) as ClientRow[];

  return { clients: rows.map(rowToRecord), total };
}
