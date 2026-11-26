import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import type { GameSnapshot } from '@transcendence/shared';

import {
  GameConnection,
  JOIN_TIMEOUT_MS,
  type GameInputRejected,
  type GameJoinFailure,
  type GameSocketLike,
} from './gameConnection';

class FakeSocket implements GameSocketLike {
  connected = true;
  emitCalls: Array<{ event: string; payload?: unknown }> = [];

  private readonly handlers = new Map<
    string,
    Set<(payload: unknown) => void>
  >();

  connect = (): void => {
    this.connected = true;
  };

  emit = (event: string, payload?: unknown): unknown => {
    this.emitCalls.push({ event, payload });
    return this;
  };

  on = (event: string, handler: (payload: unknown) => void): void => {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler);
    this.handlers.set(event, set);
  };

  off = (event: string, handler: (payload: unknown) => void): void => {
    this.handlers.get(event)?.delete(handler);
  };

  /** Simula un evento entrante del servidor. */
  fire(event: string, ...args: unknown[]): void {
    const set = this.handlers.get(event);

    if (!set) {
      return;
    }

    for (const handler of [...set]) {
      handler(args[0]);
    }
  }

  emitted(event: string): Array<{ event: string; payload?: unknown }> {
    return this.emitCalls.filter((call) => call.event === event);
  }
}

function makeSnapshot(gameId: string): GameSnapshot {
  return {
    gameId,
    mode: 'PRACTICE',
    status: 'RUNNING',
    elapsedMs: 1000,
    board: { width: 1, height: 1, tiles: [['FLOOR']] },
    players: [],
    bombs: [],
    explosions: [],
    powerUps: [],
    winnerId: null,
  } as GameSnapshot;
}

