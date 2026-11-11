import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useFriendsStore } from '@/features/friends/store/useFriendsStore';
import { FriendList } from '@/features/friends/components/FriendListCard';
import { LobbyChat } from '@/features/chat/components/LobbyChat';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';
import { Card } from '@/components/ui/card';
import { gameSocket } from '@/lib/socket';
import { useLanguage } from '@/locales/useLanguage';
import {
  countdownSeconds,
  gameRoute,
  readCancelResult,
  readGameFoundId,
  readMatchmakingStatus,
} from '@/features/lobby/matchmakingEvents';
import { toServerMatchmakingRequest } from '@/features/lobby/matchmakingRequest';

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

interface SocketErrorPayload {
  message?: string | string[];
  error?: string;
}

function socketErrorMessage(payload: unknown): string {
  if (typeof payload === 'string') return payload;

  if (payload && typeof payload === 'object') {
    const value = payload as SocketErrorPayload;

    if (Array.isArray(value.message)) return value.message.join(', ');
    if (typeof value.message === 'string') return value.message;
    if (typeof value.error === 'string') return value.error;
  }

  return 'No se pudo iniciar la partida.';
}

export function LobbyPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
  const navigatedGameId = useRef<string | null>(null);
  const requestedMap = useRef<MapId>('map1');

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

  const dismissGameError = useCallback(() => setGameError(null), []);

  const goToGame = useCallback(
    (gameId?: string) => {
      if (!gameId || navigatedGameId.current === gameId) return;

      navigatedGameId.current = gameId;
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
    };

    const handleDisconnect = () => {
      setIsGameConnected(false);
      setMatchmaking(null);
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
  }, []);

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
        return;
      }

      if (update.type === 'created') {
        goToGame(update.gameId);
        return;
      }

      const statusPayload = payload as MatchmakingStatusPayload;
      if (update.type === 'countdown') {
        setClockNow(Date.now());
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
        goToGame(gameId);
      }
    };

    const handleException = (payload: unknown) => {
      setGameError(socketErrorMessage(payload));
      setMatchmaking(null);
    };

    const handleMatchmakingCancelled = (payload: unknown) => {
      if (readCancelResult(payload)) {
        setMatchmaking(null);
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
  }, [goToGame]);

  useEffect(() => {
    if (!matchmaking?.countdownEndsAt) return;

    const timer = window.setInterval(() => setClockNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [matchmaking?.countdownEndsAt]);

  const countdown = matchmaking?.countdownEndsAt
    ? countdownSeconds(matchmaking.countdownEndsAt, clockNow)
    : null;

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);

    // Public matches always use the server-fixed values. Keep the UI in sync
    // with what the backend will actually apply.
    if (mode === 'public') {
      setSettings({ ...DEFAULT_GAME_SETTINGS });
    }
  };

  const handleStartMatchmaking = (payload: MatchmakingPayload) => {
    if (!gameSocket.connected) {
      setGameError('El servidor de juego todavía no está conectado.');
      return;
    }

    if (payload.mode === 'private' && !canStartPrivate) {
      return;
    }

    setGameError(null);
    navigatedGameId.current = null;
    requestedMap.current = payload.mapId;
    setMatchmaking({
      mode: payload.mode.toUpperCase(),
      status: 'REQUESTING',
    });

    gameSocket.emit('game:matchmaking', toServerMatchmakingRequest(payload));
  };

  const handleCancelSearch = () => {
    gameSocket.emit('game:cancelMatchmaking');
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] text-[#f6f1e9]">
      <LobbyTopBanner isGameConnected={isGameConnected} />

      <LobbyNotifications
        error={error}
        gameError={gameError}
        notice={notice}
        noticeData={noticeData}
        onDismissError={clearError}
        onDismissGameError={dismissGameError}
        onDismissNotice={clearNotice}
      />

      {matchmaking && (
        <MatchmakingStatusBanner
          matchmaking={matchmaking}
          countdown={countdown}
          onCancel={handleCancelSearch}
        />
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
        countdown={countdown}
        onStart={handleStartMatchmaking}
        onCancelSearch={handleCancelSearch}
      >
        <FriendList
          onSpectate={(gameId) => {
            navigate(`/game/${gameId}?mode=spectator`);
          }}
        />

        {lobby ? (
          <LobbyChat />
        ) : (
          <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-center text-sm text-zinc-400">
            {t('app.lobby.joinLobbyToChat') ||
              'Join a lobby to use private chat with its members.'}
          </Card>
        )}
      </GameConfig>
    </div>
  );
}
