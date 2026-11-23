// Username rules shared by the frontend and the backend.

// Keep these values as the single source of truth for username length limits.
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

// 3-20 characters, no whitespace.
export const USERNAME_REGEX = new RegExp(`^\\S{${USERNAME_MIN_LENGTH},${USERNAME_MAX_LENGTH}}$`);

// Pure format check: callers are responsible for trimming and for mapping
// failures to user-facing (localized) messages.
export function isValidUsernameFormat(value: string): boolean {
  return USERNAME_REGEX.test(value);
}
