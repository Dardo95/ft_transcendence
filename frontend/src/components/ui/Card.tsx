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
			className={`bg-zinc-800/90 border border-zinc-700/80 rounded-2xl shadow-xl shadow-black/40 p-6 backdrop-blur-sm ${className}`}
		>
			{children}
		</div>
	);
}
