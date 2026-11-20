import type { BombSnapshot, GamePlayerSnapshot } from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import {
  buildHudModel,
  buildLocalHud,
  buildRivalHud,
  countAlivePlayers,
  formatClock,
  remainingMatchMs,
} from './hudModel';

function player(
  id: string,
  overrides: Partial<GamePlayerSnapshot> = {}
): GamePlayerSnapshot {
  return {
    id,
    displayName: id,
    isBot: false,
    position: { x: 1.5, y: 1.5 },
    alive: true,
    bombCapacity: 1,
    blastRadius: 2,
    speed: 4,
    ...overrides,
  };
}

function bomb(ownerId: string, x = 3, y = 5): BombSnapshot {
  return {
    id: `bomb-${ownerId}-${x}-${y}`,
    ownerId,
    position: { x, y },
    detonateAt: 2500,
    blastRadius: 2,
  };
}

const PLAYERS = [
  player('bren'),
  player('eduardo'),
  player('oliver'),
  player('raul'),
];

describe('buildLocalHud', () => {
  it('reports full capacity when no own bomb is active', () => {
    expect(buildLocalHud(PLAYERS, [], 'bren')).toMatchObject({
      name: 'bren',
      alive: true,
      bombCapacity: 1,
      availableBombs: 1,
      blastRadius: 2,
      speed: 4,
    });
  });

  it('spends a bomb while one own bomb is active', () => {
    const hud = buildLocalHud(PLAYERS, [bomb('bren')], 'bren');

    expect(hud.availableBombs).toBe(0);
  });

  it('ignores bombs owned by other players', () => {
    const hud = buildLocalHud(PLAYERS, [bomb('demo'), bomb('eduardo')], 'bren');

    expect(hud.availableBombs).toBe(1);
  });

  it('never reports negative availability', () => {
    const hud = buildLocalHud(
      PLAYERS,
      [bomb('bren', 3, 5), bomb('bren', 4, 5)],
      'bren'
    );

    expect(hud.availableBombs).toBe(0);
  });

  it('throws when the local player is missing', () => {
    expect(() => buildLocalHud(PLAYERS, [], 'nope')).toThrow(
      'Local player not found: nope'
    );
  });
});

describe('buildRivalHud', () => {
  it('excludes the local player', () => {
    const rivals = buildRivalHud(PLAYERS, 'bren');

    expect(rivals).toHaveLength(3);
    expect(rivals.map((rival) => rival.name)).not.toContain('bren');
  });

  it('caps at three rivals', () => {
    const five = [...PLAYERS, player('extra1'), player('extra2')];

    expect(buildRivalHud(five, 'bren')).toHaveLength(3);
  });

  it('carries the alive flag per rival', () => {
    const rivals = buildRivalHud(
      [player('bren'), player('eduardo', { alive: false })],
      'bren'
    );

    expect(rivals).toEqual([{ name: 'eduardo', alive: false }]);
  });
});

describe('countAlivePlayers', () => {
  it('counts only alive players', () => {
    const players = [
      player('bren'),
      player('eduardo', { alive: false }),
      player('oliver'),
      player('raul'),
    ];

    expect(countAlivePlayers(players)).toBe(3);
  });
});

describe('remainingMatchMs', () => {
  it('counts down from the match duration', () => {
    expect(remainingMatchMs(15_000)).toBe(165_000);
  });

  it('clamps at zero', () => {
    expect(remainingMatchMs(999_999)).toBe(0);
  });
});

describe('formatClock', () => {
  it('formats minutes and seconds', () => {
    expect(formatClock(165_000)).toBe('02:45');
    expect(formatClock(3_000)).toBe('00:03');
    expect(formatClock(65_400)).toBe('01:06');
  });

  it('clamps at zero instead of going negative', () => {
    expect(formatClock(-500)).toBe('00:00');
    expect(formatClock(0)).toBe('00:00');
  });
});

describe('buildHudModel', () => {
  it('combines local stats, rivals, remaining players and clock', () => {
    const model = buildHudModel(
      [
        player('bren'),
        player('eduardo', { alive: false }),
        player('oliver'),
        player('raul'),
      ],
      [bomb('bren')],
      'bren',
      15_000
    );

    expect(model.local).toMatchObject({
      name: 'bren',
      alive: true,
      availableBombs: 0,
    });
    expect(model.rivals).toHaveLength(3);
    expect(model.playersRemaining).toBe(3);
    expect(model.clockMs).toBe(165_000);
    expect(formatClock(model.clockMs)).toBe('02:45');
  });

  it('exposes map metadata from the options', () => {
    const map = [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ];

    const model = buildHudModel(PLAYERS, [], 'bren', 0, {
      map,
      mapId: 'KITCHEN',
      gameId: '42',
    });

    expect(model.mapWidth).toBe(4);
    expect(model.mapHeight).toBe(3);
    expect(model.mapId).toBe('KITCHEN');
    expect(model.gameId).toBe('42');
  });

  it('falls back to demo metadata without options', () => {
    const model = buildHudModel(PLAYERS, [], 'bren', 0);

    expect(model.mapWidth).toBe(0);
    expect(model.mapHeight).toBe(0);
    expect(model.mapId).toBe('MAP1');
    expect(model.gameId).toBe('demo');
  });
});
