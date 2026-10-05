import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerUser, loginUser} from "../api/authService";
import type { AuthCredentials, AuthResponse } from "../api/authService";

// 1. Tipos de datos del estado
export interface User {
    id: string;
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

function buildUsernameFromEmail(email: string): string {
    const normalizedEmail = email.trim().toLowerCase();
    const localPart = normalizedEmail.split("@")[0]?.replace(/[^a-z0-9_]/g, "") ?? "";
    const baseName = localPart.length >= 3 ? localPart : "player";
    const hash = Array.from(normalizedEmail)
        .reduce((accumulator, character) => ((accumulator * 31) + character.charCodeAt(0)) >>> 0, 7)
        .toString(36)
        .slice(0, 4);
    const maxBaseLength = 20 - hash.length - 1;

    return `${baseName.slice(0, maxBaseLength)}-${hash}`;
}

interface AuthState {
    // Estado
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    // Acciones
    register: (credentials: AuthCredentials) => Promise<void>;
    login: (credentials: AuthCredentials) => Promise<void>;
    logout: () => void;
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
                const data = await registerUser({
                    ...credentials,
                    username: buildUsernameFromEmail(credentials.email),
                });
                
                // Guardar token en localStorage para apiFetch si fuera necesario
                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                    set({
                        user: normalizeUser(data.user),
                        token: data.token,
                        isAuthenticated: true,
                    });
                }
            },

            // Acción de Login
            login: async (credentials) => {
                const data = await loginUser(credentials);

                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                    set({
                        user: normalizeUser(data.user),
                        token: data.token,
                        isAuthenticated: true,
                    });
                }
            },

            // Acción de Logout
            logout: () => {
                localStorage.removeItem("authToken");
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            // Permite actualizar el estado directamente (ej. tras OAuth 42 o revalidación de token)
            setAuth: (user, token) => {
                localStorage.setItem("authToken", token);
                set({
                    user: user,
                    token,
                    isAuthenticated: true,
                });
            },
        }),
        {
            name: "auth-storage", // Clave con la que se guarda en el localStorage
        }
    )
);