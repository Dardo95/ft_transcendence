/**
 * Italian authentication translations.
 * Category: Translation Resource
 *
 * Contains user-facing strings related to:
 * - Login.
 * - Registration.
 * - Authentication errors.
 *
 * Translation resources must not contain application logic.
 */

export const authIt = {
  login: {
    tag: 'Accedi',
    heading: 'Bentornato!',
    subheading: 'Accedi per continuare la tua partita.',
    connecting: 'Connessione...',
    playNow: 'Inizia il gioco',
    email: 'Email',
    emailPlaceholder: 'Inserisci il tuo indirizzo email',
    password: 'Password',
    passwordPlaceholder: '********',
    orContinueWith: 'o',
    continueGoogle: 'Continua con Google',
    noAccount: 'Non hai un account?',
    registerInstead: 'Registrati',
  },
  register: {
    tag: 'Crea un account',
    heading: 'Unisciti a noi per divertirti con il gioco!',
    subheading: 'Registrati per iniziare a giocare.',
    connecting: 'Registrando...',
    playNow: 'Registrarsi',
    email: 'Email',
    emailPlaceholder: 'Inserisci il tuo indirizzo email',
    newUser: 'Nuovo Utente',
    userPlaceholder: 'Inserisci il nome utente',
    password: 'Password',
    passwordPlaceholder: '********',
    alreadyHaveAccount: 'Hai già un account? ',
    loginInstead: ' Accedi invece',
  },
  status: {
    loggedIn: 'Accesso effettuato',
    notLoggedIn: 'Accesso non effettuato',
    userLabel: 'Utente',
    logout: 'Esci',
    loggingOut: 'Disconnessione...',
  },
  errors: {
    login: "Impossibile effettuare l'accesso.",
    register: "Impossibile registrare l'account.",
    logout: 'Impossibile effettuare la disconnessione.',
    emailTaken: 'Questa email o questo nome utente è già in uso.',
    invalidCredentials: 'Email o password non corretti.',
    validation: 'Controlla i dati del modulo.',
    network: 'Impossibile connettersi al server.',
  },
};
