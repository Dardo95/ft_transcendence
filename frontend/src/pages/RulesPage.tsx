import { useLanguage } from '../locales/useLanguage';

export function RulesPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-4xl rounded-xl border border-zinc-700 bg-zinc-900 p-6 text-center">
      <h1 className="mb-2 text-2xl font-bold text-orange-400">
        {t('app.aboutGame') || 'Game Rules'}
      </h1>
      <p className="text-sm text-zinc-400">Vista en construcción.</p>
    </div>
  );
}
