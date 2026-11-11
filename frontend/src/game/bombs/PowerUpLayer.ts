import type { PowerUpSnapshot } from '@transcendence/shared';
import { Container, Sprite } from 'pixi.js';

import { TILE_SIZE } from '../map/TileMap';
import { powerUpTextureName } from './powerUpTexture';
import type { FxTextureMap } from './textures';

/**
 * Capa de power-ups en el suelo. Dif por id: el backend los
 * elimina del snapshot al recogerlos, así que desaparecen solos.
 */
export class PowerUpLayer extends Container {
  private readonly sprites = new Map<string, Sprite>();

  private textures: FxTextureMap = {};

  setTextures(textures: FxTextureMap): void {
    this.textures = textures;
  }

  setPowerUps(powerUps: readonly PowerUpSnapshot[]): void {
    const currentIds = new Set(powerUps.map((powerUp) => powerUp.id));

    for (const [id, sprite] of this.sprites) {
      if (currentIds.has(id)) {
        continue;
      }

      this.removeChild(sprite);
      sprite.destroy({ children: true });
      this.sprites.delete(id);
    }

    for (const powerUp of powerUps) {
      if (this.sprites.has(powerUp.id)) {
        continue;
      }

      const textureName = powerUpTextureName(powerUp.type);
      const texture = textureName ? this.textures[textureName] : null;

      if (!texture) {
        continue;
      }

      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      sprite.width = TILE_SIZE;
      sprite.height = TILE_SIZE;
      sprite.roundPixels = true;
      sprite.position.set(
        (powerUp.position.x + 0.5) * TILE_SIZE,
        (powerUp.position.y + 0.5) * TILE_SIZE
      );

      this.sprites.set(powerUp.id, sprite);
      this.addChild(sprite);
    }
  }
}
