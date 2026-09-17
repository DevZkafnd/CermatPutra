'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function Modal({
  open,
  onClose,
  children,
  maxWidthClassName = 'max-w-2xl',
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClassName?: string;
}) {
  const [rendered, setRendered] = useState(open);
  const [active, setActive] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      setRendered(true);
      requestAnimationFrame(() => setActive(true));
      return;
    }

    setActive(false);
    closeTimer.current = window.setTimeout(() => {
      setRendered(false);
    }, 180);
  }, [open]);

  useEffect(() => {
    if (!rendered) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rendered, onClose]);

  if (!rendered) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[70] flex items-center justify-center px-4 transition-opacity duration-200',
        active ? 'opacity-100' : 'opacity-0'
      )}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={clsx(
          'relative w-full rounded-3xl bg-white shadow-2xl transition-all duration-200',
          maxWidthClassName,
          active ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        {children}
      </div>
    </div>
  );
}

