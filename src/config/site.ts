export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  capabilities: string[];
  highlights?: string[];
}

export interface DemoItem {
  id: string;
  name: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  features: string[];
  ctaLabel: string;
  url: string | null;
  previewImage: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface PrincipleItem {
  title: string;
  description: string;
}

export interface LogoItem {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  siteUrl: string;
  isSiteUrlConfigured: boolean;
  logo: {
    landscape: LogoItem;
    portrait: LogoItem;
  };
  contact: {
    whatsapp: {
      number: string;
      isConfigured: boolean;
      defaultMessages: {
        general: string;
        consultation: string;
        konveksi: string;
        rental: string;
      };
    };
    email: string | null;
  };
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    tagline: string;
    primaryCta: string;
    secondaryCta: string;
  };
  navigation: NavItem[];
  services: ServiceItem[];
  demos: DemoItem[];
  howItWorks: {
    title: string;
    description: string;
    steps: WorkflowStep[];
  };
  approach: {
    title: string;
    description: string;
    principles: PrincipleItem[];
  };
  closingCta: {
    title: string;
    description: string;
    ctaLabel: string;
  };
  footer: {
    description: string;
    copyrightTemplate: string;
  };
  social: {
    instagram?: string;
    linkedin?: string;
  };
}

export function parseSiteUrl(raw: string | undefined): { url: string; isConfigured: boolean } {
  if (!raw || !raw.trim()) {
    return { url: '', isConfigured: false };
  }
  const trimmed = raw.trim();
  if (/^(placeholder|todo|unset|none|false)$/i.test(trimmed)) {
    return { url: '', isConfigured: false };
  }
  try {
    const withProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    return { url: parsed.origin, isConfigured: true };
  } catch {
    return { url: '', isConfigured: false };
  }
}

export function parseWhatsappConfig(raw: string | undefined): { number: string; isConfigured: boolean } {
  if (!raw || !raw.trim()) {
    return { number: '', isConfigured: false };
  }
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  const isDummy =
    /^(placeholder|todo|unset|none|false)$/i.test(trimmed) ||
    /^(\d)\1+$/.test(digits) ||
    /0{6,}$/.test(digits) ||
    digits.length < 10 ||
    digits.length > 15;

  if (isDummy) {
    return { number: trimmed, isConfigured: false };
  }

  return { number: trimmed, isConfigured: true };
}

