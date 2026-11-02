import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { validateInternalApiKey } from '@/lib/admin/api-auth';
import { GET as getFollowupsDue } from './followups-due/route';

describe('Internal API Auth & Security (/api/internal/*)', () => {
  const TEST_KEY = 'test_secret_api_key_for_tepa_agent_12345';
  const originalEnv = process.env.TEPA_API_KEY;

  beforeEach(() => {
    process.env.TEPA_API_KEY = TEST_KEY;
  });

  afterEach(() => {
    process.env.TEPA_API_KEY = originalEnv;
  });

  it('rejects requests without Authorization header with 401', () => {
    const req = new NextRequest('http://localhost:3000/api/internal/queue');
    const auth = validateInternalApiKey(req);

    expect(auth.authorized).toBe(false);
    expect(auth.unauthorizedResponse?.status).toBe(401);
  });

  it('rejects requests with incorrect token with 401', () => {
    const req = new NextRequest('http://localhost:3000/api/internal/queue', {
      headers: {
        authorization: 'Bearer wrong_token_value',
      },
    });
    const auth = validateInternalApiKey(req);

    expect(auth.authorized).toBe(false);
    expect(auth.unauthorizedResponse?.status).toBe(401);
  });

  it('accepts requests with exact valid Bearer token', () => {
    const req = new NextRequest('http://localhost:3000/api/internal/queue', {
      headers: {
        authorization: `Bearer ${TEST_KEY}`,
      },
    });
    const auth = validateInternalApiKey(req);

    expect(auth.authorized).toBe(true);
    expect(auth.unauthorizedResponse).toBeUndefined();
  });

  it('returns 401 directly from endpoint handler when token is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/internal/followups-due');
    const res = await getFollowupsDue(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain('Authorization');
  });
});
