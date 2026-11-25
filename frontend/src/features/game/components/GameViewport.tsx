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
import {
  showFinalSecondsAlert,
  showSuddenDeathAlert,
  type HudModel,
} from '../hud/hudModel';
import { GameTopBar } from '../hud/GameTopBar';
import { FullscreenHud } from '../hud/FullscreenHud';
import { MatchAlertBanner } from '../hud/MatchAlertBanner';
import { UI } from '../../../components/layout/layoutStyles';

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
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [hudModel, setHudModel] = useState<HudModel | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(
    demo ? 'demo' : 'connecting'
  );
  const [isWideGameLayout, setIsWideGameLayout] = useState(
    () => window.matchMedia('(min-width: 1024px)').matches
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
  // Opción fullscreen sobre el canvas: solo el viewport del
  // juego entra en pantalla completa y el FullscreenHud es la
  // única UI visible (el topbar y el sidebar quedan fuera).
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateLayout = () => setIsWideGameLayout(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateLayout);

    return () => {
      mediaQuery.removeEventListener('change', updateLayout);
    };
  }, []);

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

  useEffect(() => {
    engineRef.current?.setFitWholeMap(
      isFullscreen || (!demo && isWideGameLayout)
    );
  }, [demo, isFullscreen, isWideGameLayout, runId]);

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
      className={
        isFullscreen
          ? UI.game.viewportFullscreenLayout
          : demo
            ? UI.game.viewportDemoLayout
            : `${UI.game.viewportLayout} ${UI.game.viewportMatchLayout}`
      }
    >
      <div
        className={
          isFullscreen
            ? UI.game.viewportFullscreenColumn
            : UI.game.viewportColumn
        }
      >
        {hudModel && (
          <GameTopBar
            model={hudModel}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onLeave={
              demo
                ? undefined
                : () => {
                    engineRef.current?.abandon();
                    navigate('/lobby');
                  }
            }
          />
        )}
        {/* El contenedor define el tamaño del canvas: +64 px en modos de 70vh, espacio flexible en escritorio y pantalla completa al maximizar. */}
        <div
          ref={containerRef}
          className={`${UI.game.viewportFrame} ${
            isFullscreen
              ? UI.game.viewportFullscreen
              : demo
                ? UI.game.viewportDemo
                : UI.game.viewportMatch
          }`}
          style={{ imageRendering: 'pixelated' }}
          aria-label={t('app.game.viewportLabel') || 'Game viewport'}
        >
          {viewMode === 'connecting' && !joinFailure && (
            <div className={UI.game.loadingOverlay}>
              <span className={UI.game.loadingText}>
                {t('app.general.connecting') || 'Connecting...'}
              </span>
            </div>
          )}
          {joinFailure && (
            <div className={UI.game.failureOverlay}>
              <p className={UI.game.failureTitle}>
                {joinFailure === 'rejected'
                  ? t('app.joinFailure.notFoundTitle')
                  : t('app.joinFailure.connectionLostTitle')}
              </p>
              <p className={UI.game.failureDescription}>
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
            <div className={UI.game.debugBadge}>FPS {debugFps}</div>
          )}
          {/* Avisos de reloj: "¡Últimos 20 segundos!" solo los
              primeros 5 s de la ventana (20→15 s restantes) y
              muerte súbita los primeros 5 s de overtime.
              Dentro del viewport para verse en modo ventana y
              fullscreen; z-10 < EndScreenOverlay (z-20). */}
          {hudModel && showFinalSecondsAlert(hudModel) && (
            <MatchAlertBanner kind="finalSeconds" />
          )}
          {hudModel && showSuddenDeathAlert(hudModel) && (
            <MatchAlertBanner kind="suddenDeath" />
          )}
          {/* HUD superpuesto solo en pantalla completa: el
              topbar y el sidebar quedan fuera del elemento
              fullscreen, así que este overlay es la única UI.
              z-10 < EndScreenOverlay (z-20); sin eventos. */}
          {isFullscreen && hudModel && <FullscreenHud model={hudModel} />}
        </div>
      </div>

      <aside
        className={
          isFullscreen
            ? UI.game.viewportFullscreenSidebar
            : demo
              ? UI.game.viewportDemoSidebar
              : UI.game.viewportSidebar
        }
        aria-label={t('app.game.sidebarLabel') || 'Game sidebar'}
      >
        {hudModel && (
          <GameSidebar
            model={hudModel}
            demo={demo}
            threeColumn={!isFullscreen}
            responsive={!demo && !isFullscreen}
          />
        )}
      </aside>
    </div>
  );
}
