import { useLanguage } from '../locales/useLanguage';
import {
  HEADER_CARD,
  PAGE_CONTAINER,
  PAGE_SHELL,
  PAGE_SUBTITLE,
  PAGE_TITLE,
} from '@/components/layout/layoutStyles';

export function RulesPage() {
  const { t } = useLanguage();

  return (
    <div className={PAGE_SHELL}>
      <div className={PAGE_CONTAINER}>
        <header className={HEADER_CARD}>
          <h1 className={PAGE_TITLE}>
            {t('app.aboutGame.title') || 'Game Rules'}
          </h1>
          <p className={PAGE_SUBTITLE}>
            {t('app.aboutGame.subtitle') ||
              'Guía táctica sobre mecánicas de movimiento, colocación de bombas, tipos de bloques y catálogo de mejoras.'}
          </p>
        </header>
      </div>
    </div>
  );
}
