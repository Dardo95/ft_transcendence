/**
 * Italian application translations.
 * Category: Translation Resource
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
    userEnteredLobby: 'è entrato nel Lobby',
    userLeftLobby: 'è uscito dal Lobby',
    sendMessagePlaceholder: 'Invia un messaggio al tuo lobby...',
    sendButton: 'Invia',
    acceptButton: 'Accetta',
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
    map1Name: 'Red Map',
    map2Name: 'Orange Map',
    map3Name: 'Yellow Map',
    activeLabel: 'Attivo',

    settingsLabel: 'Impostazioni',
    initialBombsLabel: 'Bombe iniziali',
    initialSpeedLabel: 'Velocità base',
    fuseTimeLabel: 'Miccia',
    fixedPublicLabel: 'Valori fissi in pubblico',
    hostOnlyLabel: 'Solo host',

    matchmakingPracticeText: 'Inizia Partita di Pratica',
    matchmakingPrivateHostText: 'Inizia Partita Privata',
    matchmakingPrivateGuestText: "In attesa dell'host...",
    matchmakingPublicText: 'Cerca giocatori per iniziare la partita',
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
  aboutUs: {
    title: 'Informazioni su di noi',
    subtitle:
      "Quattro sviluppatori di 42 Madrid che creano un'esperienza arcade multigiocatore in tempo reale spinta da un'architettura software moderna.",
    manifesto:
      'In ft_bomberman affrontiamo le sfide del Common Core combinando ingegneria di sistemi, concorrenza di rete e prestazioni grafiche. Il nostro obiettivo è offrire un ambiente competitivo a latenza minima, resistente a disincronizzazioni, costruito secondo rigorosi standard di sicurezza e scalabilità.',
  },
  aboutProject: {
    title: 'Informazioni sul progetto',
    subtitle:
      'Specifica tecnica, architettura del sistema e suddivisione dei moduli valutati secondo la normativa ufficiale (ft_trascendencev21.2).',
    officialNotice:
      'Questo progetto è stato creato come parte del curriculum 42 da ozamora-, brivera, enogueir e raperez-.',
  },
  aboutGame: {
    title: 'Regole del Gioco',
    subtitle:
      'Guida tattica su meccaniche di movimento, posizionamento delle bombe, tipi di blocchi e catalogo di potenziamenti.',
  },
} as const;
