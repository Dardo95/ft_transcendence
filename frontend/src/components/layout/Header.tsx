/**
 * Layout Component: Header
 * Description: Top navigation bar indicating connection status and game title.
 */
export function Header() {
	return (
		<header className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
			<h1 className="text-xl font-bold tracking-wider text-purple-400">
				ft_transcendence : Bomberman
			</h1>
			<span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-green-400">
				Server: Online
			</span>
		</header>
	);
}
