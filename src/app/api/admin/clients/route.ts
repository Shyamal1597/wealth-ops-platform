import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminPermission } from '@/lib/admin-auth';
import { createClient, listClients } from '@/lib/client-db';

const CLIENT_ID_RE = /^[A-Za-z0-9_-]{2,30}$/;

async function requireManageClients(): Promise<{ authorized: boolean; adminUsername?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  if (!token) return { authorized: false };

  const admin = await verifyAdminPermission(token, 'manage_clients');
  if (!admin) return { authorized: false };

  return { authorized: true, adminUsername: admin.username };
}

/**
 * GET /api/admin/clients?search=&status=active|pending|all&page=&limit=
 * Paginated, searchable client list (never returns password hashes).
 */
export async function GET(request: NextRequest) {
  const verification = await requireManageClients();
  if (!verification.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const status = (searchParams.get('status') as 'active' | 'pending' | 'all' | null) || 'all';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 25;

  try {
    const { clients, total } = listClients({ search, status, page, limit });
    // Strip password hashes defensively even though client-db doesn't select it separately —
    // it's part of ClientRecord, so remove it explicitly before it ever reaches the client.
    const sanitized = clients.map(({ password, ...rest }) => rest);
    return NextResponse.json({ clients: sanitized, total, page, limit });
  } catch (error) {
    console.error('Error listing clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/clients
 * Creates a single new client. Always starts requiresActivation = true —
 * same first-login (OTP) flow every existing client goes through.
 * Body: { clientId, name, email?, mobile? } — at least one of email/mobile required.
 */
export async function POST(request: NextRequest) {
  const verification = await requireManageClients();
  if (!verification.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { clientId?: string; name?: string; email?: string; mobile?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const clientId = body.clientId?.trim();
  const name = body.name?.trim();
  const email = body.email?.trim() || undefined;
  const mobile = body.mobile?.trim() || undefined;

  if (!clientId || !name) {
    return NextResponse.json({ error: 'Client ID and name are required' }, { status: 400 });
  }
  if (!CLIENT_ID_RE.test(clientId)) {
    return NextResponse.json(
      { error: 'Client ID must be 2-30 characters, letters/numbers/underscore/hyphen only' },
      { status: 400 }
    );
  }
  if (!email && !mobile) {
    return NextResponse.json({ error: 'At least one of email or mobile is required' }, { status: 400 });
  }
  if (email && !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }
  if (mobile && mobile.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
  }

  try {
    const created = createClient({ clientId, name, email, mobile }, verification.adminUsername);
    if (!created) {
      return NextResponse.json({ error: 'A client with this Client ID already exists' }, { status: 409 });
    }
    const { password, ...sanitized } = created;
    return NextResponse.json({ message: 'Client added successfully', client: sanitized });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
