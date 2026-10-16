import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HowItWorks } from './HowItWorks';
import { siteConfig } from '@/config/site';

describe('HowItWorks Component', () => {
  it('renders section with id="cara-kerja" and scroll margin classes to prevent navbar occlusion', () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector('section#cara-kerja');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('scroll-mt-16');
    expect(section).toHaveClass('md:scroll-mt-20');
  });

  it('renders section title as an h2 heading matching siteConfig', () => {
    render(<HowItWorks />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(siteConfig.howItWorks.title);
  });

  it('renders section description verbatim from PRD Section 8.5', () => {
    render(<HowItWorks />);
    expect(screen.getByText(siteConfig.howItWorks.description)).toBeInTheDocument();
  });

  it('renders all 3 numbered steps with titles and descriptions', () => {
    render(<HowItWorks />);

    // Step 1: Konsultasi
    expect(screen.getByRole('heading', { level: 3, name: /Langkah 1: Konsultasi/i })).toBeInTheDocument();
    expect(screen.getByText(siteConfig.howItWorks.steps[0].description)).toBeInTheDocument();

    // Step 2: Menentukan Solusi
    expect(screen.getByRole('heading', { level: 3, name: /Langkah 2: Menentukan Solusi/i })).toBeInTheDocument();
    expect(screen.getByText(siteConfig.howItWorks.steps[1].description)).toBeInTheDocument();

    // Step 3: Pengerjaan Solusi
    expect(screen.getByRole('heading', { level: 3, name: /Langkah 3: Pengerjaan Solusi/i })).toBeInTheDocument();
    expect(screen.getByText(siteConfig.howItWorks.steps[2].description)).toBeInTheDocument();

    // Verbatim text verification for steps 2 and 3
    expect(
      screen.getByText('Kami memetakan kebutuhan dan menyepakati bentuk solusi serta ruang lingkup pengerjaannya.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Solusi yang disepakati kami kerjakan, kemudian hasilnya ditinjau bersama Anda sebelum digunakan.')
    ).toBeInTheDocument();
  });

  it('renders numeric indicators 01, 02, 03 for each step', () => {
    render(<HowItWorks />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('does not contain fixed turnaround durations or unbacked guarantees', () => {
    const { container } = render(<HowItWorks />);
    const text = container.textContent || '';

    // Must not promise fixed days or unverified guarantees
    expect(text).not.toMatch(/garansi \d+/i);
    expect(text).not.toMatch(/\d+ hari selesai/i);
    expect(text).not.toMatch(/pasti berhasil/i);
  });

  it('contains zero emoticons or emojis in the rendered markup', () => {
    const { container } = render(<HowItWorks />);
    const text = container.textContent || '';
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    expect(emojiRegex.test(text)).toBe(false);
  });
});
