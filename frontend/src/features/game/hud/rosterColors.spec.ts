import { describe, expect, it } from 'vitest';

import { PLAYER_COLORS } from '../players/types';
import { assignRosterColors, PLAYER_COLOR_CLASSES } from './rosterColors';

describe('assignRosterColors', () => {
  it('assigns the first free color in appearance order', () => {
    const roster = assignRosterColors([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);

    expect(roster.map((entry) => entry.color)).toEqual([
      'blue',
      'green',
      'red',
    ]);
  });

  it('wraps to the first color when there are more players than colors', () => {
    const roster = assignRosterColors([
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
      { id: 'e' },
    ]);

    expect(roster[4].color).toBe(PLAYER_COLORS[0]);
  });

  it('preserves the original entry fields', () => {
    const roster = assignRosterColors([{ id: 'a', alive: true }]);

    expect(roster[0]).toEqual({ id: 'a', alive: true, color: 'blue' });
  });

  it('does not mutate the input array', () => {
    const entries = [{ id: 'a' }, { id: 'b' }];
    assignRosterColors(entries);

    expect(entries).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('defines a style class for every player color', () => {
    for (const color of PLAYER_COLORS) {
      expect(PLAYER_COLOR_CLASSES[color], color).toBeTruthy();
    }
  });
});
