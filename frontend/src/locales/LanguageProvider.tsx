/**
 * Localization provider.
 * Category: Provider
 *
 * Responsible for:
 * - Providing the current language to the application.
 * - Managing language selection.
 * - Providing translation functionality through React context.
 *
 * Does not:
 * - Contain feature-specific UI logic.
 * - Perform API requests.
 */

import { useState, type ReactNode } from "react";
import { LanguageContext } from "./LanguageContext";
import { translations, type SupportedLanguage } from "./translations";

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguage] = useState<SupportedLanguage>("es");

	const t = (path: string): string => {
		const keys = path.split(".");
		let current: unknown = translations[language];

		for (const key of keys) {
			if (isTranslationObject(current) && key in current) {
				current = current[key];
			} else {
				let fallback: unknown = translations.es;
				for (const k of keys) {
					if (!isTranslationObject(fallback) || !(k in fallback)) {
						return path;
					}
					fallback = fallback[k];
				}
				return typeof fallback === "string" ? fallback : path;
			}
		}

		return typeof current === "string" ? current : path;
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

function isTranslationObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}
