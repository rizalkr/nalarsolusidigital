'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, ArrowRight, AlertCircle } from 'lucide-react';
import { consultationModalStore } from '@/lib/consultationModalStore';
import {
  formatConsultationMessage,
  buildWhatsAppUrl,
  type ConsultationFormData,
} from '@/lib/whatsapp';

export const CONSULTATION_CATEGORIES = [
  'Kehadiran Digital',
  'Informasi Produk dan Layanan',
  'Proses Pemesanan dan Administrasi',
  'Identitas dan Infrastruktur Digital',
  'Lainnya',
] as const;

export interface ConsultationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function ConsultationModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  triggerRef: controlledTriggerRef,
}: ConsultationModalProps) {
  const [mounted, setMounted] = useState(false);

  // Store-backed state when props are not controlled
  const storeIsOpen = useSyncExternalStore(
    consultationModalStore.subscribe,
    consultationModalStore.getIsOpen,
    () => false
  );

  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : storeIsOpen;

  // Form field state
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [needs, setNeeds] = useState('');

  // Field errors
  const [errors, setErrors] = useState<{
    name?: string;
    category?: string;
    needs?: string;
  }>({});

  // WhatsApp unavailable alert state
  const [channelUnavailableError, setChannelUnavailableError] = useState<string | null>(null);

  // Element refs
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    if (controlledOnClose) {
      controlledOnClose();
      if (controlledTriggerRef?.current) {
        requestAnimationFrame(() => {
          controlledTriggerRef.current?.focus();
        });
      }
    } else {
      consultationModalStore.close();
    }
  }, [controlledOnClose, controlledTriggerRef]);

  // Handle escape key, focus trap, and body scroll lock
  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first input (Name) on modal open for quick accessibility
    const focusTimer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      // Focus trap within modal
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
      clearTimeout(focusTimer);
    };
  }, [isModalOpen, handleClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setChannelUnavailableError(null);

    const newErrors: { name?: string; category?: string; needs?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!category.trim()) {
      newErrors.category = 'Pilih salah satu kategori kebutuhan';
    }

    if (!needs.trim()) {
      newErrors.needs = 'Ceritakan kebutuhan atau kendala usaha Anda';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Focus first erroneous field
      if (newErrors.name) {
        nameInputRef.current?.focus();
      } else if (newErrors.category) {
        const catSelect = dialogRef.current?.querySelector<HTMLSelectElement>('#consultation-category');
        catSelect?.focus();
      } else if (newErrors.needs) {
        const needsTextarea = dialogRef.current?.querySelector<HTMLTextAreaElement>('#consultation-needs');
        needsTextarea?.focus();
      }
      return;
    }

    setErrors({});

    const formData: ConsultationFormData = {
      name,
      businessName,
      category,
      needs,
    };

    const formattedMessage = formatConsultationMessage(formData);
    const whatsappUrl = buildWhatsAppUrl({ message: formattedMessage });

    if (!whatsappUrl) {
      // Configuration missing or invalid
      setChannelUnavailableError(
        'Saluran konsultasi WhatsApp sedang tidak tersedia saat ini. Silakan coba kembali nanti atau hubungi kami melalui saluran kontak lain.'
      );
      return;
    }

    // Open WhatsApp with pre-filled message draft
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isModalOpen || !mounted) {
    return null;
  }

  const modalContent = (
    <div
      role="presentation"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-primary/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
        aria-describedby="consultation-modal-description"
        className="relative w-full max-w-xl bg-white rounded-2xl border border-border shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-border bg-surface/50">
          <div className="pr-4">
            <h2
              id="consultation-modal-title"
              className="text-xl sm:text-2xl font-bold text-brand-primary tracking-tight"
            >
              Mari Ceritakan Kebutuhan Usaha Anda
            </h2>
            <p
              id="consultation-modal-description"
              className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-1.5"
            >
              Ceritakan kebutuhan atau kendala yang sedang Anda hadapi. Kami akan membantu mencari solusi digital yang paling masuk akal untuk usaha Anda.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Tutup formulir konsultasi"
            className="p-2 text-text-secondary hover:text-brand-primary hover:bg-border/40 focus-visible:outline-brand-accent rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
            {channelUnavailableError && (
              <div
                role="alert"
                className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs sm:text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{channelUnavailableError}</span>
              </div>
            )}

            {/* Field A: Nama */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="consultation-name"
                className="text-sm font-semibold text-brand-primary flex items-center justify-between"
              >
                <span>
                  Nama <span className="text-rose-600" aria-hidden="true">*</span>
                </span>
              </label>
              <input
                ref={nameInputRef}
                id="consultation-name"
                name="name"
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'consultation-name-error' : undefined}
                className={`w-full bg-white border ${
                  errors.name
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-border focus:ring-brand-accent'
                } text-text-primary placeholder:text-text-secondary/60 rounded-lg px-3.5 py-2.5 text-sm focus-visible:outline-brand-accent focus:ring-1 transition-colors`}
              />
              {errors.name && (
                <p id="consultation-name-error" className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Field B: Nama Usaha (Opsional) */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="consultation-business-name"
                className="text-sm font-semibold text-brand-primary flex items-center justify-between"
              >
                <span>Nama Usaha</span>
                <span className="text-xs font-normal text-text-secondary">Opsional</span>
              </label>
              <input
                id="consultation-business-name"
                name="businessName"
                type="text"
                placeholder="Nama usaha Anda (opsional)"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-white border border-border text-text-primary placeholder:text-text-secondary/60 rounded-lg px-3.5 py-2.5 text-sm focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
              />
            </div>

            {/* Field C: Apa yang ingin Anda konsultasikan? */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="consultation-category"
                className="text-sm font-semibold text-brand-primary flex items-center justify-between"
              >
                <span>
                  Apa yang ingin Anda konsultasikan? <span className="text-rose-600" aria-hidden="true">*</span>
                </span>
              </label>
              <div className="relative">
                <select
                  id="consultation-category"
                  name="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: undefined }));
                    }
                  }}
                  aria-required="true"
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? 'consultation-category-error' : undefined}
                  className={`w-full appearance-none bg-white border ${
                    errors.category
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-border focus:ring-brand-accent'
                  } text-text-primary rounded-lg px-3.5 py-2.5 pr-10 text-sm focus-visible:outline-brand-accent focus:ring-1 transition-colors`}
                >
                  <option value="" disabled>
                    Pilih kategori kebutuhan...
                  </option>
                  {CONSULTATION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              {errors.category && (
                <p id="consultation-category-error" className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Field D: Ceritakan Kebutuhan Anda */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="consultation-needs"
                className="text-sm font-semibold text-brand-primary flex items-center justify-between"
              >
                <span>
                  Ceritakan Kebutuhan Anda <span className="text-rose-600" aria-hidden="true">*</span>
                </span>
              </label>
              <textarea
                id="consultation-needs"
                name="needs"
                rows={4}
                maxLength={1000}
                placeholder="Ceritakan kendala atau kebutuhan bisnis yang ingin Anda selesaikan..."
                value={needs}
                onChange={(e) => {
                  setNeeds(e.target.value);
                  if (errors.needs) {
                    setErrors((prev) => ({ ...prev, needs: undefined }));
                  }
                }}
                aria-required="true"
                aria-invalid={!!errors.needs}
                aria-describedby={errors.needs ? 'consultation-needs-error' : undefined}
                className={`w-full bg-white border ${
                  errors.needs
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-border focus:ring-brand-accent'
                } text-text-primary placeholder:text-text-secondary/60 rounded-lg px-3.5 py-2.5 text-sm focus-visible:outline-brand-accent focus:ring-1 transition-colors resize-y min-h-[96px]`}
              />
              <div className="flex items-center justify-between mt-0.5">
                {errors.needs ? (
                  <p id="consultation-needs-error" className="text-xs text-rose-600 flex items-center gap-1">
                    {errors.needs}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-[11px] text-text-secondary/70">
                  {needs.length}/1000
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="p-4 sm:p-6 border-t border-border bg-surface/40 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-semibold text-text-secondary hover:text-brand-primary bg-surface hover:bg-border/60 border border-border rounded-lg focus-visible:outline-brand-accent transition-colors cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors cursor-pointer"
            >
              <span>Lanjut ke WhatsApp</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}

