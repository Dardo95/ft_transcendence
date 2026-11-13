import type { GameSnapshot, MovementInput } from '@transcendence/shared';

/**
 * Conexión de la partida con el backend.
 *
 * Responsable:
 * - Unirse a una partida (`game:join`) y notificar el snapshot inicial.
 * - Recibir snapshots autoritativos (`game:state`, 20 Hz).
 * - Enviar input (`game:input`).
 * - Re-join automático tras una reconexión.
 *
 * No:
 * - Dibujar (lo hace `GameViewport`).
 * - Gestionar el ciclo de vida del socket (lo hace `useSocketStore`).
 */

/** Segundos de espera del snapshot inicial antes de rendirse. */
export const JOIN_TIMEOUT_MS = 3000;

export type GameJoinFailure = 'timeout' | 'rejected';

export interface GameConnectionCallbacks {
  onJoined: (snapshot: GameSnapshot) => void;
  onState: (snapshot: GameSnapshot) => void;
  onFailed: (reason: GameJoinFailure) => void;
}

/**
 * Mínimo de `socket.io-client` que usa la conexión. Permite
 * inyectar un doble en los tests sin montar un socket real.
 *
 * Los handlers reciben `unknown` (no `any[]`): es asignable a
 * la firma de `socket.io` y evita `@typescript-eslint/no-explicit-any`.
 */
export interface GameSocketLike {
  connected: boolean;
  connect: () => void;
  emit: (event: string, payload?: unknown) => unknown;
  on: (event: string, handler: (payload: unknown) => void) => void;
  off: (event: string, handler: (payload: unknown) => void) => void;
}

function isGameSnapshot(value: unknown): value is GameSnapshot {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<GameSnapshot>;

  return (
    typeof candidate.gameId === 'string' &&
    typeof candidate.board === 'object' &&
    candidate.board !== null &&
    Array.isArray(candidate.players)
  );
}

function extractJoinedSnapshot(payload: unknown): GameSnapshot | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const snapshot = (payload as { snapshot?: unknown }).snapshot;

  return isGameSnapshot(snapshot) ? snapshot : null;
}

export class GameConnection {
  private readonly socket: GameSocketLike;
  private readonly callbacks: GameConnectionCallbacks;

  private gameId: string | null = null;
  private joined = false;
  private spectator = false;
  /** El intento actual terminó (éxito o fallo): evita dobles avisos. */
  private settled = false;
  private active = false;
  /**
   * Hubo una desconexión tras el último join: `socket.io`
   * bufferiza el `game:join` emitido sin conexión, así que sin
   * este flag `handleConnect` lo reenviaría (join duplicado).
   */
  private needsRejoin = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(socket: GameSocketLike, callbacks: GameConnectionCallbacks) {
    this.socket = socket;
    this.callbacks = callbacks;
  }

  /** Se une a `gameId` y arranca la espera del snapshot inicial. */
  join(gameId: string, options: { spectator?: boolean } = {}): void {
    this.removeListeners();
    this.gameId = gameId;
    this.joined = false;
    this.spectator = options.spectator === true;
    this.active = true;
    this.needsRejoin = false;
    this.addListeners();

    if (!this.socket.connected) {
      this.socket.connect();
    }

    this.requestJoin();
  }

  sendMovement(movement: MovementInput): void {
    if (!this.joined || this.spectator) {
      return;
    }

    this.socket.emit('game:input', { action: 'movement', input: movement });
  }

  sendBomb(): void {
    if (!this.joined || this.spectator) {
      return;
    }

    this.socket.emit('game:input', { action: 'place-bomb' });
  }

  /**
   * Detiene al jugador en el servidor y deja de escuchar. El
   * socket es global: sin este stop el jugador seguiría andando.
   */
  destroy(): void {
    this.sendStop();
    this.removeListeners();
    this.clearTimer();
    this.gameId = null;
    this.joined = false;
    this.spectator = false;
    this.active = false;
    this.needsRejoin = false;
  }

  private sendStop(): void {
    if (!this.joined || this.spectator || !this.socket.connected) {
      return;
    }

    this.socket.emit('game:input', { action: 'stop' });
  }

  private requestJoin(): void {
    if (!this.gameId) {
      return;
    }

    this.settled = false;
    this.clearTimer();
    this.socket.emit(
      'game:join',
      this.spectator
        ? { gameId: this.gameId, spectator: true }
        : { gameId: this.gameId }
    );
    this.timer = setTimeout(() => this.fail('timeout'), JOIN_TIMEOUT_MS);
  }

  private fail(reason: GameJoinFailure): void {
    if (this.settled || !this.active) {
      return;
    }

    this.settled = true;
    this.clearTimer();
    this.callbacks.onFailed(reason);
  }

  private readonly handleJoined = (payload: unknown): void => {
    const snapshot = extractJoinedSnapshot(payload);

    if (!snapshot) {
      return;
    }

    this.settled = true;
    this.joined = true;
    this.clearTimer();
    this.callbacks.onJoined(snapshot);
  };

  private readonly handleState = (payload: unknown): void => {
    if (!isGameSnapshot(payload)) {
      return;
    }

    this.callbacks.onState(payload);
  };

  private readonly handleException = (): void => {
    // Un rechazo posterior (input inválido, partida terminada) no
    // debe tumbar una partida ya unida.
    if (this.joined) {
      return;
    }

    this.fail('rejected');
  };

  private readonly handleConnect = (): void => {
    // Solo re-entrar tras una desconexión real: si el socket
    // estaba caído al hacer `join()`, socket.io ya bufferizó y
    // envió ese mismo `game:join` al conectar.
    if (this.gameId && this.needsRejoin) {
      this.needsRejoin = false;
      this.requestJoin();
    }
  };

  private readonly handleDisconnect = (): void => {
    this.joined = false;
    this.needsRejoin = true;
  };

  private addListeners(): void {
    this.socket.on('game:joined', this.handleJoined);
    this.socket.on('game:state', this.handleState);
    this.socket.on('exception', this.handleException);
    this.socket.on('connect', this.handleConnect);
    this.socket.on('disconnect', this.handleDisconnect);
  }

  private removeListeners(): void {
    this.socket.off('game:joined', this.handleJoined);
    this.socket.off('game:state', this.handleState);
    this.socket.off('exception', this.handleException);
    this.socket.off('connect', this.handleConnect);
    this.socket.off('disconnect', this.handleDisconnect);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
