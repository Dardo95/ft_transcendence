import { useLanguage } from '../locales/useLanguage';
import {
  HEADER_CARD,
  PAGE_CONTAINER_COMPACT,
  PAGE_SHELL,
  PAGE_SUBTITLE,
  PAGE_TITLE,
} from '@/components/layout/layoutStyles';

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className={PAGE_SHELL}>
      <div className={PAGE_CONTAINER_COMPACT}>
        <header className={HEADER_CARD}>
          <h1 className={PAGE_TITLE}>
            {t('app.general.notFound') || '404 Not Found'}
          </h1>
          <p className={PAGE_SUBTITLE}>Vista en construcción.</p>
        </header>
      </div>
    </div>
  );
}
