import { useLanguage } from '../locales/useLanguage';


export function AboutUsPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-4xl rounded-xl border border-zinc-700 bg-zinc-900 p-6 text-center">
      <h1 className="mb-2 text-2xl font-bold text-orange-400">
        {t('app.aboutUs.title') || 'Sobre nosotros'}
      </h1>
      <p className="text-sm text-zinc-400">{t('app.aboutUs.subtitle') || 'Cuatro desarrolladores de 42 Madrid creando una experiencia arcade multijugador en tiempo real impulsada por arquitectura de software moderna.'}</p>
    </div>
  );
}