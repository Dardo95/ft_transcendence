import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useFriendsStore } from '@/features/friends/store/useFriendsStore';
import { FriendList } from '@/features/friends/components/FriendListCard';
import { GlobalChat } from '@/features/chat/components/GlobalChat';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { gameSocket } from '@/lib/socket';
import { fetchActiveGameId } from '@/features/lobby/activeMatch';
import { useLanguage } from '@/locales/useLanguage';
import {
  countdownSeconds,
  gameRoute,
  readCancelResult,
  readGameFoundId,
  readMatchmakingStatus,
} from '@/features/lobby/matchmakingEvents';
import { resolveMatchmakingErrorKey } from '@/features/lobby/matchmakingErrorMessage';
import { toServerMatchmakingRequest } from '@/features/lobby/matchmakingRequest';

import { ActiveMatchBanner } from '@/features/lobby/components/ActiveMatchBanner';
import { ConnectingToMatchBanner } from '@/features/lobby/components/ConnectingToMatchBanner';
import { GameConfig } from '@/features/lobby/components/GameConfig';
import { LobbyNotifications } from '@/features/lobby/components/LobbyNotifications';
import { LobbyTopBanner } from '@/features/lobby/components/LobbyTopBanner';
import { MatchmakingStatusBanner } from '@/features/lobby/components/MatchmakingStatusBanner';

import {
  DEFAULT_GAME_SETTINGS,
  type GameMode,
  type GameSettings,
  type MapId,
  type MatchmakingPayload,
  type MatchmakingState,
  type MatchmakingStatus,
} from '@/features/lobby/types';

interface MatchmakingStatusPayload {
  mode?: string;
  status?: MatchmakingStatus;
  playerCount?: number;
  playersInCurrentMatch?: number;
  countdownEndsAt?: number;
}

/**
 * Safety net for the transition state: if navigation never completes after
 * the server accepted the match, the lobby must not stay blocked forever.
 */
const CONNECTING_TIMEOUT_MS = 15_000;

