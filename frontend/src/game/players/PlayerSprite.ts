import type { GamePlayerSnapshot } from '@transcendence/shared';
import { Container, Graphics, Sprite, Text, type Texture } from 'pixi.js';

import { TILE_SIZE } from '../map/TileMap';
import { exceedsSnapDistance, smoothTowards } from './interpolation';
import { getPlayerLabel } from './types';

const LABEL_GAP = 4;
const PLATE_PADDING_X = 6;
const PLATE_PADDING_Y = 3;
const PLATE_RADIUS = 4;
const DEAD_ALPHA = 0.35;

export class PlayerSprite extends Container {
  readonly playerId: string;

  private readonly body: Sprite;
  private readonly nameGroup = new Container();
  private readonly namePlate = new Graphics();
  private readonly nameTag: Text;

  private targetX = 0;
  private targetY = 0;
  private renderedX = 0;
  private renderedY = 0;
  private hasPosition = false;

  constructor(player: GamePlayerSnapshot, texture: Texture) {
    super();

    this.playerId = player.id;

    this.body = new Sprite(texture);
    this.body.anchor.set(0.5);
    this.body.width = TILE_SIZE;
    this.body.height = TILE_SIZE;
    this.body.roundPixels = true;

    this.nameTag = new Text({
      text: getPlayerLabel(player),
      style: {
        fontFamily: 'monospace',
        fontSize: 12,
        fontWeight: 'bold',
        fill: 0xf8fafc,
      },
    });
    this.nameTag.anchor.set(0.5, 1);

    this.nameGroup.addChild(this.namePlate, this.nameTag);
    this.addChild(this.body, this.nameGroup);

    this.layoutNameTag();
    this.setPlayer(player);
  }

  setPlayer(player: GamePlayerSnapshot): void {
    this.targetX = player.position.x * TILE_SIZE;
    this.targetY = player.position.y * TILE_SIZE;

    this.nameTag.text = getPlayerLabel(player);
    this.layoutNameTag();

    this.alpha = player.alive ? 1 : DEAD_ALPHA;
    this.zIndex = this.targetY;

    if (
      !this.hasPosition ||
      exceedsSnapDistance(
        this.renderedX,
        this.renderedY,
        this.targetX,
        this.targetY
      )
    ) {
      this.snapToTarget();
    }
  }

  setLabelsVisible(visible: boolean): void {
    this.nameGroup.visible = visible;
  }

  update(deltaMs: number): void {
    if (!this.hasPosition) {
      return;
    }

    this.renderedX = smoothTowards(this.renderedX, this.targetX, deltaMs);
    this.renderedY = smoothTowards(this.renderedY, this.targetY, deltaMs);

    this.position.set(Math.round(this.renderedX), Math.round(this.renderedY));
    this.zIndex = this.renderedY;
  }

  private layoutNameTag(): void {
    const textWidth = Math.ceil(this.nameTag.width);
    const textHeight = Math.ceil(this.nameTag.height);
    const plateWidth = textWidth + PLATE_PADDING_X * 2;
    const plateHeight = textHeight + PLATE_PADDING_Y * 2;
    const plateBottom = -TILE_SIZE / 2 - LABEL_GAP;

    this.nameTag.position.set(0, plateBottom - PLATE_PADDING_Y);

    this.namePlate
      .clear()
      .roundRect(
        -plateWidth / 2,
        plateBottom - plateHeight,
        plateWidth,
        plateHeight,
        PLATE_RADIUS
      )
      .fill({ color: 0x0f1026, alpha: 0.85 })
      .stroke({ color: 0xffffff, alpha: 0.15, width: 1 });
  }

  private snapToTarget(): void {
    this.renderedX = this.targetX;
    this.renderedY = this.targetY;
    this.hasPosition = true;

    this.position.set(Math.round(this.renderedX), Math.round(this.renderedY));
    this.zIndex = this.renderedY;
  }
}
