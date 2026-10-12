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
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
	return (
		<div className="flex flex-col gap-1.5 w-full text-left">
			{label && (
				<label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
					{label}
				</label>
			)}
			<input
				className={`w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/80 focus:border-transparent transition-all ${className}`}
				{...props}
			/>
		</div>
	);
}
