import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const DEFAULT_MAP_ID = 'map1';

interface GameParams {
  /** Id de la partida en la ruta (`/game/:id`), ref para el tick. */
  gameIdRef: RefObject<string>;
  /** Mapa en `?map=`, en mayúsculas, ref para el tick. */
  mapIdRef: RefObject<string>;
  /** `?debug=1` → overlays de rendimiento. */
  debugEnabled: boolean;
  /** `?mode=spectator` → sin pantalla de fin ni input propio. */
  isSpectator: boolean;
}

/**
 * Parámetros de la vista de partida: id en la ruta y flags en
 * la query string. Los ids viven en refs para que el tick los
 * lea sin recrear el effect del motor.
 */
export function useGameParams(): GameParams {
  const { id: routeGameId } = useParams();
  const [searchParams] = useSearchParams();

  const gameIdRef = useRef(routeGameId ?? 'demo');
  const mapIdRef = useRef(
    (searchParams.get('map') ?? DEFAULT_MAP_ID).toUpperCase()
  );

  // Mantener la ref al día sin recrear el motor: el tick lee
  // `gameIdRef.current` en cada uso.
  useEffect(() => {
    gameIdRef.current = routeGameId ?? 'demo';
  }, [routeGameId]);

  return useMemo(
    () => ({
      gameIdRef,
      mapIdRef,
      debugEnabled: searchParams.get('debug') === '1',
      isSpectator: searchParams.get('mode') === 'spectator',
    }),
    [searchParams]
  );
}
