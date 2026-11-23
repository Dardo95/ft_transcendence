import type {
  BombSnapshot,
  ExplosionSnapshot,
  GamePlayerSnapshot,
  GameSnapshot,
  MovementInput,
} from '@transcendence/shared';
import { Application, type Ticker } from 'pixi.js';
import type { RefObject } from 'react';

import { useAuthStore } from '../../auth/store/useAuthStore';
import { gameSocket } from '../../../lib/socket';

import { nextDemoGate, type DemoGateState } from '../bombs/demoGate';
// Bombas ambientales del fixture, desactivadas de momento.
// Descomentar para reactivarlas (ver el stub del tick de demo).
// import { demoBombStateAt } from '../bombs/demoBombs';
import {
  deriveDemoEndScreen,
  deriveEndScreen,
  type EndScreenState,
} from '../endScreen';
import { nextHudGate, type HudGateState } from '../hud/hudGate';
import { buildHudModel, type HudModel } from '../hud/hudModel';
import { DemoPilot } from '../input/demoPilot';
import { DemoWorld } from '../demo/demoWorld';
import {
  initialBotBrainState,
  isMoving,
  nextBotDecision,
  STOPPED_MOVEMENT,
  type BotBrainState,
} from '../input/botBrain';
import { KeyboardController } from '../input/keyboard';
import { boardToTileMap } from '../map/boardConversion';
import { testMap, TILE_SIZE } from '../map/TileMap';
import { GameConnection, type GameJoinFailure } from '../net/gameConnection';
import { demoPlayers } from '../players/demoPlayers';
import { GameScene } from '../pixi/GameScene';
import {
  approach,
  computeSceneOffset,
  type CameraViewport,
} from '../pixi/camera';

const LOCAL_PLAYER_ID = 'bren';
// Suavizado de la cámara (mismo enfoque exponencial que la
// interpolación de jugadores): estable a 60 y 120 fps.
const CAMERA_FOLLOW = 8;
// Cadencia del muestreo del overlay de FPS (?debug=1).
const FPS_SAMPLE_MS = 1000;

/**
 * Fases de la vista:
 * - `connecting`: esperando el snapshot inicial del servidor.
 * - `server`: la partida la gobierna el backend (snapshots 20 Hz).
 * - `demo`: sin servidor, la demo local (F-01..F-07) como fallback.
 */
export type ViewMode = 'connecting' | 'server' | 'demo';

/** Un bot de la demo: su piloto (físicas) + su brain (comportamiento). */
interface DemoBot {
  player: GamePlayerSnapshot;
  pilot: DemoPilot;
  state: BotBrainState;
  /** Teclas pedidas en el tick anterior (para detectar muros). */
  asked: MovementInput;
  /** Avanzó en el tick anterior (false = estaba bloqueado). */
  movedLast: boolean;
}

export interface GameEngineCallbacks {
  /** Modelo de HUD reconstruido (solo cuando cambia algo visible). */
  onHud: (model: HudModel) => void;
  /** Resultado nuevo de la partida (muerte/victoria/derrota). */
  onEndScreen: (state: EndScreenState) => void;
  /** Cambio de fase (solo cuando cambia de verdad). */
  onMode: (mode: ViewMode) => void;
  /** Muestreo de FPS del overlay (?debug=1). */
  onFps: (fps: number) => void;
  /** El join inicial falló: sin sala (`rejected`) o sin servidor (`timeout`). */
  onJoinFailed: (reason: GameJoinFailure) => void;
}

export interface GameEngineOptions {
  container: HTMLElement;
  /** Id de la partida en la ruta (`/game/:id`), ref para el tick. */
  gameIdRef: RefObject<string>;
  /** Mapa en `?map=`, en mayúsculas, ref para el tick. */
  mapIdRef: RefObject<string>;
  /**
   * false → arranca directo en modo demo local, sin join ni
   * socket (la demo embebida en Rules, GAME-F-13). Por defecto
   * true: partida real contra el backend.
   */
  server?: boolean;
  callbacks: GameEngineCallbacks;
}

/**
 * Motor imperativo de la partida: posee el `Application` de Pixi,
 * la escena, la conexión, el teclado, el piloto de la demo, la
 * cámara y el loop de tick.
 *
 * La vista React (`GameViewport`) solo lo crea, replica sus
 * callbacks a `useState` y lo destruye al desmontar. La semántica
 * de StrictMode es idéntica a la del efecto original: `start()` es
 * idempotente por guardas y `destroy()` es seguro aunque `app.init`
 * siga en vuelo.
 */
