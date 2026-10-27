/**
 * Italian application translations.
 * Category: Translation Resource
 *
 * Contains user-facing strings grouped by domain so they can be found and
 * maintained easily, similar to how `auth.ts` organizes authentication texts.
 *
 * Translation resources must not contain application logic.
 */

export const appIt = {
  general: {
    title: 'ft_bomberman',
    battlefield: 'LA CUCINA È UN CAMPO DI BATTAGLIA',
    subTitle:
      'Alta cucina, distruzione, pentole a pressione e vapore scatenato. Registrati o accedi per utilizzare il servizio.',
    userLabel: 'Utente',
    connectedAs: 'Connesso come',
    termsOfService: 'Termini di servizio',
    privacyPolicy: 'Informativa sulla privacy',
    aboutUs: 'Informazioni su di noi',
    aboutGame: 'Informazioni sul gioco',
    aboutProject: 'Informazioni sul progetto',
    stats: 'Statistiche del gioco',
    profile: 'Profilo dello utente',
    game: 'Bomberman',
    notFound: '404 Non trovato',
    logout: 'Disconnetti',
    login: 'Accedi',
    register: 'Registrati',
    connected: 'Connesso al server',
    connecting: 'Connessione in corso...',
    connectingStatus: 'Connessione in corso...',
  },
  lobby: {
    lobbyTitle: 'Lobby',
    yourLobby: 'Il tuo lobby',
    players: 'Giocatori',
    host: 'Ospite',
    guest: 'Ospite',
    leaveGroup: 'Abbandona gruppo',
    preparingGroup: 'Preparando il tuo gruppo...',
    syncingLobby: 'Stiamo sincronizzando il tuo lobby con il server.',
    lobbyInvitations: 'Inviti al Lobby',
    invitesYou: 'ti invita al suo lobby.',
    leaveBeforeAccept:
      'Abbandona il tuo gruppo attuale prima di accettare un altro invito.',
    lobbyChat: 'Chat del Lobby',
    sendMessagePlaceholder: 'Invia un messaggio al tuo lobby...',
    sendButton: 'Invia',
    joinLobbyToChat:
      'Entra in un lobby per utilizzare la chat privata con i suoi membri.',

    modeLabel: 'Modalità',
    modePracticeTitle: 'Pratica',
    modePracticeSub: '1 vs Bot',
    modePrivateTitle: 'Partita Privata',
    modePrivateSub: 'Solo membri della sala',
    modePublicTitle: 'Partita Pubblica',
    modePublicSub: 'Matchmaking aperto',

    mapLabel: 'Mappa Selezionata',
    mapRedName: 'Red Map',
    mapOrangeName: 'Orange Map',
    mapYellowName: 'Yellow Map',
    activeLabel: 'Attivo',

    settingsLabel: 'Impostazioni',
    initialBombsLabel: 'Bombe iniziali',
    initialSpeedLabel: 'Velocità base',
    fuseTimeLabel: 'Miccia',
    fixedPublicLabel: 'Valori fissi in pubblico',
    hostOnlyLabel: 'Solo host',

    matchmakingPracticeText: 'Inizia Pratica (1 vs Bot)',
    matchmakingPrivateHostText: 'Inizia Partita Privata',
    matchmakingPrivateGuestText: "In attesa dell'host...",
    matchmakingPublicText: 'Inizia Servizio (Cerca Giocatori)',
    searchingText: 'Ricerca giocatori...',
    cancelText: 'Annulla',
    searchInfoText:
      'In attesa di giocatori pubblici (avvio automatico con 4 giocatori o al timeout se >=2 giocatori).',
    needPrivateText:
      'Sono necessari almeno 2 giocatori nella sala per iniziare in privato.',
    needPublicText:
      'Sono necessari almeno 2 giocatori per iniziare in pubblico.',
    practiceInfoText:
      'Puoi iniziare la pratica in qualsiasi momento, poiché è un gioco 1v1 contro un bot.',
  },
  friends: {
    friendList: 'Lista amici',
    addFriendPlaceholder: 'Aggiungi amico: Inserisci il nome utente esatto',
    addFriendButton: 'Invia',
    friendRequestSent: 'Richiesta inviata a',
    requestSendError: "Errore nell'invio della richiesta",
    friendRequestsTitle: 'Richieste di amicizia',
    friendRequestText: 'ti ha inviato una richiesta di amicizia.',
    inviteLobbyTitle: 'Invita amico al lobby',
    inviteLobbyPlaceholder: 'Nome utente',
    inviteLobbyButton: 'Invita',
    lobbyFull: 'Il lobby è pieno.',
    inviteOnlyFriends: "Puoi invitare solo amici con un'amicizia accettata.",
    noFriendsYet: 'Non hai ancora amici aggiunti.',
    deleteFriendTitle: 'Elimina amico',
    deleteFriendConfirm: 'Sei sicuro di voler rimuovere',
    deleteFriendConfirm2: 'dalla tua lista amici?',
    cancelButton: 'Annulla',
    removeButton: 'Rimuovi',
    spectateTitle: 'Spettare partita',
    inviteToLobby: 'Invita al lobby',
    youLabel: ' (Tu)',
    onlineStatus: 'Online',
    inGameStatus: 'In partita',
    offlineStatus: 'Offline',
  },
} as const;
