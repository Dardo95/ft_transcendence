import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useLobbyStore } from './useLobbyStore';

const socket = vi.hoisted(() => {
  const listeners = new Map<string, Set<(payload?: unknown) => void>>();

  return {
    listeners,
    socket: {
      connected: true,
      on: (event: string, handler: (payload?: unknown) => void) => {
        const handlers = listeners.get(event) ?? new Set();
        handlers.add(handler);
        listeners.set(event, handlers);
      },
      off: (event: string, handler: (payload?: unknown) => void) => {
        listeners.get(event)?.delete(handler);
      },
      emit: vi.fn(),
    },
  };
});

vi.mock('@/lib/socket', () => ({
  chatSocket: socket.socket,
}));

function emitLobbyEvent(event: string, payload?: unknown) {
  for (const handler of socket.listeners.get(event) ?? []) {
    handler(payload);
  }
}

let cleanup: (() => void) | null = null;

beforeEach(() => {
  useLobbyStore.setState({
    lobby: null,
    lobbyInvitations: [],
    error: null,
    notice: null,
    noticeData: null,
  });
  socket.socket.connected = true;
  socket.socket.emit.mockClear();
  cleanup = useLobbyStore.getState().initListeners();
});

afterEach(() => {
  cleanup?.();
  cleanup = null;
  vi.clearAllMocks();
});

describe('useLobbyStore recoverable lobby errors', () => {
  it('resynchronizes when accepting a stale invitation fails', () => {
    socket.socket.emit.mockClear();

    emitLobbyEvent('lobby:error', {
      message: 'Lobby no longer exists',
    });

    expect(useLobbyStore.getState().error).toBe('Lobby no longer exists');
    expect(socket.socket.emit).toHaveBeenCalledWith('lobby:sync');
  });

  it('resynchronizes when the target lobby filled up', () => {
    socket.socket.emit.mockClear();

    emitLobbyEvent('lobby:error', { message: 'Lobby is full' });

    expect(socket.socket.emit).toHaveBeenCalledWith('lobby:sync');
  });

  it('keeps the snapshot for non-stale invitation failures', () => {
    socket.socket.emit.mockClear();

    emitLobbyEvent('lobby:error', {
      message: 'Cannot invite yourself',
    });

    expect(useLobbyStore.getState().error).toBe('Cannot invite yourself');
    expect(socket.socket.emit).not.toHaveBeenCalled();
  });
});
