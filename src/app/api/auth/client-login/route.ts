import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { checkRateLimit, recordFailedAttempt, clearFailedAttempts } from '@/lib/rate-limiter';
import { createClientToken } from '@/lib/auth';
import { findClientById } from '@/lib/client-db';
import { sendClientActivationOTP, type SendOtpResult } from '@/lib/client-otp';

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

    const client = findClientById(clientId);

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
      return sendOtpResponse(await sendClientActivationOTP(client));
    }

    // ─── FIRST-TIME ACTIVATION INTERCEPT ───
    if (client.requiresActivation) {
      return sendOtpResponse(await sendClientActivationOTP(client));
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

/** Adapts sendClientActivationOTP's result to this route's existing response shape. */
function sendOtpResponse(result: SendOtpResult) {
  if (result.ok === false) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  if (result.otpMethod === 'sms') {
    return NextResponse.json({ requiresActivation: true, otpMethod: 'sms', maskedPhone: result.maskedPhone });
  }
  return NextResponse.json({ requiresActivation: true, otpMethod: 'email', maskedEmail: result.maskedEmail });
}
