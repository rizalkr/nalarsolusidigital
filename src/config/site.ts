export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  highlights: string[];
}

export interface DemoItem {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  features: string[];
  url: string | null;
  previewImage: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  siteUrl: string;
  isSiteUrlConfigured: boolean;
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
  navigation: NavItem[];
  services: ServiceItem[];
  demos: DemoItem[];
  social: {
    instagram?: string;
    linkedin?: string;
  };
}

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || '';
const rawWhatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || '';

export const siteConfig: SiteConfig = {
  name: 'Nalar Solusi Digital',
  legalName: 'Nalar Solusi Digital',
  tagline: 'Ceritakan usaha Anda, kami bantu carikan solusi yang paling masuk akal.',
  description:
    'Nalar Solusi Digital membantu usaha lokal memiliki website yang rapi, profesional, dan mudah digunakan pelanggan.',
  siteUrl: rawSiteUrl,
  isSiteUrlConfigured: rawSiteUrl.length > 0,
  contact: {
    whatsapp: {
      number: rawWhatsappNumber,
      // Only marked as configured if an explicit non-empty environment variable is provided
      isConfigured: rawWhatsappNumber.length > 0,
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
      shortDescription:
        'Profil bisnis yang rapi dan profesional untuk membangun kepercayaan pelanggan.',
      description:
        'Menampilkan identitas usaha, keunggulan layanan, portofolio, dan kontak terverifikasi dengan struktur yang jelas dan mudah diakses dari perangkat apa pun.',
      highlights: [
        'Desain terstruktur dan mobile-friendly',
        'Navigasi ringkas dan cepat dipahami',
        'Informasi kontak dan lokasi yang mudah dihubungi',
      ],
    },
    {
      id: 'product-catalog',
      title: 'Katalog Produk atau Armada',
      shortDescription:
        'Etalase digital terorganisir untuk memamerkan penawaran bisnis secara lengkap.',
      description:
        'Katalog produk terstruktur atau daftar armada dengan spesifikasi mendalam, foto jelas, dan filter kategori tanpa memaksa keranjang belanja yang rumit jika belum diperlukan.',
      highlights: [
        'Tampilan visual jelas dan teratur',
        'Spesifikasi dan varian produk mudah ditelusuri',
        'Pencarian dan pengelompokan kategori yang intuitif',
      ],
    },
    {
      id: 'order-flow',
      title: 'Alur Pemesanan',
      shortDescription:
        'Sistem pemesanan yang disesuaikan dengan alur operasional dan kebutuhan usaha.',
      description:
        'Alur pemesanan fleksibel mulai dari formulir terstruktur yang terintegrasi dengan WhatsApp hingga mekanisme konfirmasi data sesuai kesiapan operasional bisnis Anda.',
      highlights: [
        'Formulir ringkas dengan validasi data',
        'Integrasi fleksibel ke WhatsApp atau sistem internal',
        'Mengurangi salah komunikasi rincian pesanan',
      ],
    },
  ],
  demos: [
    {
      id: 'ruang-konveksi',
      title: 'Ruang Konveksi',
      badge: 'DEMO INTERAKTIF',
      tagline: 'Katalog Produk, Simulasi Estimasi, dan Pemesanan',
      description:
        'Contoh website konveksi dengan katalog produk, informasi produksi, kalkulator estimasi harga, serta formulir pemesanan yang terhubung ke WhatsApp.',
      features: [
        'Katalog produk pakaian & seragam',
        'Kalkulator estimasi harga interaktif',
        'Formulir pemesanan terhubung ke WhatsApp',
      ],
      url: process.env.NEXT_PUBLIC_DEMO_KONVEKSI_URL?.trim() || null,
      previewImage: '/images/demos/konveksi-preview.png',
    },
    {
      id: 'rental-mobil',
      title: 'Rental Mobil',
      badge: 'DEMO INTERAKTIF',
      tagline: 'Informasi Armada, Layanan, dan Ketersediaan',
      description:
        'Contoh website untuk memperkenalkan layanan rental mobil dan menampilkan informasi armada berdasarkan fitur yang tersedia pada implementasinya.',
      features: [
        'Daftar armada beserta spesifikasi & tarif',
        'Detail paket lepas kunci & dengan pengemudi',
        'Akses cepat konsultasi ketersediaan',
      ],
      url: process.env.NEXT_PUBLIC_DEMO_RENTAL_URL?.trim() || null,
      previewImage: '/images/demos/rental-preview.png',
    },
  ],
  social: {},
};

