import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl({
    message: siteConfig.contact.whatsapp.defaultMessages.consultation,
  });

  // Filter out top-level home anchor matching Navbar behavior
  const footerNavLinks = siteConfig.navigation.filter((item) => item.href !== '#beranda');

  // Format dynamic copyright notice from configured template
  const copyrightText = siteConfig.footer.copyrightTemplate.replace(
    '{year}',
    String(currentYear)
  );

  return (
    <footer className="bg-surface border-t border-border text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            {/* Logo on clean white container to prevent white JPEG clipping */}
            <Link
              href="#beranda"
              className="inline-flex items-center p-2 bg-white rounded-lg border border-border shadow-xs focus-visible:outline-brand-accent transition-transform hover:scale-[1.02]"
              aria-label="Nalar Solusi Digital - Kembali ke Beranda"
            >
              <Image
                src={siteConfig.logo.landscape.src}
                alt={siteConfig.logo.landscape.alt}
                width={siteConfig.logo.landscape.width}
                height={siteConfig.logo.landscape.height}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-sm leading-relaxed">
              {siteConfig.footer.description}
            </p>
          </div>

          {/* Navigation Column */}
          <nav aria-label="Navigasi Footer">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-primary mb-4">
              Navigasi
            </p>
            <ul className="space-y-2.5">
              {footerNavLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-brand-accent-strong focus-visible:outline-brand-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Channels Column */}
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-primary mb-4">
              Kontak
            </p>
            <ul className="space-y-2.5">
              {whatsappUrl ? (
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-brand-accent-strong focus-visible:outline-brand-accent transition-colors"
                  >
                    Konsultasi via WhatsApp
                  </a>
                </li>
              ) : null}

              {siteConfig.contact.email ? (
                <li>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm text-text-secondary hover:text-brand-accent-strong focus-visible:outline-brand-accent transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </li>
              ) : null}

              {!whatsappUrl && !siteConfig.contact.email ? (
                <li>
                  <span className="text-sm text-text-secondary italic">
                    Saluran kontak sedang dipersiapkan
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Dynamic Copyright Year and Tagline */}
        <div className="border-t border-border mt-10 md:mt-12 pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary gap-3">
          <p>{copyrightText}</p>
          <p className="text-text-secondary/80 text-center sm:text-right">
            {siteConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
