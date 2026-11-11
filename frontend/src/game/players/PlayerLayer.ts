import type { GamePlayerSnapshot } from '@transcendence/shared';
import { Container } from 'pixi.js';

import { PlayerSprite } from './PlayerSprite';
import type { PlayerTextureMap } from './textures';
import { PLAYER_COLORS, type PlayerColor } from './types';

export class PlayerLayer extends Container {
  private readonly sprites = new Map<string, PlayerSprite>();
  private readonly colorById = new Map<string, PlayerColor>();

  private textures: PlayerTextureMap = {};
  private labelsVisible = true;

  constructor() {
    super();
    this.sortableChildren = true;
  }

  setTextures(textures: PlayerTextureMap): void {
    this.textures = textures;
  }

  setPlayers(players: readonly GamePlayerSnapshot[]): void {
    const currentIds = new Set(players.map((player) => player.id));

    for (const [id, sprite] of this.sprites) {
      if (currentIds.has(id)) {
        continue;
      }

      this.removeChild(sprite);
      sprite.destroy({ children: true });
      this.sprites.delete(id);
      this.colorById.delete(id);
    }

    for (const player of players) {
      const existing = this.sprites.get(player.id);

      if (existing) {
        existing.setPlayer(player);
        continue;
      }

      const color = this.assignColor(player.id);
      const texture = this.textures[color];

      if (!texture) {
        continue;
      }

      const sprite = new PlayerSprite(player, texture);
      sprite.setLabelsVisible(this.labelsVisible);

      this.sprites.set(player.id, sprite);
      this.addChild(sprite);
    }
  }

  setLabelsVisible(visible: boolean): void {
    this.labelsVisible = visible;

    for (const sprite of this.sprites.values()) {
      sprite.setLabelsVisible(visible);
    }
  }

  update(deltaMs: number): void {
    for (const sprite of this.sprites.values()) {
      sprite.update(deltaMs);
    }
  }

  private assignColor(playerId: string): PlayerColor {
    const existing = this.colorById.get(playerId);

    if (existing) {
      return existing;
    }

    const used = new Set(this.colorById.values());
    const color =
      PLAYER_COLORS.find((item) => !used.has(item)) ?? PLAYER_COLORS[0];

    this.colorById.set(playerId, color);

    return color;
  }
}
