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
import type {
  AuthCredentials,
  AuthResponse,
  UserPublic,
} from '@transcendence/shared';

function normalizeUser(user: AuthResponse['user']): UserPublic | null {
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
  user: UserPublic | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  checkAuth: () => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// Creation of the store with persistence in localStorage
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const userData = await getMe();
      set({
        user: normalizeUser(userData.user),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (credentials: AuthCredentials) => {
    set({ isLoading: true });
    try {
      await loginUser(credentials);

      // After successful login, fetch the authenticated user's data
      const userData = await getMe();
      set({
        user: normalizeUser(userData.user),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (credentials: AuthCredentials) => {
    set({ isLoading: true });
    try {
      await registerUser(credentials);
      await loginUser({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUser();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
