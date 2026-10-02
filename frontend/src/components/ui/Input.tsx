/**
 * File: frontend/src/components/ui/Input.tsx
 * Purpose: A standardized text input component for forms (login, chat, settings).
 * Usage: Wraps the native <input> with consistent borders, focus rings, and an optional label.
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
