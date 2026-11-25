import { useLanguage } from '../locales/useLanguage';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

export function StatsPage() {
  const { t } = useLanguage();

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        <Card className={UI.card.header}>
          <h1 className={UI.text.pageTitle}>
            {t('app.general.stats') || 'Game Statistics'}
          </h1>
          <p className={UI.text.pageSubtitle}>
            {t('app.general.statsSubtitle') ||
              'Track your matches, results and progression over time.'}
          </p>
        </Card>

        <Card className={UI.card.section}>
          <h2 className={UI.text.sectionTitle}>
            {t('app.general.matchHistory') || 'Match history'}
          </h2>

          <div
            className={`text-muted-foreground mt-4 text-xs ${UI.card.innerPadded}`}
          >
            {t('app.general.statsEmpty') || 'No matches recorded yet.'}
          </div>

          <div className={`mt-4 ${UI.table.wrapper}`}>
            <table className={UI.table.base}>
              <thead className={UI.table.head}>
                <tr>
                  <th className={UI.table.cell}>
                    {t('app.general.match') || 'Match'}
                  </th>
                  <th className={UI.table.cell}>
                    {t('app.general.result') || 'Result'}
                  </th>
                  <th className={UI.table.cellRight}>
                    {t('app.general.date') || 'Date'}
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className={UI.table.row}>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm">
                    {t('app.general.underConstruction') ||
                      'Under construction.'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
