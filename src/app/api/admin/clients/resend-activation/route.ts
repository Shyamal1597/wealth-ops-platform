import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminPermission } from '@/lib/admin-auth';
import { findClientById } from '@/lib/client-db';
import { sendClientActivationOTP } from '@/lib/client-otp';

/**
 * POST /api/admin/clients/resend-activation
 * Body: { clientId }
 * Admin-triggered version of the OTP an activating client would request
 * themselves — useful when a client can't reach the portal (e.g. the
 * original notification bounced) but their contact details on file are correct.
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin-token')?.value;
  if (!adminToken || !(await verifyAdminPermission(adminToken, 'manage_clients'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { clientId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const clientId = body.clientId?.trim();
  if (!clientId) {
    return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
  }

  const client = findClientById(clientId);
  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  const result = await sendClientActivationOTP(client);
  if (result.ok === false) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    message: 'Activation code sent.',
    otpMethod: result.otpMethod,
    ...(result.otpMethod === 'sms' ? { maskedPhone: result.maskedPhone } : { maskedEmail: result.maskedEmail }),
  });
}
