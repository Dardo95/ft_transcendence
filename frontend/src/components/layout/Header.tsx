/**
 * Layout Component: Header
 * Description: Top navigation bar indicating connection status and game title.
 */

import { useLanguage } from "../../languages"

export function Header() {
	const { setLanguage } = useLanguage();
	return (
		<header className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
			<h1 className="text-xl font-bold tracking-wider text-purple-400">
				ft_transcendence : Bomberman
			</h1>
			<div className="flex gap-2 mb-4">
				<button onClick={() => setLanguage("es")}>ES</button>
				<button onClick={() => setLanguage("en")}>EN</button>
				<button onClick={() => setLanguage("it")}>IT</button>
			</div>
		</header>
	);
}
