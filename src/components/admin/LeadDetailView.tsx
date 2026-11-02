'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lead, Interaction, AuditLog } from '@/lib/admin/leads/types';
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_BADGES,
  VERIFICATION_STATUS_LABELS,
  INTERACTION_TYPE_LABELS,
} from '@/lib/admin/leads/constants';
import { buildLeadWhatsAppUrl, getOperationalWindowStatus } from '@/lib/admin/leads/rules';
import { LeadActionModal, ActionModalConfig } from './LeadActionModal';
import {
  MapPin,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  Clock,
  History,
  Ban,
  ArrowLeft,
} from 'lucide-react';

interface LeadDetailViewProps {
  lead: Lead;
  interactions: Interaction[];
  auditLogs: AuditLog[];
  todaySlotsUsed: number;
}

export function LeadDetailView({
  lead,
  interactions,
  auditLogs,
  todaySlotsUsed,
}: LeadDetailViewProps) {
  const [modalConfig, setModalConfig] = useState<ActionModalConfig | null>(null);

  const operationalStatus = getOperationalWindowStatus(new Date(), todaySlotsUsed);
  const waUrl = buildLeadWhatsAppUrl(lead.nomor_telepon);
  const statusBadge = LEAD_STATUS_BADGES[lead.status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };

  const isDNC = lead.status === 'do_not_contact';
  const isTier4 = lead.tier === 4;
  const isVerifiedForSend =
    lead.verification_status === 'terverifikasi' ||
    lead.verification_status === 'parsial';

  return (
    <div className="space-y-6">
      {/* Back button and status header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="p-2 border border-border rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-brand-primary">
                {lead.nama_bisnis}
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                Tier {lead.tier}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
              >
                {LEAD_STATUS_LABELS[lead.status]}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              {lead.kota} · {lead.sektor} {lead.wilayah ? `· Wilayah: ${lead.wilayah}` : ''}
            </p>
          </div>
        </div>

        {/* External Quick Actions */}
        <div className="flex items-center gap-2">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Buka Chat WA</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {lead.link_maps && (
            <a
              href={lead.link_maps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-border text-xs font-semibold text-text-secondary hover:text-brand-primary rounded-lg transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Maps</span>
            </a>
          )}
        </div>
      </div>

      {/* Operational Warnings */}
      {lead.verification_status === 'parsial' && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Peringatan Verifikasi Parsial:</strong> Nomor kontak belum terverifikasi penuh.
            Pastikan catatan verifikasi sudah dicek sebelum mengirim penawaran.
          </span>
        </div>
      )}

      {isDNC && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
          <Ban className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Prospek Diblokir (Do Not Contact):</strong> Sesuai aturan #3, seluruh aksi operasional
            untuk prospek ini telah dinonaktifkan permanen.
          </span>
        </div>
      )}

      {/* Main Grid: Details + Contextual Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Profile & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-primary border-b border-border pb-3">
              Informasi Prospek
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-text-secondary block font-medium">Nomor Telepon</span>
                <span className="font-semibold text-brand-primary text-sm mt-0.5 block">
                  {lead.nomor_telepon}
                </span>
                <span className="text-text-secondary/80 text-[11px]">
                  Tipe: {lead.tipe_kontak || 'WhatsApp (Seluler)'}
                </span>
              </div>

              <div>
                <span className="text-text-secondary block font-medium">Status Verifikasi Nomor</span>
                <span className="font-semibold text-brand-primary mt-0.5 block">
                  {VERIFICATION_STATUS_LABELS[lead.verification_status]}
                </span>
                {lead.verification_source && (
                  <span className="text-text-secondary/80 text-[11px]">
                    Sumber: {lead.verification_source}
                  </span>
                )}
              </div>

              <div>
                <span className="text-text-secondary block font-medium">Data Google Business Profile</span>
                <span className="font-medium text-brand-primary mt-0.5 block">
                  GBP: {lead.verified_gbp ? 'Terverifikasi' : 'Belum / Tidak'} · Rating: {lead.rating || '—'} ({lead.jumlah_ulasan || 0} ulasan)
                </span>
                <span className="text-text-secondary/80 text-[11px]">
                  Foto: {lead.jumlah_foto || 0} foto
                </span>
              </div>

              <div>
                <span className="text-text-secondary block font-medium">Website & Medsos</span>
                <span className="font-medium text-brand-primary mt-0.5 block">
                  Web: {lead.status_web || '—'}
                </span>
                {lead.url_medsos && (
                  <a
                    href={lead.url_medsos.startsWith('http') ? lead.url_medsos : `https://${lead.url_medsos}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-accent-strong hover:underline text-[11px] inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>{lead.url_medsos}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>

              {lead.alamat && (
                <div className="sm:col-span-2">
                  <span className="text-text-secondary block font-medium">Alamat Lengkap</span>
                  <p className="text-text-primary mt-0.5">{lead.alamat}</p>
                </div>
              )}

              {lead.batch_riset && (
                <div>
                  <span className="text-text-secondary block font-medium">Batch Riset</span>
                  <span className="text-brand-primary font-medium">{lead.batch_riset}</span>
                </div>
              )}

              {lead.sub_kelompok && (
                <div>
                  <span className="text-text-secondary block font-medium">Sub-Kelompok</span>
                  <span className="text-brand-primary font-medium">{lead.sub_kelompok}</span>
                </div>
              )}
            </div>

            {/* Pitch Strategy */}
            {lead.strategi_pitch && (
              <div className="mt-4 p-3.5 bg-accent-surface border border-brand-accent/20 rounded-xl">
                <span className="text-xs font-bold text-brand-accent-strong block mb-1">
                  Strategi & Sudut Pandang Pitching:
                </span>
                <p className="text-xs sm:text-sm text-brand-primary leading-relaxed">
                  {lead.strategi_pitch}
                </p>
              </div>
            )}

            {/* Catatan Tambahan */}
            {lead.catatan && (
              <div className="p-3 bg-surface border border-border rounded-xl text-xs text-text-secondary">
                <strong className="text-brand-primary">Catatan:</strong> {lead.catatan}
              </div>
            )}
          </div>

          {/* Timeline Interaksi */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-primary" />
                <h2 className="text-base font-bold text-brand-primary">
                  Timeline Interaksi ({interactions.length})
                </h2>
              </div>
              <button
                type="button"
                disabled={isDNC}
                onClick={() =>
                  setModalConfig({
                    lead,
                    targetStatus: lead.status,
                    interactionType: 'catatan',
                    title: 'Tambah Catatan Interaksi',
                  })
                }
                className="text-xs font-semibold text-brand-accent-strong hover:underline disabled:opacity-40 cursor-pointer"
              >
                + Catat Interaksi
              </button>
            </div>

            <div className="space-y-3">
              {interactions.length === 0 ? (
                <p className="text-xs text-text-secondary py-6 text-center">
                  Belum ada catatan interaksi untuk prospek ini.
                </p>
              ) : (
                interactions.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-surface border border-border rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-primary">
                        {INTERACTION_TYPE_LABELS[item.jenis] || item.jenis}
                      </span>
                      <span className="text-text-secondary">
                        {new Date(item.terjadi_pada).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                    {item.isi && (
                      <p className="text-text-secondary leading-relaxed pt-1 whitespace-pre-wrap">
                        {item.isi}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <History className="w-4 h-4 text-brand-primary" />
              <h2 className="text-base font-bold text-brand-primary">
                Jejak Audit Status
              </h2>
            </div>

            <div className="space-y-2">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-text-secondary py-4 text-center">
                  Belum ada log audit.
                </p>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between text-xs py-2 border-b border-border/40 last:border-b-0"
                  >
                    <div>
                      <span className="font-semibold text-brand-primary font-mono">
                        {log.aksi}
                      </span>
                      {log.detail && (
                        <p className="text-text-secondary text-[11px] mt-0.5">
                          {log.detail}
                        </p>
                      )}
                    </div>
                    <span className="text-text-secondary text-[11px] whitespace-nowrap pl-3">
                      {new Date(log.created_at).toLocaleString('id-ID', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Contextual Action Panel (Enforcing Business Rules) */}
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4 sticky top-20">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-brand-primary">
                Panel Aksi Operasional
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Aksi disesuaikan dengan status saat ini ({LEAD_STATUS_LABELS[lead.status]}).
              </p>
            </div>

            {/* Outside operational hours notification */}
            {!operationalStatus.isInOperationalWindow && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Saat ini di luar jam operasional kirim (09:00–15:00 WIB). Aksi tetap dapat dicatat untuk backdate.
                </span>
              </div>
            )}

            {/* Contextual Action Buttons */}
            <div className="space-y-2.5">
              {/* STATUS: riset */}
              {lead.status === 'riset' && (
                <>
                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: isTier4 ? 'benchmark_only' : 'terverifikasi',
                        targetVerificationStatus: 'terverifikasi',
                        title: isTier4 ? 'Set Benchmark Only' : 'Tandai Nomor Terverifikasi',
                        defaultNote: 'Nomor aktif dan valid untuk penawaran',
                      })
                    }
                    className="w-full py-2.5 px-4 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer text-center"
                  >
                    Tandai Terverifikasi
                  </button>
                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'hold',
                        targetVerificationStatus: 'hold',
                        title: 'Tandai Hold Verifikasi',
                        defaultNote: 'Butuh cek manual lebih lanjut',
                      })
                    }
                    className="w-full py-2.5 px-4 bg-white border border-border text-xs font-semibold text-text-primary hover:bg-surface rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Tandai Hold
                  </button>
                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'tidak_layak',
                        targetVerificationStatus: 'tidak_layak',
                        title: 'Tandai Tidak Layak',
                        isDestructive: true,
                        defaultNote: 'Nomor tidak aktif / salah sambung',
                      })
                    }
                    className="w-full py-2.5 px-4 bg-white border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Tandai Tidak Layak
                  </button>
                </>
              )}

              {/* STATUS: terverifikasi or hold */}
              {(lead.status === 'terverifikasi' || lead.status === 'hold') && (
                <>
                  {!isTier4 ? (
                    <button
                      type="button"
                      disabled={isDNC || !isVerifiedForSend}
                      onClick={() =>
                        setModalConfig({
                          lead,
                          targetStatus: 'siap_kirim',
                          title: 'Pindahkan ke Siap Kirim',
                          defaultNote: 'Siap masuk antrean outreach',
                        })
                      }
                      className="w-full py-2.5 px-4 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-40 cursor-pointer text-center"
                    >
                      Pindahkan ke Siap Kirim
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setModalConfig({
                          lead,
                          targetStatus: 'benchmark_only',
                          title: 'Set Benchmark Only (Tier 4)',
                        })
                      }
                      className="w-full py-2.5 px-4 bg-slate-700 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-center"
                    >
                      Set Benchmark Only
                    </button>
                  )}

                  {!isVerifiedForSend && (
                    <p className="text-[11px] text-rose-600">
                      Terkunci: Nomor belum terverifikasi (Aturan #4).
                    </p>
                  )}
                </>
              )}

              {/* STATUS: siap_kirim */}
              {lead.status === 'siap_kirim' && (
                <>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>1. Buka Chat WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'terkirim',
                        interactionType: 'penawaran',
                        title: '2. Tandai Penawaran Terkirim',
                        defaultNote: 'Pesan penawaran pertama dikirim manual via WA Business',
                      })
                    }
                    className="w-full py-2.5 px-4 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer text-center"
                  >
                    Tandai Terkirim
                  </button>
                </>
              )}

              {/* STATUS: terkirim or followup_1 */}
              {(lead.status === 'terkirim' || lead.status === 'followup_1') && (
                <>
                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() => {
                      const nextStatus = lead.status === 'terkirim' ? 'followup_1' : 'followup_2';
                      setModalConfig({
                        lead,
                        targetStatus: nextStatus,
                        interactionType: nextStatus,
                        title: `Catat ${nextStatus === 'followup_1' ? 'Follow-up 1' : 'Follow-up 2'}`,
                        defaultNote: `Follow-up ${nextStatus === 'followup_1' ? 'pertama' : 'kedua'} via WA Business`,
                      });
                    }}
                    className="w-full py-2.5 px-4 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer text-center"
                  >
                    Catat {lead.status === 'terkirim' ? 'Follow-up 1' : 'Follow-up 2'}
                  </button>

                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'replied',
                        interactionType: 'balasan_masuk',
                        title: 'Catat Balasan Masuk',
                        defaultNote: 'Prospek memberikan balasan via WA',
                      })
                    }
                    className="w-full py-2.5 px-4 bg-white border border-border text-xs font-semibold text-brand-primary hover:bg-surface rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Catat Balasan Masuk
                  </button>

                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'pause',
                        title: 'Pause Prospek',
                        defaultNote: 'Jeda sementara tindak lanjut',
                      })
                    }
                    className="w-full py-2.5 px-4 bg-white border border-amber-200 text-xs font-semibold text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Pause
                  </button>
                </>
              )}

              {/* STATUS: followup_2 (Rule #1 enforcement: max 2 follow-ups) */}
              {lead.status === 'followup_2' && (
                <div className="space-y-2">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                    <strong>Aturan #1 Ditegakkan:</strong> Follow-up maksimal 2x. Setelah Follow-up 2 tanpa balasan, prospek di-pause sesuai aturan operasional.
                  </div>

                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'pause',
                        title: 'Pause Prospek (Sesuai Aturan #1)',
                        defaultNote: 'Follow-up maksimal 2x — prospek di-pause sesuai aturan.',
                      })
                    }
                    className="w-full py-2.5 px-4 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer text-center"
                  >
                    Pause Prospek
                  </button>

                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'replied',
                        interactionType: 'balasan_masuk',
                        title: 'Catat Balasan Masuk',
                      })
                    }
                    className="w-full py-2.5 px-4 bg-white border border-border text-xs font-semibold text-brand-primary hover:bg-surface rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Catat Balasan Masuk
                  </button>
                </div>
              )}

              {/* STATUS: pause */}
              {lead.status === 'pause' && (
                <div className="space-y-2">
                  <p className="text-xs text-text-secondary">
                    Follow-up maksimal 2x — prospek di-pause sesuai aturan.
                  </p>
                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'replied',
                        interactionType: 'balasan_masuk',
                        title: 'Catat Balasan Masuk',
                      })
                    }
                    className="w-full py-2.5 px-4 bg-white border border-border text-xs font-semibold text-brand-primary hover:bg-surface rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Catat Balasan Masuk
                  </button>
                </div>
              )}

              {/* Global Final Transitions for active leads */}
              {!['closed', 'do_not_contact', 'benchmark_only'].includes(lead.status) && (
                <div className="pt-3 border-t border-border space-y-2">
                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'closed',
                        title: 'Tandai Deal Berhasil (Closed)',
                        defaultNote: 'Kesepakatan tercapai',
                      })
                    }
                    className="w-full py-2 px-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer text-center"
                  >
                    Tandai Closed (Deal)
                  </button>

                  <button
                    type="button"
                    disabled={isDNC}
                    onClick={() =>
                      setModalConfig({
                        lead,
                        targetStatus: 'do_not_contact',
                        title: 'Tandai Do Not Contact (Blokir)',
                        isDestructive: true,
                        defaultNote: 'Permintaan pemilik bisnis untuk tidak dihubungi',
                      })
                    }
                    className="w-full py-2 px-3 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold rounded-lg hover:bg-rose-100 transition-colors cursor-pointer text-center"
                  >
                    Do Not Contact
                  </button>
                </div>
              )}
            </div>
          </div>
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
