/**
 * Spanish authentication translations.
 * Category: Translation Resource
 *
 * Contains user-facing strings related to:
 * - Login.
 * - Registration.
 * - Authentication errors.
 *
 * Translation resources must not contain application logic.
 */

export const authEs = {
	login: {
		title: "Iniciar Sesión",
		connecting: "Conectando...",
		playNow: "Jugar ahora",
		email: "Correo electrónico",
		emailPlaceholder: "Introduce tu correo electrónico",
		password: "Contraseña",
		passwordPlaceholder: "********",
	},
	register: {
		title: "Nuevo usuario",
		connecting: "Registrando...",
		playNow: "Registrarse",
		email: "Correo electrónico",
		emailPlaceholder: "Introduce tu correo electrónico",
		newUser: "Usuario",
		userPlaceholder: "Introduce tu nombre de usuario",
		password: "Contraseña",
		passwordPlaceholder: "********",
	},
	status: {
		loggedIn: "Sesión iniciada",
		notLoggedIn: "Sesión no iniciada",
		userLabel: "Usuario",
		logout: "Cerrar sesión",
		loggingOut: "Cerrando sesión...",
	},
	errors: {
		login: "No se ha podido iniciar sesión.",
		register: "No se ha podido registrar la cuenta.",
		logout: "No se ha podido cerrar sesión.",
	},
} as const;
