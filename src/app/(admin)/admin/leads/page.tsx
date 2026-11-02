import React from 'react';
import Link from 'next/link';
import { listLeads } from '@/lib/admin/leads/repository';
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_BADGES,
  VERIFICATION_STATUS_LABELS,
} from '@/lib/admin/leads/constants';
import { LeadStatus, VerificationStatus } from '@/lib/admin/leads/types';
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { WaLinkButton } from '@/components/admin/WaLinkButton';

export const dynamic = 'force-dynamic';

interface LeadsPageProps {
  searchParams: Promise<{
    q?: string;
    tier?: string;
    status?: string;
    wilayah?: string;
    verification_status?: string;
    sort?: string;
    order?: string;
    page?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const tier = params.tier ? parseInt(params.tier, 10) : undefined;
  const status = (params.status as LeadStatus) || undefined;
  const verification_status = (params.verification_status as VerificationStatus) || undefined;
  const search = params.q || undefined;
  const wilayah = params.wilayah || undefined;
  const sortBy = (params.sort as 'updated_at' | 'nama_bisnis') || 'updated_at';
  const sortOrder = (params.order as 'asc' | 'desc') || 'desc';

  const { leads, total, totalPages } = await listLeads({
    page,
    limit: 25,
    search,
    tier,
    status,
    wilayah,
    verification_status,
    sortBy,
    sortOrder,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Daftar Prospek (Leads)</h1>
          <p className="text-sm text-text-secondary mt-1">
            Total {total} prospek terdaftar dalam sistem CRM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads/import"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Import CSV</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-xs">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            <input
              type="text"
              name="q"
              defaultValue={search || ''}
              placeholder="Cari nama bisnis, kota, sektor, nomor..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg text-text-primary focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent"
            />
          </div>

          {/* Tier Filter */}
          <div>
            <select
              name="tier"
              defaultValue={tier || ''}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg text-text-primary focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent"
            >
              <option value="">Semua Tier</option>
              <option value="1">Tier 1</option>
              <option value="2">Tier 2</option>
              <option value="3">Tier 3</option>
              <option value="4">Tier 4 (Benchmark)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              name="status"
              defaultValue={status || ''}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg text-text-primary focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent"
            >
              <option value="">Semua Status</option>
              {Object.entries(LEAD_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status Filter */}
          <div>
            <select
              name="verification_status"
              defaultValue={verification_status || ''}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg text-text-primary focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent"
            >
              <option value="">Semua Verifikasi</option>
              {Object.entries(VERIFICATION_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer text-center"
            >
              Terapkan
            </button>
            <Link
              href="/admin/leads"
              className="px-3 py-2 bg-surface text-text-secondary text-sm font-semibold rounded-lg border border-border hover:bg-border/60 transition-colors"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/80 border-b border-border text-xs font-semibold text-text-secondary">
              <tr>
                <th className="py-3 px-4">Nama Bisnis & Kontak</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Sektor & Kota</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">Status Lead</th>
                <th className="py-3 px-4">Verifikasi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-secondary">
                    Tidak ditemukan prospek dengan kriteria pencarian di atas.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const badge = LEAD_STATUS_BADGES[lead.status] || {
                    bg: 'bg-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                  };

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-surface/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-semibold text-brand-primary group-hover:underline block"
                        >
                          {lead.nama_bisnis}
                        </Link>
                        <div className="text-xs text-text-secondary mt-0.5 flex items-center gap-2">
                          <span>{lead.nomor_telepon}</span>
                          {lead.link_wa && <WaLinkButton href={lead.link_wa} />}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                          T{lead.tier}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs">
                        <div className="font-medium text-brand-primary">{lead.sektor}</div>
                        <div className="text-text-secondary">{lead.kota}</div>
                      </td>

                      <td className="py-3 px-4 text-xs text-text-secondary">
                        {lead.wilayah || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {LEAD_STATUS_LABELS[lead.status]}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs">
                        <span
                          className={`font-medium ${
                            lead.verification_status === 'terverifikasi'
                              ? 'text-emerald-700'
                              : lead.verification_status === 'parsial'
                              ? 'text-amber-700'
                              : 'text-text-secondary'
                          }`}
                        >
                          {VERIFICATION_STATUS_LABELS[lead.verification_status]}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-accent-strong hover:underline"
                        >
                          <span>Detail</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-text-secondary bg-surface/30">
            <span>
              Halaman {page} dari {totalPages} ({total} total data)
            </span>
            <div className="flex items-center gap-1.5">
              {page > 1 && (
                <Link
                  href={{
                    pathname: '/admin/leads',
                    query: { ...params, page: page - 1 },
                  }}
                  className="px-2.5 py-1.5 border border-border rounded-lg hover:bg-surface text-brand-primary font-medium inline-flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={{
                    pathname: '/admin/leads',
                    query: { ...params, page: page + 1 },
                  }}
                  className="px-2.5 py-1.5 border border-border rounded-lg hover:bg-surface text-brand-primary font-medium inline-flex items-center gap-1"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
