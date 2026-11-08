import { ChefHatIcon, CircleIcon, CircleOffIcon, InfoIcon } from 'lucide-react';

import bombUrl from '../../assets/sprites/bomb_pressure_cooker.png';
import crateUrl from '../../assets/sprites/crate_wood.png';
import powerUpUrl from '../../assets/sprites/powerup_extrabomb.png';
import tileWallUrl from '../../assets/sprites/tile_wall.png';
import { useLanguage } from '../../locales/useLanguage';
import { PLAYER_COLORS, type PlayerColor } from '../players/types';
import type { HudModel } from './hudModel';

interface RosterEntry {
  name: string;
  alive: boolean;
  isLocal: boolean;
}

interface StatBox {
  label: string;
  value: string;
}

// Mismos colores que los sprites de jugadores del canvas
// (PLAYER_COLORS), para que el gorrito del sidebar coincida
// con el personaje que se ve en el tablero.
const PLAYER_COLOR_CLASSES: Record<PlayerColor, string> = {
  blue: 'bg-blue-950 text-blue-300 border-blue-700',
  green: 'bg-emerald-950 text-emerald-300 border-emerald-700',
  red: 'bg-red-950 text-red-300 border-red-700',
  yellow: 'bg-yellow-950 text-yellow-300 border-yellow-700',
};

interface LegendItem {
  src: string;
  label: string;
}

/**
 * Panel lateral de la partida: quiénes están en la cocina,
 * tus estadísticas y la leyenda del tablero.
 */
export function GameSidebar({ model }: { model: HudModel }) {
  const { t } = useLanguage();
  const totalPlayers = 1 + model.rivals.length;

  const roster: RosterEntry[] = [
    { name: model.local.name, alive: model.local.alive, isLocal: true },
    ...model.rivals.map((rival) => ({
      name: rival.name,
      alive: rival.alive,
      isLocal: false,
    })),
  ];

  // Replica PlayerLayer.assignColor: primer color libre en
  // orden de aparición. El roster va en el mismo orden que el
  // array de jugadores del canvas, así el gorrito coincide
  // con el personaje del tablero (bren=blue, eduardo=green…).
  const usedColors = new Set<PlayerColor>();
  const rosterWithColor = roster.map((entry) => {
    const color =
      PLAYER_COLORS.find((item) => !usedColors.has(item)) ?? PLAYER_COLORS[0];
    usedColors.add(color);
    return { ...entry, color };
  });

  const stats: StatBox[] = [
    {
      label: t('app.sidebar.bombs'),
      value: String(model.local.availableBombs),
    },
    {
      label: t('app.sidebar.blast'),
      value: String(model.local.blastRadius),
    },
    {
      label: t('app.sidebar.speed'),
      value: model.local.speed.toFixed(1),
    },
  ];

  const legend: LegendItem[] = [
    { src: tileWallUrl, label: t('app.legend.wall') },
    { src: crateUrl, label: t('app.legend.crate') },
    { src: bombUrl, label: t('app.legend.bomb') },
    { src: powerUpUrl, label: t('app.legend.powerUp') },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Jugadores en la cocina */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-3 text-zinc-100 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            <ChefHatIcon className="h-4 w-4" aria-hidden="true" />
            {t('app.sidebar.inKitchen')}
          </h2>
          <span className="font-mono text-sm font-bold text-amber-300">
            {model.playersRemaining}/{totalPlayers}
          </span>
        </div>

        <ul className="mt-2 flex flex-col gap-1.5">
          {rosterWithColor.map((entry) => (
            <li
              key={entry.name}
              className={`flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-950/70 px-2.5 py-2 ${
                entry.alive ? '' : 'opacity-60'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                  PLAYER_COLOR_CLASSES[entry.color]
                }`}
                aria-hidden="true"
              >
                <ChefHatIcon className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={`block truncate text-xs font-semibold ${
                    entry.alive ? '' : 'line-through'
                  }`}
                >
                  {entry.name}
                </span>
                {entry.isLocal && (
                  <span className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
                    {t('app.sidebar.you')}
                  </span>
                )}
              </span>

              {entry.alive ? (
                <CircleIcon
                  className="h-3 w-3 shrink-0 fill-emerald-400 text-emerald-400"
                  aria-label={t('app.hud.alive')}
                />
              ) : (
                <CircleOffIcon
                  className="h-3.5 w-3.5 shrink-0 text-zinc-600"
                  aria-label={t('app.hud.down')}
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Estadísticas del jugador local */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-3 text-zinc-100 shadow-lg">
        <h2 className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
          {t('app.sidebar.yourStats')}
        </h2>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-md border border-zinc-800 bg-zinc-950/70 px-1 py-2 text-center"
            >
              <p className="font-mono text-lg leading-tight font-bold text-amber-300">
                {value}
              </p>
              <p className="text-[9px] font-semibold tracking-wider text-zinc-500 uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leyenda del tablero */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-3 text-zinc-100 shadow-lg">
        <h2 className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
          <InfoIcon className="h-4 w-4" aria-hidden="true" />
          {t('app.legend.title')}
        </h2>

        <ul className="mt-2 flex flex-col gap-1.5">
          {legend.map(({ src, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-xs">
              <img
                src={src}
                alt=""
                aria-hidden="true"
                className="h-5 w-5 shrink-0 rounded-sm border border-zinc-800 object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
              <span className="text-zinc-300">{label}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
