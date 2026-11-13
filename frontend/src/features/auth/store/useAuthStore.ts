/**
 * Authentication state store.
 * Category: State Management
 *
 * Responsible for:
 * - Storing the current authenticated user.
 * - Tracking authentication state.
 * - Providing authentication state actions.
 *
 * Does not:
 * - Render UI.
 * - Contain React components.
 * - Perform API requests directly.
 */

import { create } from 'zustand';
import {
  loginUser,
  logoutUser,
  registerUser,
  fetchSession,
} from '../service/authService';
import type { AuthCredentials, UserPrivate } from '@transcendence/shared';
import { resolveAuthErrorKey } from '../utils/authErrorMessage';
import type { TranslationKey } from '@/locales/translations';

export interface AuthState {
  // State
  user: UserPrivate | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  error: string | null;
  authErrorKey: TranslationKey | null;

  // Actions
  checkAuth: () => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setAuthErrorKey: (key: TranslationKey | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  error: null,
  authErrorKey: null,

  checkAuth: async () => {
    set({ error: null, authErrorKey: null });
    try {
      const user = await fetchSession();
      set({
        user,
        isAuthenticated: user !== null,
        isAuthChecked: true,
        error: null,
        authErrorKey: null,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isAuthChecked: true,
        error: null,
        authErrorKey: null,
      });
    }
  },

  login: async (credentials: AuthCredentials) => {
    set({ error: null, authErrorKey: null });
    try {
      await loginUser(credentials);
      const user = await fetchSession();
      if (!user) throw new Error('Unable to load user session');
      set({
        user,
        isAuthenticated: true,
        isAuthChecked: true,
        error: null,
        authErrorKey: null,
      });
    } catch (error) {
      const key = resolveAuthErrorKey(error, 'login');
      set({
        user: null,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Login error',
        authErrorKey: key,
        isAuthChecked: true,
      });
    }
  },

  register: async (credentials: AuthCredentials) => {
    set({ error: null, authErrorKey: null });
    try {
      await registerUser(credentials);
      await loginUser({
        email: credentials.email,
        password: credentials.password,
      });
      const user = await fetchSession();
      if (!user) throw new Error('Unable to load user session');
      set({
        user,
        isAuthenticated: true,
        isAuthChecked: true,
        error: null,
        authErrorKey: null,
      });
    } catch (error) {
      const key = resolveAuthErrorKey(error, 'register');
      set({
        user: null,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Register error',
        authErrorKey: key,
        isAuthChecked: true,
      });
    }
  },

  logout: async () => {
    set({ error: null, authErrorKey: null });
    try {
      await logoutUser();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        authErrorKey: null,
      });
    }
  },

  clearError: () => set({ error: null, authErrorKey: null }),
  setAuthErrorKey: (key: TranslationKey | null) => set({ authErrorKey: key }),
}));
