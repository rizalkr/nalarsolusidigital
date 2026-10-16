import { describe, it, expect } from 'vitest';
import { siteConfig } from './site';

describe('siteConfig', () => {
  it('has the correct brand name', () => {
    expect(siteConfig.name).toBe('Nalar Solusi Digital');
  });

  it('contains the mandatory tagline verbatim', () => {
    expect(siteConfig.tagline).toBe(
      'Ceritakan usaha Anda, kami bantu carikan solusi yang paling masuk akal.'
    );
  });

  it('has all 5 required navigation items with proper anchor targets', () => {
    const anchors = siteConfig.navigation.map((item) => item.href);
    expect(anchors).toEqual([
      '#beranda',
      '#layanan',
      '#contoh-solusi',
      '#cara-kerja',
      '#tentang',
    ]);
  });

  it('configures 3 core services according to PRD', () => {
    expect(siteConfig.services).toHaveLength(3);
    const serviceIds = siteConfig.services.map((s) => s.id);
    expect(serviceIds).toContain('company-profile');
    expect(serviceIds).toContain('product-catalog');
    expect(serviceIds).toContain('order-flow');
  });

  it('configures 2 interactive demos marked with DEMO INTERAKTIF', () => {
    expect(siteConfig.demos).toHaveLength(2);
    siteConfig.demos.forEach((demo) => {
      expect(demo.badge).toBe('DEMO INTERAKTIF');
    });
    const demoIds = siteConfig.demos.map((d) => d.id);
    expect(demoIds).toEqual(['ruang-konveksi', 'rental-mobil']);
  });

  it('does not invent a production domain when NEXT_PUBLIC_SITE_URL is unset', () => {
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      expect(siteConfig.siteUrl).toBe('');
      expect(siteConfig.isSiteUrlConfigured).toBe(false);
    }
  });

  it('marks WhatsApp as unconfigured when no phone number is provided in env', () => {
    if (!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
      expect(siteConfig.contact.whatsapp.number).toBe('');
      expect(siteConfig.contact.whatsapp.isConfigured).toBe(false);
    }
  });
});

