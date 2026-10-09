import { useLanguage } from "../../locales/useLanguage";

/**
 * Application footer.
 * Category: Layout Component
 *
 * Responsible for:
 * - Rendering global footer content.
 * - Displaying application information and links.
 *
 * Does not:
 * - Contain application business logic.
 */

export function Footer() {
	const { t } = useLanguage();

	return (
		<footer className="mt-auto p-6 bg-gray-100 text-center text-gray-500 text-sm border-t border-gray-200">
			<p>
				{" "}
				2026 ft_transcendence |{" "}
				<a href="/terms" className="hover:underline">
					{t("app.termsOfService")}
				</a>{" "}
				|{" "}
				<a href="/privacy" className="hover:underline">
					{t("app.privacyPolicy")}
				</a>
			</p>
		</footer>
	);
}
