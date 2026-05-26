import { readFile, writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const LOGS_FILE = path.join(DATA_DIR, "audit-logs.json");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    eventType: string;
    userId?: string;
    username?: string;
    ip?: string;
    userAgent?: string;
    details: any;
    status: "SUCCESS" | "FAILURE" | "WARNING";
}

async function getLogs(): Promise<AuditLogEntry[]> {
    try {
        if (!existsSync(LOGS_FILE)) {
            return [];
        }
        const data = await readFile(LOGS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveLogs(logs: AuditLogEntry[]): Promise<void> {
    // Keep only last 1000 logs to prevent file from growing too large
    const logsToSave = logs.length > 1000 ? logs.slice(-1000) : logs;
    await writeFile(LOGS_FILE, JSON.stringify(logsToSave, null, 2));
}

export async function logSecurityEvent(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    try {
        const logs = await getLogs();

        const newLog: AuditLogEntry = {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            ...entry
        };

        logs.push(newLog);
        await saveLogs(logs);

        console.log(`[AUDIT] ${newLog.eventType}: ${newLog.status} - ${newLog.userId || 'Anonymous'}`);
    } catch (error) {
        console.error("Failed to write audit log:", error);
        // Fail safe - don't crash app if logging fails
    }
}
