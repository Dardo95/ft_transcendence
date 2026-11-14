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
import { projectEs } from './es/project';
import { projectEn } from './en/project';
import { projectIt } from './it/project';
import { legalEs } from './es/legal';
import { legalEn } from './en/legal';
import { legalIt } from './it/legal';

export const translations = {
  es: {
    app: appEs,
    auth: authEs,
    profile: profileEs,
    project: projectEs,
    legal: legalEs,
  },
  en: {
    app: appEn,
    auth: authEn,
    profile: profileEn,
    project: projectEn,
    legal: legalEn,
  },
  it: {
    app: appIt,
    auth: authIt,
    profile: profileIt,
    project: projectIt,
    legal: legalIt,
  },
} as const;

export type SupportedLanguage = keyof typeof translations;

// Type helpers to infer dotted paths (e.g. "auth.login.title")
type TranslationTree = typeof translations.es;
type Leaves<T> = T extends readonly unknown[]
  ? ''
  : T extends object
    ? {
        [K in keyof T]: T[K] extends object
          ? `${Extract<K, string>}.${Leaves<T[K]>}`
          : Extract<K, string>;
      }[keyof T]
    : '';

export type TranslationKey = Leaves<TranslationTree>;
