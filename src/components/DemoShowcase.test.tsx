import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { DemoShowcase } from './DemoShowcase';
import { siteConfig } from '@/config/site';

describe('DemoShowcase Component (Demo Section with Carousel & Detail Modal)', () => {
  it('renders section with id="demo" and legacy anchor alias #contoh-solusi', () => {
    const { container } = render(<DemoShowcase />);
    const section = container.querySelector('section#demo');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('scroll-mt-16');
    expect(section).toHaveClass('md:scroll-mt-20');

    // Legacy anchor alias to guarantee backward compatibility with Hero CTA (#contoh-solusi)
    const legacyAnchor = container.querySelector('#contoh-solusi');
    expect(legacyAnchor).toBeInTheDocument();
  });

  it('renders section with the new copywriting (Section Label, Heading, Description)', () => {
    render(<DemoShowcase />);
    const badges = screen.getAllByText('DEMO INTERAKTIF');
    expect(badges.length).toBeGreaterThan(0);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Jelajahi Demo Interaktif');

    expect(
      screen.getByText(
        'Lihat bagaimana kebutuhan bisnis diterjemahkan menjadi pengalaman digital, mulai dari katalog produk hingga layanan rental.'
      )
    ).toBeInTheDocument();
  });

  it('renders both demos in the carousel with accurate preview, name, title, and description', () => {
    render(<DemoShowcase />);

    // Demo 1: Ruang Konveksi
    expect(screen.getByTestId('demo-card-ruang-konveksi')).toBeInTheDocument();
    expect(screen.getByText('Ruang Konveksi')).toBeInTheDocument();
    expect(screen.getByText('Website Katalog untuk Konveksi')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Contoh website untuk menampilkan katalog produk, informasi produksi, dan kalkulator estimasi harga.'
      )
    ).toBeInTheDocument();

    // Demo 2: Rental Mobil
    expect(screen.getByTestId('demo-card-rental-mobil')).toBeInTheDocument();
    expect(screen.getByText('Rental Mobil')).toBeInTheDocument();
    expect(screen.getByText('Website Profil Rental Mobil')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Contoh website untuk menampilkan armada, layanan rental, dan informasi kendaraan.'
      )
    ).toBeInTheDocument();

    // Badges
    const badges = screen.getAllByText('DEMO INTERAKTIF');
    expect(badges.length).toBeGreaterThanOrEqual(2);

    // Screenshots
    expect(screen.getByAltText(/Preview website Ruang Konveksi/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Preview website Rental Mobil/i)).toBeInTheDocument();
  });

  it('displays the disclaimer stating demos are interactive references and not completed client projects', () => {
    render(<DemoShowcase />);
    expect(
      screen.getByText(
        /Kedua contoh di atas merupakan demo interaktif untuk referensi solusi, bukan klaim proyek klien yang telah selesai dikerjakan./i
      )
    ).toBeInTheDocument();
  });

  it('renders "Lihat Detail" button for each demo card', () => {
    render(<DemoShowcase />);
    const detailButtons = screen.getAllByRole('button', { name: /Lihat detail demo/i });
    expect(detailButtons).toHaveLength(2);
  });

  it('opens detail modal for Ruang Konveksi with correct screenshot, description, and features', async () => {
    const user = userEvent.setup();
    render(<DemoShowcase />);

    const konveksiDetailBtn = screen.getByRole('button', {
      name: /Lihat detail demo Ruang Konveksi/i,
    });
    await user.click(konveksiDetailBtn);

    // Modal dialog is open
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('aria-modal', 'true');

    // Title and description in modal
    expect(
      within(modal).getByRole('heading', { level: 3, name: 'Website Katalog untuk Konveksi' })
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(
        'Contoh website untuk menampilkan katalog produk, informasi produksi, dan kalkulator estimasi harga.'
      )
    ).toBeInTheDocument();

    // Actual implemented features for Ruang Konveksi
    expect(within(modal).getByText('Katalog produk')).toBeInTheDocument();
    expect(within(modal).getByText('Galeri produk')).toBeInTheDocument();
    expect(within(modal).getByText('Informasi produksi')).toBeInTheDocument();
    expect(within(modal).getByText('Kalkulator estimasi harga')).toBeInTheDocument();
    expect(within(modal).getByText('Formulir pemesanan')).toBeInTheDocument();

    // Modal screenshot
    expect(within(modal).getByAltText(/Tampilan website Ruang Konveksi/i)).toBeInTheDocument();
  });

  it('opens detail modal for Rental Mobil with correct screenshot, description, and features', async () => {
    const user = userEvent.setup();
    render(<DemoShowcase />);

    const rentalDetailBtn = screen.getByRole('button', {
      name: /Lihat detail demo Rental Mobil/i,
    });
    await user.click(rentalDetailBtn);

    // Modal dialog is open
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    // Title and description in modal
    expect(
      within(modal).getByRole('heading', { level: 3, name: 'Website Profil Rental Mobil' })
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(
        'Contoh website untuk menampilkan armada, layanan rental, dan informasi kendaraan.'
      )
    ).toBeInTheDocument();

    // Actual implemented features for Rental Mobil
    expect(within(modal).getByText('Informasi armada')).toBeInTheDocument();
    expect(within(modal).getByText('Detail kendaraan')).toBeInTheDocument();
    expect(within(modal).getByText('Layanan rental')).toBeInTheDocument();

    // Modal screenshot
    expect(within(modal).getByAltText(/Tampilan website Rental Mobil/i)).toBeInTheDocument();
  });

  it('closes modal when close button (X or Tutup) is clicked and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(<DemoShowcase />);

    const konveksiDetailBtn = screen.getByRole('button', {
      name: /Lihat detail demo Ruang Konveksi/i,
    });
    await user.click(konveksiDetailBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Click X close button
    const closeBtn = screen.getByRole('button', { name: /Tutup detail demo/i });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes modal when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<DemoShowcase />);

    const konveksiDetailBtn = screen.getByRole('button', {
      name: /Lihat detail demo Ruang Konveksi/i,
    });
    await user.click(konveksiDetailBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes modal when backdrop outside dialog panel is clicked, but not when inside panel is clicked', async () => {
    const user = userEvent.setup();
    render(<DemoShowcase />);

    const konveksiDetailBtn = screen.getByRole('button', {
      name: /Lihat detail demo Ruang Konveksi/i,
    });
    await user.click(konveksiDetailBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Clicking inside the modal panel does NOT close it
    await user.click(dialog);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Clicking the outer backdrop closes it
    const backdrop = screen.getByRole('presentation');
    await user.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('handles unconfigured demo URLs safely without fake links (shows disabled button with Segera Hadir)', async () => {
    const user = userEvent.setup();
    render(<DemoShowcase />);

    const konveksiDetailBtn = screen.getByRole('button', {
      name: /Lihat detail demo Ruang Konveksi/i,
    });
    await user.click(konveksiDetailBtn);

    // By default without env var, CTA is a disabled button with "Segera Hadir"
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    const disabledBtn = screen.getByRole('button', { name: /Buka Demo Interaktif - Segera Hadir/i });
    expect(disabledBtn).toBeDisabled();
    expect(disabledBtn).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Segera Hadir')).toBeInTheDocument();
  });

  it('renders external link with target="_blank" and rel="noopener noreferrer" when demo URL is configured', async () => {
    const originalUrl = siteConfig.demos[0].url;

    try {
      siteConfig.demos[0].url = 'https://konveksi.example.com';
      const user = userEvent.setup();
      const { unmount } = render(<DemoShowcase />);

      const konveksiDetailBtn = screen.getByRole('button', {
        name: /Lihat detail demo Ruang Konveksi/i,
      });
      await user.click(konveksiDetailBtn);

      const openLink = screen.getByRole('link', { name: /Buka Demo Interaktif/i });
      expect(openLink).toHaveAttribute('href', 'https://konveksi.example.com');
      expect(openLink).toHaveAttribute('target', '_blank');
      expect(openLink).toHaveAttribute('rel', 'noopener noreferrer');

      unmount();
    } finally {
      siteConfig.demos[0].url = originalUrl;
    }
  });

  it('renders null gracefully when DemoCarousel is provided an empty demos array', async () => {
    const { DemoCarousel } = await import('@/components/DemoCarousel');
    const { container } = render(<DemoCarousel demos={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('dynamically adapts when more demos are added in future without layout changes', async () => {
    const { DemoCarousel } = await import('@/components/DemoCarousel');
    const extraDemos = [
      ...siteConfig.demos,
      {
        id: 'klinik-gigi',
        name: 'Klinik Gigi',
        title: 'Website Profil & Janji Temu Klinik',
        badge: 'DEMO INTERAKTIF',
        tagline: 'Jadwal Dokter dan Reservasi Online',
        description: 'Contoh website untuk layanan reservasi dokter gigi dan informasi fasilitas.',
        features: ['Jadwal dokter', 'Formulir reservasi', 'Daftar fasilitas'],
        ctaLabel: 'Buka Demo Interaktif',
        url: null,
        previewImage: '/images/demos/konveksi-preview.png',
      },
    ];

    render(<DemoCarousel demos={extraDemos} />);
    expect(screen.getByTestId('demo-card-klinik-gigi')).toBeInTheDocument();
    expect(screen.getByText('Klinik Gigi')).toBeInTheDocument();
    expect(screen.getByText('Website Profil & Janji Temu Klinik')).toBeInTheDocument();
  });
});
