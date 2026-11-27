/** Minimum time between two global chat messages from the same user. */
export const CHAT_COOLDOWN_MS = 500;

/**
 * Per-user rate limit for the global chat (CHAT-B-06): at most one
 * message every `cooldownMs` (2 per second by default).
 */
export class ChatRateLimiter {
  private readonly lastMessageAt = new Map<number, number>();

  constructor(
    private readonly cooldownMs = CHAT_COOLDOWN_MS,
    private readonly now: () => number = Date.now
  ) {}

  /** Returns true and records the message when the user may send now. */
  tryAcquire(userId: number): boolean {
    const now = this.now();
    const last = this.lastMessageAt.get(userId);

    if (last !== undefined && now - last < this.cooldownMs) {
      return false;
    }

    this.lastMessageAt.set(userId, now);
    return true;
  }

  /** Forgets a user, so the map does not grow with users who left. */
  forget(userId: number): void {
    this.lastMessageAt.delete(userId);
  }
}
