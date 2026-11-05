import type { BombSnapshot } from '@transcendence/shared';
import { Container } from 'pixi.js';

import { BombSprite } from './BombSprite';
import type { FxTextureMap } from './textures';

export class BombLayer extends Container {
  private readonly sprites = new Map<string, BombSprite>();

  private textures: FxTextureMap = {};

  setTextures(textures: FxTextureMap): void {
    this.textures = textures;
  }

  setBombs(bombs: readonly BombSnapshot[]): void {
    const currentIds = new Set(bombs.map((bomb) => bomb.id));

    for (const [id, sprite] of this.sprites) {
      if (currentIds.has(id)) {
        continue;
      }

      this.removeChild(sprite);
      sprite.destroy({ children: true });
      this.sprites.delete(id);
    }

    for (const bomb of bombs) {
      const existing = this.sprites.get(bomb.id);

      if (existing) {
        existing.setBomb(bomb);
        continue;
      }

      const texture = this.textures.bomb;

      if (!texture) {
        continue;
      }

      const sprite = new BombSprite(bomb, texture);
      this.sprites.set(bomb.id, sprite);
      this.addChild(sprite);
    }
  }

  update(nowMs: number): void {
    for (const sprite of this.sprites.values()) {
      sprite.update(nowMs);
    }
  }
}
