import { siteConfig } from '@/config/site';
import { DemoCarousel } from '@/components/DemoCarousel';

export function DemoShowcase() {
  const { demoSection, demos } = siteConfig;

  return (
    <section
      id="demo"
      aria-labelledby="demo-showcase-heading"
      className="relative py-16 md:py-24 bg-background border-b border-border scroll-mt-16 md:scroll-mt-20 overflow-hidden"
    >
      {/* Anchor alias to support legacy #contoh-solusi links without modifying Hero */}
      <span
        id="contoh-solusi"
        className="absolute top-0 -mt-16 md:-mt-20 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
            {demoSection.badge}
          </span>
          <h2
            id="demo-showcase-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
          >
            {demoSection.title}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {demoSection.description}
          </p>
        </div>

        {/* Horizontal Carousel of Demo Cards with Detail Modal */}
        <DemoCarousel demos={demos} />

        {/* Informative Disclaimer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-secondary">
            Kedua contoh di atas merupakan demo interaktif untuk referensi solusi, bukan klaim proyek klien yang telah selesai dikerjakan.
          </p>
        </div>
      </div>
    </section>
  );
}
