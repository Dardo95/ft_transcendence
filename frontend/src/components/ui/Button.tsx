/**
 * Reusable button component.
 * Category: Design System
 *
 * Part of the application's custom design system.
 *
 * Responsible for:
 * - Rendering consistent button styles.
 * - Supporting common button variants and states.
 * - Providing a reusable button interface.
 *
 * Does not:
 * - Contain feature-specific logic.
 * - Perform API requests.
 */
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'w-full py-2.5 px-4 font-bold text-sm rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-600/20',
    secondary:
      'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
