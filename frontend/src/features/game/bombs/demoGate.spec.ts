import { describe, expect, it } from 'vitest';

import { nextDemoGate, type DemoGateState } from './demoGate';

const BASE: DemoGateState = { bombs: 0, explosions: 0 };

describe('nextDemoGate', () => {
  it('returns null when nothing changed', () => {
    expect(
      nextDemoGate(BASE, {
        pilotChanged: false,
        fixtureBombs: 0,
        fixtureExplosions: 0,
      })
    ).toBeNull();
  });

  it('returns the next state when the pilot changes', () => {
    const next = nextDemoGate(BASE, {
      pilotChanged: true,
      fixtureBombs: 3,
      fixtureExplosions: 1,
    });

    expect(next).toEqual({ bombs: 3, explosions: 1 });
  });

  it('returns the next state when the fixture phase advances', () => {
    const next = nextDemoGate(BASE, {
      pilotChanged: false,
      fixtureBombs: 2,
      fixtureExplosions: 0,
    });

    expect(next).toEqual({ bombs: 2, explosions: 0 });
  });

  it('returns null while a pilot change is consumed only once', () => {
    const first = nextDemoGate(BASE, {
      pilotChanged: true,
      fixtureBombs: 0,
      fixtureExplosions: 0,
    });

    // Tras aplicar, el gate queda al día: sin cambios no repinta.
    expect(
      nextDemoGate(first ?? BASE, {
        pilotChanged: false,
        fixtureBombs: 0,
        fixtureExplosions: 0,
      })
    ).toBeNull();
  });

  it('never mutates the previous state', () => {
    nextDemoGate(BASE, {
      pilotChanged: true,
      fixtureBombs: 5,
      fixtureExplosions: 2,
    });

    expect(BASE).toEqual({ bombs: 0, explosions: 0 });
  });
});
