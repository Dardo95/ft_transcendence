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
    tab: 'Log In',
    heading: 'Welcome back!',
    subheading: 'Log in to continue your game.',
    connecting: 'Connecting...',
    playNow: 'Enter the Game',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: '********',
    orContinueWith: 'or',
    continueGoogle: 'Continue with Google',
    noAccount: "Don't have an account?",
    registerInstead: 'Register',
  },
  register: {
    tab: 'Create Account',
    heading: 'Join us to enjoy the game',
    subheading: 'Register to start playing.',
    connecting: 'Registering...',
    playNow: 'Register',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    newUser: 'New User',
    userPlaceholder: 'Enter your user',
    password: 'Password',
    passwordPlaceholder: '********',
    alreadyHaveAccount: 'Already have an account? ',
    loginInstead: ' Log in',
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
