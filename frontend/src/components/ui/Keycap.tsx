import type { ReactNode } from 'react';
import { UI } from '@/components/layout/layoutStyles';

interface KeycapProps {
  children: ReactNode;
  wide?: boolean;
  accent?: boolean;
  ariaLabel?: string;
}

export function Keycap({
  children,
  wide = false,
  accent = false,
  ariaLabel,
}: KeycapProps) {
  const className = [
    UI.keycap.base,
    wide ? UI.keycap.wide : UI.keycap.standard,
    accent ? UI.keycap.accent : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <kbd className={className} aria-label={ariaLabel}>
      {children}
    </kbd>
  );
}
