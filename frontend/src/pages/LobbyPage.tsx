import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import { useLobbyStore } from '../features/chat/store/useLobbyStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useFriendsStore } from '@/features/friends/store/useFriendsStore';
import { gameSocket } from '@/lib/socket';

import { Card } from '@/components/ui/card';

import { LobbyStatusCard } from '../features/lobby/components/LobbyStatusCard';
import { LobbyChat } from '../features/chat/components/LobbyChat';
import { FriendList } from '@/features/friends/components/FriendListCard';
import { GameSettingsCard } from '../features/lobby/components/GameSettingsCard';

import type { GameMode, MapId, GameSettings } from '../features/lobby/types';

type MatchmakingStatus =
  'REQUESTING' | 'SEARCHING' | 'COUNTDOWN' | 'CANCELLED' | 'CREATED';

interface MatchmakingStatusPayload {
  mode?: string;
  status?: MatchmakingStatus;
  gameId?: string;
  playerCount?: number;
  playersInCurrentMatch?: number;
  countdownEndsAt?: number;
}

interface MatchmakingState {
  mode: string;
  status: MatchmakingStatus;
  playerCount?: number;
  playersInCurrentMatch?: number;
  countdownEndsAt?: number;
}

interface GameFoundPayload {
  gameId?: string;
}

interface SocketErrorPayload {
  message?: string | string[];
  error?: string;
}

const MAPS: Array<{ id: MapId; name: string; subtitle: string }> = [
  { id: 'map1', name: 'ARENA 01', subtitle: '13 × 11 · clásico' },
  { id: 'map2', name: 'ARENA 02', subtitle: '13 × 11 · abierto' },
  { id: 'map3', name: 'ARENA 03', subtitle: '13 × 11 · laberinto' },
];

const MENU_ART_CELLS = [
  '✦',
  '▦',
  '✹',
  '▦',
  '✦',
  '▦',
  '●',
  '▦',
  '●',
  '▦',
  '✹',
  '▦',
  '●',
  '▦',
  '✹',
] as const;

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

function modeLabel(mode: string): string {
  switch (mode.toUpperCase()) {
    case 'PUBLIC':
      return 'PÚBLICA';
    case 'PRIVATE':
      return 'PRIVADA';
    default:
      return 'PRÁCTICA';
  }
}

function artCellClass(index: number): string {
  if ((index + 1) % 3 === 0) {
    return 'bg-[linear-gradient(145deg,#71452b,#3a281e)] text-[#ffc36f]';
  }
  if (index === 6 || index === 8 || index === 12) {
    return 'text-[#ff7844]';
  }
  return 'bg-[linear-gradient(145deg,#363b3e,#1b2024)] text-[#d8a06c]';
}

