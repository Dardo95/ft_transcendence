import { describe, expect, it } from 'vitest';

import {
  AVATAR_MAX_BYTES,
  validateAvatarFile,
  validateEmail,
  validateLogin,
  validatePasswordChange,
  validateRegistration,
  validateUsername,
} from './validation';

describe('profile field validation', () => {
  it('validates username changes', () => {
    expect(validateUsername('new-name')).toBeNull();
    expect(validateUsername(' new name ')).toBe(
      'auth.validation.usernameInvalid'
    );
    expect(validateUsername('ab')).toBe('auth.validation.usernameInvalid');
    expect(validateUsername('')).toBe('auth.validation.usernameRequired');
  });

  it('validates email changes', () => {
    expect(validateEmail('new@example.com')).toBeNull();
    expect(validateEmail('not-an-email')).toBe('auth.validation.emailInvalid');
    expect(validateEmail('')).toBe('auth.validation.emailRequired');
  });
});

describe('validateLogin', () => {
  it('accepts a valid email and password', () => {
    expect(
      validateLogin({ email: 'player@example.com', password: 'secret' })
    ).toEqual({});
  });

  it('rejects empty and malformed emails', () => {
    expect(validateLogin({ email: '', password: 'secret' }).email).toBe(
      'auth.validation.emailRequired'
    );
    expect(
      validateLogin({ email: 'not-an-email', password: 'secret' }).email
    ).toBe('auth.validation.emailInvalid');
  });

  it('rejects an empty password', () => {
    expect(
      validateLogin({ email: 'player@example.com', password: '' }).password
    ).toBe('auth.validation.passwordRequired');
  });
});

describe('validateRegistration', () => {
  const validValues = {
    username: 'player-one',
    email: 'player@example.com',
    password: 'a-long-password',
    confirmPassword: 'a-long-password',
  };

  it('accepts valid registration data', () => {
    expect(validateRegistration(validValues)).toEqual({});
  });

  it('rejects usernames with spaces or invalid lengths', () => {
    expect(
      validateRegistration({ ...validValues, username: 'player one' }).username
    ).toBe('auth.validation.usernameInvalid');
    expect(
      validateRegistration({ ...validValues, username: 'ab' }).username
    ).toBe('auth.validation.usernameInvalid');
  });

  it('rejects short passwords and mismatched confirmation', () => {
    expect(
      validateRegistration({
        ...validValues,
        password: 'short',
        confirmPassword: 'short',
      }).password
    ).toBe('auth.validation.passwordTooShort');

    expect(
      validateRegistration({
        ...validValues,
        confirmPassword: 'different-password',
      }).confirmPassword
    ).toBe('auth.validation.passwordMismatch');
  });
});

describe('validatePasswordChange', () => {
  const values = {
    currentPassword: 'old-password',
    newPassword: 'new-password',
    confirmPassword: 'new-password',
  };

  it('accepts a valid password change', () => {
    expect(validatePasswordChange(values)).toEqual({});
  });

  it('rejects a new password equal to the current one', () => {
    expect(
      validatePasswordChange({
        ...values,
        newPassword: values.currentPassword,
        confirmPassword: values.currentPassword,
      }).newPassword
    ).toBe('auth.validation.samePassword');
  });

  it('requires the confirmation to match', () => {
    expect(
      validatePasswordChange({
        ...values,
        confirmPassword: 'different-password',
      }).confirmPassword
    ).toBe('auth.validation.passwordMismatch');
  });
});

describe('validateAvatarFile', () => {
  it('accepts allowed image types under the size limit', () => {
    expect(
      validateAvatarFile({ type: 'image/png', size: AVATAR_MAX_BYTES })
    ).toBeNull();
    expect(validateAvatarFile({ type: 'image/webp', size: 1024 })).toBeNull();
  });

  it('rejects unsupported types, empty files and oversized images', () => {
    expect(validateAvatarFile({ type: 'image/gif', size: 1024 })).toBe(
      'auth.validation.avatarType'
    );
    expect(validateAvatarFile({ type: 'image/png', size: 0 })).toBe(
      'auth.validation.avatarEmpty'
    );
    expect(
      validateAvatarFile({ type: 'image/png', size: AVATAR_MAX_BYTES + 1 })
    ).toBe('auth.validation.avatarTooLarge');
  });
});
