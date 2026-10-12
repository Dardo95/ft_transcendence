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
		title: "Credenciales del Chef",
		connecting: "Conectando...",
		playNow: "Empezar Servicio",
		email: "Correo electrónico",
		emailPlaceholder: "Introduce tu correo electrónico",
		password: "Contraseña",
		passwordPlaceholder: "********",
		orContinueWith: "O continuar con",
		continueGoogle: "Continuar con Google",
	},
	register: {
		title: "Registro del nuevo Chef",
		connecting: "Registrando...",
		playNow: "Registrarse",
		email: "Correo electrónico",
		emailPlaceholder: "Introduce tu correo electrónico",
		newUser: "Nuevo Usuario",
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
