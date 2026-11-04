import { Assets, type Texture } from 'pixi.js';

import { PLAYER_COLORS, type PlayerColor } from './types';

export const PLAYER_TEXTURES: Record<PlayerColor, string> = {
  blue: '/game/characters/char_blue_spritesheet.png',
  green: '/game/characters/char_green_spritesheet.png',
  red: '/game/characters/char_red_spritesheet.png',
  yellow: '/game/characters/char_yellow_spritesheet.png',
};

export type PlayerTextureMap = Partial<Record<PlayerColor, Texture>>;

export async function loadPlayerTextures(): Promise<PlayerTextureMap> {
  const results = await Promise.allSettled(
    PLAYER_COLORS.map(async (color) => {
      const texture = await Assets.load<Texture>(PLAYER_TEXTURES[color]);

      texture.source.scaleMode = 'nearest';
      texture.source.autoGenerateMipmaps = false;

      return [color, texture] as const;
    })
  );

  const textures: PlayerTextureMap = {};

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const [color, texture] = result.value;
      textures[color] = texture;
    } else {
      console.error('[players] Failed to load player texture:', result.reason);
    }
  }

  return textures;
}
