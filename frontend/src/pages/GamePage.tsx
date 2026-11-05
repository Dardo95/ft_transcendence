import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { GameMode, GameSnapshot, MovementInput } from '@transcendence/shared';

import { useAuthStore } from '../features/auth/store/useAuthStore';
import { chatSocket, gameSocket } from '../lib/socket';
import { GameBoard } from '../features/game/components/GameBoard';
import './GamePage.css';

type ConnectionState = 'connecting' | 'connected' | 'disconnected';
type LocalMatchmakingStatus = 'REQUESTING' | 'SEARCHING' | 'COUNTDOWN' | 'CANCELLED' | 'CREATED';

interface MatchmakingStatusPayload {
  mode: GameMode;
  status: LocalMatchmakingStatus;
  queueId?: string;
  lobbyId?: string;
  playerCount?: number;
  playersInCurrentMatch?: number;
  countdownEndsAt?: number;
  gameId?: string;
}

interface GameFoundPayload {
  gameId: string;
  mode: GameMode;
  playerId: string;
  snapshot: GameSnapshot;
}

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

interface MatchmakingCancelledPayload {
  cancelled: boolean;
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

const MAPS = [
  { id: 'map1', name: 'ARENA 01', subtitle: '13 × 11 · mapa actual' },
] as const;

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

export function GamePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { id: routeGameId } = useParams<{ id?: string }>();
  // useNavigate is not referentially stable with BrowserRouter. Keep the latest
  // function without making the socket lifecycle effect depend on it.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const routeGameIdRef = useRef<string | null>(routeGameId ?? null);
  routeGameIdRef.current = routeGameId ?? null;

  const [connection, setConnection] = useState<ConnectionState>(
    gameSocket.connected ? 'connected' : 'connecting',
  );
  const [selectedMode, setSelectedMode] = useState<GameMode>('PRACTICE');
  const [selectedMap, setSelectedMap] = useState('map1');
  const [matchmaking, setMatchmaking] = useState<MatchmakingStatusPayload | null>(null);
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [joinedGameId, setJoinedGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [clockNow, setClockNow] = useState(Date.now());

  const autoJoinedGameId = useRef<string | null>(null);
  const activeGameId = useRef<string | null>(null);
  const playerIdRef = useRef<string | null>(null);
  const userIdRef = useRef<number | null>(user?.id ?? null);
  const movement = useRef<MovementInput>({ ...INITIAL_MOVEMENT });

  playerIdRef.current = playerId;
  userIdRef.current = user?.id ?? null;

  const currentPlayer = useMemo(
    () => snapshot?.players.find((player) => player.id === playerId) ?? null,
    [snapshot, playerId],
  );

  const countdownSeconds = useMemo(() => {
    if (!matchmaking?.countdownEndsAt) return null;
    return Math.max(0, Math.ceil((matchmaking.countdownEndsAt - clockNow) / 1000));
  }, [matchmaking?.countdownEndsAt, clockNow]);

  const alivePlayers = snapshot?.players.filter((player) => player.alive).length ?? 0;
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
      setError(`No se pudo conectar al servidor de juego: ${socketError.message}`);
    };

    const handleMatchmakingStatus = (payload: MatchmakingStatusPayload) => {
      if (payload.status === 'CANCELLED') {
        setMatchmaking(null);
        setNotice('La búsqueda se ha cancelado porque cambió la composición de la lobby.');
        return;
      }

      setMatchmaking(payload);
      setNotice(null);
    };

    const handleMatchmakingCancelled = (payload: MatchmakingCancelledPayload) => {
      if (payload.cancelled) {
        setMatchmaking(null);
        setNotice('Búsqueda cancelada.');
      }
    };

    const handleMatchFound = (payload: GameFoundPayload) => {
      activeGameId.current = payload.gameId;
      autoJoinedGameId.current = payload.gameId;
      movement.current = { ...INITIAL_MOVEMENT };
      setJoinedGameId(null);
      setSnapshot(payload.snapshot);
      playerIdRef.current = payload.playerId;
      setPlayerId(payload.playerId);
      setMatchmaking(null);
      setError(null);
      setNotice(`Partida ${modeLabel(payload.mode)} encontrada.`);
      // Confirm the game membership explicitly before enabling keyboard input.
      // This mirrors the join flow used when the page is refreshed.
      gameSocket.emit('game:join', { gameId: payload.gameId });
      navigateRef.current(`/game/${payload.gameId}`, { replace: true });
    };

