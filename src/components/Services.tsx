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
  Package,
  Check,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl, formatLayananPickerMessage } from '@/lib/whatsapp';
import { LayananModal } from './LayananModal';

const layananIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  gbp: MapPin,
  'email-bisnis': Mail,
  'katalog-whatsapp': ShoppingBag,
  'website-company-profile': Globe,
  'company-profile-pdf': FileText,
  'wa-business-setup': MessageCircle,
  'landing-page': MousePointerClick,
  'sistem-administrasi': ClipboardList,
  paket: Package,
};

export function Services() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const allItems = [
    ...siteConfig.layanan,
    ...siteConfig.paket,
  ];

  const activeItem = activeId ? allItems.find((item) => item.id === activeId) || null : null;

  const selectedTitles = allItems
    .filter((item) => selectedIds.has(item.id))
    .map((item) => item.title);

  const whatsappUrl = buildWhatsAppUrl({
    message: formatLayananPickerMessage(selectedTitles),
  });

  return (
    <section
      id="layanan"
      aria-labelledby="services-heading"
      className="py-16 md:py-24 pb-24 md:pb-32 bg-surface border-b border-border scroll-mt-16 md:scroll-mt-20 relative"
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
          <p className="text-xs sm:text-sm text-text-secondary/80 mt-2 font-medium">
            {siteConfig.layananSection.tileHint}
          </p>
        </div>

        {/* 8 Compact Service Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {siteConfig.layanan.map((item) => {
            const IconComponent = layananIcons[item.id] || Globe;
            const isSelected = selectedIds.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveId(item.id)}
                className={`bg-white rounded-xl border p-4 sm:p-5 text-left transition-all relative flex flex-col justify-between cursor-pointer focus-visible:outline-brand-accent ${
                  isSelected
                    ? 'border-brand-accent ring-2 ring-brand-accent/30'
                    : 'border-border hover:border-brand-accent/50 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                  </div>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                    </div>
                  ) : null}
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-brand-primary line-clamp-2">
                  {item.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Sub-judul Paket */}
        <div className="mt-12 md:mt-16 mb-6 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-brand-primary">
            {siteConfig.paketSectionTitle}
          </h3>
        </div>

        {/* 3 Compact Package Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {siteConfig.paket.map((item) => {
            const isSelected = selectedIds.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveId(item.id)}
                className={`bg-white rounded-xl border p-4 sm:p-5 text-left transition-all relative flex flex-col justify-between cursor-pointer focus-visible:outline-brand-accent ${
                  isSelected
                    ? 'border-brand-accent ring-2 ring-brand-accent/30'
                    : 'border-border hover:border-brand-accent/50 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" aria-hidden="true" />
                  </div>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                    </div>
                  ) : null}
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-brand-primary line-clamp-2">
                  {item.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* When 0 selected: empty CTA under package grid */}
        {selectedIds.size === 0 && (
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="#kontak"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-brand-primary bg-white hover:bg-surface border border-border rounded-lg shadow-xs hover:border-brand-accent/50 focus-visible:outline-brand-accent transition-colors"
            >
              <span>{siteConfig.layananSection.emptyCtaLabel}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeItem && (
        <LayananModal
          item={activeItem}
          isSelected={selectedIds.has(activeItem.id)}
          onToggleSelect={() => toggleSelection(activeItem.id)}
          onClose={() => setActiveId(null)}
          labels={{
            select: siteConfig.layananSection.modalSelectLabel,
            selected: siteConfig.layananSection.modalSelectedLabel,
            close: siteConfig.layananSection.modalCloseLabel,
          }}
        />
      )}

      {/* Sticky Bottom Bar when at least 1 item is selected */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-lg py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <span className="text-sm sm:text-base font-semibold text-brand-primary">
              {siteConfig.layananSection.stickyBarLabel.replace('{n}', String(selectedIds.size))}
            </span>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors cursor-pointer"
              >
                <span>{siteConfig.layananSection.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <Link
                href="#kontak"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors cursor-pointer"
              >
                <span>{siteConfig.layananSection.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
