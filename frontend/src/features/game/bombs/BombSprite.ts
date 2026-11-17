import type { BombSnapshot } from '@transcendence/shared';
import { Container, Sprite, type Texture } from 'pixi.js';

import { TILE_SIZE } from '../map/TileMap';

const MIN_FUSE_MS = 1;
const BASE_PULSE_HZ = 2;
const MAX_PULSE_HZ = 10;
const BASE_PULSE_SCALE = 0.06;
const MAX_PULSE_SCALE = 0.16;
const WHITE_TINT = 0xffffff;
const RED_TINT = 0xff4433;
const RED_FROM_RATIO = 0.4;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function lerpTint(from: number, to: number, t: number): number {
  const channel = (shift: number): number => {
    const a = (from >> shift) & 0xff;
    const b = (to >> shift) & 0xff;
    return Math.round(a + (b - a) * t);
  };

  return (channel(16) << 16) | (channel(8) << 8) | channel(0);
}

export class BombSprite extends Container {
  readonly bombId: string;

  private readonly body: Sprite;

  private detonateAt = 0;
  private fuseWindowMs = 0;
  private hasFuseWindow = false;
  private lastNowMs: number | null = null;
  private phase = 0;

  constructor(bomb: BombSnapshot, texture: Texture) {
    super();

    this.bombId = bomb.id;

    this.body = new Sprite(texture);
    this.body.anchor.set(0.5);
    this.body.width = TILE_SIZE;
    this.body.height = TILE_SIZE;
    this.body.roundPixels = true;

    this.addChild(this.body);
    this.setBomb(bomb);
  }

  setBomb(bomb: BombSnapshot): void {
    this.position.set(
      (bomb.position.x + 0.5) * TILE_SIZE,
      (bomb.position.y + 0.5) * TILE_SIZE
    );

    if (bomb.detonateAt !== this.detonateAt) {
      this.detonateAt = bomb.detonateAt;
      this.fuseWindowMs = 0;
      this.hasFuseWindow = false;
      this.lastNowMs = null;
      this.phase = 0;
    }
  }

  update(nowMs: number): void {
    if (!this.hasFuseWindow) {
      // Ventana de mecha observada en el primer frame: evita
      // asumir una duración fija y funciona con cualquier fusible.
      this.fuseWindowMs = Math.max(this.detonateAt - nowMs, MIN_FUSE_MS);
      this.hasFuseWindow = true;
    }

    const deltaMs = this.lastNowMs === null ? 0 : nowMs - this.lastNowMs;
    this.lastNowMs = nowMs;

    const remainingMs = this.detonateAt - nowMs;
    const ratio = clamp01(remainingMs / this.fuseWindowMs);
    const urgency = 1 - ratio;

    const hertz = BASE_PULSE_HZ + (MAX_PULSE_HZ - BASE_PULSE_HZ) * urgency;
    this.phase = (this.phase + (deltaMs * hertz) / 1000) % 1;

    const pulse = 0.5 + 0.5 * Math.sin(this.phase * Math.PI * 2);
    const amplitude =
      BASE_PULSE_SCALE + (MAX_PULSE_SCALE - BASE_PULSE_SCALE) * urgency;

    this.body.scale.set(1 + amplitude * pulse);

    const redT = clamp01((RED_FROM_RATIO - ratio) / RED_FROM_RATIO);
    this.body.tint = lerpTint(WHITE_TINT, RED_TINT, redT);
  }
}
