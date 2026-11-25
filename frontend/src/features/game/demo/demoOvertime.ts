import {
  GAME_DEFAULTS,
  createOvertimeSpiral,
  pickOvertimeCorner,
  type GamePlayerSnapshot,
  type Position,
} from '@transcendence/shared';

import { TileType } from '../map/types';
import type { DemoWorld } from './demoWorld';

/**
 * Muerte súbita de la demo (GAME-F-15): reproduce el cierre de
 * muros de `overtime-system` del backend con la misma espiral,
 * la misma esquina estable por hash (el `mapId` de la partida)
 * y la misma cadencia de `GAME_DEFAULTS`. Al llegar la duración
 * de la partida cierra una casilla tras el aviso y después una
 * por intervalo, matando a quien pise una casilla ya cerrada.
 */
export class DemoOvertime {
  private tileOrder: Position[] = [];
  private nextTileIndex = 0;
  private startedAtMs: number | null = null;
  private active = false;

  constructor(
    private readonly world: DemoWorld,
    private readonly mapId: string
  ) {}

  /** true una vez superada la duración de la partida. */
  get isOvertime(): boolean {
    return this.active;
  }

  /**
   * Cierra los muros vencidos en `nowMs` (todos los que ya
   * deberían haberse cerrado, por si el tick va tarde) y
   * devuelve los ids de los jugadores muertos al cerrar.
   */
  update(nowMs: number, players: readonly GamePlayerSnapshot[]): string[] {
    if (!this.active) {
      if (nowMs < GAME_DEFAULTS.matchDurationMs) {
        return [];
      }

      this.start();
      this.active = true;
    }

    const killedPlayerIds: string[] = [];

    while (this.nextTileIndex < this.tileOrder.length) {
      const dueAtMs =
        (this.startedAtMs ?? 0) +
        GAME_DEFAULTS.overtimeFirstWallDelayMs +
        this.nextTileIndex * GAME_DEFAULTS.overtimeWallIntervalMs;

      if (nowMs < dueAtMs) {
        break;
      }

      const position = this.tileOrder[this.nextTileIndex];
      this.nextTileIndex++;
      killedPlayerIds.push(
        ...this.world.closeWall(position.x, position.y, players)
      );
    }

    return killedPlayerIds;
  }

  private start(): void {
    const map = this.world.map;

    this.startedAtMs = GAME_DEFAULTS.matchDurationMs;
    this.nextTileIndex = 0;
    // Espiral del mapa completo filtrando las casillas que ya
    // son muro (parte de la barrera, igual que el filtro de
    // INDESTRUCTIBLE del backend).
    this.tileOrder = createOvertimeSpiral(
      map[0]?.length ?? 0,
      map.length,
      pickOvertimeCorner(this.mapId)
    ).filter((position) => {
      const tile = map[position.y]?.[position.x];
      return tile === TileType.FLOOR || tile === TileType.BLOCK;
    });
  }
}
