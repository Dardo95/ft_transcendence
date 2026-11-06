import type {
  BombSnapshot,
  ExplosionSnapshot,
  Position,
} from '@transcendence/shared';

const FUSE_MS = 2500;
const EXPLOSION_MS = 500;
const PAUSE_MS = 500;
const CYCLE_MS = FUSE_MS + EXPLOSION_MS + PAUSE_MS;

interface DemoSpot {
  bomb: Position;
  cells: Position[];
}

// Casillas libres del testMap (sin muros ni cajas) con su explosión en cruz.
const SPOTS: readonly DemoSpot[] = [
  {
    bomb: { x: 10, y: 1 },
    cells: [
      { x: 10, y: 1 },
      { x: 9, y: 1 },
      { x: 11, y: 1 },
      { x: 10, y: 2 },
    ],
  },
  {
    bomb: { x: 3, y: 5 },
    cells: [
      { x: 3, y: 5 },
      { x: 2, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 4 },
      { x: 3, y: 6 },
    ],
  },
  {
    bomb: { x: 16, y: 8 },
    cells: [
      { x: 16, y: 8 },
      { x: 15, y: 8 },
      { x: 17, y: 8 },
      { x: 16, y: 7 },
      { x: 16, y: 9 },
    ],
  },
];

export interface DemoBombState {
  bombs: BombSnapshot[];
  explosions: ExplosionSnapshot[];
}

/**
 * Estado demo de bombas en bucle, en el mismo dominio de tiempo
 * que reciba `nowMs` (el reloj local de la escena).
 *
 * Ciclo por posición: mecha -> explosión -> pausa -> siguiente.
 */
export function demoBombStateAt(nowMs: number): DemoBombState {
  const cycleIndex = Math.floor(nowMs / CYCLE_MS);
  const phase = nowMs - cycleIndex * CYCLE_MS;
  const spot = SPOTS[cycleIndex % SPOTS.length];

  if (phase < FUSE_MS) {
    const detonateAt = cycleIndex * CYCLE_MS + FUSE_MS;

    return {
      bombs: [
        {
          id: `demo-bomb-${cycleIndex}`,
          ownerId: 'demo',
          position: spot.bomb,
          detonateAt,
          blastRadius: 2,
        },
      ],
      explosions: [],
    };
  }

  if (phase < FUSE_MS + EXPLOSION_MS) {
    return {
      bombs: [],
      explosions: [
        {
          id: `demo-explosion-${cycleIndex}`,
          cells: spot.cells,
          expiresAt: cycleIndex * CYCLE_MS + FUSE_MS + EXPLOSION_MS,
        },
      ],
    };
  }

  return { bombs: [], explosions: [] };
}
