import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export function validateInternalApiKey(req: NextRequest): {
  authorized: boolean;
  unauthorizedResponse?: NextResponse;
} {
  const authHeader = req.headers.get('authorization') || '';
  const expectedKey = process.env.TEPA_API_KEY;

  if (!expectedKey) {
    return {
      authorized: false,
      unauthorizedResponse: NextResponse.json(
        { ok: false, error: 'TEPA_API_KEY is not configured on the server.' },
        { status: 401 }
      ),
    };
  }

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return {
      authorized: false,
      unauthorizedResponse: NextResponse.json(
        { ok: false, error: 'Missing or malformed Authorization header. Expected Bearer token.' },
        { status: 401 }
      ),
    };
  }

  const providedKey = match[1].trim();

  // Timing-safe comparison
  const expectedBuffer = Buffer.from(expectedKey);
  const providedBuffer = Buffer.from(providedKey);

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return {
      authorized: false,
      unauthorizedResponse: NextResponse.json(
        { ok: false, error: 'Invalid API key.' },
        { status: 401 }
      ),
    };
  }

  return { authorized: true };
}

