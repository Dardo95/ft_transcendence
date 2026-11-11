import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import type {
  GameMode,
  GameSnapshot,
  MovementInput,
} from '@transcendence/shared';

import { useAuthStore } from '../features/auth/store/useAuthStore';
import { chatSocket, gameSocket } from '../lib/socket';
import { GameBoard } from '../features/game/components/GameBoard';

type ConnectionState = 'connecting' | 'connected' | 'disconnected';

interface GameJoinedPayload {
  gameId: string;
  snapshot: GameSnapshot;
}

interface GameFinishedPayload {
  gameId: string;
  winnerId: string | null;
  snapshot: GameSnapshot;
}

interface SnapshotEventPayload {
  gameId: string;
  snapshot: GameSnapshot;
}

interface SocketErrorPayload {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

interface InputRejectedPayload {
  action?: string;
  reason?: string;
}

const INITIAL_MOVEMENT: MovementInput = {
  up: false,
  down: false,
  left: false,
  right: false,
};

function errorMessage(payload: unknown): string {
  if (typeof payload === 'string') return payload;
  if (payload && typeof payload === 'object') {
    const value = payload as SocketErrorPayload;
    if (Array.isArray(value.message)) return value.message.join(', ');
    if (typeof value.message === 'string') return value.message;
    if (typeof value.error === 'string') return value.error;
  }
  return 'El servidor ha rechazado la operación.';
}

function formatElapsed(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function modeLabel(mode: GameMode): string {
  if (mode === 'PUBLIC') return 'PÚBLICA';
  if (mode === 'PRIVATE') return 'PRIVADA';
  return 'PRÁCTICA';
}

function statusLabel(status: GameSnapshot['status']): string {
  switch (status) {
    case 'COUNTDOWN':
      return 'PREPARANDO';
    case 'RUNNING':
      return 'EN JUEGO';
    case 'OVERTIME':
      return 'OVERTIME';
    case 'FINISHED':
      return 'FINALIZADA';
  }
}

function statusPillClass(status: GameSnapshot['status']): string {
  switch (status) {
    case 'RUNNING':
      return 'border-emerald-500/30 bg-emerald-900/20 text-emerald-200';
    case 'COUNTDOWN':
      return 'border-amber-500/30 bg-amber-900/20 text-amber-200';
    case 'OVERTIME':
      return 'animate-pulse border-red-500/40 bg-red-900/25 text-red-200';
    case 'FINISHED':
      return 'border-amber-300/35 text-amber-200';
  }
}

export function GamePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { id: routeGameId } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const mapId = searchParams.get('map') ?? 'map1';
  const routeGameIdRef = useRef<string | null>(routeGameId ?? null);

  useEffect(() => {
    routeGameIdRef.current = routeGameId ?? null;
  }, [routeGameId]);

  const [connection, setConnection] = useState<ConnectionState>(
    gameSocket.connected ? 'connected' : 'connecting'
  );
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [joinedGameId, setJoinedGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const autoJoinedGameId = useRef<string | null>(null);
  const activeGameId = useRef<string | null>(null);
  const playerIdRef = useRef<string | null>(null);
  const userIdRef = useRef<number | null>(user?.id ?? null);
  const movement = useRef<MovementInput>({ ...INITIAL_MOVEMENT });

  useEffect(() => {
    playerIdRef.current = playerId;
  }, [playerId]);

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user?.id]);

  const currentPlayer = useMemo(
    () => snapshot?.players.find((player) => player.id === playerId) ?? null,
    [snapshot, playerId]
  );

  const alivePlayers =
    snapshot?.players.filter((player) => player.alive).length ?? 0;
  const isPlaying = snapshot?.status === 'RUNNING';

