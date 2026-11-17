import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../locales/useLanguage';

import { useFullscreen } from '../hooks/useFullscreen';
import { useGameParams } from '../hooks/useGameParams';
import { GameEngine, type ViewMode } from '../engine/GameEngine';
import type { GameJoinFailure } from '../net/gameConnection';
import { Button } from '../../../components/ui/button';
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
 *
 * Con `demo` (embebida en Rules) arranca en modo local sin
 * backend, oculta "Salir" y la pantalla de fin ofrece reiniciar.
 */
interface GameViewportProps {
  demo?: boolean;
}

export function GameViewport({ demo = false }: GameViewportProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [hudModel, setHudModel] = useState<HudModel | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(
    demo ? 'demo' : 'connecting'
  );
  // Pantalla de fin (muerte/victoria/derrota) y su descarte
  // manual ("seguir viendo") hasta que cambie el resultado.
  const [endScreenState, setEndScreenState] =
    useState<EndScreenState>('playing');
  const [endDismissed, setEndDismissed] = useState(false);
  // Overlay de rendimiento: solo con ?debug=1 en la URL.
  const [debugFps, setDebugFps] = useState<number | null>(null);
  // Fallo del join inicial (GAME-F-13): sin sala o sin
  // servidor. La demo ya no es el fallback de /game.
  const [joinFailure, setJoinFailure] = useState<GameJoinFailure | null>(null);
  // Id de montaje del motor: incrementarlo lo recrea entero
  // (botón "Reiniciar" de la demo en Rules).
  const [runId, setRunId] = useState(0);
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
      server: !demo,
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
        onJoinFailed: setJoinFailure,
      },
    });
    engineRef.current = engine;
    engine.start();

    return () => {
      engineRef.current = null;
      engine.destroy();
    };
    // Las refs del hook son estables (useRef): listarlas calma
    // a exhaustive-deps sin recrear el motor. `demo` cambia el
    // modo y `runId` lo recrea entero (reiniciar la demo).
  }, [gameIdRef, mapIdRef, demo, runId]);

  // Reinicio de la demo: limpia los avisos y recrea el motor
  // (el nuevo empieza con todos los jugadores en pie).
  const restartDemo = (): void => {
    setEndScreenState('playing');
    setEndDismissed(false);
    setJoinFailure(null);
    setRunId((id) => id + 1);
  };

  return (
    <div
      className={`flex w-full flex-col gap-2 p-2 lg:flex-row ${
        demo ? '' : 'lg:h-[calc(100dvh-80px)] lg:overflow-hidden'
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {hudModel && (
          <GameTopBar
            model={hudModel}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onLeave={demo ? undefined : () => navigate('/lobby')}
          />
        )}
        <div
          ref={containerRef}
          className={`relative overflow-hidden bg-zinc-950 ${
            isFullscreen
              ? 'h-screen w-screen rounded-none'
              : demo
                ? 'h-[70vh] min-h-[420px] rounded-lg'
                : 'h-[70vh] min-h-[320px] rounded-lg lg:h-auto lg:min-h-0 lg:flex-1'
          }`}
          style={{ imageRendering: 'pixelated' }}
          aria-label="Game viewport"
        >
          {viewMode === 'connecting' && !joinFailure && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/70">
              <span className="text-sm text-zinc-400">
                {t('app.general.connecting') || 'Connecting...'}
              </span>
            </div>
          )}
          {joinFailure && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-zinc-950/90 px-4 text-center">
              <p className="text-lg font-black text-zinc-100">
                {joinFailure === 'rejected'
                  ? t('app.joinFailure.notFoundTitle')
                  : t('app.joinFailure.connectionLostTitle')}
              </p>
              <p className="text-sm text-zinc-400">
                {joinFailure === 'rejected'
                  ? t('app.joinFailure.notFoundSubtitle')
                  : t('app.joinFailure.connectionLostSubtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {joinFailure === 'timeout' && (
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => window.location.reload()}
                    className="bg-orange-500 font-black text-white hover:bg-orange-600"
                  >
                    {t('app.joinFailure.retry')}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/lobby')}
                >
                  {t('app.endScreen.returnLobby')}
                </Button>
              </div>
            </div>
          )}
          {!isSpectator && endScreenState !== 'playing' && !endDismissed && (
            <EndScreenOverlay
              state={endScreenState}
              onReturnToLobby={() => navigate('/lobby')}
              onKeepWatching={() => setEndDismissed(true)}
              onRestart={demo ? restartDemo : undefined}
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
