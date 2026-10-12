/**
 * Main application layout.
 * Category: Layout Component
 *
 * Responsible for:
 * - Defining the common application page structure.
 * - Rendering shared layout elements.
 * - Providing the main content area.
 *
 * Typical structure:
 * - Header
 * - Main content
 * - Footer
 *
 * Does not:
 * - Contain feature-specific business logic.
 */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SideDrawer } from "./SideDrawer";

export function AppLayout() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans">
			{/* Top navigation bar */}
			<Header onOpenDrawer={() => setIsDrawerOpen(true)} />

			{/* Collapsible left navigation drawer */}
			<SideDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
			/>

			{/* Main view container rendered by React Router */}
			<main className="flex-grow w-full p-4 md:p-8 flex flex-col items-center">
				<Outlet />
			</main>

			{/* Application footer */}
			<Footer />
		</div>
	);
}
