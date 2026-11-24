import { describe, expect, it } from 'vitest';

import { testMap } from '../map/TileMap';
import { TileType } from '../map/types';
import { demoPlayers } from './demoPlayers';

describe('demoPlayers', () => {
  it('places Eduardo and Raul on map floor tiles', () => {
    for (const id of ['eduardo', 'raul']) {
      const player = demoPlayers.find((candidate) => candidate.id === id);

      expect(player).toBeDefined();

      const tileX = Math.floor(player!.position.x);
      const tileY = Math.floor(player!.position.y);

      expect(testMap[tileY]?.[tileX]).toBe(TileType.FLOOR);
    }
  });
});
