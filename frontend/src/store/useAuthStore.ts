import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, logoutUser, registerUser } from "../api/authService";
import type { AuthCredentials, AuthResponse } from "../api/authService";

// 1. Tipos de datos del estado
export interface User {
	id: number;
	username: string;
	email: string;
	avatarUrl?: string;
}

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
	// Estado
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;

	// Acciones
	register: (credentials: AuthCredentials) => Promise<void>;
	login: (credentials: AuthCredentials) => Promise<void>;
	logout: () => Promise<void>;
	setAuth: (user: User, token: string) => void;
}

// 2. Creación del store con persistencia en localStorage
export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			// Estado inicial
			user: null,
			token: null,
			isAuthenticated: false,

			// Acción de Registro
			register: async (credentials) => {
				const data = await registerUser(credentials);
				set({
					user: normalizeUser(data.user),
					token: null,
					isAuthenticated: Boolean(data.user),
				});
			},

			// Acción de Login
			login: async (credentials) => {
				const data = await loginUser(credentials);
				set({
					user: normalizeUser(data.user),
					token: null,
					isAuthenticated: Boolean(data.user),
				});
			},

			// Acción de Logout
			logout: async () => {
				await logoutUser();
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				});
			},

			// Permite actualizar el estado directamente (ej. tras OAuth 42 o revalidación de token)
			setAuth: (user, token) => {
				set({
					user: user,
					token,
					isAuthenticated: true,
				});
			},
		}),
		{
			name: "auth-storage", // Clave con la que se guarda en el localStorage
		},
	),
);
