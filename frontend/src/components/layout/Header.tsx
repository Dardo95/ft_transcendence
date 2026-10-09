/**
 * Application header.
 * Category: Layout Component
 *
 * Responsible for:
 * - Rendering the main navigation.
 * - Displaying application branding.
 * - Displaying global user actions.
 *
 * Does not:
 * - Implement authentication logic.
 * - Perform API requests directly.
 */

import { useLanguage } from "../../locales/useLanguage"

export function Header() {
	const { setLanguage, t } = useLanguage();
	return (
		<header className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
			<h1 className="text-xl font-bold tracking-wider text-purple-400">
				{t("app.title")}
			</h1>
			<div className="flex gap-2 mb-4">
				<button onClick={() => setLanguage("es")}>ES</button>
				<button onClick={() => setLanguage("en")}>EN</button>
				<button onClick={() => setLanguage("it")}>IT</button>
			</div>
		</header>
	);
}
