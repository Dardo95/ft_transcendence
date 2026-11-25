// Password rules shared by the frontend and the backend.

// Keep these values as the single source of truth for password limits.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

// 8-128 characters with at least one letter and one digit.
export const PASSWORD_REGEX = new RegExp(
  `^(?=.*[A-Za-z])(?=.*\\d).{${PASSWORD_MIN_LENGTH},${PASSWORD_MAX_LENGTH}}$`,
);

// Pure format check: callers map failures to user-facing (localized) messages.
export function isValidPasswordFormat(value: string): boolean {
  return PASSWORD_REGEX.test(value);
}