  const emitStop = useCallback(() => {
    movement.current = { ...INITIAL_MOVEMENT };
    if (gameSocket.connected && activeGameId.current) {
      gameSocket.emit('game:input', { action: 'stop' });
    }
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      setConnection('connected');
      setError(null);

      // A reconnect creates a fresh server-side socket with no room membership.
      // Rejoin the current game before allowing movement again.
      const gameId = activeGameId.current ?? routeGameIdRef.current;
      if (gameId && autoJoinedGameId.current !== gameId) {
        autoJoinedGameId.current = gameId;
        gameSocket.emit('game:join', { gameId });
      }
    };

    const handleDisconnect = () => {
      setConnection('disconnected');
      movement.current = { ...INITIAL_MOVEMENT };
      // A new connection must join again; don't keep a stale join marker.
      autoJoinedGameId.current = null;
      setJoinedGameId(null);
    };

    const handleConnectError = (socketError: Error) => {
      setConnection('disconnected');
      setError(
        `No se pudo conectar al servidor de juego: ${socketError.message}`
      );
    };

    const handleGameJoined = (payload: GameJoinedPayload) => {
      activeGameId.current = payload.gameId;
      setJoinedGameId(payload.gameId);
      setSnapshot(payload.snapshot);
      const authenticatedPlayerId =
        userIdRef.current === null ? null : String(userIdRef.current);
      playerIdRef.current = playerIdRef.current ?? authenticatedPlayerId;
      setPlayerId((current) => current ?? authenticatedPlayerId);
      setError(null);
      setNotice('Te has conectado a la partida.');
    };

    const handleGameState = (nextSnapshot: GameSnapshot) => {
      activeGameId.current = nextSnapshot.gameId;
      setSnapshot(nextSnapshot);
    };

    const handleGameStarted = (payload: SnapshotEventPayload) => {
      setSnapshot(payload.snapshot);
      setNotice('¡A jugar!');
    };

    const handleGameFinished = (payload: GameFinishedPayload) => {
      setSnapshot(payload.snapshot);
      movement.current = { ...INITIAL_MOVEMENT };
      setNotice(
        payload.winnerId === playerIdRef.current
          ? '¡Has ganado la partida!'
          : payload.winnerId
            ? 'La partida ha terminado.'
            : 'La partida ha terminado en empate.'
      );
    };

    const handleOvertime = (payload: SnapshotEventPayload) => {
      setSnapshot(payload.snapshot);
      setNotice('¡OVERTIME! Sobrevive hasta el final.');
    };

    const handlePlayerLeft = (payload: { userId: number }) => {
      if (payload.userId !== userIdRef.current) {
        setNotice('Un jugador se ha desconectado.');
      }
    };

    const handleInputRejected = (payload: InputRejectedPayload) => {
      setNotice(`Acción rechazada: ${payload.reason ?? 'no disponible'}`);
    };

    const handleException = (payload: unknown) => {
      setError(errorMessage(payload));
    };

    gameSocket.on('connect', handleConnect);
    gameSocket.on('disconnect', handleDisconnect);
    gameSocket.on('connect_error', handleConnectError);
    gameSocket.on('game:joined', handleGameJoined);
    gameSocket.on('game:state', handleGameState);
    gameSocket.on('game:started', handleGameStarted);
    gameSocket.on('game:finished', handleGameFinished);
    gameSocket.on('game:overtimeStarted', handleOvertime);
    gameSocket.on('game:playerLeft', handlePlayerLeft);
    gameSocket.on('game:inputRejected', handleInputRejected);
    gameSocket.on('exception', handleException);

    if (gameSocket.connected) {
      handleConnect();
    } else {
      gameSocket.connect();
    }

    return () => {
      emitStop();
      gameSocket.off('connect', handleConnect);
      gameSocket.off('disconnect', handleDisconnect);
      gameSocket.off('connect_error', handleConnectError);
      gameSocket.off('game:joined', handleGameJoined);
      gameSocket.off('game:state', handleGameState);
      gameSocket.off('game:started', handleGameStarted);
      gameSocket.off('game:finished', handleGameFinished);
      gameSocket.off('game:overtimeStarted', handleOvertime);
      gameSocket.off('game:playerLeft', handlePlayerLeft);
      gameSocket.off('game:inputRejected', handleInputRejected);
      gameSocket.off('exception', handleException);
      gameSocket.disconnect();
      // LobbyPage keeps the chat namespace alive while entering /game.
      // Close it again when leaving the preview for any other section.
      if (!window.location.pathname.startsWith('/lobby')) {
        chatSocket.disconnect();
      }
    };
  }, [emitStop]);

  useEffect(() => {
    if (!routeGameId || !gameSocket.connected) return;
    if (autoJoinedGameId.current === routeGameId) return;

    autoJoinedGameId.current = routeGameId;
    gameSocket.emit('game:join', { gameId: routeGameId });
  }, [routeGameId, connection]);

  useEffect(() => {
    const alive = Boolean(currentPlayer?.alive);
    if (
      connection !== 'connected' ||
      !isPlaying ||
      !alive ||
      !snapshot?.gameId ||
      !playerId ||
      joinedGameId !== snapshot.gameId ||
      !gameSocket.connected
    ) {
      return;
    }

    const sendMovement = (next: MovementInput) => {
      const previous = movement.current;
      const changed =
        previous.up !== next.up ||
        previous.down !== next.down ||
        previous.left !== next.left ||
        previous.right !== next.right;

      if (!changed) return;
      movement.current = next;
      gameSocket.emit('game:input', { action: 'movement', input: next });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      const directionByCode: Record<string, keyof MovementInput> = {
        ArrowUp: 'up',
        KeyW: 'up',
        ArrowDown: 'down',
        KeyS: 'down',
        ArrowLeft: 'left',
        KeyA: 'left',
        ArrowRight: 'right',
        KeyD: 'right',
      };

      const direction = directionByCode[event.code];
      if (direction) {
        event.preventDefault();
        sendMovement({ ...movement.current, [direction]: true });
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        if (!event.repeat) {
          gameSocket.emit('game:input', { action: 'place-bomb' });
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const directionByCode: Record<string, keyof MovementInput> = {
        ArrowUp: 'up',
        KeyW: 'up',
        ArrowDown: 'down',
        KeyS: 'down',
        ArrowLeft: 'left',
        KeyA: 'left',
        ArrowRight: 'right',
        KeyD: 'right',
      };

      const direction = directionByCode[event.code];
      if (!direction) return;
      event.preventDefault();
      sendMovement({ ...movement.current, [direction]: false });
    };

    const onBlur = () => emitStop();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      emitStop();
    };
  }, [
    connection,
    currentPlayer?.alive,
    emitStop,
    isPlaying,
    joinedGameId,
    playerId,
    snapshot?.gameId,
  ]);

  const returnToLobby = () => {
    emitStop();
    activeGameId.current = null;
    autoJoinedGameId.current = null;
    setSnapshot(null);
    setPlayerId(null);
    setJoinedGameId(null);
    setNotice(null);
    navigate('/lobby', { replace: true });
  };

  const leaveForLobby = () => {
    emitStop();
    navigate('/lobby');
  };

  const connectionDotClass =
    connection === 'connected'
      ? 'bg-emerald-400'
      : connection === 'disconnected'
        ? 'bg-red-400'
        : 'bg-amber-400';

  if (snapshot) {
    const ownPlayer = snapshot.players.find((player) => player.id === playerId);
    const winner = snapshot.players.find(
      (player) => player.id === snapshot.winnerId
    );

    return (
      <section className="mx-auto w-full max-w-[1440px] text-[#f6f1e9]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pt-1 pb-5">
          <div>
            <p className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
              BOMB ARENA · LIVE MATCH
            </p>
            <h1 className="mt-0.5 text-[clamp(1.65rem,4vw,2.4rem)] leading-none font-black tracking-[-0.065em] text-[#fff4e5]">
              ARENA
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.65rem] font-extrabold tracking-wider text-zinc-300">
              <span
                className={`h-[0.48rem] w-[0.48rem] rounded-full shadow-[0_0_10px_currentColor] ${connectionDotClass}`}
              />
              {connection === 'connected' ? 'SOCKET ONLINE' : 'SOCKET OFFLINE'}
            </span>
            <button
              className="rounded-[0.7rem] border border-white/10 bg-transparent px-4 py-3 text-[0.68rem] font-black tracking-normal text-zinc-300 transition hover:bg-white/5"
              type="button"
              onClick={leaveForLobby}
            >
              Volver al lobby
            </button>
          </div>
        </div>

        {notice && (
          <div
            className="my-4 rounded-[0.65rem] border border-emerald-700/25 bg-emerald-900/15 px-3.5 py-3 text-[0.78rem] text-emerald-200"
            role="status"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            className="my-4 rounded-[0.65rem] border border-red-700/30 bg-red-900/15 px-3.5 py-3 text-[0.78rem] text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_270px]">
          <main className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/90 p-3 sm:p-[clamp(0.65rem,2vw,1.15rem)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <span className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
                  PARTIDA {modeLabel(snapshot.mode)}
                </span>
                <h2 className="mt-1 text-sm font-extrabold text-[#f6eee2]">
                  {snapshot.board.width} × {snapshot.board.height} ·{' '}
                  {snapshot.gameId.slice(0, 8)}
                </h2>
              </div>
              <div
                className={`rounded-full border px-3 py-1.5 text-[0.58rem] font-black tracking-wider whitespace-nowrap ${statusPillClass(
                  snapshot.status
                )}`}
              >
                {statusLabel(snapshot.status)}
              </div>
            </div>

            <div className="mb-3 flex items-center justify-start gap-5 border-y border-white/5 py-2.5 sm:gap-8">
              <div className="grid gap-1">
                <span className="text-[0.55rem] font-black tracking-widest text-zinc-500">
                  TIEMPO
                </span>
                <strong className="text-sm font-bold text-[#f5c18a] tabular-nums">
                  {formatElapsed(snapshot.elapsedMs)}
                </strong>
              </div>
              <div className="grid gap-1">
                <span className="text-[0.55rem] font-black tracking-widest text-zinc-500">
                  SUPERVIVIENTES
                </span>
                <strong className="text-sm font-bold text-[#f5c18a] tabular-nums">
                  {alivePlayers}/{snapshot.players.length}
                </strong>
              </div>
              <div className="grid gap-1">
                <span className="text-[0.55rem] font-black tracking-widest text-zinc-500">
                  MAPA
                </span>
                <strong className="text-sm font-bold text-[#f5c18a] tabular-nums">
                  {mapId.toUpperCase()}
                </strong>
              </div>
            </div>

            <GameBoard snapshot={snapshot} playerId={playerId} />

            <div className="flex flex-wrap items-center justify-center gap-5 px-1 pt-3 pb-0.5 text-[0.67rem] text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <kbd className="inline-grid h-5 min-w-5 place-items-center rounded-[3px] border border-white/15 bg-[#252b2d] px-1 text-[0.56rem] font-black text-[#f0e8dc]">
                  W
                </kbd>
                <kbd className="inline-grid h-5 min-w-5 place-items-center rounded-[3px] border border-white/15 bg-[#252b2d] px-1 text-[0.56rem] font-black text-[#f0e8dc]">
                  A
                </kbd>
                <kbd className="inline-grid h-5 min-w-5 place-items-center rounded-[3px] border border-white/15 bg-[#252b2d] px-1 text-[0.56rem] font-black text-[#f0e8dc]">
                  S
                </kbd>
                <kbd className="inline-grid h-5 min-w-5 place-items-center rounded-[3px] border border-white/15 bg-[#252b2d] px-1 text-[0.56rem] font-black text-[#f0e8dc]">
                  D
                </kbd>{' '}
                o flechas{' '}
                <small className="ml-1 text-[0.55rem] font-black tracking-wider text-zinc-500">
                  MOVER
                </small>
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="inline-grid h-5 min-w-5 place-items-center rounded-[3px] border border-white/15 bg-[#252b2d] px-1 text-[0.56rem] font-black text-[#f0e8dc]">
                  ESPACIO
                </kbd>{' '}
                <small className="ml-1 text-[0.55rem] font-black tracking-wider text-zinc-500">
                  COLOCAR BOMBA
                </small>
              </span>
            </div>

            {snapshot.status === 'FINISHED' && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-400/25 bg-amber-700/10 p-3.5">
                <div className="text-3xl">🏆</div>
                <div className="flex-1">
                  <p className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
                    PARTIDA FINALIZADA
                  </p>
                  <h2 className="mt-0.5 text-base text-amber-200">
                    {winner
                      ? `${winner.displayName || 'Jugador'} gana`
                      : 'Empate'}
                  </h2>
                </div>
                <button
                  type="button"
                  className="rounded-[0.7rem] bg-gradient-to-br from-orange-300 to-orange-600 px-4 py-3 text-[0.68rem] font-black tracking-wider text-[#231710] shadow-[0_8px_22px_rgba(237,113,55,0.17)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                  onClick={returnToLobby}
                >
                  Volver a jugar
                </button>
              </div>
            )}
          </main>

          <aside className="grid gap-3">
            <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/90 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
                  EN PARTIDA
                </span>
                <strong className="text-xs text-amber-300">
                  {snapshot.players.length}/4
                </strong>
              </div>
              <div className="mt-3 grid gap-2">
                {snapshot.players.map((player, index) => (
                  <div
                    className={`flex items-center gap-2.5 rounded-[0.6rem] border border-white/5 bg-white/[0.025] p-2 ${
                      player.alive ? '' : 'opacity-40'
                    }`}
                    key={player.id}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-[0.55rem] text-base ${
                        index % 4 === 1
                          ? 'bg-cyan-500/15'
                          : index % 4 === 2
                            ? 'bg-violet-500/15'
                            : index % 4 === 3
                              ? 'bg-lime-500/15'
                              : 'bg-orange-400/15'
                      }`}
                    >
                      {player.isBot ? '🤖' : '🧑'}
                    </span>
                    <div className="grid min-w-0 flex-1 gap-0.5">
                      <strong className="truncate text-[0.72rem] text-zinc-200">
                        {player.displayName || `Jugador ${index + 1}`}
                      </strong>
                      <span className="text-[0.53rem] font-black tracking-widest text-zinc-500">
                        {player.isBot
                          ? 'BOT PASIVO'
                          : player.id === playerId
                            ? 'TÚ'
                            : 'JUGADOR'}
                      </span>
                    </div>
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        player.alive
                          ? 'bg-emerald-400 shadow-[0_0_9px_rgba(112,211,154,0.45)]'
                          : 'bg-zinc-500 shadow-none'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/90 p-4">
              <span className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
                TUS ESTADÍSTICAS
              </span>
              {ownPlayer ? (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="grid gap-1 rounded-[0.55rem] bg-white/5 px-1 py-2.5 text-center">
                    <strong className="text-base text-orange-300">
                      {ownPlayer.bombCapacity}
                    </strong>
                    <span className="text-[0.48rem] font-black tracking-wider text-zinc-500">
                      BOMBAS
                    </span>
                  </div>
                  <div className="grid gap-1 rounded-[0.55rem] bg-white/5 px-1 py-2.5 text-center">
                    <strong className="text-base text-orange-300">
                      {ownPlayer.blastRadius}
                    </strong>
                    <span className="text-[0.48rem] font-black tracking-wider text-zinc-500">
                      ALCANCE
                    </span>
                  </div>
                  <div className="grid gap-1 rounded-[0.55rem] bg-white/5 px-1 py-2.5 text-center">
                    <strong className="text-base text-orange-300">
                      {ownPlayer.speed.toFixed(1)}
                    </strong>
                    <span className="text-[0.48rem] font-black tracking-wider text-zinc-500">
                      VELOCIDAD
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[0.7rem] text-zinc-400">
                  Esperando datos del jugador...
                </p>
              )}
            </section>

            <section className="grid min-w-0 gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/90 p-4">
              <span className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
                LEYENDA
              </span>
              <div className="flex items-center gap-2.5 text-[0.65rem] text-zinc-300">
                <i className="h-3 w-3 rounded-[3px] bg-[linear-gradient(145deg,#737b78,#424b4b)]" />{' '}
                Muro indestructible
              </div>
              <div className="flex items-center gap-2.5 text-[0.65rem] text-zinc-300">
                <i className="h-3 w-3 rounded-[3px] bg-[linear-gradient(145deg,#a36a3e,#70462f)]" />{' '}
                Muro destructible
              </div>
              <div className="flex items-center gap-2.5 text-[0.65rem] text-zinc-300">
                <i className="h-3 w-3 rounded-full bg-[#333] shadow-[0_0_7px_#f6a04b]" />{' '}
                Bomba
              </div>
              <div className="flex items-center gap-2.5 text-[0.65rem] text-zinc-300">
                <i className="h-3 w-3 rounded-[3px] bg-[#d4a84e]" /> Power-up
              </div>
              <p className="mt-1 text-[0.62rem] leading-relaxed text-zinc-500">
                El servidor calcula las colisiones, las explosiones y el
                resultado de la partida.
              </p>
            </section>
          </aside>
        </div>
      </section>
    );
  }

  if (!routeGameId) {
    return <Navigate to="/lobby" replace />;
  }

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] items-center justify-center px-4 text-[#f6f1e9]">
      <div className="grid w-full max-w-md justify-items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 p-8 text-center">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-orange-400/20 border-t-orange-400" />
        <p className="text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
          PARTIDA {routeGameId.slice(0, 8).toUpperCase()}
        </p>
        <h1 className="text-xl font-black text-[#fff4e5]">
          Conectando a la arena...
        </h1>
        <p className="text-xs leading-relaxed text-zinc-400">
          {connection === 'connected'
            ? 'Uniéndote a la partida...'
            : connection === 'connecting'
              ? 'Estableciendo conexión con el servidor...'
              : 'Sin conexión con el servidor de juego.'}
        </p>

        {error && (
          <p
            role="alert"
            className="w-full rounded-[0.65rem] border border-red-700/30 bg-red-900/15 px-3.5 py-3 text-[0.78rem] text-red-200"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          className="mt-1 rounded-[0.7rem] border border-white/10 bg-transparent px-4 py-3 text-[0.68rem] font-black tracking-normal text-zinc-300 transition hover:bg-white/5"
          onClick={leaveForLobby}
        >
          Volver al lobby
        </button>
      </div>
    </section>
  );
}
