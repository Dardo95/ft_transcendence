/**
 * Layout Component: AppLayout
 * Description: The main shell wrapping all pages with Header and Footer.
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
			<main className="flex-grow p-4 md:p-8">{children}</main>
			<Footer />
		</div>
	);
}
