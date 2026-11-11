import type { GamePlayerSnapshot } from '@transcendence/shared';
import { Container, Graphics, Sprite, Text, type Texture } from 'pixi.js';

import { TILE_SIZE } from '../map/TileMap';
import {
  exceedsSnapDistance,
  segmentDuration,
  segmentPosition,
} from './interpolation';
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

  // Par de snapshots en reproducción con retardo: se muestra
  // `prev*` avanzando linealmente hacia `curr*` desde la
  // llegada de este último. Anclar a las posiciones del
  // servidor (y no a donde esté el sprite) mantiene la
  // velocidad constante en tiempo real y evita el patrón de
  // frames lentos/rápidos que se veía como tirones.
  private prevX = 0;
  private prevY = 0;
  private currX = 0;
  private currY = 0;
  // Instante de escena en que llegó cada uno del par.
  private prevArrivalMs = 0;
  private currArrivalMs = 0;
  private sceneMs = 0;
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
    const targetX = player.position.x * TILE_SIZE;
    const targetY = player.position.y * TILE_SIZE;

    this.nameTag.text = getPlayerLabel(player);
    this.layoutNameTag();

    this.alpha = player.alive ? 1 : DEAD_ALPHA;
    this.zIndex = targetY;

    if (
      !this.hasPosition ||
      exceedsSnapDistance(this.renderedX, this.renderedY, targetX, targetY)
    ) {
      this.snapTo(targetX, targetY);
      return;
    }

    // El par se desplaza: el snapshot vigente pasa a `prev*`
    // y el nuevo ocupa `curr*`. La reproducción arranca en la
    // llegada (edad 0 → posición `prev*`), un snapshot por
    // detrás, lo que deja el retraso constante y la velocidad
    // exactamente la del servidor.
    this.prevX = this.currX;
    this.prevY = this.currY;
    this.prevArrivalMs = this.currArrivalMs;
    this.currX = targetX;
    this.currY = targetY;
    this.currArrivalMs = this.sceneMs;
  }

  setLabelsVisible(visible: boolean): void {
    this.nameGroup.visible = visible;
  }

  update(deltaMs: number): void {
    if (!this.hasPosition) {
      return;
    }

    this.sceneMs += deltaMs;

    // Edad desde la llegada de `curr*`: alcanza la duración
    // (intervalo medido) justo cuando debe llegar el siguiente
    // snapshot; si este tarda, el sprite espera en `curr*`
    // (`segmentPosition` acota la edad a la duración).
    const age = this.sceneMs - this.currArrivalMs;
    const duration = segmentDuration(this.currArrivalMs - this.prevArrivalMs);

    this.renderedX = segmentPosition(this.prevX, this.currX, age, duration);
    this.renderedY = segmentPosition(this.prevY, this.currY, age, duration);

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

  private snapTo(x: number, y: number): void {
    // Par con origen y destino iguales: posición exacta y
    // reproducción detenida en el destino.
    this.prevX = x;
    this.prevY = y;
    this.currX = x;
    this.currY = y;
    this.prevArrivalMs = this.sceneMs;
    this.currArrivalMs = this.sceneMs;
    this.renderedX = x;
    this.renderedY = y;
    this.hasPosition = true;

    this.position.set(Math.round(x), Math.round(y));
    this.zIndex = this.renderedY;
  }
}
