import { describe, expect, it } from 'vitest';

import { toServerMatchmakingRequest } from './matchmakingRequest';

const settings = { initialBombs: 1, initialSpeed: 1, fuseTime: 3 };

describe('toServerMatchmakingRequest', () => {
  it('maps practice to the server protocol', () => {
    expect(
      toServerMatchmakingRequest({ mode: 'practice', mapId: 'map2', settings })
    ).toEqual({ mode: 'PRACTICE', mapId: 'map2', settings });
  });

  it('maps private and public modes', () => {
    expect(
      toServerMatchmakingRequest({ mode: 'private', mapId: 'map1', settings })
        .mode
    ).toBe('PRIVATE');
    expect(
      toServerMatchmakingRequest({ mode: 'public', mapId: 'map1', settings })
        .mode
    ).toBe('PUBLIC');
  });
});
