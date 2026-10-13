/**
 * Reusable input component.
 * Category: Design System
 *
 * Part of the application's custom design system.
 *
 * Responsible for:
 * - Rendering styled form inputs.
 * - Supporting common input states.
 * - Providing a consistent form control interface.
 *
 * Does not:
 * - Perform validation business logic.
 * - Manage form submission.
 */
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500/80 focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
