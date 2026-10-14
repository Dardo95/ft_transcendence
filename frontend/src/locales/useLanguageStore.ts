import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SupportedLanguage } from './translations';

interface LanguageState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      // Default fallback language
      language: 'es',

      // Updates language state and syncs to localStorage
      setLanguage: (lang: SupportedLanguage) => set({ language: lang }),
    }),
    {
      name: 'app_lang',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
