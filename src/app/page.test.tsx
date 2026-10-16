import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';

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
        /“Ceritakan usaha Anda, kami bantu carikan solusi yang paling masuk akal.”/i
      )
    ).toBeInTheDocument();
  });

  it('renders the optimized logo image with proper alt text', () => {
    render(<HomePage />);
    const logo = screen.getByAltText('Nalar Solusi Digital');
    expect(logo).toBeInTheDocument();
  });

  it('displays the brand design tokens section', () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Design Tokens & Brand Palette/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Navy')).toBeInTheDocument();
    expect(screen.getByText('Teal')).toBeInTheDocument();
    expect(screen.getByText('Deep Teal')).toBeInTheDocument();
  });
});

