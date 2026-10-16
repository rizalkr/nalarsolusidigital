import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DemoShowcase } from './DemoShowcase';

describe('DemoShowcase Component', () => {
  it('renders section with id="contoh-solusi" and scroll-margin classes to prevent header occlusion', () => {
    const { container } = render(<DemoShowcase />);
    const section = container.querySelector('section#contoh-solusi');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('scroll-mt-16');
    expect(section).toHaveClass('md:scroll-mt-20');
  });

  it('renders section heading (h2) and description', () => {
    render(<DemoShowcase />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Lihat Contoh Solusi Digital');
    expect(
      screen.getByText(/Berikut dua contoh implementasi yang dapat menjadi gambaran/i)
    ).toBeInTheDocument();
  });

  it('renders both demo cards with interactive demo badges', () => {
    render(<DemoShowcase />);
    expect(screen.getByText('Ruang Konveksi')).toBeInTheDocument();
    expect(screen.getByText('Rental Mobil')).toBeInTheDocument();

    const badges = screen.getAllByText('DEMO INTERAKTIF');
    expect(badges.length).toBe(2);
  });

  it('renders accurate features for Ruang Konveksi', () => {
    render(<DemoShowcase />);
    expect(screen.getByText('Katalog kategori produk')).toBeInTheDocument();
    expect(screen.getByText('Galeri produk')).toBeInTheDocument();
    expect(screen.getByText('Informasi produksi')).toBeInTheDocument();
    expect(screen.getByText('Kalkulator estimasi harga')).toBeInTheDocument();
    expect(screen.getByText('Formulir pesanan yang terhubung ke WhatsApp')).toBeInTheDocument();
  });

  it('renders accurate features for Rental Mobil', () => {
    render(<DemoShowcase />);
    expect(screen.getByText('Daftar armada beserta spesifikasi & tarif')).toBeInTheDocument();
    expect(screen.getByText('Detail paket lepas kunci & dengan pengemudi')).toBeInTheDocument();
    expect(screen.getByText('Akses cepat konsultasi ketersediaan')).toBeInTheDocument();
  });

  it('handles unconfigured demo URLs cleanly with disabled buttons and fallback indicators', () => {
    render(<DemoShowcase />);
    // In default environment without NEXT_PUBLIC_DEMO_... set, demo URLs are null
    const disabledButtons = screen.getAllByRole('button');
    expect(disabledButtons.length).toBe(2);
    disabledButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute('aria-disabled', 'true');
    });

    const soonBadges = screen.getAllByText('Segera Hadir');
    expect(soonBadges.length).toBe(2);
  });

  it('displays the disclaimer stating demos are interactive references and not completed client projects', () => {
    render(<DemoShowcase />);
    expect(
      screen.getByText(/Kedua contoh di atas merupakan demo interaktif untuk referensi solusi, bukan klaim proyek klien/i)
    ).toBeInTheDocument();
  });

  it('renders external links with target="_blank" and rel="noopener noreferrer" when URLs are configured', async () => {
    const { siteConfig } = await import('@/config/site');
    const originalDemos = [...siteConfig.demos];
    
    // Temporarily mock active URLs
    siteConfig.demos[0].url = 'https://konveksi.example.com';
    siteConfig.demos[1].url = 'https://rental.example.com';

    const { unmount } = render(<DemoShowcase />);
    
    const konveksiLink = screen.getByRole('link', { name: /Lihat Demo Konveksi/i });
    expect(konveksiLink).toHaveAttribute('href', 'https://konveksi.example.com');
    expect(konveksiLink).toHaveAttribute('target', '_blank');
    expect(konveksiLink).toHaveAttribute('rel', 'noopener noreferrer');

    const rentalLink = screen.getByRole('link', { name: /Lihat Demo Rental Mobil/i });
    expect(rentalLink).toHaveAttribute('href', 'https://rental.example.com');
    expect(rentalLink).toHaveAttribute('target', '_blank');
    expect(rentalLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Restore
    siteConfig.demos[0].url = originalDemos[0].url;
    siteConfig.demos[1].url = originalDemos[1].url;
    unmount();
  });
});
