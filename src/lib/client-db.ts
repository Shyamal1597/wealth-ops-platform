// Each API route bundle opens its own connection, but all connections point at
// the same data/clients.db file (WAL mode) — this is disk-backed shared state,
// not the in-memory-singleton pattern CLAUDE.md rule #1 warns against.
import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';

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
const JSON_BACKUP_PATH = join(process.cwd(), 'data', 'clients.json');

let db: Database.Database | null = null;

// One-time backfill from the legacy JSON export. Only ever called while the
// clients table is empty (see getDb below), so it can never overwrite or
// wipe live data — it has nothing to do if clients.db is already populated.
// INSERT OR IGNORE makes it safe even if two route bundles race into this
// on the same cold start: whichever finishes first wins, the other just
// no-ops on the now-existing rows instead of throwing.
function migrateFromJsonBackup(database: Database.Database): void {
  if (!existsSync(JSON_BACKUP_PATH)) return;

  let records: Array<Record<string, unknown>>;
  try {
    records = JSON.parse(readFileSync(JSON_BACKUP_PATH, 'utf-8'));
  } catch {
    return;
  }
  if (!Array.isArray(records)) return;

  const insert = database.prepare(`
    INSERT OR IGNORE INTO clients
      (clientId, name, email, mobile, password, accountStatus, accountOpenDate, requiresActivation, createdAt, createdBy)
    VALUES (@clientId, @name, @email, @mobile, @password, @accountStatus, @accountOpenDate, @requiresActivation, @createdAt, @createdBy)
  `);

  const insertAll = database.transaction((rows: typeof records) => {
    const seen = new Set<string>();
    for (const c of rows) {
      const clientId = c.clientId as string | undefined;
      if (!clientId || seen.has(clientId)) continue;
      seen.add(clientId);
      insert.run({
        clientId,
        name: (c.name as string) ?? '',
        email: (c.email as string) ?? null,
        mobile: (c.mobile as string) ?? null,
        password: (c.password as string) ?? null,
        accountStatus: (c.accountStatus as string) ?? null,
        accountOpenDate: (c.accountOpenDate as string) ?? null,
        requiresActivation: c.requiresActivation ? 1 : 0,
        createdAt: null,
        createdBy: null,
      });
    }
  });

  insertAll(records);
}

function getDb(): Database.Database {
  if (db) return db;

  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
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

    CREATE TABLE IF NOT EXISTS otps (
      otpKey    TEXT PRIMARY KEY,
      otp       TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      extra     TEXT
    );
  `);

  const { c: clientCount } = db.prepare('SELECT COUNT(*) as c FROM clients').get() as { c: number };
  if (clientCount === 0) migrateFromJsonBackup(db);

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

export function findClientByContact(contact: string): ClientRecord | null {
  const row = getDb()
    .prepare('SELECT * FROM clients WHERE email = ? OR mobile = ? LIMIT 1')
    .get(contact, contact) as ClientRow | undefined;
  return row ? rowToRecord(row) : null;
}

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

  return merged;
}

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
