import {
  ClockIcon,
  LogOutIcon,
  MapIcon,
  type LucideIcon,
  Maximize2Icon,
  Minimize2Icon,
  UsersIcon,
} from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { useLanguage } from '../../../locales/useLanguage';
import { formatMatchClock, type HudModel } from './hudModel';
import { HUD } from './hudStyles';

interface TopBarStat {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface GameTopBarProps {
  model: HudModel;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  /** Ausente en la demo (Rules): no hay sala de la que salir. */
  onLeave?: () => void;
}

/**
 * Cabecera de la partida sobre el canvas: identidad del juego
 * (modo, dimensiones e id), fila de estadísticas generales
 * (tiempo, supervivientes y mapa), salir de la partida y
 * botón de pantalla completa.
 */
export function GameTopBar({
  model,
  isFullscreen,
  onToggleFullscreen,
  onLeave,
}: GameTopBarProps) {
  const { t } = useLanguage();
  const totalPlayers = 1 + model.rivals.length;

  const stats: TopBarStat[] = [
    {
      icon: ClockIcon,
      label: model.isOvertime ? t('app.topbar.overtime') : t('app.topbar.time'),
      value: formatMatchClock(model),
    },
    {
      icon: UsersIcon,
      label: t('app.topbar.survivors'),
      value: `${model.playersRemaining}/${totalPlayers}`,
    },
    {
      icon: MapIcon,
      label: t('app.topbar.map'),
      value: model.mapId,
    },
  ];

  return (
    <header className={HUD.surface.topbar}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className={HUD.text.eyebrow}>{t('app.topbar.practiceMatch')}</p>
          <p className={HUD.text.meta}>
            {model.mapWidth} × {model.mapHeight} ·{' '}
            <span className={HUD.text.metaAccent}>{model.gameId}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onLeave && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLeave}
              aria-label={t('app.topbar.leave')}
              title={t('app.topbar.leave')}
              className={HUD.button.base}
            >
              <LogOutIcon
                className={HUD.icon.topbarAccent}
                aria-hidden="true"
              />
              <span>{t('app.topbar.leave')}</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            aria-pressed={isFullscreen}
            aria-label={
              isFullscreen
                ? t('app.topbar.exitFullscreen') || 'Exit fullscreen'
                : t('app.topbar.enterFullscreen') || 'Enter fullscreen'
            }
            title={
              isFullscreen
                ? t('app.topbar.exitFullscreen') || 'Exit fullscreen'
                : t('app.topbar.enterFullscreen') || 'Enter fullscreen'
            }
            className={HUD.button.active}
          >
            {isFullscreen ? (
              <Minimize2Icon
                className={HUD.icon.topbarActive}
                aria-hidden="true"
              />
            ) : (
              <Maximize2Icon
                className={HUD.icon.topbarAccent}
                aria-hidden="true"
              />
            )}
          </Button>
        </div>
      </div>

      <div className={HUD.surface.divider}>
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <p className={HUD.text.statLabelIcon}>
              <Icon className={HUD.icon.xs} aria-hidden="true" />
              {label}
            </p>
            <p className={HUD.text.valueTopbar}>{value}</p>
          </div>
        ))}
      </div>
    </header>
  );
}
