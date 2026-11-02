'use client';

import { ExternalLink } from 'lucide-react';

export interface WaLinkButtonProps {
  href: string;
  className?: string;
  label?: string;
}

export function WaLinkButton({
  href,
  className = 'text-emerald-700 hover:underline inline-flex items-center gap-0.5',
  label = 'WA',
}: WaLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      <span>{label}</span>
      <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
    </a>
  );
}
