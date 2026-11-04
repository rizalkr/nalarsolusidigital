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

  it('renders YouTube video iframe with autoplay and floating close button when youtubeUrl is set', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();
    const itemWithVideo = {
      ...sampleLayanan,
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    };

    render(
      <LayananModal
        item={itemWithVideo}
        isSelected={false}
        onToggleSelect={handleToggle}
        onClose={handleClose}
        labels={defaultLabels}
      />
    );

    const videoContainer = screen.getByTestId('layanan-modal-video');
    expect(videoContainer).toBeInTheDocument();

    const iframe = screen.getByTitle(`${itemWithVideo.title} video`);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1'
    );
    expect(iframe).toHaveAttribute('allow');
    expect(iframe.getAttribute('allow')).toContain('autoplay');

    // Close button on video should trigger handleClose
    const closeButtons = screen.getAllByRole('button', { name: defaultLabels.close });
    fireEvent.click(closeButtons[0]);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('falls back to icon header when youtubeUrl is absent or invalid', () => {
    const handleClose = vi.fn();
    const handleToggle = vi.fn();
    const itemWithoutVideo = {
      ...sampleLayanan,
      youtubeUrl: undefined,
    };

    render(
      <LayananModal
        item={itemWithoutVideo}
        isSelected={false}
        onToggleSelect={handleToggle}
        onClose={handleClose}
        labels={defaultLabels}
      />
    );

    expect(screen.queryByTestId('layanan-modal-video')).not.toBeInTheDocument();
    const closeButton = screen.getAllByRole('button', { name: defaultLabels.close })[0];
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

