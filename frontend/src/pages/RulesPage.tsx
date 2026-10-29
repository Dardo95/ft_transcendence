import { useLanguage } from '../locales/useLanguage';


export function RulesPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-4xl rounded-xl border border-zinc-700 bg-zinc-900 p-6 text-center">
      <h1 className="mb-2 text-2xl font-bold text-orange-400">
        {t('app.aboutGame.title') || 'Reglas del Juego'}
      </h1>
      <p className="text-sm text-zinc-400">{t('app.aboutGame.subtitle') || 'Guía táctica sobre mecánicas de movimiento, colocación de bombas, tipos de bloques y catálogo de mejoras.'}</p>
    </div>
  );
}