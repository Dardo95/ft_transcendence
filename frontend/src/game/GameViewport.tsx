import { Application, type Ticker } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';

import { demoBombStateAt } from './bombs/demoBombs';
import { DemoPilot } from './input/demoPilot';
import { KeyboardController } from './input/keyboard';
import { GameHud } from './hud/GameHud';
import { buildHudModel, type HudModel } from './hud/hudModel';
import { testMap, TILE_SIZE } from './map/TileMap';
import { demoPlayers } from './players/demoPlayers';
import { GameScene } from './scenes/GameScene';

const LOCAL_PLAYER_ID = 'bren';

export function GameViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const sceneRef = useRef<GameScene | null>(null);
  const [hudModel, setHudModel] = useState<HudModel | null>(null);

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

      scene.setBombs([...fixture.bombs, ...pilot.getBombs()]);
      scene.setExplosions([...fixture.explosions, ...pilot.getExplosions()]);

      const model = buildHudModel(
        players,
        [...fixture.bombs, ...pilot.getBombs()],
        LOCAL_PLAYER_ID,
        scene.timeMs
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
      const mapWidth = testMap[0].length * TILE_SIZE;
      const mapHeight = testMap.length * TILE_SIZE;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw === 0 || ch === 0) {
        return;
      }
      const scene = sceneRef.current;
      const renderWidth = Math.max(cw, mapWidth);
      const renderHeight = Math.max(ch, mapHeight);
      app.renderer.resize(renderWidth, renderHeight);
      scene.scale.set(1);
      scene.x = Math.round((renderWidth - mapWidth) / 2);
      scene.y = Math.round((renderHeight - mapHeight) / 2);
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
    <div className="relative h-[calc(100dvh-80px)] w-full overflow-hidden bg-zinc-950">
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-auto"
        style={{ imageRendering: 'pixelated' }}
        aria-label="Game viewport"
      />
      {hudModel && <GameHud model={hudModel} />}
    </div>
  );
}
