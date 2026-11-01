'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Mail,
  ShoppingBag,
  Globe,
  FileText,
  MessageCircle,
  MousePointerClick,
  ClipboardList,
  Check,
  Package,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl, formatLayananPickerMessage } from '@/lib/whatsapp';

const layananIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  gbp: MapPin,
  'email-bisnis': Mail,
  'katalog-whatsapp': ShoppingBag,
  'website-company-profile': Globe,
  'company-profile-pdf': FileText,
  'wa-business-setup': MessageCircle,
  'landing-page': MousePointerClick,
  'sistem-administrasi': ClipboardList,
};

export function Services() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allDisplayItems = [
    ...siteConfig.layanan.map((l) => ({ id: l.id, title: l.title })),
    ...siteConfig.paket.map((p) => ({ id: p.id, title: p.title })),
  ];

  const selectedTitles = allDisplayItems
    .filter((item) => selectedIds.has(item.id))
    .map((item) => item.title);

  const whatsappUrl = buildWhatsAppUrl({
    message: formatLayananPickerMessage(selectedTitles),
  });

  return (
    <section
      id="layanan"
      aria-labelledby="services-heading"
      className="py-16 md:py-24 pb-24 bg-surface border-b border-border scroll-mt-16 md:scroll-mt-20 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
            {siteConfig.layananSection.badge}
          </span>
          <h2
            id="services-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
          >
            {siteConfig.layananSection.title}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {siteConfig.layananSection.description}
          </p>
        </div>

        {/* 8 Specific Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.layanan.map((item) => {
            const IconComponent = layananIcons[item.id] || Globe;
            const isSelected = selectedIds.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleSelection(item.id)}
                className={`bg-white rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all text-left cursor-pointer focus-visible:outline-brand-accent ${
                  isSelected
                    ? 'border-2 border-brand-accent ring-2 ring-brand-accent/30'
                    : 'border border-border'
                }`}
              >
                <div>
                  {/* Card Top: Icon & Selected Badge */}
                  <div className="flex items-start justify-between gap-2 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center shrink-0">
                      <IconComponent className="w-6 h-6" aria-hidden="true" />
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-surface text-brand-accent-strong border border-brand-accent/30">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Dipilih</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-brand-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Deliverables */}
                  <div className="border-t border-border pt-4">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                      Anda dapat:
                    </span>
                    <ul className="space-y-2.5" aria-label={`Deliverables ${item.title}`}>
                      {item.deliverables.map((deliv, idx) => (
                        <li key={idx} className="flex items-start text-xs sm:text-sm text-text-primary">
                          <Check className="w-4 h-4 text-brand-accent-strong mt-0.5 mr-2 shrink-0" aria-hidden="true" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Optional Note */}
                  {item.note && (
                    <p className="mt-4 text-xs text-text-secondary italic bg-surface rounded-lg p-2.5 border border-border/70">
                      {item.note}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Package Section Subtitle */}
        <div className="mt-16 md:mt-20 mb-8 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-brand-primary tracking-tight">
            {siteConfig.paketSectionTitle}
          </h3>
        </div>

        {/* 3 Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.paket.map((item) => {
            const isSelected = selectedIds.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleSelection(item.id)}
                className={`bg-white rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all text-left cursor-pointer focus-visible:outline-brand-accent ${
                  isSelected
                    ? 'border-2 border-brand-accent ring-2 ring-brand-accent/30'
                    : 'border border-border'
                }`}
              >
                <div>
                  {/* Card Top: Icon & Selected Badge */}
                  <div className="flex items-start justify-between gap-2 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6" aria-hidden="true" />
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-surface text-brand-accent-strong border border-brand-accent/30">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Dipilih</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Audience */}
                  <h3 className="text-lg font-bold text-brand-primary mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                    Cocok untuk: <span className="font-medium text-text-primary">{item.audience}</span>
                  </p>

                  {/* Includes */}
                  <div className="border-t border-border pt-4">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                      Termasuk:
                    </span>
                    <ul className="space-y-2.5" aria-label={`Termasuk dalam ${item.title}`}>
                      {item.includes.map((inc, idx) => (
                        <li key={idx} className="flex items-start text-xs sm:text-sm text-text-primary">
                          <Check className="w-4 h-4 text-brand-accent-strong mt-0.5 mr-2 shrink-0" aria-hidden="true" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty State CTA (Shown when 0 items selected) */}
        {selectedIds.size === 0 && (
          <div className="mt-12 text-center">
            <Link
              href="#kontak"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
            >
              <span>{siteConfig.layananSection.emptyCtaLabel}</span>
              <ArrowRight className="w-4 h-4 text-brand-accent" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar (Active when >= 1 item selected) */}
      {selectedIds.size > 0 && (
        <div
          role="region"
          aria-label="Layanan terpilih"
          className="fixed bottom-0 inset-x-0 z-40 bg-brand-primary text-white border-t border-brand-accent/30 py-4 px-4 sm:px-6 lg:px-8 shadow-lg backdrop-blur-md bg-opacity-95"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" aria-hidden="true" />
              <span className="text-sm sm:text-base font-semibold">
                {siteConfig.layananSection.stickyBarLabel.replace('{n}', String(selectedIds.size))}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-brand-primary bg-brand-accent hover:bg-white rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors cursor-pointer"
                >
                  <span>{siteConfig.layananSection.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  href="#kontak"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-brand-primary bg-brand-accent hover:bg-white rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
                >
                  <span>{siteConfig.layananSection.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
