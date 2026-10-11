import { Link } from "react-router-dom";
import { useLanguage } from "../../locales/useLanguage";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function FooterPublic() {
	const { t } = useLanguage();

	return (
		<footer className="w-full py-4 text-center text-xs text-zinc-500 border-t border-zinc-800/80 bg-slate-950/80 backdrop-blur-sm z-10">
			{/* Language Switcher */}
			{/* <div className="flex justify-center items-center gap-2"> */}
			<div className="flex justify-center items-center gap-2 mb-3">
				<span className="text-zinc-500 text-xs"></span>
				<LanguageSwitcher />
			</div>

			{/* Legal and About Links */}
			<div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
				<Link
					to="/about-us"
					className="hover:text-zinc-300 transition-colors"
				>
					{t("app.aboutUs") || "About Us"}
				</Link>
				<span>•</span>
				<Link
					to="/rules"
					className="hover:text-zinc-300 transition-colors"
				>
					{t("app.aboutGame") || "About the Game"}
				</Link>
				<span>•</span>
				<Link
					to="/project"
					className="hover:text-zinc-300 transition-colors"
				>
					{t("app.aboutProject") || "About the Project"}
				</Link>
				<span>•</span>
				<Link
					to="/terms"
					className="hover:text-zinc-300 transition-colors"
				>
					{t("app.termsOfService") || "Terms of Service"}
				</Link>
				<span>•</span>
				<Link
					to="/privacy"
					className="hover:text-zinc-300 transition-colors"
				>
					{t("app.privacyPolicy") || "Privacy Policy"}
				</Link>
			</div>
		</footer>
	);
}
