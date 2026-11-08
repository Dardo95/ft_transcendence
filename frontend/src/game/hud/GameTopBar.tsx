import { ClockIcon, MapIcon, type LucideIcon, UsersIcon } from 'lucide-react';

import { useLanguage } from '../../locales/useLanguage';
import { formatClock, type HudModel } from './hudModel';

interface TopBarStat {
  icon: LucideIcon;
  label: string;
  value: string;
}

/**
 * Cabecera de la partida sobre el canvas: identidad del juego
 * (modo, dimensiones e id) y fila de estadísticas generales
 * (tiempo, supervivientes y mapa).
 */
export function GameTopBar({ model }: { model: HudModel }) {
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
