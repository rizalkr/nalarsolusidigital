import { LeadStatus, VerificationStatus } from './types';
import { normalizeLeadPhone } from './rules';

export class LeadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LeadValidationError';
  }
}

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
  status_diminta: string | null;
  status_diterapkan: LeadStatus;
  verification_status: VerificationStatus;
  verification_source: string | null;
  batch_riset: string | null;
  catatan: string | null;
  // Metadata for initial outreach interaction if present in Master sheet
  initial_interaction_date?: string | null;
  initial_interaction_note?: string | null;
}

export interface ImportRowReport {
  baris: number;
  nama_bisnis: string;
  nomor_telepon: string;
  status_diminta: string | null;
  status_diterapkan: LeadStatus;
  status_verifikasi: VerificationStatus;
  hasil: 'masuk' | 'dilewati_duplikat' | 'gagal';
  pesan?: string;
}

export interface ImportSummary {
  total_processed: number;
  masuk: number;
  dilewati_duplikat: number;
  gagal: number;
  errors: Array<{ baris: number; pesan: string }>;
  leads: ParsedLeadRow[];
  rows: ImportRowReport[];
}

/**
 * Normalizes business name for composite deduplication.
 */
export function normalizeBusinessName(name: string): string {
  return (name || '').trim().toLowerCase();
}

/**
 * Generates composite deduplication key: phone + normalized business name.
 */
export function makeCompositeDedupKey(phoneNormalized: string, businessName: string): string {
  return `${phoneNormalized}:::${normalizeBusinessName(businessName)}`;
}

/**
 * Defensive string coercion for input parsing.
 * Accepts numbers and booleans and converts to trimmed string.
 * Rejects objects/arrays and throws LeadValidationError.
 */
export function coerceString(val: unknown, fieldName: string): string {
  if (val === null || val === undefined) {
    return '';
  }
  if (typeof val === 'object') {
    const receivedType = Array.isArray(val) ? 'array' : 'object';
    throw new LeadValidationError(
      `Field "${fieldName}" bernilai tipe ${receivedType} yang tidak valid. Diterapkan: teks, angka, atau boolean.`
    );
  }
  return String(val).trim();
}

/**
 * Normalizes boolean strings or values from spreadsheets and JSON.
 */
export function parseBoolean(val: unknown, fieldName: string = 'boolean'): boolean | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') {
    if (val === 1) return true;
    if (val === 0) return false;
  }
  if (typeof val === 'object') {
    const receivedType = Array.isArray(val) ? 'array' : 'object';
    throw new LeadValidationError(
      `Field "${fieldName}" bertipe ${receivedType} yang tidak valid. Diterapkan: boolean, teks ("ya"/"tidak"), atau angka (1/0).`
    );
  }
  const str = String(val).trim().toLowerCase();
  if (['ya', 'yes', 'true', '1', 'v', 'verified'].includes(str)) return true;
  if (['tidak', 'no', 'false', '0', 'unverified'].includes(str)) return false;
  return null;
}

/**
 * Normalizes number strings or values from spreadsheets and JSON.
 */
export function parseNumber(val: unknown, fieldName: string = 'number'): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  if (typeof val === 'object') {
    const receivedType = Array.isArray(val) ? 'array' : 'object';
    throw new LeadValidationError(
      `Field "${fieldName}" bertipe ${receivedType} yang tidak valid. Diterapkan: angka atau teks angka.`
    );
  }
  const str = String(val).replace(/,/g, '.').replace(/[^\d.-]/g, '').trim();
  if (!str) return null;
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

  // Look for " - " or " / "
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

export const ALLOWED_IMPORT_INITIAL_STATUSES: LeadStatus[] = [
  'riset',
  'terverifikasi',
  'siap_kirim',
  'hold',
  'tidak_layak',
  'do_not_contact',
  'benchmark_only',
];

export const FORBIDDEN_DIRECT_OUTREACH_STATUSES: LeadStatus[] = [
  'terkirim',
  'followup_1',
  'followup_2',
  'replied',
  'pause',
  'closed',
];

/**
 * Determines and validates status & verification_status.
 * Enforces domain rules and explicitly distinguishes requested vs applied status.
 */
