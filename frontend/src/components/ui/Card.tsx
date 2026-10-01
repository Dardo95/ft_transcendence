/**
 * File: src/components/ui/Card.tsx
 * Purpose: A generic container component that provides a consistent background, border-radius, and shadow.
 * Usage: Wrap other components (like LoginForm or PlayerStats) inside <Card> to group them visually.
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
