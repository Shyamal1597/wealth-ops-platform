import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { checkRateLimit, recordFailedAttempt, clearFailedAttempts } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
    try {
        const { clientId, otp } = await request.json();

        if (!clientId || !otp) {
            return NextResponse.json(
                { error: 'Client ID and OTP are required' },
                { status: 400 }
            );
        }

        // Rate-limit OTP guesses so brute-force of the 6-digit space is not feasible
        const otpRateLimitKey = `otp:${clientId}`;
        const rateLimit = checkRateLimit(otpRateLimitKey);
        if (!rateLimit.allowed) {
            const totalSeconds = rateLimit.resetIn || 0;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.ceil((totalSeconds % 3600) / 60);
            const timeMsg = hours >= 1
                ? `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
                : `${minutes} minute${minutes > 1 ? 's' : ''}`;
            return NextResponse.json(
                { error: `Too many incorrect attempts. Please request a new OTP or try again in ${timeMsg}.` },
                { status: 429 }
            );
        }

        const dataDir = join(process.cwd(), 'data');
        const otpsFilePath = join(dataDir, 'client-otps.json');

        if (!existsSync(otpsFilePath)) {
            recordFailedAttempt(otpRateLimitKey);
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        let otpsData: Record<string, any> = {};
        try {
            otpsData = JSON.parse(readFileSync(otpsFilePath, 'utf8'));
        } catch (e) { }

        const record = otpsData[clientId];

        // Combine validity + expiry check to avoid timing oracle
        if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
            recordFailedAttempt(otpRateLimitKey);
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        // OTP correct — clear the failed-attempt counter
        clearFailedAttempts(otpRateLimitKey);

        return NextResponse.json({ success: true, message: 'OTP verified successfully' });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
