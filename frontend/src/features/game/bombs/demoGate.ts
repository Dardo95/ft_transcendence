/** Último fixture ya aplicado a la escena (longitudes). */
export interface DemoGateState {
  bombs: number;
  explosions: number;
}

export interface DemoGateInputs {
  /** Cambios del piloto desde el último consumo (bomba puesta/detonada). */
  pilotChanged: boolean;
  /** Longitudes actuales del fixture del modo demo. */
  fixtureBombs: number;
  fixtureExplosions: number;
}

/**
 * Devuelve el próximo estado si hay que repintar bombas y
 * explosiones de la demo, o `null` si las listas no cambiaron.
 *
 * La demo aplica `setBombs`/`setExplosions` solo en cambios
 * reales (fases del fixture o bombas del piloto) en vez de a
 * 60 Hz — regla de rendimiento de F-09.
 */
export function nextDemoGate(
  prev: DemoGateState,
  inputs: DemoGateInputs
): DemoGateState | null {
  const { pilotChanged, fixtureBombs, fixtureExplosions } = inputs;

  const fixtureChanged =
    fixtureBombs !== prev.bombs || fixtureExplosions !== prev.explosions;

  if (!pilotChanged && !fixtureChanged) {
    return null;
  }

  return { bombs: fixtureBombs, explosions: fixtureExplosions };
}
