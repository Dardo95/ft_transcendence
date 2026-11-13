/**
 * Translation registry.
 * Category: Localization
 *
 * Responsible for:
 * - Registering available application translations.
 * - Mapping language codes to translation resources.
 *
 * Does not:
 * - Manage the current language.
 * - Render UI.
 * - Contain application logic.
 */

import { authEs } from './es/auth';
import { authEn } from './en/auth';
import { authIt } from './it/auth';
import { appEs } from './es/app';
import { appEn } from './en/app';
import { appIt } from './it/app';
import { profileEs } from './es/profile';
import { profileEn } from './en/profile';
import { profileIt } from './it/profile';

export const translations = {
  es: { app: appEs, auth: authEs, profile: profileEs },
  en: { app: appEn, auth: authEn, profile: profileEn },
  it: { app: appIt, auth: authIt, profile: profileIt },
} as const;

export type SupportedLanguage = keyof typeof translations;

// Type helpers to infer dotted paths (e.g. "auth.login.title")
type TranslationTree = typeof translations.es;
type Leaves<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${Extract<K, string>}.${Leaves<T[K]>}`
        : Extract<K, string>;
    }[keyof T]
  : '';

export type TranslationKey = Leaves<TranslationTree>;
