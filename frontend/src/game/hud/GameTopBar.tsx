import {
  ClockIcon,
  MapIcon,
  type LucideIcon,
  Maximize2Icon,
  Minimize2Icon,
  UsersIcon,
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { useLanguage } from '../../locales/useLanguage';
import { formatClock, type HudModel } from './hudModel';

interface TopBarStat {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface GameTopBarProps {
  model: HudModel;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

/**
 * Cabecera de la partida sobre el canvas: identidad del juego
 * (modo, dimensiones e id), fila de estadísticas generales
 * (tiempo, supervivientes y mapa) y botón de pantalla completa.
 */
export function GameTopBar({
  model,
  isFullscreen,
  onToggleFullscreen,
}: GameTopBarProps) {
  const { t } = useLanguage();
  const totalPlayers = 1 + model.rivals.length;

  const stats: TopBarStat[] = [
    {
      icon: ClockIcon,
      label: t('app.topbar.time'),
      value: formatClock(model.clockMs),
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
    <header className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-zinc-100 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.25em] text-zinc-400 uppercase">
            {t('app.topbar.practiceMatch')}
          </p>
          <p className="mt-1 font-mono text-sm font-semibold">
            {model.mapWidth} × {model.mapHeight} ·{' '}
            <span className="text-amber-300">{model.gameId}</span>
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
          aria-pressed={isFullscreen}
          className="h-9 gap-2 rounded-md border-1 border-zinc-800 bg-zinc-900 px-4 font-black text-zinc-400 transition-none hover:border-zinc-800 hover:bg-zinc-800 hover:text-white focus:ring-0 focus-visible:ring-0 aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-white"
        >
          {isFullscreen ? (
            <Minimize2Icon className="h-4 w-4 text-white" aria-hidden="true" />
          ) : (
            <Maximize2Icon
              className="h-4 w-4 text-orange-500"
              aria-hidden="true"
            />
          )}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 border-t border-zinc-800 pt-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </p>
            <p className="mt-0.5 font-mono text-xl leading-tight font-bold text-amber-300">
              {value}
            </p>
          </div>
        ))}
      </div>
    </header>
  );
}
