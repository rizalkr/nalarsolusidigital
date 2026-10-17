'use client';

import React, { useRef } from 'react';
import { consultationModalStore } from '@/lib/consultationModalStore';

export interface ConsultationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ConsultationButton({
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}: ConsultationButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    consultationModalStore.open(buttonRef.current);
    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

