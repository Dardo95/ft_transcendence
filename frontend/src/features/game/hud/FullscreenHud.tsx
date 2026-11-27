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

export interface PlayerPanelStat {
  label: string;
  value: string;
}

export interface PlayerPanelProps {
  name: string;
  alive: boolean;
  isLocal?: boolean;
  color: PlayerColor;
  /** Stats bombas/fuego/velocidad: solo se muestran en el local. */
  local?: LocalHud;
  /** Explicit stats override (used by the spectator scoreboard for all players). */
  stats?: PlayerPanelStat[];
  /** Interactive focus target (used by the spectator scoreboard). */
  onClick?: () => void;
  focused?: boolean;
  ariaLabel?: string;
  /** Stretch to fill grid cells instead of using the fixed fullscreen overlay width. */
  fullWidth?: boolean;
}

/**
 * Tarjeta de jugador del overlay de pantalla completa: fila con
 * los estilos del sidebar de partida (avatar redondo con borde
 * de color, subrayado de color y nombre tachado si está fuera),
 * indicador de vida y, en el local, sus stats.
 *
 * Also reused by the spectator scoreboard with explicit stats and
 * click-to-focus support.
 */
export function PlayerPanel({
  name,
  alive,
  isLocal = false,
  color,
  local,
  stats,
  onClick,
  focused = false,
  ariaLabel,
  fullWidth = false,
}: PlayerPanelProps) {
  const { t } = useLanguage();

  const statEntries =
    stats ??
    (local
      ? [
          {
            label: t('app.sidebar.bombs') || 'Bombs',
            value: String(local.availableBombs),
          },
          {
            label: t('app.sidebar.blast') || 'Blast',
            value: String(local.blastRadius),
          },
          {
            label: t('app.sidebar.speed') || 'Speed',
            value: local.speed.toFixed(1),
          },
        ]
      : []);

  const content = (
    <>
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
            aria-label={t('app.hud.alive') || 'Up'}
          />
        ) : (
          <CircleOffIcon
            className="text-muted-foreground h-3.5 w-3.5 shrink-0"
            aria-label={t('app.hud.down') || 'Out'}
          />
        )}
      </div>

      {statEntries.length > 0 && (
        <div className={HUD.surface.statGridTight}>
          {statEntries.map(({ label, value }) => (
            <div key={label} className={HUD.surface.statBoxTight}>
              <p className={HUD.text.valueSmall}>{value}</p>
              <p className={HUD.text.statLabelCompact}>{label}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const cardSurface = fullWidth
    ? HUD.surface.playerCardFluid
    : HUD.surface.playerCard;
  const className = `${cardSurface} ${
    alive ? '' : 'opacity-60'
  } ${focused ? 'ring-primary ring-2' : ''}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={focused}
        aria-label={ariaLabel}
        className={`${className} cursor-pointer text-left transition-transform hover:-translate-y-0.5`}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
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
export function FullscreenHud({
  model,
  showAllStats = false,
}: {
  model: HudModel;
  /** Spectator fullscreen: display power-up stats on every player card. */
  showAllStats?: boolean;
}) {
  const { t } = useLanguage();

  const roster = assignRosterColors(
    showAllStats || !model.local
      ? model.players.map((player) => ({
          id: player.id,
          name: player.name,
          alive: player.alive,
          isLocal: model.local?.id === player.id,
          playerHud: player,
        }))
      : [
          {
            id: model.local.id,
            name: model.local.name,
            alive: model.local.alive,
            isLocal: true,
            playerHud: model.local,
          },
          ...model.rivals.map((rival) => ({
            id: rival.id,
            name: rival.name,
            alive: rival.alive,
            isLocal: false,
            playerHud: undefined,
          })),
        ]
  );

  // Como la referencia: 1P y 3P en el lateral izquierdo,
  // 2P y 4P en el derecho, ambos centrados en vertical.
  const leftColumn = roster.filter((_, index) => index % 2 === 0);
  const rightColumn = roster.filter((_, index) => index % 2 === 1);

  const renderPanel = (entry: (typeof roster)[number]) => (
    <PlayerPanel
      key={entry.id}
      name={entry.name}
      alive={entry.alive}
      isLocal={entry.isLocal}
      color={entry.color}
      local={showAllStats || entry.isLocal ? entry.playerHud : undefined}
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
