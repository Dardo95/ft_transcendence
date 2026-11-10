import type {
  BombSnapshot,
  GamePlayerSnapshot,
  GameSnapshot,
} from '@transcendence/shared';
import { Application, type Ticker } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useLanguage } from '../locales/useLanguage';
import { gameSocket } from '../lib/socket';
import { approach, computeSceneOffset, type CameraViewport } from './camera';
import { demoBombStateAt } from './bombs/demoBombs';
import { GameSidebar } from './hud/GameSidebar';
import { buildHudModel, type HudModel } from './hud/hudModel';
import { GameTopBar } from './hud/GameTopBar';
import { DemoPilot } from './input/demoPilot';
import { KeyboardController } from './input/keyboard';
import { boardToTileMap } from './map/boardConversion';
import { testMap, TILE_SIZE } from './map/TileMap';
import { GameConnection } from './net/gameConnection';
import { demoPlayers } from './players/demoPlayers';
import { GameScene } from './scenes/GameScene';

const LOCAL_PLAYER_ID = 'bren';
const DEFAULT_MAP_ID = 'map1';
// Suavizado de la cámara (mismo enfoque exponencial que la
// interpolación de jugadores): estable a 60 y 120 fps.
const CAMERA_FOLLOW = 8;

/**
 * Fases de la vista:
 * - `connecting`: esperando el snapshot inicial del servidor.
 * - `server`: la partida la gobierna el backend (snapshots 20 Hz).
 * - `demo`: sin servidor, la demo local (F-01..F-07) como fallback.
 */
type ViewMode = 'connecting' | 'server' | 'demo';

