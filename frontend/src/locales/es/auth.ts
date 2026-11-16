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
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    orContinueWith: 'o',
    continueGoogle: 'Continuar con Google',
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
    newUser: 'Nuevo usuario',
    userPlaceholder: 'Introduce tu nombre de usuario',
    password: 'Contraseña',
    passwordPlaceholder: '********',
    confirmPassword: 'Confirmar contraseña',
    confirmPasswordPlaceholder: 'Repite tu contraseña',
    passwordHint: 'Al menos 8 caracteres.',
    alreadyHaveAccount: '¿Ya tienes cuenta? ',
    loginInstead: ' Inicia sesión',
  },
  validation: {
    emailRequired: 'El correo electrónico es obligatorio.',
    emailInvalid: 'Introduce un correo electrónico válido.',
    emailTooLong: 'El correo no puede superar los 254 caracteres.',
    usernameRequired: 'El nombre de usuario es obligatorio.',
    usernameInvalid:
      'El nombre debe tener entre 3 y 20 caracteres y no contener espacios.',
    passwordRequired: 'La contraseña es obligatoria.',
    passwordTooShort: 'La contraseña debe tener al menos 8 caracteres.',
    passwordTooLong: 'La contraseña no puede superar los 128 caracteres.',
    passwordConfirmationRequired: 'Confirma la nueva contraseña.',
    passwordMismatch: 'Las contraseñas no coinciden.',
    currentPasswordRequired: 'Introduce tu contraseña actual.',
    currentPasswordInvalid: 'La contraseña actual no es correcta.',
    samePassword: 'La nueva contraseña debe ser diferente de la actual.',
    passwordUpdateFailed:
      'No se pudo cambiar la contraseña. Inténtalo de nuevo.',
    oauthAccount: 'Las cuentas de Google no tienen contraseña local.',
    avatarType: 'Solo se permiten imágenes JPG, PNG o WebP.',
    avatarTooLarge: 'La imagen debe pesar 2 MB o menos.',
    avatarEmpty: 'El archivo seleccionado está vacío.',
    avatarInvalidImage: 'No se pudo procesar la imagen.',
    avatarUploadFailed: 'No se pudo subir el avatar. Inténtalo de nuevo.',
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
    emailTaken: 'Ese correo o nombre de usuario ya está en uso.',
    invalidCredentials: 'Correo o contraseña incorrectos.',
    validation: 'Revisa los datos del formulario.',
    network: 'No se pudo conectar con el servidor.',
  },
} as const;
