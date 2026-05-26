import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { sendActivationOTP } from '@/lib/email';
import { sendSmsOTP, maskPhone } from '@/lib/sms';
import { checkRateLimit, recordFailedAttempt, clearFailedAttempts } from '@/lib/rate-limiter';
import { createClientToken } from '@/lib/auth';

interface ClientData {
  clientId: string;
  name: string;
  email?: string;
  mobile?: string;
  password?: string;
  accountStatus?: string;
  accountOpenDate?: string;
  requiresActivation?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { clientId, password, action } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // ─── RATE LIMIT CHECK ───
    // OTP resend / forgot-password actions do not consume password attempts.
    // Only actual password submissions are rate-limited.
    const isPasswordAttempt = !action && !!password;
    if (isPasswordAttempt) {
      const rateLimit = checkRateLimit(clientId);
      if (!rateLimit.allowed) {
        const totalSeconds = rateLimit.resetIn || 0;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.ceil((totalSeconds % 3600) / 60);
        const timeMsg = hours >= 1
          ? `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
          : `${minutes} minute${minutes > 1 ? 's' : ''}`;

        return NextResponse.json(
          { error: `Account temporarily locked. Too many failed attempts. Please try again in ${timeMsg}.` },
          { status: 429 }
        );
      }
    }

    const dataDir = join(process.cwd(), 'data');
    const clientsFilePath = join(dataDir, 'clients.json');

    if (!existsSync(clientsFilePath)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const clientsData = JSON.parse(readFileSync(clientsFilePath, 'utf8'));
    const client = clientsData.find((c: ClientData) => c.clientId === clientId);

    if (!client) {
      // Record failed attempt so attackers can't enumerate valid client IDs freely
      if (isPasswordAttempt) recordFailedAttempt(clientId);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ─── RESEND OTP ACTION ───
    if (action === 'resend_otp' || action === 'forgot_password') {
      return await handleSendOTP(client, dataDir);
    }

    // ─── FIRST-TIME ACTIVATION INTERCEPT ───
    if (client.requiresActivation) {
      return await handleSendOTP(client, dataDir);
    }

    // ─── STANDARD LOGIN (EXISTING PASSWORD) ───
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (client.accountStatus && client.accountStatus !== 'active') {
      return NextResponse.json(
        { error: 'Account is not active. Please contact support.' },
        { status: 403 }
      );
    }

    if (!client.password) {
      return NextResponse.json(
        { error: 'Invalid account state. Please contact support.' },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, client.password);

    if (!passwordMatch) {
      // Record the failed attempt against this client ID
      recordFailedAttempt(clientId);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Password correct — clear the lockout counter
    clearFailedAttempts(clientId);

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

    return NextResponse.json({
      clientId: client.clientId,
      name: client.name,
      email: client.email,
      accountOpenDate: client.accountOpenDate || new Date().toISOString()
    });

  } catch (error) {
    console.error('Client login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

/**
 * Handles OTP generation and dispatch via SMS (primary) or email (fallback).
 * Returns the appropriate response with the OTP method used.
 */
async function handleSendOTP(client: ClientData, dataDir: string) {
  const hasMobile = client.mobile && client.mobile.trim().length >= 10;
  const hasEmail = client.email && client.email.trim().length > 0 && client.email.includes('@');

  if (!hasMobile && !hasEmail) {
    return NextResponse.json(
      { error: 'No registered mobile or email found. Please contact support to update your details.' },
      { status: 403 }
    );
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP
  const otpsFilePath = join(dataDir, 'client-otps.json');
  let otpsData: Record<string, any> = {};

  if (existsSync(otpsFilePath)) {
    try {
      const fileRaw = readFileSync(otpsFilePath, 'utf8');
      if (fileRaw.trim()) {
        otpsData = JSON.parse(fileRaw);
      }
    } catch (e) { console.error(e); }
  }

  otpsData[client.clientId] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  };

  writeFileSync(otpsFilePath, JSON.stringify(otpsData, null, 2));

  // ─── TRY SMS FIRST ───
  if (hasMobile) {
    const smsResult = await sendSmsOTP(client.mobile!, otp);

    if (smsResult.success) {
      return NextResponse.json({
        requiresActivation: true,
        otpMethod: 'sms',
        maskedPhone: maskPhone(client.mobile!)
      });
    }

    // SMS failed — fall back to email if available
    console.warn(`[OTP] SMS failed for ${client.clientId}: ${smsResult.error}. Falling back to email.`);
  }

  // ─── EMAIL FALLBACK ───
  if (hasEmail) {
    const emailSent = await sendActivationOTP(client.email!, otp, client.name);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send activation code. Please try again later.' },
        { status: 500 }
      );
    }

    // Mask email
    const parts = client.email!.split('@');
    const prefix = parts[0].length > 2 ? parts[0].substring(0, 2) : parts[0];
    const maskedEmail = prefix + '*'.repeat(Math.max(1, parts[0].length - 2)) + '@' + parts[1];

    return NextResponse.json({
      requiresActivation: true,
      otpMethod: 'email',
      maskedEmail
    });
  }

  // Both failed (shouldn't reach here due to earlier check)
  return NextResponse.json(
    { error: 'Unable to send verification code. Please contact support.' },
    { status: 500 }
  );
}
