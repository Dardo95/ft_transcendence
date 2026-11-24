import { ChefHatIcon, CircleIcon, CircleOffIcon, InfoIcon } from 'lucide-react';

import bombUrl from '../../../assets/sprites/bomb_pressure_cooker.png';
import crateUrl from '../../../assets/sprites/crate_wood.png';
import powerUpUrl from '../../../assets/sprites/powerup_extrabomb.png';
import tileWallUrl from '../../../assets/sprites/tile_table.png';
import { useLanguage } from '../../../locales/useLanguage';
import type { HudModel } from './hudModel';
import { assignRosterColors, PLAYER_COLOR_CLASSES } from './rosterColors';
import { HUD } from './hudStyles';

interface RosterEntry {
  name: string;
  alive: boolean;
  isLocal: boolean;
}

interface StatBox {
  label: string;
  value: string;
}

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
  // orden de aparición (helper compartido con FullscreenHud),
  // así el gorrito coincide con el personaje del tablero.
  const rosterWithColor = assignRosterColors(roster);

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
      <section className={HUD.surface.section}>
        <div className="flex items-center justify-between">
          <h2 className={HUD.text.sectionTitleIcon}>
            <ChefHatIcon className={HUD.icon.section} aria-hidden="true" />
            {t('app.sidebar.inKitchen')}
          </h2>
          <span className={HUD.text.valueCompact}>
            {model.playersRemaining}/{totalPlayers}
          </span>
        </div>

        <ul className={HUD.surface.list}>
          {rosterWithColor.map((entry) => (
            <li
              key={entry.name}
              className={`${HUD.surface.rowPlayer} ${
                entry.alive ? '' : 'opacity-60'
              }`}
            >
              <span
                className={`${HUD.surface.avatarBox} ${
                  PLAYER_COLOR_CLASSES[entry.color]
                }`}
                aria-hidden="true"
              >
                <ChefHatIcon className={HUD.icon.section} />
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={entry.alive ? HUD.text.name : HUD.text.nameOut}
                >
                  {entry.name}
                </span>
                {entry.isLocal && (
                  <span className={HUD.text.you}>{t('app.sidebar.you')}</span>
                )}
              </span>

              {entry.alive ? (
                <CircleIcon
                  className={HUD.icon.alive}
                  aria-label={t('app.hud.alive')}
                />
              ) : (
                <CircleOffIcon
                  className={HUD.icon.down}
                  aria-label={t('app.hud.down')}
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Estadísticas del jugador local */}
      <section className={HUD.surface.section}>
        <h2 className={HUD.text.sectionTitle}>{t('app.sidebar.yourStats')}</h2>

        <div className={HUD.surface.statGrid}>
          {stats.map(({ label, value }) => (
            <div key={label} className={HUD.surface.statBox}>
              <p className={HUD.text.valueSection}>{value}</p>
              <p className={HUD.text.statLabelSmall}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leyenda del tablero */}
      <section className={HUD.surface.section}>
        <h2 className={HUD.text.sectionTitleIcon}>
          <InfoIcon className={HUD.icon.section} aria-hidden="true" />
          {t('app.legend.title')}
        </h2>

        <ul className={HUD.surface.list}>
          {legend.map(({ src, label }) => (
            <li key={label} className={HUD.text.legendItem}>
              <img
                src={src}
                alt=""
                aria-hidden="true"
                className={HUD.surface.legendThumb}
                style={{ imageRendering: 'pixelated' }}
              />
              <span className={HUD.text.legendLabel}>{label}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
