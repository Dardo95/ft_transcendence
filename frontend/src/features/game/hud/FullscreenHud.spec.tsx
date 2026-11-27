// @vitest-environment happy-dom

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { GamePlayerSnapshot } from '@transcendence/shared';

import { FullscreenHud } from './FullscreenHud';
import { buildHudModel } from './hudModel';

vi.mock('../../../locales/useLanguage', () => ({
  useLanguage: () => ({ t: () => '' }),
}));

const mountedRoots: Array<{
  root: ReturnType<typeof createRoot>;
  container: HTMLDivElement;
}> = [];

function player(
  id: string,
  overrides: Partial<GamePlayerSnapshot> = {}
): GamePlayerSnapshot {
  return {
    id,
    displayName: id,
    isBot: false,
    position: { x: 1, y: 1 },
    alive: true,
    bombCapacity: 2,
    blastRadius: 3,
    speed: 1.5,
    ...overrides,
  };
}

function renderFullscreenHud(
  model: ReturnType<typeof buildHudModel>,
  showAllStats = false
) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push({ root, container });

  act(() => {
    root.render(<FullscreenHud model={model} showAllStats={showAllStats} />);
  });

  return container;
}

afterEach(() => {
  for (const { root, container } of mountedRoots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }
});

describe('FullscreenHud', () => {
  it('shows stats only for the local player by default', () => {
    const model = buildHudModel(
      [
        player('Alice', { bombCapacity: 3, blastRadius: 4, speed: 1.4 }),
        player('Bob', { bombCapacity: 2, blastRadius: 2, speed: 1.1 }),
      ],
      [],
      'Alice',
      30_000
    );

    const container = renderFullscreenHud(model);

    expect(container.textContent).toContain('Alice');
    expect(container.textContent).toContain('Bob');
    expect(container.textContent?.match(/Bombs/g)).toHaveLength(1);
    expect(container.textContent).toContain('1.4');
    expect(container.textContent).not.toContain('1.1');
  });

  it('shows stats for every player in spectator fullscreen mode', () => {
    const model = buildHudModel(
      [
        player('Alice', { bombCapacity: 3, blastRadius: 4, speed: 1.4 }),
        player('Bob', { bombCapacity: 2, blastRadius: 2, speed: 1.1 }),
        player('Cara', {
          alive: false,
          bombCapacity: 1,
          blastRadius: 2,
          speed: 1.0,
        }),
      ],
      [],
      null,
      30_000
    );

    const container = renderFullscreenHud(model, true);

    expect(container.textContent).toContain('Alice');
    expect(container.textContent).toContain('Bob');
    expect(container.textContent).toContain('Cara');
    expect(container.textContent?.match(/Bombs/g)).toHaveLength(3);
    expect(container.textContent?.match(/Blast/g)).toHaveLength(3);
    expect(container.textContent?.match(/Speed/g)).toHaveLength(3);
    expect(container.textContent).toContain('1.4');
    expect(container.textContent).toContain('1.1');
    expect(container.textContent).toContain('1.0');
  });
});
