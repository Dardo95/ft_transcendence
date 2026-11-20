import { Bomb, Users, Zap } from 'lucide-react';

import { useLanguage } from '../locales/useLanguage';
import { UI } from '@/components/layout/layoutStyles';
import { GameViewport } from '../features/game';

const MECHANICS = [
  { key: 'bombPlacement', icon: Bomb },
  { key: 'powerUps', icon: Zap },
  { key: 'multiplayer', icon: Users },
] as const;

export function RulesPage() {
  const { t } = useLanguage();

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className={UI.text.pageTitle}>{t('app.aboutGame.title')}</h1>
          <p className={UI.text.pageSubtitle}>{t('app.aboutGame.subtitle')}</p>
        </div>

        <div>
          <h2 className={UI.text.sectionTitle}>
            {t('app.aboutGame.mechanicsTitle')}
          </h2>
          <ul className="mt-4 space-y-2">
            {MECHANICS.map(({ key, icon: Icon }) => (
              <li key={key} className={UI.list.li}>
                <Icon className={UI.list.icon} aria-hidden="true" />
                <span>
                  <strong>{t(`app.aboutGame.mechanics.${key}.label`)}</strong>
                  {': '}
                  {t(`app.aboutGame.mechanics.${key}.description`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <section className="space-y-3">
          <GameViewport demo />
        </section>
      </div>
    </div>
  );
}
