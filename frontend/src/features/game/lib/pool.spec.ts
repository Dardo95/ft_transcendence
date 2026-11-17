import { describe, expect, it, vi } from 'vitest';

import { ObjectPool } from './pool';

interface Item {
  value: number;
}

describe('ObjectPool', () => {
  it('creates a new item when the pool is empty', () => {
    const create = vi.fn((): Item => ({ value: 0 }));
    const pool = new ObjectPool(create, () => undefined);

    expect(pool.acquire()).toEqual({ value: 0 });
    expect(create).toHaveBeenCalledTimes(1);
    expect(pool.available).toBe(0);
  });

  it('reuses a released item and resets it on acquire', () => {
    const reset = vi.fn((item: Item) => {
      item.value = 0;
    });
    const pool = new ObjectPool((): Item => ({ value: 0 }), reset);

    const item = pool.acquire();
    item.value = 5;
    pool.release(item);

    expect(pool.available).toBe(1);

    const recycled = pool.acquire();

    expect(recycled).toBe(item);
    expect(recycled.value).toBe(0);
    expect(reset).toHaveBeenCalledWith(item);
  });

  it('does not reset freshly created items', () => {
    const reset = vi.fn();
    const pool = new ObjectPool((): Item => ({ value: 7 }), reset);

    expect(pool.acquire().value).toBe(7);
    expect(reset).not.toHaveBeenCalled();
  });

  it('reuses items in LIFO order', () => {
    const pool = new ObjectPool(
      (): Item => ({ value: 0 }),
      (item) => {
        item.value = 0;
      }
    );

    const first = pool.acquire();
    const second = pool.acquire();

    pool.release(first);
    pool.release(second);

    expect(pool.acquire()).toBe(second);
    expect(pool.acquire()).toBe(first);
  });

  it('counts released items as available', () => {
    const pool = new ObjectPool(
      (): Item => ({ value: 0 }),
      () => undefined
    );

    const a = pool.acquire();
    const b = pool.acquire();

    pool.release(a);
    expect(pool.available).toBe(1);

    pool.release(b);
    expect(pool.available).toBe(2);

    pool.acquire();
    expect(pool.available).toBe(1);
  });
});
