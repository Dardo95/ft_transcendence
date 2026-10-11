import { Link } from "react-router-dom";
import { useLanguage } from "../../locales/useLanguage";

interface SideDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
	const { t } = useLanguage();

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex">
			{/* Backdrop overlay */}
			<div
				className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Drawer slide-out panel */}
			<div className="relative w-72 max-w-[80vw] bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col justify-between z-10 shadow-2xl">
				<div className="flex flex-col gap-6">
					<div className="flex justify-between items-center border-b border-zinc-800 pb-4">
						<h2 className="text-lg font-bold text-orange-400 tracking-wider">
							{t("app.title") || "Kitchen Mayhem"}
						</h2>
						<button
							onClick={onClose}
							className="text-zinc-400 hover:text-white text-lg font-bold p-1"
							aria-label="Close navigation drawer"
						>
							✕
						</button>
					</div>

					{/* Navigation links */}
					<nav className="flex flex-col gap-2">
						<Link
							to="/lobby"
							onClick={onClose}
							className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2.5"
						>
							<span>🍳</span>
							<span>{t("app.lobby") || "Lobby"}</span>
						</Link>
						<Link
							to="/stats"
							onClick={onClose}
							className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2.5"
						>
							<span>🏆</span>
							<span>{t("app.stats") || "Game Statistics"}</span>
						</Link>
						<Link
							to="/rules"
							onClick={onClose}
							className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2.5"
						>
							<span>📖</span>
							<span>{t("app.aboutGame") || "Rules"}</span>
						</Link>

						<Link
							to="/about-us"
							onClick={onClose}
							className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2.5"
						>
							<span>👨‍🍳</span>
							<span>{t("app.aboutUs") || "About Us"}</span>
						</Link>
						<Link
							to="/project"
							onClick={onClose}
							className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2.5"
						>
							<span>📦</span>
							<span>{t("app.aboutProject") || "Project"}</span>
						</Link>
					</nav>
				</div>

				{/* Footer info inside drawer */}
				<div className="text-xs text-zinc-600 border-t border-zinc-900 pt-4">
					ft_transcendence — v1.0.0
				</div>
			</div>
		</div>
	);
}
