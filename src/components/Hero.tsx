import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { ArrowRight } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import { ConsultationButton } from './ConsultationButton';

export function Hero() {

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
              <ConsultationButton className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors cursor-pointer">
                {siteConfig.hero.primaryCta}
              </ConsultationButton>

              <Link
                href="#contoh-solusi"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-brand-primary bg-surface hover:bg-border/60 border border-border rounded-lg focus-visible:outline-brand-accent transition-colors group"
              >
                <span>{siteConfig.hero.secondaryCta}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Conceptual digital ecosystem visual */}
          <div className="lg:col-span-5 w-full">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
