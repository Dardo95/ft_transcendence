import { useEffect, useRef, useState } from 'react';
import { CircleIcon, CircleOffIcon, InfoIcon, Users } from 'lucide-react';
import type { UserPublic } from '@transcendence/shared';

import bombUrl from '../../../assets/sprites/bomb_pressure_cooker.png';
import crateUrl from '../../../assets/sprites/crate_wood.png';
import powerUpUrl from '../../../assets/sprites/powerup_extrabomb.png';
import tileWallUrl from '../../../assets/sprites/tile_table.png';
import defaultAvatar from '../../../assets/default.jpg';
import { ApiError, apiFetch } from '../../../api/api';
import { useLanguage } from '../../../locales/useLanguage';
import { UI } from '../../../components/layout/layoutStyles';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { PLAYER_COLORS, type PlayerColor } from '../players/types';
import type { HudModel } from './hudModel';

interface RosterEntry {
  id: string;
  name: string;
  avatarUrl: string | null;
  isBot: boolean;
  alive: boolean;
  isLocal: boolean;
}

interface AvatarRequest {
  id: string;
  username: string;
}

interface StatBox {
  label: string;
  value: string;
}

// Mismos colores que los marcadores de los jugadores del canvas
// (PLAYER_COLORS), para que el borde del avatar del sidebar coincida
// con el color del personaje que se ve en el tablero.
const PLAYER_COLOR_CLASSES: Record<PlayerColor, string> = {
  blue: 'bg-blue-950 text-blue-300 border-blue-700',
  green: 'bg-emerald-950 text-emerald-300 border-emerald-700',
  red: 'bg-red-950 text-red-300 border-red-700',
  yellow: 'bg-yellow-950 text-yellow-300 border-yellow-700',
};
const PLAYER_COLOR_UNDERLINE_CLASSES: Record<PlayerColor, string> = {
  blue: 'border-b-blue-700',
  green: 'border-b-emerald-700',
  red: 'border-b-red-700',
  yellow: 'border-b-yellow-700',
};

interface LegendItem {
  src: string;
  label: string;
}

/**
 * Panel lateral de la partida: jugadores, estadísticas del jugador
 * local y leyenda del tablero.
 */
