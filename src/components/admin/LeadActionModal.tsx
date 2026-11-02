'use client';

import React, { useState } from 'react';
import {
  Lead,
  LeadStatus,
  VerificationStatus,
  InteractionType,
} from '@/lib/admin/leads/types';
import { updateLeadStatusAction } from '@/app/(admin)/admin/leads/actions';
import { X, Calendar, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';

export interface ActionModalConfig {
  lead: Lead;
  targetStatus: LeadStatus;
  targetVerificationStatus?: VerificationStatus;
  interactionType?: InteractionType;
  title: string;
  defaultNote?: string;
  isDestructive?: boolean;
}

interface LeadActionModalProps {
  config: ActionModalConfig | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LeadActionModal({
  config,
  onClose,
  onSuccess,
}: LeadActionModalProps) {
  // Format current local datetime string for <input type="datetime-local">
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const defaultDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [dateTime, setDateTime] = useState(defaultDateTime);
  const [note, setNote] = useState(config?.defaultNote || '');
  const [verificationSource, setVerificationSource] = useState(config?.lead.verification_source || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!config) return null;

  const { lead, targetStatus, targetVerificationStatus, interactionType, title } = config;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const interactionPayload = interactionType
      ? {
          jenis: interactionType,
          isi: note.trim() || null,
          terjadi_pada: new Date(dateTime).toISOString(),
          channel: 'wa_business',
        }
      : undefined;

    const res = await updateLeadStatusAction({
      leadId: lead.id,
      toStatus: targetStatus,
      verificationStatus: targetVerificationStatus,
      verificationSource: verificationSource.trim() || undefined,
      catatan: note.trim() || undefined,
      interaction: interactionPayload,
    });

    setIsSubmitting(false);

    if (!res.ok) {
      setError(res.error || 'Gagal menyimpan aksi.');
      return;
    }

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-modal-title"
        className="relative w-full max-w-lg bg-white rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between p-5 border-b border-border bg-surface/50">
          <div>
            <h3
              id="action-modal-title"
              className="text-lg font-bold text-brand-primary"
            >
              {title}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {lead.nama_bisnis} ({lead.kota})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-brand-primary rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs sm:text-sm flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Date & Time (Defaults to now, supports backdating) */}
          <div>
            <label className="block text-xs font-semibold text-brand-primary mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-text-secondary" />
              <span>Waktu Kejadian (Bisa Backdate)</span>
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          {/* Verification Source field if transitioning verification */}
          {targetVerificationStatus && (
            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1">
                Sumber Verifikasi
              </label>
              <input
                type="text"
                placeholder="mis. situs resmi, kop dokumen tender, cek live"
                value={verificationSource}
                onChange={(e) => setVerificationSource(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent"
              />
            </div>
          )}

          {/* Note or interaction message */}
          <div>
            <label className="block text-xs font-semibold text-brand-primary mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-text-secondary" />
              <span>Catatan / Ringkasan Interaksi (Opsional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Catatan hasil percakapan atau keterangan pendukung..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent resize-y"
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-brand-primary bg-surface hover:bg-border/60 border border-border rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors cursor-pointer ${
                config.isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-brand-primary hover:bg-brand-primary/90'
              }`}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
