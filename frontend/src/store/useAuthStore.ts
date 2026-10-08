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

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, logoutUser, registerUser } from "../api/authService";
import type { AuthCredentials, AuthResponse } from "../types/auth";
import type { User } from "../types/user";

function normalizeUser(user: AuthResponse["user"]): User | null {
	if (!user) {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		username: user.username ?? "",
	};
}

interface AuthState {
	// State
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;

	// Actions
	register: (credentials: AuthCredentials) => Promise<void>;
	login: (credentials: AuthCredentials) => Promise<void>;
	logout: () => Promise<void>;
	setAuth: (user: User, token: string) => void;
}

// Creation of the store with persistence in localStorage
export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			// Initial state
			user: null,
			token: null,
			isAuthenticated: false,

			// Register action
			register: async (credentials) => {
				const data = await registerUser(credentials);
				set({
					user: normalizeUser(data.user),
					token: null,
					isAuthenticated: Boolean(data.user),
				});
			},

			// Login action
			login: async (credentials) => {
				const data = await loginUser(credentials);
				set({
					user: normalizeUser(data.user),
					token: null,
					isAuthenticated: Boolean(data.user),
				});
			},

			// Logout action
			logout: async () => {
				await logoutUser();
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				});
			},

			// Allows direct state update (e.g., after OAuth 42 or token revalidation)
			setAuth: (user, token) => {
				set({
					user: user,
					token,
					isAuthenticated: true,
				});
			},
		}),
		{
			name: "auth-storage", // Key used to store in localStorage
		},
	),
);
