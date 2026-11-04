import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import { useSocketStore } from '../stores/useSocketStore';
import { useLobbyStore } from '../features/chat/store/useLobbyStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useFriendsStore } from '@/features/friends/store/useFriendsStore';

import { Card } from '@/components/ui/card';

import { LobbyStatusCard } from '../features/lobby/components/LobbyStatusCard';
import { LobbyChat } from '../features/chat/components/LobbyChat';
import { FriendsListCard } from '@/features/friends/components/FriendListCard';
import { GameModeSelector } from '../features/lobby/components/GameModeSelector';
import { MapSelector } from '../features/lobby/components/MapSelector';
import { GameSettingsCard } from '../features/lobby/components/GameSettingsCard';
import { MatchmakingButton } from '../features/lobby/components/MatchmakingButton';

import type {
  GameMode,
  MapId,
  GameSettings,
  MatchmakingPayload,
} from '../features/lobby/types';

export function LobbyPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Socket connection state
  const isConnected = useSocketStore((state) => state.isConnected);
  const socket = useSocketStore((state) => state.socket);

  // Lobby state
  const lobby = useLobbyStore((state) => state.lobby);
  const error = useLobbyStore((state) => state.error);
  const notice = useLobbyStore((state) => state.notice);
  const noticeData = useLobbyStore((state) => state.noticeData);

  const lobbyListeners = useLobbyStore((state) => state.initListeners);
  const friendsListeners = useFriendsStore((state) => state.initListeners);

  // Game settings state
  const [selectedMode, setSelectedMode] = useState<GameMode>('practice');
  const [selectedMap, setSelectedMap] = useState<MapId>('map1');
  const [settings, setSettings] = useState<GameSettings>({
    initialBombs: 1,
    initialSpeed: 1,
    fuseTime: 3,
  });

  // Search states
  const [isSearching, setIsSearching] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Host and player count in lobby
  const user = useAuthStore((state) => state.user);
  const isHost =
    !!lobby?.hostUserId && !!user?.id && lobby.hostUserId === user.id;
  const playersCount = lobby?.members?.length ?? 1;

  useEffect(() => {
    const cleanupLobbyListeners = lobbyListeners();
    const cleanupFriendsListeners = friendsListeners();

    return () => {
      cleanupLobbyListeners();
      cleanupFriendsListeners();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lobbyListeners, friendsListeners]);

  // Socket listener to receive match id from backend
  useEffect(() => {
    if (!socket) return;

    const handleGameStart = (data: { gameId: string }) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsSearching(false);
      navigate(`/game/${data.gameId}`);
    };

    socket.on('match:ready', handleGameStart);
    return () => {
      socket.off('match:ready', handleGameStart);
    };
  }, [socket, navigate]);

  const handleStartMatchmaking = (payload: MatchmakingPayload) => {
    if (payload.mode === 'practice') {
      socket?.emit('game:practice_start', payload);
      navigate('/game/practice-session');
      return;
    }

    if (payload.mode === 'private') {
      socket?.emit('game:private_start', payload);
      return;
    }

    if (payload.mode === 'public') {
      setIsSearching(true);
      setCountdown(10);
      socket?.emit('matchmaking:queue_join', payload);

      // 10-second countdown timer
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(timerRef.current!);
            socket?.emit('matchmaking:force_start');
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
  };

  const handleCancelSearch = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSearching(false);
    setCountdown(null);
    socket?.emit('matchmaking:queue_leave');
  };

  const currentPayload: MatchmakingPayload = {
    mode: selectedMode,
    mapId: selectedMap,
    settings,
  };

  return (
    <div className="w-full max-w-7xl rounded-xl border border-zinc-700 bg-zinc-900 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-orange-400">
        {t('app.lobby.lobbyTitle') || 'Lobby'}
      </h1>

      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm text-zinc-400">
          {isConnected
            ? t('app.general.connected') || 'Connected to server'
            : t('app.general.connecting') || 'Connecting...'}
        </span>

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isConnected ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300"
        >
          {t(`app.lobby.${error}`) || error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-300"
        >
          {t(`app.lobby.${notice}`) || notice}
          {notice === 'noticeInvitationSent' && noticeData && (
            <span className="ms-2 text-sm">a {noticeData}</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna principal: estado de sala + configuración y play */}
        <div className="space-y-4 lg:col-span-2">
          <GameModeSelector
            selectedMode={selectedMode}
            onChange={setSelectedMode}
            disabled={isSearching}
          />

          <MapSelector
            selectedMap={selectedMap}
            onChange={setSelectedMap}
            disabled={isSearching}
          />

          <GameSettingsCard
            settings={settings}
            onChange={setSettings}
            isHost={isHost}
            isPublicMode={selectedMode === 'public'}
          />

          <LobbyStatusCard />

          <MatchmakingButton
            mode={selectedMode}
            payload={currentPayload}
            playersCount={playersCount}
            isHost={isHost}
            isSearching={isSearching}
            countdown={countdown}
            onStart={handleStartMatchmaking}
            onCancelSearch={handleCancelSearch}
          />
        </div>

        {/* Columna lateral: amigos y chat */}
        <div className="space-y-4">
          <FriendsListCard
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
        </div>
      </div>
    </div>
  );
}
