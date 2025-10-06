import { getAccessToken } from '@auth0/nextjs-auth0';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { accessToken } = await getAccessToken(); // ← requires you to be logged in
    if (!accessToken) {
      return new Response(JSON.stringify({ ok: false, error: 'No access token (not logged in?)' }), { status: 401 });
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const r = await fetch(`${apiBase}/bookings/health-secure`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const body = await r.text();
    return new Response(JSON.stringify({ ok: r.ok, status: r.status, body }), {
      status: r.ok ? 200 : r.status,
      headers: { 'Content-Type': 'application/json' },
    });
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'Unknown error' }), { status: 500 });
  }
}
