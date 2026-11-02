import { describe, it, expect } from 'vitest';
import {
  splitSektorAndKota,
  processImportRows,
  coerceString,
  parseBoolean,
  parseNumber,
  makeCompositeDedupKey,
} from './csv-mapper';

describe('Admin Nalar CSV Mapper & Importer', () => {
  describe('splitSektorAndKota', () => {
    it('splits sektor and kota separated by dash', () => {
      const res = splitSektorAndKota('Kontraktor Bangunan - Surakarta');
      expect(res.sektor).toBe('Kontraktor Bangunan');
      expect(res.kota).toBe('Surakarta');
    });

    it('splits sektor and kota separated by slash', () => {
      const res = splitSektorAndKota('Rental Mobil / Solo');
      expect(res.sektor).toBe('Rental Mobil');
      expect(res.kota).toBe('Solo');
    });

    it('falls back safely when no separator is present', () => {
      const res = splitSektorAndKota('Kuliner');
      expect(res.sektor).toBe('Kuliner');
      expect(res.kota).toBe('Solo Raya');
    });
  });

  describe('Bug 1: Defensive Type Coercion for Text, Number, and Boolean', () => {
    it('accepts numbers and booleans on text fields and coerces them defensively', () => {
      expect(coerceString(12345, 'telepon')).toBe('12345');
      expect(coerceString(true, 'verified')).toBe('true');
      expect(coerceString(false, 'active')).toBe('false');
      expect(coerceString(null, 'catatan')).toBe('');
      expect(coerceString(undefined, 'catatan')).toBe('');
      expect(coerceString('  Halo Nalar  ', 'nama')).toBe('Halo Nalar');
    });

    it('throws LeadValidationError when text field receives an object or array', () => {
      expect(() => coerceString({ nested: 'object' }, 'Nama Bisnis')).toThrowError(
        /Field "Nama Bisnis" bernilai tipe object yang tidak valid/
      );
      expect(() => coerceString(['item1', 'item2'], 'Alamat')).toThrowError(
        /Field "Alamat" bernilai tipe array yang tidak valid/
      );
    });

    it('parses raw numbers and booleans correctly', () => {
      expect(parseBoolean(true, 'Verified GBP')).toBe(true);
      expect(parseBoolean(false, 'Verified GBP')).toBe(false);
      expect(parseBoolean(1, 'Verified GBP')).toBe(true);
      expect(parseBoolean(0, 'Verified GBP')).toBe(false);
      expect(parseBoolean('ya', 'Verified GBP')).toBe(true);
      expect(parseBoolean('tidak', 'Verified GBP')).toBe(false);

      expect(parseNumber(1, 'Tier')).toBe(1);
      expect(parseNumber(4.8, 'Rating')).toBe(4.8);
      expect(parseNumber('4,8', 'Rating')).toBe(4.8);
      expect(parseNumber('25', 'Jumlah Ulasan')).toBe(25);
    });

    it('successfully imports rows with Tier: 1 (number) and Verified GBP: true (boolean) without 500 error', () => {
      const rows = [
        {
          Tier: 1, // number type
          'Nama Bisnis': 'PT Mega Perkasa Konstruksi',
          'Nomor Telepon': '0812-9988-7766',
          'Verified GBP': true, // boolean type
          Rating: 4.9, // number
          'Jumlah Ulasan': 50, // number
          'Sektor & Kota': 'Kontraktor - Surakarta',
        },
      ];

      const res = processImportRows(rows);
      expect(res.gagal).toBe(0);
      expect(res.masuk).toBe(1);

      const lead = res.leads[0];
      expect(lead.tier).toBe(1);
      expect(lead.verified_gbp).toBe(true);
      expect(lead.rating).toBe(4.9);
      expect(lead.jumlah_ulasan).toBe(50);
      expect(lead.nomor_telepon_normalized).toBe('6281299887766');
    });

    it('reports clear error when required fields are null or empty', () => {
      const rows = [
        {
          'Nama Bisnis': null,
          'Nomor Telepon': '08123456789',
        },
        {
          'Nama Bisnis': 'CV Sukses Berkah',
          'Nomor Telepon': '',
        },
      ];

      const res = processImportRows(rows);
      expect(res.gagal).toBe(2);
      expect(res.errors[0].pesan).toContain('Field "Nama Bisnis" wajib diisi');
      expect(res.errors[1].pesan).toContain('Field "Nomor Telepon" wajib diisi');
    });
  });

  describe('Bug 2: Explicit Status Handling & Outreach Status Guard', () => {
    it('honors explicit status "do_not_contact" without silent coercion to riset', () => {
      const rows = [
        {
          'Nama Bisnis': 'Pabrik Tekstil DNC',
          'Nomor Telepon': '0812-1111-2222',
          status: 'do_not_contact',
        },
      ];

      const res = processImportRows(rows);
      expect(res.masuk).toBe(1);
      expect(res.leads[0].status).toBe('do_not_contact');
      expect(res.leads[0].status_diminta).toBe('do_not_contact');
      expect(res.leads[0].status_diterapkan).toBe('do_not_contact');

      // Check row report
      expect(res.rows[0].status_diminta).toBe('do_not_contact');
      expect(res.rows[0].status_diterapkan).toBe('do_not_contact');
    });

    it('honors other allowed initial statuses (terverifikasi, siap_kirim, hold, tidak_layak)', () => {
      const rows = [
        {
          'Nama Bisnis': 'Bengkel Bubut Makmur',
          'Nomor Telepon': '0812-3333-4444',
          status: 'terverifikasi',
        },
        {
          'Nama Bisnis': 'Percetakan Berkah',
          'Nomor Telepon': '0812-5555-6666',
          status: 'siap_kirim',
        },
        {
          'Nama Bisnis': 'Klinik Sehat',
          'Nomor Telepon': '0812-7777-8888',
          status: 'hold',
        },
        {
          'Nama Bisnis': 'Toko Bangkrut',
          'Nomor Telepon': '0812-9999-0000',
          status: 'tidak_layak',
        },
      ];

      const res = processImportRows(rows);
      expect(res.masuk).toBe(4);
      expect(res.leads[0].status).toBe('terverifikasi');
      expect(res.leads[1].status).toBe('siap_kirim');
      expect(res.leads[2].status).toBe('hold');
      expect(res.leads[3].status).toBe('tidak_layak');
    });

    it('rejects forbidden outreach statuses set directly via status field with clear error', () => {
      const forbiddenStatuses = [
        'terkirim',
        'followup_1',
        'followup_2',
        'replied',
        'pause',
        'closed',
      ];

      forbiddenStatuses.forEach((statusVal) => {
        const rows = [
          {
            'Nama Bisnis': 'Test Outreach Guard',
            'Nomor Telepon': '0812-0000-1111',
            status: statusVal,
          },
        ];

        const res = processImportRows(rows);
        expect(res.gagal).toBe(1);
        expect(res.errors[0].pesan).toContain(
          `Status outreach "${statusVal}" tidak boleh di-set langsung via field status`
        );
      });
    });

    it('throws LeadValidationError when strictValidation is enabled for API calls', () => {
      const rows = [
        {
          'Nama Bisnis': 'Bad Outreach Request',
          'Nomor Telepon': '0812-1111-2222',
          status: 'terkirim',
        },
      ];

      expect(() =>
        processImportRows(rows, { strictValidation: true })
      ).toThrowError(/Status outreach "terkirim" tidak boleh di-set langsung/);
    });

    it('enforces domain rules: siap_kirim requires verified/parsial verification_status', () => {
      const rows = [
        {
          'Nama Bisnis': 'Unverified Lead',
          'Nomor Telepon': '0812-3333-4444',
          status: 'siap_kirim',
          verification_status: 'belum',
        },
      ];

      const res = processImportRows(rows);
      expect(res.gagal).toBe(1);
      expect(res.errors[0].pesan).toContain('Nomor belum terverifikasi tidak bisa siap kirim');
    });

    it('enforces domain rules: benchmark_only is strictly for Tier 4', () => {
      // Tier 1 cannot be benchmark_only
      const t1 = processImportRows([
        {
          Tier: 1,
          'Nama Bisnis': 'T1 Invalid Benchmark',
          'Nomor Telepon': '0812-3333-4444',
          status: 'benchmark_only',
        },
      ]);
      expect(t1.gagal).toBe(1);
      expect(t1.errors[0].pesan).toContain('Status benchmark_only hanya untuk prospek Tier 4');

      // Tier 4 must be benchmark_only
      const t4 = processImportRows([
        {
          Tier: 4,
          'Nama Bisnis': 'Competitor Benchmark',
          'Nomor Telepon': '0812-3333-4444',
          status: 'siap_kirim',
        },
      ]);
      expect(t4.gagal).toBe(1);
      expect(t4.errors[0].pesan).toContain('Prospek Tier 4 adalah benchmark-only');
    });
  });

  describe('Bug 3: Composite Deduplication (Phone + Business Name)', () => {
    it('imports 3 leads sharing the same phone number but different business names (KONVEKSI, Pengecoran, JAVAMOLD)', () => {
      const sharedPhone = '0812-8888-9999';
      const rows = [
        {
          Tier: 1,
          'Nama Bisnis': 'KONVEKSI MURAH SUKOHARJO',
          'Nomor Telepon': sharedPhone,
          'Sektor & Kota': 'Konveksi - Sukoharjo',
        },
        {
          Tier: 2,
          'Nama Bisnis': 'Jasa Pengecoran Logam',
          'Nomor Telepon': sharedPhone,
          'Sektor & Kota': 'Pengecoran Logam - Ceper Klaten',
        },
        {
          Tier: 2,
          'Nama Bisnis': 'PENGECORAN LOGAM JAVAMOLD',
          'Nomor Telepon': sharedPhone,
          'Sektor & Kota': 'Pengecoran Logam - Ceper Klaten',
        },
      ];

      const res = processImportRows(rows);
      expect(res.total_processed).toBe(3);
      expect(res.masuk).toBe(3);
      expect(res.dilewati_duplikat).toBe(0);
      expect(res.gagal).toBe(0);

      expect(res.leads[0].nama_bisnis).toBe('KONVEKSI MURAH SUKOHARJO');
      expect(res.leads[1].nama_bisnis).toBe('Jasa Pengecoran Logam');
      expect(res.leads[2].nama_bisnis).toBe('PENGECORAN LOGAM JAVAMOLD');

      // All 3 have identical normalized phone number
      expect(res.leads[0].nomor_telepon_normalized).toBe('6281288889999');
      expect(res.leads[1].nomor_telepon_normalized).toBe('6281288889999');
      expect(res.leads[2].nomor_telepon_normalized).toBe('6281288889999');
    });

    it('skips duplicate when BOTH phone number and business name match (case-insensitive & trimmed)', () => {
      const rows = [
        {
          'Nama Bisnis': 'Konveksi Murah Sukoharjo',
          'Nomor Telepon': '0812-8888-9999',
        },
        // Duplicate with different case and spacing
        {
          'Nama Bisnis': '  KONVEKSI MURAH SUKOHARJO   ',
          'Nomor Telepon': '+62 812 8888 9999',
        },
      ];

      const res = processImportRows(rows);
      expect(res.total_processed).toBe(2);
      expect(res.masuk).toBe(1);
      expect(res.dilewati_duplikat).toBe(1);
      expect(res.rows[1].hasil).toBe('dilewati_duplikat');
      expect(res.rows[1].pesan).toContain('Duplikat prospek');
    });

    it('skips duplicate against existing database composite keys', () => {
      const existingKey = makeCompositeDedupKey('6281288889999', 'KONVEKSI MURAH SUKOHARJO');
      const existingLeadKeySet = new Set<string>([existingKey]);

      const rows = [
        {
          // Existing lead in DB
          'Nama Bisnis': 'konveksi murah sukoharjo',
          'Nomor Telepon': '0812-8888-9999',
        },
        // New lead with same phone but different name
        {
          'Nama Bisnis': 'Jasa Pengecoran Logam',
          'Nomor Telepon': '0812-8888-9999',
        },
      ];

      const res = processImportRows(rows, { existingLeadKeySet });
      expect(res.total_processed).toBe(2);
      expect(res.masuk).toBe(1);
      expect(res.dilewati_duplikat).toBe(1);
      expect(res.leads[0].nama_bisnis).toBe('Jasa Pengecoran Logam');
    });
  });
});
