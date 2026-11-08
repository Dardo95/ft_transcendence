import { describe, expect, it } from 'vitest';
import { translations } from './translations';

describe('hud translations', () => {
  const LANGUAGES = ['es', 'en', 'it'] as const;

  it('defines every hud key in all three languages', () => {
    const keys = Object.keys(translations.es.app.hud);

    for (const language of LANGUAGES) {
      for (const key of keys) {
        expect(
          (translations[language].app.hud as Record<string, string>)[key],
          `${language}.app.hud.${key}`
        ).toBeTruthy();
      }
    }
  });
});
