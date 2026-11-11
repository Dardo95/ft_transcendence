import type {
  BombSnapshot,
  ExplosionSnapshot,
  GamePlayerSnapshot,
} from '@transcendence/shared';
import { Assets, Container, Sprite, Texture } from 'pixi.js';

import { BombLayer } from '../bombs/BombLayer';
import { ExplosionLayer } from '../bombs/ExplosionLayer';
import { loadFxTextures } from '../bombs/textures';
import { sameBoard } from '../map/boardConversion';
import { getTileTexture, TILE_SIZE } from '../map/TileMap';
import { TileType } from '../map/types';
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
  // true cuando `buildMap` ya pintó el tablero: hasta entonces
  // `setTiles` solo guarda el mapa para que `init()` lo use.
  private mapBuilt = false;
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

  /**
   * Aplica el tablero autoritativo del servidor. Los snapshots
   * llegan a 20 Hz, así que:
   * - Si el mapa no cambia (`sameBoard`), no se hace nada.
   * - Si cambia, solo se repinta la capa de cajas: el piso, los
   *   muros y las mesas nunca cambian, y el suelo ya está pintado
   *   debajo de cada caja, así que al eliminarla queda el piso.
   * - Si el atlas aún no cargó, `init()` construirá este mapa.
   */
  setTiles(map: number[][]): void {
    if (sameBoard(this.map, map)) {
      return;
    }

    const sizeChanged =
      map.length !== this.map.length || map[0]?.length !== this.map[0]?.length;

    this.map = map;

    if (!this.mapBuilt) {
      return;
    }

    if (sizeChanged) {
      // Caso teórico: el backend no cambia las dimensiones del
      // tablero en una partida. Si llegara a pasar, se repinta
      // entero en vez de dejar sprites fuera del nuevo tamaño.
      this.clearLayer(this.floorLayer);
      this.clearLayer(this.blockLayer);
      this.clearLayer(this.wallLayer);
      this.clearLayer(this.tableLayer);
      this.buildMap();
      return;
    }

    this.rebuildBlocks();
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

        // El piso se pinta siempre debajo de las cajas: cuando
        // una explosión la elimine, quedará el suelo y no un
        // hueco en el tablero.
        if (tile === TileType.BLOCK) {
          const floor = this.createTileSprite(TileType.FLOOR, x, y);

          if (floor) {
            this.floorLayer.addChild(floor);
          }
        }

        const sprite = this.createTileSprite(tile, x, y);

        if (!sprite) {
          continue;
        }

        if (tile === TileType.FLOOR) {
          this.floorLayer.addChild(sprite);
        } else if (tile === TileType.WALL) {
          this.wallLayer.addChild(sprite);
        } else if (tile === TileType.BLOCK) {
          this.blockLayer.addChild(sprite);
        } else if (tile === TileType.TABLE) {
          this.tableLayer.addChild(sprite);
        } else {
          this.floorLayer.addChild(sprite);
        }
      }
    }

    this.mapBuilt = true;
  }

  /**
   * Repinta solo la capa de cajas con el mapa actual: es el
   * único contenido que cambia durante la partida. Piso, muros
   * y mesas se quedan como están.
   */
  private rebuildBlocks(): void {
    this.clearLayer(this.blockLayer);

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] !== TileType.BLOCK) {
          continue;
        }

        const sprite = this.createTileSprite(TileType.BLOCK, x, y);

        if (sprite) {
          this.blockLayer.addChild(sprite);
        }
      }
    }
  }

  private clearLayer(layer: Container): void {
    // `destroy({ children: true })` no destruye las texturas
    // (compartidas del atlas), igual que en BombLayer/PlayerLayer.
    for (const child of layer.removeChildren()) {
      child.destroy({ children: true });
    }
  }

  private createTileSprite(tile: number, x: number, y: number): Sprite | null {
    const textureName = getTileTexture(tile);

    if (!textureName) {
      return null;
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

    return sprite;
  }
}
