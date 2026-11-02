'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';
import { commitImportCsvAction } from '@/app/(admin)/admin/leads/actions';
import { processImportRows } from '@/lib/admin/leads/csv-mapper';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  HelpCircle,
} from 'lucide-react';

export default function ImportCsvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rawRows, setRawRows] = useState<Array<Record<string, string>>>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [batchRiset, setBatchRiset] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [importResult, setImportResult] = useState<{
    masuk: number;
    dilewati_duplikat: number;
    gagal: number;
    errors: Array<{ baris: number; pesan: string }>;
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsParsing(true);
    setGeneralError(null);
    setImportResult(null);

    Papa.parse<Record<string, string>>(uploadedFile, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        setIsParsing(false);
        if (results.errors && results.errors.length > 0) {
          setGeneralError(
            `Peringatan parsing CSV: ${results.errors.map((err) => err.message).join(', ')}`
          );
        }

        const validRows = results.data.filter((r) => Object.values(r).some((v) => Boolean(v && v.trim())));
        setRawRows(validRows);
        setHeaders(results.meta.fields || []);
      },
      error: (err) => {
        setIsParsing(false);
        setGeneralError(`Gagal membaca file CSV: ${err.message}`);
      },
    });
  };

  const handleCommit = async () => {
    if (rawRows.length === 0) return;

    setIsCommitting(true);
    setGeneralError(null);

    const res = await commitImportCsvAction(rawRows, batchRiset.trim() || null);
    setIsCommitting(false);

    if (!res.ok || !res.data) {
      setGeneralError(res.error || 'Terjadi kegagalan saat import CSV.');
      return;
    }

    setImportResult(res.data);
  };

  // Preview processed rows client-side before commit
  const preview = React.useMemo(() => {
    if (rawRows.length === 0) return null;
    return processImportRows(rawRows.slice(0, 5), {
      defaultBatchRiset: batchRiset.trim() || null,
    });
  }, [rawRows, batchRiset]);

  const isRisetFormat = headers.some(
    (h) => h.toLowerCase().includes('wilayah') || h.toLowerCase().includes('batch')
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/leads"
          className="p-2 border border-border rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Import CSV Prospek</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Mendukung Format Master Google Sheets (20 kolom) dan Format Riset Weekend Nalar.
          </p>
        </div>
      </div>

      {generalError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Result Card when finished */}
      {importResult && (
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-primary">
                Import CSV Berhasil Diproses!
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Deduplikasi otomatis telah dijalankan berdasar normalisasi nomor telepon internasional (628...).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-emerald-800">Berhasil Masuk</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{importResult.masuk}</p>
            </div>
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-amber-800">Dilewati (Duplikat)</span>
              <p className="text-2xl font-bold text-amber-700 mt-1">{importResult.dilewati_duplikat}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-slate-700">Gagal / Tidak Lengkap</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{importResult.gagal}</p>
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div className="mt-4 p-3.5 bg-surface border border-border rounded-xl text-xs space-y-1 max-h-40 overflow-y-auto">
              <span className="font-bold text-brand-primary block">Rincian baris yang dilewati/gagal:</span>
              {importResult.errors.map((err, i) => (
                <p key={i} className="text-text-secondary">
                  Baris {err.baris}: {err.pesan}
                </p>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-3">
            <Link
              href="/admin/leads"
              className="px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              Lihat di Daftar Leads
            </Link>
            <Link
              href="/admin/antrean"
              className="px-4 py-2 bg-surface border border-border text-text-primary text-sm font-semibold rounded-lg hover:bg-border/60 transition-colors"
            >
              Buka Antrean Outreach
            </Link>
          </div>
        </div>
      )}

      {/* Upload Box */}
      {!importResult && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-5">
          <div>
            <label className="block text-sm font-bold text-brand-primary mb-1">
              Pilih File CSV
            </label>
            <p className="text-xs text-text-secondary mb-3">
              Export sheet Google Sheets Anda sebagai format CSV (.csv) lalu upload di sini.
            </p>

            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-brand-accent transition-colors bg-surface/30">
              <FileSpreadsheet className="w-10 h-10 text-brand-accent mx-auto mb-2" />
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-file-input"
              />
              <label
                htmlFor="csv-file-input"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih File CSV</span>
              </label>
              {file && (
                <p className="text-xs text-text-primary font-medium mt-3">
                  File terpilih: <strong>{file.name}</strong> ({rawRows.length} baris terdeteksi)
                </p>
              )}
            </div>
          </div>

          {/* Optional Batch Riset Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1">
                Batch Riset (Opsional)
              </label>
              <input
                type="text"
                placeholder='mis. "2026-11-01-wave2" atau "master-awal"'
                value={batchRiset}
                onChange={(e) => setBatchRiset(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg text-text-primary focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent"
              />
              <span className="text-[11px] text-text-secondary mt-1 block">
                Jika di file CSV tidak ada kolom batch, nilai ini akan disematkan ke seluruh prospek baru.
              </span>
            </div>

            <div className="bg-surface p-3.5 rounded-xl border border-border text-xs text-text-secondary space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-brand-primary">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Format Terdeteksi:</span>
              </div>
              <p>
                {headers.length === 0
                  ? 'Belum ada file yang diunggah.'
                  : isRisetFormat
                  ? 'Format Riset Weekend (memuat kolom Wilayah / Riset).'
                  : 'Format Master Sheets (20 kolom standar Nalar).'}
              </p>
              <p className="text-[11px]">
                Total kolom terdeteksi: <strong>{headers.length}</strong> kolom.
              </p>
            </div>
          </div>

          {/* Preview Table */}
          {rawRows.length > 0 && preview && (
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-brand-primary">
                  Preview Mapping Data (5 Baris Pertama)
                </h3>
                <span className="text-xs text-text-secondary">
                  Total {rawRows.length} baris siap diimpor
                </span>
              </div>

              <div className="border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface border-b border-border text-text-secondary font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Nama Bisnis</th>
                      <th className="py-2.5 px-3">Tier</th>
                      <th className="py-2.5 px-3">Sektor</th>
                      <th className="py-2.5 px-3">Kota</th>
                      <th className="py-2.5 px-3">Wilayah</th>
                      <th className="py-2.5 px-3">Nomor (Normal)</th>
                      <th className="py-2.5 px-3">Status Awal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {preview.leads.map((lead, idx) => (
                      <tr key={idx} className="hover:bg-surface/50">
                        <td className="py-2 px-3 font-semibold text-brand-primary">
                          {lead.nama_bisnis}
                        </td>
                        <td className="py-2 px-3">Tier {lead.tier}</td>
                        <td className="py-2 px-3 text-text-secondary">{lead.sektor}</td>
                        <td className="py-2 px-3 text-text-secondary">{lead.kota}</td>
                        <td className="py-2 px-3 text-text-secondary">{lead.wilayah}</td>
                        <td className="py-2 px-3 font-mono text-[11px]">
                          {lead.nomor_telepon_normalized}
                        </td>
                        <td className="py-2 px-3 font-medium text-teal-700">
                          {lead.status} ({lead.verification_status})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={isCommitting || isParsing}
                  onClick={handleCommit}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isCommitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {isCommitting ? 'Memproses Import...' : `Komit Import (${rawRows.length} Leads)`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

