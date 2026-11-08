import { Application, type Ticker } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { approach, computeSceneOffset, type CameraViewport } from './camera';
import { demoBombStateAt } from './bombs/demoBombs';
import { GameSidebar } from './hud/GameSidebar';
import { buildHudModel, type HudModel } from './hud/hudModel';
import { GameTopBar } from './hud/GameTopBar';
import { DemoPilot } from './input/demoPilot';
import { KeyboardController } from './input/keyboard';
import { testMap, TILE_SIZE } from './map/TileMap';
import { demoPlayers } from './players/demoPlayers';
import { GameScene } from './scenes/GameScene';

const LOCAL_PLAYER_ID = 'bren';
const MAP_WIDTH = testMap[0].length * TILE_SIZE;
const MAP_HEIGHT = testMap.length * TILE_SIZE;
// Suavizado de la cámara (mismo enfoque exponencial que la
// interpolación de jugadores): estable a 60 y 120 fps.
const CAMERA_FOLLOW = 8;

export function GameViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const sceneRef = useRef<GameScene | null>(null);
  const [hudModel, setHudModel] = useState<HudModel | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // El id vive en la ruta (/game/:id); una ref permite que el
  // tick lea el valor actual sin recrear el effect completo.
  const { id: routeGameId } = useParams();
  const gameIdRef = useRef(routeGameId ?? 'demo');

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

    // Copia local del fixture: el piloto mueve a Bren y no
    // debemos mutar el array compartido de demoPlayers (si no,
    // al salir y volver Bren aparecería en la última posición).
    const players = demoPlayers.map((player) => ({
      ...player,
      position: { ...player.position },
    }));
    const pilot = new DemoPilot(testMap, players, LOCAL_PLAYER_ID);
    const keyboard = new KeyboardController({
      onMovement: (movement) => pilot.setMovement(movement),
      onPlaceBomb: () => pilot.placeBomb(),
    });

    keyboard.attach();

    // Último estado del HUD ya pintado: solo re-renderizamos
    // React cuando el modelo cambia (el reloj, 1 vez/s).
    let lastHudKey = '';

    // Cámara: viewport visible + desplazamiento actual de la
    // escena. El objetivo se recalcula cada tick siguiendo a Bren.
    const viewport: CameraViewport = { width: 0, height: 0 };
    const camera = { x: 0, y: 0 };

    const cameraTarget = () => {
      const local =
        players.find((player) => player.id === LOCAL_PLAYER_ID) ?? players[0];

      return computeSceneOffset(MAP_WIDTH, MAP_HEIGHT, viewport, {
        x: local.position.x * TILE_SIZE + TILE_SIZE / 2,
        y: local.position.y * TILE_SIZE + TILE_SIZE / 2,
      });
    };

    const snapCamera = () => {
      const target = cameraTarget();
      camera.x = target.x;
      camera.y = target.y;

      if (sceneRef.current) {
        sceneRef.current.x = camera.x;
        sceneRef.current.y = camera.y;
      }
    };

    const tick = (ticker: Ticker) => {
      const scene = sceneRef.current;

      if (!scene) {
        return;
      }

      scene.update(ticker.deltaMS);

      const fixture = demoBombStateAt(scene.timeMs);
      pilot.update(scene.timeMs, ticker.deltaMS, fixture.explosions);

      if (pilot.consumeMoved()) {
        scene.setPlayers(players);
      }

      const bombs = [...fixture.bombs, ...pilot.getBombs()];
      scene.setBombs(bombs);
      scene.setExplosions([...fixture.explosions, ...pilot.getExplosions()]);

      // Cámara siguiendo al jugador local con suavizado.
      if (viewport.width > 0 && viewport.height > 0) {
        const target = cameraTarget();
        camera.x = approach(camera.x, target.x, CAMERA_FOLLOW, ticker.deltaMS);
        camera.y = approach(camera.y, target.y, CAMERA_FOLLOW, ticker.deltaMS);
        scene.x = camera.x;
        scene.y = camera.y;
      }

      const model = buildHudModel(
        players,
        bombs,
        LOCAL_PLAYER_ID,
        scene.timeMs,
        {
          map: testMap,
          gameId: gameIdRef.current,
        }
      );
      const hudKey = JSON.stringify(model);

      if (hudKey !== lastHudKey) {
        lastHudKey = hudKey;
        setHudModel(model);
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
      app.renderer.resize(cw, ch);
      sceneRef.current.scale.set(1);
      snapCamera();
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
          app.destroy({ removeView: true }, { children: true, texture: true });
          return;
        }

        app.renderer.resize(container.clientWidth, container.clientHeight);
        container.appendChild(app.canvas);

        const scene = new GameScene(testMap, players);
        sceneRef.current = scene;
        app.stage.addChild(scene);
        app.ticker.add(tick);

        fitMap();
      } catch (error) {
        console.error(
          '[GameViewport] Failed to initialize Pixi Application:',
          error
        );
      }
    };

    void init();

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
      resizeObserver.disconnect();
      appRef.current?.ticker.remove(tick);
      keyboard.destroy();

      if (sceneRef.current) {
        sceneRef.current.destroy({ children: true });
        sceneRef.current = null;
      }

      if (appRef.current) {
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
        />
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
