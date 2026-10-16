import Image from 'next/image';
import { ExternalLink, Check } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function DemoShowcase() {
  return (
    <section
      id="contoh-solusi"
      aria-labelledby="demo-showcase-heading"
      className="py-16 md:py-24 bg-background border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
            Contoh Solusi
          </span>
          <h2
            id="demo-showcase-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
          >
            Lihat Contoh Solusi Digital
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            Setiap usaha memiliki kebutuhan yang berbeda. Berikut dua contoh implementasi yang dapat menjadi gambaran bagaimana website bisa disesuaikan dengan kebutuhan bisnis.
          </p>
        </div>

        {/* 2 Demo Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {siteConfig.demos.map((demo) => (
            <article
              key={demo.id}
              className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              {/* Card Image / Preview */}
              <div className="relative aspect-[16/10] w-full bg-surface border-b border-border">
                <Image
                  src={demo.previewImage}
                  alt={`Tampilan antarmuka ${demo.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-primary bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md border border-border shadow-sm">
                    {demo.badge}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-brand-accent-strong uppercase tracking-wider">
                      {demo.name}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-brand-primary mt-1">
                      {demo.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
                    {demo.description}
                  </p>

                  {/* Feature Highlights from PRD */}
                  <div className="border-t border-border pt-4 mb-6">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                      Fitur Implementasi:
                    </span>
                    <ul className="space-y-2" aria-label={`Fitur ${demo.name}`}>
                      {demo.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-text-primary">
                          <Check className="w-4 h-4 text-brand-accent-strong mt-0.5 mr-2 shrink-0" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Action: external link when valid URL exists, graceful fallback otherwise */}
                <div className="pt-4 border-t border-border">
                  {demo.url ? (
                    <a
                      href={demo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
                    >
                      <span>{demo.ctaLabel}</span>
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        aria-label={`${demo.ctaLabel} - Segera Hadir`}
                        className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg cursor-not-allowed opacity-80 max-w-full"
                      >
                        <span>{demo.ctaLabel}</span>
                        <span className="text-[11px] bg-white border border-border px-1.5 py-0.5 rounded text-text-secondary font-medium">
                          Segera Hadir
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Informative Note: Not completed client projects (PRD 8.4) */}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-secondary">
            Kedua contoh di atas merupakan demo interaktif untuk referensi solusi, bukan klaim proyek klien yang telah selesai dikerjakan.
          </p>
        </div>
      </div>
    </section>
  );
}

