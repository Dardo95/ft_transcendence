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

import { Header } from "./Header";
import { Footer } from "./Footer";

interface AppLayoutProps {
	children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
			<Header />
			<main className="grow p-4 md:p-8">{children}</main>
			<Footer />
		</div>
	);
}
