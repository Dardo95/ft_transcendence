import { CircleIcon, CircleOffIcon } from 'lucide-react';

import defaultAvatar from '../../../assets/default.jpg';
import { UI } from '../../../components/layout/layoutStyles';
import { useLanguage } from '../../../locales/useLanguage';
import type { PlayerColor } from '../players/types';
import { formatMatchClock, type HudModel, type LocalHud } from './hudModel';
import {
  assignRosterColors,
  PLAYER_COLOR_CLASSES,
  PLAYER_COLOR_UNDERLINE_CLASSES,
} from './rosterColors';
import { HUD } from './hudStyles';

interface PlayerPanelProps {
  name: string;
  alive: boolean;
  isLocal: boolean;
  color: PlayerColor;
  /** Stats bombas/fuego/velocidad: solo se muestran en el local. */
  local?: LocalHud;
}

/**
 * Tarjeta de jugador del overlay de pantalla completa: fila con
 * los estilos del sidebar de partida (avatar redondo con borde
 * de color, subrayado de color y nombre tachado si está fuera),
 * indicador de vida y, en el local, sus stats.
 */
function PlayerPanel({ name, alive, isLocal, color, local }: PlayerPanelProps) {
  const { t } = useLanguage();

  const stats = local
    ? [
        { label: t('app.sidebar.bombs'), value: String(local.availableBombs) },
        { label: t('app.sidebar.blast'), value: String(local.blastRadius) },
        { label: t('app.sidebar.speed'), value: local.speed.toFixed(1) },
      ]
    : [];

  return (
    <div className={`${HUD.surface.playerCard} ${alive ? '' : 'opacity-60'}`}>
      <div
        className={`flex items-center gap-2.5 border-b-2 pb-2 ${PLAYER_COLOR_UNDERLINE_CLASSES[color]}`}
      >
        <div
          className={`size-9 shrink-0 overflow-hidden rounded-full border-4 ${PLAYER_COLOR_CLASSES[color]}`}
          aria-hidden="true"
        >
          <img
            src={defaultAvatar}
            alt=""
            className={`${UI.avatar.full} rounded-full`}
          />
        </div>

        <span className="min-w-0 flex-1">
          <span
            className={`${UI.game.playerName} ${alive ? '' : 'line-through'}`}
          >
            {name}
          </span>
          {isLocal && (
            <span className={UI.game.localPlayer}>{t('app.sidebar.you')}</span>
          )}
        </span>

        {alive ? (
          <CircleIcon
            className="fill-success text-success-foreground h-3 w-3 shrink-0"
            aria-label={t('app.hud.alive')}
          />
        ) : (
          <CircleOffIcon
            className="text-muted-foreground h-3.5 w-3.5 shrink-0"
            aria-label={t('app.hud.down')}
          />
        )}
      </div>

      {local && (
        <div className={HUD.surface.statGridTight}>
          {stats.map(({ label, value }) => (
            <div key={label} className={HUD.surface.statBoxTight}>
              <p className={HUD.text.valueSmall}>{value}</p>
              <p className={HUD.text.statLabelCompact}>{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * HUD superpuesto al canvas solo en pantalla completa (el
 * topbar y el sidebar quedan fuera del elemento a pantalla
 * completa). Reproduce la referencia clásica: caja de tiempo
 * centrada arriba con la tipografía del HUD y tarjetas de
 * jugador en los laterales, centradas en vertical (1P/3P a
 * la izquierda, 2P/4P a la derecha). Capa sin eventos: no
 * interfiere con el juego y la salida es con Escape.
 */
export function FullscreenHud({ model }: { model: HudModel }) {
  const { t } = useLanguage();

  const roster = assignRosterColors([
    { name: model.local.name, alive: model.local.alive, isLocal: true },
    ...model.rivals.map((rival) => ({
      name: rival.name,
      alive: rival.alive,
      isLocal: false,
    })),
  ]);

  // Como la referencia: 1P y 3P en el lateral izquierdo,
  // 2P y 4P en el derecho, ambos centrados en vertical.
  const leftColumn = roster.filter((_, index) => index % 2 === 0);
  const rightColumn = roster.filter((_, index) => index % 2 === 1);

  const renderPanel = (entry: (typeof roster)[number]) => (
    <PlayerPanel
      key={entry.name}
      name={entry.name}
      alive={entry.alive}
      isLocal={entry.isLocal}
      color={entry.color}
      local={entry.isLocal ? model.local : undefined}
    />
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Caja de tiempo centrada arriba, con el chasis y la
          tipografía del resto del HUD. */}
      <div
        className={`${HUD.surface.timerBox} absolute top-3 left-1/2 -translate-x-1/2`}
        role="timer"
        aria-label={
          model.isOvertime ? t('app.topbar.overtime') : t('app.topbar.time')
        }
      >
        <p className={HUD.text.valueTimer}>{formatMatchClock(model)}</p>
      </div>

      {/* Tarjetas laterales centradas en vertical. */}
      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 flex-col gap-3">
        {leftColumn.map(renderPanel)}
      </div>
      <div className="absolute top-1/2 right-3 flex -translate-y-1/2 flex-col gap-3">
        {rightColumn.map(renderPanel)}
      </div>
    </div>
  );
}
