// @vitest-environment happy-dom

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GamePage } from './GamePage';

vi.mock('@/features/game', () => ({
  GameViewport: () => <div data-testid="game-viewport" />,
}));

vi.mock('@/features/spectator/components/SpectatorPage', () => ({
  SpectatorPage: ({ gameId }: { gameId: string }) => (
    <div data-testid="spectator-page">{gameId}</div>
  ),
}));

const mountedRoots: Array<{
  root: ReturnType<typeof createRoot>;
  container: HTMLDivElement;
}> = [];

function renderGame(path: string) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push({ root, container });

  act(() => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/game/:id?" element={<GamePage />} />
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

afterEach(() => {
  for (const { root, container } of mountedRoots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }

  vi.clearAllMocks();
});

describe('GamePage routing', () => {
  it('delegates ?mode=spectator to SpectatorPage', () => {
    const container = renderGame('/game/game-42?mode=spectator');

    expect(
      container.querySelector('[data-testid="spectator-page"]')?.textContent
    ).toBe('game-42');
    expect(container.querySelector('[data-testid="game-viewport"]')).toBeNull();
  });

  it('renders the player viewport without the spectator flag', () => {
    const container = renderGame('/game/game-42');

    expect(
      container.querySelector('[data-testid="game-viewport"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="spectator-page"]')
    ).toBeNull();
  });

  it('redirects to the lobby when the route has no id', () => {
    const container = renderGame('/game');

    expect(
      container.querySelector('[data-testid="lobby-page"]')
    ).not.toBeNull();
  });
});
