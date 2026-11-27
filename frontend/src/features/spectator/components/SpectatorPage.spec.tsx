// @vitest-environment happy-dom

import { act, type ReactNode, type RefObject } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameSnapshot } from '@transcendence/shared';

import { SpectatorPage } from './SpectatorPage';

const harness = vi.hoisted(() => ({
  snapshot: null as GameSnapshot | null,
  failure: null as 'timeout' | 'rejected' | null,
  abandonSpy: vi.fn(),
}));

vi.mock('@/features/game', () => ({
  GameViewport: ({
    onSnapshotUpdate,
    onJoinFailure,
    focusedPlayerId,
    viewportRef,
    children,
  }: {
    onSnapshotUpdate?: (snapshot: GameSnapshot) => void;
    onJoinFailure?: (reason: 'timeout' | 'rejected') => void;
    focusedPlayerId?: string | null;
    viewportRef?: RefObject<HTMLDivElement | null>;
    children?: ReactNode;
  }) => (
    <div
      ref={viewportRef}
      data-testid="arena"
      data-focused-player={focusedPlayerId ?? ''}
    >
      <button
        type="button"
        data-testid="emit-snapshot"
        onClick={() => {
          if (harness.snapshot) {
            onSnapshotUpdate?.(harness.snapshot);
          }
        }}
      >
        snapshot
      </button>
      <button
        type="button"
        data-testid="emit-failure"
        onClick={() => {
          if (harness.failure) {
            onJoinFailure?.(harness.failure);
          }
        }}
      >
        failure
      </button>
      {children}
    </div>
  ),
}));

vi.mock('@/locales/useLanguage', () => ({
  useLanguage: () => ({ t: () => '' }),
}));

const mountedRoots: Array<{
  root: ReturnType<typeof createRoot>;
  container: HTMLDivElement;
}> = [];

function makeSnapshot(overrides: Partial<GameSnapshot> = {}): GameSnapshot {
  return {
    gameId: 'game-1',
    mode: 'PUBLIC',
    status: 'RUNNING',
    elapsedMs: 30_000,
    board: { width: 13, height: 11, tiles: [] },
    players: [
      {
        id: 'p1',
        displayName: 'Alice',
        isBot: false,
        position: { x: 1, y: 1 },
        alive: true,
        bombCapacity: 2,
        blastRadius: 3,
        speed: 1.2,
      },
      {
        id: 'p2',
        displayName: 'Botty',
        isBot: true,
        position: { x: 2, y: 2 },
        alive: false,
        bombCapacity: 1,
        blastRadius: 2,
        speed: 1,
      },
    ],
    bombs: [],
    explosions: [],
    powerUps: [],
    winnerId: null,
    ...overrides,
  };
}

function renderSpectator(path = '/game/game-1?mode=spectator') {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push({ root, container });

  act(() => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/game/:id" element={<SpectatorPage gameId="game-1" />} />
          <Route
            path="/lobby"
            element={<div data-testid="lobby-page">Lobby</div>}
          />
        </Routes>
      </MemoryRouter>
    );
  });

  return container;
}

function emitSnapshot(container: HTMLElement) {
  act(() => {
    container
      .querySelector<HTMLButtonElement>('[data-testid="emit-snapshot"]')
      ?.click();
  });
}

beforeEach(() => {
  harness.snapshot = makeSnapshot();
  harness.failure = null;
});

afterEach(() => {
  for (const { root, container } of mountedRoots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }

  vi.clearAllMocks();
});

