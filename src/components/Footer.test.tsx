import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from './Footer';
import { siteConfig } from '@/config/site';
import * as whatsappModule from '@/lib/whatsapp';

describe('Footer Component', () => {
  it('renders footer element with clean surface styling', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-surface');
  });

  it('renders landscape logo inside a clean white container to prevent boundary clipping', () => {
    render(<Footer />);
    const logoImg = screen.getByAltText(siteConfig.logo.landscape.alt);
    expect(logoImg).toBeInTheDocument();

    // Verify parent container is a white rounded box
    const logoContainer = logoImg.closest('a');
    expect(logoContainer).toBeInTheDocument();
    expect(logoContainer).toHaveClass('bg-white');
    expect(logoContainer).toHaveAttribute('href', '#beranda');
  });

  it('renders brand description verbatim from PRD Section 8.8', () => {
    render(<Footer />);
    expect(screen.getByText(siteConfig.footer.description)).toBeInTheDocument();
  });

  it('wraps navigation links inside an accessible nav landmark', () => {
    render(<Footer />);
    const nav = screen.getByRole('navigation', { name: /Navigasi Footer/i });
    expect(nav).toBeInTheDocument();
  });

  it('renders all 4 navigation anchors derived from siteConfig: #layanan, #demo, #cara-kerja, #tentang', () => {
    render(<Footer />);
    const expectedAnchors = [
      { text: 'Layanan', href: '#layanan' },
      { text: 'Demo', href: '#demo' },
      { text: 'Cara Kerja', href: '#cara-kerja' },
      { text: 'Tentang', href: '#tentang' },
    ];

    expectedAnchors.forEach(({ text, href }) => {
      const link = screen.getByRole('link', { name: text });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('renders configured WhatsApp contact channel with target="_blank" and rel="noopener noreferrer"', () => {
    const spy = vi
      .spyOn(whatsappModule, 'buildWhatsAppUrl')
      .mockReturnValue('https://wa.me/6281234567890?text=Halo%20Nalar%20Solusi%20Digital');

    render(<Footer />);
    const waLink = screen.getByRole('link', { name: /WhatsApp Konsultasi/i });
    expect(waLink).toBeInTheDocument();
    expect(waLink).toHaveAttribute(
      'href',
      'https://wa.me/6281234567890?text=Halo%20Nalar%20Solusi%20Digital'
    );
    expect(waLink).toHaveAttribute('target', '_blank');
    expect(waLink).toHaveAttribute('rel', 'noopener noreferrer');

    spy.mockRestore();
  });

  it('displays fallback message when neither WhatsApp nor email is configured', () => {
    const spy = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockReturnValue(null);
    render(<Footer />);
    expect(screen.getByText(/Saluran kontak sedang dipersiapkan/i)).toBeInTheDocument();
    spy.mockRestore();
  });

  it('does not invent fake office addresses or social media accounts', () => {
    const { container } = render(<Footer />);
    const text = container.textContent || '';

    // No invented physical address
    expect(text).not.toMatch(/jalan |jl\.|gedung |ruko /i);
    // No invented social handles
    expect(text).not.toMatch(/instagram|facebook|twitter|linkedin|tiktok/i);
  });

  it('renders dynamic copyright year formatted through siteConfig copyright template', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const expectedText = siteConfig.footer.copyrightTemplate.replace('{year}', String(currentYear));
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('contains zero emoticons or emojis in the rendered markup', () => {
    const { container } = render(<Footer />);
    const text = container.textContent || '';
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    expect(emojiRegex.test(text)).toBe(false);
  });
});
