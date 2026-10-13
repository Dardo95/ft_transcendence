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
    title: 'Chef Credentials',
    connecting: 'Connecting...',
    playNow: 'Start Service',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: '********',
    orContinueWith: 'Or continue with',
    continueGoogle: 'Continue with Google',
  },
  register: {
    title: 'New Chef Registration',
    connecting: 'Registering...',
    playNow: 'Register',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    newUser: 'New User',
    userPlaceholder: 'Enter your user',
    password: 'Password',
    passwordPlaceholder: '********',
  },
  status: {
    loggedIn: 'Logged in',
    notLoggedIn: 'Not logged in',
    userLabel: 'User',
    logout: 'Log out',
    loggingOut: 'Logging out...',
  },
  errors: {
    login: 'Unable to log in.',
    register: 'Unable to register the account.',
    logout: 'Unable to log out.',
  },
};
