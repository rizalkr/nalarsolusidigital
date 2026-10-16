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

  it('contains the mandatory hero copywriting per latest specifications', () => {
    expect(siteConfig.hero.eyebrow).toBe('SOLUSI DIGITAL UNTUK USAHA LOKAL');
    expect(siteConfig.hero.headline).toBe(
      'Setiap Usaha Punya Kebutuhan yang Berbeda.'
    );
    expect(siteConfig.hero.description).toBe(
      'Kami membantu usaha lokal menemukan dan mengembangkan solusi digital yang sesuai dengan kebutuhan bisnis, mulai dari website, katalog online, email bisnis, hingga sistem administrasi.'
    );
    expect(siteConfig.hero.tagline).toBe(siteConfig.tagline);
    expect(siteConfig.hero.primaryCta).toBe('Konsultasi Gratis');
    expect(siteConfig.hero.secondaryCta).toBe('Lihat Demo');
  });

  it('has all 5 required navigation items with proper anchor targets', () => {
    const anchors = siteConfig.navigation.map((item) => item.href);
    expect(anchors).toEqual([
      '#beranda',
      '#layanan',
      '#demo',
      '#cara-kerja',
      '#tentang',
    ]);
  });

  it('configures demoSection metadata with latest copywriting specifications', () => {
    expect(siteConfig.demoSection.badge).toBe('DEMO INTERAKTIF');
    expect(siteConfig.demoSection.title).toBe('Jelajahi Demo Interaktif');
    expect(siteConfig.demoSection.description).toBe(
      'Lihat bagaimana kebutuhan bisnis diterjemahkan menjadi pengalaman digital, mulai dari katalog produk hingga layanan rental.'
    );
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

  it('configures servicesSection and 4 solution areas', () => {
    expect(siteConfig.servicesSection.badge).toBe('AREA SOLUSI');
    expect(siteConfig.servicesSection.title).toBe('Solusi Digital Sesuai Kebutuhan Usaha Anda');
    expect(siteConfig.servicesSection.description).toContain(
      'Mulai dari memperkuat kehadiran online hingga merapikan proses operasional'
    );

    expect(siteConfig.services).toHaveLength(4);
    const serviceMap = Object.fromEntries(
      siteConfig.services.map((s) => [s.id, s])
    );

    expect(serviceMap['kehadiran-digital']).toBeDefined();
    expect(serviceMap['kehadiran-digital'].title).toBe('Kehadiran Digital');
    expect(serviceMap['kehadiran-digital'].description).toBe(
      'Membantu usaha membangun identitas dan memperkenalkan bisnisnya secara profesional melalui kanal digital.'
    );
    expect(serviceMap['kehadiran-digital'].capabilities).toContain('Website profil perusahaan.');

    expect(serviceMap['informasi-produk-layanan']).toBeDefined();
    expect(serviceMap['informasi-produk-layanan'].title).toBe('Informasi Produk dan Layanan');
    expect(serviceMap['informasi-produk-layanan'].description).toBe(
      'Membantu pelanggan menemukan, memahami, dan membandingkan produk atau layanan usaha dengan lebih mudah.'
    );
    expect(serviceMap['informasi-produk-layanan'].capabilities).toContain('Katalog produk atau armada.');

    expect(serviceMap['proses-pemesanan-administrasi']).toBeDefined();
    expect(serviceMap['proses-pemesanan-administrasi'].title).toBe('Proses Pemesanan dan Administrasi');
    expect(serviceMap['proses-pemesanan-administrasi'].description).toBe(
      'Membantu menyederhanakan proses bisnis yang masih dilakukan secara manual atau kurang terstruktur.'
    );
    expect(serviceMap['proses-pemesanan-administrasi'].capabilities).toContain('Formulir permintaan atau pemesanan.');

    expect(serviceMap['identitas-infrastruktur-digital']).toBeDefined();
    expect(serviceMap['identitas-infrastruktur-digital'].title).toBe('Identitas dan Infrastruktur Digital');
    expect(serviceMap['identitas-infrastruktur-digital'].description).toBe(
      'Membantu usaha membangun identitas digital dan menjaga infrastruktur online agar sesuai dengan kebutuhan bisnis.'
    );
    expect(serviceMap['identitas-infrastruktur-digital'].capabilities).toContain('Email dengan domain perusahaan.');
  });

  it('configures 2 interactive demos with proper badges and CTA labels', () => {
    expect(siteConfig.demos).toHaveLength(2);
    const demoMap = Object.fromEntries(siteConfig.demos.map((d) => [d.id, d]));

    const konveksi = demoMap['ruang-konveksi'];
    expect(konveksi).toBeDefined();
    expect(konveksi.badge).toBe('DEMO INTERAKTIF');
    expect(konveksi.title).toBe('Website Katalog untuk Konveksi');
    expect(konveksi.ctaLabel).toBe('Buka Demo Interaktif');
    expect(konveksi.features).toContain('Kalkulator estimasi harga');
    expect(konveksi.features).toContain('Formulir pemesanan');

    const rental = demoMap['rental-mobil'];
    expect(rental).toBeDefined();
    expect(rental.badge).toBe('DEMO INTERAKTIF');
    expect(rental.title).toBe('Website Profil Rental Mobil');
    expect(rental.ctaLabel).toBe('Buka Demo Interaktif');
    expect(rental.features).toContain('Informasi armada');
    expect(rental.features).toContain('Layanan rental');
  });

  it('configures 3 steps for Cara Kerja per updated copywriting', () => {
    expect(siteConfig.howItWorks.steps).toHaveLength(3);
    expect(siteConfig.howItWorks.steps[0].title).toBe('Konsultasi');
    expect(siteConfig.howItWorks.steps[0].description).toBe(
      'Ceritakan jenis usaha, kendala yang dihadapi, dan hal yang ingin diperbaiki.'
    );
    expect(siteConfig.howItWorks.steps[1].title).toBe('Menentukan Solusi');
    expect(siteConfig.howItWorks.steps[1].description).toBe(
      'Kami memetakan kebutuhan dan menyepakati bentuk solusi serta ruang lingkup pengerjaannya.'
    );
    expect(siteConfig.howItWorks.steps[2].title).toBe('Pengerjaan Solusi');
    expect(siteConfig.howItWorks.steps[2].description).toBe(
      'Solusi yang disepakati kami kerjakan, kemudian hasilnya ditinjau bersama Anda sebelum digunakan.'
    );
  });

  it('configures 3 guiding principles for Pendekatan Nalar per latest specifications', () => {
    expect(siteConfig.approach.principles).toHaveLength(3);
    const titles = siteConfig.approach.principles.map((p) => p.title);
    expect(titles).toEqual([
      'Pahami Kebutuhan',
      'Tentukan Prioritas',
      'Kerjakan Sesuai Kesepakatan',
    ]);
  });

  it('configures closing CTA, contact email, and footer templates', () => {
    expect(siteConfig.closingCta.title).toBe('Punya Rencana untuk Bisnis Anda?');
    expect(siteConfig.closingCta.ctaLabel).toBe('Konsultasi Gratis via WhatsApp');
    expect(siteConfig.contact.email).toBe('nalarsolusidigital@gmail.com');
    expect(siteConfig.footer.description).toBe(
      'Membantu usaha lokal menemukan dan mengembangkan solusi digital yang sesuai dengan kebutuhan bisnis.'
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
