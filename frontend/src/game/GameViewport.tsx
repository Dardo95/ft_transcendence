import { Application } from 'pixi.js';
import { useEffect, useRef } from 'react';
import { GameScene } from './scenes/GameScene';
import { testMap, TILE_SIZE } from './map/TileMap';

export function GameViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const sceneRef = useRef<GameScene | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || appRef.current) {
      return;
    }

    const app = new Application();
    appRef.current = app;

    let destroyed = false;

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
      const scale = Math.min(cw / mapWidth, ch / mapHeight);
      const scene = sceneRef.current;
      scene.scale.set(scale);
      scene.x = Math.round((cw - mapWidth * scale) / 2);
      scene.y = Math.round((ch - mapHeight * scale) / 2);
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

        const scene = new GameScene(testMap);
        sceneRef.current = scene;
        app.stage.addChild(scene);

        fitMap();
      } catch (error) {
        console.error('[GameViewport] Failed to initialize Pixi Application:', error);
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

      if (sceneRef.current) {
        sceneRef.current.destroy({ children: true });
        sceneRef.current = null;
      }

      if (appRef.current) {
        const currentApp = appRef.current;
        appRef.current = null;

        try {
          currentApp.destroy({ removeView: true }, { children: true, texture: true });
        } catch (error) {
          console.warn('[GameViewport] Failed to destroy Pixi Application safely:', error);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100dvh-80px)] w-full overflow-hidden bg-zinc-950"
      style={{ imageRendering: 'pixelated' }}
      aria-label="Game viewport"
    />
  );
}