describe('GameConnection', () => {
  let socket: FakeSocket;
  // Tipado explícito: `ReturnType<typeof vi.fn>` incluye la firma
  // de constructor y no es asignable a los callbacks de la clase.
  let onJoined: Mock<(snapshot: GameSnapshot) => void>;
  let onState: Mock<(snapshot: GameSnapshot) => void>;
  let onFailed: Mock<(reason: GameJoinFailure) => void>;
  let onInputRejected: Mock<(rejected: GameInputRejected) => void>;
  let connection: GameConnection;

  beforeEach(() => {
    vi.useFakeTimers();
    socket = new FakeSocket();
    onJoined = vi.fn<(snapshot: GameSnapshot) => void>();
    onState = vi.fn<(snapshot: GameSnapshot) => void>();
    onFailed = vi.fn<(reason: GameJoinFailure) => void>();
    onInputRejected = vi.fn<(rejected: GameInputRejected) => void>();
    connection = new GameConnection(socket, {
      onJoined,
      onState,
      onFailed,
      onInputRejected,
    });
  });

  afterEach(() => {
    connection.destroy();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('emits game:join with the route id', () => {
    connection.join('abc');

    expect(socket.emitted('game:join')).toEqual([
      { event: 'game:join', payload: { gameId: 'abc' } },
    ]);
  });

  it('connects the socket first when it is not connected', () => {
    socket.connected = false;
    const connectSpy = vi.spyOn(socket, 'connect');

    connection.join('abc');

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });

  it('reports the initial snapshot from game:joined', () => {
    const snapshot = makeSnapshot('abc');
    connection.join('abc');
    socket.fire('game:joined', { gameId: 'abc', snapshot });

    expect(onJoined).toHaveBeenCalledWith(snapshot);
    expect(onFailed).not.toHaveBeenCalled();
  });

  it('does not fail after the snapshot arrived', () => {
    connection.join('abc');
    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });

    vi.advanceTimersByTime(JOIN_TIMEOUT_MS);

    expect(onFailed).not.toHaveBeenCalled();
  });

  it('fails when the server never answers', () => {
    connection.join('abc');

    vi.advanceTimersByTime(JOIN_TIMEOUT_MS);

    expect(onFailed).toHaveBeenCalledWith('timeout');
    expect(onJoined).not.toHaveBeenCalled();
  });

  it('fails on a join rejection from the backend', () => {
    connection.join('abc');
    socket.fire('exception', { message: 'Game not found' });

    expect(onFailed).toHaveBeenCalledWith('rejected');
  });

  it('ignores exceptions after a successful join', () => {
    connection.join('abc');
    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });
    socket.fire('exception', { message: 'Join a game first' });

    expect(onFailed).not.toHaveBeenCalled();
  });

  it('forwards valid game:state snapshots', () => {
    const snapshot = makeSnapshot('abc');
    connection.join('abc');
    socket.fire('game:joined', { gameId: 'abc', snapshot });
    socket.fire('game:state', snapshot);

    expect(onState).toHaveBeenCalledWith(snapshot);
  });

  it('ignores malformed game:state payloads', () => {
    connection.join('abc');
    socket.fire('game:state', { nope: true });

    expect(onState).not.toHaveBeenCalled();
  });

  it('rejoins after a reconnect', () => {
    connection.join('abc');
    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });
    socket.fire('disconnect');
    socket.fire('connect');

    const joins = socket.emitted('game:join');
    expect(joins).toHaveLength(2);
    expect(joins[1]?.payload).toEqual({ gameId: 'abc' });
  });

  it('requests spectator mode and never sends input', () => {
    connection.join('abc', { spectator: true });

    expect(socket.emitted('game:join')[0]?.payload).toEqual({
      gameId: 'abc',
      spectator: true,
    });

    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });

    connection.sendMovement({
      up: true,
      down: false,
      left: false,
      right: false,
    });
    connection.sendBomb();
    connection.destroy();

    expect(socket.emitted('game:input')).toHaveLength(0);
  });

  it('sends movement and bombs only once joined', () => {
    connection.join('abc');
    connection.sendMovement({
      up: true,
      down: false,
      left: false,
      right: false,
    });
    connection.sendBomb();

    expect(socket.emitted('game:input')).toHaveLength(0);

    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });
    connection.sendMovement({
      up: true,
      down: false,
      left: false,
      right: false,
    });
    connection.sendBomb();

    expect(socket.emitted('game:input')).toEqual([
      {
        event: 'game:input',
        payload: {
          action: 'movement',
          input: { up: true, down: false, left: false, right: false },
        },
      },
      { event: 'game:input', payload: { action: 'place-bomb' } },
    ]);
  });

  it('emits game:abandon instead of a stop when leaving voluntarily', () => {
    connection.join('abc');
    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });

    connection.abandon();

    expect(socket.emitted('game:abandon')).toHaveLength(1);
    expect(socket.emitted('game:input')).toHaveLength(0);

    socket.fire('game:state', makeSnapshot('abc'));
    expect(onState).not.toHaveBeenCalled();
  });

  it('stops the player and detaches listeners on destroy', () => {
    connection.join('abc');
    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });
    connection.destroy();

    expect(socket.emitted('game:input')).toEqual([
      { event: 'game:input', payload: { action: 'stop' } },
    ]);

    socket.fire('game:state', makeSnapshot('abc'));

    expect(onState).not.toHaveBeenCalled();
  });

  it('does not send a stop input after the game has finished', () => {
    connection.join('abc');
    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: { ...makeSnapshot('abc'), status: 'FINISHED' },
    });

    connection.destroy();

    expect(socket.emitted('game:input')).toHaveLength(0);
  });

  it('reports rejected inputs after a successful join', () => {
    connection.join('abc');
    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });

    socket.fire('game:inputRejected', {
      action: 'place-bomb',
      reason: 'bomb-capacity',
    });

    expect(onInputRejected).toHaveBeenCalledWith({
      action: 'place-bomb',
      reason: 'bomb-capacity',
    });
  });

  it('ignores rejected inputs before the join settles', () => {
    connection.join('abc');

    socket.fire('game:inputRejected', {
      action: 'place-bomb',
      reason: 'bomb-capacity',
    });

    expect(onInputRejected).not.toHaveBeenCalled();
  });

  it('removes the rejected-input listener when destroyed', () => {
    connection.join('abc');
    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });

    connection.destroy();
    socket.fire('game:inputRejected', {
      action: 'place-bomb',
      reason: 'bomb-capacity',
    });

    expect(onInputRejected).not.toHaveBeenCalled();
  });

  it('ignores malformed game:inputRejected payloads', () => {
    connection.join('abc');
    socket.fire('game:joined', {
      gameId: 'abc',
      snapshot: makeSnapshot('abc'),
    });

    socket.fire('game:inputRejected', { nope: true });
    socket.fire('game:inputRejected', 'nope');
    socket.fire('game:inputRejected', {
      action: 'place-bomb',
      reason: 42,
    });

    expect(onInputRejected).not.toHaveBeenCalled();
  });
});
