import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';
import { siteConfig } from '@/config/site';

describe('HomePage (Phase 1 Foundation)', () => {
  it('renders the brand name heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Nalar Solusi Digital');
  });

  it('renders the mandatory tagline verbatim', () => {
    render(<HomePage />);
    expect(
      screen.getByText(
        new RegExp(siteConfig.tagline, 'i')
      )
    ).toBeInTheDocument();
  });

  it('renders the optimized logo image with proper alt text from siteConfig', () => {
    render(<HomePage />);
    const logo = screen.getByAltText(siteConfig.logo.landscape.alt);
    expect(logo).toBeInTheDocument();
  });

  it('displays the brand design tokens section with all 9 PRD tokens', () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Design Tokens & Brand Palette/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Navy \(brand-primary\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Teal \(brand-accent\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Deep Teal \(brand-accent-strong\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Soft Teal \(accent-surface\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Soft Gray \(surface\)/i)).toBeInTheDocument();
    expect(screen.getByText(/White \(background\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Ink \(text-primary\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Slate \(text-secondary\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Light Border \(border\)/i)).toBeInTheDocument();
  });

  it('displays the Phase 1 review status and WhatsApp configuration indicator', () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Fase 1: Project Foundation, Design Tokens, & Global Layout/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp:/i)).toBeInTheDocument();
  });
});
