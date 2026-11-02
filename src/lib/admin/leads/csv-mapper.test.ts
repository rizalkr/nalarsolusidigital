import { describe, it, expect } from 'vitest';
import {
  splitSektorAndKota,
  determineLeadStatuses,
  processImportRows,
} from './csv-mapper';

describe('Admin Nalar CSV Mapper', () => {
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

  describe('determineLeadStatuses', () => {
    it('forces Tier 4 to benchmark_only regardless of raw status', () => {
      const res = determineLeadStatuses('TERVERIFIKASI', 4, true);
      expect(res.status).toBe('benchmark_only');
    });

    it('maps Riset format status strings correctly', () => {
      const v = determineLeadStatuses('TERVERIFIKASI', 1, true);
      expect(v.status).toBe('siap_kirim');
      expect(v.verification_status).toBe('terverifikasi');

      const h = determineLeadStatuses('BELUM PASTI (HOLD)', 2, true);
      expect(h.status).toBe('hold');
      expect(h.verification_status).toBe('hold');

      const t = determineLeadStatuses('TIDAK LAYAK WA', 3, true);
      expect(t.status).toBe('tidak_layak');
      expect(t.verification_status).toBe('tidak_layak');
    });

    it('maps Master format status strings correctly', () => {
      const tk = determineLeadStatuses('TERKIRIM 31 Okt', 2, false);
      expect(tk.status).toBe('terkirim');

      const fu1 = determineLeadStatuses('FOLLOW UP 1', 1, false);
      expect(fu1.status).toBe('followup_1');

      const fu2 = determineLeadStatuses('FOLLOW UP 2', 1, false);
      expect(fu2.status).toBe('followup_2');

      const def = determineLeadStatuses('', 2, false);
      expect(def.status).toBe('riset');
      expect(def.verification_status).toBe('belum');
    });
  });

  describe('processImportRows with Dedup', () => {
    it('successfully processes valid master rows and deduplicates phone numbers', () => {
      const rows = [
        {
          Tier: '1',
          'Sub-Kelompok': '1B - Heavy Hitter',
          'Sektor & Kota': 'Kontraktor Bangunan - Surakarta',
          'Nama Bisnis': 'PT Cipta Karya Perkasa',
          'Nomor Telepon': '0812-3456-7890',
          'Status WA': 'Siap Kirim',
          'Verified GBP': 'Ya',
          'Jumlah Ulasan': '45',
          Rating: '4.8',
        },
        // Duplicate phone number with different formatting
        {
          Tier: '2',
          'Sektor & Kota': 'Rental Mobil - Solo',
          'Nama Bisnis': 'Solo Transport Duplikat',
          'Nomor Telepon': '+62 812 3456 7890',
          'Status WA': 'Riset',
        },
        // Another distinct lead
        {
          Tier: '3',
          'Sektor & Kota': 'Kuliner - Klaten',
          'Nama Bisnis': 'Warung Soto Seger',
          'Nomor Telepon': '0878-1234-5678',
          'Status WA': 'Riset',
        },
        // Invalid lead without phone
        {
          Tier: '2',
          'Nama Bisnis': 'Usaha Tanpa Nomor',
          'Nomor Telepon': '',
        },
      ];

      const result = processImportRows(rows);

      expect(result.total_processed).toBe(4);
      expect(result.masuk).toBe(2);
      expect(result.dilewati_duplikat).toBe(1);
      expect(result.gagal).toBe(1);
      expect(result.leads[0].nama_bisnis).toBe('PT Cipta Karya Perkasa');
      expect(result.leads[0].nomor_telepon_normalized).toBe('6281234567890');
      expect(result.leads[0].sektor).toBe('Kontraktor Bangunan');
      expect(result.leads[0].kota).toBe('Surakarta');
      expect(result.leads[0].verified_gbp).toBe(true);
      expect(result.leads[0].jumlah_ulasan).toBe(45);
      expect(result.leads[0].rating).toBe(4.8);

      expect(result.leads[1].nama_bisnis).toBe('Warung Soto Seger');
      expect(result.leads[1].nomor_telepon_normalized).toBe('6287812345678');
    });

    it('processes Riset format with Wilayah and batch_riset correctly', () => {
      const rows = [
        {
          Tier: '1',
          Sektor: 'Batu Alam',
          Kota: 'Bandung',
          Wilayah: 'Bandung Jabar',
          'Nama Bisnis': 'Batu Alam Nusantara',
          'Nomor Telepon': '0815-2996-4902',
          'Status Riset': 'TERVERIFIKASI',
          'Sumber Verifikasi': 'situs resmi live cek',
          'Batch Riset': '2026-11-01-wave2',
        },
      ];

      const result = processImportRows(rows);
      expect(result.masuk).toBe(1);
      const lead = result.leads[0];
      expect(lead.wilayah).toBe('Bandung Jabar');
      expect(lead.status).toBe('siap_kirim');
      expect(lead.verification_status).toBe('terverifikasi');
      expect(lead.verification_source).toBe('situs resmi live cek');
      expect(lead.batch_riset).toBe('2026-11-01-wave2');
    });
  });
});
