import { useLanguage } from '../locales/useLanguage';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.containerCompact}>
        <Card className={UI.card.header}>
          <h1 className={UI.text.pageTitle}>
            {t('app.general.notFound') || '404 Not Found'}
          </h1>
          <p className={UI.text.pageSubtitle}>Vista en construcción.</p>
        </Card>
      </div>
    </div>
  );
}
