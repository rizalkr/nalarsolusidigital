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

export interface EmailBusinessBenefit {
  id: number;
  title: string;
  description: string;
}

export interface EmailBusinessSection {
  badge: string;
  title: string;
  lead: string;
  benefits: EmailBusinessBenefit[];
  importantNotice: {
    label: string;
    description: string;
  };
  closingText: string;
  ctaLabel: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSection {
  badge: string;
  title: string;
  items: FaqItem[];
}

export interface ContactSection {
  badge: string;
  title: string;
  description: string;
  whatsappLabel: string;
  emailLabel: string;
  location: string;
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
        emailBisnis: string;
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
  servicesSection: {
    badge: string;
    title: string;
    description: string;
  };
  services: ServiceItem[];
  emailBusiness: EmailBusinessSection;
  demoSection: {
    badge: string;
    title: string;
    description: string;
  };
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
  faq: FaqSection;
  closingCta: {
    title: string;
    description: string;
    ctaLabel: string;
  };
  contactSection: ContactSection;
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
          'Halo Nalar Solusi Digital, saya ingin konsultasi mengenai kebutuhan digital untuk usaha saya.',
        consultation:
          'Halo Nalar Solusi Digital, saya ingin mendiskusikan kebutuhan digital usaha saya.',
        emailBisnis:
          'Halo Nalar Solusi Digital, saya ingin tanya tentang email bisnis untuk usaha saya.',
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
    headline: 'Setiap Usaha Punya Kebutuhan yang Berbeda.',
    description:
      'Kami membantu usaha lokal menemukan dan mengembangkan solusi digital yang sesuai dengan kebutuhan bisnis, mulai dari website, katalog online, email bisnis, hingga sistem administrasi.',
    tagline: 'Ceritakan usaha Anda, kami bantu carikan solusi yang paling masuk akal.',
    primaryCta: 'Konsultasi Gratis',
    secondaryCta: 'Lihat Demo',
  },
  navigation: [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Solusi', href: '#layanan' },
    { label: 'Demo', href: '#demo' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Pendekatan', href: '#tentang' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontak', href: '#kontak' },
  ],
  servicesSection: {
    badge: 'AREA SOLUSI',
    title: 'Solusi Digital Sesuai Kebutuhan Usaha Anda',
    description:
      'Mulai dari memperkuat kehadiran online hingga merapikan proses operasional, kami membantu usaha Anda menemukan dan mengembangkan solusi digital yang relevan. Bentuk dan cakupan pengerjaannya disesuaikan dengan kebutuhan bisnis Anda.',
  },
  services: [
    {
      id: 'kehadiran-digital',
      title: 'Kehadiran Digital',
      description:
        'Membantu usaha membangun identitas dan memperkenalkan bisnisnya secara profesional melalui kanal digital.',
      capabilities: [
        'Website profil perusahaan.',
        'Landing page untuk layanan atau produk.',
        'Informasi bisnis, layanan, lokasi, dan kontak.',
      ],
    },
    {
      id: 'informasi-produk-layanan',
      title: 'Informasi Produk dan Layanan',
      description:
        'Membantu pelanggan menemukan, memahami, dan membandingkan produk atau layanan usaha dengan lebih mudah.',
      capabilities: [
        'Katalog produk atau armada.',
        'Galeri gambar dan informasi spesifikasi.',
        'Penyajian daftar layanan secara terstruktur.',
      ],
    },
    {
      id: 'proses-pemesanan-administrasi',
      title: 'Proses Pemesanan dan Administrasi',
      description:
        'Membantu menyederhanakan proses bisnis yang masih dilakukan secara manual atau kurang terstruktur.',
      capabilities: [
        'Formulir permintaan atau pemesanan.',
        'Pengumpulan informasi pelanggan secara terstruktur.',
        'Sistem administrasi berbasis web sesuai kebutuhan.',
      ],
    },
    {
      id: 'identitas-infrastruktur-digital',
      title: 'Identitas dan Infrastruktur Digital',
      description:
        'Membantu usaha membangun identitas digital dan menjaga infrastruktur online agar sesuai dengan kebutuhan bisnis.',
      capabilities: [
        'Email dengan domain perusahaan.',
        'Penggunaan dan pengaturan domain bisnis.',
        'Migrasi website ke HTTPS.',
      ],
    },
  ],
  emailBusiness: {
    badge: 'EMAIL BISNIS',
    title: 'Email Bisnis: Kecil, Tapi Sering Jadi Penentu',
    lead:
      'Alamat email adalah hal pertama yang dilihat calon pelanggan dan mitra dari bisnis Anda. Email dengan domain perusahaan sendiri memberi tiga hal sekaligus:',
    benefits: [
      {
        id: 1,
        title: 'Kredibilitas instan.',
        description:
          'nama@usahaanda.com terlihat jauh lebih serius daripada usahaanda123@gmail.com — terutama di mata pelanggan baru dan mitra korporat.',
      },
      {
        id: 2,
        title: 'Aset yang tinggal.',
        description:
          'Email tetap milik usaha meski karyawan berganti. Tidak ada lagi kontak pelanggan yang ikut pergi bersama mantan admin.',
      },
      {
        id: 3,
        title: 'Alamat per fungsi.',
        description:
          'Pisahkan urusan dengan rapi: cs@ untuk layanan pelanggan, order@ untuk pemesanan, keuangan@ untuk administrasi.',
      },
    ],
    importantNotice: {
      label: 'Penting untuk diketahui:',
      description:
        'usaha yang mengikuti pengadaan barang/jasa pemerintah (LPSE/SPSE) wajib menggunakan email resmi perusahaan sebagai syarat administrasi. Tanpa email domain sendiri, proses pendaftaran bisa terhenti sebelum mulai.',
    },
    closingText:
      'Kami bantu menyiapkan email bisnis Anda dari nol — domain, pengaturan, sampai siap dipakai.',
    ctaLabel: 'Tanya tentang email bisnis',
  },
  demoSection: {
    badge: 'DEMO INTERAKTIF',
    title: 'Jelajahi Demo Interaktif',
    description:
      'Lihat bagaimana kebutuhan bisnis diterjemahkan menjadi pengalaman digital, mulai dari katalog produk hingga layanan rental.',
  },
  demos: [
    {
      id: 'ruang-konveksi',
      name: 'Ruang Konveksi',
      title: 'Website Katalog untuk Konveksi',
      badge: 'DEMO INTERAKTIF',
      tagline: 'Katalog Produk, Simulasi Estimasi, dan Pemesanan',
      description:
        'Contoh website untuk menampilkan katalog produk, informasi produksi, dan kalkulator estimasi harga.',
      features: [
        'Katalog produk',
        'Galeri produk',
        'Informasi produksi',
        'Kalkulator estimasi harga',
        'Formulir pemesanan',
      ],
      ctaLabel: 'Buka Demo Interaktif',
      url: process.env.NEXT_PUBLIC_DEMO_KONVEKSI_URL?.trim() || null,
      previewImage: '/images/demos/konveksi-preview.png',
    },
    {
      id: 'rental-mobil',
      name: 'Rental Mobil',
      title: 'Website Profil Rental Mobil',
      badge: 'DEMO INTERAKTIF',
      tagline: 'Informasi Armada, Layanan, dan Ketersediaan',
      description:
        'Contoh website untuk menampilkan armada, layanan rental, dan informasi kendaraan.',
      features: [
        'Informasi armada',
        'Detail kendaraan',
        'Layanan rental',
      ],
      ctaLabel: 'Buka Demo Interaktif',
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
        description: 'Kami memetakan kebutuhan dan menyepakati bentuk solusi serta ruang lingkup pengerjaannya.',
      },
      {
        step: 3,
        title: 'Pengerjaan Solusi',
        description: 'Solusi yang disepakati kami kerjakan, kemudian hasilnya ditinjau bersama Anda sebelum digunakan.',
      },
    ],
  },
  approach: {
    title: 'Tidak Semua Usaha Membutuhkan Solusi yang Sama',
    description:
      'Setiap usaha memiliki kebutuhan dan tantangan yang berbeda. Karena itu, kami tidak langsung menawarkan solusi atau fitur tertentu. Kami berusaha memahami cara kerja, kendala, dan tujuan bisnis Anda terlebih dahulu agar solusi yang dipilih benar-benar relevan.',
    principles: [
      {
        title: 'Pahami Kebutuhan',
        description: 'Memulai dari masalah dan tujuan usaha.',
      },
      {
        title: 'Tentukan Prioritas',
        description: 'Utamakan hal yang benar-benar dibutuhkan, bukan menambahkan solusi yang tidak perlu.',
      },
      {
        title: 'Kerjakan Sesuai Kesepakatan',
        description: 'Ruang lingkup dan proses pengerjaan disepakati sebelum pekerjaan dimulai.',
      },
    ],
  },
  faq: {
    badge: 'FAQ',
    title: 'Pertanyaan yang Sering Ditanyakan',
    items: [
      {
        id: 'faq-1',
        question: 'Apakah setiap usaha butuh website?',
        answer:
          'Tidak. Itulah kenapa kami selalu mulai dari memahami kebutuhan Anda dulu. Kadang yang paling masuk akal adalah katalog digital, kadang merapikan administrasi, kadang memang website. Kami akan bilang terus terang kalau usaha Anda belum membutuhkannya.',
      },
      {
        id: 'faq-2',
        question: 'Bagaimana biayanya ditentukan?',
        answer:
          'Setelah diskusi kebutuhan. Tidak ada paket harga kaku — ruang lingkup dan estimasi kami susun berdasarkan apa yang benar-benar Anda butuhkan, lalu disepakati bersama sebelum pengerjaan dimulai.',
      },
      {
        id: 'faq-3',
        question: 'Berapa lama pengerjaannya?',
        answer:
          'Tergantung ruang lingkupnya. Estimasi waktu kami sampaikan di awal, setelah kebutuhan dipetakan — dan menjadi bagian dari kesepakatan sebelum kami mulai.',
      },
      {
        id: 'faq-4',
        question: 'Apa yang perlu saya siapkan?',
        answer:
          'Cukup cerita tentang usaha Anda dan kendalanya. Jika ada materi seperti logo atau foto produk, itu membantu — tapi kalaupun belum ada, kami pandu langkahnya.',
      },
      {
        id: 'faq-5',
        question: 'Apakah bisa dikerjakan bertahap?',
        answer:
          'Bisa. Justru itu yang sering paling masuk akal: mulai dari kebutuhan paling mendesak (misalnya katalog digital), kembangkan ke tahap berikutnya setelahnya.',
      },
      {
        id: 'faq-6',
        question: 'Apakah melayani di luar Klaten?',
        answer:
          'Kami berbasis di Klaten, Jawa Tengah, dan melayani konsultasi secara online untuk seluruh Indonesia.',
      },
    ],
  },
  closingCta: {
    title: 'Punya Rencana untuk Bisnis Anda?',
    description:
      'Ceritakan kebutuhan dan kendala yang sedang Anda hadapi. Kita diskusikan pendekatan yang paling sesuai sebelum menentukan langkah berikutnya.',
    ctaLabel: 'Konsultasi Gratis via WhatsApp',
  },
  contactSection: {
    badge: 'KONTAK',
    title: 'Mulai Percakapan',
    description:
      'Ceritakan usaha Anda — jenis usaha, kendala yang dihadapi, dan hal yang ingin diperbaiki. Kami akan merespons dan mendiskusikan pendekatan yang paling masuk akal untuk kebutuhan Anda, tanpa komitmen apa pun.',
    whatsappLabel: 'Chat WhatsApp',
    emailLabel: 'Kirim email',
    location: 'Klaten, Jawa Tengah — melayani konsultasi online untuk seluruh Indonesia.',
  },
  footer: {
    description:
      'Membantu usaha lokal menemukan dan mengembangkan solusi digital yang sesuai dengan kebutuhan bisnis.',
    copyrightTemplate: '© {year} Nalar Solusi Digital. Hak cipta dilindungi.',
  },
  social: {},
};
