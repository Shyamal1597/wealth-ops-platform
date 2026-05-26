import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { createClientToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { clientId, otp, newPassword } = await request.json();

        if (!clientId || !otp || !newPassword) {
            return NextResponse.json(
                { error: 'Client ID, OTP, and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        const dataDir = join(process.cwd(), 'data');
        const otpsFilePath = join(dataDir, 'client-otps.json');
        const clientsFilePath = join(dataDir, 'clients.json');

        // 1. Validate OTP again
        if (!existsSync(otpsFilePath)) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        let otpsData: Record<string, any> = {};
        try { otpsData = JSON.parse(readFileSync(otpsFilePath, 'utf8')); } catch (e) { }

        const record = otpsData[clientId];
        if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP. Please start over.' },
                { status: 400 }
            );
        }

        // 2. Validate Client
        if (!existsSync(clientsFilePath)) {
            return NextResponse.json(
                { error: 'Client database not found' },
                { status: 500 }
            );
        }

        let clientsData: any[] = [];
        try { clientsData = JSON.parse(readFileSync(clientsFilePath, 'utf8')); } catch (e) { }

        const clientIndex = clientsData.findIndex((c: any) => c.clientId === clientId);
        if (clientIndex === -1) {
            return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
            );
        }

        const client = clientsData[clientIndex];

        // 3. Update Password & Activate
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        client.password = hashedPassword;
        delete client.requiresActivation;
        client.accountStatus = 'active';
        client.accountOpenDate = client.accountOpenDate || new Date().toISOString().split('T')[0];

        clientsData[clientIndex] = client;
        writeFileSync(clientsFilePath, JSON.stringify(clientsData, null, 2));

        // 4. Cleanup OTP
        delete otpsData[clientId];
        writeFileSync(otpsFilePath, JSON.stringify(otpsData, null, 2));

        // Issue HttpOnly client-token cookie so the research API can verify the session
        const clientToken = createClientToken(client.clientId, client.name);
        const cookieStore = await cookies();
        cookieStore.set("client-token", clientToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE !== "false", // TDL-007: Secure by default
            sameSite: "lax",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });

        // Return success & login info
        return NextResponse.json({
            success: true,
            client: {
                clientId: client.clientId,
                name: client.name,
                email: client.email,
                accountOpenDate: client.accountOpenDate
            }
        });

    } catch (error) {
        console.error('Set password error:', error);
        return NextResponse.json(
            { error: 'Failed to set password' },
            { status: 500 }
        );
    }
}
