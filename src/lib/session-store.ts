import { readFile, writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "login-sessions.json");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}

interface LoginSession {
    sessionId: string;
    userId: string;
    timestamp: number;
    expiresAt: number;
}

// 5 minutes in milliseconds
const SESSION_TTL = 5 * 60 * 1000;

async function getSessions(): Promise<LoginSession[]> {
    try {
        if (!existsSync(SESSIONS_FILE)) {
            return [];
        }
        const data = await readFile(SESSIONS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveSessions(sessions: LoginSession[]): Promise<void> {
    await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

export async function createSession(userId: string, sessionId: string): Promise<void> {
    const sessions = await getSessions();
    const now = Date.now();

    // Clean up expired sessions first
    const activeSessions = sessions.filter(s => s.expiresAt > now);

    activeSessions.push({
        sessionId,
        userId,
        timestamp: now,
        expiresAt: now + SESSION_TTL
    });

    await saveSessions(activeSessions);
}

export async function getSession(sessionId: string): Promise<{ userId: string } | null> {
    const sessions = await getSessions();
    const now = Date.now();

    const session = sessions.find(s => s.sessionId === sessionId);

    if (!session) {
        return null;
    }

    if (session.expiresAt < now) {
        // Found but expired
        await deleteSession(sessionId);
        return null;
    }

    return { userId: session.userId };
}

export async function deleteSession(sessionId: string): Promise<void> {
    const sessions = await getSessions();
    const filteredSessions = sessions.filter(s => s.sessionId !== sessionId);
    await saveSessions(filteredSessions);
}

export async function cleanupExpiredSessions(): Promise<void> {
    const sessions = await getSessions();
    const now = Date.now();
    const activeSessions = sessions.filter(s => s.expiresAt > now);

    if (activeSessions.length !== sessions.length) {
        await saveSessions(activeSessions);
    }
}
