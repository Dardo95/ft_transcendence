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
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger";
}

export function Button({
	variant = "primary",
	children,
	className = "",
	...props
}: ButtonProps) {
	const baseStyles =
		"px-4 py-2 font-bold rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		primary: "bg-purple-600 hover:bg-purple-700 text-white",
		secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
		danger: "bg-red-600 hover:bg-red-700 text-white",
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
