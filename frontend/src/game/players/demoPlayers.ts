import type { GamePlayerSnapshot } from '@transcendence/shared';

const DEFAULT_STATS = {
  isBot: false,
  alive: true,
  bombCapacity: 1,
  blastRadius: 2,
  speed: 4,
} as const;

export const demoPlayers: readonly GamePlayerSnapshot[] = [
  {
    id: 'bren',
    displayName: 'Bren',
    position: { x: 1.5, y: 1.5 },
    ...DEFAULT_STATS,
  },
  {
    id: 'eduardo',
    displayName: 'Eduardo',
    position: { x: 19.5, y: 1.5 },
    ...DEFAULT_STATS,
  },
  {
    id: 'oliver',
    displayName: 'Oliver',
    position: { x: 1.5, y: 10.5 },
    ...DEFAULT_STATS,
  },
  {
    id: 'raul',
    displayName: 'Raúl',
    position: { x: 19.5, y: 8.5 },
    ...DEFAULT_STATS,
  },
];
