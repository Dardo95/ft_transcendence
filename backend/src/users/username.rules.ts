import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
// 3-20 characters, no whitespace. Single source of truth for usernames.
export const USERNAME_PATTERN = /^\S{3,20}$/;

export function isValidUsername(value: string): boolean {
  return USERNAME_PATTERN.test(value);
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
