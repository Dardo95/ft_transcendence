import type { ExplosionSnapshot } from '@transcendence/shared';
import { Container } from 'pixi.js';

import { ExplosionView } from './ExplosionView';
import type { FxTextureMap } from './textures';

export class ExplosionLayer extends Container {
  private readonly views = new Map<string, ExplosionView>();

  private textures: FxTextureMap = {};

  setTextures(textures: FxTextureMap): void {
    this.textures = textures;
  }

  setExplosions(explosions: readonly ExplosionSnapshot[]): void {
    const currentIds = new Set(explosions.map((explosion) => explosion.id));

    for (const [id, view] of this.views) {
      if (currentIds.has(id)) {
        continue;
      }

      this.removeChild(view);
      view.destroy({ children: true });
      this.views.delete(id);
    }

    for (const explosion of explosions) {
      const existing = this.views.get(explosion.id);

      if (existing) {
        existing.setExplosion(explosion);
        continue;
      }

      const view = new ExplosionView(explosion, this.textures);
      this.views.set(explosion.id, view);
      this.addChild(view);
    }
  }

  update(nowMs: number): void {
    for (const [id, view] of this.views) {
      view.update(nowMs);

      if (view.isExpired(nowMs)) {
        this.removeChild(view);
        view.destroy({ children: true });
        this.views.delete(id);
      }
    }
  }
}
