import { LayoutGrid, ClipboardList, Mail } from 'lucide-react';

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none select-none pt-4 sm:pt-6 pb-6 px-1 sm:px-2">
      {/* Main Panel: Generic Business Website Interface */}
      <div
        aria-hidden="true"
        className="rounded-xl border border-border shadow-lg bg-white overflow-hidden"
      >
        {/* Browser Chrome Header */}
        <div className="bg-surface border-b border-border px-3.5 py-2.5 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
          {/* Address / URL Bar */}
          <div className="flex-1 mx-2 sm:mx-3 h-5 bg-white border border-border/80 rounded-full flex items-center px-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-1.5" />
            <span className="text-[10px] text-text-secondary font-medium tracking-wide">
              usaha-lokal.com
            </span>
          </div>
        </div>

        {/* Website Navigation */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-border/60 flex items-center justify-between bg-white">
          {/* Brand Mark */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-brand-accent" />
            </div>
            <span className="text-xs font-bold text-brand-primary tracking-tight">
              Mitra Usaha
            </span>
          </div>
          {/* Navigation Links */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] font-medium text-text-secondary">
            <span className="text-brand-primary font-semibold">Beranda</span>
            <span>Layanan</span>
            <span className="hidden sm:inline">Kontak</span>
          </div>
        </div>

        {/* Website Hero Area */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-white to-surface/60">
          <div className="inline-block text-[9px] font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-2 py-0.5 rounded border border-brand-accent/20 mb-2">
            Layanan Terpercaya
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-brand-primary leading-snug mb-1">
            Produk & Layanan untuk Kebutuhan Anda
          </h4>
          <p className="text-[10px] sm:text-[11px] text-text-secondary leading-normal mb-3 max-w-[280px]">
            Pelayanan ramah, respon cepat, dan pemesanan mudah secara online.
          </p>
          <div className="inline-flex items-center px-3 py-1 bg-brand-primary text-white text-[10px] font-semibold rounded-md shadow-sm">
            Lihat Penawaran
          </div>
        </div>

        {/* Website Content Row */}
        <div className="px-4 sm:px-5 pb-5 pt-1 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white border border-border rounded-lg p-2 sm:p-2.5 shadow-xs">
            <div className="w-full aspect-[4/3] bg-surface rounded-md mb-1.5 flex items-center justify-center">
              <div className="w-4 h-4 rounded bg-accent-surface border border-brand-accent/30" />
            </div>
            <div className="text-[9px] sm:text-[10px] font-bold text-brand-primary leading-tight truncate">
              Profil Usaha
            </div>
            <div className="text-[8px] text-text-secondary leading-tight mt-0.5 hidden sm:block">
              Informasi resmi
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-2 sm:p-2.5 shadow-xs">
            <div className="w-full aspect-[4/3] bg-surface rounded-md mb-1.5 flex items-center justify-center">
              <div className="w-4 h-4 rounded bg-accent-surface border border-brand-accent/30" />
            </div>
            <div className="text-[9px] sm:text-[10px] font-bold text-brand-primary leading-tight truncate">
              Koleksi Produk
            </div>
            <div className="text-[8px] text-text-secondary leading-tight mt-0.5 hidden sm:block">
              Katalog lengkap
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-2 sm:p-2.5 shadow-xs">
            <div className="w-full aspect-[4/3] bg-surface rounded-md mb-1.5 flex items-center justify-center">
              <div className="w-4 h-4 rounded bg-accent-surface border border-brand-accent/30" />
            </div>
            <div className="text-[9px] sm:text-[10px] font-bold text-brand-primary leading-tight truncate">
              Kontak Resmi
            </div>
            <div className="text-[8px] text-text-secondary leading-tight mt-0.5 hidden sm:block">
              Layanan cepat
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card 1: Katalog Produk (Top-Right) */}
      <div className="absolute -top-3 -right-1 sm:-top-4 sm:-right-3 md:-top-5 md:-right-4 bg-white rounded-xl border border-border shadow-md p-2.5 sm:p-3 flex items-start gap-2.5 max-w-[200px] sm:max-w-[220px] z-10 transition-transform duration-200 hover:-translate-y-0.5">
        <div className="w-8 h-8 rounded-lg bg-accent-surface border border-brand-accent/20 flex items-center justify-center flex-shrink-0 text-brand-accent-strong">
          <LayoutGrid className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xs font-bold text-brand-primary leading-tight">
            Katalog Produk
          </div>
          <p className="text-[10px] sm:text-[11px] text-text-secondary leading-snug mt-0.5">
            Produk tersusun rapi dan mudah dijelajahi.
          </p>
        </div>
      </div>

      {/* Floating Card 2: Alur Pemesanan (Mid-Left) */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-1 sm:-left-3 md:-left-4 bg-white rounded-xl border border-border shadow-md p-2.5 sm:p-3 flex items-start gap-2.5 max-w-[205px] sm:max-w-[225px] z-10 transition-transform duration-200 hover:-translate-y-0.5">
        <div className="w-8 h-8 rounded-lg bg-accent-surface border border-brand-accent/20 flex items-center justify-center flex-shrink-0 text-brand-accent-strong">
          <ClipboardList className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xs font-bold text-brand-primary leading-tight">
            Alur Pemesanan
          </div>
          <p className="text-[10px] sm:text-[11px] text-text-secondary leading-snug mt-0.5">
            Permintaan pelanggan lebih terstruktur.
          </p>
        </div>
      </div>

      {/* Floating Card 3: Email Bisnis (Bottom-Right) */}
      <div className="absolute -bottom-3 -right-1 sm:-bottom-4 sm:-right-2 md:-bottom-5 md:-right-3 bg-white rounded-xl border border-border shadow-md p-2.5 sm:p-3 flex items-start gap-2.5 max-w-[200px] sm:max-w-[220px] z-10 transition-transform duration-200 hover:-translate-y-0.5">
        <div className="w-8 h-8 rounded-lg bg-accent-surface border border-brand-accent/20 flex items-center justify-center flex-shrink-0 text-brand-accent-strong">
          <Mail className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xs font-bold text-brand-primary leading-tight">
            Email Bisnis
          </div>
          <p className="text-[10px] sm:text-[11px] text-text-secondary leading-snug mt-0.5">
            Komunikasi dengan identitas usaha.
          </p>
        </div>
      </div>
    </div>
  );
}
