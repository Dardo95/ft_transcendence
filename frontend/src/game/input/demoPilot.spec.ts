import type {
  ExplosionSnapshot,
  GamePlayerSnapshot,
} from '@transcendence/shared';
import { describe, expect, it } from 'vitest';

import { testMap } from '../map/TileMap';
import { FUSE_MS } from '../bombs/demoBombs';
import { DemoPilot } from './demoPilot';

function createPilot(
  x: number,
  y: number
): {
  pilot: DemoPilot;
  players: GamePlayerSnapshot[];
} {
  const players: GamePlayerSnapshot[] = [
    {
      id: 'bren',
      displayName: 'Bren',
      isBot: false,
      position: { x, y },
      alive: true,
      bombCapacity: 1,
      blastRadius: 2,
      speed: 4,
    },
  ];

  return { pilot: new DemoPilot(testMap, players, 'bren'), players };
}

describe('DemoPilot', () => {
  it('moves the local player with the held keys', () => {
    const { pilot, players } = createPilot(1.5, 1.5);

    pilot.setMovement({ up: false, down: false, left: false, right: true });
    // El delta se topa a 50 ms: 4 tiles/s * 0.05 s = 0.2 tiles.
    pilot.update(0, 100);

    expect(players[0].position.x).toBeCloseTo(1.7, 5);
    expect(pilot.consumeMoved()).toBe(true);
    expect(pilot.consumeMoved()).toBe(false);
  });

  it('does not move when no key is held', () => {
    const { pilot, players } = createPilot(1.5, 1.5);

    pilot.update(0, 100);

    expect(players[0].position.x).toBe(1.5);
    expect(pilot.consumeMoved()).toBe(false);
  });

  it('reports bomb list changes once per change', () => {
    const { pilot } = createPilot(1.5, 1.5);

    // Colocación.
    pilot.placeBomb();
    expect(pilot.consumeChanged()).toBe(true);
    expect(pilot.consumeChanged()).toBe(false);

    // Detonación al vencer la mecha (bomba → explosión).
    pilot.update(FUSE_MS + 1, 16);
    expect(pilot.consumeChanged()).toBe(true);
    expect(pilot.consumeChanged()).toBe(false);
  });

  it('normalizes diagonal speed like the backend', () => {
    const { pilot, players } = createPilot(11.5, 6.5);
    const startX = players[0].position.x;
    const startY = players[0].position.y;

    pilot.setMovement({ up: true, down: false, left: false, right: true });
    pilot.update(0, 100);

    const dx = players[0].position.x - startX;
    const dy = startY - players[0].position.y;

    // Delta topado a 50 ms: 4 * 0.05 = 0.2; en diagonal / sqrt(2).
    expect(dx).toBeCloseTo(0.2 * Math.SQRT1_2, 5);
    expect(dy).toBeCloseTo(0.2 * Math.SQRT1_2, 5);
  });

  it('stops at the border wall instead of leaving the map', () => {
    const { pilot, players } = createPilot(1.5, 1.5);

    pilot.setMovement({ up: false, down: false, left: true, right: false });

    for (let frame = 0; frame < 10; frame++) {
      pilot.update(frame * 16, 16);
    }

    expect(players[0].position.x).toBeGreaterThanOrEqual(1.4);
    expect(players[0].position.x).toBeLessThanOrEqual(1.5);
  });

  it('places one bomb at the player tile and respects capacity', () => {
    const { pilot } = createPilot(1.5, 1.5);

    pilot.placeBomb();
    pilot.placeBomb();

    expect(pilot.getBombs()).toHaveLength(1);
    expect(pilot.getBombs()[0]).toMatchObject({
      ownerId: 'bren',
      position: { x: 1, y: 1 },
      blastRadius: 2,
      detonateAt: 2500,
    });
  });

  it('detonates into a cross explosion and clears it after expiry', () => {
    const { pilot } = createPilot(1.5, 1.5);

    pilot.placeBomb();
    pilot.update(2500, 16);

    expect(pilot.getBombs()).toHaveLength(0);
    expect(pilot.getExplosions()).toHaveLength(1);
    expect(pilot.getExplosions()[0].cells).toContainEqual({ x: 1, y: 1 });
    expect(pilot.getExplosions()[0].cells).toContainEqual({ x: 3, y: 1 });
    expect(pilot.getExplosions()[0].cells).not.toContainEqual({ x: 0, y: 1 });

    pilot.update(3000, 16);
    expect(pilot.getExplosions()).toHaveLength(0);
  });

  it('frees the bomb slot after detonation', () => {
    const { pilot, players } = createPilot(1.5, 1.5);

    pilot.placeBomb();
    // Aleja a Bren de la explosión para que sobreviva.
    pilot.setMovement({ up: false, down: false, left: false, right: true });

    for (let frame = 1; frame <= 45; frame++) {
      pilot.update(frame * 16, 16);
    }

    pilot.setMovement({ up: false, down: false, left: false, right: false });
    pilot.update(2500, 16);

    expect(players[0].alive).toBe(true);

    pilot.placeBomb();

    expect(pilot.getBombs()).toHaveLength(1);
  });

  it('dies when its own explosion catches it', () => {
    const { pilot, players } = createPilot(1.5, 1.5);

    pilot.placeBomb();
    pilot.update(2500, 16);

    expect(players[0].alive).toBe(false);
    expect(pilot.consumeMoved()).toBe(true);
  });

  it('cannot move or bomb after death', () => {
    const { pilot, players } = createPilot(1.5, 1.5);

    pilot.placeBomb();
    pilot.update(2500, 16);

    const deadX = players[0].position.x;
    pilot.setMovement({ up: false, down: false, left: false, right: true });
    pilot.update(2600, 16);
    pilot.placeBomb();

    expect(players[0].position.x).toBe(deadX);
    expect(pilot.getBombs()).toHaveLength(0);
  });

  it('survives an external explosion on another tile', () => {
    const { pilot, players } = createPilot(1.5, 1.5);
    const fixtureExplosion: ExplosionSnapshot = {
      id: 'fixture',
      cells: [
        { x: 10, y: 1 },
        { x: 9, y: 1 },
        { x: 11, y: 1 },
      ],
      expiresAt: 3000,
    };

    pilot.update(2600, 16, [fixtureExplosion]);

    expect(players[0].alive).toBe(true);
  });

  it('dies standing on an external fixture explosion', () => {
    const { pilot, players } = createPilot(1.5, 1.5);
    const fixtureExplosion: ExplosionSnapshot = {
      id: 'fixture',
      cells: [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      expiresAt: 3000,
    };

    pilot.update(2600, 16, [fixtureExplosion]);

    expect(players[0].alive).toBe(false);
  });
});
