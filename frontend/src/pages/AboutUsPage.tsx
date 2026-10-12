import { useLanguage } from '../locales/useLanguage';

export function AboutUsPage() {
	const { t } = useLanguage();

	return (
		<div className="w-full max-w-4xl p-6 bg-zinc-900 border border-zinc-700 rounded-xl text-center">
			<h1 className="text-2xl font-bold text-orange-400 mb-2">
				{t("app.aboutUs") || "About Us"}
			</h1>
			<p className="text-zinc-400 text-sm">Vista en construcción.</p>
		</div>
	);
}
