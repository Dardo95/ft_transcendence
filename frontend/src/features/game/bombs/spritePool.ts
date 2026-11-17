import { Sprite, Texture } from 'pixi.js';

import { ObjectPool } from '../lib/pool';

/**
 * Pool de sprites para efectos de corta vida (explosiones): se
 * reciclan en vez de crear/destruir uno por bomba. Los sprites
 * se reconfiguran por completo al sacarlos del pool.
 */
export const spritePool = new ObjectPool<Sprite>(
  () => new Sprite(),
  (sprite) => {
    sprite.texture = Texture.EMPTY;
    sprite.position.set(0, 0);
    sprite.scale.set(1);
    sprite.alpha = 1;
    sprite.visible = true;
  }
);
