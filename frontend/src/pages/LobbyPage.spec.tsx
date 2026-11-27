// @vitest-environment happy-dom

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LobbyPage } from './LobbyPage';
import { useLobbyStore } from '@/features/chat/store/useLobbyStore';

const socket = vi.hoisted(() => {
  const gameListeners = new Map<string, Set<(payload?: unknown) => void>>();
  const chatListeners = new Map<string, Set<(payload?: unknown) => void>>();

  const register = (
    listeners: Map<string, Set<(payload?: unknown) => void>>,
    event: string,
    handler: (payload?: unknown) => void
  ) => {
    const handlers = listeners.get(event) ?? new Set();
    handlers.add(handler);
    listeners.set(event, handlers);
  };

  const unregister = (
    listeners: Map<string, Set<(payload?: unknown) => void>>,
    event: string,
    handler: (payload?: unknown) => void
  ) => {
    listeners.get(event)?.delete(handler);
  };

  return {
    gameListeners,
    chatListeners,
    gameSocket: {
      connected: true,
      on: (event: string, handler: (payload?: unknown) => void) =>
        register(gameListeners, event, handler),
      off: (event: string, handler: (payload?: unknown) => void) =>
        unregister(gameListeners, event, handler),
      emit: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
    },
    chatSocket: {
      connected: false,
      on: (event: string, handler: (payload?: unknown) => void) =>
        register(chatListeners, event, handler),
      off: (event: string, handler: (payload?: unknown) => void) =>
        unregister(chatListeners, event, handler),
      emit: vi.fn(),
    },
  };
});

vi.mock('@/lib/socket', () => ({
  gameSocket: socket.gameSocket,
  chatSocket: socket.chatSocket,
}));

vi.mock('@/features/lobby/activeMatch', () => ({
  fetchActiveGameId: vi.fn(async () => null),
}));

vi.mock('@/features/friends/store/useFriendsStore', () => ({
  useFriendsStore: (
    selector: (state: { initListeners: () => () => void }) => unknown
  ) => selector({ initListeners: () => () => undefined }),
}));

vi.mock('@/features/friends/components/FriendListCard', () => ({
  FriendList: () => null,
}));

vi.mock('@/features/chat/components/GlobalChat', () => ({
  GlobalChat: () => null,
}));

vi.mock('@/locales/useLanguage', () => ({
  useLanguage: () => ({ t: () => '' }),
}));

vi.mock('@/features/lobby/components/GameConfig', () => ({
  GameConfig: (props: {
    disabled?: boolean;
    onStart: (payload: {
      mode: 'practice';
      mapId: 'map1';
      settings: {
        initialBombs: number;
        initialSpeed: number;
        fuseTime: number;
      };
    }) => void;
  }) => (
    <button
      type="button"
      data-testid="start-practice"
      disabled={props.disabled}
      onClick={() =>
        props.onStart({
          mode: 'practice',
          mapId: 'map1',
          settings: { initialBombs: 1, initialSpeed: 1, fuseTime: 3 },
        })
      }
    >
      Start practice
    </button>
  ),
}));

const mountedRoots: Array<{
  root: ReturnType<typeof createRoot>;
  container: HTMLDivElement;
}> = [];

function renderLobby() {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push({ root, container });

  act(() => {
    root.render(
      <MemoryRouter initialEntries={['/lobby']}>
        <LobbyPage />
      </MemoryRouter>
    );
  });

  return container;
}

function emitGameEvent(event: string, payload?: unknown) {
  act(() => {
    for (const handler of socket.gameListeners.get(event) ?? []) {
      handler(payload);
    }
  });
}

function emitChatEvent(event: string, payload?: unknown) {
  act(() => {
    for (const handler of socket.chatListeners.get(event) ?? []) {
      handler(payload);
    }
  });
}

beforeEach(() => {
  useLobbyStore.setState({
    lobby: null,
    lobbyInvitations: [],
    error: null,
    notice: null,
    noticeData: null,
  });
  socket.gameSocket.connected = true;
  socket.gameSocket.emit.mockClear();
});

afterEach(() => {
  for (const { root, container } of mountedRoots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }

  vi.clearAllMocks();
});

describe('LobbyPage connecting-to-match transition', () => {
  it('shows the connecting state after launching a match', () => {
    const container = renderLobby();

    const start = container.querySelector<HTMLButtonElement>(
      '[data-testid="start-practice"]'
    );

    expect(start).not.toBeNull();

    act(() => start?.click());

    expect(container.textContent).toContain('Connecting to match...');
    expect(start?.disabled).toBe(true);
    expect(socket.gameSocket.emit).toHaveBeenCalledWith(
      'game:matchmaking',
      expect.objectContaining({ mode: 'PRACTICE' })
    );

    // Duplicate clicks must not trigger another request.
    act(() => start?.click());
    expect(socket.gameSocket.emit).toHaveBeenCalledTimes(1);
  });

  it('resets the connecting state when a socket exception arrives', () => {
    const container = renderLobby();

    const start = container.querySelector<HTMLButtonElement>(
      '[data-testid="start-practice"]'
    );

    act(() => start?.click());
    expect(container.textContent).toContain('Connecting to match...');

    emitGameEvent('exception', {
      message: 'Private matches require between 2 and 4 players',
    });

    expect(container.textContent).not.toContain('Connecting to match...');
    expect(start?.disabled).toBe(false);
  });

  it('resets the connecting state when the game socket disconnects', () => {
    const container = renderLobby();

    const start = container.querySelector<HTMLButtonElement>(
      '[data-testid="start-practice"]'
    );

    act(() => start?.click());
    expect(container.textContent).toContain('Connecting to match...');

    emitGameEvent('disconnect');

    expect(container.textContent).not.toContain('Connecting to match...');
    expect(start?.disabled).toBe(false);
  });

  it('switches to connecting when the server creates the match', () => {
    const container = renderLobby();

    emitGameEvent('game:matchmakingStatus', {
      status: 'CREATED',
      gameId: 'game-42',
      mode: 'PUBLIC',
    });

    expect(container.textContent).toContain('Connecting to match...');
    expect(container.textContent).not.toContain(
      'You already have a match in progress'
    );
  });

  it('keeps the lobby controls when a recoverable lobby error arrives', () => {
    const container = renderLobby();

    emitChatEvent('lobby:error', { message: 'Lobby is full' });

    const alert = container.querySelector('[role="alert"]');

    expect(alert?.textContent).toContain('Lobby is full');
    expect(
      container.querySelector('[data-testid="start-practice"]')
    ).not.toBeNull();
  });
});
