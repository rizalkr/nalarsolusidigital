import { LeadStatus, VerificationStatus, InteractionType } from './types';

export const FOLLOW_UP_DAYS = 7;
export const DEFAULT_MAX_DAILY_SENDS = 5;
export const MAX_DAILY_SENDS = DEFAULT_MAX_DAILY_SENDS;
export const DEFAULT_WA_ACCOUNTS = 2;

export const SETTINGS_LIMITS = {
  maxDailySlots: { min: 1, max: 50 },
  waAccounts: { min: 1, max: 10 },
} as const;

export const OPERATIONAL_HOURS = {
  startHour: 9,
  endHour: 15,
  timezone: 'Asia/Jakarta',
} as const;

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  riset: 'Riset',
  terverifikasi: 'Terverifikasi',
  hold: 'Hold',
  tidak_layak: 'Tidak Layak',
  siap_kirim: 'Siap Kirim',
  terkirim: 'Terkirim',
  followup_1: 'Follow-up 1',
  followup_2: 'Follow-up 2',
  pause: 'Pause',
  replied: 'Replied',
  closed: 'Closed',
  do_not_contact: 'Do Not Contact',
  benchmark_only: 'Benchmark Only',
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  belum: 'Belum Verifikasi',
  terverifikasi: 'Terverifikasi',
  parsial: 'Parsial',
  hold: 'Hold',
  tidak_layak: 'Tidak Layak',
};

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  penawaran: 'Penawaran Pertama',
  followup_1: 'Follow-up 1',
  followup_2: 'Follow-up 2',
  balasan_masuk: 'Balasan Masuk',
  catatan: 'Catatan',
};

export const LEAD_STATUS_BADGES: Record<
  LeadStatus,
  { bg: string; text: string; border: string }
> = {
  riset: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  terverifikasi: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  hold: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  tidak_layak: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  siap_kirim: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  terkirim: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  followup_1: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  followup_2: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  pause: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  replied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  closed: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  do_not_contact: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  benchmark_only: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

