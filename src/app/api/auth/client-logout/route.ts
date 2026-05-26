import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { invalidateClientSession } from '@/lib/client-session-store';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('client-token')?.value;

  // Use decode (not verify) so an already-expired token still yields the clientId.
  // Ensures session is always invalidated even if the 1-hour token has just expired.
  if (token) {
    try {
      const decoded = jwt.decode(token) as { clientId?: string } | null;
      if (decoded?.clientId) {
        invalidateClientSession(decoded.clientId);
      }
    } catch {
      // Ignore decode errors — we're logging out regardless
    }
  }

  // Clear the cookie
  cookieStore.set('client-token', '', {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE !== 'false',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return NextResponse.json({ success: true });
}