export class GameEngine {
  private readonly container: HTMLElement;
  private readonly gameIdRef: RefObject<string>;
  private readonly mapIdRef: RefObject<string>;
  private readonly callbacks: GameEngineCallbacks;
  // false → arranca en modo demo sin tocar el backend.
  private readonly serverMode: boolean;

  private readonly app = new Application();
  private readonly connection: GameConnection;
  private readonly keyboard: KeyboardController;
  private resizeObserver: ResizeObserver | null = null;

  private scene: GameScene | null = null;
  private destroyed = false;
  // true cuando `app.init` terminó bien: `destroy()` solo
  // destruye una app inicializada (destruir a medio crear
  // lanza y ensuciaría la consola en StrictMode).
  private initialized = false;

  // Fase actual (se refleja en el estado de React para el
  // overlay de "Conectando..." vía `onMode`).
  private currentMode: ViewMode = 'connecting';

  // Copia local del fixture: el piloto mueve a Bren y no
  // debemos mutar el array compartido de demoPlayers (si no,
  // al salir y volver Bren aparecería en la última posición).
  private readonly players = demoPlayers.map((player) => ({
    ...player,
    position: { ...player.position },
  }));
  private readonly pilot: DemoPilot;
  /** Un piloto + brain por bot del fixture (sin el local). */
  private readonly bots: DemoBot[];
  /** Mundo vivo de la demo: mapa (cajas quemadas) y power-ups. */
  private readonly demoWorld: DemoWorld;

  // Estado del modo servidor: el último snapshot recibido y
  // el último ya aplicado a la escena (20 Hz, por identidad).
  private latestSnapshot: GameSnapshot | null = null;
  private appliedSnapshot: GameSnapshot | null = null;

  // Mapa activo: la demo vive en `demoWorld.map` (cajas
  // quemadas); el servidor, el board del snapshot. La cámara,
  // el HUD y el brain de los bots leen estas medidas.
  private activeMap: readonly number[][];
  private readonly mapSize = {
    width: testMap[0].length * TILE_SIZE,
    height: testMap.length * TILE_SIZE,
  };

  // Resuelto cuando la app de Pixi termina de inicializar:
  // la escena puede querer crearse antes (snapshot temprano).
  private resolveAppReady: () => void = () => undefined;
  private readonly appReady: Promise<void>;

  // Debug (?debug=1): muestreo del FPS a 1 Hz.
  private readonly debugFpsEnabled: boolean;
  // ?mode=spectator → sin pantalla de fin ni input propio.
  private readonly spectatorMode: boolean;
  private lastFpsAt = 0;

  // Último estado del HUD aplicado: el modelo solo se
  // reconstruye cuando cambia algo visible (reloj, bombas
  // propias, jugadores en pie o stats) en vez de a 60 Hz.
  private lastHudGate: HudGateState = {
    second: -1,
    ownBombs: -1,
    aliveCount: -1,
    localId: '',
    localAlive: false,
    capacity: -1,
    blast: -1,
    speed: -1,
    isOvertime: false,
  };
  // Último estado de fin de partida aplicado: solo avisamos a
  // React cuando cambia el resultado.
  private lastEndScreen: EndScreenState = 'playing';
  // Fases del fixture de demo ya aplicadas a la escena.
  private lastDemoGate: DemoGateState = { bombs: -1, explosions: -1 };

  // Cámara: viewport visible + desplazamiento actual de la
  // escena. El objetivo se recalcula cada tick siguiendo al
  // jugador local.
  private readonly viewport: CameraViewport = { width: 0, height: 0 };
  private readonly camera = { x: 0, y: 0 };

