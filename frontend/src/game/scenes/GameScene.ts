import type { GamePlayerSnapshot } from '@transcendence/shared';
import { Assets, Container, Sprite, Texture } from 'pixi.js';

import { getTileTexture, TILE_SIZE } from '../map/TileMap';
import { PlayerLayer } from '../players/PlayerLayer';
import { loadPlayerTextures } from '../players/textures';

export class GameScene extends Container {
  private floorLayer = new Container();
  private blockLayer = new Container();
  private wallLayer = new Container();
  private tableLayer = new Container();
  private playerLayer = new PlayerLayer();

  private map: number[][];
  private players: readonly GamePlayerSnapshot[];

  constructor(map: number[][], players: readonly GamePlayerSnapshot[] = []) {
    super();

    this.map = map;
    this.players = players;

    this.addChild(this.floorLayer);
    this.addChild(this.blockLayer);
    this.addChild(this.tableLayer);
    this.addChild(this.wallLayer);
    this.addChild(this.playerLayer);

    void this.init();
  }

  setPlayers(players: readonly GamePlayerSnapshot[]): void {
    this.players = players;
    this.playerLayer.setPlayers(players);
  }

  setLabelsVisible(visible: boolean): void {
    this.playerLayer.setLabelsVisible(visible);
  }

  update(deltaMs: number): void {
    this.playerLayer.update(deltaMs);
  }

  private async init(): Promise<void> {
    try {
      const [sheet, textures] = await Promise.all([
        Assets.load('/game/atlas/tileset.json'),
        loadPlayerTextures(),
      ]);

      const atlas = sheet.textures as Record<string, Texture>;

      for (const key in atlas) {
        const texture = atlas[key];

        if (texture?.source) {
          texture.source.scaleMode = 'nearest';
          texture.source.autoGenerateMipmaps = false;
        }
      }

      this.playerLayer.setTextures(textures);
      this.playerLayer.setPlayers(this.players);
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
