import { ChatRateLimiter } from './chat-rate-limiter.js';

describe('ChatRateLimiter', () => {
  function createLimiter(start = 1_000) {
    let now = start;
    const limiter = new ChatRateLimiter(500, () => now);
    return {
      limiter,
      advance: (ms: number) => {
        now += ms;
      },
    };
  }

  it('lets the first message through', () => {
    const { limiter } = createLimiter();

    expect(limiter.tryAcquire(1)).toBe(true);
  });

  it('rejects a second message inside the cooldown', () => {
    const { limiter, advance } = createLimiter();

    limiter.tryAcquire(1);
    advance(499);

    expect(limiter.tryAcquire(1)).toBe(false);
  });

  it('accepts again once the cooldown has passed', () => {
    const { limiter, advance } = createLimiter();

    limiter.tryAcquire(1);
    advance(500);

    expect(limiter.tryAcquire(1)).toBe(true);
  });

  it('does not let a rejected message reset the cooldown', () => {
    const { limiter, advance } = createLimiter();

    limiter.tryAcquire(1);
    advance(300);
    limiter.tryAcquire(1); // rejected
    advance(200);

    expect(limiter.tryAcquire(1)).toBe(true);
  });

  it('limits each user separately', () => {
    const { limiter } = createLimiter();

    limiter.tryAcquire(1);

    expect(limiter.tryAcquire(2)).toBe(true);
  });

  it('forgets a user', () => {
    const { limiter } = createLimiter();

    limiter.tryAcquire(1);
    limiter.forget(1);

    expect(limiter.tryAcquire(1)).toBe(true);
  });
});