export function GameViewport() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const sceneRef = useRef<GameScene | null>(null);
  const [hudModel, setHudModel] = useState<HudModel | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('connecting');

  // El id vive en la ruta (/game/:id); una ref permite que el
  // tick lea el valor actual sin recrear el effect completo.
  const { id: routeGameId } = useParams();
  const [searchParams] = useSearchParams();
  const gameIdRef = useRef(routeGameId ?? 'demo');
  const mapIdRef = useRef(
    (searchParams.get('map') ?? DEFAULT_MAP_ID).toUpperCase()
  );

  useEffect(() => {
    gameIdRef.current = routeGameId ?? 'demo';
  }, [routeGameId]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement === containerRef.current) {
      void document.exitFullscreen();
    } else {
      void containerRef.current?.requestFullscreen();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || appRef.current) {
      return;
    }

    const app = new Application();
    appRef.current = app;

    let destroyed = false;
    // true cuando `app.init` terminó bien: la limpieza solo
    // destruye una app inicializada (destruir a medio crear
    // lanza y ensuciaría la consola en StrictMode).
    let initialized = false;

    // Fase actual (cierre del effect; también se refleja en el
    // estado de React para el overlay de "Conectando...").
    let currentMode: ViewMode = 'connecting';
    const setMode = (next: ViewMode) => {
      if (currentMode !== next) {
        currentMode = next;
        setViewMode(next);
      }
    };

    // Copia local del fixture: el piloto mueve a Bren y no
    // debemos mutar el array compartido de demoPlayers (si no,
    // al salir y volver Bren aparecería en la última posición).
    const players = demoPlayers.map((player) => ({
      ...player,
      position: { ...player.position },
    }));
    const pilot = new DemoPilot(testMap, players, LOCAL_PLAYER_ID);

    // Estado del modo servidor: el último snapshot recibido y
    // el último ya aplicado a la escena (20 Hz, por identidad).
    let latestSnapshot: GameSnapshot | null = null;
    let appliedSnapshot: GameSnapshot | null = null;

    // Mapa activo: la demo usa el fixture; el servidor, el board
    // del snapshot. La cámara y el HUD leen estas medidas.
    let activeMap: readonly number[][] = testMap;
    const mapSize = {
      width: testMap[0].length * TILE_SIZE,
      height: testMap.length * TILE_SIZE,
    };

    // Se lee en cada uso: `checkAuth` es asíncrono y `user`
    // puede seguir siendo null cuando este effect arranca.
    const serverLocalId = (): string | null => {
      const userId = useAuthStore.getState().user?.id;
      return userId != null ? String(userId) : null;
    };

    // Resuelto cuando la app de Pixi termina de inicializar:
    // la escena puede querer crearse antes (snapshot temprano).
    let resolveAppReady: () => void = () => undefined;
    const appReady = new Promise<void>((resolve) => {
      resolveAppReady = () => resolve();
    });

    // Último estado del HUD ya pintado: solo re-renderizamos
    // React cuando el modelo cambia (el reloj, 1 vez/s).
    let lastHudKey = '';

    // Cámara: viewport visible + desplazamiento actual de la
    // escena. El objetivo se recalcula cada tick siguiendo al
    // jugador local.
    const viewport: CameraViewport = { width: 0, height: 0 };
    const camera = { x: 0, y: 0 };

    const currentLocalPlayer = (): GamePlayerSnapshot | null => {
      if (currentMode === 'server') {
        const snapshot = latestSnapshot;

        if (!snapshot) {
          return null;
        }

        const localId = serverLocalId();
        const local =
          localId !== null
            ? snapshot.players.find(
                (player: GamePlayerSnapshot) => player.id === localId
              )
            : undefined;

        return local ?? snapshot.players[0] ?? null;
      }

      return (
        players.find((player) => player.id === LOCAL_PLAYER_ID) ?? players[0]
      );
    };

    const cameraTarget = (): { x: number; y: number } | null => {
      const local = currentLocalPlayer();

      if (!local) {
        return null;
      }

      return computeSceneOffset(mapSize.width, mapSize.height, viewport, {
        x: local.position.x * TILE_SIZE + TILE_SIZE / 2,
        y: local.position.y * TILE_SIZE + TILE_SIZE / 2,
      });
    };

    const snapCamera = () => {
      const target = cameraTarget();

      if (!target) {
        return;
      }

      camera.x = target.x;
      camera.y = target.y;

      if (sceneRef.current) {
        sceneRef.current.x = camera.x;
        sceneRef.current.y = camera.y;
      }
    };

    const fitMap = () => {
      if (destroyed || !appRef.current || !sceneRef.current) {
        return;
      }
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw === 0 || ch === 0) {
        return;
      }
      viewport.width = cw;
      viewport.height = ch;
      // El renderer vive exactamente en el contenedor: el mapa
      // se mueve con la cámara en vez de scrollear a mano.
      appRef.current.renderer.resize(cw, ch);
      sceneRef.current.scale.set(1);
      snapCamera();
    };

    const ensureScene = async (
      map: number[][],
      initialPlayers: readonly GamePlayerSnapshot[]
    ): Promise<void> => {
      if (destroyed || sceneRef.current) {
        return;
      }

      await appReady;

      if (destroyed || sceneRef.current || !app.stage) {
        return;
      }

      const scene = new GameScene(map, initialPlayers);
      sceneRef.current = scene;
      activeMap = map;
      mapSize.width = map[0].length * TILE_SIZE;
      mapSize.height = map.length * TILE_SIZE;
      app.stage.addChild(scene);
      fitMap();
    };

    const connection = new GameConnection(gameSocket, {
      onJoined: (snapshot) => {
        if (destroyed) {
          return;
        }

        latestSnapshot = snapshot;
        setMode('server');
        void ensureScene(
          boardToTileMap(snapshot.board.tiles),
          snapshot.players
        );
      },
      onState: (snapshot) => {
        if (destroyed) {
          return;
        }

        latestSnapshot = snapshot;
      },
      onFailed: () => {
        // Solo rinde la conexión inicial: si ya se jugaba y se
        // pierde la sala, se conserva el último estado.
        if (destroyed || currentMode !== 'connecting') {
          return;
        }

        connection.destroy();
        setMode('demo');
        void ensureScene(testMap, players);
      },
    });

    const keyboard = new KeyboardController({
      onMovement: (movement) => {
        if (currentMode === 'server') {
          connection.sendMovement(movement);
        } else if (currentMode === 'demo') {
          pilot.setMovement(movement);
        }
      },
      onPlaceBomb: () => {
        if (currentMode === 'server') {
          connection.sendBomb();
        } else if (currentMode === 'demo') {
          pilot.placeBomb();
        }
      },
    });

    keyboard.attach();

    const tick = (ticker: Ticker) => {
      const scene = sceneRef.current;

      if (!scene) {
        return;
      }

      scene.update(ticker.deltaMS);

      let scenePlayers: readonly GamePlayerSnapshot[];
      let sceneBombs: readonly BombSnapshot[];
      let elapsedMs: number;
      let hudLocalId: string | null;

      if (currentMode === 'server') {
        const snapshot = latestSnapshot;

        if (!snapshot) {
          return;
        }

        // Aplicar el snapshot solo cuando llega uno nuevo: el
        // resto de frames se encarga la interpolación.
        if (snapshot !== appliedSnapshot) {
          appliedSnapshot = snapshot;
          scene.setPlayers(snapshot.players);
          scene.setBombs(snapshot.bombs);
          scene.setExplosions(snapshot.explosions);
        }

        scenePlayers = snapshot.players;
        sceneBombs = snapshot.bombs;
        elapsedMs = snapshot.elapsedMs;
        // Mismo fallback que la cámara: si la identidad local no
        // está disponible aún, se pinta con el primer jugador en
        // vez de dejar el HUD vacío.
        hudLocalId = serverLocalId() ?? snapshot.players[0]?.id ?? null;
      } else {
        const fixture = demoBombStateAt(scene.timeMs);
        pilot.update(scene.timeMs, ticker.deltaMS, fixture.explosions);

        if (pilot.consumeMoved()) {
          scene.setPlayers(players);
        }

        sceneBombs = [...fixture.bombs, ...pilot.getBombs()];
        scene.setBombs(sceneBombs);
        scene.setExplosions([...fixture.explosions, ...pilot.getExplosions()]);

        scenePlayers = players;
        elapsedMs = scene.timeMs;
        hudLocalId = LOCAL_PLAYER_ID;
      }

      // Cámara siguiendo al jugador local con suavizado.
      if (viewport.width > 0 && viewport.height > 0) {
        const target = cameraTarget();

        if (target) {
          camera.x = approach(
            camera.x,
            target.x,
            CAMERA_FOLLOW,
            ticker.deltaMS
          );
          camera.y = approach(
            camera.y,
            target.y,
            CAMERA_FOLLOW,
            ticker.deltaMS
          );
          scene.x = camera.x;
          scene.y = camera.y;
        }
      }

      if (
        !hudLocalId ||
        !scenePlayers.some((player) => player.id === hudLocalId)
      ) {
        return;
      }

      const model = buildHudModel(
        scenePlayers,
        sceneBombs,
        hudLocalId,
        elapsedMs,
        {
          map: activeMap,
          gameId: gameIdRef.current,
          mapId: mapIdRef.current,
        }
      );
      const hudKey = JSON.stringify(model);

      if (hudKey !== lastHudKey) {
        lastHudKey = hudKey;
        setHudModel(model);
      }
    };

    const init = async () => {
      try {
        await app.init({
          background: '#0f1026',
          antialias: false,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });

        if (destroyed || appRef.current !== app) {
          // La limpieza ya se ejecutó (StrictMode): destruir aquí
          // es redundante y `destroy` sobre una app ya destruida
          // puede lanzar. Se ignora a propósito.
          resolveAppReady();
          return;
        }

        app.renderer.resize(container.clientWidth, container.clientHeight);
        container.appendChild(app.canvas);
        app.ticker.add(tick);
        initialized = true;
        resolveAppReady();
      } catch (error) {
        console.error(
          '[GameViewport] Failed to initialize Pixi Application:',
          error
        );
        resolveAppReady();
      }
    };

    void init();

    // Unirse al servidor. Si el id no existe o el backend no
    // responde, `onFailed` cae a la demo — y como ese camino es
    // asíncrono (timer/excepción), nunca hay setState síncrono
    // en el effect (regla react-hooks/set-state-in-effect).
    connection.join(gameIdRef.current);

    const resizeObserver = new ResizeObserver(() => {
      if (destroyed || !appRef.current?.renderer) {
        return;
      }
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) {
        return;
      }
      appRef.current.renderer.resize(clientWidth, clientHeight);
      fitMap();
    });

    resizeObserver.observe(container);

    return () => {
      destroyed = true;
      connection.destroy();
      resizeObserver.disconnect();

      // La app puede no haber terminado de inicializar
      // (StrictMode desmonta antes de que `app.init` resuelva):
      // el ticker aún no existe y `destroy` puede lanzar.
      try {
        appRef.current?.ticker?.remove(tick);
      } catch {
        // Sin ticker que retirar.
      }

      keyboard.destroy();

      if (sceneRef.current) {
        sceneRef.current.destroy({ children: true });
        sceneRef.current = null;
      }

      // Solo destruir si `app.init` terminó: si el desmontaje
      // llega antes, la app no tiene recursos que liberar y
      // `destroy` sobre un estado a medio crear puede lanzar.
      if (appRef.current && initialized) {
        const currentApp = appRef.current;
        appRef.current = null;

        try {
          currentApp.destroy(
            { removeView: true },
            { children: true, texture: true }
          );
        } catch (error) {
          console.warn(
            '[GameViewport] Failed to destroy Pixi Application safely:',
            error
          );
        }
      } else {
        appRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-3 p-3 lg:h-[calc(100dvh-80px)] lg:flex-row lg:overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {hudModel && (
          <GameTopBar
            model={hudModel}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        )}
        <div
          ref={containerRef}
          className={`relative overflow-hidden bg-zinc-950 ${
            isFullscreen
              ? 'h-screen w-screen rounded-none'
              : 'h-[55vh] min-h-[320px] rounded-lg lg:h-auto lg:min-h-0 lg:flex-1'
          }`}
          style={{ imageRendering: 'pixelated' }}
          aria-label="Game viewport"
        >
          {viewMode === 'connecting' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/70">
              <span className="text-sm text-zinc-400">
                {t('app.general.connecting') || 'Connecting...'}
              </span>
            </div>
          )}
        </div>
      </div>

      <aside
        className="w-full shrink-0 lg:w-72 lg:overflow-y-auto"
        aria-label="Game sidebar"
      >
        {hudModel && <GameSidebar model={hudModel} />}
      </aside>
    </div>
  );
}
