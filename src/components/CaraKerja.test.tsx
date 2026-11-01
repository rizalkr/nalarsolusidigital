import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CaraKerja } from './CaraKerja';
import { siteConfig } from '@/config/site';

describe('CaraKerja Component (Cara Kami Bekerja)', () => {
  it('renders section with id="cara-kerja" and scroll-margin classes', () => {
    const { container } = render(<CaraKerja />);
    const section = container.querySelector('section#cara-kerja');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('scroll-mt-16');
    expect(section).toHaveClass('md:scroll-mt-20');
    expect(section).toHaveAttribute('aria-labelledby', 'cara-kerja-heading');
  });

  it('renders badge, heading (h2), and paragraph opener verbatim from config', () => {
    render(<CaraKerja />);
    expect(screen.getByText(siteConfig.caraKerja.badge)).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 2, name: siteConfig.caraKerja.title });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'cara-kerja-heading');

    expect(screen.getByText(siteConfig.caraKerja.description)).toBeInTheDocument();
  });

  it('renders all 3 guiding principles in a compact bar', () => {
    render(<CaraKerja />);

    siteConfig.caraKerja.principles.forEach((principle) => {
      const principleHeading = screen.getByRole('heading', { level: 3, name: principle.title });
      expect(principleHeading).toBeInTheDocument();
      expect(screen.getByText(principle.description)).toBeInTheDocument();
    });
  });

  it('renders all 3 numbered steps with numeric badges and step descriptions', () => {
    render(<CaraKerja />);

    siteConfig.caraKerja.steps.forEach((step) => {
      const stepTitleRegex = new RegExp(`Langkah ${step.step}: ${step.title}`, 'i');
      expect(screen.getByRole('heading', { level: 3, name: stepTitleRegex })).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
      expect(screen.getByText(`0${step.step}`)).toBeInTheDocument();
    });
  });

  it('renders contextual estimation notice', () => {
    render(<CaraKerja />);
    expect(
      screen.getByText(/Estimasi waktu dan ruang lingkup pengerjaan disepakati bersama/i)
    ).toBeInTheDocument();
  });
});

