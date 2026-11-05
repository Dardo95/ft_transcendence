import type { ExplosionSnapshot } from '@transcendence/shared';
import { Container, Sprite } from 'pixi.js';

import { TILE_SIZE } from '../map/TileMap';
import {
  classifyExplosionCells,
  type ExplosionCellKind,
} from './explosionCells';
import type { FxTextureMap, FxTextureName } from './textures';

const MIN_DURATION_MS = 1;
const POP_MS = 120;
const FULL_ALPHA_RATIO = 0.5;

const TEXTURE_BY_KIND: Record<ExplosionCellKind, FxTextureName> = {
  center: 'explosionCenter',
  horizontal: 'explosionHorizontal',
  vertical: 'explosionVertical',
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export class ExplosionView extends Container {
  readonly explosionId: string;

  private readonly cellSprites: Sprite[] = [];

  private expiresAt = 0;
  private durationMs = 0;
  private hasDuration = false;

  constructor(explosion: ExplosionSnapshot, textures: FxTextureMap) {
    super();

    this.explosionId = explosion.id;

    for (const cell of classifyExplosionCells(explosion.cells)) {
      const texture = textures[TEXTURE_BY_KIND[cell.kind]];

      if (!texture) {
        continue;
      }

      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      sprite.width = TILE_SIZE;
      sprite.height = TILE_SIZE;
      sprite.roundPixels = true;
      sprite.position.set(
        (cell.x + 0.5) * TILE_SIZE,
        (cell.y + 0.5) * TILE_SIZE
      );

      this.cellSprites.push(sprite);
      this.addChild(sprite);
    }

    this.setExplosion(explosion);
  }

  setExplosion(explosion: ExplosionSnapshot): void {
    if (explosion.expiresAt !== this.expiresAt) {
      this.expiresAt = explosion.expiresAt;
      this.durationMs = 0;
      this.hasDuration = false;
    }
  }

  isExpired(nowMs: number): boolean {
    return nowMs >= this.expiresAt;
  }

  update(nowMs: number): void {
    if (!this.hasDuration) {
      // Duración observada en el primer frame, igual que la mecha
      // de la bomba: no asume los 500 ms del backend.
      this.durationMs = Math.max(this.expiresAt - nowMs, MIN_DURATION_MS);
      this.hasDuration = true;
    }

    const remainingMs = this.expiresAt - nowMs;
    const ratio = clamp01(remainingMs / this.durationMs);
    const elapsedMs = this.durationMs - remainingMs;
    const pop = 0.7 + 0.3 * clamp01(elapsedMs / POP_MS);
    const alpha = clamp01(remainingMs / (this.durationMs * FULL_ALPHA_RATIO));

    this.alpha = alpha;

    for (const sprite of this.cellSprites) {
      sprite.scale.set(pop);
    }

    void ratio;
  }
}
