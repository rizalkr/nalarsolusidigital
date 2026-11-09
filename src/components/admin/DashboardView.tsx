'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lead } from '@/lib/admin/leads/types';
import { buildLeadWhatsAppUrl } from '@/lib/admin/leads/rules';
import { LeadActionModal, ActionModalConfig } from './LeadActionModal';
import {
  Send,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface DashboardViewProps {
  summary: {
    totalLeads: number;
    statusCounts: Record<string, number>;
    tierCounts: Record<number, number>;
    operationalStatus: {
      isOperationalDay: boolean;
      isOperationalHour: boolean;
      isInOperationalWindow: boolean;
      slotsUsedToday: number;
      maxDailySlots: number;
      slotsRemaining: number;
      currentTimeWIB: string;
      waAccounts?: number;
    };
    dueLeads: Array<{
      lead: Lead;
      daysOverdue: number;
      lastInteractionDate: string | null;
    }>;
    newestSiapKirim: Lead[];
  };
}

export function DashboardView({ summary }: DashboardViewProps) {
  const [modalConfig, setModalConfig] = useState<ActionModalConfig | null>(null);

  const {
    totalLeads,
    statusCounts,
    tierCounts,
    operationalStatus,
    dueLeads,
    newestSiapKirim,
  } = summary;

  const followupRunning = (statusCounts.followup_1 || 0) + (statusCounts.followup_2 || 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Slot Kirim & Operational Hours */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`p-3 rounded-xl flex-shrink-0 ${
                operationalStatus.isInOperationalWindow
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-brand-primary">
                  Slot Kirim Hari Ini
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    operationalStatus.isInOperationalWindow
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {operationalStatus.isInOperationalWindow
                    ? 'Dalam Jam Kirim'
                    : 'Di Luar Jam Operasional'}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Aturan operasional: Senin–Jumat 09:00–15:00 WIB · Waktu sekarang: {operationalStatus.currentTimeWIB}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-border">
            <div className="text-right sm:border-r sm:border-border sm:pr-4">
              <span className="text-xs font-medium text-text-secondary block">
                Jumlah akun WA
              </span>
              <span className="text-sm font-bold text-brand-primary">
                {operationalStatus.waAccounts || 2} akun aktif
              </span>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-brand-primary">
                {operationalStatus.slotsUsedToday} / {operationalStatus.maxDailySlots}
              </span>
              <p className="text-xs text-text-secondary">
                {operationalStatus.slotsRemaining > 0
                  ? `Tersisa ${operationalStatus.slotsRemaining} kuota hari ini`
                  : `Batas kuota ${operationalStatus.maxDailySlots}/${operationalStatus.maxDailySlots} tercapai`}
              </p>
            </div>

            <Link
              href="/admin/antrean"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <span>Buka Antrean</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-border">
          <span className="text-xs font-medium text-text-secondary">Total Leads</span>
          <p className="text-2xl font-bold text-brand-primary mt-1">{totalLeads}</p>
          <span className="text-[11px] text-text-secondary">Semua database</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-teal-200 bg-teal-50/20">
          <span className="text-xs font-medium text-teal-800">Siap Kirim</span>
          <p className="text-2xl font-bold text-teal-700 mt-1">{statusCounts.siap_kirim || 0}</p>
          <span className="text-[11px] text-teal-600">Terverifikasi</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sky-200 bg-sky-50/20">
          <span className="text-xs font-medium text-sky-800">Terkirim</span>
          <p className="text-2xl font-bold text-sky-700 mt-1">{statusCounts.terkirim || 0}</p>
          <span className="text-[11px] text-sky-600">Menunggu respons</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/20">
          <span className="text-xs font-medium text-indigo-800">Follow-up Berjalan</span>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{followupRunning}</p>
          <span className="text-[11px] text-indigo-600">
            FU1: {statusCounts.followup_1 || 0} · FU2: {statusCounts.followup_2 || 0}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20">
          <span className="text-xs font-medium text-blue-800">Replied</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">{statusCounts.replied || 0}</p>
          <span className="text-[11px] text-blue-600">Balasan masuk</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20">
          <span className="text-xs font-medium text-emerald-800">Closed</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{statusCounts.closed || 0}</p>
          <span className="text-[11px] text-emerald-600">Deal berhasil</span>
        </div>
      </div>

      {/* Tier Breakdown bar */}
      <div className="bg-white p-4 rounded-xl border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-brand-primary">Distribusi Tier Prospek:</span>
        <div className="flex items-center gap-4 text-text-secondary">
          <span>Tier 1: <strong className="text-brand-primary">{tierCounts[1] || 0}</strong></span>
          <span>Tier 2: <strong className="text-brand-primary">{tierCounts[2] || 0}</strong></span>
          <span>Tier 3: <strong className="text-brand-primary">{tierCounts[3] || 0}</strong></span>
          <span>Tier 4 (Benchmark): <strong className="text-brand-primary">{tierCounts[4] || 0}</strong></span>
        </div>
      </div>

      {/* Two Columns: Jatuh Tempo Hari Ini & Baru Siap Kirim */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Jatuh Tempo Hari Ini */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-brand-primary">
                Jatuh Tempo Hari Ini ({dueLeads.length})
              </h3>
            </div>
            <span className="text-xs text-text-secondary">Jeda 7 hari tanpa balasan</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px]">
            {dueLeads.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-sm">
                Tidak ada follow-up yang jatuh tempo hari ini. Operasional aman.
              </div>
            ) : (
              dueLeads.map(({ lead, daysOverdue }) => (
                <div
                  key={lead.id}
                  className="p-3.5 bg-surface border border-border rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-semibold text-sm text-brand-primary hover:underline truncate"
                      >
                        {lead.nama_bisnis}
                      </Link>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        Tier {lead.tier}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {lead.kota} · {lead.sektor}
                    </p>
                    <p className="text-[11px] font-medium text-rose-600 mt-1">
                      {daysOverdue === 0
                        ? 'Jatuh tempo tepat hari ini'
                        : `Terlambat ${daysOverdue} hari`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const targetStatus = lead.status === 'terkirim' ? 'followup_1' : 'followup_2';
                        setModalConfig({
                          lead,
                          targetStatus,
                          interactionType: targetStatus,
                          title: `Catat ${targetStatus === 'followup_1' ? 'Follow-up 1' : 'Follow-up 2'}`,
                        });
                      }}
                      className="px-2.5 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer"
                    >
                      Follow-up
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
                      className="px-2.5 py-1.5 bg-white border border-border text-xs font-semibold text-brand-primary hover:bg-surface rounded-lg transition-colors cursor-pointer"
                    >
                      Balasan
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Box 2: Baru Siap Kirim */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-base text-brand-primary">
                Baru Siap Kirim (5 Teratas)
              </h3>
            </div>
            <Link
              href="/admin/antrean"
              className="text-xs text-brand-accent-strong hover:underline font-semibold"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px]">
            {newestSiapKirim.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-sm">
                Belum ada prospek berstatus Siap Kirim.
              </div>
            ) : (
              newestSiapKirim.map((lead) => {
                const waUrl = buildLeadWhatsAppUrl(lead.nomor_telepon);
                return (
                  <div
                    key={lead.id}
                    className="p-3.5 bg-surface border border-border rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-semibold text-sm text-brand-primary hover:underline truncate"
                        >
                          {lead.nama_bisnis}
                        </Link>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                          Tier {lead.tier}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {lead.kota} · {lead.sektor}
                      </p>
                      {lead.strategi_pitch && (
                        <p className="text-xs text-text-primary italic mt-1 line-clamp-1">
                          &ldquo;{lead.strategi_pitch}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                        >
                          <span>WA</span>
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
                        className="px-2.5 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer"
                      >
                        Tandai Kirim
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Action Dialog Modal */}
      <LeadActionModal
        config={modalConfig}
        onClose={() => setModalConfig(null)}
        onSuccess={() => {
          // Hard reload or router refresh triggers server re-fetch
          window.location.reload();
        }}
      />
    </div>
  );
}