export function LobbyPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Lobby state
  const lobby = useLobbyStore((state) => state.lobby);
  const error = useLobbyStore((state) => state.error);
  const notice = useLobbyStore((state) => state.notice);
  const noticeData = useLobbyStore((state) => state.noticeData);

  const lobbyListeners = useLobbyStore((state) => state.initListeners);
  const friendsListeners = useFriendsStore((state) => state.initListeners);

  // Matchmaking state
  const [isGameConnected, setIsGameConnected] = useState(gameSocket.connected);
  const [matchmaking, setMatchmaking] = useState<MatchmakingState | null>(null);
  const [clockNow, setClockNow] = useState(() => Date.now());
  const [gameError, setGameError] = useState<string | null>(null);
  const navigatedGameId = useRef<string | null>(null);

  // Game settings state
  const [selectedMode, setSelectedMode] = useState<GameMode>('practice');
  const [selectedMap, setSelectedMap] = useState<MapId>('map1');
  const [settings, setSettings] = useState<GameSettings>({
    initialBombs: 1,
    initialSpeed: 1,
    fuseTime: 3,
  });

  // Host and player count in lobby
  const user = useAuthStore((state) => state.user);
  const isHost =
    !!lobby?.hostUserId && !!user?.id && lobby.hostUserId === user.id;
  const playersCount = lobby?.members?.length ?? 1;

  const isSearching = matchmaking !== null;
  const canStartPrivate = isHost && playersCount > 1;
  const canStartMatch = selectedMode === 'private' ? canStartPrivate : true;

  const goToGame = useCallback(
    (gameId?: string) => {
      if (!gameId || navigatedGameId.current === gameId) return;

      navigatedGameId.current = gameId;
      setMatchmaking(null);
      navigate(`/game/${gameId}?map=${selectedMap}`);
    },
    [navigate, selectedMap]
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

      // GamePage owns the socket lifecycle while a match is open.
      if (!window.location.pathname.startsWith('/game')) {
        gameSocket.disconnect();
      }
    };
  }, []);

  // The backend confirms the session for every mode. Practice and private
  // matches report CREATED immediately; public matches report SEARCHING until
  // game:found is emitted for the whole lobby.
  useEffect(() => {
    const handleMatchmakingStatus = (payload: MatchmakingStatusPayload) => {
      if (payload.status === 'CANCELLED') {
        setMatchmaking(null);
        return;
      }

      if (payload.status === 'CREATED') {
        if (payload.gameId) {
          goToGame(payload.gameId);
        } else {
          setMatchmaking(null);
        }
        return;
      }

      if (payload.countdownEndsAt) {
        setClockNow(Date.now());
      }

      setMatchmaking({
        mode: payload.mode ?? 'PUBLIC',
        status: payload.status ?? 'SEARCHING',
        playerCount: payload.playerCount,
        playersInCurrentMatch: payload.playersInCurrentMatch,
        countdownEndsAt: payload.countdownEndsAt,
      });
    };

    const handleGameFound = (payload: GameFoundPayload) => {
      goToGame(payload.gameId);
    };

    const handleException = (payload: unknown) => {
      setGameError(socketErrorMessage(payload));
      setMatchmaking(null);
    };

    gameSocket.on('game:matchmakingStatus', handleMatchmakingStatus);
    gameSocket.on('game:found', handleGameFound);
    gameSocket.on('exception', handleException);

    return () => {
      gameSocket.off('game:matchmakingStatus', handleMatchmakingStatus);
      gameSocket.off('game:found', handleGameFound);
      gameSocket.off('exception', handleException);
    };
  }, [goToGame]);

  useEffect(() => {
    if (!matchmaking?.countdownEndsAt) return;

    const timer = window.setInterval(() => setClockNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [matchmaking?.countdownEndsAt]);

  const countdown = matchmaking?.countdownEndsAt
    ? Math.max(0, Math.ceil((matchmaking.countdownEndsAt - clockNow) / 1000))
    : null;

  const handleStartMatchmaking = () => {
    if (!gameSocket.connected) {
      setGameError('El servidor de juego todavía no está conectado.');
      return;
    }

    if (selectedMode === 'private' && !canStartPrivate) {
      return;
    }

    setGameError(null);
    navigatedGameId.current = null;
    setMatchmaking({
      mode: selectedMode.toUpperCase(),
      status: 'REQUESTING',
    });

    gameSocket.emit('game:matchmaking', {
      mode: selectedMode.toUpperCase(),
      mapId: selectedMap,
      settings,
    });
  };

  const handleCancelSearch = () => {
    gameSocket.emit('game:cancelMatchmaking');
    setMatchmaking(null);
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] text-[#f6f1e9]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pt-1 pb-5">
        <div>
          <p className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
            BOMB ARENA · LOBBY
          </p>
          <h1 className="mt-0.5 text-[clamp(1.65rem,4vw,2.4rem)] leading-none font-black tracking-[-0.065em] text-[#fff4e5]">
            GAME LAB<span className="text-orange-400">.</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.65rem] font-extrabold tracking-wider text-zinc-300">
            <span
              className={`h-[0.48rem] w-[0.48rem] rounded-full shadow-[0_0_10px_currentColor] ${
                isGameConnected ? 'bg-emerald-400' : 'bg-red-400'
              }`}
            />
            {isGameConnected ? 'SOCKET ONLINE' : 'SOCKET OFFLINE'}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.65rem] font-extrabold text-zinc-300">
            🎮 {user?.username ?? 'Jugador'}
          </span>
        </div>
      </header>

      <div className="relative my-6 grid min-h-[250px] items-center gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_80%_50%,rgba(255,137,68,0.16),transparent_30%),linear-gradient(115deg,rgba(40,43,46,0.96),rgba(19,22,26,0.96))] p-[clamp(1.3rem,4vw,2.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
        <div className="relative z-10">
          <span className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
            CONFIGURACIÓN DE PARTIDA · BACKEND AUTHORITATIVE
          </span>
          <h2 className="mt-2 mb-3 text-[clamp(2.5rem,6vw,4.4rem)] leading-[0.92] font-black tracking-[-0.075em] text-[#fff4e6]">
            Entra en la
            <br />
            <em className="text-orange-400 not-italic">arena.</em>
          </h2>
          <p className="max-w-[520px] text-sm leading-relaxed text-zinc-400">
            Configura tu partida. El servidor controla movimiento, bombas,
            explosiones, mejoras y victoria.
          </p>
        </div>

        <div
          className="relative w-[min(100%,370px)] -rotate-[4deg] justify-self-center"
          aria-hidden="true"
        >
          <div className="absolute inset-[15%] rounded-full bg-orange-500/20 blur-[45px]" />
          <div className="relative grid grid-cols-5 gap-1.5 rounded-xl border border-orange-200/25 bg-[#090c0f]/80 p-2 shadow-[0_25px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(255,124,54,0.1)]">
            {MENU_ART_CELLS.map((symbol, index) => (
              <span
                key={`${symbol}-${index}`}
                className={`grid aspect-square place-items-center rounded-[0.3rem] border border-white/10 text-[clamp(1rem,3vw,2rem)] [text-shadow:0_0_12px_currentColor] ${artCellClass(
                  index
                )}`}
              >
                {symbol}
              </span>
            ))}
          </div>
          <div className="relative mt-2.5 text-right text-[0.58rem] font-black tracking-[0.23em] text-zinc-500">
            BOMBS READY / PLAYER MODE
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-[0.65rem] border border-red-700/30 bg-red-900/15 px-3.5 py-3 text-[0.78rem] text-red-200"
        >
          {t(`app.lobby.${error}`) || error}
        </div>
      )}

      {gameError && (
        <div
          role="alert"
          className="mb-4 rounded-[0.65rem] border border-red-700/30 bg-red-900/15 px-3.5 py-3 text-[0.78rem] text-red-200"
        >
          {gameError}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mb-4 rounded-[0.65rem] border border-emerald-700/25 bg-emerald-900/15 px-3.5 py-3 text-[0.78rem] text-emerald-200"
        >
          {t(`app.lobby.${notice}`) || notice}
          {notice === 'noticeInvitationSent' && noticeData && (
            <span className="ms-2 text-sm">a {noticeData}</span>
          )}
        </div>
      )}

      {matchmaking && (
        <div className="my-4 flex flex-wrap items-center gap-4 rounded-2xl border border-orange-400/25 bg-orange-400/5 p-4">
          <div className="h-8 w-8 shrink-0 animate-spin rounded-full border-[3px] border-orange-400/20 border-t-orange-400" />
          <div className="min-w-0 flex-1">
            <span className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
              BUSCANDO PARTIDA · {modeLabel(matchmaking.mode)}
            </span>
            <strong className="mt-1 block text-[0.95rem] text-[#fff0df]">
              {matchmaking.status === 'COUNTDOWN'
                ? `La partida comienza en ${countdown ?? 0}s`
                : matchmaking.status === 'SEARCHING'
                  ? 'Buscando jugadores...'
                  : matchmaking.status === 'CREATED'
                    ? 'Creando partida...'
                    : 'Preparando búsqueda...'}
            </strong>
            <span className="mt-0.5 block text-[0.7rem] text-zinc-400">
              {matchmaking.status === 'COUNTDOWN'
                ? `${matchmaking.playersInCurrentMatch ?? 0} jugadores confirmados · máximo 4`
                : matchmaking.status === 'SEARCHING'
                  ? `${matchmaking.playerCount ?? 1} jugador(es) en tu grupo · la búsqueda no caduca`
                  : 'Conectando con el motor del servidor'}
            </span>
          </div>
          {(matchmaking.status === 'SEARCHING' ||
            matchmaking.status === 'COUNTDOWN') && (
            <button
              type="button"
              className="rounded-[0.7rem] border border-red-500/30 bg-red-900/20 px-4 py-3 text-[0.68rem] font-black tracking-wider text-red-300 transition hover:bg-red-900/30"
              onClick={handleCancelSearch}
            >
              Cancelar búsqueda
            </button>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(290px,0.9fr)]">
        <div className="grid min-w-0 content-start gap-4">
          <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/90 p-4">
            <div className="mb-3 flex items-center justify-between gap-4 text-[0.68rem] font-black tracking-wider text-orange-400">
              <span>01 / MODO DE JUEGO</span>
              <small className="text-[0.68rem] font-medium tracking-normal text-zinc-500">
                Selecciona tu desafío
              </small>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3">
              <button
                type="button"
                className={`min-w-0 cursor-pointer rounded-xl border p-3 text-left text-[#f5eee4] transition hover:-translate-y-0.5 hover:border-orange-400/50 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${
                  selectedMode === 'practice'
                    ? 'border-orange-400 bg-[linear-gradient(145deg,rgba(255,145,77,0.13),rgba(255,145,77,0.035))] shadow-[inset_0_0_0_1px_rgba(255,145,77,0.08)]'
                    : 'border-white/10 bg-white/[0.025]'
                }`}
                onClick={() => setSelectedMode('practice')}
                disabled={isSearching}
              >
                <span className="mb-2 block text-2xl">🎮</span>
                <strong className="block text-[0.72rem] font-black tracking-wider">
                  PRÁCTICA
                </strong>
                <small className="mt-1.5 block min-h-[2.1rem] text-[0.66rem] leading-snug text-zinc-400">
                  1 jugador + Bot pasivo
                </small>
                <span className="mt-2 inline-block text-[0.53rem] font-black tracking-wider text-orange-300">
                  IDEAL PARA PROBAR
                </span>
              </button>
              <button
                type="button"
                className={`min-w-0 cursor-pointer rounded-xl border p-3 text-left text-[#f5eee4] transition hover:-translate-y-0.5 hover:border-orange-400/50 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${
                  selectedMode === 'private'
                    ? 'border-orange-400 bg-[linear-gradient(145deg,rgba(255,145,77,0.13),rgba(255,145,77,0.035))] shadow-[inset_0_0_0_1px_rgba(255,145,77,0.08)]'
                    : 'border-white/10 bg-white/[0.025]'
                }`}
                onClick={() => setSelectedMode('private')}
                disabled={isSearching}
              >
                <span className="mb-2 block text-2xl">👥</span>
                <strong className="block text-[0.72rem] font-black tracking-wider">
                  PRIVADA
                </strong>
                <small className="mt-1.5 block min-h-[2.1rem] text-[0.66rem] leading-snug text-zinc-400">
                  Solo los miembros de tu lobby (2–4).
                </small>
                <span className="mt-2 inline-block text-[0.53rem] font-black tracking-wider text-orange-300">
                  SIN RANDOMS
                </span>
              </button>
              <button
                type="button"
                className={`min-w-0 cursor-pointer rounded-xl border p-3 text-left text-[#f5eee4] transition hover:-translate-y-0.5 hover:border-orange-400/50 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${
                  selectedMode === 'public'
                    ? 'border-orange-400 bg-[linear-gradient(145deg,rgba(255,145,77,0.13),rgba(255,145,77,0.035))] shadow-[inset_0_0_0_1px_rgba(255,145,77,0.08)]'
                    : 'border-white/10 bg-white/[0.025]'
                }`}
                onClick={() => setSelectedMode('public')}
                disabled={isSearching}
              >
                <span className="mb-2 block text-2xl">🌐</span>
                <strong className="block text-[0.72rem] font-black tracking-wider">
                  PÚBLICA
                </strong>
                <small className="mt-1.5 block min-h-[2.1rem] text-[0.66rem] leading-snug text-zinc-400">
                  Tu lobby contra otros grupos.
                </small>
                <span className="mt-2 inline-block text-[0.53rem] font-black tracking-wider text-orange-300">
                  MATCHMAKING
                </span>
              </button>
            </div>
          </section>

          <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/90 p-4">
            <div className="mb-3 flex items-center justify-between gap-4 text-[0.68rem] font-black tracking-wider text-orange-400">
              <span>02 / ESCENARIO</span>
              <small className="text-[0.68rem] font-medium tracking-normal text-zinc-500">
                Elige el mapa
              </small>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {MAPS.map((map, index) => (
                <button
                  type="button"
                  key={map.id}
                  className={`min-w-0 cursor-pointer rounded-xl border p-2.5 text-left text-[#f5eee4] transition hover:-translate-y-0.5 hover:border-orange-400/50 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${
                    selectedMap === map.id
                      ? 'border-orange-400 bg-[linear-gradient(145deg,rgba(255,145,77,0.13),rgba(255,145,77,0.035))] shadow-[inset_0_0_0_1px_rgba(255,145,77,0.08)]'
                      : 'border-white/10 bg-white/[0.025]'
                  }`}
                  onClick={() => setSelectedMap(map.id)}
                  disabled={isSearching}
                >
                  <span
                    className={`relative mb-2 grid aspect-[1.5] grid-cols-5 gap-0.5 overflow-hidden rounded-[0.4rem] bg-[#1c2828] ${
                      index === 1
                        ? '[filter:hue-rotate(18deg)]'
                        : index === 2
                          ? '[filter:hue-rotate(-20deg)_saturate(0.8)]'
                          : ''
                    }`}
                  >
                    <i className="bg-[#454c48] [&:nth-child(2n)]:bg-[#765037]" />
                    <i className="bg-[#454c48] [&:nth-child(2n)]:bg-[#765037]" />
                    <i className="bg-[#454c48] [&:nth-child(2n)]:bg-[#765037]" />
                    <i className="bg-[#454c48] [&:nth-child(2n)]:bg-[#765037]" />
                    <b className="absolute top-[40%] left-[42%] aspect-square w-[17%] rounded-full bg-[#ff9c51] shadow-[0_0_10px_#ff9c51]" />
                  </span>
                  <strong className="block text-[0.72rem] font-black tracking-wider">
                    {map.name}
                  </strong>
                  <small className="mt-1.5 block min-h-[2.1rem] text-[0.66rem] leading-snug text-zinc-400">
                    {map.subtitle}
                  </small>
                </button>
              ))}
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-2 flex items-center justify-between px-1 text-[0.68rem] font-black tracking-wider text-orange-400">
              <span>03 / AJUSTES</span>
              <small className="text-[0.68rem] font-medium tracking-normal text-zinc-500">
                Personaliza la partida
              </small>
            </div>
            <GameSettingsCard
              settings={settings}
              onChange={setSettings}
              isHost={isHost}
              isPublicMode={selectedMode === 'public'}
            />
          </section>

          <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <strong className="block text-xs tracking-wider text-[#e8e0d4]">
                LISTO PARA JUGAR
              </strong>
              <span className="mt-1 block text-[0.68rem] text-zinc-400">
                Controles: WASD / flechas · ESPACIO para bomba
              </span>
              {selectedMode === 'private' && !canStartPrivate && (
                <span className="mt-1 block text-[0.62rem] text-amber-300/80">
                  {isHost
                    ? 'Necesitas al menos 2 jugadores en la lobby para empezar.'
                    : 'Solo el anfitrión puede iniciar la partida privada.'}
                </span>
              )}
            </div>
            <button
              type="button"
              className="min-w-[210px] rounded-[0.7rem] bg-gradient-to-br from-orange-300 to-orange-600 px-4 py-3 text-[0.68rem] font-black tracking-wider text-[#231710] shadow-[0_8px_22px_rgba(237,113,55,0.17)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
              onClick={handleStartMatchmaking}
              disabled={
                !isGameConnected || Boolean(matchmaking) || !canStartMatch
              }
            >
              {matchmaking
                ? 'BUSCANDO...'
                : selectedMode === 'private' && !isHost
                  ? 'ESPERANDO AL ANFITRIÓN...'
                  : 'INICIAR PARTIDA'}{' '}
              <span>↗</span>
            </button>
          </div>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <LobbyStatusCard />

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
        </aside>
      </div>
    </div>
  );
}
