'use client';

import { useEffect, useRef } from 'react';
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
  X,
} from 'lucide-react';
import type { LayananItem, PaketItem } from '@/config/site';
import { getYouTubeEmbedUrl } from '@/lib/youtube';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  Mail,
  ShoppingBag,
  Globe,
  FileText,
  MessageCircle,
  MousePointerClick,
  ClipboardList,
  Package,
};

export interface LayananModalProps {
  item: LayananItem | PaketItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onClose: () => void;
  labels: {
    select: string;
    selected: string;
    close: string;
  };
}

export function LayananModal({
  item,
  isSelected,
  onToggleSelect,
  onClose,
  labels,
}: LayananModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isLayanan = 'deliverables' in item;
  const youtubeEmbedUrl = getYouTubeEmbedUrl(item.youtubeUrl);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const IconComponent = isLayanan ? iconMap[item.icon] || Package : Package;

  return (
    <div
      className="fixed inset-0 z-50 p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
      data-testid="layanan-modal"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
        data-testid="layanan-modal-backdrop"
      />

      {/* Dialog Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="layanan-modal-title"
        className="relative w-full max-w-lg max-h-[90vh] my-auto bg-white rounded-2xl shadow-2xl border border-border z-10 flex flex-col overflow-hidden"
      >
        {/* Top Media: YouTube Video Embed OR Fallback Icon Header */}
        {youtubeEmbedUrl ? (
          <div
            className="relative w-full aspect-video shrink-0 bg-black"
            data-testid="layanan-modal-video"
          >
            <iframe
              src={youtubeEmbedUrl}
              title={`${item.title} video`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-white/90 hover:text-white bg-black/60 hover:bg-black/80 p-2 rounded-full backdrop-blur-xs focus-visible:outline-white transition-colors cursor-pointer z-10"
              aria-label={labels.close}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4 p-6 sm:p-8 pb-0 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center shrink-0">
              <IconComponent className="w-6 h-6" aria-hidden="true" />
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg focus-visible:outline-brand-accent transition-colors cursor-pointer"
              aria-label={labels.close}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div
          className={`flex-1 overflow-y-auto px-6 sm:px-8 ${
            youtubeEmbedUrl ? 'pt-6 pb-6' : 'pt-4 pb-6'
          }`}
        >
          {/* Title */}
          <h2
            id="layanan-modal-title"
            className="text-xl sm:text-2xl font-bold text-brand-primary mb-2"
          >
            {item.title}
          </h2>

          {/* Content depending on item type */}
          {isLayanan ? (
            <>
              <p className="text-sm sm:text-base text-text-secondary mb-6 leading-relaxed">
                {item.description}
              </p>

              <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                  Anda dapat:
                </span>
                <ul className="space-y-2.5">
                  {item.deliverables.map((deliv, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-text-primary"
                    >
                      <Check
                        className="w-4 h-4 text-brand-accent shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {item.note ? (
                <p className="text-xs text-text-secondary bg-surface p-3 rounded-lg border border-border mb-6 leading-relaxed">
                  {item.note}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-sm text-text-secondary mb-4">
                <span className="font-semibold text-text-primary">Untuk:</span>{' '}
                {item.audience}
              </p>

              <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                  Termasuk:
                </span>
                <ul className="space-y-2.5">
                  {item.includes.map((inc, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-text-primary"
                    >
                      <Check
                        className="w-4 h-4 text-brand-accent shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer actions */}
        <div className="shrink-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 p-4 sm:px-8 sm:py-4 bg-white border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg focus-visible:outline-brand-accent transition-colors cursor-pointer text-center"
          >
            {labels.close}
          </button>
          <button
            type="button"
            onClick={() => {
              onToggleSelect();
              onClose();
            }}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg shadow-xs focus-visible:outline-brand-accent transition-colors cursor-pointer text-center ${
              isSelected
                ? 'bg-surface text-brand-primary border border-border hover:bg-border/40'
                : 'bg-brand-primary text-white hover:bg-brand-primary/90'
            }`}
          >
            {isSelected ? labels.selected : labels.select}
          </button>
        </div>
      </div>
    </div>
  );
}
