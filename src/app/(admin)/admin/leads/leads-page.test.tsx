import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LeadsPage from './page';
import { Lead } from '@/lib/admin/leads/types';

const { mockLeadWithWa } = vi.hoisted(() => {
  const lead: Lead = {
    id: 'lead-test-123',
    tier: 1,
    sub_kelompok: '1A',
    sektor: 'Kontraktor Bangunan',
    kota: 'Surakarta',
    wilayah: 'Solo Raya',
    nama_bisnis: 'PT Bangun Jaya Solusi',
    tipe_usaha: 'Jasa Konstruksi',
    verified_gbp: true,
    jumlah_ulasan: 25,
    rating: 4.8,
    jumlah_foto: 12,
    nomor_telepon: '+62 812-3456-7890',
    nomor_telepon_normalized: '6281234567890',
    tipe_kontak: 'WhatsApp (Seluler)',
    link_wa: 'https://wa.me/6281234567890',
    status_web: 'Belum ada web',
    url_medsos: 'https://instagram.com/bangunjayasolusi',
    strategi_pitch: 'Tawarkan paket landing page portofolio proyek tender',
    alamat: 'Jl. Slamet Riyadi No. 100, Surakarta',
    link_maps: 'https://maps.google.com/?q=BangunJaya',
    status: 'terverifikasi',
    verification_status: 'terverifikasi',
    verification_source: 'Kop surat tender & cek live WA',
    batch_riset: '2026-11-01',
    catatan: 'Kontak aktif via PIC Pak Budi',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return { mockLeadWithWa: lead };
});

vi.mock('@/lib/admin/leads/repository', () => ({
  listLeads: vi.fn().mockResolvedValue({
    leads: [mockLeadWithWa],
    total: 1,
    page: 1,
    limit: 25,
    totalPages: 1,
  }),
}));

describe('LeadsPage (/admin/leads)', () => {
  it('renders leads table with realistic lead data and WA link button without runtime errors', async () => {
    const pageJsx = await LeadsPage({
      searchParams: Promise.resolve({}),
    });

    render(pageJsx);

    // Business name link
    expect(screen.getByText('PT Bangun Jaya Solusi')).toBeInTheDocument();

    // Phone number
    expect(screen.getByText('+62 812-3456-7890')).toBeInTheDocument();

    // WA button extracted to client component WaLinkButton
    const waLink = screen.getByRole('link', { name: /wa/i });
    expect(waLink).toBeInTheDocument();
    expect(waLink).toHaveAttribute('href', 'https://wa.me/6281234567890');
    expect(waLink).toHaveAttribute('target', '_blank');
    expect(waLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
