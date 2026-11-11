import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import { useSocketStore } from '../stores/useSocketStore';
import { useLobbyStore } from '../features/chat/store/useLobbyStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useFriendsStore } from '@/features/friends/store/useFriendsStore';
import { gameSocket } from '@/lib/socket';
import { toServerMatchmakingRequest } from '../features/lobby/matchmakingRequest';
import { resolveMatchmakingErrorKey } from '../features/lobby/matchmakingErrorMessage';
import {
  countdownSeconds,
  gameRoute,
  readCancelResult,
  readGameFoundId,
  readMatchmakingStatus,
} from '../features/lobby/matchmakingEvents';
import type { TranslationKey } from '@/locales/translations';

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

  // Lobby state
  const lobby = useLobbyStore((state) => state.lobby);
  const error = useLobbyStore((state) => state.error);
  const notice = useLobbyStore((state) => state.notice);

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
  // Fallo de `game:matchmaking` (clave i18n, no texto: el
  // idioma se resuelve al renderizar).
  const [matchmakingErrorKey, setMatchmakingErrorKey] =
    useState<TranslationKey | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Mapa elegido al pedir la partida: la respuesta del backend
  // no lo trae, así que se guarda aquí para la navegación.
  const pendingMapRef = useRef<MapId>('map1');
  // `game:found` y `game:matchmakingStatus CREATED` llegan para
  // la misma partida: solo la primera navegación debe actuar.
  const navigatedRef = useRef(false);

  const navigateToGame = useCallback(
    (gameId: string) => {
      if (navigatedRef.current) {
        return;
      }

      navigatedRef.current = true;

      if (timerRef.current) clearInterval(timerRef.current);

      navigate(gameRoute(gameId, pendingMapRef.current));
    },
    [navigate]
  );

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

  // Estado del matchmaking público: el servidor manda
  // (SEARCHING → COUNTDOWN con fecha fin → CANCELLED/CREATED).
  // El countdown no se inventa localmente: se deriva de
  // `countdownEndsAt` (epoch del servidor) con un ticker de 1 s.
  useEffect(() => {
    const handleStatus = (payload: unknown) => {
      const update = readMatchmakingStatus(payload);

      if (!update) {
        return;
      }

      if (update.type === 'created') {
        navigateToGame(update.gameId);
        return;
      }

      if (update.type === 'countdown') {
        const { endsAt } = update;

        setIsSearching(true);
        setCountdown(countdownSeconds(endsAt, Date.now()));

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          const remaining = countdownSeconds(endsAt, Date.now());
          setCountdown(remaining);

          if (remaining <= 0 && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }, 1000);
        return;
      }

      if (update.type === 'searching') {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsSearching(true);
        setCountdown(null);
        return;
      }

      // cancelled
      if (timerRef.current) clearInterval(timerRef.current);
      setIsSearching(false);
      setCountdown(null);
    };

    gameSocket.on('game:matchmakingStatus', handleStatus);
    return () => {
      gameSocket.off('game:matchmakingStatus', handleStatus);
    };
  }, [navigateToGame]);

  // La partida creada llega a todos los miembros del grupo (y a
  // la práctica y al privado): es el disparador único de
  // navegación. El CREATED del status queda como red por si este
  // evento no llegara; `navigatedRef` evita la doble navegación.
  useEffect(() => {
    const handleGameFound = (payload: unknown) => {
      const gameId = readGameFoundId(payload);

      if (gameId) {
        navigateToGame(gameId);
      }
    };

    gameSocket.on('game:found', handleGameFound);
    return () => {
      gameSocket.off('game:found', handleGameFound);
    };
  }, [navigateToGame]);

  // Confirmación directa de `game:cancelMatchmaking`. El mismo
  // reset también llega vía status CANCELLED (idempotente).
  useEffect(() => {
    const handleCancelled = (payload: unknown) => {
      if (!readCancelResult(payload)) {
        return;
      }

      if (timerRef.current) clearInterval(timerRef.current);
      setIsSearching(false);
      setCountdown(null);
    };

    gameSocket.on('game:matchmakingCancelled', handleCancelled);
    return () => {
      gameSocket.off('game:matchmakingCancelled', handleCancelled);
    };
  }, []);

  // El backend rechaza `game:matchmaking` con un `exception`
  // (p. ej. al reintentar una partida que sigue viva). Sin este
  // listener el fallo era un clic silencioso. Se guarda la clave
  // y no el texto: así el idioma se resuelve al renderizar.
  useEffect(() => {
    const handleException = (payload: unknown) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsSearching(false);
      setCountdown(null);
      setMatchmakingErrorKey(resolveMatchmakingErrorKey(payload));
    };

    gameSocket.on('exception', handleException);
    return () => {
      gameSocket.off('exception', handleException);
    };
  }, []);

  const handleStartMatchmaking = (payload: MatchmakingPayload) => {
    setMatchmakingErrorKey(null);
    pendingMapRef.current = payload.mapId;

    // Público, privado y práctica hablan el mismo evento: el
    // servidor responde con status (SEARCHING/COUNTDOWN) o con
    // `game:found` en cuanto la partida existe.
    gameSocket.emit('game:matchmaking', toServerMatchmakingRequest(payload));

    if (payload.mode === 'public') {
      // Estado optimista: el SEARCHING del servidor llega en el
      // mismo tick y este evita el parpadeo del botón.
      setIsSearching(true);
      setCountdown(null);
    }
  };

  const handleCancelSearch = () => {
    // El estado se limpia con la confirmación
    // `game:matchmakingCancelled` (o con el status CANCELLED
    // que también llega a este socket): no se resetea aquí para
    // no ocultar un fallo del servidor.
    gameSocket.emit('game:cancelMatchmaking');
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
          {error}
        </div>
      )}

      {matchmakingErrorKey && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300"
        >
          {t(matchmakingErrorKey)}
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
