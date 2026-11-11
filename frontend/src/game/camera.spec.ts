import { describe, expect, it } from 'vitest';

import { approach, computeSceneOffset } from './camera';

describe('computeSceneOffset', () => {
  it('centers a map smaller than the viewport on both axes', () => {
    const offset = computeSceneOffset(
      640, // 10 tiles
      384, // 6 tiles
      { width: 1024, height: 768 },
      { x: 320, y: 192 }
    );

    expect(offset.x).toBe((1024 - 640) / 2); // 192
    expect(offset.y).toBe((768 - 384) / 2); // 192
  });

  it('ignores the focus when the map fits the viewport', () => {
    const centered = computeSceneOffset(
      640,
      384,
      { width: 1024, height: 768 },
      { x: 0, y: 0 }
    );
    const cornered = computeSceneOffset(
      640,
      384,
      { width: 1024, height: 768 },
      { x: 640, y: 384 }
    );

    expect(centered).toEqual(cornered);
    expect(centered).toEqual({ x: 192, y: 192 });
  });

  it('centers a map exactly as large as the viewport', () => {
    const offset = computeSceneOffset(
      1024,
      768,
      { width: 1024, height: 768 },
      { x: 512, y: 384 }
    );

    expect(offset).toEqual({ x: 0, y: 0 });
  });

  it('follows the focus when the map is larger than the viewport', () => {
    // Mapa 21×12 tiles = 1344×768 px; viewport 800×600.
    const offset = computeSceneOffset(
      1344,
      768,
      { width: 800, height: 600 },
      { x: 672, y: 384 } // centro exacto del mapa
    );

    // El centro del viewport cae en el centro del mapa.
    expect(offset.x).toBe(-672 + 400); // -272
    expect(offset.y).toBe(-384 + 300); // -84
  });

  it('clamps the left and top edges so no void shows', () => {
    const offset = computeSceneOffset(
      1344,
      768,
      { width: 800, height: 600 },
      { x: 0, y: 0 }
    );

    // El borde izquierdo del mapa cae en el borde izquierdo
    // del viewport (offset mínimo permitido = 0 en este eje).
    expect(offset.x).toBe(0);
    expect(offset.y).toBe(0);
  });

  it('clamps the right and bottom edges so no void shows', () => {
    const offset = computeSceneOffset(
      1344,
      768,
      { width: 800, height: 600 },
      { x: 1344, y: 768 }
    );

    // Borde derecho del mapa: -544 + 1344 = 800 = ancho del
    // viewport; borde inferior: -168 + 768 = 600 = alto.
    expect(offset.x).toBe(-544);
    expect(offset.y).toBe(-168);
  });

  it('clamps each axis independently', () => {
    const offset = computeSceneOffset(
      1344, // más ancho que el viewport
      384, // más chico que el viewport
      { width: 800, height: 600 },
      { x: 1000, y: 0 }
    );

    expect(offset.x).toBe(-544); // foco clampado al borde derecho útil
    expect(offset.y).toBe((600 - 384) / 2); // centrado
  });
});

describe('approach', () => {
  it('moves towards the target without overshooting', () => {
    const next = approach(0, 100, 8, 16);

    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(100);
  });

  it('converges to the target over time', () => {
    let value = 0;

    for (let i = 0; i < 120; i += 1) {
      value = approach(value, 100, 8, 16);
    }

    expect(value).toBeCloseTo(100, 2);
  });

  it('stays at the target when already there', () => {
    expect(approach(42, 42, 8, 16)).toBe(42);
  });
});
