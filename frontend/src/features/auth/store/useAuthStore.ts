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
import type { AuthCredentials, AuthResponse } from '../types/auth';
import type { User } from '../../../types/user';

function normalizeUser(user: AuthResponse['user']): User | null {
  if (!user) {
    return null;
  }

  return {
    id: typeof user.id === 'number' ? user.id : Number(user.id),
    email: user.email,
    username: user.username ?? '',
    avatarUrl: user.avatarUrl,
  };
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  checkAuth: () => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Creation of the store with persistence in localStorage
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const userData = await getMe();
      set({
        user: normalizeUser(userData.user),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (credentials: AuthCredentials) => {
    set({ isLoading: true, error: null });
    try {
      await loginUser(credentials);

      // After successful login, fetch the authenticated user's data
      const userData = await getMe();
      set({
        user: normalizeUser(userData.user),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Login error',
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (credentials: AuthCredentials) => {
    set({ isLoading: true, error: null });
    try {
      await registerUser(credentials);
      await loginUser({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Register error',
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logoutUser();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
