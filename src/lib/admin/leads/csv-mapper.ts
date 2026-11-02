import { LeadStatus, VerificationStatus } from './types';
import { normalizeLeadPhone } from './rules';

export interface ParsedLeadRow {
  tier: 1 | 2 | 3 | 4;
  sub_kelompok: string | null;
  sektor: string;
  kota: string;
  wilayah: string;
  nama_bisnis: string;
  tipe_usaha: string | null;
  verified_gbp: boolean | null;
  jumlah_ulasan: number | null;
  rating: number | null;
  jumlah_foto: number | null;
  nomor_telepon: string;
  nomor_telepon_normalized: string;
  tipe_kontak: string | null;
  link_wa: string | null;
  status_web: string | null;
  url_medsos: string | null;
  strategi_pitch: string | null;
  alamat: string | null;
  link_maps: string | null;
  status: LeadStatus;
  verification_status: VerificationStatus;
  verification_source: string | null;
  batch_riset: string | null;
  catatan: string | null;
  // Metadata for initial outreach interaction if present in Master sheet
  initial_interaction_date?: string | null;
  initial_interaction_note?: string | null;
}

export interface ImportSummary {
  total_processed: number;
  masuk: number;
  dilewati_duplikat: number;
  gagal: number;
  errors: Array<{ baris: number; pesan: string }>;
  leads: ParsedLeadRow[];
}

/**
 * Normalizes boolean strings from spreadsheets.
 */
export function parseBoolean(val: unknown): boolean | null {
  if (val === null || val === undefined) return null;
  const str = String(val).trim().toLowerCase();
  if (['ya', 'yes', 'true', '1', 'v', 'verified'].includes(str)) return true;
  if (['tidak', 'no', 'false', '0', 'unverified'].includes(str)) return false;
  return null;
}

/**
 * Normalizes number strings from spreadsheets.
 */
export function parseNumber(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  const str = String(val).replace(/,/g, '.').replace(/[^\d.-]/g, '').trim();
  const num = Number(str);
  return isNaN(num) ? null : num;
}

/**
 * Splits combined Sektor & Kota (e.g. "Kontraktor Bangunan - Surakarta")
 */
export function splitSektorAndKota(input: string): { sektor: string; kota: string } {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return { sektor: 'Lainnya', kota: 'Tidak Diketahui' };
  }

  // Look for " - " or " / " or " ("
  if (trimmed.includes(' - ')) {
    const parts = trimmed.split(' - ');
    return {
      sektor: parts[0].trim() || 'Lainnya',
      kota: parts.slice(1).join(' - ').trim() || 'Solo Raya',
    };
  }

  if (trimmed.includes(' / ')) {
    const parts = trimmed.split(' / ');
    return {
      sektor: parts[0].trim() || 'Lainnya',
      kota: parts.slice(1).join(' / ').trim() || 'Solo Raya',
    };
  }

  return {
    sektor: trimmed,
    kota: 'Solo Raya',
  };
}

/**
 * Determines status and verification status from raw CSV fields.
 */
