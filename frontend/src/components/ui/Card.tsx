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

import React from "react";

interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export function Card({ children, className = "" }: CardProps) {
	return (
		<div
			className={`bg-white rounded-xl shadow-md border border-gray-100 p-6 ${className}`}
		>
			{children}
		</div>
	);
}
