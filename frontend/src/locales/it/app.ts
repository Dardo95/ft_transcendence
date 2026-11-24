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
    disconnected: 'Disconnesso',
    openSession: "Sessione aperta in un'altra finestra",
    sessionReplaced:
      "Questo account è stato aperto in un'altra scheda o dispositivo. Questa finestra è stata disconnessa.",
    reloadSession: 'Recupera sessione',
    underConstruction: 'In costruzione.',
    logoAlt: 'Logo di ft_bomberman',
    avatarAlt: 'Avatar',
    openMenu: 'Apri menu di navigazione',
    closeMenu: 'Chiudi menu di navigazione',
    userMenu: 'Menu utente',
    statsSubtitle: 'Segui le tue partite, i risultati e i progressi nel tempo.',
    matchHistory: 'Cronologia partite',
    statsEmpty: 'Nessuna partita registrata finora.',
    match: 'Partita',
    result: 'Risultato',
    date: 'Data',
  },
  lobby: {
    lobbyTitle: 'Lobby',
    yourLobby: 'Il tuo lobby',
    players: 'Giocatori',
    host: 'Host',
    guest: 'Ospite',
    leaveGroup: 'Abbandona gruppo',
    preparingGroup: 'Preparando il tuo gruppo...',
    syncingLobby: 'Stiamo sincronizzando il tuo lobby con il server.',
    lobbyInvitations: 'Inviti al Lobby',
    invitesYou: 'ti invita al suo lobby.',
    leaveBeforeAccept:
      'Abbandona il tuo gruppo attuale prima di accettare un altro invito.',
    globalChat: 'Chat Globale',
    systemLabel: 'Sistema',
    userConnected: 'si è connesso',
    userDisconnected: 'si è disconnesso',
    sendMessagePlaceholder: 'Invia un messaggio a tutti i giocatori...',
    sendButton: 'Invia',
    acceptButton: 'Accetta',

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

    // Notices
    noticeLobbyCreated: 'Lobby creato correttamente',
    noticeJoinedLobby: 'Ti sei unito al lobby',
    noticeLeftLobby: 'Hai lasciato il lobby',
    noticeInvitationSent: 'Invitazione inviata a',

    // Error texts
    errorNotConnected: 'Non sei connesso al server',
    errorEnterUsername: 'Inserisci un nome utente',

    // Info texts
    searchInfoText:
      'In attesa di giocatori pubblici (avvio automatico con 4 giocatori o al timeout se >=2 giocatori).',
    needPrivateText:
      'Sono necessari almeno 2 giocatori nella sala per iniziare in privato.',
    needPublicText:
      'Sono necessari almeno 2 giocatori per iniziare in pubblico.',
    practiceInfoText:
      'Puoi iniziare la pratica in qualsiasi momento, poiché è un gioco 1v1 contro un bot.',
    matchmakingFailed: 'Impossibile avviare la partita. Riprova.',
    matchmakingActiveGame:
      'Hai già una partita in corso. Falla terminare prima di iniziarne una nuova.',
    activeMatchNotice:
      'Hai già una partita in corso. Torna a giocarla per continuare.',
    returnToActiveMatch: 'Torna alla partita in corso',
    socketOnline: 'SOCKET ONLINE',
    socketOffline: 'SOCKET OFFLINE',
    enterLobbyPrefix: 'Benvenuto nella Lobby, ',
    bannerDescription:
      'Configura la tua partita. Il server gestisce movimento, bombe, esplosioni, potenziamenti e vittoria.',
    bombsReady: 'BOMBE PRONTE / MODALITÀ GIOCATORE',

    // Additional UI labels
    playerFallback: 'Giocatore',
    cancelSearch: 'Annulla ricerca',
    cancelSearchHint: 'Puoi annullare la ricerca in qualsiasi momento.',
    confirmedPlayers: 'giocatori confermati',
    connectingEngine: 'Connessione al motore di gioco...',
    controlsLabel: 'Controlli: WASD / frecce · SPAZIO per piazzare una bomba',
    creatingMatch: 'Creazione partita...',
    hostOnlyStartText: "Solo l'host può avviare la partita privata.",
    mapHint: 'Scegli una mappa',
    map1Hint: '13 × 11 · classica',
    map2Hint: '13 × 11 · aperta',
    map3Hint: '13 × 11 · labirinto',
    matchStartingIn: 'La partita inizia tra',
    maxPlayers: 'max 4',
    modeHint: 'Scegli la tua sfida',
    modePracticeBadge: 'Ideale per provare',
    modePrivateBadge: 'Solo amici',
    modePublicBadge: 'Matchmaking aperto',
    modePracticeShort: 'PRATICA',
    modePrivateShort: 'PRIVATA',
    modePublicShort: 'PUBBLICA',
    playersInGroup: 'giocatore/i nel tuo gruppo',
    preparingSearch: 'Preparazione della ricerca...',
    readyLabel: 'PRONTO A GIOCARE',
    searchDoesNotExpire: 'la ricerca non scade',
    searchingMatch: 'RICERCA PARTITA',
    searchingPlayers: 'Ricerca giocatori...',
    settingsHint: 'Personalizza la partita',
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
    rejectButton: 'Rifiuta',
    removeButton: 'Rimuovi',
    spectateTitle: 'Guarda la partita',
    inviteToLobby: 'Invita al lobby',
    youLabel: ' (Tu)',
    onlineStatus: 'Online',
    inGameStatus: 'In partita',
    offlineStatus: 'Offline',
    add: '+ Aggiungi',
    sent: 'Inviata',
    noResults: 'Nessun risultato trovato.',

    // Info texts
    friendSearchError: 'Errore nella ricerca di utenti',
    networkError: 'Impossibile connettersi al server.',
    friendRequestSentTo: 'Richiesta inviata a {username}',
    friendAlreadySent: 'Richiesta già inviata a {username}',
    friendNotFound: 'Utente {username} non trovato',
    friendSelfRequest: 'Non puoi aggiungere te stesso come amico',
    friendBlocked: 'Non puoi interagire con questo utente',
    sendRequestError: "Errore nell'invio della richiesta",
  },
  aboutUs: {
    title: 'Informazioni su di noi',
    teamBadge: 'Team di 42 Madrid',
    subtitle:
      "Quattro sviluppatori di 42 Madrid che costruiscono un'esperienza arcade multiplayer in tempo reale guidata da un'architettura software moderna.",
    contributionsLabel: 'Lavoro Assegnato e Punti Salienti',
    githubProfileAria: '{name} su GitHub',
    linkedinProfileAria: '{name} su LinkedIn',
    bombermanAccountAria: 'Account Bomberman di {name}',
    school42ProfileAria: 'Profilo 42 School di {name}',
    roles: {
      frontendLead: 'Project Manager QA & Frontend Lead Developer',
      frontendArchitect: 'Product Owner & Frontend Architect/Designer',
      backendLead: 'Backend Lead Developer & Real-time/Game Engine',
      devopsLead: 'Technical Architect & DevOps Engineer',
    },
    contributions: {
      member1:
        'Implementazione frontend, routing lato client e sviluppo delle pagine, motore multilingua (i18n), interfaccia per la gestione degli utenti e delle amicizie, chat.',
      member2:
        'Architettura frontend, creazione di illustrazioni, sviluppo delle pagine, motore multilingua (i18n) e progettazione del frontend di gioco.',
      member3:
        "Autenticazione utente (inclusa l'integrazione con Google e JWT), implementazione di WebSocket, funzionalità di chat, matchmaking in tempo reale e motore di gioco.",
      member4:
        'Orchestrazione del deployment tramite Docker Compose, reverse proxy Nginx, utilizzo di Prisma ORM con seed, gestione delle relazioni di amicizia, autenticazione utente e gestione degli avatar.',
    },
  },
  aboutGame: {
    title: 'ft_bomberman',
    subtitle:
      'Ispirato a Bomberman, la classica serie di videogiochi di strategia e labirinti creata originariamente da Hudson Soft nel 1983 e oggi di proprietà di Konami. Progetto di 42 Madrid.',
    mechanicsTitle: 'Meccanica principale',
    mechanics: {
      bombPlacement: {
        label: 'Posizionamento delle bombe',
        description:
          'il giocatore si muove in un labirinto e posiziona esplosivi in modo strategico per distruggere muri ed eliminare i nemici.',
      },
      powerUps: {
        label: 'Power-up',
        description:
          "distruggendo i blocchi si ottengono miglioramenti, come maggiore raggio dell'esplosione, più bombe simultanee o maggiore velocità di movimento.",
      },
      multiplayer: {
        label: 'Multigiocatore',
        description:
          'è celebre per le sue frenetiche modalità competitive, sia in locale che online, per più giocatori.',
      },
    },
  },
  game: {
    viewportLabel: 'Area di gioco',
    sidebarLabel: 'Pannello laterale della partita',
  },
  hud: {
    health: 'Vite',
    bombs: 'Pentole',
    blast: 'Vapore',
    speed: 'Caffè',
    time: 'Tempo',
    rivals: 'Avversari',
    remaining: 'Rimanenti',
    alive: 'In piedi',
    down: 'Fuori',
  },

  topbar: {
    practiceMatch: 'Partita pratica',
    time: 'Tempo',
    overtime: 'Tempo supplementare',
    survivors: 'Sopravvissuti',
    map: 'Mappa',
    exitFullscreen: 'Esci da schermo intero',
    enterFullscreen: 'Entra in schermo intero',
    leave: 'Esci',
  },
  endScreen: {
    deadTitle: 'ciao ciao arrivederci',
    victoryTitle: 'Hai vinto',
    defeatTitle: 'Hai perso',
    drawTitle: 'Pareggio',
    returnLobby: 'Torna alla lobby',
    keepWatching: 'Continua a guardare',
    restart: 'Ricomincia',
  },
  joinFailure: {
    notFoundTitle: 'Partita non trovata',
    notFoundSubtitle: 'Questa partita non esiste o è già terminata.',
    connectionLostTitle: 'Impossibile connettersi al server',
    connectionLostSubtitle: 'Il server non ha risposto in tempo.',
    retry: 'Riprova',
  },
  sidebar: {
    inKitchen: 'In cucina',
    yourStats: 'Le tue statistiche',
    you: 'Tu',
    bombs: 'Bombe',
    blast: 'Raggio',
    speed: 'Velocità',
  },
  legend: {
    title: 'Informazioni',
    wall: 'Muro indivisibile',
    crate: 'Muro distruttibile',
    bomb: 'Bomba',
    powerUp: 'Power-up',
  },
} as const;
