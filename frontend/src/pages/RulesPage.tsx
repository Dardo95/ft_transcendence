import { useLanguage } from '../locales/useLanguage';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';
import { GameViewport } from '../features/game';

export function RulesPage() {
  const { t } = useLanguage();

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        <Card className={UI.card.header}>
          <h1 className={UI.text.pageTitle}>
            {t('app.aboutGame.title') || 'Game Rules'}
          </h1>
          <p className={UI.text.pageSubtitle}>
            {t('app.aboutGame.subtitle') ||
              'Guía táctica sobre mecánicas de movimiento, colocación de bombas, tipos de bloques y catálogo de mejoras.'}
          </p>
        </Card>

        <section aria-labelledby="demo-heading" className="space-y-3">
          <div>
            <h2 id="demo-heading" className={UI.text.sectionTitle}>
              {t('app.aboutGame.demoTitle')}
            </h2>
            <p className={UI.text.body}>{t('app.aboutGame.demoHint')}</p>
          </div>
          <GameViewport demo />
        </section>
      </div>
    </div>
  );
}