  constructor(options: GameEngineOptions) {
    this.container = options.container;
    this.gameIdRef = options.gameIdRef;
    this.mapIdRef = options.mapIdRef;
    this.callbacks = options.callbacks;
    this.serverMode = options.server !== false;

    // Fase inicial según el modo: demo local sin "Conectando..."
    // (asignación simple, sin `setMode`, para no sincronizar
    // setState con el effect que nos crea).
    this.currentMode = this.serverMode ? 'connecting' : 'demo';

    // Mundo de la demo: copia viva del fixture (las cajas
    // destruidas y los power-ups no deben mutar `testMap`,
    // que es compartido entre montajes) compartida por Bren,
    // los bots y la escena.
    this.demoWorld = new DemoWorld(testMap);
    this.activeMap = this.demoWorld.map;

    this.pilot = new DemoPilot(this.demoWorld, this.players, LOCAL_PLAYER_ID);

    // Un piloto por bot: mismas físicas que el local (muro,
    // bomba, muerte), gobernado por su brain en cada tick.
    this.bots = this.players
      .filter((player) => player.id !== LOCAL_PLAYER_ID)
      .map((player) => ({
        player,
        pilot: new DemoPilot(this.demoWorld, this.players, player.id),
        state: initialBotBrainState(),
        asked: STOPPED_MOVEMENT,
        movedLast: false,
      }));

    this.appReady = new Promise<void>((resolve) => {
      this.resolveAppReady = () => resolve();
    });

    // `debug`/`mode` se leen de la URL en el arranque, igual
    // que los leía el efecto original antes de crear la
    // conexión.
    this.debugFpsEnabled =
      new URLSearchParams(window.location.search).get('debug') === '1';
    this.spectatorMode =
      new URLSearchParams(window.location.search).get('mode') === 'spectator';

    // GameConnection owns join/reconnect/input protocol details. This
    // engine translates its snapshots into the Pixi scene and HUD.
    this.connection = new GameConnection(gameSocket, {
      onJoined: (snapshot) => {
        if (this.destroyed) {
          return;
        }

        this.latestSnapshot = snapshot;
        this.setMode('server');
        void this.ensureScene(
          boardToTileMap(snapshot.board.tiles),
          snapshot.players
        );
      },
      onState: (snapshot) => {
        if (this.destroyed) {
          return;
        }

        this.latestSnapshot = snapshot;
      },
      onFailed: (reason) => {
        // Solo rinde la conexión inicial: si ya se jugaba y se
        // pierde la sala, se conserva el último estado. Sin
        // fallback a la demo (GAME-F-13): la vista muestra la
        // pantalla de "partida no encontrada" o de conexión.
        if (this.destroyed || this.currentMode !== 'connecting') {
          return;
        }

        this.connection.destroy();
        this.callbacks.onJoinFailed(reason);
      },
    });

    this.keyboard = new KeyboardController({
      onMovement: (movement) => {
        if (this.currentMode === 'server') {
          this.connection.sendMovement(movement);
        } else if (this.currentMode === 'demo') {
          this.pilot.setMovement(movement);
        }
      },
      onPlaceBomb: () => {
        if (this.currentMode === 'server') {
          this.connection.sendBomb();
        } else if (this.currentMode === 'demo') {
          this.pilot.placeBomb();
        }
      },
    });
  }

  /**
   * Arranca el motor: teclado, Pixi, escena (demo) o join al
   * servidor, y observer de resize. Llamar una sola vez por
   * montado (el shell lo hace dentro de su effect).
   */
  start(): void {
    this.keyboard.attach();

    void this.init();

    if (this.serverMode) {
      // Unirse al servidor. Si el id no existe o el backend no
      // responde, `onFailed` avisa a la vista (GAME-F-13) para
      // que muestre su pantalla — y como ese camino es
      // asíncrono (timer/excepción), nunca hay setState
      // síncrono en el effect (regla react-hooks/set-state-in-effect).
      this.connection.join(this.gameIdRef.current, {
        spectator: this.spectatorMode,
      });
    } else {
      // Demo local (Rules): escena del mapa vivo sin tocar el
      // backend (sin join ni socket).
      void this.ensureScene(this.demoWorld.map, this.players);
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.container);
  }

  /** Redimensiona el renderer al contenedor y reencuadra el mapa. */
  resize(): void {
    if (this.destroyed || !this.app.renderer) {
      return;
    }
    const { clientWidth, clientHeight } = this.container;
    if (clientWidth === 0 || clientHeight === 0) {
      return;
    }
    this.app.renderer.resize(clientWidth, clientHeight);
    this.fitMap();
  }

  /** El jugador ha elegido salir: se notifica como abandono voluntario. */
  abandon(): void {
    this.keyboard.destroy();
    this.connection.abandon();
  }