export function resolveLeadStatuses(params: {
  rawStatus: string;
  statusSourceKey: string;
  tier: number;
  explicitVerificationStatus?: string;
  isRisetFormat?: boolean;
}): {
  status: LeadStatus;
  status_diminta: string | null;
  status_diterapkan: LeadStatus;
  verification_status: VerificationStatus;
} {
  const { rawStatus, statusSourceKey, tier, explicitVerificationStatus, isRisetFormat } = params;
  const trimmed = (rawStatus || '').trim();
  const normalized = trimmed.toLowerCase().replace(/[\s-]+/g, '_');

  // Parse explicit verification status if provided
  let verificationStatus: VerificationStatus | undefined;
  if (explicitVerificationStatus) {
    const normVer = explicitVerificationStatus.trim().toLowerCase().replace(/[\s-]+/g, '_');
    if (['belum', 'terverifikasi', 'parsial', 'hold', 'tidak_layak'].includes(normVer)) {
      verificationStatus = normVer as VerificationStatus;
    }
  }

  // Case 1: No status specified -> Default initial status
  if (!trimmed) {
    if (tier === 4) {
      return {
        status: 'benchmark_only',
        status_diminta: null,
        status_diterapkan: 'benchmark_only',
        verification_status: verificationStatus || 'terverifikasi',
      };
    }
    return {
      status: 'riset',
      status_diminta: null,
      status_diterapkan: 'riset',
      verification_status: verificationStatus || 'belum',
    };
  }

  // Case 2: Explicit outreach status requested directly in status field -> Forbidden (HTTP 400)
  const isDirectStatusField =
    statusSourceKey.toLowerCase() === 'status' || statusSourceKey.toLowerCase() === 'status_wa';

  if (
    FORBIDDEN_DIRECT_OUTREACH_STATUSES.includes(normalized as LeadStatus) ||
    normalized.startsWith('terkirim') ||
    normalized.startsWith('followup') ||
    normalized.startsWith('follow_up') ||
    normalized === 'replied' ||
    normalized === 'pause' ||
    normalized === 'closed'
  ) {
    // Check if it's a legacy master sheet phrase like "Sudah dikirim penawaran" with interaction date
    if (
      statusSourceKey.toLowerCase().includes('status wa') &&
      (trimmed.toUpperCase().includes('TERKIRIM') || trimmed.toUpperCase().includes('SUDAH KIRIM') || trimmed.toUpperCase().includes('PENAWARAN'))
    ) {
      return {
        status: 'terkirim',
        status_diminta: trimmed,
        status_diterapkan: 'terkirim',
        verification_status: verificationStatus || 'terverifikasi',
      };
    }

    if (isDirectStatusField) {
      throw new LeadValidationError(
        `Status outreach "${trimmed}" tidak boleh di-set langsung via field status. Status outreach hanya boleh dicapai melalui pencatatan interaksi.`
      );
    }
  }

  // Case 3: Explicit initial status mapping
  let targetStatus: LeadStatus | null = null;

  if (normalized === 'do_not_contact' || normalized === 'dnc' || normalized.includes('do_not_contact')) {
    targetStatus = 'do_not_contact';
  } else if (normalized === 'benchmark_only' || normalized === 'benchmark') {
    targetStatus = 'benchmark_only';
  } else if (normalized === 'siap_kirim') {
    targetStatus = 'siap_kirim';
  } else if (normalized === 'terverifikasi') {
    // If from Google Sheet "Status Riset: TERVERIFIKASI", it enters ready queue "siap_kirim"
    if (isRisetFormat && statusSourceKey.toLowerCase().includes('riset')) {
      targetStatus = 'siap_kirim';
    } else {
      targetStatus = 'terverifikasi';
    }
  } else if (normalized === 'hold' || normalized.includes('hold') || normalized.includes('belum_pasti')) {
    targetStatus = 'hold';
  } else if (normalized === 'tidak_layak' || normalized.includes('tidak_layak')) {
    targetStatus = 'tidak_layak';
  } else if (normalized === 'riset') {
    targetStatus = 'riset';
  }

  if (!targetStatus) {
    throw new LeadValidationError(
      `Status "${trimmed}" tidak valid. Status awal yang diizinkan: riset, terverifikasi, siap_kirim, hold, tidak_layak, do_not_contact, benchmark_only.`
    );
  }

  // Domain rule 1: Tier 4 = benchmark-only
  if (tier === 4) {
    if (targetStatus !== 'benchmark_only' && targetStatus !== 'tidak_layak' && targetStatus !== 'hold' && targetStatus !== 'riset') {
      throw new LeadValidationError(
        `Prospek Tier 4 adalah benchmark-only dan tidak boleh berstatus "${targetStatus}".`
      );
    }
  } else {
    if (targetStatus === 'benchmark_only') {
      throw new LeadValidationError('Status benchmark_only hanya untuk prospek Tier 4.');
    }
  }

  // Domain rule 2: siap_kirim requires verified/parsial phone
  if (targetStatus === 'siap_kirim') {
    if (verificationStatus && (verificationStatus === 'belum' || verificationStatus === 'tidak_layak' || verificationStatus === 'hold')) {
      throw new LeadValidationError(
        `Nomor belum terverifikasi tidak bisa siap kirim (verification_status saat ini: "${verificationStatus}").`
      );
    }
    verificationStatus = verificationStatus || 'terverifikasi';
  }

  // Default verification statuses for other states if not explicitly provided
  if (!verificationStatus) {
    if (targetStatus === 'terverifikasi' || targetStatus === 'benchmark_only') {
      verificationStatus = 'terverifikasi';
    } else if (targetStatus === 'hold') {
      verificationStatus = 'hold';
    } else if (targetStatus === 'tidak_layak' || targetStatus === 'do_not_contact') {
      verificationStatus = 'tidak_layak';
    } else {
      verificationStatus = 'belum';
    }
  }

  return {
    status: targetStatus,
    status_diminta: trimmed,
    status_diterapkan: targetStatus,
    verification_status: verificationStatus,
  };
}

