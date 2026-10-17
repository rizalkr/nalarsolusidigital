import { describe, it, expect } from 'vitest';
import {
  sanitizePhoneNumber,
  isValidPhoneNumber,
  buildWhatsAppUrl,
  formatConsultationMessage,
} from './whatsapp';
import { siteConfig } from '@/config/site';

describe('whatsapp helper', () => {
  describe('sanitizePhoneNumber', () => {
    it('strips non-digits from input', () => {
      expect(sanitizePhoneNumber('+62 812-3456-7890')).toBe('6281234567890');
      expect(sanitizePhoneNumber('(021) 1234567')).toBe('0211234567');
    });

    it('converts leading 08 to 628', () => {
      expect(sanitizePhoneNumber('08123456789')).toBe('628123456789');
    });

    it('converts leading 8 to 628', () => {
      expect(sanitizePhoneNumber('8123456789')).toBe('628123456789');
    });

    it('normalizes +62 (08xx) with extraneous 0 after 62 to 628', () => {
      expect(sanitizePhoneNumber('+62 0812-3456-7890')).toBe('6281234567890');
      expect(sanitizePhoneNumber('6208571234567')).toBe('628571234567');
    });

    it('preserves valid 628 prefix', () => {
      expect(sanitizePhoneNumber('628123456789')).toBe('628123456789');
    });

    it('handles empty or non-string inputs safely', () => {
      expect(sanitizePhoneNumber('')).toBe('');
      // @ts-expect-error testing runtime safety
      expect(sanitizePhoneNumber(null)).toBe('');
      // @ts-expect-error testing runtime safety
      expect(sanitizePhoneNumber(undefined)).toBe('');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('returns true for valid Indonesian mobile phone numbers', () => {
      expect(isValidPhoneNumber('081234567890')).toBe(true);
      expect(isValidPhoneNumber('+62 812-3456-7890')).toBe(true);
      expect(isValidPhoneNumber('+62 (0812) 3456-7890')).toBe(true);
      expect(isValidPhoneNumber('85712345678')).toBe(true);
      expect(isValidPhoneNumber('089612345678')).toBe(true);
    });

    it('returns false for empty, too short, or too long inputs', () => {
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber('12345')).toBe(false);
      expect(isValidPhoneNumber('abcdefghijk')).toBe(false);
      expect(isValidPhoneNumber('12345678901234567890')).toBe(false);
    });

    it('rejects fictitious all-identical digit strings', () => {
      expect(isValidPhoneNumber('0000000000')).toBe(false);
      expect(isValidPhoneNumber('111111111111')).toBe(false);
      expect(isValidPhoneNumber('628888888888')).toBe(false);
    });

    it('rejects sequential digits', () => {
      expect(isValidPhoneNumber('1234567890')).toBe(false);
      expect(isValidPhoneNumber('0123456789')).toBe(false);
    });

    it('rejects dummy placeholders ending with 6 or more trailing zeros', () => {
      expect(isValidPhoneNumber('6281200000000')).toBe(false);
      expect(isValidPhoneNumber('081200000000')).toBe(false);
      expect(isValidPhoneNumber('628000000000')).toBe(false);
    });

    it('rejects Indonesian fixed line numbers because WhatsApp requires mobile', () => {
      expect(isValidPhoneNumber('0211234567')).toBe(false);
      expect(isValidPhoneNumber('+62 21 1234567')).toBe(false);
    });
  });

  describe('buildWhatsAppUrl', () => {
    it('returns null when WhatsApp is not configured and no custom phone is passed', () => {
      if (!siteConfig.contact.whatsapp.isConfigured) {
        expect(buildWhatsAppUrl()).toBeNull();
        expect(
          buildWhatsAppUrl({
            message: 'Halo Nalar Solusi Digital',
          })
        ).toBeNull();
      }
    });

    it('returns null when explicit empty string or whitespace is provided as phoneNumber', () => {
      expect(buildWhatsAppUrl({ phoneNumber: '' })).toBeNull();
      expect(buildWhatsAppUrl({ phoneNumber: '   ' })).toBeNull();
    });

    it('never generates a wa.me URL for dummy or invalid phone numbers', () => {
      expect(buildWhatsAppUrl({ phoneNumber: 'invalid' })).toBeNull();
      expect(buildWhatsAppUrl({ phoneNumber: '123' })).toBeNull();
      expect(buildWhatsAppUrl({ phoneNumber: '6281200000000' })).toBeNull();
      expect(buildWhatsAppUrl({ phoneNumber: '0000000000' })).toBeNull();
    });

    it('generates a valid wa.me URL when a valid custom phone number is provided', () => {
      const url = buildWhatsAppUrl({
        phoneNumber: '081234567890',
        message: 'Halo, saya ingin konsultasi.',
      });
      expect(url).toBe(
        'https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20konsultasi.'
      );
    });

    it('properly encodes special characters in message query', () => {
      const url = buildWhatsAppUrl({
        phoneNumber: '081234567890',
        message: 'Halo & selamat pagi? Kebutuhan: "website company profile"',
      });
      expect(url).toContain(
        'text=' +
          encodeURIComponent(
            'Halo & selamat pagi? Kebutuhan: "website company profile"'
          )
      );
    });

    it('generates a URL without text parameter when no message is provided', () => {
      const url = buildWhatsAppUrl({ phoneNumber: '081234567890' });
      expect(url).toBe('https://wa.me/6281234567890');
    });
  });

  describe('formatConsultationMessage', () => {
    it('formats template correctly when businessName is provided', () => {
      const message = formatConsultationMessage({
        name: 'Budi Santoso',
        businessName: 'Kopi Nusantara',
        category: 'Kehadiran Digital',
        needs: 'Ingin membuat website profil dan menu online untuk coffee shop.',
      });

      expect(message).toBe(
        'Halo Nalar Solusi Digital, saya ingin berkonsultasi mengenai kebutuhan bisnis saya.\n\n' +
          'Nama: Budi Santoso\n' +
          'Nama Usaha: Kopi Nusantara\n' +
          'Kebutuhan: Kehadiran Digital\n\n' +
          'Ceritakan kebutuhan:\n' +
          'Ingin membuat website profil dan menu online untuk coffee shop.\n\n' +
          'Saya ingin mendiskusikan solusi yang paling sesuai dengan kebutuhan tersebut.\n\n' +
          'Terima kasih.'
      );
    });

    it('omits the "Nama Usaha" line when businessName is empty, omitted, or whitespace only', () => {
      const messageWithoutBusiness = formatConsultationMessage({
        name: 'Siti Rahma',
        category: 'Proses Pemesanan dan Administrasi',
        needs: 'Butuh sistem pencatatan pesanan sederhana.',
      });

      expect(messageWithoutBusiness).not.toContain('Nama Usaha');
      expect(messageWithoutBusiness).toBe(
        'Halo Nalar Solusi Digital, saya ingin berkonsultasi mengenai kebutuhan bisnis saya.\n\n' +
          'Nama: Siti Rahma\n' +
          'Kebutuhan: Proses Pemesanan dan Administrasi\n\n' +
          'Ceritakan kebutuhan:\n' +
          'Butuh sistem pencatatan pesanan sederhana.\n\n' +
          'Saya ingin mendiskusikan solusi yang paling sesuai dengan kebutuhan tersebut.\n\n' +
          'Terima kasih.'
      );

      const messageWithWhitespaceBusiness = formatConsultationMessage({
        name: 'Siti Rahma',
        businessName: '   ',
        category: 'Proses Pemesanan dan Administrasi',
        needs: 'Butuh sistem pencatatan pesanan sederhana.',
      });

      expect(messageWithWhitespaceBusiness).not.toContain('Nama Usaha');
    });

    it('trims leading and trailing spaces from all fields', () => {
      const message = formatConsultationMessage({
        name: '   Andi   ',
        businessName: '   Bengkel Maju   ',
        category: '   Lainnya   ',
        needs: '   Integrasi alur kerja operasional.   ',
      });

      expect(message).toContain('Nama: Andi');
      expect(message).toContain('Nama Usaha: Bengkel Maju');
      expect(message).toContain('Kebutuhan: Lainnya');
      expect(message).toContain('Ceritakan kebutuhan:\nIntegrasi alur kerja operasional.');
    });

    it('encodes cleanly with buildWhatsAppUrl without breaking special characters or newlines', () => {
      const message = formatConsultationMessage({
        name: 'Ahmad & Partner',
        category: 'Identitas dan Infrastruktur Digital',
        needs: 'Setup domain & email bisnis (@ahmad.id) + website 1 halaman?',
      });

      const url = buildWhatsAppUrl({
        phoneNumber: '081234567890',
        message,
      });

      expect(url).toBeDefined();
      expect(url).toContain('wa.me/6281234567890?text=');
      // Verify encoded message can be decoded back to exact original string
      const encodedPart = url!.split('?text=')[1];
      expect(decodeURIComponent(encodedPart)).toBe(message);
    });
  });
});
