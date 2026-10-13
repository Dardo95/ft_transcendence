/**
 * Reusable card component.
 * Category: Design System
 *
 * Part of the application's custom design system.
 *
 * Responsible for:
 * - Providing a consistent container for content.
 * - Supporting reusable visual variants.
 *
 * Does not:
 * - Contain feature-specific business logic.
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-zinc-700/80 bg-zinc-800/90 p-6 shadow-xl shadow-black/40 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