export function LobbyPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Lobby state
  const lobby = useLobbyStore((state) => state.lobby);
  const error = useLobbyStore((state) => state.error);
  const notice = useLobbyStore((state) => state.notice);
  const noticeData = useLobbyStore((state) => state.noticeData);
  const clearError = useLobbyStore((state) => state.clearError);
  const clearNotice = useLobbyStore((state) => state.clearNotice);

  const lobbyListeners = useLobbyStore((state) => state.initListeners);
  const friendsListeners = useFriendsStore((state) => state.initListeners);

  // Matchmaking state
  const [isGameConnected, setIsGameConnected] = useState(gameSocket.connected);
  const [matchmaking, setMatchmaking] = useState<MatchmakingState | null>(null);
  const [clockNow, setClockNow] = useState(() => Date.now());
  const [gameError, setGameError] = useState<string | null>(null);
  const [canRetryGameError, setCanRetryGameError] = useState(false);
  const [isConnectingRequested, setIsConnectingRequested] = useState(false);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const navigatedGameId = useRef<string | null>(null);
  const requestedMap = useRef<MapId>('map1');
  const lastMatchmakingPayload = useRef<MatchmakingPayload | null>(null);

  // Game settings state
  const [selectedMode, setSelectedMode] = useState<GameMode>('practice');
  const [selectedMap, setSelectedMap] = useState<MapId>('map1');
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);

  // Host and player count in lobby
  const user = useAuthStore((state) => state.user);
  const isHost =
    !!lobby?.hostUserId && !!user?.id && lobby.hostUserId === user.id;
  const playersCount = lobby?.members?.length ?? 1;

  const isSearching = matchmaking !== null;
  const canStartPrivate = isHost && playersCount > 1;

  const dismissGameError = useCallback(() => {
    setGameError(null);
    setCanRetryGameError(false);
  }, []);

  const reportActiveGameCheckFailure = useCallback(() => {
    setGameError(
      t('app.lobby.activeMatchCheckFailed') ||
        'Could not check whether you have an active match. Refresh the lobby and try again.'
    );
  }, [t]);

  const refreshActiveGame = useCallback(async () => {
    try {
      const gameId = await fetchActiveGameId();
      setActiveGameId(gameId);
    } catch {
      reportActiveGameCheckFailure();
    }
  }, [reportActiveGameCheckFailure]);

  const goToGame = useCallback(
    (gameId?: string) => {
      if (!gameId || navigatedGameId.current === gameId) return;

      navigatedGameId.current = gameId;
      setIsConnectingRequested(true);
      setMatchmaking(null);
      navigate(gameRoute(gameId, requestedMap.current));
    },
    [navigate]
  );

  useEffect(() => {
    const cleanupLobbyListeners = lobbyListeners();
    const cleanupFriendsListeners = friendsListeners();

    return () => {
      cleanupLobbyListeners();
      cleanupFriendsListeners();
    };
  }, [lobbyListeners, friendsListeners]);

  // Keep the game namespace ready while the player configures a match.
  useEffect(() => {
    const handleConnect = () => {
      setIsGameConnected(true);
      setGameError(null);
      setCanRetryGameError(false);
      void refreshActiveGame();
    };

    const handleDisconnect = () => {
      setIsGameConnected(false);
      setMatchmaking(null);
      // Never leave the player on an infinite connecting screen.
      setIsConnectingRequested(false);
    };

    gameSocket.on('connect', handleConnect);
    gameSocket.on('disconnect', handleDisconnect);

    if (!gameSocket.connected) {
      gameSocket.connect();
    }

    return () => {
      gameSocket.off('connect', handleConnect);
      gameSocket.off('disconnect', handleDisconnect);

      // GameViewport owns the game socket lifecycle while a match is open.
      if (!window.location.pathname.startsWith('/game')) {
        gameSocket.disconnect();
      }
    };
  }, [refreshActiveGame]);

  // Recover an already running match after mounting or reloading the lobby.
  useEffect(() => {
    let cancelled = false;

    void fetchActiveGameId()
      .then((gameId) => {
        if (!cancelled) setActiveGameId(gameId);
      })
      .catch(() => {
        if (!cancelled) reportActiveGameCheckFailure();
      });

    return () => {
      cancelled = true;
    };
  }, [reportActiveGameCheckFailure]);

  // Keep the active match in sync with match lifecycle events.
  useEffect(() => {
    const handleGameFinished = (payload: unknown) => {
      const gameId = readGameFoundId(payload);

      setActiveGameId((current) =>
        !gameId || current === gameId ? null : current
      );
    };

    const handlePlayerRemoved = (payload: unknown) => {
      if (!user) return;

      const data = payload as { gameId?: unknown; userId?: unknown };
      if (Number(data.userId) !== user.id) return;

      const gameId =
        typeof data.gameId === 'string' && data.gameId.trim()
          ? data.gameId
          : null;

      setActiveGameId((current) =>
        !gameId || current === gameId ? null : current
      );
    };

    gameSocket.on('game:finished', handleGameFinished);
    gameSocket.on('game:playerLeft', handlePlayerRemoved);
    gameSocket.on('game:playerAbandoned', handlePlayerRemoved);

    return () => {
      gameSocket.off('game:finished', handleGameFinished);
      gameSocket.off('game:playerLeft', handlePlayerRemoved);
      gameSocket.off('game:playerAbandoned', handlePlayerRemoved);
    };
  }, [user]);

  // The backend confirms the session for every mode. Practice and private
  // matches report CREATED immediately; public matches report SEARCHING until
  // game:found is emitted for the whole lobby.
  useEffect(() => {
    const handleMatchmakingStatus = (payload: unknown) => {
      const update = readMatchmakingStatus(payload);

      if (!update) {
        return;
      }

      if (update.type === 'cancelled') {
        setMatchmaking(null);
        setIsConnectingRequested(false);
        return;
      }

      if (update.type === 'created') {
        setActiveGameId(update.gameId);
        setIsConnectingRequested(true);
        goToGame(update.gameId);
        return;
      }

      const statusPayload = payload as MatchmakingStatusPayload;
      if (update.type === 'countdown') {
        setClockNow(Date.now());
      } else {
        // A fresh search is no longer a terminal connection transition.
        setIsConnectingRequested(false);
      }

      setMatchmaking({
        mode: statusPayload.mode ?? 'PUBLIC',
        status: update.type === 'countdown' ? 'COUNTDOWN' : 'SEARCHING',
        playerCount: statusPayload.playerCount,
        playersInCurrentMatch: statusPayload.playersInCurrentMatch,
        countdownEndsAt:
          update.type === 'countdown'
            ? update.endsAt
            : statusPayload.countdownEndsAt,
      });
    };

    const handleGameFound = (payload: unknown) => {
      const gameId = readGameFoundId(payload);
      if (gameId) {
        setActiveGameId(gameId);
        setIsConnectingRequested(true);
        goToGame(gameId);
      }
    };

    const handleException = (payload: unknown) => {
      setGameError(t(resolveMatchmakingErrorKey(payload)));
      setCanRetryGameError(Boolean(lastMatchmakingPayload.current));
      setMatchmaking(null);
      // Recoverable: release the transition state so the player can retry.
      setIsConnectingRequested(false);
    };

    const handleMatchmakingCancelled = (payload: unknown) => {
      if (readCancelResult(payload)) {
        setMatchmaking(null);
        setIsConnectingRequested(false);
      }
    };

    gameSocket.on('game:matchmakingStatus', handleMatchmakingStatus);
    gameSocket.on('game:found', handleGameFound);
    gameSocket.on('exception', handleException);
    gameSocket.on('game:matchmakingCancelled', handleMatchmakingCancelled);

    return () => {
      gameSocket.off('game:matchmakingStatus', handleMatchmakingStatus);
      gameSocket.off('game:found', handleGameFound);
      gameSocket.off('exception', handleException);
      gameSocket.off('game:matchmakingCancelled', handleMatchmakingCancelled);
    };
  }, [goToGame, t]);

  useEffect(() => {
    if (!matchmaking?.countdownEndsAt) return;

    const timer = window.setInterval(() => setClockNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [matchmaking?.countdownEndsAt]);

  const countdown = matchmaking?.countdownEndsAt
    ? countdownSeconds(matchmaking.countdownEndsAt, clockNow)
    : null;

  // A public countdown that reaches zero means the server is about to create
  // the match, so the transition is derived instead of set from an effect.
  const countdownResolved =
    matchmaking?.status === 'COUNTDOWN' && countdown !== null && countdown <= 0;
  const isConnectingToMatch = isConnectingRequested || countdownResolved;

  // Recoverable timeout: if the transition never finishes, release the lobby
  // and offer a retry instead of leaving the controls disabled forever.
  useEffect(() => {
    if (!isConnectingToMatch) return;

    const timer = window.setTimeout(() => {
      setIsConnectingRequested(false);
      setMatchmaking(null);
      setCanRetryGameError(Boolean(lastMatchmakingPayload.current));
      setGameError(
        t('app.lobby.matchmakingTimeout') ||
          'The match is taking too long to open. Please try again.'
      );
    }, CONNECTING_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [isConnectingToMatch, t]);

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);

    // Public matches always use the server-fixed values. Keep the UI in sync
    // with what the backend will actually apply.
    if (mode === 'public') {
      setSettings({ ...DEFAULT_GAME_SETTINGS });
    }
  };

  const handleStartMatchmaking = (payload: MatchmakingPayload) => {
    if (isConnectingToMatch) {
      return;
    }

    if (!gameSocket.connected) {
      setGameError(
        t('app.lobby.errorNotConnected') ||
          'You are not connected to the server.'
      );
      return;
    }

    if (payload.mode === 'private' && !canStartPrivate) {
      return;
    }

    lastMatchmakingPayload.current = payload;
    setGameError(null);
    setCanRetryGameError(false);
    navigatedGameId.current = null;
    requestedMap.current = payload.mapId;
    setMatchmaking({
      mode: payload.mode.toUpperCase(),
      status: 'REQUESTING',
    });

    // Practice and private matches are created immediately, so the player is
    // already transitioning. Public matches keep searching until the
    // countdown resolves or `game:found` arrives.
    setIsConnectingRequested(payload.mode !== 'public');

    gameSocket.emit('game:matchmaking', toServerMatchmakingRequest(payload));
  };

  const handleCancelSearch = () => {
    setIsConnectingRequested(false);
    setMatchmaking(null);
    gameSocket.emit('game:cancelMatchmaking');
  };

  const handleRetryMatchmaking = () => {
    const payload = lastMatchmakingPayload.current;

    if (payload) {
      handleStartMatchmaking(payload);
    }
  };

  return (
    <div className="text-foreground mx-auto w-full max-w-[1440px]">
      <LobbyTopBanner isGameConnected={isGameConnected} />

      <LobbyNotifications
        error={error}
        gameError={gameError}
        notice={notice}
        noticeData={noticeData}
        onDismissError={clearError}
        onDismissGameError={dismissGameError}
        onDismissNotice={clearNotice}
        onRetryGameError={
          canRetryGameError ? handleRetryMatchmaking : undefined
        }
      />

      {isConnectingToMatch ? (
        <ConnectingToMatchBanner />
      ) : (
        matchmaking && (
          <MatchmakingStatusBanner
            matchmaking={matchmaking}
            countdown={countdown}
            onCancel={handleCancelSearch}
          />
        )
      )}

      {!isConnectingToMatch && activeGameId && (
        <ActiveMatchBanner gameId={activeGameId} />
      )}

      <GameConfig
        selectedMode={selectedMode}
        onModeChange={handleModeChange}
        selectedMap={selectedMap}
        onMapChange={setSelectedMap}
        settings={settings}
        onSettingsChange={setSettings}
        isHost={isHost}
        playersCount={playersCount}
        isSearching={isSearching}
        disabled={isConnectingToMatch || isSearching || Boolean(activeGameId)}
        countdown={countdown}
        onStart={handleStartMatchmaking}
        onCancelSearch={handleCancelSearch}
      >
        <FriendList
          onSpectate={(gameId) => {
            navigate(`/game/${gameId}?mode=spectator`);
          }}
        />

        <GlobalChat />
      </GameConfig>
    </div>
  );
}
