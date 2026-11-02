import {
  LeadStatus,
  VerificationStatus,
  Lead,
  Interaction,
  TransitionValidationResult,
  OperationalWindowStatus,
  FollowUpDueResult,
} from './types';
import {
  FOLLOW_UP_DAYS,
  MAX_DAILY_SENDS,
  OPERATIONAL_HOURS,
} from './constants';
import { sanitizePhoneNumber } from '@/lib/whatsapp';

/**
 * Normalizes phone number for unique constraints and deduplication.
 * Converts to international format 628... with digits only.
 */
export function normalizeLeadPhone(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const sanitized = sanitizePhoneNumber(raw.trim());
  return sanitized;
}

/**
 * Validates whether a lead status transition is permitted according to business rules.
 */
export function canTransition(
  from: LeadStatus,
  to: LeadStatus,
  lead: {
    tier: number;
    verification_status: VerificationStatus;
    catatan?: string | null;
  }
): TransitionValidationResult {
  // If no change
  if (from === to) {
    return { allowed: true };
  }

  // Rule 3: do_not_contact = total block. Cannot transition out to active statuses.
  if (from === 'do_not_contact') {
    return {
      allowed: false,
      reason: 'Prospek berstatus Do Not Contact diblokir dari semua perubahan status.',
    };
  }

  // Any active status can be moved to do_not_contact or closed
  if (to === 'do_not_contact' || to === 'closed') {
    return { allowed: true };
  }

  // Rule 2: Tier 4 = benchmark-only. Cannot move to siap_kirim / terkirim / followup_*
  if (lead.tier === 4) {
    if (['siap_kirim', 'terkirim', 'followup_1', 'followup_2'].includes(to)) {
      return {
        allowed: false,
        reason: 'Prospek Tier 4 adalah benchmark-only dan tidak boleh dipindahkan ke antrean penawaran atau follow-up.',
      };
    }
    if (to === 'benchmark_only' || to === 'tidak_layak' || to === 'hold' || to === 'riset') {
      return { allowed: true };
    }
  }

  // Leads with other tiers should not move to benchmark_only unless tier 4
  if (to === 'benchmark_only' && lead.tier !== 4) {
    return {
      allowed: false,
      reason: 'Status benchmark_only hanya untuk prospek Tier 4.',
    };
  }

  // Rule 4: Number not verified cannot move to siap_kirim
  if (to === 'siap_kirim') {
    if (lead.verification_status === 'belum' || lead.verification_status === 'tidak_layak') {
      return {
        allowed: false,
        reason: 'Nomor belum terverifikasi tidak bisa dipindahkan ke Siap Kirim.',
      };
    }

    if (lead.verification_status === 'hold') {
      return {
        allowed: false,
        reason: 'Nomor dalam status hold verifikasi manual. Verifikasi nomor terlebih dahulu.',
      };
    }

    if (lead.verification_status === 'parsial') {
      return {
        allowed: true,
        warning: 'Nomor terverifikasi parsial: pastikan catatan verifikasi sudah dicek sebelum kirim.',
      };
    }

    if (lead.verification_status === 'terverifikasi') {
      return { allowed: true };
    }
  }

  // Rule 1: Follow-up maximum 2x
  if (from === 'followup_2') {
    // After followup_2 without reply, only pause, replied, closed, or do_not_contact allowed
    if (to === 'pause' || to === 'replied') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Follow-up maksimal 2x — prospek di-pause sesuai aturan.',
    };
  }

  if (to === 'followup_1') {
    if (from !== 'terkirim') {
      return {
        allowed: false,
        reason: 'Follow-up 1 hanya dapat dicatat setelah status Terkirim.',
      };
    }
    return { allowed: true };
  }

  if (to === 'followup_2') {
    if (from !== 'followup_1') {
      return {
        allowed: false,
        reason: 'Follow-up 2 hanya dapat dicatat setelah Follow-up 1.',
      };
    }
    return { allowed: true };
  }

  if (from === 'pause' && ['followup_1', 'followup_2', 'terkirim'].includes(to)) {
    return {
      allowed: false,
      reason: 'Prospek yang di-pause tidak dapat langsung dilanjutkan ke follow-up tanpa balasan atau riset ulang.',
    };
  }

  // Workflow from initial statuses
  if (from === 'riset') {
    if (['terverifikasi', 'hold', 'tidak_layak', 'siap_kirim', 'benchmark_only'].includes(to)) {
      return { allowed: true };
    }
  }

  if (from === 'terverifikasi' || from === 'hold') {
    if (to === 'siap_kirim' || to === 'hold' || to === 'tidak_layak' || to === 'terverifikasi') {
      return { allowed: true };
    }
  }

  if (from === 'siap_kirim') {
    if (to === 'terkirim' || to === 'hold' || to === 'tidak_layak') {
      return { allowed: true };
    }
  }

  if (from === 'terkirim') {
    if (to === 'pause' || to === 'replied') {
      return { allowed: true };
    }
  }

  if (from === 'followup_1') {
    if (to === 'pause' || to === 'replied') {
      return { allowed: true };
    }
  }

  if (from === 'replied') {
    if (to === 'pause') {
      return { allowed: true };
    }
  }

  return { allowed: true };
}

