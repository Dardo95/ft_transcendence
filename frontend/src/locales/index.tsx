import { createContext, useContext, useState, type ReactNode } from "react";
import { authEs } from "./es/auth";
import { authEn } from "./en/auth";
import { authIt } from "./it/auth";

export const translations = {
	es: { auth: authEs },
	en: { auth: authEn },
	it: { auth: authIt },
} as const;

export type SupportedLanguage = keyof typeof translations;
type TranslationTree = typeof translations.es;

type Leaves<T> = T extends object
	? {
			[K in keyof T]: T[K] extends object
				? `${Extract<K, string>}.${Leaves<T[K]>}`
				: Extract<K, string>;
		}[keyof T]
	: "";

export type TranslationKey = Leaves<TranslationTree>;

interface LanguageContextType {
	language: SupportedLanguage;
	setLanguage: (lang: SupportedLanguage) => void;
	t: (path: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguage] = useState<SupportedLanguage>("es");

	const t = (path: TranslationKey): string => {
		const keys = path.split(".");
		let current: any = translations[language];

		for (const key of keys) {
			if (current && key in current) {
				current = current[key];
			} else {
				let fallback: any = translations.es;
				for (const k of keys) {
					fallback = fallback?.[k];
				}
				return fallback || path;
			}
		}

		return typeof current === "string" ? current : path;
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error(
			"useLanguage debe usarse dentro de un LanguageProvider",
		);
	}
	return context;
};
