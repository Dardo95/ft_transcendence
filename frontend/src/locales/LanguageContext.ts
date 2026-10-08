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
