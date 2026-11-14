import { useLanguage } from '../locales/useLanguage';
import {
  HEADER_CARD,
  INNER_BOX,
  PAGE_CONTAINER,
  PAGE_SHELL,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  SECTION_CARD,
  SECTION_TITLE,
  TABLE_BASE,
  TABLE_HEAD,
  TABLE_ROW,
  TABLE_WRAPPER,
} from '@/components/layout/layoutStyles';

export function StatsPage() {
  const { t } = useLanguage();

  return (
    <div className={PAGE_SHELL}>
      <div className={PAGE_CONTAINER}>
        <header className={HEADER_CARD}>
          <h1 className={PAGE_TITLE}>
            {t('app.general.stats') || 'Game Statistics'}
          </h1>
          <p className={PAGE_SUBTITLE}>
            {t('app.general.statsSubtitle') ||
              'Track your matches, results and progression over time.'}
          </p>
        </header>

        <section className={SECTION_CARD}>
          <h2 className={SECTION_TITLE}>
            {t('app.general.matchHistory') || 'Match history'}
          </h2>

          <div className={`mt-4 p-3.5 text-xs text-zinc-400 ${INNER_BOX}`}>
            {t('app.general.statsEmpty') || 'No matches recorded yet.'}
          </div>

          <div className={`mt-4 ${TABLE_WRAPPER}`}>
            <table className={TABLE_BASE}>
              <thead className={TABLE_HEAD}>
                <tr>
                  <th className="px-4 py-3">
                    {t('app.general.match') || 'Match'}
                  </th>
                  <th className="px-4 py-3">
                    {t('app.general.result') || 'Result'}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {t('app.general.date') || 'Date'}
                  </th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className={TABLE_ROW}>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm">
                    Vista en construcción.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
