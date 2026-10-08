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
