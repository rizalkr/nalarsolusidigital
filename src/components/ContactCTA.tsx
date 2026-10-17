import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ConsultationButton } from './ConsultationButton';

export function ContactCTA() {
  return (
    <section
      aria-labelledby="contact-cta-heading"
      className="py-16 md:py-24 bg-brand-primary text-white border-b border-border"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="mb-4">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-accent-surface bg-brand-accent/20 px-3 py-1.5 rounded-full border border-brand-accent/30">
            Langkah Selanjutnya
          </span>
        </div>

        {/* Headline */}
        <h2
          id="contact-cta-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
        >
          {siteConfig.closingCta.title}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
          {siteConfig.closingCta.description}
        </p>

        {/* CTA Button opening consultation modal */}
        <div className="flex justify-center">
          <ConsultationButton className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-brand-primary bg-brand-accent hover:bg-white rounded-lg shadow-md focus-visible:outline-brand-accent transition-colors cursor-pointer">
            <span>{siteConfig.closingCta.ctaLabel}</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </ConsultationButton>
        </div>
      </div>
    </section>
  );
}

