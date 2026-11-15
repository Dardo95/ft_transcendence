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
    tab: 'Accedi',
    heading: 'Bentornato!',
    subheading: 'Accedi per continuare la tua partita.',
    connecting: 'Connessione...',
    playNow: 'Inizia il gioco',
    email: 'Email',
    emailPlaceholder: 'Inserisci il tuo indirizzo email',
    password: 'Password',
    passwordPlaceholder: '********',
    showPassword: 'Mostra password',
    hidePassword: 'Nascondi password',
    orContinueWith: 'o',
    continueGoogle: 'Continua con Google',
    noAccount: 'Non hai un account?',
    registerInstead: 'Registrati',
  },
  register: {
    tab: 'Crea un account',
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
    confirmPassword: 'Conferma password',
    confirmPasswordPlaceholder: 'Ripeti la password',
    passwordHint: 'Almeno 8 caratteri.',
    alreadyHaveAccount: 'Hai già un account? ',
    loginInstead: ' Accedi invece',
  },
  validation: {
    emailRequired: "L'email è obbligatoria.",
    emailInvalid: 'Inserisci un indirizzo email valido.',
    emailTooLong: "L'email non può superare i 254 caratteri.",
    usernameRequired: 'Il nome utente è obbligatorio.',
    usernameInvalid:
      'Il nome utente deve avere 3-20 caratteri e non contenere spazi.',
    passwordRequired: 'La password è obbligatoria.',
    passwordTooShort: 'La password deve contenere almeno 8 caratteri.',
    passwordTooLong: 'La password non può superare i 128 caratteri.',
    passwordConfirmationRequired: 'Conferma la nuova password.',
    passwordMismatch: 'Le password non coincidono.',
    currentPasswordRequired: 'Inserisci la password attuale.',
    currentPasswordInvalid: 'La password attuale non è corretta.',
    samePassword: 'La nuova password deve essere diversa da quella attuale.',
    passwordUpdateFailed: 'Impossibile cambiare la password. Riprova.',
    oauthAccount: 'Gli account Google non hanno una password locale.',
    avatarType: 'Sono consentite solo immagini JPG, PNG o WebP.',
    avatarTooLarge: "L'immagine deve pesare 2 MB o meno.",
    avatarEmpty: 'Il file selezionato è vuoto.',
    avatarInvalidImage: "Impossibile elaborare l'immagine.",
    avatarUploadFailed: "Impossibile caricare l'avatar. Riprova.",
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
