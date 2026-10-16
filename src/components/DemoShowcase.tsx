import { siteConfig } from '@/config/site';
import { DemoDeck } from '@/components/DemoDeck';

export function DemoShowcase() {
  return (
    <section
      id="contoh-solusi"
      aria-labelledby="demo-showcase-heading"
      className="py-16 md:py-24 bg-background border-b border-border scroll-mt-16 md:scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
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

        {/* Interactive Shuffle Deck (Playing Cards Stacking) */}
        <DemoDeck demos={siteConfig.demos} />

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
