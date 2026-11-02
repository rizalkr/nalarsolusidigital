'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lead } from '@/lib/admin/leads/types';
import { buildLeadWhatsAppUrl } from '@/lib/admin/leads/rules';
import { LeadActionModal, ActionModalConfig } from './LeadActionModal';
import {
  Send,
  Clock,
  ExternalLink,
  MessageCircle,
  ShieldAlert,
} from 'lucide-react';

interface AntreanViewProps {
  siapKirim: Lead[];
  followupDue: Array<{
    lead: Lead;
    daysOverdue: number;
    lastInteractionDate: string | null;
  }>;
  holdList: Lead[];
}

export function AntreanView({
  siapKirim,
  followupDue,
  holdList,
}: AntreanViewProps) {
  const [modalConfig, setModalConfig] = useState<ActionModalConfig | null>(null);

  return (
    <div className="space-y-8">
      {/* Block A: SIAP KIRIM */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-primary">
                1. Antrean Siap Kirim ({siapKirim.length})
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Urutan prioritas: Tier terkecil dulu (Tier 1 &rarr; 2 &rarr; 3), lalu updated_at terlama.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {siapKirim.length === 0 ? (
            <p className="text-sm text-text-secondary py-8 text-center">
              Tidak ada prospek dalam antrean Siap Kirim.
            </p>
          ) : (
            siapKirim.map((lead) => {
              const waUrl = buildLeadWhatsAppUrl(lead.nomor_telepon);
              return (
                <div
                  key={lead.id}
                  className="p-4 bg-surface border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-teal-300 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-bold text-sm text-brand-primary hover:underline truncate"
                      >
                        {lead.nama_bisnis}
                      </Link>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-800">
                        Tier {lead.tier}
                      </span>
                      {lead.sub_kelompok && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {lead.sub_kelompok}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-text-secondary mt-1">
                      {lead.kota} · {lead.sektor} {lead.wilayah ? `· ${lead.wilayah}` : ''} · {lead.nomor_telepon}
                    </p>

                    {lead.strategi_pitch && (
                      <p className="text-xs text-brand-primary mt-1.5 italic bg-accent-surface/60 p-2 rounded-lg border border-brand-accent/20">
                        &ldquo;{lead.strategi_pitch}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Buka Chat WA</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setModalConfig({
                          lead,
                          targetStatus: 'terkirim',
                          interactionType: 'penawaran',
                          title: 'Tandai Penawaran Terkirim',
                          defaultNote: 'Penawaran dikirim via WA Business',
                        })
                      }
                      className="px-3.5 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer"
                    >
                      Tandai Terkirim
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Block B: FOLLOW-UP JATUH TEMPO */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-primary">
                2. Follow-up Jatuh Tempo ({followupDue.length})
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Prospek dengan jeda 7 hari sejak penawaran / follow-up terakhir tanpa balasan masuk.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {followupDue.length === 0 ? (
            <p className="text-sm text-text-secondary py-8 text-center">
              Tidak ada follow-up yang jatuh tempo hari ini.
            </p>
          ) : (
            followupDue.map(({ lead, daysOverdue, lastInteractionDate }) => (
              <div
                key={lead.id}
                className="p-4 bg-surface border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-bold text-sm text-brand-primary hover:underline truncate"
                    >
                      {lead.nama_bisnis}
                    </Link>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
                      Tier {lead.tier}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      Status: {lead.status}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary mt-1">
                    {lead.kota} · {lead.sektor} · Kontak: {lead.nomor_telepon}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="font-semibold text-rose-600">
                      {daysOverdue === 0
                        ? 'Jatuh tempo hari ini'
                        : `Terlambat ${daysOverdue} hari`}
                    </span>
                    {lastInteractionDate && (
                      <span className="text-text-secondary">
                        Terakhir dihubungi: {new Date(lastInteractionDate).toLocaleDateString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const nextStatus = lead.status === 'terkirim' ? 'followup_1' : 'followup_2';
                      setModalConfig({
                        lead,
                        targetStatus: nextStatus,
                        interactionType: nextStatus,
                        title: `Catat ${nextStatus === 'followup_1' ? 'Follow-up 1' : 'Follow-up 2'}`,
                      });
                    }}
                    className="px-3.5 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer"
                  >
                    Catat Follow-up
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'replied',
                        interactionType: 'balasan_masuk',
                        title: 'Catat Balasan Masuk',
                      })
                    }
                    className="px-3 py-2 bg-white border border-border text-xs font-semibold text-brand-primary hover:bg-surface rounded-lg transition-colors cursor-pointer"
                  >
                    Catat Balasan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Block C: HOLD (Butuh Verifikasi Manual) */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-primary">
                3. Hold / Butuh Verifikasi ({holdList.length})
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Prospek yang membutuhkan verifikasi manual sebelum dapat dipindahkan ke Siap Kirim.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {holdList.length === 0 ? (
            <p className="text-sm text-text-secondary py-8 text-center">
              Tidak ada prospek dalam status Hold saat ini.
            </p>
          ) : (
            holdList.map((lead) => (
              <div
                key={lead.id}
                className="p-4 bg-surface border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-amber-300 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-bold text-sm text-brand-primary hover:underline truncate"
                    >
                      {lead.nama_bisnis}
                    </Link>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                      Tier {lead.tier}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Hold: {lead.verification_source || 'Butuh Verifikasi Manual'}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary mt-1">
                    {lead.kota} · {lead.sektor} · Nomor: {lead.nomor_telepon}
                  </p>

                  {lead.catatan && (
                    <p className="text-xs text-text-secondary mt-1">
                      Catatan: {lead.catatan}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: lead.tier === 4 ? 'benchmark_only' : 'siap_kirim',
                        targetVerificationStatus: 'terverifikasi',
                        title: 'Verifikasi Nomor & Siap Kirim',
                        defaultNote: 'Nomor telah diverifikasi manual',
                      })
                    }
                    className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Verifikasi Selesai
                  </button>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="px-3 py-2 bg-white border border-border text-xs font-semibold text-text-secondary hover:text-brand-primary rounded-lg transition-colors"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Dialog Modal */}
      <LeadActionModal
        config={modalConfig}
        onClose={() => setModalConfig(null)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
