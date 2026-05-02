import { NextRequest, NextResponse } from 'next/server';
import { normalizeApiError } from '@/lib/api/errors';
import { checkRateLimit } from '@/lib/api/server/rate-limit';

type Handler = (request: NextRequest) => Promise<NextResponse>;

function ipFromRequest(request: NextRequest) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

export function withApiProtection(handler: Handler, limit = 40, windowMs = 60_000) {
  return async (request: NextRequest) => {
    const key = `${ipFromRequest(request)}:${request.nextUrl.pathname}`;
    const limiter = checkRateLimit(key, limit, windowMs);

    if (!limiter.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again shortly.',
          fallback: true,
          retryAfterMs: Math.max(0, limiter.resetAt - Date.now()),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limiter.resetAt - Date.now()) / 1000)),
          },
        },
      );
    }

    try {
      const response = await handler(request);
      response.headers.set('X-RateLimit-Remaining', String(limiter.remaining));
      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return NextResponse.json(
        {
          error: normalized.message,
          fallback: true,
        },
        { status: normalized.status || 500 },
      );
    }
  };
}
