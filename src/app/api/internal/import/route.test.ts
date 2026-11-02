import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as postImport } from './route';

const { mockImportLeads } = vi.hoisted(() => {
  return {
    mockImportLeads: vi.fn(),
  };
});

vi.mock('@/lib/admin/leads/repository', () => ({
  importLeads: (...args: unknown[]) => mockImportLeads(...args),
}));

describe('POST /api/internal/import', () => {
  const TEST_KEY = 'test_secret_api_key_for_tepa_agent_12345';
  const originalEnv = process.env.TEPA_API_KEY;

  beforeEach(() => {
    process.env.TEPA_API_KEY = TEST_KEY;
    mockImportLeads.mockReset();
  });

  afterEach(() => {
    process.env.TEPA_API_KEY = originalEnv;
  });

  const createAuthRequest = (body: unknown) => {
    return new NextRequest('http://localhost:3000/api/internal/import', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${TEST_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  it('rejects unauthenticated requests with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/internal/import', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ leads: [] }),
    });

    const res = await postImport(req);
    expect(res.status).toBe(401);
  });

  it('rejects empty leads array with 400', async () => {
    const req = createAuthRequest({ leads: [] });
    const res = await postImport(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toContain('non-empty array');
  });

  it('handles successful import with Tier: 1 (number), Verified GBP: true (boolean), and status: "do_not_contact"', async () => {
    mockImportLeads.mockResolvedValueOnce({
      masuk: 1,
      dilewati_duplikat: 0,
      gagal: 0,
      errors: [],
      rows: [
        {
          baris: 1,
          nama_bisnis: 'PT Pabrik Baja Mandiri',
          nomor_telepon: '0812-3456-7890',
          status_diminta: 'do_not_contact',
          status_diterapkan: 'do_not_contact',
          status_verifikasi: 'tidak_layak',
          hasil: 'masuk',
        },
      ],
    });

    const payload = {
      batch_riset: '2026-11-02-test',
      leads: [
        {
          Tier: 1,
          'Nama Bisnis': 'PT Pabrik Baja Mandiri',
          'Nomor Telepon': '0812-3456-7890',
          'Verified GBP': true,
          status: 'do_not_contact',
        },
      ],
    };

    const req = createAuthRequest(payload);
    const res = await postImport(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.masuk).toBe(1);
    expect(body.data.rows[0].status_diminta).toBe('do_not_contact');
    expect(body.data.rows[0].status_diterapkan).toBe('do_not_contact');

    // Verify strictValidation was passed to repository
    expect(mockImportLeads).toHaveBeenCalledWith(
      payload.leads,
      {
        defaultBatchRiset: '2026-11-02-test',
        actorPrefix: 'api: ',
        strictValidation: true,
      },
      true
    );
  });

  it('returns 400 when repository throws validation error (invalid type or illegal status)', async () => {
    mockImportLeads.mockRejectedValueOnce(
      new Error('Baris 1: Status outreach "terkirim" tidak boleh di-set langsung via field status.')
    );

    const req = createAuthRequest({
      leads: [
        {
          'Nama Bisnis': 'CV Testing',
          'Nomor Telepon': '0812-0000-0000',
          status: 'terkirim',
        },
      ],
    });

    const res = await postImport(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain('Status outreach "terkirim" tidak boleh di-set langsung');
  });

  it('returns 400 when field has invalid object/array type', async () => {
    mockImportLeads.mockRejectedValueOnce(
      new TypeError('Field "Nama Bisnis" bernilai tipe object yang tidak valid. Diterapkan: teks, angka, atau boolean.')
    );

    const req = createAuthRequest({
      leads: [
        {
          'Nama Bisnis': { bad: 'object' },
          'Nomor Telepon': '0812-0000-0000',
        },
      ],
    });

    const res = await postImport(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain('Field "Nama Bisnis" bernilai tipe object yang tidak valid');
  });
});