/**
 * Backward compatibility wrapper for determineLeadStatuses.
 */
export function determineLeadStatuses(
  rawStatus: string,
  tier: number,
  isRisetFormat: boolean = false
): {
  status: LeadStatus;
  verification_status: VerificationStatus;
} {
  try {
    const res = resolveLeadStatuses({
      rawStatus,
      statusSourceKey: isRisetFormat ? 'Status Riset' : 'Status WA',
      tier,
      isRisetFormat,
    });
    return {
      status: res.status,
      verification_status: res.verification_status,
    };
  } catch {
    if (tier === 4) {
      return { status: 'benchmark_only', verification_status: 'terverifikasi' };
    }
    return { status: 'riset', verification_status: 'belum' };
  }
}

/**
 * Maps a single row of arbitrary key-value pairs to ParsedLeadRow.
 */
export function mapRawRowToLead(
  row: Record<string, unknown>,
  options: {
    defaultBatchRiset?: string | null;
  } = {}
): { lead: ParsedLeadRow | null; error?: string } {
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    return {
      lead: null,
      error: `Data baris tidak valid: diharapkan object tapi menerima ${Array.isArray(row) ? 'array' : typeof row}`,
    };
  }

  // Helper to find key: exact match first, then substring
  const getVal = (aliases: string[]): { value: string; key: string } => {
    // 1. Exact match
    for (const key of Object.keys(row)) {
      const cleanKey = key.trim().toLowerCase();
      for (const alias of aliases) {
        if (cleanKey === alias.toLowerCase()) {
          const coerced = coerceString(row[key], key);
          return { value: coerced, key };
        }
      }
    }
    // 2. Substring match fallback (excluding keys that contain '&' or 'dan' when looking for single terms)
    for (const key of Object.keys(row)) {
      const cleanKey = key.trim().toLowerCase();
      for (const alias of aliases) {
        const cleanAlias = alias.toLowerCase();
        if (cleanKey.includes(cleanAlias)) {
          if ((cleanAlias === 'sektor' || cleanAlias === 'kota') && (cleanKey.includes('&') || cleanKey.includes('dan'))) {
            continue;
          }
          const coerced = coerceString(row[key], key);
          return { value: coerced, key };
        }
      }
    }
    return { value: '', key: '' };
  };

  try {
    const rawNamaEntry = getVal(['Nama Bisnis', 'Nama Usaha', 'Business Name', 'Nama', 'nama_bisnis']);
    const rawNama = rawNamaEntry.value;
    if (!rawNama) {
      return { lead: null, error: 'Field "Nama Bisnis" wajib diisi (tidak boleh kosong atau null).' };
    }

    const rawPhoneEntry = getVal(['Nomor Telepon', 'No Telepon', 'No Telp', 'Telepon', 'Phone', 'WhatsApp', 'nomor_telepon']);
    const rawPhone = rawPhoneEntry.value;
    if (!rawPhone) {
      return { lead: null, error: 'Field "Nomor Telepon" wajib diisi (tidak boleh kosong atau null).' };
    }

    const normalizedPhone = normalizeLeadPhone(rawPhone);
    if (!normalizedPhone || normalizedPhone.length < 8) {
      return { lead: null, error: `Nomor telepon tidak valid: "${rawPhone}"` };
    }

    // Parse tier
    const rawTier = parseNumber(getVal(['Tier', 'tier']).value, 'Tier');
    const tier: 1 | 2 | 3 | 4 = (rawTier === 1 || rawTier === 2 || rawTier === 3 || rawTier === 4)
      ? rawTier
      : 2; // Default to Tier 2 if unspecified

    // Sektor & Kota
    const rawSektor = getVal(['Sektor', 'sektor']).value;
    const rawKota = getVal(['Kota', 'City', 'kota']).value;
    const rawSektorKota = getVal(['Sektor & Kota', 'Sektor dan Kota']).value;

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

    // Wilayah
    const rawWilayah = getVal(['Wilayah', 'Region', 'wilayah']).value;
    const wilayah = rawWilayah || (kota.toLowerCase().includes('solo') || kota.toLowerCase().includes('surakarta') || kota.toLowerCase().includes('klaten') ? 'Solo Raya' : kota);

    // Status & Verification Status
    const statusEntry = getVal(['status', 'Status', 'Status WA', 'Status Riset']);
    const verificationStatusEntry = getVal(['verification_status', 'Status Verifikasi']);
    const isRisetFormat = Boolean(rawWilayah || getVal(['Batch Riset', 'Batch', 'batch_riset']).value);

    const { status, status_diminta, status_diterapkan, verification_status } = resolveLeadStatuses({
      rawStatus: statusEntry.value,
      statusSourceKey: statusEntry.key || 'status',
      tier,
      explicitVerificationStatus: verificationStatusEntry.value,
      isRisetFormat,
    });

    const verificationSource = getVal(['Sumber Verifikasi', 'Verification Source', 'Sumber', 'verification_source']).value;
    const batchRiset = getVal(['Batch Riset', 'Batch', 'batch_riset']).value || options.defaultBatchRiset || null;

    // Outreach notes & interaction date if present
    const rawTglPenawaran = getVal(['Tanggal/Waktu Penawaran', 'Tanggal Penawaran', 'Tgl Kirim']).value;
    const rawCatatan = getVal(['Detail Penawaran & Catatan', 'Catatan', 'Notes', 'catatan']).value;

    const lead: ParsedLeadRow = {
      tier,
      sub_kelompok: getVal(['Sub-Kelompok', 'Sub Kelompok', 'sub_kelompok']).value || null,
      sektor,
      kota,
      wilayah,
      nama_bisnis: rawNama,
      tipe_usaha: getVal(['Tipe Usaha', 'Tipe', 'tipe_usaha']).value || null,
      verified_gbp: parseBoolean(getVal(['Verified GBP', 'GBP', 'verified_gbp']).value, 'Verified GBP'),
      jumlah_ulasan: parseNumber(getVal(['Jumlah Ulasan', 'Ulasan', 'Reviews', 'jumlah_ulasan']).value, 'Jumlah Ulasan'),
      rating: parseNumber(getVal(['Rating', 'rating']).value, 'Rating'),
      jumlah_foto: parseNumber(getVal(['Jumlah Foto', 'Foto', 'Photos', 'jumlah_foto']).value, 'Jumlah Foto'),
      nomor_telepon: rawPhone,
      nomor_telepon_normalized: normalizedPhone,
      tipe_kontak: getVal(['Tipe Kontak', 'tipe_kontak']).value || 'WhatsApp (Seluler)',
      link_wa: getVal(['Link WA', 'Link WhatsApp', 'link_wa']).value || `https://wa.me/${normalizedPhone}`,
      status_web: getVal(['Status Web', 'Website Status', 'status_web']).value || null,
      url_medsos: getVal(['URL / Medsos Saat Ini', 'Medsos', 'Social Media', 'Instagram', 'url_medsos']).value || null,
      strategi_pitch: getVal(['Strategi & Sudut Pandang Pitching', 'Strategi Pitching', 'Pitch', 'strategi_pitch']).value || null,
      alamat: getVal(['Alamat Lengkap', 'Alamat', 'Address', 'alamat']).value || null,
      link_maps: getVal(['Link Google Maps', 'Link Maps', 'Google Maps', 'Maps', 'link_maps']).value || null,
      status,
      status_diminta,
      status_diterapkan,
      verification_status,
      verification_source: verificationSource || null,
      batch_riset: batchRiset,
      catatan: rawCatatan || null,
      initial_interaction_date: rawTglPenawaran || null,
      initial_interaction_note: rawCatatan || null,
    };

    return { lead };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Kesalahan saat memproses baris lead.';
    return { lead: null, error: errorMsg };
  }
}

