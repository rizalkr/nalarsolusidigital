import { siteConfig } from '@/config/site';

/**
 * Sanitizes phone number string by removing spaces, dashes, parentheses, and leading plus sign.
 * Converts local Indonesian prefixes (08xx, 8xx, or +62 08xx) to international format (628xx).
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  const digitsOnly = phone.replace(/\D/g, '');

  // Handle +62 (08xx) pattern where non-digits removal leaves 6208...
  if (digitsOnly.startsWith('6208')) {
    return '62' + digitsOnly.slice(3);
  }

  // Handle local 08xx pattern
  if (digitsOnly.startsWith('08')) {
    return '62' + digitsOnly.slice(1);
  }

  // Handle shorthand 8xx pattern without leading 0
  if (digitsOnly.startsWith('8')) {
    return '62' + digitsOnly;
  }

  return digitsOnly;
}

/**
 * Validates whether a phone number is plausible and not a placeholder/fictitious value.
 * Validates:
 * - Proper length (10 to 15 digits)
 * - Rejects un-normalized numbers starting with 0 (e.g. landline area codes 021, 022)
 * - Rejects all-identical digits (0000000000, 1111111111, etc.)
 * - Rejects subscriber numbers with all identical digits (e.g. 628888888888)
 * - Rejects simple sequential runs (1234567890)
 * - Rejects dummy placeholders with 6+ consecutive zeros
 * - For Indonesian numbers (62...), enforces mobile prefix 628 and valid length (11-14 digits)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  const sanitized = sanitizePhoneNumber(phone);

  if (sanitized.length < 10 || sanitized.length > 15) {
    return false;
  }

  // Reject local numbers still starting with 0 (e.g. 021 landlines)
  if (sanitized.startsWith('0')) {
    return false;
  }

  // Reject all identical digits in the full string
  if (/^(\d)\1+$/.test(sanitized)) {
    return false;
  }

  // Reject simple sequential ascending or descending sequences
  if (
    '0123456789012345'.includes(sanitized) ||
    '9876543210987654'.includes(sanitized)
  ) {
    return false;
  }

  // Reject placeholder numbers ending with 6 or more trailing zeros
  if (/0{6,}$/.test(sanitized)) {
    return false;
  }

  // Check the subscriber number part
  const subscriberNumber = sanitized.startsWith('628')
    ? sanitized.slice(3)
    : sanitized.startsWith('62')
    ? sanitized.slice(2)
    : sanitized;

  // Reject if the subscriber number is all identical digits (e.g. 628888888888)
  if (/^(\d)\1+$/.test(subscriberNumber)) {
    return false;
  }

  // Enforce Indonesian mobile WhatsApp requirements
  if (sanitized.startsWith('62')) {
    if (!sanitized.startsWith('628')) {
      return false;
    }
    return sanitized.length >= 11 && sanitized.length <= 14;
  }

  return true;
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
 * or if an explicitly provided phone number is invalid/empty, this function returns `null`.
 * It will NEVER generate a wa.me URL pointing to a fictitious or unconfigured number.
 */
export function buildWhatsAppUrl(options?: BuildWhatsAppUrlOptions): string | null {
  const hasCustomPhone = options !== undefined && 'phoneNumber' in options;
  const targetNumber = hasCustomPhone
    ? options.phoneNumber?.trim() || ''
    : siteConfig.contact.whatsapp.number;

  // If using default config and WhatsApp is not configured, do not build a URL
  if (!hasCustomPhone && !siteConfig.contact.whatsapp.isConfigured) {
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
