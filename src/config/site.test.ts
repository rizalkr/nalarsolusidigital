import { describe, it, expect } from 'vitest';
import { siteConfig, parseSiteUrl, parseWhatsappConfig } from './site';

describe('siteConfig', () => {
  it('has the correct brand name', () => {
    expect(siteConfig.name).toBe('Nalar Solusi Digital');
  });

  it('contains the mandatory tagline verbatim', () => {
    expect(siteConfig.tagline).toBe(
      'Ceritakan usaha Anda, kami bantu carikan solusi yang paling masuk akal.'
    );
  });

  it('contains the mandatory hero copywriting per PRD Section 8.2', () => {
    expect(siteConfig.hero.eyebrow).toBe('SOLUSI DIGITAL UNTUK USAHA LOKAL');
    expect(siteConfig.hero.headline).toBe(
      'Website yang Rapi, Profesional, dan Mudah Dipakai Pelanggan.'
    );
    expect(siteConfig.hero.description).toBe(
      'Nalar membantu usaha lokal membangun website company profile, katalog produk atau armada online, dan alur pemesanan yang disesuaikan dengan kebutuhan bisnis.'
    );
    expect(siteConfig.hero.tagline).toBe(siteConfig.tagline);
    expect(siteConfig.hero.primaryCta).toBe('Konsultasi Gratis');
    expect(siteConfig.hero.secondaryCta).toBe('Lihat Contoh Solusi');
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

  it('configures both landscape and portrait logo assets with metadata', () => {
    expect(siteConfig.logo.landscape.src).toBe('/images/logo-landscape.png');
    expect(siteConfig.logo.landscape.width).toBe(2034);
    expect(siteConfig.logo.landscape.height).toBe(719);
    expect(siteConfig.logo.landscape.alt).toBe('Nalar Solusi Digital');

    expect(siteConfig.logo.portrait.src).toBe('/images/logo-portrait.png');
    expect(siteConfig.logo.portrait.width).toBe(1199);
    expect(siteConfig.logo.portrait.height).toBe(1479);
    expect(siteConfig.logo.portrait.alt).toBe('Nalar Solusi Digital');
  });

  it('configures 3 core services with PRD verbatim descriptions', () => {
    expect(siteConfig.services).toHaveLength(3);
    const serviceMap = Object.fromEntries(
      siteConfig.services.map((s) => [s.id, s])
    );

    expect(serviceMap['company-profile']).toBeDefined();
    expect(serviceMap['company-profile'].description).toBe(
      'Perkenalkan bisnis dan layanan Anda melalui website yang profesional, informatif, dan mudah diakses pelanggan.'
    );
    expect(serviceMap['company-profile'].capabilities).toContain('Profil bisnis');
    expect(serviceMap['company-profile'].capabilities).toContain('Daftar layanan');

    expect(serviceMap['product-catalog']).toBeDefined();
    expect(serviceMap['product-catalog'].description).toBe(
      'Tampilkan produk atau armada secara online agar pelanggan lebih mudah melihat pilihan dan memperoleh informasi yang dibutuhkan.'
    );
    expect(serviceMap['product-catalog'].capabilities).toContain('Katalog produk');

    expect(serviceMap['order-flow']).toBeDefined();
    expect(serviceMap['order-flow'].description).toBe(
      'Bantu pelanggan melakukan pemesanan melalui proses yang lebih jelas dan sesuai dengan cara kerja bisnis Anda.'
    );
    expect(serviceMap['order-flow'].capabilities).toContain('Formulir permintaan');
  });

  it('configures 2 interactive demos with proper badges and CTA labels', () => {
    expect(siteConfig.demos).toHaveLength(2);
    const demoMap = Object.fromEntries(siteConfig.demos.map((d) => [d.id, d]));

    const konveksi = demoMap['ruang-konveksi'];
    expect(konveksi).toBeDefined();
    expect(konveksi.badge).toBe('DEMO INTERAKTIF');
    expect(konveksi.title).toBe('Website Katalog untuk Konveksi');
    expect(konveksi.ctaLabel).toBe('Lihat Demo Konveksi');
    expect(konveksi.features).toContain('Kalkulator estimasi harga');

    const rental = demoMap['rental-mobil'];
    expect(rental).toBeDefined();
    expect(rental.badge).toBe('DEMO INTERAKTIF');
    expect(rental.title).toBe('Website Profil dan Katalog Rental Mobil');
    expect(rental.ctaLabel).toBe('Lihat Demo Rental Mobil');
  });

  it('configures 3 steps for Cara Kerja per PRD Section 8.5', () => {
    expect(siteConfig.howItWorks.steps).toHaveLength(3);
    expect(siteConfig.howItWorks.steps[0].title).toBe('Konsultasi');
    expect(siteConfig.howItWorks.steps[1].title).toBe('Menentukan Solusi');
    expect(siteConfig.howItWorks.steps[2].title).toBe('Pengembangan');
  });

  it('configures 3 guiding principles for Pendekatan Nalar per PRD Section 8.6', () => {
    expect(siteConfig.approach.principles).toHaveLength(3);
    const titles = siteConfig.approach.principles.map((p) => p.title);
    expect(titles).toEqual([
      'Pahami Kebutuhan',
      'Tentukan Prioritas',
      'Bangun Sesuai Kesepakatan',
    ]);
  });

  it('configures closing CTA and footer templates per PRD', () => {
    expect(siteConfig.closingCta.title).toBe('Punya Rencana untuk Bisnis Anda?');
    expect(siteConfig.closingCta.ctaLabel).toBe('Konsultasi Gratis via WhatsApp');
    expect(siteConfig.footer.description).toBe(
      'Membantu usaha lokal memiliki website yang profesional dan sesuai kebutuhan bisnis.'
    );
  });
});

describe('parseSiteUrl helper', () => {
  it('handles empty or unset inputs safely', () => {
    expect(parseSiteUrl(undefined)).toEqual({ url: '', isConfigured: false });
    expect(parseSiteUrl('')).toEqual({ url: '', isConfigured: false });
    expect(parseSiteUrl('   ')).toEqual({ url: '', isConfigured: false });
  });

  it('rejects dummy placeholders', () => {
    expect(parseSiteUrl('placeholder')).toEqual({ url: '', isConfigured: false });
    expect(parseSiteUrl('TODO')).toEqual({ url: '', isConfigured: false });
    expect(parseSiteUrl('none')).toEqual({ url: '', isConfigured: false });
  });

  it('normalizes bare domain names to https protocol', () => {
    expect(parseSiteUrl('nalarsolusidigital.com')).toEqual({
      url: 'https://nalarsolusidigital.com',
      isConfigured: true,
    });
  });

  it('preserves existing https protocol', () => {
    expect(parseSiteUrl('https://example.com/some/path')).toEqual({
      url: 'https://example.com',
      isConfigured: true,
    });
  });
});

describe('parseWhatsappConfig helper', () => {
  it('handles unset or empty inputs safely', () => {
    expect(parseWhatsappConfig(undefined)).toEqual({
      number: '',
      isConfigured: false,
    });
    expect(parseWhatsappConfig('')).toEqual({
      number: '',
      isConfigured: false,
    });
  });

  it('rejects placeholders and dummy repetitive numbers', () => {
    expect(parseWhatsappConfig('placeholder')).toEqual({
      number: 'placeholder',
      isConfigured: false,
    });
    expect(parseWhatsappConfig('0000000000')).toEqual({
      number: '0000000000',
      isConfigured: false,
    });
    expect(parseWhatsappConfig('6281200000000')).toEqual({
      number: '6281200000000',
      isConfigured: false,
    });
  });

  it('accepts valid phone numbers', () => {
    const valid = parseWhatsappConfig('081234567890');
    expect(valid.isConfigured).toBe(true);
    expect(valid.number).toBe('081234567890');
  });
});
