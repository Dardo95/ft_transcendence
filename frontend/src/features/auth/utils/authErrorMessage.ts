import { ApiError } from '@/api/api';

type AuthMode = 'login' | 'register';

export function resolveAuthErrorKey(error: unknown, mode: AuthMode): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return 'auth.errors.emailTaken';
    }
    if (error.status === 401) {
      return 'auth.errors.invalidCredentials';
    }
    if (error.status === 400) {
      return 'auth.errors.validation';
    }
    return mode === 'login' ? 'auth.errors.login' : 'auth.errors.register';
  }

  return 'auth.errors.network';
}
