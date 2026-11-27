import { TargetIcon, UsersIcon } from 'lucide-react';
import type { GamePlayerSnapshot } from '@transcendence/shared';

import { Button } from '../../../components/ui/button';
import { UI } from '../../../components/layout/layoutStyles';
import { useLanguage } from '../../../locales/useLanguage';
import { PlayerPanel } from '../../game/hud/FullscreenHud';
import { assignRosterColors } from '../../game/hud/rosterColors';

interface SpectatorScoreboardProps {
  players: readonly GamePlayerSnapshot[];
  hasSnapshot: boolean;
  focusedPlayerId: string | null;
  onFocusPlayer: (playerId: string | null) => void;
}

/**
 * Neutral live players scoreboard reusing `PlayerPanel` in a 2-column grid
 * with camera focus controls.
 */
export function SpectatorScoreboard({
  players,
  hasSnapshot,
  focusedPlayerId,
  onFocusPlayer,
}: SpectatorScoreboardProps) {
  const { t } = useLanguage();
  const aliveCount = players.filter((player) => player.alive).length;
  const rosterWithColor = assignRosterColors(players);

  return (
    <aside
      className={UI.spectator.scoreboardPanel}
      aria-label={
        t('app.spectator.playersScoreboard') || 'Live players scoreboard'
      }
    >
      <div className={UI.game.sidebarHeader}>
        <h2 className={UI.game.sidebarHeading}>
          <UsersIcon className={UI.icon.sm} aria-hidden="true" />
          {t('app.spectator.playersScoreboard') || 'Live players scoreboard'}
        </h2>
        {hasSnapshot && (
          <span className={UI.game.sidebarCount}>
            {aliveCount}/{players.length}
          </span>
        )}
      </div>

      {!hasSnapshot ? (
        <p className={`${UI.text.muted} mt-2`}>
          {t('app.spectator.loading') || 'Connecting to match...'}
        </p>
      ) : (
        <>
          <ul className={UI.spectator.scoreboardGrid}>
            {rosterWithColor.map((player) => (
              <li key={player.id} className="min-w-0">
                <PlayerPanel
                  name={player.displayName ?? player.id}
                  alive={player.alive}
                  color={player.color}
                  isLocal={false}
                  fullWidth
                  stats={[
                    {
                      label: t('app.spectator.bombs') || 'Bombs',
                      value: String(player.bombCapacity),
                    },
                    {
                      label: t('app.spectator.blast') || 'Blast',
                      value: String(player.blastRadius),
                    },
                    {
                      label: t('app.spectator.speed') || 'Speed',
                      value: player.speed.toFixed(1),
                    },
                  ]}
                  onClick={() => onFocusPlayer(player.id)}
                  focused={focusedPlayerId === player.id}
                  ariaLabel={`${t('app.spectator.focusPlayer') || 'Focus player'}: ${player.displayName ?? player.id}`}
                />
              </li>
            ))}
          </ul>

          <div className={UI.spectator.scoreboardFooter}>
            <p className={UI.text.hint}>
              {t('app.spectator.focusHint') ||
                'Select a player to follow their view.'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onFocusPlayer(null)}
              disabled={!focusedPlayerId}
            >
              <TargetIcon className={UI.icon.sm} aria-hidden="true" />
              {t('app.spectator.fullArena') || 'Full arena'}
            </Button>
          </div>
        </>
      )}
    </aside>
  );
}