    const handleGameJoined = (payload: GameJoinedPayload) => {
      activeGameId.current = payload.gameId;
      setJoinedGameId(payload.gameId);
      setSnapshot(payload.snapshot);
      const authenticatedPlayerId = userIdRef.current === null
        ? null
        : String(userIdRef.current);
      playerIdRef.current = playerIdRef.current ?? authenticatedPlayerId;
      setPlayerId((current) => current ?? authenticatedPlayerId);
      setMatchmaking(null);
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
            : 'La partida ha terminado en empate.',
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
      setMatchmaking((current) =>
        current?.status === 'REQUESTING' ? null : current,
      );
    };

    gameSocket.on('connect', handleConnect);
    gameSocket.on('disconnect', handleDisconnect);
    gameSocket.on('connect_error', handleConnectError);
    gameSocket.on('game:matchmakingStatus', handleMatchmakingStatus);
    gameSocket.on('game:matchmakingCancelled', handleMatchmakingCancelled);
    gameSocket.on('game:found', handleMatchFound);
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
      gameSocket.off('game:matchmakingStatus', handleMatchmakingStatus);
      gameSocket.off('game:matchmakingCancelled', handleMatchmakingCancelled);
      gameSocket.off('game:found', handleMatchFound);
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
    if (!matchmaking?.countdownEndsAt) return;
    const timer = window.setInterval(() => setClockNow(Date.now()), 100);
    return () => window.clearInterval(timer);
  }, [matchmaking?.countdownEndsAt]);

  useEffect(() => {
    const alive = Boolean(currentPlayer?.alive);
    if (connection !== 'connected' || !isPlaying || !alive || !snapshot?.gameId || !playerId || joinedGameId !== snapshot.gameId || !gameSocket.connected) {
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
  }, [connection, currentPlayer?.alive, emitStop, isPlaying, joinedGameId, playerId, snapshot?.gameId]);

  const startMatchmaking = () => {
    if (!gameSocket.connected) {
      setError('El socket de juego todavía no está conectado.');
      return;
    }

    setError(null);
    setNotice(null);
    setSnapshot(null);
    setPlayerId(null);
    setJoinedGameId(null);
    setMatchmaking({ mode: selectedMode, status: 'REQUESTING' });
    gameSocket.emit('game:matchmaking', {
      mode: selectedMode,
      mapId: selectedMap,
    });
  };

  const cancelMatchmaking = () => {
    if (!gameSocket.connected) return;
    gameSocket.emit('game:cancelMatchmaking');
  };

  const returnToGameMenu = () => {
    emitStop();
    activeGameId.current = null;
    autoJoinedGameId.current = null;
    setSnapshot(null);
    setPlayerId(null);
    setJoinedGameId(null);
    setMatchmaking(null);
    setNotice(null);
    navigate('/game', { replace: true });
  };

  const leaveForLobby = () => {
    emitStop();
    navigate('/lobby');
  };

  if (snapshot) {
    const ownPlayer = snapshot.players.find((player) => player.id === playerId);
    const winner = snapshot.players.find((player) => player.id === snapshot.winnerId);

    return (
      <section className="game-preview-page">
        <div className="game-preview-topbar">
          <div>
            <p className="game-eyebrow">KITCHEN MAYHEM · DEV BUILD</p>
            <h1 className="game-preview-title">ARENA</h1>
          </div>
          <div className="game-topbar-actions">
            <span className={`game-connection-chip game-connection-chip--${connection}`}>
              <span /> {connection === 'connected' ? 'SOCKET ONLINE' : 'SOCKET OFFLINE'}
            </span>
            <button className="game-quiet-button" type="button" onClick={leaveForLobby}>
              Volver al lobby
            </button>
          </div>
        </div>

        {notice && <div className="game-notice" role="status">{notice}</div>}
        {error && <div className="game-error" role="alert">{error}</div>}

        <div className="game-match-layout">
          <main className="game-play-area">
            <div className="game-match-header">
              <div>
                <span className="game-section-kicker">PARTIDA {modeLabel(snapshot.mode)}</span>
                <h2>{snapshot.board.width} × {snapshot.board.height} · {snapshot.gameId.slice(0, 8)}</h2>
              </div>
              <div className={`game-status-pill game-status-pill--${snapshot.status.toLowerCase()}`}>
                {statusLabel(snapshot.status)}
              </div>
            </div>

            <div className="game-score-strip">
              <div><span>TIEMPO</span><strong>{formatElapsed(snapshot.elapsedMs)}</strong></div>
              <div><span>SUPERVIVIENTES</span><strong>{alivePlayers}/{snapshot.players.length}</strong></div>
              <div><span>MAPA</span><strong>{selectedMap.toUpperCase()}</strong></div>
            </div>

            <GameBoard snapshot={snapshot} playerId={playerId} />

            <div className="game-controls-hint">
              <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> o flechas <small>MOVER</small></span>
              <span><kbd>ESPACIO</kbd> <small>COLOCAR BOMBA</small></span>
            </div>

            {snapshot.status === 'FINISHED' && (
              <div className="game-finished-panel">
                <div className="game-finished-icon">🏆</div>
                <div>
                  <p className="game-section-kicker">PARTIDA FINALIZADA</p>
                  <h2>{winner ? `${winner.displayName || 'Jugador'} gana` : 'Empate'}</h2>
                </div>
                <button type="button" className="game-primary-button" onClick={returnToGameMenu}>
                  Volver a jugar
                </button>
              </div>
            )}
          </main>

          <aside className="game-sidebar">
            <section className="game-side-card game-player-card">
              <div className="game-side-card-heading">
                <span className="game-section-kicker">EN LA COCINA</span>
                <strong>{snapshot.players.length}/4</strong>
              </div>
              <div className="game-roster">
                {snapshot.players.map((player, index) => (
                  <div className={`game-roster-player${player.alive ? '' : ' is-dead'}`} key={player.id}>
                    <span className={`game-roster-avatar game-roster-avatar--${index % 4}`}>
                      {player.isBot ? '🤖' : '👨‍🍳'}
                    </span>
                    <div className="game-roster-copy">
                      <strong>{player.displayName || `Jugador ${index + 1}`}</strong>
                      <span>{player.isBot ? 'BOT PASIVO' : player.id === playerId ? 'TÚ' : 'JUGADOR'}</span>
                    </div>
                    <span className={`game-alive-dot${player.alive ? '' : ' is-dead'}`} />
                  </div>
                ))}
              </div>
            </section>

            <section className="game-side-card">
              <span className="game-section-kicker">TUS ESTADÍSTICAS</span>
              {ownPlayer ? (
                <div className="game-stat-grid">
                  <div><strong>{ownPlayer.bombCapacity}</strong><span>BOMBAS</span></div>
                  <div><strong>{ownPlayer.blastRadius}</strong><span>ALCANCE</span></div>
                  <div><strong>{ownPlayer.speed.toFixed(1)}</strong><span>VELOCIDAD</span></div>
                </div>
              ) : <p className="game-muted-copy">Esperando datos del jugador...</p>}
            </section>

            <section className="game-side-card game-legend-card">
              <span className="game-section-kicker">LEYENDA</span>
              <div><i className="legend-swatch legend-swatch--wall" /> Muro indestructible</div>
              <div><i className="legend-swatch legend-swatch--crate" /> Muro destructible</div>
              <div><i className="legend-swatch legend-swatch--bomb" /> Bomba</div>
              <div><i className="legend-swatch legend-swatch--power" /> Power-up</div>
              <p>El servidor calcula las colisiones, las explosiones y el resultado de la partida.</p>
            </section>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="game-preview-page game-preview-menu">
      <div className="game-preview-topbar">
        <div>
          <p className="game-eyebrow">KITCHEN MAYHEM · DEV BUILD</p>
          <h1 className="game-preview-title">GAME LAB<span>.</span></h1>
        </div>
        <div className="game-topbar-actions">
          <span className={`game-connection-chip game-connection-chip--${connection}`}>
            <span /> {connection === 'connected' ? 'SOCKET ONLINE' : connection === 'connecting' ? 'CONECTANDO' : 'SOCKET OFFLINE'}
          </span>
          <span className="game-user-chip">👨‍🍳 {user?.username ?? 'Jugador'}</span>
        </div>
      </div>

      <div className="game-menu-hero">
        <div className="game-menu-copy">
          <span className="game-section-kicker">PROTOCOLO DE PRUEBAS · BACKEND AUTHORITATIVE</span>
          <h2>Entra en la<br /><em>cocina.</em></h2>
          <p>Prueba el motor de juego real. El servidor controla movimiento, bombas, explosiones, mejoras y victoria. Esta interfaz es temporal y solo para desarrollo.</p>
        </div>
        <div className="game-menu-art" aria-hidden="true">
          <div className="game-art-glow" />
          <div className="game-art-grid">
            <span>✦</span><span>▦</span><span>✹</span><span>▦</span><span>✦</span>
            <span>▦</span><span>●</span><span>▦</span><span>●</span><span>▦</span>
            <span>✹</span><span>▦</span><span>●</span><span>▦</span><span>✹</span>
          </div>
          <div className="game-art-caption">BOMBS READY / CHEF MODE</div>
        </div>
      </div>

      {notice && <div className="game-notice" role="status">{notice}</div>}
      {error && <div className="game-error" role="alert">{error}</div>}

      {matchmaking && (
        <div className="game-queue-panel">
          <div className="game-queue-spinner" />
          <div className="game-queue-copy">
            <span className="game-section-kicker">BUSCANDO PARTIDA · {modeLabel(matchmaking.mode)}</span>
            <strong>
              {matchmaking.status === 'COUNTDOWN'
                ? `La partida comienza en ${countdownSeconds ?? 0}s`
                : matchmaking.status === 'SEARCHING'
                  ? 'Buscando jugadores...'
                  : matchmaking.status === 'CREATED'
                    ? 'Creando partida...'
                    : 'Preparando búsqueda...'}
            </strong>
            <span>
              {matchmaking.status === 'COUNTDOWN'
                ? `${matchmaking.playersInCurrentMatch ?? 0} jugadores confirmados · máximo 4`
                : matchmaking.status === 'SEARCHING'
                  ? `${matchmaking.playerCount ?? 1} jugador(es) en tu grupo · la búsqueda no caduca`
                  : 'Conectando con el motor del servidor'}
            </span>
          </div>
          {(matchmaking.status === 'SEARCHING' || matchmaking.status === 'COUNTDOWN') && (
            <button type="button" className="game-danger-button" onClick={cancelMatchmaking}>
              Cancelar búsqueda
            </button>
          )}
        </div>
      )}

      <div className="game-config-grid">
        <section className="game-config-section">
          <div className="game-section-heading">
            <span>01 / MODO DE JUEGO</span>
            <small>Selecciona tu desafío</small>
          </div>
          <div className="game-mode-grid">
            <button
              type="button"
              className={`game-mode-card${selectedMode === 'PRACTICE' ? ' selected' : ''}`}
              onClick={() => setSelectedMode('PRACTICE')}
              disabled={Boolean(matchmaking)}
            >
              <span className="game-mode-icon">🥘</span>
              <strong>PRÁCTICA</strong>
              <small>1 jugador + Chef Bot pasivo</small>
              <span className="game-mode-tag">IDEAL PARA PROBAR</span>
            </button>
            <button
              type="button"
              className={`game-mode-card${selectedMode === 'PRIVATE' ? ' selected' : ''}`}
              onClick={() => setSelectedMode('PRIVATE')}
              disabled={Boolean(matchmaking)}
            >
              <span className="game-mode-icon">👥</span>
              <strong>PRIVADA</strong>
              <small>Solo los miembros de tu lobby (2–4). Todos deben abrir Game Lab.</small>
              <span className="game-mode-tag">SIN RANDOMS</span>
            </button>
            <button
              type="button"
              className={`game-mode-card${selectedMode === 'PUBLIC' ? ' selected' : ''}`}
              onClick={() => setSelectedMode('PUBLIC')}
              disabled={Boolean(matchmaking)}
            >
              <span className="game-mode-icon">🌐</span>
              <strong>PÚBLICA</strong>
              <small>Tu lobby contra otros grupos. Todos deben abrir Game Lab.</small>
              <span className="game-mode-tag">MATCHMAKING</span>
            </button>
          </div>
        </section>

        <section className="game-config-section">
          <div className="game-section-heading">
            <span>02 / ESCENARIO</span>
            <small>Elige el mapa</small>
          </div>
          <div className="game-map-grid">
            {MAPS.map((map, index) => (
              <button
                type="button"
                key={map.id}
                className={`game-map-card${selectedMap === map.id ? ' selected' : ''}`}
                onClick={() => setSelectedMap(map.id)}
                disabled={Boolean(matchmaking)}
              >
                <span className={`game-map-preview game-map-preview--${index + 1}`}>
                  <i /><i /><i /><i /><b />
                </span>
                <strong>{map.name}</strong>
                <small>{map.subtitle}</small>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="game-menu-footer">
        <div>
          <strong>LISTO PARA JUGAR</strong>
          <span>Controles: WASD / flechas · ESPACIO para bomba</span>
        </div>
        <button
          type="button"
          className="game-primary-button game-launch-button"
          onClick={startMatchmaking}
          disabled={connection !== 'connected' || Boolean(matchmaking)}
        >
          {matchmaking ? 'BUSCANDO...' : 'INICIAR PARTIDA'} <span>↗</span>
        </button>
      </div>

      <div className="game-preview-disclaimer">
        <span>DEV PREVIEW</span>
        <p>Esta pantalla es un cliente temporal para validar el motor. No reemplaza el diseño definitivo del frontend.</p>
        <Link to="/lobby">Volver al lobby ↗</Link>
      </div>
    </section>
  );
}