describe('SpectatorPage', () => {
  it('renders a standalone top spectator card separate from GameTopBar', () => {
    const container = renderSpectator();
    emitSnapshot(container);

    const card = container.querySelector('[data-slot="card"]');
    const topBar = container.querySelector('header');
    const liveBadge = card?.querySelector('[role="status"]');

    expect(card).not.toBeNull();
    expect(topBar).not.toBeNull();
    expect(card?.contains(topBar)).toBe(false);
    expect(topBar?.contains(card)).toBe(false);
    expect(card?.querySelector('h1')?.textContent).toContain('Spectator mode');
    expect(liveBadge?.textContent).toContain('Live');
    expect(topBar?.textContent).not.toContain('Spectator mode');
  });

  it('reuses GameTopBar and leaves directly to lobby without calling abandon', () => {
    const container = renderSpectator(
      '/game/game-1?mode=spectator&map=kitchen'
    );
    emitSnapshot(container);

    const topBar = container.querySelector('header');
    expect(topBar).not.toBeNull();
    expect(topBar?.textContent).toContain('13 × 11');
    expect(topBar?.textContent).toContain('game-1');
    expect(topBar?.textContent).toContain('1/2');
    expect(topBar?.textContent).toContain('KITCHEN');

    const leaveButton = Array.from(
      topBar?.querySelectorAll('button') ?? []
    ).find((button) => button.textContent?.includes('Leave'));

    expect(leaveButton).toBeTruthy();

    act(() => leaveButton?.click());

    expect(harness.abandonSpy).not.toHaveBeenCalled();
    expect(
      container.querySelector('[data-testid="lobby-page"]')
    ).not.toBeNull();
  });

  it('renders the scoreboard in a 2-column grid using PlayerPanel', () => {
    const container = renderSpectator();
    emitSnapshot(container);

    const list = container.querySelector('aside ul');
    expect(list?.className).toContain('sm:grid-cols-2');

    expect(container.textContent).toContain('Live players scoreboard');
    expect(container.textContent).toContain('1/2');
    expect(container.textContent).toContain('Alice');
    expect(container.textContent).toContain('Botty');
    expect(container.querySelector('[aria-label="Up"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Out"]')).not.toBeNull();
    expect(container.textContent).toContain('Bombs');
    expect(container.textContent).toContain('Blast');
    expect(container.textContent).toContain('Speed');
    expect(container.textContent).toContain('1.2');
    expect(container.textContent).toContain('1.0');
  });

  it('renders EndScreenOverlay over the arena when the match finishes with a winner', () => {
    harness.snapshot = makeSnapshot({
      status: 'FINISHED',
      winnerId: 'p1',
    });

    const container = renderSpectator();
    emitSnapshot(container);

    const arena = container.querySelector('[data-testid="arena"]');
    const overlayStatus = arena?.querySelector('[role="status"]');

    expect(overlayStatus).not.toBeNull();
    expect(overlayStatus?.textContent).toContain('Match result');
    expect(overlayStatus?.textContent).toContain('Winner: Alice');

    const backButtons = Array.from(container.querySelectorAll('button')).filter(
      (button) => button.textContent?.includes('Back to lobby')
    );
    expect(backButtons).toHaveLength(1);
    expect(arena?.contains(backButtons[0])).toBe(true);

    act(() => backButtons[0].click());
    expect(
      container.querySelector('[data-testid="lobby-page"]')
    ).not.toBeNull();
  });

  it('renders EndScreenOverlay with Draw when the finished match has no winner', () => {
    harness.snapshot = makeSnapshot({
      status: 'FINISHED',
      winnerId: null,
    });

    const container = renderSpectator();
    emitSnapshot(container);

    const arena = container.querySelector('[data-testid="arena"]');
    const overlayStatus = arena?.querySelector('[role="status"]');

    expect(overlayStatus?.textContent).toContain('Match result');
    expect(overlayStatus?.textContent).toContain('Draw');
  });

  it('shows a recoverable card when the join is rejected without retry', () => {
    harness.failure = 'rejected';

    const container = renderSpectator();
    act(() => {
      container
        .querySelector<HTMLButtonElement>('[data-testid="emit-failure"]')
        ?.click();
    });

    expect(container.textContent).toContain('Match unavailable');
    expect(
      Array.from(container.querySelectorAll('button')).some((button) =>
        button.textContent?.includes('Retry')
      )
    ).toBe(false);
    expect(
      Array.from(container.querySelectorAll('button')).some((button) =>
        button.textContent?.includes('Back to lobby')
      )
    ).toBe(true);
  });

  it('shows a retry action when the join times out', () => {
    harness.failure = 'timeout';

    const container = renderSpectator();
    act(() => {
      container
        .querySelector<HTMLButtonElement>('[data-testid="emit-failure"]')
        ?.click();
    });

    expect(container.textContent).toContain('Could not connect to the server');
    expect(
      Array.from(container.querySelectorAll('button')).some((button) =>
        button.textContent?.includes('Retry')
      )
    ).toBe(true);
  });

  it('focuses a player panel and can return to the full arena', () => {
    const container = renderSpectator();
    emitSnapshot(container);

    const arena = container.querySelector('[data-testid="arena"]');
    const alicePanel = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Alice')
    );

    expect(alicePanel).toBeTruthy();
    expect(arena?.getAttribute('data-focused-player')).toBe('');

    act(() => alicePanel?.click());
    expect(alicePanel?.getAttribute('aria-pressed')).toBe('true');
    expect(arena?.getAttribute('data-focused-player')).toBe('p1');

    const fullArena = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Full arena')
    );

    expect(fullArena).toBeTruthy();

    act(() => fullArena?.click());
    expect(alicePanel?.getAttribute('aria-pressed')).toBe('false');
    expect(arena?.getAttribute('data-focused-player')).toBe('');
  });
});
