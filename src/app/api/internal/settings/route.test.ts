import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getSettings, PATCH as patchSettings } from './route';

const { mockGetOperationalSettings, mockUpdateOperationalSettings } = vi.hoisted(() => {
  return {
    mockGetOperationalSettings: vi.fn(),
    mockUpdateOperationalSettings: vi.fn(),
  };
});

vi.mock('@/lib/admin/leads/repository', () => ({
  getOperationalSettings: (...args: unknown[]) => mockGetOperationalSettings(...args),
  updateOperationalSettings: (...args: unknown[]) => mockUpdateOperationalSettings(...args),
}));

describe('/api/internal/settings route', () => {
  const TEST_KEY = 'test_secret_api_key_for_tepa_agent_12345';
  const originalEnv = process.env.TEPA_API_KEY;

  beforeEach(() => {
    process.env.TEPA_API_KEY = TEST_KEY;
    mockGetOperationalSettings.mockReset();
    mockUpdateOperationalSettings.mockReset();
  });

  afterEach(() => {
    process.env.TEPA_API_KEY = originalEnv;
  });

  const createAuthRequest = (method: 'GET' | 'PATCH', body?: unknown) => {
    return new NextRequest('http://localhost:3000/api/internal/settings', {
      method,
      headers: {
        authorization: `Bearer ${TEST_KEY}`,
        'content-type': 'application/json',
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  };

  describe('GET /api/internal/settings', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/internal/settings', {
        method: 'GET',
      });
      const res = await getSettings(req);
      expect(res.status).toBe(401);
    });

    it('returns current operational settings with 200', async () => {
      mockGetOperationalSettings.mockResolvedValueOnce({
        maxDailySlots: 8,
        waAccounts: 2,
      });

      const req = createAuthRequest('GET');
      const res = await getSettings(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({
        ok: true,
        data: {
          maxDailySlots: 8,
          waAccounts: 2,
        },
      });
      expect(mockGetOperationalSettings).toHaveBeenCalledWith(true);
    });
  });

  describe('PATCH /api/internal/settings', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/internal/settings', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ maxDailySlots: 8 }),
      });
      const res = await patchSettings(req);
      expect(res.status).toBe(401);
    });

    it('rejects invalid maxDailySlots <= 0 with 400', async () => {
      const req = createAuthRequest('PATCH', { maxDailySlots: 0 });
      const res = await patchSettings(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.error).toContain('maxDailySlots');
      expect(mockUpdateOperationalSettings).not.toHaveBeenCalled();
    });

    it('rejects invalid maxDailySlots > 50 with 400', async () => {
      const req = createAuthRequest('PATCH', { maxDailySlots: 51 });
      const res = await patchSettings(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.error).toContain('maxDailySlots');
    });

    it('rejects non-integer maxDailySlots with 400', async () => {
      const req = createAuthRequest('PATCH', { maxDailySlots: '8' });
      const res = await patchSettings(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.ok).toBe(false);
    });

    it('rejects invalid waAccounts <= 0 with 400', async () => {
      const req = createAuthRequest('PATCH', { waAccounts: 0 });
      const res = await patchSettings(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.error).toContain('waAccounts');
    });

    it('rejects invalid waAccounts > 10 with 400', async () => {
      const req = createAuthRequest('PATCH', { waAccounts: 11 });
      const res = await patchSettings(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.error).toContain('waAccounts');
    });

    it('rejects empty body or non-whitelisted fields only with 400', async () => {
      const req = createAuthRequest('PATCH', { unknownField: 123 });
      const res = await patchSettings(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.error).toContain('Whitelisted');
    });

    it('updates maxDailySlots successfully and ignores unrecognized fields', async () => {
      mockUpdateOperationalSettings.mockResolvedValueOnce({
        maxDailySlots: 8,
        waAccounts: 2,
      });

      const req = createAuthRequest('PATCH', {
        maxDailySlots: 8,
        extraIgnoredField: 'something',
      });
      const res = await patchSettings(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({
        ok: true,
        data: {
          maxDailySlots: 8,
          waAccounts: 2,
        },
      });
      expect(mockUpdateOperationalSettings).toHaveBeenCalledWith(
        { maxDailySlots: 8 },
        true
      );
    });

    it('updates both maxDailySlots and waAccounts successfully', async () => {
      mockUpdateOperationalSettings.mockResolvedValueOnce({
        maxDailySlots: 10,
        waAccounts: 3,
      });

      const req = createAuthRequest('PATCH', {
        maxDailySlots: 10,
        waAccounts: 3,
      });
      const res = await patchSettings(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({
        ok: true,
        data: {
          maxDailySlots: 10,
          waAccounts: 3,
        },
      });
      expect(mockUpdateOperationalSettings).toHaveBeenCalledWith(
        { maxDailySlots: 10, waAccounts: 3 },
        true
      );
    });
  });
});
