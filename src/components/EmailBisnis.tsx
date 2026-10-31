import Link from 'next/link';
import { ArrowRight, Mail, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function EmailBisnis() {
  const { emailBusiness } = siteConfig;
  const whatsappUrl = buildWhatsAppUrl({
    message: siteConfig.contact.whatsapp.defaultMessages.emailBisnis,
  });

  return (
    <section
      id="email-bisnis"
      aria-labelledby="email-bisnis-heading"
      className="py-16 md:py-24 bg-background border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
            {emailBusiness.badge}
          </span>
          <h2
            id="email-bisnis-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
          >
            {emailBusiness.title}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {emailBusiness.lead}
          </p>
        </div>

        {/* 2-Column Asymmetric Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 3 Core Benefits */}
          <div className="lg:col-span-7 space-y-4">
            {emailBusiness.benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="bg-surface rounded-xl border border-border p-6 sm:p-7 flex gap-4 sm:gap-5 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center shrink-0 font-bold text-sm">
                  0{benefit.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-primary mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Notice Card (LPSE/SPSE angle) & CTA */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Tender / LPSE Notice Card */}
            <div className="bg-surface rounded-xl border-l-4 border-l-brand-accent border-t border-r border-b border-border p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-3 text-brand-primary">
                <AlertCircle className="w-5 h-5 text-brand-accent-strong shrink-0" aria-hidden="true" />
                <span className="font-bold text-sm sm:text-base">
                  {emailBusiness.importantNotice.label}
                </span>
              </div>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {emailBusiness.importantNotice.description}
              </p>
            </div>

            {/* Assistance Summary & WhatsApp Action */}
            <div className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-sm sm:text-base text-text-primary font-medium leading-relaxed">
                  {emailBusiness.closingText}
                </p>
              </div>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors cursor-pointer"
                  aria-label={`${emailBusiness.ctaLabel} via WhatsApp (membuka di tab baru)`}
                >
                  <span>{emailBusiness.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 text-brand-accent" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  href="#kontak"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
                >
                  <span>{emailBusiness.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 text-brand-accent" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

