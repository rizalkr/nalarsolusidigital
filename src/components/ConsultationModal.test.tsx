import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ConsultationModal,
  CONSULTATION_CATEGORIES,
} from './ConsultationModal';
import { consultationModalStore } from '@/lib/consultationModalStore';
import * as whatsappModule from '@/lib/whatsapp';

describe('ConsultationModal Component', () => {
  beforeEach(() => {
    consultationModalStore.reset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    consultationModalStore.reset();
    vi.restoreAllMocks();
  });

  it('does not render when closed', () => {
    render(<ConsultationModal isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title, description, and close button when open', () => {
    render(<ConsultationModal isOpen={true} />);

    const dialog = screen.getByRole('dialog', {
      name: /Mari Ceritakan Kebutuhan Usaha Anda/i,
    });
    expect(dialog).toBeInTheDocument();

    expect(
      screen.getByText(
        /Ceritakan kebutuhan atau kendala yang sedang Anda hadapi. Kami akan membantu mencari solusi digital yang paling masuk akal untuk usaha Anda./i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Tutup formulir konsultasi/i })
    ).toBeInTheDocument();
  });

  it('renders all four form fields with required attributes and placeholders', () => {
    render(<ConsultationModal isOpen={true} />);

    // Field A: Nama (required)
    const nameInput = screen.getByPlaceholderText('Nama Anda');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('aria-required', 'true');

    // Field B: Nama Usaha (optional)
    const businessInput = screen.getByPlaceholderText('Nama usaha Anda (opsional)');
    expect(businessInput).toBeInTheDocument();
    expect(businessInput).not.toHaveAttribute('aria-required', 'true');

    // Field C: Apa yang ingin Anda konsultasikan? (required dropdown)
    const categorySelect = screen.getByRole('combobox', {
      name: /Apa yang ingin Anda konsultasikan\?/i,
    });
    expect(categorySelect).toBeInTheDocument();
    expect(categorySelect).toHaveAttribute('aria-required', 'true');

    // Verify all 5 categories are present
    CONSULTATION_CATEGORIES.forEach((cat) => {
      expect(screen.getByRole('option', { name: cat })).toBeInTheDocument();
    });

    // Field D: Ceritakan Kebutuhan Anda (required textarea)
    const needsTextarea = screen.getByPlaceholderText(
      'Ceritakan kendala atau kebutuhan bisnis yang ingin Anda selesaikan...'
    );
    expect(needsTextarea).toBeInTheDocument();
    expect(needsTextarea).toHaveAttribute('aria-required', 'true');
    expect(needsTextarea).toHaveAttribute('maxLength', '1000');
  });

  it('validates required fields on submit and shows clear error messages', async () => {
    render(<ConsultationModal isOpen={true} />);

    const submitBtn = screen.getByRole('button', { name: /Lanjut ke WhatsApp/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Nama wajib diisi')).toBeInTheDocument();
    expect(screen.getByText('Pilih salah satu kategori kebutuhan')).toBeInTheDocument();
    expect(screen.getByText('Ceritakan kebutuhan atau kendala usaha Anda')).toBeInTheDocument();
  });

  it('clears validation error when user fills in the field', async () => {
    render(<ConsultationModal isOpen={true} />);

    const submitBtn = screen.getByRole('button', { name: /Lanjut ke WhatsApp/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Nama wajib diisi')).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText('Nama Anda');
    fireEvent.change(nameInput, { target: { value: 'Budi' } });

    expect(screen.queryByText('Nama wajib diisi')).not.toBeInTheDocument();
  });

  it('submits successfully with optional businessName omitted', async () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const buildUrlSpy = vi
      .spyOn(whatsappModule, 'buildWhatsAppUrl')
      .mockReturnValue('https://wa.me/6281234567890?text=MockMessage');

    render(<ConsultationModal isOpen={true} />);

    fireEvent.change(screen.getByPlaceholderText('Nama Anda'), {
      target: { value: 'Rina Wijaya' },
    });
    // Leave businessName empty
    fireEvent.change(
      screen.getByRole('combobox', { name: /Apa yang ingin Anda konsultasikan\?/i }),
      { target: { value: 'Kehadiran Digital' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(
        'Ceritakan kendala atau kebutuhan bisnis yang ingin Anda selesaikan...'
      ),
      { target: { value: 'Perlu website portofolio untuk jasa fotografi.' } }
    );

    const submitBtn = screen.getByRole('button', { name: /Lanjut ke WhatsApp/i });
    fireEvent.click(submitBtn);

    expect(buildUrlSpy).toHaveBeenCalled();
    const passedOptions = buildUrlSpy.mock.calls[0][0];
    expect(passedOptions?.message).toContain('Nama: Rina Wijaya');
    expect(passedOptions?.message).not.toContain('Nama Usaha');
    expect(passedOptions?.message).toContain('Kebutuhan: Kehadiran Digital');
    expect(passedOptions?.message).toContain(
      'Perlu website portofolio untuk jasa fotografi.'
    );

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://wa.me/6281234567890?text=MockMessage',
      '_blank',
      'noopener,noreferrer'
    );

    // Form inputs must not be cleared
    expect(screen.getByPlaceholderText('Nama Anda')).toHaveValue('Rina Wijaya');
  });

  it('includes businessName in the formatted message when provided', async () => {
    vi.spyOn(window, 'open').mockImplementation(() => null);
    const buildUrlSpy = vi
      .spyOn(whatsappModule, 'buildWhatsAppUrl')
      .mockReturnValue('https://wa.me/6281234567890?text=MockMessage');

    render(<ConsultationModal isOpen={true} />);

    fireEvent.change(screen.getByPlaceholderText('Nama Anda'), {
      target: { value: 'Hendro' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nama usaha Anda (opsional)'), {
      target: { value: 'Bengkel Motor Jaya' },
    });
    fireEvent.change(
      screen.getByRole('combobox', { name: /Apa yang ingin Anda konsultasikan\?/i }),
      { target: { value: 'Proses Pemesanan dan Administrasi' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(
        'Ceritakan kendala atau kebutuhan bisnis yang ingin Anda selesaikan...'
      ),
      { target: { value: 'Booking service online untuk pelanggan.' } }
    );

    fireEvent.click(screen.getByRole('button', { name: /Lanjut ke WhatsApp/i }));

    const passedOptions = buildUrlSpy.mock.calls[0][0];
    expect(passedOptions?.message).toContain('Nama Usaha: Bengkel Motor Jaya');
  });

  it('safely handles unconfigured WhatsApp without clearing form inputs', async () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockReturnValue(null);

    render(<ConsultationModal isOpen={true} />);

    fireEvent.change(screen.getByPlaceholderText('Nama Anda'), {
      target: { value: 'Doni' },
    });
    fireEvent.change(
      screen.getByRole('combobox', { name: /Apa yang ingin Anda konsultasikan\?/i }),
      { target: { value: 'Lainnya' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(
        'Ceritakan kendala atau kebutuhan bisnis yang ingin Anda selesaikan...'
      ),
      { target: { value: 'Konsultasi integrasi sistem internal.' } }
    );

    fireEvent.click(screen.getByRole('button', { name: /Lanjut ke WhatsApp/i }));

    expect(windowOpenSpy).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Saluran konsultasi WhatsApp sedang tidak tersedia saat ini/i)
    ).toBeInTheDocument();

    // Form inputs must NOT be cleared
    expect(screen.getByPlaceholderText('Nama Anda')).toHaveValue('Doni');
    expect(
      screen.getByPlaceholderText(
        'Ceritakan kendala atau kebutuhan bisnis yang ingin Anda selesaikan...'
      )
    ).toHaveValue('Konsultasi integrasi sistem internal.');
  });

  it('closes on Batal button click', () => {
    const handleClose = vi.fn();
    render(<ConsultationModal isOpen={true} onClose={handleClose} />);

    const cancelBtn = screen.getByRole('button', { name: /Batal/i });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on close icon button click', () => {
    const handleClose = vi.fn();
    render(<ConsultationModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: /Tutup formulir konsultasi/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key press', () => {
    const handleClose = vi.fn();
    render(<ConsultationModal isOpen={true} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop click without closing when clicking inside dialog', () => {
    const handleClose = vi.fn();
    render(<ConsultationModal isOpen={true} onClose={handleClose} />);

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(handleClose).not.toHaveBeenCalled();

    const backdrop = document.body.querySelector('[role="presentation"]');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open and restores on unmount', () => {
    const { unmount } = render(<ConsultationModal isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('restores focus to trigger element when closed', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open';
    document.body.appendChild(trigger);
    const triggerFocusSpy = vi.spyOn(trigger, 'focus');

    const triggerRef = { current: trigger };
    const handleClose = vi.fn();

    render(
      <ConsultationModal isOpen={true} onClose={handleClose} triggerRef={triggerRef} />
    );

    const cancelBtn = screen.getByRole('button', { name: /Batal/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(triggerFocusSpy).toHaveBeenCalled();
    });

    document.body.removeChild(trigger);
  });

  it('contains zero emoticons or emojis in rendered markup', () => {
    const { container } = render(<ConsultationModal isOpen={true} />);
    const text = container.textContent || '';
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    expect(emojiRegex.test(text)).toBe(false);
  });
});
