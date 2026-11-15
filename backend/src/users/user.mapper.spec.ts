import { toUserPrivate, toUserPublic } from './user.mapper.js';

const row = {
  id: 1,
  username: 'brivera',
  xp: 0,
  isOnline: false,
  avatarUrl: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  email: 'brivera@example.com',
  twoFaEnabled: false,
  oauthProvider: 'google',
  password: 'argon2-hash',
};

describe('user mapper', () => {
  it('toUserPrivate exposes hasPassword but never the hash', () => {
    const user = toUserPrivate(row);

    expect(user.hasPassword).toBe(true);
    expect(user).not.toHaveProperty('password');
  });

  it('toUserPrivate reports hasPassword false for Google-only accounts', () => {
    expect(toUserPrivate({ ...row, password: null }).hasPassword).toBe(false);
  });

  it('toUserPublic never exposes private fields', () => {
    const user = toUserPublic(row);

    for (const key of [
      'password',
      'hasPassword',
      'oauthProvider',
      'email',
      'twoFaEnabled',
    ]) {
      expect(user).not.toHaveProperty(key);
    }
  });
});
