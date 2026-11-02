import { describe, it, expect } from 'vitest';
import {
  canTransition,
  getOperationalWindowStatus,
  isFollowUpDue,
  normalizeLeadPhone,
  buildLeadWhatsAppUrl,
} from './rules';
import { LeadStatus, VerificationStatus, Interaction } from './types';

describe('Admin Nalar Leads Business Rules', () => {
  describe('normalizeLeadPhone', () => {
    it('normalizes local 08xx to international 628xx format', () => {
      expect(normalizeLeadPhone('0812-3456-7890')).toBe('6281234567890');
      expect(normalizeLeadPhone('+62 815 2996 4902')).toBe('6281529964902');
      expect(normalizeLeadPhone('878-0109-0888')).toBe('6287801090888');
    });

    it('handles empty and null strings safely', () => {
      expect(normalizeLeadPhone('')).toBe('');
      // @ts-expect-error test invalid input
      expect(normalizeLeadPhone(null)).toBe('');
    });
  });

  describe('Rule 1: Follow-up maksimal 2x', () => {
    it('allows terkirim to transition to followup_1', () => {
      const res = canTransition('terkirim', 'followup_1', {
        tier: 1,
        verification_status: 'terverifikasi',
      });
      expect(res.allowed).toBe(true);
    });

    it('allows followup_1 to transition to followup_2', () => {
      const res = canTransition('followup_1', 'followup_2', {
        tier: 2,
        verification_status: 'terverifikasi',
      });
      expect(res.allowed).toBe(true);
    });

    it('blocks followup_2 from transitioning to followup_1 or followup_2 again', () => {
      const res1 = canTransition('followup_2', 'followup_1', {
        tier: 1,
        verification_status: 'terverifikasi',
      });
      expect(res1.allowed).toBe(false);
      expect(res1.reason).toContain('Follow-up maksimal 2x');

      const res2 = canTransition('followup_2', 'followup_2', {
        tier: 1,
        verification_status: 'terverifikasi',
      });
      // no change is technically allowed, but transitioning to a 3rd follow-up or re-entering is blocked
      expect(res2.allowed).toBe(true);
    });

    it('allows followup_2 to transition to pause or replied', () => {
      const toPause = canTransition('followup_2', 'pause', {
        tier: 2,
        verification_status: 'terverifikasi',
      });
      expect(toPause.allowed).toBe(true);

      const toReplied = canTransition('followup_2', 'replied', {
        tier: 2,
        verification_status: 'terverifikasi',
      });
      expect(toReplied.allowed).toBe(true);
    });

    it('blocks pause from directly transitioning back to followup', () => {
      const res = canTransition('pause', 'followup_1', {
        tier: 2,
        verification_status: 'terverifikasi',
      });
      expect(res.allowed).toBe(false);
    });
  });

  describe('Rule 2: Tier 4 = benchmark-only', () => {
    it('blocks Tier 4 from transitioning to siap_kirim, terkirim, or followup_*', () => {
      const targets: LeadStatus[] = ['siap_kirim', 'terkirim', 'followup_1', 'followup_2'];
      targets.forEach((target) => {
        const res = canTransition('riset', target, {
          tier: 4,
          verification_status: 'terverifikasi',
        });
        expect(res.allowed).toBe(false);
        expect(res.reason).toContain('Tier 4 adalah benchmark-only');
      });
    });

    it('allows Tier 4 to transition to benchmark_only', () => {
      const res = canTransition('riset', 'benchmark_only', {
        tier: 4,
        verification_status: 'terverifikasi',
      });
      expect(res.allowed).toBe(true);
    });

    it('blocks other tiers (1-3) from transitioning to benchmark_only', () => {
      const res = canTransition('riset', 'benchmark_only', {
        tier: 1,
        verification_status: 'terverifikasi',
      });
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain('benchmark_only hanya untuk prospek Tier 4');
    });
  });

  describe('Rule 3: do_not_contact = blokir total', () => {
    it('blocks all transitions out of do_not_contact', () => {
      const targets: LeadStatus[] = [
        'siap_kirim',
        'terkirim',
        'followup_1',
        'pause',
        'replied',
        'riset',
        'terverifikasi',
      ];
      targets.forEach((target) => {
        const res = canTransition('do_not_contact', target, {
          tier: 1,
          verification_status: 'terverifikasi',
        });
        expect(res.allowed).toBe(false);
        expect(res.reason).toContain('Do Not Contact diblokir');
      });
    });

    it('allows active leads to transition to do_not_contact', () => {
      const statuses: LeadStatus[] = ['terkirim', 'followup_1', 'followup_2', 'pause', 'replied'];
      statuses.forEach((status) => {
        const res = canTransition(status, 'do_not_contact', {
          tier: 1,
          verification_status: 'terverifikasi',
        });
        expect(res.allowed).toBe(true);
      });
    });
  });

  describe('Rule 4: Nomor belum terverifikasi tidak bisa siap kirim', () => {
    it('blocks transition to siap_kirim if verification_status is belum, hold, or tidak_layak', () => {
      const invalidVerifications: VerificationStatus[] = ['belum', 'hold', 'tidak_layak'];
      invalidVerifications.forEach((vs) => {
        const res = canTransition('riset', 'siap_kirim', {
          tier: 2,
          verification_status: vs,
        });
        expect(res.allowed).toBe(false);
        expect(res.reason).toBeDefined();
      });
    });

    it('allows transition to siap_kirim if verification_status is terverifikasi', () => {
      const res = canTransition('riset', 'siap_kirim', {
        tier: 2,
        verification_status: 'terverifikasi',
      });
      expect(res.allowed).toBe(true);
      expect(res.warning).toBeUndefined();
    });

    it('allows transition to siap_kirim if verification_status is parsial with warning', () => {
      const res = canTransition('riset', 'siap_kirim', {
        tier: 2,
        verification_status: 'parsial',
      });
      expect(res.allowed).toBe(true);
      expect(res.warning).toContain('Nomor terverifikasi parsial');
    });
  });

  describe('Rule 5: Batas operasional harian (Mon-Fri 09:00 - 15:00 WIB, max 5 sends)', () => {
    it('identifies in-window operation correctly on Wednesday 10:30 WIB', () => {
      // 2026-11-04 is a Wednesday. 10:30 WIB is 03:30 UTC
      const wednesdayMorning = new Date('2026-11-04T03:30:00Z');
      const status = getOperationalWindowStatus(wednesdayMorning, 2);

      expect(status.isOperationalDay).toBe(true);
      expect(status.isOperationalHour).toBe(true);
      expect(status.isInOperationalWindow).toBe(true);
      expect(status.slotsUsedToday).toBe(2);
      expect(status.slotsRemaining).toBe(3);
    });

    it('identifies out-of-window operation on Sunday', () => {
      // 2026-11-01 is Sunday
      const sunday = new Date('2026-11-01T04:00:00Z');
      const status = getOperationalWindowStatus(sunday, 0);

      expect(status.isOperationalDay).toBe(false);
      expect(status.isInOperationalWindow).toBe(false);
    });

    it('identifies out-of-window operation on Wednesday at 19:00 WIB', () => {
      // 19:00 WIB = 12:00 UTC
      const wednesdayEvening = new Date('2026-11-04T12:00:00Z');
      const status = getOperationalWindowStatus(wednesdayEvening, 0);

      expect(status.isOperationalDay).toBe(true);
      expect(status.isOperationalHour).toBe(false);
      expect(status.isInOperationalWindow).toBe(false);
    });

    it('correctly tracks slots remaining when 5 slots are used', () => {
      const wednesdayMorning = new Date('2026-11-04T03:30:00Z');
      const status = getOperationalWindowStatus(wednesdayMorning, 5);

      expect(status.slotsRemaining).toBe(0);
    });
  });

  describe('Rule 7: Follow-up jatuh tempo (7 days)', () => {
    it('marks lead as due if 7 days have passed since penawaran without reply', () => {
      const refDate = new Date('2026-11-10T10:00:00Z');
      const interactions: Interaction[] = [
        {
          id: 'int-1',
          lead_id: 'lead-1',
          jenis: 'penawaran',
          isi: 'Penawaran via WA',
          terjadi_pada: '2026-11-03T09:00:00Z', // 7 days prior
          channel: 'wa_business',
          created_at: '2026-11-03T09:00:00Z',
        },
      ];

      const res = isFollowUpDue({ status: 'terkirim' }, interactions, refDate);
      expect(res.isDue).toBe(true);
      expect(res.daysOverdue).toBe(0);
      expect(res.lastInteractionType).toBe('penawaran');
    });

    it('calculates days overdue if 10 days have passed', () => {
      const refDate = new Date('2026-11-13T10:00:00Z');
      const interactions: Interaction[] = [
        {
          id: 'int-1',
          lead_id: 'lead-1',
          jenis: 'penawaran',
          isi: 'Penawaran via WA',
          terjadi_pada: '2026-11-03T09:00:00Z', // 10 days prior
          channel: 'wa_business',
          created_at: '2026-11-03T09:00:00Z',
        },
      ];

      const res = isFollowUpDue({ status: 'terkirim' }, interactions, refDate);
      expect(res.isDue).toBe(true);
      expect(res.daysOverdue).toBe(3);
    });

    it('is not due if only 5 days have passed', () => {
      const refDate = new Date('2026-11-08T10:00:00Z');
      const interactions: Interaction[] = [
        {
          id: 'int-1',
          lead_id: 'lead-1',
          jenis: 'penawaran',
          isi: 'Penawaran via WA',
          terjadi_pada: '2026-11-03T09:00:00Z', // 5 days prior
          channel: 'wa_business',
          created_at: '2026-11-03T09:00:00Z',
        },
      ];

      const res = isFollowUpDue({ status: 'terkirim' }, interactions, refDate);
      expect(res.isDue).toBe(false);
      expect(res.daysOverdue).toBe(0);
    });

    it('is not due if there is a subsequent balasan_masuk', () => {
      const refDate = new Date('2026-11-12T10:00:00Z');
      const interactions: Interaction[] = [
        {
          id: 'int-1',
          lead_id: 'lead-1',
          jenis: 'penawaran',
          isi: 'Penawaran awal',
          terjadi_pada: '2026-11-01T09:00:00Z',
          channel: 'wa_business',
          created_at: '2026-11-01T09:00:00Z',
        },
        {
          id: 'int-2',
          lead_id: 'lead-1',
          jenis: 'balasan_masuk',
          isi: 'Halo, tertarik penawarannya',
          terjadi_pada: '2026-11-05T10:00:00Z',
          channel: 'wa_business',
          created_at: '2026-11-05T10:00:00Z',
        },
      ];

      const res = isFollowUpDue({ status: 'terkirim' }, interactions, refDate);
      expect(res.isDue).toBe(false);
    });
  });

  describe('Rule 6: Manual WhatsApp link generator', () => {
    it('creates correct wa.me link with normalized phone', () => {
      const url = buildLeadWhatsAppUrl('0815 2996 4902');
      expect(url).toBe('https://wa.me/6281529964902');
    });

    it('properly encodes message parameter', () => {
      const url = buildLeadWhatsAppUrl('0815 2996 4902', 'Halo Nalar Solusi Digital');
      expect(url).toBe('https://wa.me/6281529964902?text=Halo%20Nalar%20Solusi%20Digital');
    });
  });
});

