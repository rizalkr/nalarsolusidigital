import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { MobileNav } from './MobileNav';

export function Navbar() {
  const whatsappUrl = buildWhatsAppUrl({
    message: siteConfig.contact.whatsapp.defaultMessages.consultation,
  });

  // PRD 8.1 specifies navigation anchors: Layanan, Contoh Solusi, Cara Kerja, Tentang.
  // Logo points to #beranda (top section).
  const navItems = siteConfig.navigation.filter((item) => item.href !== '#beranda');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo linking to top / #beranda */}
          <Link
            href="#beranda"
            className="flex items-center gap-2 focus-visible:outline-brand-accent rounded-lg"
            aria-label="Nalar Solusi Digital - Kembali ke Beranda"
          >
            <Image
              src={siteConfig.logo.landscape.src}
              alt={siteConfig.logo.landscape.alt}
              width={siteConfig.logo.landscape.width}
              height={siteConfig.logo.landscape.height}
              priority
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
            aria-label="Navigasi Utama"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-text-primary hover:text-brand-accent-strong focus-visible:outline-brand-accent rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Consultation CTA */}
          <div className="hidden md:flex items-center">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
              >
                Konsultasi Gratis
              </a>
            ) : siteConfig.contact.email ? (
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Konsultasi%20Website%20-%20Nalar%20Solusi%20Digital`}
                title={`Kirim email ke ${siteConfig.contact.email}`}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
              >
                Konsultasi Gratis
              </a>
            ) : (
              <a
                href="#tentang"
                title="Saluran konsultasi WhatsApp sedang dipersiapkan"
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
              >
                Konsultasi Gratis
              </a>
            )}
          </div>

          {/* Mobile Navigation Drawer Trigger */}
          <MobileNav
            items={navItems}
            whatsappUrl={whatsappUrl}
            email={siteConfig.contact.email}
            ctaLabel="Konsultasi Gratis"
          />
        </div>
      </div>
    </header>
  );
}