export function determineLeadStatuses(
  rawStatus: string,
  tier: number,
  isRisetFormat: boolean = false
): {
  status: LeadStatus;
  verification_status: VerificationStatus;
} {
  const normalized = (rawStatus || '').trim().toUpperCase();

  // Tier 4 is always benchmark_only
  if (tier === 4) {
    return {
      status: 'benchmark_only',
      verification_status: 'terverifikasi',
    };
  }

  // Riset format rules
  if (isRisetFormat) {
    if (normalized.includes('TERVERIFIKASI')) {
      return {
        status: 'siap_kirim',
        verification_status: 'terverifikasi',
      };
    }
    if (normalized.includes('BELUM PASTI') || normalized.includes('HOLD') || normalized.includes('MANUAL')) {
      return {
        status: 'hold',
        verification_status: 'hold',
      };
    }
    if (normalized.includes('TIDAK LAYAK')) {
      return {
        status: 'tidak_layak',
        verification_status: 'tidak_layak',
      };
    }
  }

  // Master format heuristics
  if (normalized.includes('TERKIRIM') || normalized.includes('SUDAH KIRIM') || normalized.includes('PENAWARAN')) {
    return {
      status: 'terkirim',
      verification_status: 'terverifikasi',
    };
  }

  if (normalized.includes('FOLLOW UP 1') || normalized.includes('FOLLOWUP 1')) {
    return {
      status: 'followup_1',
      verification_status: 'terverifikasi',
    };
  }

  if (normalized.includes('FOLLOW UP 2') || normalized.includes('FOLLOWUP 2')) {
    return {
      status: 'followup_2',
      verification_status: 'terverifikasi',
    };
  }

  if (normalized.includes('SIAP KIRIM')) {
    return {
      status: 'siap_kirim',
      verification_status: 'terverifikasi',
    };
  }

  if (normalized.includes('TERVERIFIKASI')) {
    return {
      status: 'siap_kirim',
      verification_status: 'terverifikasi',
    };
  }

  if (normalized.includes('DO NOT CONTACT') || normalized.includes('DNC')) {
    return {
      status: 'do_not_contact',
      verification_status: 'tidak_layak',
    };
  }

  if (normalized.includes('CLOSED')) {
    return {
      status: 'closed',
      verification_status: 'terverifikasi',
    };
  }

  if (normalized.includes('PAUSE')) {
    return {
      status: 'pause',
      verification_status: 'terverifikasi',
    };
  }

  if (normalized.includes('REPLIED') || normalized.includes('BALAS')) {
    return {
      status: 'replied',
      verification_status: 'terverifikasi',
    };
  }

  if (normalized.includes('HOLD')) {
    return {
      status: 'hold',
      verification_status: 'hold',
    };
  }

  if (normalized.includes('TIDAK LAYAK')) {
    return {
      status: 'tidak_layak',
      verification_status: 'tidak_layak',
    };
  }

  // Default initial status
  return {
    status: 'riset',
    verification_status: 'belum',
  };
}

/**
 * Maps a single row of arbitrary key-value pairs (or detected columns) to ParsedLeadRow.
 */
