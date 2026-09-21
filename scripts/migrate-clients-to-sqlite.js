#!/usr/bin/env node
// Manual/local-dev tool only — the app now migrates itself on first run
// (see getDb() in src/lib/client-db.ts), so this is not required for any
// deployment. Kept for local inspection and for --force, which the app
// intentionally never does on its own. Usage:
//   node scripts/migrate-clients-to-sqlite.js [--force]
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_PATH = path.join(DATA_DIR, 'clients.json');
const DB_PATH = path.join(DATA_DIR, 'clients.db');
const FORCE = process.argv.includes('--force');

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(JSON_PATH)) {
  fail(`Source file not found: ${JSON_PATH}`);
}

console.log(`Reading ${JSON_PATH} ...`);
const raw = fs.readFileSync(JSON_PATH, 'utf8');
let clients;
try {
  clients = JSON.parse(raw);
} catch (e) {
  fail(`Could not parse clients.json as JSON: ${e.message}`);
}
if (!Array.isArray(clients)) {
  fail('clients.json is not a JSON array — aborting, nothing was touched.');
}
console.log(`Found ${clients.length} client records in JSON.`);

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

if (fs.existsSync(DB_PATH) && !FORCE) {
  const existing = new Database(DB_PATH, { readonly: true });
  let existingCount = 0;
  try {
    existingCount = existing.prepare("SELECT COUNT(*) as c FROM clients").get().c;
  } catch (e) {
    // table doesn't exist yet — fine, treat as empty
  }
  existing.close();
  if (existingCount > 0) {
    fail(
      `${DB_PATH} already exists with ${existingCount} rows. Refusing to overwrite.\n` +
      `  Re-run with --force to wipe and re-migrate from clients.json.`
    );
  }
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

if (FORCE) {
  console.log('--force passed: dropping any existing clients table.');
  db.exec('DROP TABLE IF EXISTS clients');
}

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

const insert = db.prepare(`
  INSERT INTO clients (clientId, name, email, mobile, password, accountStatus, accountOpenDate, requiresActivation, createdAt, createdBy)
  VALUES (@clientId, @name, @email, @mobile, @password, @accountStatus, @accountOpenDate, @requiresActivation, @createdAt, @createdBy)
`);

let skipped = 0;
const seen = new Set();

const insertAll = db.transaction((rows) => {
  for (const c of rows) {
    if (!c.clientId) { skipped++; continue; }
    if (seen.has(c.clientId)) { skipped++; continue; } // duplicate clientId in source JSON — keep first occurrence
    seen.add(c.clientId);
    insert.run({
      clientId: c.clientId,
      name: c.name ?? '',
      email: c.email ?? null,
      mobile: c.mobile ?? null,
      password: c.password ?? null,
      accountStatus: c.accountStatus ?? null,
      accountOpenDate: c.accountOpenDate ?? null,
      requiresActivation: c.requiresActivation ? 1 : 0,
      createdAt: null,   // pre-existing records predate this column; left null intentionally
      createdBy: null,
    });
  }
});

console.log('Inserting into SQLite (single transaction)...');
const start = Date.now();
insertAll(clients);
const elapsedMs = Date.now() - start;

const finalCount = db.prepare('SELECT COUNT(*) as c FROM clients').get().c;
db.close();

console.log(`\nDone in ${elapsedMs}ms.`);
console.log(`  Source JSON records: ${clients.length}`);
console.log(`  Skipped (missing/duplicate clientId): ${skipped}`);
console.log(`  Rows now in clients.db: ${finalCount}`);

if (finalCount !== clients.length - skipped) {
  fail(
    `Row count mismatch! Expected ${clients.length - skipped}, got ${finalCount}. ` +
    `Do not deploy — investigate before proceeding. clients.json was not modified.`
  );
}

console.log(`\n✔ Migration verified. clients.json was left untouched — keep it as a backup.\n`);
