import { Assets, Container, Sprite } from 'pixi.js';
import { getTileTexture, TILE_SIZE } from '../map/TileMap';

export class GameScene extends Container {
  private floorLayer = new Container();
  private blockLayer = new Container();
  private wallLayer = new Container();
  private map: number[][];

  constructor(map: number[][]) {
    super();
    this.map = map;

    this.addChild(this.floorLayer);
    this.addChild(this.blockLayer);
    this.addChild(this.wallLayer);

    void this.init();
  }

  private async init() {
    try {
      await Assets.load('/game/atlas/tileset.json');
      this.buildMap();
    } catch (error) {
      console.error('[GameScene] Failed to load tileset:', error);
    }
  }

  private buildMap() {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tile = this.map[y][x];
        const textureName = getTileTexture(tile);

        if (!textureName) continue;

        const sprite = Sprite.from(textureName);
        sprite.x = x * TILE_SIZE;
        sprite.y = y * TILE_SIZE;

        if (tile === 1) {
          this.floorLayer.addChild(sprite);
        } else if (tile === 2) {
          this.wallLayer.addChild(sprite);
        } else if (tile === 3) {
          this.blockLayer.addChild(sprite);
        }
      }
    }
  }
}
