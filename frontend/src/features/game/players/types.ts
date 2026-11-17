import type { GamePlayerSnapshot } from '@transcendence/shared';

export const PLAYER_COLORS = ['blue', 'green', 'red', 'yellow'] as const;

export type PlayerColor = (typeof PLAYER_COLORS)[number];

const LABEL_FALLBACK_LENGTH = 8;

export function getPlayerLabel(
  player: Pick<GamePlayerSnapshot, 'id' | 'displayName'>
): string {
  const name = player.displayName?.trim();

  if (name) {
    return name;
  }

  return player.id.slice(0, LABEL_FALLBACK_LENGTH);
}
