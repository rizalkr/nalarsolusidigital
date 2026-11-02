import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WaLinkButton } from './WaLinkButton';

describe('WaLinkButton', () => {
  it('renders anchor with correct attributes and default label', () => {
    render(<WaLinkButton href="https://wa.me/6281234567890" />);

    const link = screen.getByRole('link', { name: /wa/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://wa.me/6281234567890');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders custom label when provided', () => {
    render(<WaLinkButton href="https://wa.me/6281234567890" label="Chat WA" />);

    const link = screen.getByRole('link', { name: /chat wa/i });
    expect(link).toBeInTheDocument();
  });

  it('stops event propagation on click', () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick} data-testid="parent-container">
        <WaLinkButton href="https://wa.me/6281234567890" />
      </div>
    );

    const link = screen.getByRole('link', { name: /wa/i });
    fireEvent.click(link);

    expect(parentClick).not.toHaveBeenCalled();
  });
});
