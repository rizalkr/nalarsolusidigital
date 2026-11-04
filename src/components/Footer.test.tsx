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

  it('renders all 5 navigation anchors derived from siteConfig: #layanan, #demo, #cara-kerja, #faq, #kontak', () => {
    render(<Footer />);
    const expectedAnchors = [
      { text: 'Solusi', href: '#layanan' },
      { text: 'Demo', href: '#demo' },
      { text: 'Cara Kerja', href: '#cara-kerja' },
      { text: 'FAQ', href: '#faq' },
      { text: 'Kontak', href: '#kontak' },
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
    const waLink = screen.getByRole('link', { name: /Konsultasi via WhatsApp/i });
    expect(waLink).toBeInTheDocument();
    expect(waLink).toHaveAttribute(
      'href',
      'https://wa.me/6281234567890?text=Halo%20Nalar%20Solusi%20Digital'
    );
    expect(waLink).toHaveAttribute('target', '_blank');
    expect(waLink).toHaveAttribute('rel', 'noopener noreferrer');

    spy.mockRestore();
  });

  it('renders configured email contact channel with mailto scheme', () => {
    const originalEmail = siteConfig.contact.email;
    siteConfig.contact.email = 'info@nalarsolusidigital.my.id';

    render(<Footer />);
    const emailLink = screen.getByRole('link', { name: 'info@nalarsolusidigital.my.id' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:info@nalarsolusidigital.my.id');

    siteConfig.contact.email = originalEmail;
  });

  it('renders configured Instagram channel with target="_blank" and rel="noopener noreferrer"', () => {
    render(<Footer />);
    const igLink = screen.getByRole('link', { name: /Instagram/i });
    expect(igLink).toBeInTheDocument();
    expect(igLink).toHaveAttribute('href', 'https://www.instagram.com/nalarsolusidigital/');
    expect(igLink).toHaveAttribute('target', '_blank');
    expect(igLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays fallback message when no contact channel is configured', () => {
    const waSpy = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockReturnValue(null);
    const originalEmail = siteConfig.contact.email;
    const originalInstagram = siteConfig.social.instagram;
    siteConfig.contact.email = null;
    siteConfig.social.instagram = undefined;

    render(<Footer />);
    expect(screen.getByText(/Saluran kontak sedang dipersiapkan/i)).toBeInTheDocument();

    siteConfig.contact.email = originalEmail;
    siteConfig.social.instagram = originalInstagram;
    waSpy.mockRestore();
  });

  it('does not invent fake office addresses or unconfigured social media accounts', () => {
    const { container } = render(<Footer />);
    const text = container.textContent || '';

    // No invented physical address
    expect(text).not.toMatch(/jalan |jl\.|gedung |ruko /i);
    // No unconfigured social handles
    expect(text).not.toMatch(/facebook|twitter|linkedin|tiktok/i);
  });

  it('renders dynamic copyright year formatted through siteConfig copyright template', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const expectedText = siteConfig.footer.copyrightTemplate.replace('{year}', String(currentYear));
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('renders official brand tagline verbatim at the bottom right', () => {
    render(<Footer />);
    expect(
      screen.getByText('Ceritakan usaha Anda, kami bantu carikan solusi yang paling masuk akal.')
    ).toBeInTheDocument();
  });

  it('contains zero emoticons or emojis in the rendered markup', () => {
    const { container } = render(<Footer />);
    const text = container.textContent || '';
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    expect(emojiRegex.test(text)).toBe(false);
  });
});
