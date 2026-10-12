import { useLanguage } from "../../locales/useLanguage";

type Language = "es" | "en" | "it";

export function LanguageSwitcher() {
	const { language, setLanguage } = useLanguage();

	return (
		<div className="inline-flex items-center p-1 bg-zinc-900 border border-zinc-700 rounded-lg gap-1">
			{(["es", "en", "it"] as Language[]).map((lang) => (
				<button
					key={lang}
					type="button"
					onClick={() => setLanguage(lang)}
					className={`px-2.5 py-1 text-xs font-bold rounded uppercase transition-colors ${
						language === lang
							? "bg-orange-500 text-white shadow-sm"
							: "text-zinc-400 hover:text-white hover:bg-zinc-800"
					}`}
				>
					{lang}
				</button>
			))}
		</div>
	);
}