export interface ProcessImportRowsOptions {
  defaultBatchRiset?: string | null;
  existingLeadKeySet?: Set<string>;
  strictValidation?: boolean;
}

/**
 * In-memory deduplication and parsing for array of lead rows.
 * Deduplicates using composite key: nomor_telepon_normalized + nama_bisnis_normalized.
 */
export function processImportRows(
  rows: Array<Record<string, unknown>>,
  options: ProcessImportRowsOptions = {}
): ImportSummary {
  const seenKeys = new Set<string>(options.existingLeadKeySet || []);
  const validLeads: ParsedLeadRow[] = [];
  const errors: Array<{ baris: number; pesan: string }> = [];
  const rowReports: ImportRowReport[] = [];
  let dilewatiDuplikat = 0;

  rows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const { lead, error } = mapRawRowToLead(row, {
      defaultBatchRiset: options.defaultBatchRiset,
    });

    if (error || !lead) {
      const errorMsg = error || 'Data baris tidak valid';
      errors.push({ baris: rowNum, pesan: errorMsg });

      const rawNama =
        typeof row === 'object' && row !== null
          ? String((row as Record<string, unknown>)['Nama Bisnis'] ?? (row as Record<string, unknown>)['nama_bisnis'] ?? '')
          : '';
      const rawPhone =
        typeof row === 'object' && row !== null
          ? String((row as Record<string, unknown>)['Nomor Telepon'] ?? (row as Record<string, unknown>)['nomor_telepon'] ?? '')
          : '';
      const rawStatus =
        typeof row === 'object' && row !== null
          ? String((row as Record<string, unknown>)['status'] ?? (row as Record<string, unknown>)['Status'] ?? '')
          : null;

      rowReports.push({
        baris: rowNum,
        nama_bisnis: rawNama,
        nomor_telepon: rawPhone,
        status_diminta: rawStatus || null,
        status_diterapkan: 'tidak_layak',
        status_verifikasi: 'tidak_layak',
        hasil: 'gagal',
        pesan: errorMsg,
      });
      return;
    }

    const dedupKey = makeCompositeDedupKey(lead.nomor_telepon_normalized, lead.nama_bisnis);
    if (seenKeys.has(dedupKey)) {
      dilewatiDuplikat++;
      rowReports.push({
        baris: rowNum,
        nama_bisnis: lead.nama_bisnis,
        nomor_telepon: lead.nomor_telepon,
        status_diminta: lead.status_diminta,
        status_diterapkan: lead.status,
        status_verifikasi: lead.verification_status,
        hasil: 'dilewati_duplikat',
        pesan: `Duplikat prospek (kombinasi nomor "${lead.nomor_telepon_normalized}" dan nama "${lead.nama_bisnis}" sudah terdaftar).`,
      });
      return;
    }

    seenKeys.add(dedupKey);
    validLeads.push(lead);
    rowReports.push({
      baris: rowNum,
      nama_bisnis: lead.nama_bisnis,
      nomor_telepon: lead.nomor_telepon,
      status_diminta: lead.status_diminta,
      status_diterapkan: lead.status,
      status_verifikasi: lead.verification_status,
      hasil: 'masuk',
    });
  });

  if (options.strictValidation && errors.length > 0) {
    const firstErr = errors[0];
    throw new LeadValidationError(`Baris ${firstErr.baris}: ${firstErr.pesan}`);
  }

  return {
    total_processed: rows.length,
    masuk: validLeads.length,
    dilewati_duplikat: dilewatiDuplikat,
    gagal: errors.length,
    errors,
    leads: validLeads,
    rows: rowReports,
  };
}
