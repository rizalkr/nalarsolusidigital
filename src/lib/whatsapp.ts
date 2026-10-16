import { siteConfig } from '@/config/site';

/**
 * Sanitizes phone number string by removing spaces, dashes, parentheses, and leading plus sign.
 * Converts local Indonesian prefix (08xx or 8xx) to international format (628xx).
 */
export function sanitizePhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.startsWith('08')) {
    return '62' + digitsOnly.slice(1);
  }

  if (digitsOnly.startsWith('8')) {
    return '62' + digitsOnly;
  }

  return digitsOnly;
}

/**
 * Validates whether a sanitized phone number has a realistic length (between 9 and 15 digits).
 */
export function isValidPhoneNumber(phone: string): boolean {
  const sanitized = sanitizePhoneNumber(phone);
  return sanitized.length >= 9 && sanitized.length <= 15;
}

export interface BuildWhatsAppUrlOptions {
  message?: string;
  phoneNumber?: string;
}

/**
 * Generates an official WhatsApp click-to-chat URL (https://wa.me/<number>?text=<encoded_text>).
 *
 * CRITICAL RULE:
 * If no phone number is provided and the centralized siteConfig.contact.whatsapp.isConfigured is false,
 * or if the provided number is invalid, this function returns `null`.
 * It will NEVER generate a wa.me URL pointing to a fictitious or unconfigured number.
 */
export function buildWhatsAppUrl(options?: BuildWhatsAppUrlOptions): string | null {
  const customPhone = options?.phoneNumber?.trim();
  const targetNumber = customPhone || siteConfig.contact.whatsapp.number;

  // If using default config and WhatsApp is not configured, do not build a URL
  if (!customPhone && !siteConfig.contact.whatsapp.isConfigured) {
    return null;
  }

  if (!targetNumber || !isValidPhoneNumber(targetNumber)) {
    return null;
  }

  const sanitized = sanitizePhoneNumber(targetNumber);
  const message = options?.message?.trim();

  if (message) {
    return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
  }

  return `https://wa.me/${sanitized}`;
}

