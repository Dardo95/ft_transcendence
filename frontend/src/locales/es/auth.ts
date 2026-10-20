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
    tab: 'Iniciar sesión',
    heading: '¡Bienvenido de nuevo!',
    subheading: 'Inicia sesión para volver a la partida.',
    connecting: 'Conectando...',
    playNow: 'Empezar a jugar',
    email: 'Correo electrónico',
    emailPlaceholder: 'Introduce tu correo electrónico',
    password: 'Contraseña',
    passwordPlaceholder: '********',
    orContinueWith: 'o continua con',
    continueGoogle: 'Google',
    noAccount: '¿No tienes cuenta?',
    registerInstead: 'Regístrate',
  },
  register: {
    tab: 'Crear cuenta',
    heading: '¡Únete para disfrutar del juego!',
    subheading: 'Regístrate para empezar a jugar.',
    connecting: 'Registrando...',
    playNow: 'Registrarse',
    email: 'Correo electrónico',
    emailPlaceholder: 'Introduce tu correo electrónico',
    newUser: 'Nuevo Usuario',
    userPlaceholder: 'Introduce tu nombre de usuario',
    password: 'Contraseña',
    passwordPlaceholder: '********',
    alreadyHaveAccount: '¿Ya tienes cuenta? ',
    loginInstead: ' Inicia sesión',
  },
  status: {
    loggedIn: 'Sesión iniciada',
    notLoggedIn: 'Sesión no iniciada',
    userLabel: 'Usuario',
    logout: 'Cerrar sesión',
    loggingOut: 'Cerrando sesión...',
  },
  errors: {
    login: 'No se ha podido iniciar sesión.',
    register: 'No se ha podido registrar la cuenta.',
    logout: 'No se ha podido cerrar sesión.',
  },
} as const;
