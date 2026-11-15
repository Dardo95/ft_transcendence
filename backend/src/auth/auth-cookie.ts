import type { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE = 'access_token';

// Single definition shared by login, register, Google and profile updates.
export function accessTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  };
}
