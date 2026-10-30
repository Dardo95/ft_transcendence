import { Assets, Container, Sprite, Texture } from 'pixi.js';
import { getTileTexture, TILE_SIZE } from '../map/TileMap';

export class GameScene extends Container {
  private floorLayer = new Container();
  private blockLayer = new Container();
  private wallLayer = new Container();
  private tableLayer = new Container();
  private map: number[][];

  constructor(map: number[][]) {
    super();
    this.map = map;

    this.addChild(this.floorLayer);
    this.addChild(this.blockLayer);
    this.addChild(this.tableLayer);
    this.addChild(this.wallLayer);

    void this.init();
  }

  private async init() {
    try {
      const sheet = await Assets.load('/game/atlas/tileset.json');

      const textures = sheet.textures as Record<string, Texture>;
      for (const key in textures) {
        const texture = textures[key];
        if (texture?.source) {
          texture.source.scaleMode = 'nearest';
          texture.source.autoGenerateMipmaps = false;
        }
      }

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

        if (!textureName) {
          continue;
        }

        const sprite = Sprite.from(textureName);
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
