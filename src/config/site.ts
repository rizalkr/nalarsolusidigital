export interface NavItem {
  label: string;
  href: string;
}

export interface LayananItem {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  note?: string;
  icon: string; // nama ikon lucide, dipetakan di komponen
  youtubeUrl?: string;
}

export interface PaketItem {
  id: string;
  title: string;
  audience: string;
  includes: string[];
  youtubeUrl?: string;
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

export interface CaraKerjaPrinciple {
  title: string;
  description: string;
}

export interface CaraKerjaSection {
  badge: string;
  title: string;
  description: string;
  principles: CaraKerjaPrinciple[];
  steps: WorkflowStep[];
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
  layananSection: {
    badge: string;
    title: string;
    description: string;
    tileHint: string;
    modalSelectLabel: string;
    modalSelectedLabel: string;
    modalCloseLabel: string;
    stickyBarLabel: string;
    ctaLabel: string;
    emptyCtaLabel: string;
  };
  layanan: LayananItem[];
  paketSectionTitle: string;
  paket: PaketItem[];
  demoSection: {
    badge: string;
    title: string;
    description: string;
  };
  demos: DemoItem[];
  caraKerja: CaraKerjaSection;
  faq: FaqSection;
  kontak: ContactSection;
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
    secondaryCta: 'Lihat Solusi',
  },
  navigation: [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Solusi', href: '#layanan' },
    { label: 'Demo', href: '#demo' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontak', href: '#kontak' },
  ],
  layananSection: {
    badge: 'KATALOG LAYANAN',
    title: 'Pilih Layanan yang Anda Butuhkan',
    description:
      'Klik setiap layanan untuk melihat detailnya, centang yang Anda butuhkan, lalu tekan tombol WhatsApp — daftar pilihan Anda otomatis terkirim sebagai pesan. Tanpa harga kaku: kami sampaikan setelah memahami kebutuhan Anda.',
    tileHint: 'Klik untuk detail',
    modalSelectLabel: 'Pilih layanan ini',
    modalSelectedLabel: 'Dipilih — batalkan',
    modalCloseLabel: 'Tutup',
    stickyBarLabel: '{n} layanan dipilih',
    ctaLabel: 'Tanya Lebih Lanjut via WhatsApp',
    emptyCtaLabel: 'Konsultasi Gratis',
  },
  layanan: [
    {
      id: 'gbp',
      title: 'Google Business Profile',
      description: 'Usaha Anda tampil profesional di Google Maps, mudah ditemukan pelanggan sekitar.',
      deliverables: [
        'Profil bisnis terverifikasi (nama, alamat, jam, foto)',
        'Kategori & deskripsi yang tepat sasaran',
        'Panduan mendapatkan ulasan pelanggan',
      ],
      note: 'Audit gratis: cek kondisi profil Anda saat ini, tanpa komitmen.',
      icon: 'MapPin',
      youtubeUrl: 'vLiE47OKnZY ',
    },
    {
      id: 'email-bisnis',
      title: 'Email Bisnis',
      description: 'Alamat email resmi nama@bisnisanda.com — bukan @gmail.com.',
      deliverables: [
        'Alamat sesuai nama usaha',
        'Bisa dipakai di HP, laptop, aplikasi email',
        'Alamat per fungsi (keuangan@, cs@, tender@)',
      ],
      icon: 'Mail',
      youtubeUrl: 'https://youtu.be/-Tzbblsm038',
    },
    {
      id: 'katalog-whatsapp',
      title: 'Katalog Digital + Order WhatsApp',
      description:
        'Katalog rapi yang bisa dibuka kapan saja; pesan langsung via WA — tanpa komisi marketplace.',
      deliverables: [
        'Katalog digital link tunggal',
        "Tombol 'Pesan via WhatsApp' per produk",
        'Panduan update produk sendiri',
      ],
      icon: 'ShoppingBag',
      youtubeUrl: '2Fm29l5zDcI',
    },
    {
      id: 'website-company-profile',
      title: 'Website Company Profile',
      description: 'Rumah sendiri di internet dengan domain usaha Anda.',
      deliverables: [
        'Halaman profil, layanan, galeri, kontak',
        'Rapi di HP maupun laptop',
        'Terhubung ke WhatsApp & Google Maps',
      ],
      icon: 'Globe',
      youtubeUrl: 'AB2qcn_pV3w',
    },
    {
      id: 'company-profile-pdf',
      title: 'Company Profile PDF',
      description: 'Dokumen profil siap tender, proposal & kerja sama.',
      deliverables: [
        'Desain sesuai identitas usaha',
        'Struktur lengkap: profil, layanan, pengalaman, kontak',
      ],
      icon: 'FileText',
      youtubeUrl: 'tB1vqTNtiOI',
    },
    {
      id: 'wa-business-setup',
      title: 'WhatsApp Business Setup',
      description: 'WA usaha tertata: katalog, auto-reply, multi-admin.',
      deliverables: [
        'Katalog produk di WA Business',
        'Sapaan & balasan otomatis',
        'Label chat pelanggan',
      ],
      icon: 'MessageCircle',
      youtubeUrl: 'https://youtu.be/r2r_zzHFijw',
    },
    {
      id: 'landing-page',
      title: 'Landing Page',
      description: 'Satu halaman, satu tujuan: promosi, pendaftaran, atau iklan.',
      deliverables: [
        'Pesan tajam + tombol aksi jelas',
        'Terhubung ke WA / formulir',
      ],
      icon: 'MousePointerClick',
      youtubeUrl: 'https://youtu.be/jnlX9g1mYOc',
    },
    {
      id: 'sistem-administrasi',
      title: 'Sistem Administrasi Digital',
      description: 'Sistem custom sesuai alur kerja usaha Anda.',
      deliverables: [
        'Pencatatan & alur kerja disesuaikan',
        'Bukan software jadi yang dipaksakan',
      ],
      note: 'Butuh diskusi mendalam dulu — kami kerjakan hanya jika ini memang solusi paling masuk akal.',
      icon: 'ClipboardList',
      youtubeUrl: 'myzmdNQ1Ssg'
    },
  ],
  paketSectionTitle: 'Atau pilih paket siap pakai',
  paket: [
    {
      id: 'paket-tender',
      title: 'Paket Siap Tender',
      audience: 'Kontraktor & konsultan',
      youtubeUrl: 'https://youtu.be/e-m_vhgtUeI',
      includes: [
        'Email bisnis',
        'Google Business Profile',
        'Website company profile',
        'Company profile PDF',
      ],
    },
    {
      id: 'paket-kuliner',
      title: 'Paket Kuliner Online',
      audience: 'Makanan & minuman',
      youtubeUrl: 'https://youtu.be/8QvjSUg82Ng',
      includes: [
        'Katalog digital',
        'Pemesanan via WhatsApp',
        'Google Business Profile',
      ],
    },
    {
      id: 'paket-korporat',
      title: 'Paket Kepercayaan Korporat',
      audience: 'Konveksi, manufaktur & jasa B2B',
      youtubeUrl: 'https://youtu.be/vbbjWoeaDZw',
      includes: ['Katalog digital', 'Website company profile'],
    },
  ],
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
  caraKerja: {
    badge: 'CARA KERJA',
    title: 'Dimulai dari Memahami Kebutuhan',
    description:
      'Setiap usaha memiliki kebutuhan dan tantangan yang berbeda. Karena itu, kami tidak langsung menawarkan solusi atau fitur tertentu. Kami berusaha memahami cara kerja, kendala, dan tujuan bisnis Anda terlebih dahulu agar solusi yang dipilih benar-benar relevan. Prosesnya berjalan dalam tiga langkah berikut.',
    principles: [
      {
        title: 'Pahami Kebutuhan',
        description: 'Memulai dari masalah dan tujuan usaha.',
      },
      {
        title: 'Tentukan Prioritas',
        description:
          'Utamakan hal yang benar-benar dibutuhkan, bukan menambahkan solusi yang tidak perlu.',
      },
      {
        title: 'Kerjakan Sesuai Kesepakatan',
        description:
          'Ruang lingkup dan proses pengerjaan disepakati sebelum pekerjaan dimulai.',
      },
    ],
    steps: [
      {
        step: 1,
        title: 'Konsultasi',
        description:
          'Ceritakan jenis usaha, kendala yang dihadapi, dan hal yang ingin diperbaiki.',
      },
      {
        step: 2,
        title: 'Menentukan Solusi',
        description:
          'Kami memetakan kebutuhan dan menyepakati bentuk solusi serta ruang lingkup pengerjaannya.',
      },
      {
        step: 3,
        title: 'Pengerjaan Solusi',
        description:
          'Solusi yang disepakati kami kerjakan, kemudian hasilnya ditinjau bersama Anda sebelum digunakan.',
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
  kontak: {
    badge: 'KONTAK',
    title: 'Punya Rencana untuk Bisnis Anda?',
    description:
      'Ceritakan usaha Anda — jenis usaha, kendala yang dihadapi, dan hal yang ingin diperbaiki. Kita diskusikan pendekatan yang paling sesuai sebelum menentukan langkah berikutnya, tanpa komitmen apa pun.',
    whatsappLabel: 'Chat WhatsApp',
    emailLabel: 'Kirim email',
    location: 'Klaten, Jawa Tengah — melayani konsultasi online untuk seluruh Indonesia.',
  },
  footer: {
    description:
      'Membantu usaha lokal menemukan dan mengembangkan solusi digital yang sesuai dengan kebutuhan bisnis.',
    copyrightTemplate: '© {year} Nalar Solusi Digital. Hak cipta dilindungi.',
  },
  social: {
    instagram: 'https://www.instagram.com/nalarsolusidigital/',
  },
};
