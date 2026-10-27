import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import { useSocketStore } from '../stores/useSocketStore';
import { useLobbyStore } from '../features/chat/store/useLobbyStore';
import { Card } from '@/components/ui/card';

import { LobbyStatusCard } from '../features/lobby/components/LobbyStatusCard';
import { LobbyChat } from '../features/chat/components/LobbyChat';
import { FriendsListCard } from '@/features/friends/components/FriendListCard';
import { GameModeSelector } from '../features/lobby/components/GameModeSelector';
import { MapSelector } from '../features/lobby/components/MapSelector';
import { GameSettingsCard } from '../features/lobby/components/GameSettingsCard';
import { MatchmakingButton } from '../features/lobby/components/MatchmakingButton';

import type { FriendUser } from '@/features/friends/service/friendsService';
import type {
  GameMode,
  MapId,
  GameSettings,
  MatchmakingPayload,
} from '../features/lobby/types';

export function LobbyPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Estado de conexión del socket
  const isConnected = useSocketStore((state) => state.isConnected);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const socket = useSocketStore((state) => state.socket);

  // Estado del lobby
  const lobby = useLobbyStore((state) => state.lobby);
  const error = useLobbyStore((state) => state.error);
  const notice = useLobbyStore((state) => state.notice);
  const initListeners = useLobbyStore((state) => state.initListeners);
  const inviteFriend = useLobbyStore((state) => state.inviteFriendToLobby);

  // Estados de configuración de partida
  const [selectedMode, setSelectedMode] = useState<GameMode>('practice');
  const [selectedMap, setSelectedMap] = useState<MapId>('red_map');
  const [settings, setSettings] = useState<GameSettings>({
    initialBombs: 1,
    initialSpeed: 1,
    fuseTime: 3,
  });

  // Estados de búsqueda
  const [isSearching, setIsSearching] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Host y número de jugadores en el lobby
  const isHost = lobby?.hostUserId === socket?.id;
  const playersCount = lobby?.members?.length ?? 1;

  useEffect(() => {
    const cleanupListeners = initListeners();
    connect();

    return () => {
      cleanupListeners();
      disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initListeners, connect, disconnect]);

  // Listener del socket para recibir el id de partida desde backend
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
      // Directo a partida con bot inerte
      socket?.emit('game:practice_start', payload);
      // Fallback local en caso de resolución directa por frontend:
      // navigate('/game/practice-session');
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

      // Temporizador de 10 segundos para rellenar
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

  const handleInviteToLobby = async (friend: FriendUser) => {
    try {
      await inviteFriend(friend.username);
    } catch (err) {
      console.error('Error al invitar al lobby:', err);
    }
  };

  const currentPayload: MatchmakingPayload = {
    mode: selectedMode,
    mapId: selectedMap,
    settings,
  };

  return (
    <div className="w-full max-w-7xl rounded-xl border border-zinc-700 bg-zinc-900 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-orange-400">
        {t('app.Lobby') || 'Lobby'}
      </h1>

      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm text-zinc-400">
          {isConnected
            ? t('app.connected') || 'Conectado al servidor'
            : t('app.connecting') || 'Conectando...'}
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
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-300"
        >
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna principal: estado de sala + configuración y play */}
        <div className="space-y-4 lg:col-span-2">
          <LobbyStatusCard />

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
            onInviteToLobby={handleInviteToLobby}
            onSpectate={(gameId) => {
              navigate(`/game/${gameId}?mode=spectator`);
            }}
          />

          {lobby ? (
            <LobbyChat />
          ) : (
            <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 text-center text-sm text-zinc-400">
              {t('app.joinLobbyToChat') ||
                'Entra en un lobby para utilizar el chat privado con sus miembros.'}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