export function GameSidebar({
  model,
  demo = false,
  threeColumn = false,
  responsive = false,
}: {
  model: HudModel;
  demo?: boolean;
  threeColumn?: boolean;
  responsive?: boolean;
}) {
  const { t } = useLanguage();
  const gridLayout = threeColumn;
  const localAvatarUrl = useAuthStore((state) => state.user?.avatarUrl ?? null);
  const [rivalAvatars, setRivalAvatars] = useState<
    Record<string, string | null>
  >({});
  const avatarRequests = model.rivals
    .filter((rival) => !demo && !rival.isBot)
    .map((rival) => ({ id: rival.id, username: rival.name }));
  const avatarRequestKey = JSON.stringify(avatarRequests);
  const avatarCache = useRef(new Map<string, Promise<string | null>>());

  useEffect(() => {
    let cancelled = false;
    const requests = JSON.parse(avatarRequestKey) as AvatarRequest[];

    void Promise.all(
      requests.map(async ({ id, username }) => {
        let avatarRequest = avatarCache.current.get(id);

        if (!avatarRequest) {
          avatarRequest = apiFetch<UserPublic>(
            `/users/${encodeURIComponent(username)}`,
            { method: 'GET' }
          )
            .then((user) => user.avatarUrl)
            .catch((error: unknown) => {
              if (!(error instanceof ApiError && error.status === 404)) {
                console.warn(
                  `[GameSidebar] Could not load avatar for ${username}.`,
                  error
                );
              }
              return null;
            });
          avatarCache.current.set(id, avatarRequest);
        }

        return { id, avatarUrl: await avatarRequest };
      })
    ).then((avatars) => {
      if (cancelled) return;

      setRivalAvatars((current) => {
        const next = { ...current };
        let changed = false;

        for (const { id, avatarUrl } of avatars) {
          if (current[id] !== avatarUrl) {
            next[id] = avatarUrl;
            changed = true;
          }
        }

        return changed ? next : current;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [avatarRequestKey]);

  if (!model.local) {
    return null;
  }

  const totalPlayers = 1 + model.rivals.length;

  const roster: RosterEntry[] = [
    {
      id: model.local.id,
      name: model.local.isBot ? 'Bot' : model.local.name,
      avatarUrl: demo || model.local.isBot ? null : localAvatarUrl,
      isBot: model.local.isBot,
      alive: model.local.alive,
      isLocal: true,
    },
    ...model.rivals.map((rival) => ({
      id: rival.id,
      name: rival.isBot ? 'Bot' : rival.name,
      avatarUrl: demo || rival.isBot ? null : (rivalAvatars[rival.id] ?? null),
      isBot: rival.isBot,
      alive: rival.alive,
      isLocal: false,
    })),
  ];

  // Replica PlayerLayer.assignColor: el primer color libre sigue el
  // orden de aparición en el roster y el canvas.
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
    <div
      className={
        responsive
          ? UI.game.sidebarResponsiveGrid
          : gridLayout
            ? UI.game.sidebarGrid
            : UI.game.sidebarStack
      }
    >
      <section
        className={gridLayout ? UI.game.sidebarGridPanel : UI.game.sidebarPanel}
      >
        {/* Jugadores de la partida */}
        <div className={UI.game.sidebarHeader}>
          <h2
            className={
              gridLayout ? UI.game.sidebarGridHeading : UI.game.sidebarHeading
            }
          >
            <Users
              className={gridLayout ? 'h-3 w-3 shrink-0' : UI.icon.sm}
              aria-hidden="true"
            />
            {t('app.sidebar.players') || 'Players'}
          </h2>
          <span
            className={
              gridLayout ? UI.game.sidebarGridCount : UI.game.sidebarCount
            }
          >
            {model.playersRemaining}/{totalPlayers}
          </span>
        </div>

        <ul className="mt-2 flex flex-col gap-1.5">
          {rosterWithColor.map((entry) => (
            <li
              key={entry.id}
              className={`${
                gridLayout ? UI.game.sidebarGridRosterRow : UI.game.rosterRow
              } border-b-2 ${
                PLAYER_COLOR_UNDERLINE_CLASSES[entry.color]
              } ${entry.alive ? '' : 'opacity-60'}`}
            >
              <div
                className={`${
                  gridLayout
                    ? UI.game.sidebarGridPlayerAvatar
                    : 'size-9 shrink-0 overflow-hidden rounded-full border-4'
                } ${PLAYER_COLOR_CLASSES[entry.color]}`}
              >
                <img
                  src={
                    demo || entry.isBot
                      ? defaultAvatar
                      : entry.avatarUrl || defaultAvatar
                  }
                  alt=""
                  aria-hidden="true"
                  className={`${UI.avatar.full} rounded-full`}
                />
              </div>

              <span className="min-w-0 flex-1">
                <span
                  className={`${UI.game.playerName} ${
                    entry.alive ? '' : 'line-through'
                  }`}
                >
                  {entry.name}
                </span>
                {entry.isLocal && (
                  <span className={UI.game.localPlayer}>
                    {t('app.sidebar.you')}
                  </span>
                )}
              </span>

              {entry.alive ? (
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
            </li>
          ))}
        </ul>
      </section>

      <section
        className={gridLayout ? UI.game.sidebarGridPanel : UI.game.sidebarPanel}
      >
        {/* Estadísticas del jugador local */}
        <h2
          className={gridLayout ? UI.game.sidebarGridHeading : UI.text.sublabel}
        >
          {t('app.sidebar.yourStats')}
        </h2>

        <div
          className={gridLayout ? UI.game.sidebarGridStats : UI.game.statsGrid}
        >
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className={
                gridLayout ? UI.game.sidebarGridStatCard : UI.game.statCard
              }
            >
              <p
                className={
                  gridLayout ? UI.game.sidebarGridStatValue : UI.game.statValue
                }
              >
                {value}
              </p>
              <p
                className={
                  gridLayout ? UI.game.sidebarGridStatLabel : UI.game.statLabel
                }
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className={gridLayout ? UI.game.sidebarGridPanel : UI.game.sidebarPanel}
      >
        {/* Leyenda del tablero */}
        <h2
          className={
            gridLayout ? UI.game.sidebarGridHeading : UI.game.sidebarHeading
          }
        >
          <InfoIcon
            className={gridLayout ? 'h-3 w-3 shrink-0' : 'h-4 w-4'}
            aria-hidden="true"
          />
          {t('app.legend.title')}
        </h2>

        <ul className="mt-2 flex flex-col gap-1.5">
          {legend.map(({ src, label }) => (
            <li
              key={label}
              className={
                gridLayout ? UI.game.sidebarGridLegendItem : UI.game.legendItem
              }
            >
              <img
                src={src}
                alt=""
                aria-hidden="true"
                className={
                  gridLayout
                    ? UI.game.sidebarGridLegendIcon
                    : UI.game.legendIcon
                }
                style={{ imageRendering: 'pixelated' }}
              />
              <span
                className={
                  gridLayout ? `${UI.text.body} min-w-0 truncate` : UI.text.body
                }
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
