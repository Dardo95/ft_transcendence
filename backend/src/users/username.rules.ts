import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
  isValidUsernameFormat,
} from '@transcendence/shared';

export { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH };

// Backwards-compatible alias; username rules live in @transcendence/shared.
export const USERNAME_PATTERN = USERNAME_REGEX;

export function isValidUsername(value: string): boolean {
  return isValidUsernameFormat(value);
}

// class-validator decorator for DTO fields that carry a username.
export function IsUsername() {
  return applyDecorators(
    IsString(),
    Matches(USERNAME_PATTERN, {
      message: `username must be ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters with no spaces`,
    })
  );
}

// Turns any display name into a valid username base (used by Google sign-in).
export function toUsernameBase(raw: string): string {
  const base = raw.trim().replace(/\s+/g, '_').slice(0, USERNAME_MAX_LENGTH);
  return base.padEnd(USERNAME_MIN_LENGTH, '_');
}

// Appends "_N" while keeping the result within USERNAME_MAX_LENGTH.
export function withUsernameSuffix(base: string, suffix: number): string {
  const tail = `_${suffix}`;
  return `${base.slice(0, USERNAME_MAX_LENGTH - tail.length)}${tail}`;
}