/**
 * Checks current operational window in WIB (Asia/Jakarta).
 * Max 5 sends/day, Monday to Friday, 09:00 - 15:00 WIB.
 */
export function getOperationalWindowStatus(
  now: Date = new Date(),
  slotsUsedToday: number = 0
): OperationalWindowStatus {
  // Convert date to WIB (UTC+7)
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: OPERATIONAL_HOURS.timezone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const partMap: Record<string, string> = {};
  parts.forEach((p) => {
    partMap[p.type] = p.value;
  });

  const weekday = partMap['weekday']; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  const hour = parseInt(partMap['hour'] || '0', 10);
  const minute = parseInt(partMap['minute'] || '0', 10);

  const isMonToFri = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday);
  const isOperationalHour =
    hour >= OPERATIONAL_HOURS.startHour && hour < OPERATIONAL_HOURS.endHour;

  const isInOperationalWindow = isMonToFri && isOperationalHour;
  const slotsRemaining = Math.max(0, MAX_DAILY_SENDS - slotsUsedToday);

  const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} WIB (${weekday})`;

  return {
    isOperationalDay: isMonToFri,
    isOperationalHour,
    isInOperationalWindow,
    slotsUsedToday,
    maxDailySlots: MAX_DAILY_SENDS,
    slotsRemaining,
    currentTimeWIB: formattedTime,
  };
}

/**
 * Calculates whether a lead is due for follow-up.
 * Follow-up due = 7 calendar days after the latest outreach interaction
 * (penawaran / followup_1) without a subsequent balasan_masuk, and status is active.
 */
export function isFollowUpDue(
  lead: Pick<Lead, 'status'>,
  interactions: Interaction[],
  referenceDate: Date = new Date()
): FollowUpDueResult {
  // Only leads currently waiting for follow-up are candidates
  if (!['terkirim', 'followup_1'].includes(lead.status)) {
    return {
      isDue: false,
      daysOverdue: 0,
      lastInteractionDate: null,
      lastInteractionType: null,
    };
  }

  // Sort interactions descending by terjadi_pada
  const sorted = [...interactions].sort(
    (a, b) =>
      new Date(b.terjadi_pada).getTime() - new Date(a.terjadi_pada).getTime()
  );

  // Find the latest outreach interaction
  const lastOutreach = sorted.find((i) =>
    ['penawaran', 'followup_1'].includes(i.jenis)
  );

  if (!lastOutreach) {
    return {
      isDue: false,
      daysOverdue: 0,
      lastInteractionDate: null,
      lastInteractionType: null,
    };
  }

  // If there is any balasan_masuk occurring after this outreach, it is not due
  const outreachTime = new Date(lastOutreach.terjadi_pada).getTime();
  const subsequentReply = sorted.find(
    (i) =>
      i.jenis === 'balasan_masuk' &&
      new Date(i.terjadi_pada).getTime() >= outreachTime
  );

  if (subsequentReply) {
    return {
      isDue: false,
      daysOverdue: 0,
      lastInteractionDate: lastOutreach.terjadi_pada,
      lastInteractionType: lastOutreach.jenis,
    };
  }

  // Calculate calendar days elapsed
  const refTime = referenceDate.getTime();
  const diffDays = Math.floor(
    (refTime - outreachTime) / (1000 * 60 * 60 * 24)
  );

  const isDue = diffDays >= FOLLOW_UP_DAYS;
  const daysOverdue = isDue ? diffDays - FOLLOW_UP_DAYS : 0;

  return {
    isDue,
    daysOverdue,
    lastInteractionDate: lastOutreach.terjadi_pada,
    lastInteractionType: lastOutreach.jenis,
  };
}

/**
 * Generates an official WhatsApp click-to-chat link for a lead.
 */
export function buildLeadWhatsAppUrl(phoneNumber: string, message?: string): string {
  const normalized = normalizeLeadPhone(phoneNumber);
  if (!normalized) return '';
  if (message && message.trim()) {
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message.trim())}`;
  }
  return `https://wa.me/${normalized}`;
}
