import { describe, expect, it } from 'vitest';

import { translations } from './translations';

describe('hud translations', () => {
  const LANGUAGES = ['es', 'en', 'it'] as const;
  const SECTIONS = ['hud', 'topbar', 'sidebar', 'legend'] as const;

  it('defines every hud section key in all three languages', () => {
    for (const section of SECTIONS) {
      const keys = Object.keys(translations.es.app[section]);

      expect(keys.length, `app.${section}`).toBeGreaterThan(0);

      for (const language of LANGUAGES) {
        for (const key of keys) {
          expect(
            (translations[language].app[section] as Record<string, string>)[
              key
            ],
            `${language}.app.${section}.${key}`
          ).toBeTruthy();
        }
      }
    }
  });
});
