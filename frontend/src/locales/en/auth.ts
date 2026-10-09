/**
 * English authentication translations.
 * Category: Translation Resource
 *
 * Contains user-facing strings related to:
 * - Login.
 * - Registration.
 * - Authentication errors.
 *
 * Translation resources must not contain application logic.
 */

export const authEn = {
	login: {
		title: "Log In",
		connecting: "Connecting...",
		playNow: "Play Now",
		email: "Email",
		emailPlaceholder: "Enter your email",
		password: "Password",
		passwordPlaceholder: "********", 
	},
	register: {
		title: "New User",
		connecting: "Registering...",
		playNow: "Register",
		email: "Email",
		emailPlaceholder: "Enter your email",
		newUser: "User",
		userPlaceholder: "Enter your user",
		password: "Password",
		passwordPlaceholder: "********", 
	},
	status: {
		loggedIn: "Logged in",
		notLoggedIn: "Not logged in",
		userLabel: "User",
		logout: "Log out",
		loggingOut: "Logging out...",
	},
	errors: {
		login: "Unable to log in.",
		register: "Unable to register the account.",
		logout: "Unable to log out.",
	},
};
