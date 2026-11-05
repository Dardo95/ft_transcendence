import { Assets, type Texture } from 'pixi.js';

export const FX_TEXTURES = {
  bomb: '/game/fx/bomb_pressure_cooker.png',
  explosionCenter: '/game/fx/explosion_center.png',
  explosionHorizontal: '/game/fx/explosion_horizontal.png',
  explosionVertical: '/game/fx/explosion_vertical.png',
} as const;

export type FxTextureName = keyof typeof FX_TEXTURES;
export type FxTextureMap = Partial<Record<FxTextureName, Texture>>;

export async function loadFxTextures(): Promise<FxTextureMap> {
  const results = await Promise.allSettled(
    Object.entries(FX_TEXTURES).map(async ([name, url]) => {
      const texture = await Assets.load<Texture>(url);

      texture.source.scaleMode = 'nearest';
      texture.source.autoGenerateMipmaps = false;

      return [name, texture] as const;
    })
  );

  const textures: FxTextureMap = {};

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const [name, texture] = result.value;
      textures[name as FxTextureName] = texture;
    } else {
      console.error('[bombs] Failed to load fx texture:', result.reason);
    }
  }

  return textures;
}
