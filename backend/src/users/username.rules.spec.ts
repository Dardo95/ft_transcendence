import {
  USERNAME_MAX_LENGTH,
  isValidUsername,
  toUsernameBase,
  withUsernameSuffix,
} from './username.rules.js';

describe('username rules', () => {
  it('accepts 3-20 characters without whitespace', () => {
    expect(isValidUsername('brivera')).toBe(true);
    expect(isValidUsername('ozamora-')).toBe(true);
    expect(isValidUsername('ab')).toBe(false);
    expect(isValidUsername('john doe')).toBe(false);
    expect(isValidUsername('a'.repeat(21))).toBe(false);
  });

  it('builds a valid base from a long Google display name', () => {
    const base = toUsernameBase('Juan Carlos Fernández de la Rosa');

    expect(base).toBe('Juan_Carlos_Fernánde');
    expect(isValidUsername(base)).toBe(true);
  });

  it('pads names shorter than the minimum length', () => {
    expect(toUsernameBase('Al')).toBe('Al_');
  });

  it('keeps suffixed usernames within the maximum length', () => {
    const name = withUsernameSuffix('a'.repeat(USERNAME_MAX_LENGTH), 12);

    expect(name).toHaveLength(USERNAME_MAX_LENGTH);
    expect(name.endsWith('_12')).toBe(true);
    expect(isValidUsername(name)).toBe(true);
  });
});
