import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('renders tab switcher and both demo cards with interactive demo badges', () => {
    render(<DemoShowcase />);

    // Tab switcher tabs
    const tabList = screen.getByRole('tablist', { name: /Pilihan Contoh Solusi/i });
    expect(tabList).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveTextContent('Ruang Konveksi');
    expect(tabs[1]).toHaveTextContent('Rental Mobil');

    // Both cards in DOM with badges
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
    // In default environment without NEXT_PUBLIC_DEMO_... set, demo CTA buttons are disabled
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
    const originalUrls = siteConfig.demos.map((d) => d.url);

    try {
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

      unmount();
    } finally {
      // Restore original URLs cleanly without mutating references
      siteConfig.demos.forEach((demo, idx) => {
        demo.url = originalUrls[idx];
      });
    }
  });

  it('switches active card and updates tab attributes when clicking a tab button', async () => {
    const user = userEvent.setup();
    render(<DemoShowcase />);

    const konveksiTab = screen.getByRole('tab', { name: 'Ruang Konveksi' });
    const rentalTab = screen.getByRole('tab', { name: 'Rental Mobil' });

    const konveksiCard = screen.getByTestId('demo-card-ruang-konveksi');
    const rentalCard = screen.getByTestId('demo-card-rental-mobil');

    // Initially Ruang Konveksi is active
    expect(konveksiTab).toHaveAttribute('aria-selected', 'true');
    expect(rentalTab).toHaveAttribute('aria-selected', 'false');
    expect(konveksiCard).toHaveAttribute('data-active', 'true');
    expect(rentalCard).toHaveAttribute('data-active', 'false');

    // Click Rental Mobil tab
    await user.click(rentalTab);

    expect(rentalTab).toHaveAttribute('aria-selected', 'true');
    expect(konveksiTab).toHaveAttribute('aria-selected', 'false');
    expect(rentalCard).toHaveAttribute('data-active', 'true');
    expect(konveksiCard).toHaveAttribute('data-active', 'false');

    // Click Ruang Konveksi tab
    await user.click(konveksiTab);

    expect(konveksiTab).toHaveAttribute('aria-selected', 'true');
    expect(rentalTab).toHaveAttribute('aria-selected', 'false');
    expect(konveksiCard).toHaveAttribute('data-active', 'true');
    expect(rentalCard).toHaveAttribute('data-active', 'false');
  });

  it('swaps active card and syncs tab switcher when the inactive card in the deck is clicked', async () => {
    const user = userEvent.setup();
    render(<DemoShowcase />);

    const konveksiTab = screen.getByRole('tab', { name: 'Ruang Konveksi' });
    const rentalTab = screen.getByRole('tab', { name: 'Rental Mobil' });
    const konveksiCard = screen.getByTestId('demo-card-ruang-konveksi');
    const rentalCard = screen.getByTestId('demo-card-rental-mobil');

    // Initially Ruang Konveksi is active, Rental Mobil is inactive
    expect(konveksiTab).toHaveAttribute('aria-selected', 'true');
    expect(rentalTab).toHaveAttribute('aria-selected', 'false');
    expect(konveksiCard).toHaveAttribute('data-active', 'true');
    expect(rentalCard).toHaveAttribute('data-active', 'false');

    // Click inactive Rental Mobil card
    await user.click(rentalCard);

    expect(rentalCard).toHaveAttribute('data-active', 'true');
    expect(konveksiCard).toHaveAttribute('data-active', 'false');
    expect(rentalTab).toHaveAttribute('aria-selected', 'true');
    expect(konveksiTab).toHaveAttribute('aria-selected', 'false');

    // Click inactive Ruang Konveksi card
    await user.click(konveksiCard);

    expect(konveksiCard).toHaveAttribute('data-active', 'true');
    expect(rentalCard).toHaveAttribute('data-active', 'false');
    expect(konveksiTab).toHaveAttribute('aria-selected', 'true');
    expect(rentalTab).toHaveAttribute('aria-selected', 'false');
  });

  it('supports keyboard navigation across tab switcher buttons with all directional keys', () => {
    render(<DemoShowcase />);

    const konveksiTab = screen.getByRole('tab', { name: 'Ruang Konveksi' });
    const rentalTab = screen.getByRole('tab', { name: 'Rental Mobil' });

    konveksiTab.focus();
    expect(document.activeElement).toBe(konveksiTab);

    // ArrowRight navigates to Rental Mobil
    fireEvent.keyDown(konveksiTab, { key: 'ArrowRight' });
    expect(rentalTab).toHaveAttribute('aria-selected', 'true');
    expect(konveksiTab).toHaveAttribute('aria-selected', 'false');
    expect(document.activeElement).toBe(rentalTab);

    // ArrowLeft navigates back to Ruang Konveksi
    fireEvent.keyDown(rentalTab, { key: 'ArrowLeft' });
    expect(konveksiTab).toHaveAttribute('aria-selected', 'true');
    expect(rentalTab).toHaveAttribute('aria-selected', 'false');
    expect(document.activeElement).toBe(konveksiTab);

    // ArrowDown navigates to Rental Mobil
    fireEvent.keyDown(konveksiTab, { key: 'ArrowDown' });
    expect(rentalTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(rentalTab);

    // ArrowUp navigates back to Ruang Konveksi
    fireEvent.keyDown(rentalTab, { key: 'ArrowUp' });
    expect(konveksiTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(konveksiTab);

    // End key navigates to last tab
    fireEvent.keyDown(konveksiTab, { key: 'End' });
    expect(rentalTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(rentalTab);

    // Home key navigates to first tab
    fireEvent.keyDown(rentalTab, { key: 'Home' });
    expect(konveksiTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(konveksiTab);
  });

  it('applies playing card stacking classes and mobile/desktop responsive styles across states', async () => {
    const user = userEvent.setup();
    render(<DemoShowcase />);

    const konveksiCard = screen.getByTestId('demo-card-ruang-konveksi');
    const rentalCard = screen.getByTestId('demo-card-rental-mobil');

    // Initial state: Konveksi active, Rental inactive
    expect(konveksiCard).toHaveClass('z-20');
    expect(konveksiCard).toHaveClass('scale-100');
    expect(konveksiCard).toHaveClass('rotate-0');
    expect(konveksiCard).toHaveClass('shadow-lg');

    expect(rentalCard).toHaveClass('z-10');
    expect(rentalCard).toHaveClass('cursor-pointer');
    expect(rentalCard).toHaveClass('scale-[0.96]');
    expect(rentalCard).toHaveClass('opacity-85');
    expect(rentalCard).toHaveClass('-translate-y-3.5');
    expect(rentalCard).toHaveClass('rotate-0');
    expect(rentalCard).toHaveClass('md:translate-x-4');
    expect(rentalCard).toHaveClass('md:rotate-2');

    // Both cards have smooth transition classes and top transform anchor
    expect(konveksiCard).toHaveClass('transition-all');
    expect(konveksiCard).toHaveClass('duration-300');
    expect(konveksiCard).toHaveClass('ease-out');
    expect(konveksiCard).toHaveClass('origin-top');
    expect(rentalCard).toHaveClass('transition-all');
    expect(rentalCard).toHaveClass('duration-300');
    expect(rentalCard).toHaveClass('ease-out');
    expect(rentalCard).toHaveClass('origin-top');

    // Swap state: Rental active, Konveksi inactive
    await user.click(rentalCard);

    expect(rentalCard).toHaveClass('z-20');
    expect(rentalCard).toHaveClass('scale-100');
    expect(rentalCard).toHaveClass('rotate-0');
    expect(rentalCard).toHaveClass('shadow-lg');

    expect(konveksiCard).toHaveClass('z-10');
    expect(konveksiCard).toHaveClass('cursor-pointer');
    expect(konveksiCard).toHaveClass('scale-[0.96]');
    expect(konveksiCard).toHaveClass('opacity-85');
    expect(konveksiCard).toHaveClass('-translate-y-3.5');
    expect(konveksiCard).toHaveClass('rotate-0');
    expect(konveksiCard).toHaveClass('md:translate-x-4');
    expect(konveksiCard).toHaveClass('md:rotate-2');
  });

  it('renders null gracefully when DemoDeck is provided an empty demos array', async () => {
    const { DemoDeck } = await import('@/components/DemoDeck');
    const { container } = render(<DemoDeck demos={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
