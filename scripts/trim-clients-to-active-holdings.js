#!/usr/bin/env node
/**
 * Trims data/clients.json down to only clients with active holdings, per
 * active-holdings-clients.json (exported from Active_holdings_clients.xlsx).
 *
 * IMPORTANT: this is designed to run against your REAL, LIVE data/clients.json
 * — not a stale copy — because for every client that matches the target list,
 * it preserves whatever is ALREADY in your live file (password hash,
 * accountStatus, accountOpenDate, requiresActivation) untouched. It never
 * invents or overwrites activation data. Clients in the target list who don't
 * exist in your live file yet are added as new pending (requiresActivation)
 * records, built from the target list's name/mobile/email.
 *
 * DRY RUN BY DEFAULT — prints exactly what would happen, changes nothing.
 * Add --apply to actually write the change (after making a timestamped backup
 * of your current clients.json automatically).
 *
 * Usage:
 *   node scripts/trim-clients-to-active-holdings.js              (dry run)
 *   node scripts/trim-clients-to-active-holdings.js --apply       (writes it)
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const CLIENTS_PATH = path.join(DATA_DIR, 'clients.json');
const TARGET_LIST_PATH = path.join(__dirname, 'active-holdings-clients.json');
const APPLY = process.argv.includes('--apply');

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(CLIENTS_PATH)) fail(`Not found: ${CLIENTS_PATH}`);
if (!fs.existsSync(TARGET_LIST_PATH)) fail(`Not found: ${TARGET_LIST_PATH} (should ship alongside this script)`);

const live = JSON.parse(fs.readFileSync(CLIENTS_PATH, 'utf8'));
const target = JSON.parse(fs.readFileSync(TARGET_LIST_PATH, 'utf8'));

if (!Array.isArray(live)) fail('data/clients.json is not a JSON array — aborting, nothing was touched.');

console.log(`Live clients.json: ${live.length} records`);
console.log(`Target (active/holdings) list: ${target.length} records`);

const liveById = new Map();
for (const c of live) {
  if (c && c.clientId) liveById.set(String(c.clientId).trim().toUpperCase(), c);
}

const result = [];
let matched = 0;
let matchedWithPassword = 0; // i.e. genuinely activated real clients being preserved
let added = 0;

for (const row of target) {
  const key = String(row.clientId).trim().toUpperCase();
  const existing = liveById.get(key);
  if (existing) {
    result.push(existing); // preserved EXACTLY as found in your live file
    matched++;
    if (existing.password) matchedWithPassword++;
  } else {
    const rec = { clientId: row.clientId, name: row.name || '', requiresActivation: true };
    if (row.email) rec.email = row.email;
    if (row.mobile) rec.mobile = row.mobile;
    result.push(rec);
    added++;
  }
}

const dropped = live.length - matched;

console.log(`\n--- Summary ---`);
console.log(`  Matched & preserved as-is:       ${matched}  (of which ${matchedWithPassword} have a real activated password — these are kept untouched)`);
console.log(`  New records added (no prior login record): ${added}`);
console.log(`  Dropped (in your live file, not in the active/holdings list): ${dropped}`);
console.log(`  Result total: ${result.length}`);

if (matchedWithPassword > 0) {
  console.log(`\n⚠ ${matchedWithPassword} real, already-activated client(s) are in this result — confirm this looks right before applying.`);
}

if (!APPLY) {
  console.log(`\nDRY RUN — nothing was written. Re-run with --apply to write this change (a timestamped backup of your current clients.json will be made first).`);
  process.exit(0);
}

const ts = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(DATA_DIR, `clients.json.backup-${ts}.json`);
fs.copyFileSync(CLIENTS_PATH, backupPath);
console.log(`\nBacked up current clients.json to: ${backupPath}`);

fs.writeFileSync(CLIENTS_PATH, JSON.stringify(result, null, 2));
console.log(`✔ Wrote ${result.length} records to ${CLIENTS_PATH}`);
console.log(`\nIf you're also migrating to SQLite in this same deployment, run the migration script AFTER this one, so clients.db is built from the trimmed file.`);
