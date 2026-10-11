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

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useLanguage } from "../../locales/useLanguage";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
	onOpenDrawer: () => void;
}

export function Header({ onOpenDrawer }: HeaderProps) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const { t } = useLanguage();
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const navigate = useNavigate();

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	async function handleLogout() {
		setIsDropdownOpen(false);
		await logout();
		navigate("/login", { replace: true });
	}

	return (
		<header className="w-full bg-zinc-950/90 border-b border-zinc-800 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
			{/* Left section: Drawer toggle button */}
			<button
				type="button"
				onClick={onOpenDrawer}
				className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors focus:outline-none"
				aria-label="Open sidebar menu"
			>
				<span className="text-xl leading-none">☰</span>
			</button>

			{/* Center section: Brand title */}
			<Link
				to="/lobby"
				className="text-lg md:text-xl font-extrabold text-orange-400 tracking-wider"
			>
				{t("app.title") || "Kitchen Mayhem"}
			</Link>

			{/* Right section: Language switcher and user profile dropdown */}
			<div className="flex items-center gap-3">
				<LanguageSwitcher />

				{/* User avatar menu */}
				<div className="relative" ref={dropdownRef}>
					<button
						type="button"
						onClick={() => setIsDropdownOpen((prev) => !prev)}
						className="w-9 h-9 rounded-full flex items-center justify-center p-0.5 hover:ring-2 hover:ring-orange-500/60 transition-all focus:outline-none"
						aria-label="User menu"
					>
						<img
							src={user?.avatarUrl || "/default-chef.png"}
							alt={user?.username || "Avatar"}
							className="w-full h-full rounded-full border border-zinc-700 bg-zinc-800 object-cover"
							onError={(e) => {
								// Fallback icon if image fails to load
								(e.target as HTMLImageElement).src =
									'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><text y="18" font-size="16">👨‍🍳</text></svg>';
							}}
						/>
					</button>

					{/* Contextual dropdown panel */}
					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in duration-150">
							<div className="px-4 py-2 border-b border-zinc-800">
								<p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
									{t("app.connectedAs") || "Logged in as"}
								</p>
								<p className="text-sm font-bold text-white truncate justify-center">
									{user?.username || "Chef"}
								</p>
							</div>

							{/* Profile navigation link */}
							<Link
								to="/profile"
								onClick={() => setIsDropdownOpen(false)}
								className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
							>
								<span>👤</span>
								<span>{t("app.profile") || "Profile"}</span>
							</Link>

							{/* Logout action */}
							<button
								type="button"
								onClick={handleLogout}
								className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors text-left"
							>
								<span>🚪</span>
								<span>{t("app.logout") || "Logout"}</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
