export type LeadStatus =
  | 'riset'
  | 'terverifikasi'
  | 'hold'
  | 'tidak_layak'
  | 'siap_kirim'
  | 'terkirim'
  | 'followup_1'
  | 'followup_2'
  | 'pause'
  | 'replied'
  | 'closed'
  | 'do_not_contact'
  | 'benchmark_only';

export type VerificationStatus =
  | 'belum'
  | 'terverifikasi'
  | 'parsial'
  | 'hold'
  | 'tidak_layak';

export type InteractionType =
  | 'penawaran'
  | 'followup_1'
  | 'followup_2'
  | 'balasan_masuk'
  | 'catatan';

export interface Lead {
  id: string;
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
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  lead_id: string;
  jenis: InteractionType;
  isi: string | null;
  terjadi_pada: string;
  channel: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  lead_id: string;
  aksi: string;
  detail: string | null;
  created_at: string;
}

export interface OperationalWindowStatus {
  isOperationalDay: boolean; // Mon-Fri
  isOperationalHour: boolean; // 09:00 - 15:00 WIB
  isInOperationalWindow: boolean;
  slotsUsedToday: number;
  maxDailySlots: number;
  slotsRemaining: number;
  currentTimeWIB: string;
}

export interface FollowUpDueResult {
  isDue: boolean;
  daysOverdue: number;
  lastInteractionDate: string | null;
  lastInteractionType: InteractionType | null;
}

export interface TransitionValidationResult {
  allowed: boolean;
  reason?: string;
  warning?: string;
}

