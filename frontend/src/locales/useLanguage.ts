/**
 * Localization hook.
 * Category: Hook
 *
 * Responsible for:
 * - Providing components with access to the current language.
 * - Providing translation utilities.
 * - Providing language switching functionality.
 *
 * Must be used inside LanguageProvider.
 */

import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error(
			"useLanguage must be used within a LanguageProvider. Make sure your component is wrapped in a LanguageProvider.",
		);
	}
	return context;
}
