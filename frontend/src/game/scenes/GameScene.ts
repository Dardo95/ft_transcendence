import type {
  BombSnapshot,
  ExplosionSnapshot,
  GamePlayerSnapshot,
} from '@transcendence/shared';
import { Assets, Container, Sprite, Texture } from 'pixi.js';

import { BombLayer } from '../bombs/BombLayer';
import { ExplosionLayer } from '../bombs/ExplosionLayer';
import { loadFxTextures } from '../bombs/textures';
import { getTileTexture, TILE_SIZE } from '../map/TileMap';
import { PlayerLayer } from '../players/PlayerLayer';
import { loadPlayerTextures } from '../players/textures';

export class GameScene extends Container {
  private floorLayer = new Container();
  private blockLayer = new Container();
  private wallLayer = new Container();
  private tableLayer = new Container();
  private bombLayer = new BombLayer();
  private playerLayer = new PlayerLayer();
  private explosionLayer = new ExplosionLayer();

  private map: number[][];
  private players: readonly GamePlayerSnapshot[];
  private bombs: readonly BombSnapshot[] = [];
  private explosions: readonly ExplosionSnapshot[] = [];
  private nowMs = 0;

  constructor(map: number[][], players: readonly GamePlayerSnapshot[] = []) {
    super();

    this.map = map;
    this.players = players;

    this.addChild(this.floorLayer);
    this.addChild(this.blockLayer);
    this.addChild(this.tableLayer);
    this.addChild(this.wallLayer);
    this.addChild(this.bombLayer);
    this.addChild(this.playerLayer);
    this.addChild(this.explosionLayer);

    void this.init();
  }

  get timeMs(): number {
    return this.nowMs;
  }

  setPlayers(players: readonly GamePlayerSnapshot[]): void {
    this.players = players;
    this.playerLayer.setPlayers(players);
  }

  setBombs(bombs: readonly BombSnapshot[]): void {
    this.bombs = bombs;
    this.bombLayer.setBombs(bombs);
  }

  setExplosions(explosions: readonly ExplosionSnapshot[]): void {
    this.explosions = explosions;
    this.explosionLayer.setExplosions(explosions);
  }

  setLabelsVisible(visible: boolean): void {
    this.playerLayer.setLabelsVisible(visible);
  }

  update(deltaMs: number): void {
    this.nowMs += deltaMs;

    this.playerLayer.update(deltaMs);
    this.bombLayer.update(this.nowMs);
    this.explosionLayer.update(this.nowMs);
  }

  private async init(): Promise<void> {
    try {
      const [sheet, playerTextures, fxTextures] = await Promise.all([
        Assets.load('/game/atlas/tileset.json'),
        loadPlayerTextures(),
        loadFxTextures(),
      ]);

      const atlas = sheet.textures as Record<string, Texture>;

      for (const key in atlas) {
        const texture = atlas[key];

        if (texture?.source) {
          texture.source.scaleMode = 'nearest';
          texture.source.autoGenerateMipmaps = false;
        }
      }

      this.playerLayer.setTextures(playerTextures);
      this.playerLayer.setPlayers(this.players);
      this.bombLayer.setTextures(fxTextures);
      this.explosionLayer.setTextures(fxTextures);
      this.setBombs(this.bombs);
      this.setExplosions(this.explosions);
      this.buildMap();
    } catch (error) {
      console.error('[GameScene] Failed to load assets:', error);
    }
  }

  private buildMap(): void {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tile = this.map[y][x];
        const textureName = getTileTexture(tile);

        if (!textureName) {
          continue;
        }

        const sprite = Sprite.from(textureName);
        sprite.roundPixels = true;
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;

        if (sprite.texture?.source) {
          sprite.texture.source.scaleMode = 'nearest';
        }

        sprite.x = Math.round(x * TILE_SIZE);
        sprite.y = Math.round(y * TILE_SIZE);

        if (tile === 1) {
          this.floorLayer.addChild(sprite);
        } else if (tile === 2) {
          this.wallLayer.addChild(sprite);
        } else if (tile === 3) {
          this.blockLayer.addChild(sprite);
        } else if (tile === 4) {
          this.tableLayer.addChild(sprite);
        } else {
          this.floorLayer.addChild(sprite);
        }
      }
    }
  }
}
