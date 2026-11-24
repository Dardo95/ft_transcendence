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
    battlefield: 'ENTRA NELL’ARENA',
    subTitle:
      'Registrati o accedi per partecipare a partite multigiocatore, sfidare altri giocatori e connetterti con gli amici.',
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
    activeMatchCheckFailed:
      'Impossibile verificare se hai una partita in corso. Aggiorna la lobby e riprova.',
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
    badge: 'GUIDA AL GIOCO ft_bomberman',
    title: 'Informazioni sul gioco',
    subtitle:
      'Attraversa labirinti con blocchi distruttibili, piazza bombe, raccogli potenziamenti e sopravvivi agli avversari in questa arena multiplayer online.',
    controlsTitle: 'Comandi',
    controlsSpace: 'SPAZIO',
    movementTitle: 'Movimento',
    movementDescription:
      'Muoviti usando uno dei due gruppi di tasti. Non è possibile muoversi in diagonale.',
    wasdLabel: 'WASD',
    arrowKeysLabel: 'Frecce',
    or: 'oppure',
    moveUp: 'Muovi verso l’alto',
    moveDown: 'Muovi verso il basso',
    moveLeft: 'Muovi a sinistra',
    moveRight: 'Muovi a destra',
    actionTitle: 'Bomba',
    actionDescription: 'Premi la barra spaziatrice per piazzare una bomba.',
    placeBomb: 'Piazza una bomba',
    objectiveTitle: 'Obiettivo',
    objectiveDescription:
      'Sopravvivi e diventa l’ultimo giocatore rimasto. Le bombe possono eliminare anche te: pianifica una via di fuga prima di piazzarle.',
    mechanicsTitle: 'Meccaniche principali',
    mechanics: {
      bombPlacement: {
        label: 'Posizionamento delle bombe',
        description:
          'Piazza bombe per distruggere i blocchi e intrappolare gli avversari nell’esplosione. Controlla la miccia e allontanati prima della detonazione.',
      },
      powerUps: {
        label: 'Power-up',
        description:
          'Distruggi i blocchi per trovare potenziamenti per il raggio delle esplosioni, il numero di bombe piazzabili e la velocità di movimento.',
      },
      multiplayer: {
        label: 'Multigiocatore',
        description:
          'Sfida amici o altri giocatori online. Scegli una partita di pratica in solitaria, una partita privata nella lobby o il matchmaking aperto.',
      },
    },
    matchModesTitle: 'Scegli una modalità di gioco',
    modes: {
      practice: {
        label: 'Pratica',
        description:
          'Gioca da solo contro un bot per imparare i comandi e mettere alla prova la tua strategia.',
      },
      private: {
        label: 'Partita privata',
        description:
          'Gioca con 2–4 partecipanti della lobby attuale in una partita privata.',
      },
      public: {
        label: 'Matchmaking pubblico',
        description:
          'Entra nella coda aperta. La partita inizia con almeno 2 giocatori e può ospitarne fino a 4.',
      },
    },
    demoTitle: 'Prova l’arena',
    demoDescription:
      'Usa l’anteprima interattiva per provare a muoverti, piazzare bombe e sfuggire alle esplosioni.',
  },
  notFound: {
    badge: 'ERROR 404',
    title: 'Pagina non trovata',
    subtitle:
      'La pagina che cerchi non esiste, è stata spostata o l’URL non è corretto.',
    requestedPath: 'Percorso richiesto',
    backLobby: 'Torna alla lobby',
    backHome: 'Vai al login',
    goBack: 'Indietro',
    quickLinks: 'Navigazione rapida',
    quickLinksHint:
      'Scopri le regole, la suddivisione del progetto o conosci il team.',
  },
  game: {
    viewportLabel: 'Area di gioco',
    sidebarLabel: 'Pannello laterale della partita',
  },
  hud: {
    health: 'Vite',
    bombs: 'Bombe',
    blast: 'Raggio',
    speed: 'Velocità',
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
    deadTitle: 'Sei morto',
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
    players: 'Giocatori',
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
