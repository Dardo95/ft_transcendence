import { useLanguage } from '../../locales/useLanguage';
import type { SupportedLanguage } from '../../locales/translations';

const LANGUAGES: SupportedLanguage[] = ['es', 'en', 'it'];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 p-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`rounded px-2.5 py-1 text-xs font-bold uppercase transition-colors ${
            language === lang
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
