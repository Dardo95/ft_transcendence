import { Application } from 'pixi.js';
import { useEffect, useRef } from 'react';
import { GameScene } from './scenes/GameScene';
import { testMap } from './map/TileMap';

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

    const init = async () => {
      try {
        await app.init({
          background: '#0f1026',
          antialias: true,
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
      className="relative h-[70vh] w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-lg"
      aria-label="Game viewport"
    />
  );
}
