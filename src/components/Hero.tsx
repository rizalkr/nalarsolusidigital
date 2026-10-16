import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const whatsappUrl = buildWhatsAppUrl({
    message: siteConfig.contact.whatsapp.defaultMessages.consultation,
  });

  const [demoKonveksi, demoRental] = siteConfig.demos;

  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-background pt-8 pb-16 md:pt-14 md:pb-24 border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Eyebrow, Headline, Description, Tagline, CTAs */}
          <div className="lg:col-span-7 flex flex-col text-left">
            {/* Eyebrow */}
            <div className="mb-4">
              <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20">
                {siteConfig.hero.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-primary tracking-tight leading-tight sm:leading-tight mb-5">
              {siteConfig.hero.headline}
            </h1>

            {/* Description (PRD 8.2 verbatim) */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-6">
              {siteConfig.hero.description}
            </p>

            {/* Mandatory Tagline: Placed after description and before CTAs */}
            <div className="border-l-4 border-brand-accent pl-4 py-2 mb-8 bg-surface rounded-r-lg">
              <p className="text-sm sm:text-base font-semibold text-brand-primary italic">
                &ldquo;{siteConfig.hero.tagline}&rdquo;
              </p>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
                >
                  {siteConfig.hero.primaryCta}
                </a>
              ) : siteConfig.contact.email ? (
                <a
                  href={`mailto:${siteConfig.contact.email}?subject=Konsultasi%20Website%20-%20Nalar%20Solusi%20Digital`}
                  title={`Kirim email ke ${siteConfig.contact.email}`}
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
                >
                  {siteConfig.hero.primaryCta}
                </a>
              ) : (
                <a
                  href="#tentang"
                  title="Saluran konsultasi WhatsApp sedang dipersiapkan"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
                >
                  {siteConfig.hero.primaryCta}
                </a>
              )}

              <Link
                href="#contoh-solusi"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-brand-primary bg-surface hover:bg-border/60 border border-border rounded-lg focus-visible:outline-brand-accent transition-colors group"
              >
                <span>{siteConfig.hero.secondaryCta}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Preview cards for Ruang Konveksi and Rental Mobil */}
          <div className="lg:col-span-5 w-full">
            <div className="relative mx-auto max-w-lg lg:max-w-none flex flex-col gap-4">
              {/* Card 1: Ruang Konveksi Preview */}
              {demoKonveksi && (
                <div className="relative bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md hover:z-10 transition-all">
                  <div className="p-3 sm:p-4 bg-surface border-b border-border flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-accent-strong bg-accent-surface px-2 py-0.5 rounded border border-brand-accent/20 mr-2">
                        {demoKonveksi.badge}
                      </span>
                      <span className="text-sm font-bold text-brand-primary">
                        {demoKonveksi.name}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary hidden sm:inline">
                      Katalog & Estimasi
                    </span>
                  </div>
                  <div className="relative aspect-[16/10] w-full bg-surface">
                    <Image
                      src={demoKonveksi.previewImage}
                      alt={`Preview ${demoKonveksi.name}`}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 400px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Card 2: Rental Mobil Preview */}
              {demoRental && (
                <div className="relative bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md hover:z-10 transition-all sm:-mt-2 lg:-mt-3">
                  <div className="p-3 sm:p-4 bg-surface border-b border-border flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-accent-strong bg-accent-surface px-2 py-0.5 rounded border border-brand-accent/20 mr-2">
                        {demoRental.badge}
                      </span>
                      <span className="text-sm font-bold text-brand-primary">
                        {demoRental.name}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary hidden sm:inline">
                      Profil & Armada
                    </span>
                  </div>
                  <div className="relative aspect-[16/10] w-full bg-surface">
                    <Image
                      src={demoRental.previewImage}
                      alt={`Preview ${demoRental.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 400px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

