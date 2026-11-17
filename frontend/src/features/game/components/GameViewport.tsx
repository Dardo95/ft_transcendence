import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../locales/useLanguage';

import { useFullscreen } from '../hooks/useFullscreen';
import { useGameParams } from '../hooks/useGameParams';
import { GameEngine, type ViewMode } from '../engine/GameEngine';
import { EndScreenOverlay } from './EndScreenOverlay';
import type { EndScreenState } from '../endScreen';
import { GameSidebar } from '../hud/GameSidebar';
import type { HudModel } from '../hud/hudModel';
import { GameTopBar } from '../hud/GameTopBar';

/**
 * Shell React de la partida: crea/destruye el `GameEngine`,
 * replica sus callbacks a `useState` y renderiza la UI alrededor
 * del canvas (topbar, overlays y sidebar). Toda la lógica
 * imperativa (Pixi, conexión, teclado, tick) vive en el motor.
 */
export function GameViewport() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [hudModel, setHudModel] = useState<HudModel | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('connecting');
  // Pantalla de fin (muerte/victoria/derrota) y su descarte
  // manual ("seguir viendo") hasta que cambie el resultado.
  const [endScreenState, setEndScreenState] =
    useState<EndScreenState>('playing');
  const [endDismissed, setEndDismissed] = useState(false);
  // Overlay de rendimiento: solo con ?debug=1 en la URL.
  const [debugFps, setDebugFps] = useState<number | null>(null);
  const navigate = useNavigate();

  const { gameIdRef, mapIdRef, debugEnabled, isSpectator } = useGameParams();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || engineRef.current) {
      return;
    }

    const engine = new GameEngine({
      container,
      gameIdRef,
      mapIdRef,
      callbacks: {
        onHud: setHudModel,
        onMode: setViewMode,
        onEndScreen: (state) => {
          setEndScreenState(state);
          // Un resultado nuevo vuelve a mostrar la pantalla (si
          // el jugador había descartado la de muerte).
          setEndDismissed(false);
        },
        onFps: setDebugFps,
      },
    });
    engineRef.current = engine;
    engine.start();

    return () => {
      engineRef.current = null;
      engine.destroy();
    };
    // Las refs del hook son estables (useRef): listarlas calma
    // a exhaustive-deps sin recrear el motor.
  }, [gameIdRef, mapIdRef]);

  return (
    <div className="flex w-full flex-col gap-2 p-2 lg:h-[calc(100dvh-80px)] lg:flex-row lg:overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {hudModel && (
          <GameTopBar
            model={hudModel}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onLeave={() => navigate('/lobby')}
          />
        )}
        <div
          ref={containerRef}
          className={`relative overflow-hidden bg-zinc-950 ${
            isFullscreen
              ? 'h-screen w-screen rounded-none'
              : 'h-[70vh] min-h-[320px] rounded-lg lg:h-auto lg:min-h-0 lg:flex-1'
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
          {!isSpectator && endScreenState !== 'playing' && !endDismissed && (
            <EndScreenOverlay
              state={endScreenState}
              onReturnToLobby={() => navigate('/lobby')}
              onKeepWatching={() => setEndDismissed(true)}
            />
          )}
          {debugEnabled && debugFps !== null && (
            <div className="absolute right-2 bottom-2 z-10 rounded bg-zinc-950/80 px-2 py-1 font-mono text-xs text-amber-300">
              FPS {debugFps}
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
