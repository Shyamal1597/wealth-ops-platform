import { sendActivationOTP } from '@/lib/email';
import { sendSmsOTP, maskPhone } from '@/lib/sms';
import { setOtp, type ClientRecord } from '@/lib/client-db';

/** Generates a 6-digit OTP. Shared so every OTP flow (login, admin resend, profile updates) uses one formula. */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export type SendOtpResult =
  | { ok: true; otpMethod: 'sms'; maskedPhone: string }
  | { ok: true; otpMethod: 'email'; maskedEmail: string }
  | { ok: false; status: number; error: string };

/**
 * Generates and dispatches a 6-digit activation/login OTP for a client via
 * SMS (primary) or email (fallback), storing it in data/client-otps.json
 * (10-min TTL). Shared between the client-facing login route (client
 * requests their own OTP) and the admin "resend activation" action (an
 * operator triggers it on a client's behalf) — same rules either way.
 */
export async function sendClientActivationOTP(client: ClientRecord): Promise<SendOtpResult> {
  const hasMobile = !!client.mobile && client.mobile.trim().length >= 10;
  const hasEmail = !!client.email && client.email.trim().length > 0 && client.email.includes('@');

  if (!hasMobile && !hasEmail) {
    return { ok: false, status: 403, error: 'No registered mobile or email found for this client.' };
  }

  const otp = generateOtp();
  setOtp(client.clientId, otp, Date.now() + 10 * 60 * 1000); // 10 minutes

  // ─── TRY SMS FIRST ───
  if (hasMobile) {
    const smsResult = await sendSmsOTP(client.mobile!, otp);
    if (smsResult.success) {
      return { ok: true, otpMethod: 'sms', maskedPhone: maskPhone(client.mobile!) };
    }
    console.warn(`[OTP] SMS failed for ${client.clientId}: ${smsResult.error}. Falling back to email.`);
  }

  // ─── EMAIL FALLBACK ───
  if (hasEmail) {
    const emailSent = await sendActivationOTP(client.email!, otp, client.name);
    if (!emailSent) {
      return { ok: false, status: 500, error: 'Failed to send activation code. Please try again later.' };
    }
    const parts = client.email!.split('@');
    const prefix = parts[0].length > 2 ? parts[0].substring(0, 2) : parts[0];
    const maskedEmail = prefix + '*'.repeat(Math.max(1, parts[0].length - 2)) + '@' + parts[1];
    return { ok: true, otpMethod: 'email', maskedEmail };
  }

  return { ok: false, status: 500, error: 'Unable to send verification code.' };
}