const siteUrlConfig = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const whatsappConfig = parseWhatsappConfig(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

export const siteConfig: SiteConfig = {
  name: 'Nalar Solusi Digital',
  legalName: 'Nalar Solusi Digital',
  tagline: 'Ceritakan usaha Anda, kami bantu carikan solusi yang paling masuk akal.',
  description:
    'Nalar Solusi Digital membantu usaha lokal memiliki website yang rapi, profesional, dan mudah digunakan pelanggan.',
  siteUrl: siteUrlConfig.url,
  isSiteUrlConfigured: siteUrlConfig.isConfigured,
  logo: {
    landscape: {
      src: '/images/logo-landscape.png',
      width: 2034,
      height: 719,
      alt: 'Nalar Solusi Digital',
    },
    portrait: {
      src: '/images/logo-portrait.png',
      width: 1199,
      height: 1479,
      alt: 'Nalar Solusi Digital',
    },
  },
  contact: {
    whatsapp: {
      number: whatsappConfig.number,
      isConfigured: whatsappConfig.isConfigured,
      defaultMessages: {
        general:
          'Halo Nalar Solusi Digital, saya ingin konsultasi mengenai pembuatan website untuk usaha saya.',
        consultation:
          'Halo Nalar Solusi Digital, saya ingin mendiskusikan kebutuhan website usaha saya.',
        konveksi:
          'Halo Nalar Solusi Digital, saya tertarik dengan contoh solusi Ruang Konveksi.',
        rental:
          'Halo Nalar Solusi Digital, saya tertarik dengan contoh solusi Rental Mobil.',
      },
    },
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  },
  hero: {
    eyebrow: 'SOLUSI DIGITAL UNTUK USAHA LOKAL',
    headline: 'Website yang Rapi, Profesional, dan Mudah Dipakai Pelanggan.',
    description:
      'Nalar membantu usaha lokal membangun website company profile, katalog produk atau armada online, dan alur pemesanan yang disesuaikan dengan kebutuhan bisnis.',
    tagline: 'Ceritakan usaha Anda, kami bantu carikan solusi yang paling masuk akal.',
    primaryCta: 'Konsultasi Gratis',
    secondaryCta: 'Lihat Contoh Solusi',
  },
  navigation: [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Contoh Solusi', href: '#contoh-solusi' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Tentang', href: '#tentang' },
  ],
  services: [
    {
      id: 'company-profile',
      title: 'Website Company Profile',
      description:
        'Perkenalkan bisnis dan layanan Anda melalui website yang profesional, informatif, dan mudah diakses pelanggan.',
      shortDescription:
        'Profil bisnis yang rapi dan profesional untuk membangun kepercayaan pelanggan.',
      capabilities: [
        'Profil bisnis',
        'Daftar layanan',
        'Informasi kontak',
        'Informasi lokasi jika tersedia',
        'CTA konsultasi atau kontak',
      ],
      highlights: [
        'Profil bisnis',
        'Daftar layanan',
        'Informasi kontak',
        'Informasi lokasi jika tersedia',
        'CTA konsultasi atau kontak',
      ],
    },
    {
      id: 'product-catalog',
      title: 'Katalog Produk atau Armada',
      description:
        'Tampilkan produk atau armada secara online agar pelanggan lebih mudah melihat pilihan dan memperoleh informasi yang dibutuhkan.',
      shortDescription:
        'Etalase digital terorganisir untuk memamerkan penawaran bisnis secara lengkap.',
      capabilities: [
        'Katalog produk',
        'Katalog kendaraan',
        'Galeri gambar',
        'Detail informasi',
        'Navigasi menuju proses pemesanan',
      ],
      highlights: [
        'Katalog produk',
        'Katalog kendaraan',
        'Galeri gambar',
        'Detail informasi',
        'Navigasi menuju proses pemesanan',
      ],
    },
    {
      id: 'order-flow',
      title: 'Alur Pemesanan',
      description:
        'Bantu pelanggan melakukan pemesanan melalui proses yang lebih jelas dan sesuai dengan cara kerja bisnis Anda.',
      shortDescription:
        'Sistem pemesanan yang disesuaikan dengan alur operasional dan kebutuhan usaha.',
      capabilities: [
        'Formulir permintaan',
        'Pemilihan produk atau layanan',
        'Pengumpulan detail pesanan',
        'Ringkasan pesanan',
        'Integrasi dengan kanal komunikasi atau proses bisnis yang relevan',
      ],
      highlights: [
        'Formulir permintaan',
        'Pemilihan produk atau layanan',
        'Pengumpulan detail pesanan',
        'Ringkasan pesanan',
        'Integrasi dengan kanal komunikasi atau proses bisnis yang relevan',
      ],
    },
  ],
  demos: [
    {
      id: 'ruang-konveksi',
      name: 'Ruang Konveksi',
      title: 'Website Katalog untuk Konveksi',
      badge: 'DEMO INTERAKTIF',
      tagline: 'Katalog Produk, Simulasi Estimasi, dan Pemesanan',
      description:
        'Contoh website yang menampilkan kategori produk, informasi produksi, kalkulator estimasi harga, dan alur pemesanan.',
      features: [
        'Katalog kategori produk',
        'Galeri produk',
        'Informasi produksi',
        'Kalkulator estimasi harga',
        'Formulir pesanan yang terhubung ke WhatsApp',
      ],
      ctaLabel: 'Lihat Demo Konveksi',
      url: process.env.NEXT_PUBLIC_DEMO_KONVEKSI_URL?.trim() || null,
      previewImage: '/images/demos/konveksi-preview.png',
    },
    {
      id: 'rental-mobil',
      name: 'Rental Mobil',
      title: 'Website Profil dan Katalog Rental Mobil',
      badge: 'DEMO INTERAKTIF',
      tagline: 'Informasi Armada, Layanan, dan Ketersediaan',
      description:
        'Contoh website untuk memperkenalkan layanan rental mobil, menampilkan informasi armada, dan membantu calon pelanggan menemukan informasi yang diperlukan.',
      features: [
        'Daftar armada beserta spesifikasi & tarif',
        'Detail paket lepas kunci & dengan pengemudi',
        'Akses cepat konsultasi ketersediaan',
      ],
      ctaLabel: 'Lihat Demo Rental Mobil',
      url: process.env.NEXT_PUBLIC_DEMO_RENTAL_URL?.trim() || null,
      previewImage: '/images/demos/rental-preview.png',
    },
  ],
  howItWorks: {
    title: 'Dimulai dari Memahami Kebutuhan',
    description:
      'Kami ingin solusi yang dibangun benar-benar sesuai dengan kebutuhan usaha Anda. Karena itu, prosesnya dimulai dengan percakapan sebelum masuk ke pengerjaan.',
    steps: [
      {
        step: 1,
        title: 'Konsultasi',
        description: 'Ceritakan jenis usaha, kendala yang dihadapi, dan hal yang ingin diperbaiki.',
      },
      {
        step: 2,
        title: 'Menentukan Solusi',
        description: 'Kami membantu memetakan kebutuhan dan menyepakati fitur serta ruang lingkup pengerjaan yang relevan.',
      },
      {
        step: 3,
        title: 'Pengembangan',
        description: 'Website dikembangkan sesuai kesepakatan, kemudian ditinjau sebelum dipublikasikan.',
      },
    ],
  },
  approach: {
    title: 'Tidak Semua Usaha Membutuhkan Solusi yang Sama',
    description:
      'Ada bisnis yang hanya membutuhkan website profil. Ada yang memerlukan katalog produk. Ada pula yang membutuhkan alur pemesanan yang lebih terstruktur. Kami tidak ingin langsung menawarkan fitur yang rumit. Kami ingin memahami cara kerja usaha Anda terlebih dahulu, kemudian membantu menentukan solusi yang sesuai.',
    principles: [
      {
        title: 'Pahami Kebutuhan',
        description: 'Memulai dari masalah dan tujuan usaha.',
      },
      {
        title: 'Tentukan Prioritas',
        description: 'Memilih fitur yang relevan, bukan sekadar menambahkan sebanyak mungkin fitur.',
      },
      {
        title: 'Bangun Sesuai Kesepakatan',
        description: 'Menjelaskan ruang lingkup dan proses pengerjaan sebelum pengembangan.',
      },
    ],
  },
  closingCta: {
    title: 'Punya Rencana untuk Bisnis Anda?',
    description:
      'Ceritakan kebutuhan dan kendala yang sedang Anda hadapi. Kita diskusikan pendekatan yang paling sesuai sebelum menentukan langkah berikutnya.',
    ctaLabel: 'Konsultasi Gratis via WhatsApp',
  },
  footer: {
    description:
      'Membantu usaha lokal memiliki website yang profesional dan sesuai kebutuhan bisnis.',
    copyrightTemplate: '© {year} Nalar Solusi Digital. Hak cipta dilindungi.',
  },
  social: {},
};
