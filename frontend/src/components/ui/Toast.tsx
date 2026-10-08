/**
 * Reusable toast notification component.
 * Category: Design System
 *
 * Part of the application's custom design system.
 *
 * Responsible for:
 * - Displaying temporary user notifications.
 * - Supporting different notification types.
 * - Providing consistent notification styling.
 *
 * Does not:
 * - Decide when a notification should be displayed.
 * - Contain feature-specific business logic.
 */
import React from "react";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
	message: string;
	type?: "success" | "error" | "info";
	onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
	const typeStyles = {
		success: "bg-green-100 text-green-800 border-green-300",
		error: "bg-red-100 text-red-800 border-red-300",
		info: "bg-blue-100 text-blue-800 border-blue-300",
	};

	return (
		<div
			className={`fixed bottom-4 right-4 px-4 py-3 rounded border shadow-lg flex items-center gap-4 ${typeStyles[type]}`}
		>
			<span>{message}</span>
			<button onClick={onClose} className="font-bold hover:opacity-70">
				&times;
			</button>
		</div>
	);
}
