export const TileType = {
  EMPTY: 0,
  FLOOR: 1,
  WALL: 2,
  BLOCK: 3,
  TABLE: 4,
} as const;

export type TileType = (typeof TileType)[keyof typeof TileType];