export function mapRawRowToLead(
  row: Record<string, string>,
  options: {
    defaultBatchRiset?: string | null;
    existingPhoneSet?: Set<string>;
  } = {}
): { lead: ParsedLeadRow | null; error?: string } {
  // Helper to find key: exact match first, then substring
  const getVal = (aliases: string[]): string => {
    // 1. Exact match
    for (const key of Object.keys(row)) {
      const cleanKey = key.trim().toLowerCase();
      for (const alias of aliases) {
        if (cleanKey === alias.toLowerCase()) {
          return (row[key] || '').trim();
        }
      }
    }
    // 2. Substring match fallback (excluding keys that contain '&' or 'dan' when looking for single terms)
    for (const key of Object.keys(row)) {
      const cleanKey = key.trim().toLowerCase();
      for (const alias of aliases) {
        const cleanAlias = alias.toLowerCase();
        if (cleanKey.includes(cleanAlias)) {
          // If searching for "sektor" or "kota" individually, do not accidentally match combined "sektor & kota"
          if ((cleanAlias === 'sektor' || cleanAlias === 'kota') && (cleanKey.includes('&') || cleanKey.includes('dan'))) {
            continue;
          }
          return (row[key] || '').trim();
        }
      }
    }
    return '';
  };

  const rawNama = getVal(['Nama Bisnis', 'Nama Usaha', 'Business Name', 'Nama']);
  if (!rawNama) {
    return { lead: null, error: 'Nama bisnis kosong' };
  }

  const rawPhone = getVal(['Nomor Telepon', 'No Telepon', 'No Telp', 'Telepon', 'Phone', 'WhatsApp']);
  const normalizedPhone = normalizeLeadPhone(rawPhone);
  if (!normalizedPhone || normalizedPhone.length < 8) {
    return { lead: null, error: `Nomor telepon tidak valid: "${rawPhone}"` };
  }

  // Parse tier
  const rawTier = parseNumber(getVal(['Tier']));
  const tier: 1 | 2 | 3 | 4 = (rawTier === 1 || rawTier === 2 || rawTier === 3 || rawTier === 4)
    ? rawTier
    : 2; // Default to Tier 2 if unspecified

  // Sektor & Kota
  const rawSektor = getVal(['Sektor']);
  const rawKota = getVal(['Kota', 'City']);
  const rawSektorKota = getVal(['Sektor & Kota', 'Sektor dan Kota']);

  let sektor = rawSektor;
  let kota = rawKota;

  if (!sektor && !kota && rawSektorKota) {
    const split = splitSektorAndKota(rawSektorKota);
    sektor = split.sektor;
    kota = split.kota;
  } else if (!sektor) {
    sektor = 'Umum';
  } else if (!kota) {
    kota = 'Solo Raya';
  }

  // Wilayah (required for Riset format, defaults to Solo Raya or kota)
  const rawWilayah = getVal(['Wilayah', 'Region']);
  const wilayah = rawWilayah || (kota.toLowerCase().includes('solo') || kota.toLowerCase().includes('surakarta') || kota.toLowerCase().includes('klaten') ? 'Solo Raya' : kota);

  // Status & Verification
  const rawStatus = getVal(['Status WA', 'Status Riset', 'Status Verifikasi', 'Status']);
  const isRisetFormat = Boolean(rawWilayah || getVal(['Batch Riset', 'Batch']));
  const { status, verification_status } = determineLeadStatuses(rawStatus, tier, isRisetFormat);

  const verificationSource = getVal(['Sumber Verifikasi', 'Verification Source', 'Sumber']);
  const batchRiset = getVal(['Batch Riset', 'Batch']) || options.defaultBatchRiset || null;

  // Outreach notes & interaction date if present
  const rawTglPenawaran = getVal(['Tanggal/Waktu Penawaran', 'Tanggal Penawaran', 'Tgl Kirim']);
  const rawCatatan = getVal(['Detail Penawaran & Catatan', 'Catatan', 'Notes']);

  const lead: ParsedLeadRow = {
    tier,
    sub_kelompok: getVal(['Sub-Kelompok', 'Sub Kelompok']) || null,
    sektor,
    kota,
    wilayah,
    nama_bisnis: rawNama,
    tipe_usaha: getVal(['Tipe Usaha', 'Tipe']) || null,
    verified_gbp: parseBoolean(getVal(['Verified GBP', 'GBP'])),
    jumlah_ulasan: parseNumber(getVal(['Jumlah Ulasan', 'Ulasan', 'Reviews'])),
    rating: parseNumber(getVal(['Rating'])),
    jumlah_foto: parseNumber(getVal(['Jumlah Foto', 'Foto', 'Photos'])),
    nomor_telepon: rawPhone,
    nomor_telepon_normalized: normalizedPhone,
    tipe_kontak: getVal(['Tipe Kontak']) || 'WhatsApp (Seluler)',
    link_wa: getVal(['Link WA', 'Link WhatsApp']) || `https://wa.me/${normalizedPhone}`,
    status_web: getVal(['Status Web', 'Website Status']) || null,
    url_medsos: getVal(['URL / Medsos Saat Ini', 'Medsos', 'Social Media', 'Instagram']) || null,
    strategi_pitch: getVal(['Strategi & Sudut Pandang Pitching', 'Strategi Pitching', 'Pitch']) || null,
    alamat: getVal(['Alamat Lengkap', 'Alamat', 'Address']) || null,
    link_maps: getVal(['Link Google Maps', 'Link Maps', 'Google Maps', 'Maps']) || null,
    status,
    verification_status,
    verification_source: verificationSource || null,
    batch_riset: batchRiset,
    catatan: rawCatatan || null,
    initial_interaction_date: rawTglPenawaran || null,
    initial_interaction_note: rawCatatan || null,
  };

  return { lead };
}

/**
 * In-memory deduplication and parsing for array of CSV rows.
 */
export function processImportRows(
  rows: Array<Record<string, string>>,
  options: {
    defaultBatchRiset?: string | null;
    existingPhoneSet?: Set<string>;
  } = {}
): ImportSummary {
  const seenPhones = new Set<string>(options.existingPhoneSet || []);
  const validLeads: ParsedLeadRow[] = [];
  const errors: Array<{ baris: number; pesan: string }> = [];
  let dilewatiDuplikat = 0;

  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // considering header as row 1
    const { lead, error } = mapRawRowToLead(row, options);

    if (error || !lead) {
      errors.push({ baris: rowNum, pesan: error || 'Data tidak valid' });
      return;
    }

    if (seenPhones.has(lead.nomor_telepon_normalized)) {
      dilewatiDuplikat++;
      return;
    }

    seenPhones.add(lead.nomor_telepon_normalized);
    validLeads.push(lead);
  });

  return {
    total_processed: rows.length,
    masuk: validLeads.length,
    dilewati_duplikat: dilewatiDuplikat,
    gagal: errors.length,
    errors,
    leads: validLeads,
  };
}
