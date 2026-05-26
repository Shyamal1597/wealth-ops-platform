import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyClientToken } from '@/lib/auth';

/**
 * GET /api/auth/client-verify
 *
 * Reads the HttpOnly `client-token` cookie and returns the decoded client
 * data if the token is valid.  The client-side pages call this on mount
 * when sessionStorage is empty (e.g. new tab in the same browser) so the
 * user stays logged in across tabs without re-authenticating.
 *
 * Returns 401 when the cookie is absent or the JWT is invalid/expired,
 * which the client treats as "not logged in".
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('client-token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = verifyClientToken(token);
    if (!decoded) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      clientId: decoded.clientId,
      name: decoded.name,
    });
  } catch (error) {
    console.error('client-verify error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
