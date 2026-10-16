import { describe, it, expect } from 'vitest';
import {
  sanitizePhoneNumber,
  isValidPhoneNumber,
  buildWhatsAppUrl,
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

    it('preserves existing 62 prefix', () => {
      expect(sanitizePhoneNumber('628123456789')).toBe('628123456789');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('returns true for valid phone numbers between 9 and 15 digits', () => {
      expect(isValidPhoneNumber('08123456789')).toBe(true);
      expect(isValidPhoneNumber('6281234567890')).toBe(true);
    });

    it('returns false for invalid inputs or too short/long numbers', () => {
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber('12345')).toBe(false);
      expect(isValidPhoneNumber('abcdefghijk')).toBe(false);
      expect(isValidPhoneNumber('12345678901234567890')).toBe(false);
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

    it('never generates a wa.me URL with a fictional or empty phone number', () => {
      expect(buildWhatsAppUrl({ phoneNumber: '' })).toBeNull();
      expect(buildWhatsAppUrl({ phoneNumber: 'invalid' })).toBeNull();
      expect(buildWhatsAppUrl({ phoneNumber: '123' })).toBeNull();
    });

    it('generates a valid wa.me URL when a valid custom phone number is provided', () => {
      const url = buildWhatsAppUrl({
        phoneNumber: '08123456789',
        message: 'Halo, saya ingin konsultasi.',
      });
      expect(url).toBe(
        'https://wa.me/628123456789?text=Halo%2C%20saya%20ingin%20konsultasi.'
      );
    });

    it('generates a URL without text parameter when no message is provided', () => {
      const url = buildWhatsAppUrl({ phoneNumber: '628123456789' });
      expect(url).toBe('https://wa.me/628123456789');
    });
  });
});

