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
		<div className="flex flex-col gap-1 w-full">
			{label && (
				<label className="text-sm font-medium text-gray-700">
					{label}
				</label>
			)}
			<input
				className={`px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
				{...props}
			/>
		</div>
	);
}
