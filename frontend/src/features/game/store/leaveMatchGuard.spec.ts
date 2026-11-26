import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMatchGuardStore } from './useMatchGuardStore';

describe('useMatchGuardStore', () => {
  beforeEach(() => {
    useMatchGuardStore.getState().disarm();
  });

  it('runs proceed directly when no match is armed', () => {
    const proceed = vi.fn();

    useMatchGuardStore.getState().request({ proceed });

    expect(proceed).toHaveBeenCalledTimes(1);
    expect(useMatchGuardStore.getState().open).toBe(false);
  });

  it('opens the modal and defers proceed while armed', () => {
    const proceed = vi.fn();
    useMatchGuardStore.getState().arm(() => undefined);

    useMatchGuardStore.getState().request({ proceed });

    expect(proceed).not.toHaveBeenCalled();
    expect(useMatchGuardStore.getState().open).toBe(true);
    expect(useMatchGuardStore.getState().pending?.proceed).toBe(proceed);
  });

  it('abandon action runs abandon and the deferred proceed', () => {
    const abandon = vi.fn();
    const proceed = vi.fn();
    useMatchGuardStore.getState().arm(abandon);
    useMatchGuardStore.getState().request({ proceed });

    useMatchGuardStore.getState().confirmAbandon();

    expect(abandon).toHaveBeenCalledTimes(1);
    expect(proceed).toHaveBeenCalledTimes(1);
    expect(useMatchGuardStore.getState().open).toBe(false);
    expect(useMatchGuardStore.getState().pending).toBeNull();
  });

  it('background action skips abandon and still proceeds', () => {
    const abandon = vi.fn();
    const proceed = vi.fn();
    useMatchGuardStore.getState().arm(abandon);
    useMatchGuardStore.getState().request({ proceed });

    useMatchGuardStore.getState().confirmBackground();

    expect(abandon).not.toHaveBeenCalled();
    expect(proceed).toHaveBeenCalledTimes(1);
    expect(useMatchGuardStore.getState().open).toBe(false);
  });

  it('cancel runs neither abandon nor proceed', () => {
    const abandon = vi.fn();
    const proceed = vi.fn();
    useMatchGuardStore.getState().arm(abandon);
    useMatchGuardStore.getState().request({ proceed });

    useMatchGuardStore.getState().cancel();

    expect(abandon).not.toHaveBeenCalled();
    expect(proceed).not.toHaveBeenCalled();
    expect(useMatchGuardStore.getState().open).toBe(false);
  });

  it('disarming closes the modal and drops the pending action', () => {
    const proceed = vi.fn();
    useMatchGuardStore.getState().arm(() => undefined);
    useMatchGuardStore.getState().request({ proceed });

    useMatchGuardStore.getState().disarm();
    useMatchGuardStore.getState().confirmBackground();

    expect(useMatchGuardStore.getState().armed).toBe(false);
    expect(useMatchGuardStore.getState().open).toBe(false);
    expect(proceed).not.toHaveBeenCalled();
  });

  it('re-arming replaces the abandon callback', () => {
    const first = vi.fn();
    const second = vi.fn();
    const proceed = vi.fn();
    useMatchGuardStore.getState().arm(first);
    useMatchGuardStore.getState().arm(second);
    useMatchGuardStore.getState().request({ proceed });

    useMatchGuardStore.getState().confirmAbandon();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
