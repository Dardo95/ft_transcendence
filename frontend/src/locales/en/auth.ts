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
    showPassword: 'Show password',
    hidePassword: 'Hide password',
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
    confirmPassword: 'Confirm password',
    confirmPasswordPlaceholder: 'Repeat your password',
    passwordHint: 'At least 8 characters.',
    alreadyHaveAccount: 'Already have an account? ',
    loginInstead: ' Log in',
  },
  validation: {
    emailRequired: 'Email is required.',
    emailInvalid: 'Enter a valid email address.',
    emailTooLong: 'Email must be 254 characters or fewer.',
    usernameRequired: 'Username is required.',
    usernameInvalid: 'Username must be 3-20 characters with no spaces.',
    passwordRequired: 'Password is required.',
    passwordTooShort: 'Password must be at least 8 characters.',
    passwordTooLong: 'Password must be 128 characters or fewer.',
    passwordConfirmationRequired: 'Confirm your new password.',
    passwordMismatch: 'Passwords do not match.',
    currentPasswordRequired: 'Enter your current password.',
    currentPasswordInvalid: 'The current password is incorrect.',
    samePassword: 'The new password must be different from the current one.',
    passwordUpdateFailed: 'Could not change the password. Try again.',
    oauthAccount: 'Google accounts do not have a local password.',
    avatarType: 'Only JPG, PNG or WebP images are allowed.',
    avatarTooLarge: 'The image must be 2 MB or smaller.',
    avatarEmpty: 'The selected file is empty.',
    avatarInvalidImage: 'The image could not be processed.',
    avatarUploadFailed: 'Could not upload the avatar. Try again.',
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
    emailTaken: 'This email or username is already in use.',
    invalidCredentials: 'Incorrect email or password.',
    validation: 'Please review the form data.',
    network: 'Could not connect to the server.',
  },
};
