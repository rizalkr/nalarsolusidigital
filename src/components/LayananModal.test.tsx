import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LayananModal } from './LayananModal';
import { siteConfig } from '@/config/site';

describe('LayananModal Component', () => {
  const defaultLabels = {
    select: siteConfig.layananSection.modalSelectLabel,
    selected: siteConfig.layananSection.modalSelectedLabel,
    close: siteConfig.layananSection.modalCloseLabel,
  };

  const sampleLayanan = siteConfig.layanan[0]; // GBP with note
  const samplePaket = siteConfig.paket[0]; // Paket Siap Tender

  it('renders modal details for LayananItem including description, deliverables, and note', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();

    render(
      <LayananModal
        item={sampleLayanan}
        isSelected={false}
        onToggleSelect={handleToggle}
        onClose={handleClose}
        labels={defaultLabels}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: sampleLayanan.title })).toBeInTheDocument();
    expect(screen.getByText(sampleLayanan.description)).toBeInTheDocument();

    sampleLayanan.deliverables.forEach((deliv) => {
      expect(screen.getByText(deliv)).toBeInTheDocument();
    });

    if (sampleLayanan.note) {
      expect(screen.getByText(sampleLayanan.note)).toBeInTheDocument();
    }
  });

  it('renders modal details for PaketItem including audience and includes', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();

    render(
      <LayananModal
        item={samplePaket}
        isSelected={false}
        onToggleSelect={handleToggle}
        onClose={handleClose}
        labels={defaultLabels}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: samplePaket.title })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(samplePaket.audience, 'i'))).toBeInTheDocument();

    samplePaket.includes.forEach((inc) => {
      expect(screen.getByText(inc)).toBeInTheDocument();
    });
  });

  it('displays select label when isSelected is false and triggers toggle and close on click', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();

    render(
      <LayananModal
        item={sampleLayanan}
        isSelected={false}
        onToggleSelect={handleToggle}
        onClose={handleClose}
        labels={defaultLabels}
      />
    );

    const primaryBtn = screen.getByRole('button', { name: defaultLabels.select });
    expect(primaryBtn).toBeInTheDocument();

    fireEvent.click(primaryBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('displays selected label when isSelected is true and triggers toggle and close on click', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();

    render(
      <LayananModal
        item={sampleLayanan}
        isSelected={true}
        onToggleSelect={handleToggle}
        onClose={handleClose}
        labels={defaultLabels}
      />
    );

    const primaryBtn = screen.getByRole('button', { name: defaultLabels.selected });
    expect(primaryBtn).toBeInTheDocument();

    fireEvent.click(primaryBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop click', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();

    render(
      <LayananModal
        item={sampleLayanan}
        isSelected={false}
        onToggleSelect={handleToggle}
        onClose={handleClose}
        labels={defaultLabels}
      />
    );

    const backdrop = screen.getByTestId('layanan-modal-backdrop');
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key press', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();

    render(
      <LayananModal
        item={sampleLayanan}
        isSelected={false}
        onToggleSelect={handleToggle}
        onClose={handleClose}
        labels={defaultLabels}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll when open and restores it when unmounted', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();

    const { unmount } = render(
      <LayananModal
        item={sampleLayanan}
        isSelected={false}
        onToggleSelect={handleToggle}
        onClose={handleClose}
        labels={defaultLabels}
      />
    );

    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});

