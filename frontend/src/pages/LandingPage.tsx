import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../locales/useLanguage";
import { useAuthStore } from "../features/auth/store/useAuthStore";

import { LoginForm } from "../features/auth/components/LoginForm";
import { RegisterForm } from "../features/auth/components/RegisterForm";

export function LandingPage() {
	const { t } = useLanguage();
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [authTab, setAuthTab] = useState<"login" | "register">("login");
	const { isAuthenticated, isLoading } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		// If the session is active and not loading, redirect to the lobby
		if (!isLoading && isAuthenticated) {
			navigate("/lobby", { replace: true });
		}
	}, [isAuthenticated, isLoading, navigate]);

	return (
		<div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 relative overflow-hidden select-none">
			{/* Effect of rising cooking vapor from the background */}
			<div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-orange-500/10 via-transparent to-transparent blur-2xl" />

			{/* Central Zone */}
			<main className="flex-grow flex flex-col items-center justify-center text-center px-4 z-10">
				<div className="flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-semibold tracking-wider text-amber-500 uppercase">
					<span>
						{t("app.upTitle") ||
							"Arcade Multiplayer Webgame inspired by Bomberman"}
					</span>
				</div>

				<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-500 mb-4 drop-shadow-md">
					{t("app.title") || "Kitchen Mayhem"}
				</h1>

				<p className="max-w-md text-zinc-400 text-sm md:text-base mb-10">
					{t("app.subTitle") ||
						"High cuisine, destruction, pressure cookers and unleashed steam. Register or log in to access the service."}
				</p>

				{/* Central Button with Pulse Ring Aura */}
				<button
					onClick={() => setIsAuthModalOpen(true)}
					className="relative group px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-xl shadow-orange-600/30 transition-all duration-300 hover:scale-105 active:scale-95"
				>
					{/* Pulse Ring Aura */}
					<span className="absolute -inset-1 rounded-xl bg-orange-500/40 blur-md group-hover:bg-orange-500/60 animate-pulse" />
					<span className="relative flex items-center gap-3">
						<span>
							{t("app.enterButton") || "Enter the Kitchen"}
						</span>
					</span>
				</button>
			</main>

			{/* Auth Modal (dialog with backdrop blur) */}
			{isAuthModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
						{/* Close modal button */}
						<button
							onClick={() => setIsAuthModalOpen(false)}
							className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl font-bold"
						>
							✕
						</button>

						{/* Pestañas: Iniciar Sesión / Registro */}
						<div className="flex border-b border-zinc-700 mb-6">
							<button
								onClick={() => setAuthTab("login")}
								className={`flex-1 py-2 font-semibold text-sm transition-colors border-b-2 ${
									authTab === "login"
										? "border-orange-500 text-orange-400"
										: "border-transparent text-zinc-400 hover:text-zinc-200"
								}`}
							>
								{t("app.login") || "Log In"}
							</button>
							<button
								onClick={() => setAuthTab("register")}
								className={`flex-1 py-2 font-semibold text-sm transition-colors border-b-2 ${
									authTab === "register"
										? "border-orange-500 text-orange-400"
										: "border-transparent text-zinc-400 hover:text-zinc-200"
								}`}
							>
								{t("app.register") || "Register"}
							</button>
						</div>

						{/* Formularios reactivos */}
						<div className="mb-6">
							{authTab === "login" ? (
								<LoginForm />
							) : (
								<RegisterForm />
							)}
						</div>

						{/* Separator */}
						<div className="relative flex py-2 items-center mb-4">
							<div className="flex-grow border-t border-zinc-700" />
							<span className="flex-shrink mx-4 text-zinc-500 text-xs uppercase">
								{t("auth.login.orContinueWith") ||
									"Or continue with"}
							</span>
							<div className="flex-grow border-t border-zinc-700" />
						</div>

						{/* Button for Google OAuth */}
						<button
							type="button"
							onClick={() =>
								alert("Próximamente: Integración Google OAuth")
							}
							className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-sm font-medium text-white transition-colors"
						>
							<svg className="w-4 h-4" viewBox="0 0 24 24">
								<path
									fill="#EA4335"
									d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
								/>
								<path
									fill="#4285F4"
									d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
								/>
								<path
									fill="#FBBC05"
									d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
								/>
								<path
									fill="#34A853"
									d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
								/>
							</svg>
							<span>
								{t("auth.login.continueGoogle") ||
									"Continue with Google"}
							</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
