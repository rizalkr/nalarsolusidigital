import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getQueue } from './route';

const { mockGetQueueData, mockGetDashboardSummary } = vi.hoisted(() => {
  return {
    mockGetQueueData: vi.fn(),
    mockGetDashboardSummary: vi.fn(),
  };
});

vi.mock('@/lib/admin/leads/repository', () => ({
  getQueueData: (...args: unknown[]) => mockGetQueueData(...args),
  getDashboardSummary: (...args: unknown[]) => mockGetDashboardSummary(...args),
}));

describe('GET /api/internal/queue', () => {
  const TEST_KEY = 'test_secret_api_key_for_tepa_agent_12345';
  const originalEnv = process.env.TEPA_API_KEY;

  beforeEach(() => {
    process.env.TEPA_API_KEY = TEST_KEY;
    mockGetQueueData.mockReset();
    mockGetDashboardSummary.mockReset();
  });

  afterEach(() => {
    process.env.TEPA_API_KEY = originalEnv;
  });

  it('rejects unauthenticated requests with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/internal/queue');
    const res = await getQueue(req);
    expect(res.status).toBe(401);
  });

  it('returns default maxDailySlots (5) and waAccounts (2) in operational_status when no settings are overridden', async () => {
    mockGetQueueData.mockResolvedValueOnce({
      siapKirim: [],
      followupDue: [],
      holdList: [],
    });

    mockGetDashboardSummary.mockResolvedValueOnce({
      operationalStatus: {
        isOperationalDay: true,
        isOperationalHour: true,
        isInOperationalWindow: true,
        slotsUsedToday: 1,
        maxDailySlots: 5,
        slotsRemaining: 4,
        currentTimeWIB: '10:00 WIB (Mon)',
        waAccounts: 2,
      },
    });

    const req = new NextRequest('http://localhost:3000/api/internal/queue', {
      headers: { authorization: `Bearer ${TEST_KEY}` },
    });
    const res = await getQueue(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.operational_status.maxDailySlots).toBe(5);
    expect(json.data.operational_status.waAccounts).toBe(2);
    expect(json.data.operational_status.slotsRemaining).toBe(4);
  });

  it('returns dynamic maxDailySlots (8) and waAccounts (2) with slotsRemaining calculated accordingly', async () => {
    mockGetQueueData.mockResolvedValueOnce({
      siapKirim: [],
      followupDue: [],
      holdList: [],
    });

    mockGetDashboardSummary.mockResolvedValueOnce({
      operationalStatus: {
        isOperationalDay: true,
        isOperationalHour: true,
        isInOperationalWindow: true,
        slotsUsedToday: 3,
        maxDailySlots: 8,
        slotsRemaining: 5,
        currentTimeWIB: '11:00 WIB (Tue)',
        waAccounts: 2,
      },
    });

    const req = new NextRequest('http://localhost:3000/api/internal/queue', {
      headers: { authorization: `Bearer ${TEST_KEY}` },
    });
    const res = await getQueue(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.operational_status.maxDailySlots).toBe(8);
    expect(json.data.operational_status.waAccounts).toBe(2);
    expect(json.data.operational_status.slotsRemaining).toBe(5);
  });
});
