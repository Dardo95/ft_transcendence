import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { GamePlayerSnapshot, GameSnapshot } from '@transcendence/shared';

import { UI } from '../../../components/layout/layoutStyles';
import { useLanguage } from '../../../locales/useLanguage';
import { GameViewport } from '@/features/game';
import { EndScreenOverlay } from '../../game/components/EndScreenOverlay';
import { useFullscreen } from '../../game/hooks/useFullscreen';
import { GameTopBar } from '../../game/hud/GameTopBar';
import { buildHudModel } from '../../game/hud/hudModel';
import type { GameJoinFailure } from '../../game/net/gameConnection';
import { SpectatorErrorCard } from './SpectatorErrorCard';
import { SpectatorHeaderCard } from './SpectatorHeaderCard';
import { SpectatorScoreboard } from './SpectatorScoreboard';

interface SpectatorPageProps {
  /** Match id from the route (`/game/:id`). */
  gameId: string;
}

const DEFAULT_MAP_ID = 'map1';

/**
 * Neutral view for watching a live match.
 *
 * Composes the shared game primitives (`GameTopBar`, `GameViewport`,
 * `FullscreenHud`, `EndScreenOverlay`, and `PlayerPanel`) alongside
 * spectator-only header, scoreboard, and join-error cards.
 */
export function SpectatorPage({ gameId }: SpectatorPageProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewportRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(viewportRef);

  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [joinFailure, setJoinFailure] = useState<GameJoinFailure | null>(null);
  const [focusedPlayerId, setFocusedPlayerId] = useState<string | null>(null);

  const goToLobby = () => navigate('/lobby');
  const retry = () => window.location.reload();

  const players: GamePlayerSnapshot[] = snapshot?.players ?? [];
  const mapId = (searchParams.get('map') ?? DEFAULT_MAP_ID).toUpperCase();
  const hudModel = snapshot
    ? buildHudModel(
        snapshot.players,
        snapshot.bombs,
        null,
        snapshot.elapsedMs,
        {
          mapWidth: snapshot.board.width,
          mapHeight: snapshot.board.height,
          mapId,
          gameId,
          isOvertime: snapshot.status === 'OVERTIME',
        }
      )
    : null;

  const isFinished = snapshot?.status === 'FINISHED';
  const isDraw = isFinished && snapshot.winnerId === null;
  const winnerName =
    isFinished && snapshot.winnerId !== null
      ? (players.find((player) => player.id === snapshot.winnerId)
          ?.displayName ?? snapshot.winnerId)
      : null;

  return (
    <div className={UI.spectator.pageLayout} data-game-id={gameId}>
      <SpectatorHeaderCard />

      <div className={UI.spectator.bodyLayout}>
        <div className={UI.spectator.arenaColumn}>
          {hudModel && (
            <GameTopBar
              model={hudModel}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              onLeave={goToLobby}
            />
          )}

          {joinFailure ? (
            <SpectatorErrorCard
              reason={joinFailure}
              onBack={goToLobby}
              onRetry={retry}
            />
          ) : (
            <GameViewport
              spectator
              viewportRef={viewportRef}
              onSnapshotUpdate={setSnapshot}
              onJoinFailure={setJoinFailure}
              focusedPlayerId={focusedPlayerId}
            >
              {isFinished && (
                <EndScreenOverlay
                  state={isDraw ? 'draw' : 'victory'}
                  subtitle={t('app.spectator.resultTitle') || 'Match result'}
                  title={
                    isDraw
                      ? t('app.spectator.matchDraw') || 'Draw'
                      : `${t('app.spectator.matchWinner') || 'Winner'}: ${winnerName}`
                  }
                  onReturnToLobby={goToLobby}
                />
              )}
            </GameViewport>
          )}
        </div>

        <SpectatorScoreboard
          players={players}
          hasSnapshot={snapshot !== null}
          focusedPlayerId={focusedPlayerId}
          onFocusPlayer={setFocusedPlayerId}
        />
      </div>
    </div>
  );
}
