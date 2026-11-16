/**
 * Localization hook.
 * Category: Hook
 *
 * Responsible for:
 * - Providing components with access to the current language.
 * - Providing translation utilities.
 * - Providing language switching functionality.
 */

import { useCallback } from 'react';
import { useLanguageStore } from './useLanguageStore';
import { translations, type TranslationKey } from './translations';

export function useLanguage() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const resolve = useCallback(
    (path: TranslationKey | (string & {})): unknown => {
      const keys = path.split('.');
      let current: unknown = translations[language] || translations.es;

      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = (current as Record<string, unknown>)[key];
        } else {
          return undefined;
        }
      }

      return current;
    },
    [language]
  );

  // Accepts valid TranslationKeys or custom string fallbacks
  const t = useCallback(
    (path: TranslationKey | (string & {})): string => {
      const value = resolve(path);

      return typeof value === 'string' ? value : ''; // Triggers the || fallback in the UI
    },
    [resolve]
  );

  // Returns a translated list of strings (e.g. module requirements).
  const tList = useCallback(
    (path: TranslationKey | (string & {})): string[] => {
      const value = resolve(path);

      return Array.isArray(value)
        ? value.filter((entry): entry is string => typeof entry === 'string')
        : [];
    },
    [resolve]
  );

  return {
    language,
    setLanguage,
    t,
    tList,
  };
}
