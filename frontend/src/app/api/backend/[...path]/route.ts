import { NextRequest } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { path: string[] };

export async function GET(req: NextRequest, ctx: { params: Promise<Params> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<Params> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<Params> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<Params> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<Params> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function HEAD(req: NextRequest, ctx: { params: Promise<Params> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function OPTIONS(req: NextRequest, ctx: { params: Promise<Params> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}

async function forward(req: NextRequest, pathParts: string[]) {
  // Prefer internal URL for container-to-container networking
  const base =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!base) {
    return json(500, {
      error: 'Backend URL not configured',
      hint: 'Set BACKEND_INTERNAL_URL (docker) or NEXT_PUBLIC_BACKEND_URL (local)',
    });
  }

  const url = new URL(req.url);
  const path = pathParts?.join('/') ?? '';
  const target = new URL(path, ensureTrailingSlash(base));
  target.search = url.search;

  try {
    const { accessToken } = await getAccessToken();

    const headers: Record<string, string> = {};
    if (accessToken) headers['authorization'] = `Bearer ${accessToken}`;
    const ct = req.headers.get('content-type');
    if (ct) headers['content-type'] = ct;
    const accept = req.headers.get('accept');
    if (accept) headers['accept'] = accept;

    const body =
      req.method === 'GET' || req.method === 'HEAD'
        ? undefined
        : Buffer.from(await req.arrayBuffer());

    const res = await fetch(target.toString(), {
      method: req.method,
      headers,
      body,
      // avoid any caching weirdness for API calls
      cache: 'no-store',
      redirect: 'manual',
    });

    // If backend returns a redirect, forward it to the browser (with a safe Location)
    const location = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && location) {
      const rewritten = rewriteLocationForProxy(location, base); // function below
      return new Response(null, {
        status: res.status,
        headers: { Location: rewritten },
      });
    }

    // Otherwise, pass through the response body/headers
    const buf = Buffer.from(await res.arrayBuffer());
    return new Response(buf, { status: res.status, headers: res.headers });

    function rewriteLocationForProxy(loc: string, backendBase: string) {
      try {
        // Absolute URL?
        const u = new URL(loc);
        // If it points to the backend host, rewrite to proxy prefix
        const bb = new URL(ensureTrailingSlash(backendBase));
        const sameHost = u.host === bb.host && u.protocol === bb.protocol;
        if (sameHost) {
          // map e.g. http://backend:4000/auth/... -> /api/backend/auth/...
          return `/api/backend${u.pathname}${u.search}`;
        }
        // If it points to Google or another absolute host, pass through unchanged
        return loc;
      } catch {
        // Relative URL like /auth/google-calendar/consent?...
        if (loc.startsWith('/')) return `/api/backend${loc}`;
        // Fallback: leave as-is
        return loc;
      }
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (err: any) {
    // Helpful diagnostics back to the browser (only status/body, not stack)
    return json(502, {
      error: 'Upstream fetch failed',
      target: target.toString(),
      method: req.method,
      cause: err?.code || err?.message || 'unknown',
    });
  }
}

function ensureTrailingSlash(s: string) {
  return s.endsWith('/') ? s : s + '/';
}

function json(status: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
