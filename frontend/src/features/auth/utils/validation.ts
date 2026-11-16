import type { TranslationKey } from '@/locales/translations';

export const EMAIL_MAX_LENGTH = 254;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_PATTERN = /^\S{3,20}$/;
export const AVATAR_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
] as const;

export type ValidationErrorKey = Extract<
  TranslationKey,
  `auth.validation.${string}`
>;

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues extends LoginFormValues {
  username: string;
  confirmPassword: string;
}

export interface PasswordChangeFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type LoginFormErrors = Partial<
  Record<keyof LoginFormValues, ValidationErrorKey>
>;

export type RegisterFormErrors = Partial<
  Record<keyof RegisterFormValues, ValidationErrorKey>
>;

export type PasswordChangeFormErrors = Partial<
  Record<keyof PasswordChangeFormValues, ValidationErrorKey>
>;

export function validateEmail(value: string): ValidationErrorKey | null {
  const email = value.trim();

  if (!email) return 'auth.validation.emailRequired';
  if (email.length > EMAIL_MAX_LENGTH) return 'auth.validation.emailTooLong';
  if (!EMAIL_PATTERN.test(email)) return 'auth.validation.emailInvalid';

  return null;
}

export function validateUsername(value: string): ValidationErrorKey | null {
  const username = value.trim();

  if (!username) return 'auth.validation.usernameRequired';
  if (!USERNAME_PATTERN.test(username))
    return 'auth.validation.usernameInvalid';

  return null;
}

// Login only needs a non-empty password: the actual minimum length is enforced
// when the account is created, and old accounts may predate that rule.
export function validateLoginPassword(
  value: string
): ValidationErrorKey | null {
  if (!value) return 'auth.validation.passwordRequired';
  if (value.length > PASSWORD_MAX_LENGTH) {
    return 'auth.validation.passwordTooLong';
  }

  return null;
}

export function validateNewPassword(value: string): ValidationErrorKey | null {
  if (!value) return 'auth.validation.passwordRequired';
  if (value.length < PASSWORD_MIN_LENGTH) {
    return 'auth.validation.passwordTooShort';
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return 'auth.validation.passwordTooLong';
  }

  return null;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string
): ValidationErrorKey | null {
  if (!confirmation) return 'auth.validation.passwordConfirmationRequired';
  if (password !== confirmation) return 'auth.validation.passwordMismatch';

  return null;
}

export function validateLogin(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validateLoginPassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateRegistration(
  values: RegisterFormValues
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  const usernameError = validateUsername(values.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validateNewPassword(values.password);
  if (passwordError) errors.password = passwordError;

  const confirmationError = validatePasswordConfirmation(
    values.password,
    values.confirmPassword
  );
  if (confirmationError) errors.confirmPassword = confirmationError;

  return errors;
}

export function validatePasswordChange(
  values: PasswordChangeFormValues
): PasswordChangeFormErrors {
  const errors: PasswordChangeFormErrors = {};

  const currentPasswordError = validateLoginPassword(values.currentPassword);
  if (currentPasswordError) {
    errors.currentPassword = currentPasswordError;
  }

  const newPasswordError = validateNewPassword(values.newPassword);
  if (newPasswordError) {
    errors.newPassword = newPasswordError;
  } else if (values.newPassword === values.currentPassword) {
    errors.newPassword = 'auth.validation.samePassword';
  }

  const confirmationError = validatePasswordConfirmation(
    values.newPassword,
    values.confirmPassword
  );
  if (confirmationError) errors.confirmPassword = confirmationError;

  return errors;
}

export function validateAvatarFile(file: {
  type: string;
  size: number;
}): ValidationErrorKey | null {
  if (
    !AVATAR_MIME_TYPES.includes(file.type as (typeof AVATAR_MIME_TYPES)[number])
  ) {
    return 'auth.validation.avatarType';
  }
  if (file.size === 0) return 'auth.validation.avatarEmpty';
  if (file.size > AVATAR_MAX_BYTES) return 'auth.validation.avatarTooLarge';

  return null;
}
