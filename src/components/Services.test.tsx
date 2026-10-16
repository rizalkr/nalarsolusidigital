import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Services } from './Services';

describe('Services Component', () => {
  it('renders section with id="layanan" and scroll-margin classes to prevent header occlusion', () => {
    const { container } = render(<Services />);
    const section = container.querySelector('section#layanan');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('scroll-mt-16');
    expect(section).toHaveClass('md:scroll-mt-20');
  });

  it('renders section badge, heading (h2), and description', () => {
    render(<Services />);
    expect(screen.getByText('AREA SOLUSI')).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Solusi Digital Sesuai Kebutuhan Usaha Anda');
    expect(
      screen.getByText(/Mulai dari memperkuat kehadiran online hingga merapikan proses operasional/i)
    ).toBeInTheDocument();
  });

  it('renders all 4 solution area cards with h3 headings', () => {
    render(<Services />);
    const cards = [
      'Kehadiran Digital',
      'Informasi Produk dan Layanan',
      'Proses Pemesanan dan Administrasi',
      'Identitas dan Infrastruktur Digital',
    ];

    cards.forEach((title) => {
      const cardHeading = screen.getByRole('heading', { level: 3, name: title });
      expect(cardHeading).toBeInTheDocument();
    });
  });

  it('renders examples (Contoh Kebutuhan) for each card', () => {
    render(<Services />);

    const labels = screen.getAllByText('Contoh Kebutuhan:');
    expect(labels).toHaveLength(4);

    // Check Kehadiran Digital examples
    expect(screen.getByText('Website profil perusahaan.')).toBeInTheDocument();
    expect(screen.getByText('Landing page untuk layanan atau produk.')).toBeInTheDocument();

    // Check Informasi Produk dan Layanan examples
    expect(screen.getByText('Katalog produk atau armada.')).toBeInTheDocument();
    expect(screen.getByText('Galeri gambar dan informasi spesifikasi.')).toBeInTheDocument();

    // Check Proses Pemesanan dan Administrasi examples
    expect(screen.getByText('Formulir permintaan atau pemesanan.')).toBeInTheDocument();
    expect(screen.getByText('Pengumpulan informasi pelanggan secara terstruktur.')).toBeInTheDocument();

    // Check Identitas dan Infrastruktur Digital examples
    expect(screen.getByText('Email dengan domain perusahaan.')).toBeInTheDocument();
    expect(screen.getByText('Penggunaan dan pengaturan domain bisnis.')).toBeInTheDocument();
    expect(screen.getByText('Migrasi website ke HTTPS.')).toBeInTheDocument();
  });

  it('uses a 2-column grid layout on medium screens and above', () => {
    const { container } = render(<Services />);
    const grid = container.querySelector('.grid-cols-1.md\\:grid-cols-2');
    expect(grid).toBeInTheDocument();
  });
});
