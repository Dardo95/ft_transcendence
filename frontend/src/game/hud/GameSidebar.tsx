import {
  BombIcon,
  ChefHatIcon,
  CircleIcon,
  CircleOffIcon,
  CoffeeIcon,
  FlameIcon,
  type LucideIcon,
  PackageIcon,
  ScrollTextIcon,
  SquareIcon,
  ZapIcon,
} from 'lucide-react';

import { useLanguage } from '../../locales/useLanguage';
import type { HudModel } from './hudModel';

interface RosterEntry {
  name: string;
  alive: boolean;
  isLocal: boolean;
}

interface StatBox {
  icon: LucideIcon;
  label: string;
  value: string;
}

// Tinte de avatar por posición del roster (mismo criterio
// "color e id" que el render de jugadores en el canvas).
const AVATAR_TINTS = [
  'bg-emerald-950 text-emerald-300 border-emerald-800',
  'bg-sky-950 text-sky-300 border-sky-800',
  'bg-amber-950 text-amber-300 border-amber-800',
  'bg-rose-950 text-rose-300 border-rose-800',
] as const;

interface LegendItem {
  icon: LucideIcon;
  label: string;
  className: string;
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

  const stats: StatBox[] = [
    {
      icon: BombIcon,
      label: t('app.sidebar.bombs'),
      value: String(model.local.availableBombs),
    },
    {
      icon: FlameIcon,
      label: t('app.sidebar.blast'),
      value: String(model.local.blastRadius),
    },
    {
      icon: CoffeeIcon,
      label: t('app.sidebar.speed'),
      value: model.local.speed.toFixed(1),
    },
  ];

  const legend: LegendItem[] = [
    {
      icon: SquareIcon,
      label: t('app.legend.wall'),
      className: 'text-zinc-500',
    },
    {
      icon: PackageIcon,
      label: t('app.legend.crate'),
      className: 'text-amber-700',
    },
    { icon: BombIcon, label: t('app.legend.bomb'), className: 'text-zinc-300' },
    {
      icon: ZapIcon,
      label: t('app.legend.powerUp'),
      className: 'text-yellow-400',
    },
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
          {roster.map((entry, index) => (
            <li
              key={entry.name}
              className={`flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-950/70 px-2.5 py-2 ${
                entry.alive ? '' : 'opacity-60'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                  AVATAR_TINTS[index % AVATAR_TINTS.length]
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
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-md border border-zinc-800 bg-zinc-950/70 px-1 py-2 text-center"
            >
              <Icon
                className="mx-auto h-4 w-4 text-zinc-500"
                aria-hidden="true"
              />
              <p className="mt-1 font-mono text-lg leading-tight font-bold text-amber-300">
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
          <ScrollTextIcon className="h-4 w-4" aria-hidden="true" />
          {t('app.legend.title')}
        </h2>

        <ul className="mt-2 flex flex-col gap-1.5">
          {legend.map(({ icon: Icon, label, className }) => (
            <li key={label} className="flex items-center gap-2.5 text-xs">
              <Icon
                className={`h-4 w-4 shrink-0 ${className}`}
                aria-hidden="true"
              />
              <span className="text-zinc-300">{label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-3 border-t border-zinc-800 pt-2 text-[11px] leading-snug text-zinc-500 italic">
          {t('app.legend.serverNote')}
        </p>
      </section>
    </div>
  );
}
