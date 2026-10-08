/**
 * Language context definition.
 * Category: Localization
 *
 * Responsible for:
 * - Defining the React context used by the localization system.
 * - Providing access to the current application language.
 *
 * Does not:
 * - Contain translation strings.
 * - Render UI.
 * - Perform API requests.
 */

import { createContext } from "react";
import type { SupportedLanguage, TranslationKey } from "./translations";

export interface LanguageContextType {
	language: SupportedLanguage;
	setLanguage: (lang: SupportedLanguage) => void;
	t: (path: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);
