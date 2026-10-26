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
  getMe,
} from '../service/authService';
import type { AuthCredentials, UserPublic } from '@transcendence/shared';
import { resolveAuthErrorKey } from '../utils/authErrorMessage';

export interface AuthState {
  // State
  user: UserPublic | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  error: string | null;
  authErrorKey: string | null;

  // Actions
  checkAuth: () => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setAuthErrorKey: (key: string | null) => void;
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
      const response = await getMe();
      set({
        user: 'user' in response ? response.user : response,
        isAuthenticated: true,
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
      const response = await getMe();
      set({
        user: 'user' in response ? response.user : response,
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
      const response = await getMe();
      set({
        user: 'user' in response ? response.user : response,
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
  setAuthErrorKey: (key: string | null) => set({ authErrorKey: key }),
}));
