import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bomb,
  Gamepad2,
  Keyboard,
  Shield,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

import { useLanguage } from '../locales/useLanguage';
import { UI } from '@/components/layout/layoutStyles';
import { Card } from '@/components/ui/card';
import { Keycap } from '../components/ui/Keycap';
import { GameViewport } from '../features/game';

const MECHANICS = [
  { key: 'bombPlacement', icon: Bomb },
  { key: 'powerUps', icon: Zap },
  { key: 'multiplayer', icon: Users },
] as const;

const MATCH_MODES = [
  { key: 'practice', icon: Gamepad2 },
  { key: 'private', icon: Users },
  { key: 'public', icon: Shield },
] as const;

export function RulesPage() {
  const { t } = useLanguage();

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        <Card className={UI.card.header}>
          <div className={UI.badge.header}>
            <Gamepad2 className={UI.icon.xs} aria-hidden="true" />
            <span>{t('app.aboutGame.badge') || 'GAME GUIDE'}</span>
          </div>

          <h1 className={UI.text.pageTitle}>
            {t('app.aboutGame.title') || 'ft_bomberman'}
          </h1>
          <p className={UI.text.pageSubtitle}>
            {t('app.aboutGame.subtitle') ||
              'Move through destructible mazes, place bombs, collect upgrades, and outlast your opponents.'}
          </p>
        </Card>

        <Card className={UI.card.section}>
          <div className="text-primary mb-3 flex items-center gap-2">
            <Trophy className={UI.icon.sm} aria-hidden="true" />
            <h2 className="text-foreground text-lg font-bold">
              {t('app.aboutGame.objectiveTitle') || 'Objective'}
            </h2>
          </div>
          <p className={UI.text.body}>
            {t('app.aboutGame.objectiveDescription') ||
              'Stay alive and be the last player remaining. Bombs can eliminate you too, so plan an escape route before placing one.'}
          </p>
        </Card>

        <Card className={UI.card.section}>
          <div className="text-primary mb-3 flex items-center gap-2">
            <h2 className={UI.text.sectionTitle}>
              {t('app.aboutGame.controlsTitle') || 'Controls'}
            </h2>
          </div>
          <div className={UI.shell.grid2}>
            <Card className={`${UI.card.inner} p-5`}>
              <div className="text-primary mb-3 flex items-center gap-2">
                <Keyboard className={UI.icon.sm} aria-hidden="true" />
                <h3 className="text-foreground font-semibold">
                  {t('app.aboutGame.movementTitle') || 'Movement'}
                </h3>
              </div>
              <p className={UI.text.body}>
                {t('app.aboutGame.movementDescription') ||
                  'Move using either key set. Diagonal movement is not available.'}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <div
                  className="flex flex-col items-center"
                  role="group"
                  aria-label={t('app.aboutGame.wasdLabel') || 'WASD controls'}
                >
                  <span className={`${UI.text.sublabel} mb-2`}>
                    {t('app.aboutGame.wasdLabel') || 'WASD'}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <span aria-hidden="true" />
                    <Keycap
                      accent
                      ariaLabel={t('app.aboutGame.moveUp') || 'Move up'}
                    >
                      W
                    </Keycap>
                    <span aria-hidden="true" />
                    <Keycap
                      accent
                      ariaLabel={t('app.aboutGame.moveLeft') || 'Move left'}
                    >
                      A
                    </Keycap>
                    <Keycap
                      accent
                      ariaLabel={t('app.aboutGame.moveDown') || 'Move down'}
                    >
                      S
                    </Keycap>
                    <Keycap
                      accent
                      ariaLabel={t('app.aboutGame.moveRight') || 'Move right'}
                    >
                      D
                    </Keycap>
                  </div>
                </div>

                <span className="text-muted-foreground text-xs">
                  {t('app.aboutGame.or') || 'or'}
                </span>

                <div
                  className="flex flex-col items-center"
                  role="group"
                  aria-label={
                    t('app.aboutGame.arrowKeysLabel') || 'Arrow key controls'
                  }
                >
                  <span className={`${UI.text.sublabel} mb-2`}>
                    {t('app.aboutGame.arrowKeysLabel') || 'Arrow keys'}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <span aria-hidden="true" />
                    <Keycap
                      accent
                      ariaLabel={t('app.aboutGame.moveUp') || 'Move up'}
                    >
                      <ArrowUp className={UI.icon.sm} aria-hidden="true" />
                    </Keycap>
                    <span aria-hidden="true" />
                    <Keycap
                      accent
                      ariaLabel={t('app.aboutGame.moveLeft') || 'Move left'}
                    >
                      <ArrowLeft className={UI.icon.sm} aria-hidden="true" />
                    </Keycap>
                    <Keycap
                      accent
                      ariaLabel={t('app.aboutGame.moveDown') || 'Move down'}
                    >
                      <ArrowDown className={UI.icon.sm} aria-hidden="true" />
                    </Keycap>
                    <Keycap
                      accent
                      ariaLabel={t('app.aboutGame.moveRight') || 'Move right'}
                    >
                      <ArrowRight className={UI.icon.sm} aria-hidden="true" />
                    </Keycap>
                  </div>
                </div>
              </div>
            </Card>

            <Card className={`${UI.card.inner} flex flex-col p-5`}>
              <div className="text-primary mb-3 flex items-center gap-2">
                <Bomb className={UI.icon.sm} aria-hidden="true" />
                <h3 className="text-foreground font-semibold">
                  {t('app.aboutGame.actionTitle') || 'Bomb'}
                </h3>
              </div>
              <p className={UI.text.body}>
                {t('app.aboutGame.actionDescription') ||
                  'Press the Space bar to place a bomb.'}
              </p>
              <div className="flex flex-1 items-center justify-center py-5">
                <Keycap
                  wide
                  accent
                  ariaLabel={t('app.aboutGame.placeBomb') || 'Place bomb'}
                >
                  {t('app.aboutGame.controlsSpace') || 'SPACE'}
                </Keycap>
              </div>
            </Card>
          </div>
        </Card>

        <Card className={UI.card.section}>
          <h2 className={UI.text.sectionTitle}>
            {t('app.aboutGame.mechanicsTitle') || 'Core mechanics'}
          </h2>
          <div className={`mt-4 ${UI.shell.grid3}`}>
            {MECHANICS.map(({ key, icon: Icon }) => (
              <Card key={key} className={UI.card.innerPadded}>
                <div className="text-primary mb-3 flex items-center gap-2">
                  <Icon className={UI.icon.sm} aria-hidden="true" />
                  <h3 className="text-foreground font-semibold">
                    {t(`app.aboutGame.mechanics.${key}.label`)}
                  </h3>
                </div>
                <p className={UI.text.body}>
                  {t(`app.aboutGame.mechanics.${key}.description`)}
                </p>
              </Card>
            ))}
          </div>
        </Card>

        <Card className={UI.card.sectionLarge}>
          <h2 className={UI.text.sectionTitle}>
            {t('app.aboutGame.matchModesTitle') || 'Choose a game mode'}
          </h2>
          <div className={`mt-4 ${UI.shell.grid3}`}>
            {MATCH_MODES.map(({ key, icon: Icon }) => (
              <Card key={key} className={UI.card.innerPadded}>
                <div className="text-primary mb-3 flex items-center gap-2">
                  <Icon className={UI.icon.sm} aria-hidden="true" />
                  <h3 className="text-foreground font-semibold">
                    {t(`app.aboutGame.modes.${key}.label`)}
                  </h3>
                </div>
                <p className={UI.text.body}>
                  {t(`app.aboutGame.modes.${key}.description`)}
                </p>
              </Card>
            ))}
          </div>
        </Card>

        <Card className={UI.card.sectionLarge}>
          <h2 className={UI.text.sectionTitle}>
            {t('app.aboutGame.demoTitle') || 'Try the arena'}
          </h2>
          <p className={UI.text.body}>
            {t('app.aboutGame.demoDescription') ||
              'Use the interactive preview to try moving, placing bombs, and escaping explosions.'}
          </p>
          <div className="mt-5">
            <GameViewport demo />
          </div>
        </Card>
      </div>
    </div>
  );
}
