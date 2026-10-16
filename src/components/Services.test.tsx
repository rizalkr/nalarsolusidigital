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

  it('renders section heading (h2) and description', () => {
    render(<Services />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Solusi Digital Sesuai Kebutuhan Usaha Anda');
    expect(
      screen.getByText(/Setiap usaha memiliki kebutuhan yang berbeda/i)
    ).toBeInTheDocument();
  });

  it('renders all 3 service cards with h3 headings', () => {
    render(<Services />);
    const cards = [
      'Website Company Profile',
      'Katalog Produk atau Armada',
      'Alur Pemesanan',
    ];

    cards.forEach((title) => {
      const cardHeading = screen.getByRole('heading', { level: 3, name: title });
      expect(cardHeading).toBeInTheDocument();
    });
  });

  it('renders capabilities for each service card', () => {
    render(<Services />);

    // Check Company Profile capabilities
    expect(screen.getByText('Profil bisnis')).toBeInTheDocument();
    expect(screen.getByText('Daftar layanan')).toBeInTheDocument();

    // Check Catalog capabilities
    expect(screen.getByText('Katalog produk')).toBeInTheDocument();
    expect(screen.getByText('Katalog kendaraan')).toBeInTheDocument();

    // Check Order Flow capabilities
    expect(screen.getByText('Formulir permintaan')).toBeInTheDocument();
    expect(screen.getByText('Ringkasan pesanan')).toBeInTheDocument();
  });

  it('ensures order flow indicates flexible non-exclusive channel integration', () => {
    render(<Services />);
    expect(
      screen.getByText(/Dapat diintegrasikan ke WhatsApp, formulir terstruktur, atau alur kerja operasional lain/i)
    ).toBeInTheDocument();
  });
});
