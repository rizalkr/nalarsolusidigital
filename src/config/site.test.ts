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

  it('has all 6 required navigation items with proper anchor targets', () => {
    const anchors = siteConfig.navigation.map((item) => item.href);
    expect(anchors).toEqual([
      '#beranda',
      '#layanan',
      '#demo',
      '#cara-kerja',
      '#faq',
      '#kontak',
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

  it('configures layananSection, 8 concrete layanan items, and 3 paket items with unique ids and titles', () => {
    expect(siteConfig.layananSection.badge).toBe('KATALOG LAYANAN');
    expect(siteConfig.layananSection.title).toBe('Pilih Layanan yang Anda Butuhkan');
    expect(siteConfig.layananSection.stickyBarLabel).toBe('{n} layanan dipilih');
    expect(siteConfig.layananSection.ctaLabel).toBe('Tanya Lebih Lanjut via WhatsApp');
    expect(siteConfig.layananSection.emptyCtaLabel).toBe('Konsultasi Gratis');

    // 8 Layanan items
    expect(siteConfig.layanan).toHaveLength(8);
    const layananIds = siteConfig.layanan.map((l) => l.id);
    const layananTitles = siteConfig.layanan.map((l) => l.title);
    expect(new Set(layananIds).size).toBe(8);
    expect(new Set(layananTitles).size).toBe(8);

    siteConfig.layanan.forEach((l) => {
      expect(l.id).toBeTruthy();
      expect(l.title).toBeTruthy();
      expect(l.description).toBeTruthy();
      expect(l.deliverables.length).toBeGreaterThan(0);
      expect(l.icon).toBeTruthy();
    });

    // 3 Paket items
    expect(siteConfig.paketSectionTitle).toBe('Atau pilih paket siap pakai');
    expect(siteConfig.paket).toHaveLength(3);
    const paketIds = siteConfig.paket.map((p) => p.id);
    const paketTitles = siteConfig.paket.map((p) => p.title);
    expect(new Set(paketIds).size).toBe(3);
    expect(new Set(paketTitles).size).toBe(3);

    siteConfig.paket.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.audience).toBeTruthy();
      expect(p.includes.length).toBeGreaterThan(0);
    });

    // No hardcoded prices anywhere
    const fullJson = JSON.stringify({ layanan: siteConfig.layanan, paket: siteConfig.paket });
    expect(fullJson).not.toMatch(/Rp|IDR|\b\d{1,3}\.\d{3}\b/);
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

  it('configures caraKerja section with badge, title, opener, principles, and steps', () => {
    expect(siteConfig.caraKerja.badge).toBe('CARA KERJA');
    expect(siteConfig.caraKerja.title).toBe('Dimulai dari Memahami Kebutuhan');
    expect(siteConfig.caraKerja.description).toBe(
      'Setiap usaha memiliki kebutuhan dan tantangan yang berbeda. Karena itu, kami tidak langsung menawarkan solusi atau fitur tertentu. Kami berusaha memahami cara kerja, kendala, dan tujuan bisnis Anda terlebih dahulu agar solusi yang dipilih benar-benar relevan. Prosesnya berjalan dalam tiga langkah berikut.'
    );

    // 3 Principles
    expect(siteConfig.caraKerja.principles).toHaveLength(3);
    const principleTitles = siteConfig.caraKerja.principles.map((p) => p.title);
    expect(principleTitles).toEqual([
      'Pahami Kebutuhan',
      'Tentukan Prioritas',
      'Kerjakan Sesuai Kesepakatan',
    ]);

    // 3 Steps
    expect(siteConfig.caraKerja.steps).toHaveLength(3);
    expect(siteConfig.caraKerja.steps[0].title).toBe('Konsultasi');
    expect(siteConfig.caraKerja.steps[1].title).toBe('Menentukan Solusi');
    expect(siteConfig.caraKerja.steps[2].title).toBe('Pengerjaan Solusi');
  });

  it('configures closing CTA, contact email, and footer templates', () => {
    expect(siteConfig.closingCta.title).toBe('Punya Rencana untuk Bisnis Anda?');
    expect(siteConfig.closingCta.ctaLabel).toBe('Konsultasi Gratis via WhatsApp');
    expect(siteConfig.footer.description).toBe(
      'Membantu usaha lokal menemukan dan mengembangkan solusi digital yang sesuai dengan kebutuhan bisnis.'
    );
  });

  it('configures WhatsApp prefill messages with "kebutuhan digital" positioning', () => {
    expect(siteConfig.contact.whatsapp.defaultMessages.general).toContain('kebutuhan digital');
    expect(siteConfig.contact.whatsapp.defaultMessages.consultation).toContain('kebutuhan digital');
    expect(siteConfig.contact.whatsapp.defaultMessages.general).not.toContain('pembuatan website');
    expect(siteConfig.contact.whatsapp.defaultMessages.consultation).not.toContain('kebutuhan website');
    expect(siteConfig.contact.whatsapp.defaultMessages.emailBisnis).toBeDefined();
  });

  it('configures faq section with 6 accordion questions', () => {
    expect(siteConfig.faq.badge).toBe('FAQ');
    expect(siteConfig.faq.title).toBe('Pertanyaan yang Sering Ditanyakan');
    expect(siteConfig.faq.items).toHaveLength(6);
    expect(siteConfig.faq.items[0].question).toBe('Apakah setiap usaha butuh website?');
    expect(siteConfig.faq.items[5].question).toBe('Apakah melayani di luar Klaten?');
  });

  it('configures contactSection with WhatsApp, Email, and Klaten location', () => {
    expect(siteConfig.contactSection.badge).toBe('KONTAK');
    expect(siteConfig.contactSection.title).toBe('Mulai Percakapan');
    expect(siteConfig.contactSection.location).toContain('Klaten');
    expect(siteConfig.contactSection.whatsappLabel).toBe('Chat WhatsApp');
    expect(siteConfig.contactSection.emailLabel).toBe('Kirim email');
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