  /** Limpieza total. Segura aunque `app.init` siga en vuelo. */
  destroy(): void {
    this.destroyed = true;
    this.connection.destroy();
    this.resizeObserver?.disconnect();

    // La app puede no haber terminado de inicializar
    // (StrictMode desmonta antes de que `app.init` resuelva):
    // el ticker aún no existe y `destroy` puede lanzar.
    try {
      this.app.ticker?.remove(this.tick);
    } catch {
      // Sin ticker que retirar.
    }

    this.keyboard.destroy();

    if (this.scene) {
      this.scene.destroy({ children: true });
      this.scene = null;
    }

    // Solo destruir si `app.init` terminó: si el desmontaje
    // llega antes, la app no tiene recursos que liberar y
    // `destroy` sobre un estado a medio crear puede lanzar.
    if (this.initialized) {
      try {
        this.app.destroy(
          { removeView: true },
          { children: true, texture: true }
        );
      } catch (error) {
        console.warn(
          '[GameEngine] Failed to destroy Pixi Application safely:',
          error
        );
      }
    }
  }

  private setMode(next: ViewMode): void {
    if (this.currentMode !== next) {
      this.currentMode = next;
      this.callbacks.onMode(next);
    }
  }

  // Se lee en cada uso: `checkAuth` es asíncrono y `user`
  // puede seguir siendo null cuando este motor arranca.
  private serverLocalId(): string | null {
    const userId = useAuthStore.getState().user?.id;
    return userId != null ? String(userId) : null;
  }

  private currentLocalPlayer(): GamePlayerSnapshot | null {
    if (this.currentMode === 'server') {
      const snapshot = this.latestSnapshot;

      if (!snapshot) {
        return null;
      }

      const localId = this.serverLocalId();
      const local =
        localId !== null
          ? snapshot.players.find(
              (player: GamePlayerSnapshot) => player.id === localId
            )
          : undefined;

      return local ?? snapshot.players[0] ?? null;
    }

    return (
      this.players.find((player) => player.id === LOCAL_PLAYER_ID) ??
      this.players[0]
    );
  }

  private cameraTarget(): { x: number; y: number } | null {
    const local = this.currentLocalPlayer();

    if (!local) {
      return null;
    }

    return computeSceneOffset(
      this.mapSize.width,
      this.mapSize.height,
      this.viewport,
      {
        x: local.position.x * TILE_SIZE + TILE_SIZE / 2,
        y: local.position.y * TILE_SIZE + TILE_SIZE / 2,
      }
    );
  }

  private snapCamera(): void {
    const target = this.cameraTarget();

    if (!target) {
      return;
    }

    this.camera.x = target.x;
    this.camera.y = target.y;

    if (this.scene) {
      this.scene.x = this.camera.x;
      this.scene.y = this.camera.y;
    }
  }

  private fitMap(): void {
    if (this.destroyed || !this.scene) {
      return;
    }
    const cw = this.container.clientWidth;
    const ch = this.container.clientHeight;
    if (cw === 0 || ch === 0) {
      return;
    }
    this.viewport.width = cw;
    this.viewport.height = ch;
    // El renderer vive exactamente en el contenedor: el mapa
    // se mueve con la cámara en vez de scrollear a mano.
    this.app.renderer.resize(cw, ch);
    this.scene.scale.set(1);
    this.snapCamera();
  }

  private async ensureScene(
    map: number[][],
    initialPlayers: readonly GamePlayerSnapshot[]
  ): Promise<void> {
    if (this.destroyed || this.scene) {
      return;
    }

    await this.appReady;

    if (this.destroyed || this.scene || !this.app.stage) {
      return;
    }

    const scene = new GameScene(map, initialPlayers);
    this.scene = scene;
    this.activeMap = map;
    this.mapSize.width = map[0].length * TILE_SIZE;
    this.mapSize.height = map.length * TILE_SIZE;
    this.app.stage.addChild(scene);
    this.fitMap();
  }

