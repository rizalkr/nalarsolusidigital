'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, ExternalLink, Check } from 'lucide-react';
import type { DemoItem } from '@/config/site';

export interface DemoModalProps {
  demo: DemoItem | null;
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function DemoModal({ demo, isOpen, onClose, triggerRef }: DemoModalProps) {
  const modalPanelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Handle close and restore focus to trigger button
  const handleClose = useCallback(() => {
    onClose();
    // Use requestAnimationFrame to restore focus after modal unmount/render
    requestAnimationFrame(() => {
      triggerRef?.current?.focus();
    });
  }, [onClose, triggerRef]);

  // Lock body scroll and set up Escape key handler and initial focus
  useEffect(() => {
    if (!isOpen || !demo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button initially for keyboard users
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }

      // Basic focus trap within modal
      if (e.key === 'Tab' && modalPanelRef.current) {
        const focusable = modalPanelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, demo, handleClose]);

  if (!isOpen || !demo) {
    return null;
  }

  return (
    <div
      role="presentation"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-primary/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={modalPanelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        aria-describedby="demo-modal-description"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-border shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-surface/50">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-accent-strong bg-accent-surface px-2.5 py-0.5 rounded border border-brand-accent/20">
              {demo.badge}
            </span>
            <span className="text-sm font-bold text-brand-primary">
              {demo.name}
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Tutup detail demo"
            className="p-2 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface border border-transparent hover:border-border transition-colors focus-visible:outline-brand-accent"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Title and Description */}
          <div>
            <h3
              id="demo-modal-title"
              className="text-xl sm:text-2xl font-bold text-brand-primary tracking-tight mb-2"
            >
              {demo.title}
            </h3>
            <p
              id="demo-modal-description"
              className="text-sm sm:text-base text-text-secondary leading-relaxed"
            >
              {demo.description}
            </p>
          </div>

          {/* Large Screenshot Preview */}
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-border bg-surface shadow-sm">
            <Image
              src={demo.previewImage}
              alt={`Tampilan website ${demo.name}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover object-top"
            />
          </div>

          {/* Actual Implemented Features */}
          <div className="bg-surface/60 rounded-xl border border-border/80 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-3">
              Fitur Utama yang Tersedia:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" aria-label={`Fitur utama ${demo.name}`}>
              {demo.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-xs sm:text-sm text-text-primary">
                  <Check className="w-4 h-4 text-brand-accent-strong mt-0.5 mr-2 shrink-0" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 sm:p-6 border-t border-border bg-surface/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-xs text-text-secondary">
            Demo interaktif ini dapat dicoba langsung di browser Anda.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-brand-primary bg-white hover:bg-surface border border-border rounded-lg transition-colors focus-visible:outline-brand-accent"
            >
              Tutup
            </button>

            {demo.url ? (
              <a
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm transition-colors focus-visible:outline-brand-accent"
              >
                <span>{demo.ctaLabel || 'Buka Demo Interaktif'}</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                aria-label={`${demo.ctaLabel || 'Buka Demo Interaktif'} - Segera Hadir`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg cursor-not-allowed opacity-80"
              >
                <span>{demo.ctaLabel || 'Buka Demo Interaktif'}</span>
                <span className="text-[11px] bg-white border border-border px-1.5 py-0.5 rounded text-text-secondary font-medium">
                  Segera Hadir
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

