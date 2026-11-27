import type { BombSnapshot, GamePlayerSnapshot } from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import {
  buildHudModel,
  buildLocalHud,
  buildRivalHud,
  countAlivePlayers,
  formatClock,
  formatMatchClock,
  remainingMatchMs,
  showFinalSecondsAlert,
  showSuddenDeathAlert,
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
      id: 'bren',
      name: 'bren',
      isBot: false,
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

    expect(rivals).toEqual([
      { id: 'eduardo', name: 'eduardo', isBot: false, alive: false },
    ]);
  });

  it('preserves the bot identity', () => {
    const bot = player('practice:bot', { displayName: 'Bot', isBot: true });

    expect(buildRivalHud([player('bren'), bot], 'bren')).toEqual([
      { id: 'practice:bot', name: 'Bot', isBot: true, alive: true },
    ]);
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
      id: 'bren',
      name: 'bren',
      isBot: false,
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

  it('builds a neutral spectator model with null local and full player stats', () => {
    const model = buildHudModel(PLAYERS, [bomb('bren')], null, 15_000, {
      mapWidth: 13,
      mapHeight: 11,
      mapId: 'KITCHEN',
      gameId: 'match-7',
    });

    expect(model.local).toBeNull();
    expect(model.rivals).toHaveLength(4);
    expect(model.players).toHaveLength(4);
    expect(model.players[0]).toMatchObject({
      id: 'bren',
      availableBombs: 0,
      blastRadius: 2,
      speed: 4,
    });
    expect(model.mapWidth).toBe(13);
    expect(model.mapHeight).toBe(11);
    expect(model.mapId).toBe('KITCHEN');
    expect(model.gameId).toBe('match-7');
  });
});

describe('overtime clock', () => {
  it('counts elapsed overtime from the regular match duration', () => {
    const model = buildHudModel(PLAYERS, [], 'bren', 185_000, {
      isOvertime: true,
    });

    expect(model.isOvertime).toBe(true);
    expect(model.clockMs).toBe(0);
    expect(model.overtimeElapsedMs).toBe(5_000);
    expect(formatClock(model.overtimeElapsedMs)).toBe('00:05');
  });

  it('does not show overtime for a regular match', () => {
    const model = buildHudModel(PLAYERS, [], 'bren', 15_000);

    expect(model.isOvertime).toBe(false);
    expect(model.overtimeElapsedMs).toBe(0);
  });
});

describe('formatMatchClock', () => {
  it('shows the regular clock before overtime', () => {
    const model = buildHudModel(PLAYERS, [], 'bren', 65_000);

    expect(formatMatchClock(model)).toBe('01:55');
  });

  it('prefixes the overtime clock with a plus sign', () => {
    const model = buildHudModel(PLAYERS, [], 'bren', 185_000, {
      isOvertime: true,
    });

    expect(formatMatchClock(model)).toBe('+00:05');
  });
});

describe('showSuddenDeathAlert', () => {
  it('stays hidden while the regular clock runs', () => {
    const model = buildHudModel(PLAYERS, [], 'bren', 170_000);

    expect(showSuddenDeathAlert(model)).toBe(false);
  });

  it('is visible from zero until the five second window elapses', () => {
    const atZero = buildHudModel(PLAYERS, [], 'bren', 180_000, {
      isOvertime: true,
    });
    const almostOver = buildHudModel(PLAYERS, [], 'bren', 184_999, {
      isOvertime: true,
    });

    expect(showSuddenDeathAlert(atZero)).toBe(true);
    expect(showSuddenDeathAlert(almostOver)).toBe(true);
  });

  it('hides once the alert window elapses', () => {
    const model = buildHudModel(PLAYERS, [], 'bren', 185_000, {
      isOvertime: true,
    });

    expect(showSuddenDeathAlert(model)).toBe(false);
  });
});

describe('showFinalSecondsAlert', () => {
  it('stays hidden with more than twenty seconds left', () => {
    const model = buildHudModel(PLAYERS, [], 'bren', 159_000);

    expect(showFinalSecondsAlert(model)).toBe(false);
  });

  it('is visible from the twenty second mark for five seconds', () => {
    const opening = buildHudModel(PLAYERS, [], 'bren', 160_000);
    const nearClose = buildHudModel(PLAYERS, [], 'bren', 164_000);

    expect(showFinalSecondsAlert(opening)).toBe(true);
    expect(showFinalSecondsAlert(nearClose)).toBe(true);
  });

  it('hides after its five second window', () => {
    const windowClosed = buildHudModel(PLAYERS, [], 'bren', 165_000);
    const oneLeft = buildHudModel(PLAYERS, [], 'bren', 179_000);

    expect(showFinalSecondsAlert(windowClosed)).toBe(false);
    expect(showFinalSecondsAlert(oneLeft)).toBe(false);
  });

  it('hides at zero and during overtime', () => {
    const atZero = buildHudModel(PLAYERS, [], 'bren', 180_000);
    const overtime = buildHudModel(PLAYERS, [], 'bren', 180_000, {
      isOvertime: true,
    });

    expect(showFinalSecondsAlert(atZero)).toBe(false);
    expect(showFinalSecondsAlert(overtime)).toBe(false);
  });
});