  private readonly init = async (): Promise<void> => {
    try {
      await this.app.init({
        background: '#0f1026',
        antialias: false,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (this.destroyed) {
        // La limpieza ya se ejecutó (StrictMode): destruir aquí
        // es redundante y `destroy` sobre una app ya destruida
        // puede lanzar. Se ignora a propósito.
        this.resolveAppReady();
        return;
      }

      this.app.renderer.resize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      this.container.appendChild(this.app.canvas);
      this.app.ticker.add(this.tick);
      this.initialized = true;
      this.resolveAppReady();
    } catch (error) {
      console.error(
        '[GameEngine] Failed to initialize Pixi Application:',
        error
      );
      this.resolveAppReady();
    }
  };

  private readonly tick = (ticker: Ticker): void => {
    if (this.debugFpsEnabled) {
      const now = performance.now();

      if (now - this.lastFpsAt >= FPS_SAMPLE_MS) {
        this.lastFpsAt = now;
        this.callbacks.onFps(Math.round(this.app.ticker.FPS));
      }
    }

    const scene = this.scene;

    if (!scene) {
      return;
    }

    scene.update(ticker.deltaMS);

    let scenePlayers: readonly GamePlayerSnapshot[];
    let sceneBombs: readonly BombSnapshot[];
    let elapsedMs: number;
    let isOvertime: boolean;
    let hudLocalId: string | null;
    // Fin de partida: la rama servidor lo deriva del snapshot;
    // la demo, de sus jugadores (muerte local o bots caídos).
    // Ambas ramas lo asignan antes de usarlo.
    let nextEndScreen: EndScreenState;

    if (this.currentMode === 'server') {
      const snapshot = this.latestSnapshot;

      if (!snapshot) {
        return;
      }

      const isNewSnapshot = snapshot !== this.appliedSnapshot;
      // Mismo fallback que la cámara: si la identidad local no
      // está disponible aún, se pinta con el primer jugador en
      // vez de dejar el HUD vacío.
      hudLocalId = this.serverLocalId() ?? snapshot.players[0]?.id ?? null;

      // Aplicar el snapshot solo cuando llega uno nuevo: el
      // resto de frames se encarga la interpolación.
      if (isNewSnapshot) {
        this.appliedSnapshot = snapshot;
        scene.setPlayers(snapshot.players);
        scene.setBombs(snapshot.bombs);
        scene.setExplosions(snapshot.explosions);
        scene.setPowerUps(snapshot.powerUps);
        // El tablero viaja en cada snapshot; la escena decide
        // si repinta (solo cuando una explosión cambia casillas).
        scene.setTiles(boardToTileMap(snapshot.board.tiles));
        nextEndScreen = deriveEndScreen(snapshot, hudLocalId);
      } else {
        // Sin snapshot nuevo no hay nada nuevo que derivar.
        nextEndScreen = this.lastEndScreen;
      }

      scenePlayers = snapshot.players;
      sceneBombs = snapshot.bombs;
      elapsedMs = snapshot.elapsedMs;
      isOvertime = snapshot.status === 'OVERTIME';
    } else {
      // Bombas ambientales del fixture, desactivadas de momento:
      // solo viven las que colocan Bren y los bots. Para
      // reactivarlas, descomentar el import y la línea `fixture`
      // y borrar este stub (todos los usos de abajo leen de él);
      // además habrá que registrarlas y olvidarlas en el mundo
      // (`registerBomb`/`forgetBomb`) para que bloqueen como
      // las demás.
      // const fixture = demoBombStateAt(scene.timeMs);
      const fixture = {
        bombs: [] as BombSnapshot[],
        explosions: [] as ExplosionSnapshot[],
      };
      // Externas del local: fixture + bombas ya detonadas de
      // los bots (las propias del piloto se comprueban dentro
      // de su update; lo cruzado lleva un tick de retardo).
      const botExplosions = this.bots.flatMap((bot) =>
        bot.pilot.getExplosions()
      );

      this.pilot.update(scene.timeMs, ticker.deltaMS, [
        ...fixture.explosions,
        ...botExplosions,
      ]);

      // Bots: brain → teclas → piloto (movimiento, bomba y
      // muerte resuelven dentro del piloto).
      const externalForBots = [
        ...fixture.explosions,
        ...this.pilot.getExplosions(),
        ...botExplosions,
      ];

      for (const bot of this.bots) {
        const brain = nextBotDecision(bot.state, {
          nowMs: scene.timeMs,
          map: this.activeMap,
          position: bot.player.position,
          alive: bot.player.alive,
          blocked: isMoving(bot.asked) && !bot.movedLast,
          rng: Math.random,
        });
        bot.state = brain.state;
        bot.asked = brain.decision.movement;
        bot.pilot.setMovement(brain.decision.movement);

        if (brain.decision.placeBomb) {
          bot.pilot.placeBomb();
        }

        bot.pilot.update(scene.timeMs, ticker.deltaMS, externalForBots);
      }

      // Repintar jugadores solo cuando algo se movió o murió
      // (el sprite pone DEAD_ALPHA al marcar `alive`).
      const pilotMoved = this.pilot.consumeMoved();
      const pilotChanged = this.pilot.consumeChanged();
      let botsMoved = false;
      let botsChanged = false;

      for (const bot of this.bots) {
        const moved = bot.pilot.consumeMoved();
        bot.movedLast = moved;
        botsMoved = botsMoved || moved;
        botsChanged = botsChanged || bot.pilot.consumeChanged();
      }

      if (pilotMoved || botsMoved) {
        scene.setPlayers(this.players);
      }

      // Repintar bombas/explosiones solo cuando las listas
      // cambian (fases del fixture o bombas de cualquiera); los
      // power-ups y las cajas se repintan abajo, con sus flags.
      const pilotBombs = this.pilot.getBombs();
      const nextDemo = nextDemoGate(this.lastDemoGate, {
        pilotChanged: pilotChanged || botsChanged,
        fixtureBombs: fixture.bombs.length,
        fixtureExplosions: fixture.explosions.length,
      });

      if (nextDemo) {
        this.lastDemoGate = nextDemo;
        const botBombs = this.bots.flatMap((bot) => bot.pilot.getBombs());
        const activeBotExplosions = this.bots.flatMap((bot) =>
          bot.pilot.getExplosions()
        );
        scene.setBombs([...fixture.bombs, ...pilotBombs, ...botBombs]);
        scene.setExplosions([
          ...fixture.explosions,
          ...this.pilot.getExplosions(),
          ...activeBotExplosions,
        ]);
      }

      // Cajas destruidas y power-ups: el mundo se actualiza
      // dentro de los updates de los pilotos (al detonar) y
      // aquí se aplican sus cambios a la escena.
      if (this.demoWorld.consumeMapChanged()) {
        // Copia: `setTiles` compara contra el mapa propio de
        // la escena y el del mundo se muta en el sitio.
        scene.setTiles(this.demoWorld.map.map((row) => [...row]));
      }

      const demoExplosions = [
        ...fixture.explosions,
        ...this.pilot.getExplosions(),
        ...this.bots.flatMap((bot) => bot.pilot.getExplosions()),
      ];

      // Recoger power-ups: solo jugadores vivos y fuera de la
      // llama activa (reglas del backend).
      this.demoWorld.collect(this.players, demoExplosions, scene.timeMs);

      if (this.demoWorld.consumePowerUpsChanged()) {
        scene.setPowerUps(this.demoWorld.getPowerUps());
      }

      // Para el HUD solo cuentan las bombas del piloto (las
      // de los bots y del fixture son de otro propietario).
      sceneBombs = pilotBombs;
      scenePlayers = this.players;
      elapsedMs = scene.timeMs;
      isOvertime = false;
      hudLocalId = LOCAL_PLAYER_ID;
      nextEndScreen = deriveDemoEndScreen(this.players, LOCAL_PLAYER_ID);
    }

    // Cámara siguiendo al jugador local con suavizado.
    if (this.viewport.width > 0 && this.viewport.height > 0) {
      const target = this.cameraTarget();

      if (target) {
        this.camera.x = approach(
          this.camera.x,
          target.x,
          CAMERA_FOLLOW,
          ticker.deltaMS
        );
        this.camera.y = approach(
          this.camera.y,
          target.y,
          CAMERA_FOLLOW,
          ticker.deltaMS
        );
        scene.x = this.camera.x;
        scene.y = this.camera.y;
      }
    }

    if (
      !hudLocalId ||
      !scenePlayers.some((player) => player.id === hudLocalId)
    ) {
      return;
    }

    // HUD: reconstruir el modelo solo cuando cambia algo que
    // se muestra (reloj, bombas propias, vivos o stats). El
    // modelo y su comparación dejan de correr a 60 Hz.
    const nextHud = nextHudGate(this.lastHudGate, {
      players: scenePlayers,
      bombs: sceneBombs,
      localId: hudLocalId,
      elapsedMs,
      isOvertime,
    });

    if (nextHud) {
      this.lastHudGate = nextHud;

      this.callbacks.onHud(
        buildHudModel(scenePlayers, sceneBombs, hudLocalId, elapsedMs, {
          map: this.activeMap,
          gameId: this.gameIdRef.current,
          mapId: this.mapIdRef.current,
          isOvertime,
        })
      );
    }

    if (nextEndScreen !== this.lastEndScreen) {
      this.lastEndScreen = nextEndScreen;
      this.callbacks.onEndScreen(nextEndScreen);
    }
  };
}
