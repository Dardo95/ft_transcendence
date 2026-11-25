/**
 * Spanish application translations.
 * Category: Translation Resource
 *
 * Contains user-facing strings grouped by domain so they can be found and
 * maintained easily, similar to how `auth.ts` organizes authentication texts.
 *
 * Translation resources must not contain application logic.
 */

export const appEs = {
  general: {
    title: 'ft_bomberman',
    battlefield: 'ENTRA EN LA ARENA',
    subTitle:
      'Regístrate o inicia sesión para jugar partidas multijugador, competir con otros jugadores y conectar con tus amigos.',
    userLabel: 'Usuario',
    connectedAs: 'Conectado como',
    termsOfService: 'Términos de servicio',
    privacyPolicy: 'Política de privacidad',
    aboutUs: 'Acerca de Nosotros',
    aboutGame: 'Acerca del Juego',
    aboutProject: 'Acerca del Proyecto',
    stats: 'Estadísticas del Juego',
    profile: 'Perfil de Usuario',
    game: 'Bomberman',
    notFound: '404 No Encontrado',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    connected: 'Conectado al servidor',
    connecting: 'Conectando...',
    connectingStatus: 'Conectando...',
    disconnected: 'Desconectado',
    openSession: 'Sesión abierta en otra ventana',
    sessionReplaced:
      'Esta cuenta se ha iniciado en otra pestaña o dispositivo. Esta ventana ha quedado desconectada.',
    reloadSession: 'Recuperar sesión',
    underConstruction: 'En construcción.',
    logoAlt: 'Logotipo de ft_bomberman',
    avatarAlt: 'Avatar',
    openMenu: 'Abrir menú de navegación',
    closeMenu: 'Cerrar menú de navegación',
    userMenu: 'Menú de usuario',
    statsSubtitle:
      'Consulta tus partidas, resultados y progreso a lo largo del tiempo.',
    matchHistory: 'Historial de partidas',
    statsEmpty: 'Todavía no hay partidas registradas.',
    match: 'Partida',
    result: 'Resultado',
    date: 'Fecha',
  },
  lobby: {
    lobbyTitle: 'Lobby',
    yourLobby: 'Tu lobby',
    players: 'Jugadores',
    host: 'Anfitrión',
    guest: 'Invitado',
    leaveGroup: 'Abandonar grupo',
    preparingGroup: 'Preparando tu grupo...',
    syncingLobby: 'Estamos sincronizando tu lobby con el servidor.',
    lobbyInvitations: 'Invitaciones a Lobby',
    invitesYou: 'te invita a su lobby.',
    leaveBeforeAccept:
      'Abandona tu grupo actual antes de aceptar otra invitación.',
    globalChat: 'Chat Global',
    systemLabel: 'Sistema',
    userConnected: 'se ha conectado',
    userDisconnected: 'se ha desconectado',
    sendMessagePlaceholder: 'Enviar mensaje a todos los jugadores...',
    sendButton: 'Enviar',
    acceptButton: 'Aceptar',

    modeLabel: 'Modo de Juego',
    modePracticeTitle: 'Práctica',
    modePracticeSub: '1 vs Bot',
    modePrivateTitle: 'Partida Privada',
    modePrivateSub: 'Solo miembros de la sala',
    modePublicTitle: 'Partida Pública',
    modePublicSub: 'Matchmaking abierto',

    mapLabel: 'Mapa Seleccionado',
    map1Name: 'Red Map',
    map2Name: 'Orange Map',
    map3Name: 'Yellow Map',
    activeLabel: 'Activo',

    settingsLabel: 'Ajustes',
    initialBombsLabel: 'Bombas iniciales',
    initialSpeedLabel: 'Velocidad base',
    fuseTimeLabel: 'Mecha',
    fixedPublicLabel: 'Valores fijos en público',
    hostOnlyLabel: 'Solo anfitrión',

    matchmakingPracticeText: 'Empezar Práctica',
    matchmakingPrivateHostText: 'Empezar Partida Privada',
    matchmakingPrivateGuestText: 'Esperando al anfitrión...',
    matchmakingPublicText: 'Buscar jugadores para empezar partida',
    searchingText: 'Buscando jugadores...',
    cancelText: 'Cancelar',

    // Notices
    noticeLobbyCreated: 'Lobby creado correctamente',
    noticeJoinedLobby: 'Te has unido al lobby',
    noticeLeftLobby: 'Has salido del lobby',
    noticeInvitationSent: 'Invitación enviada a',

    // Error texts
    errorNotConnected: 'No estás conectado al servidor',
    errorEnterUsername: 'Introduce un nombre de usuario',

    // Info texts
    searchInfoText:
      'Esperando jugadores públicos (arranque automático con 4 jugadores o al agotar el tiempo si hay al menos 2 jugadores).',
    needPrivateText:
      'Se necesita al menos 2 jugadores en la sala para empezar en modo privado.',
    needPublicText:
      'Se necesita al menos 2 jugadores en la sala para empezar en modo público.',
    practiceInfoText:
      'Se puede empezar la práctica en cualquier momento, ya que es un modo de juego individual contra un bot.',
    matchmakingFailed: 'No se pudo iniciar la partida. Inténtalo de nuevo.',
    matchmakingActiveGame:
      'Ya tienes una partida en curso. Termínala antes de empezar otra.',
    activeMatchNotice:
      'Ya tienes una partida en curso. Vuelve a ella para seguir jugando.',
    returnToActiveMatch: 'Ir a partida en curso',
    activeMatchCheckFailed:
      'No se pudo comprobar si tienes una partida en curso. Actualiza el lobby e inténtalo de nuevo.',
    socketOnline: 'SOCKET ONLINE',
    socketOffline: 'SOCKET OFFLINE',
    enterLobbyPrefix: 'Bienvenido al Lobby, ',
    bannerDescription:
      'Configura tu partida. El servidor controla movimiento, bombas, explosiones, mejoras y victoria.',
    bombsReady: 'BOMBAS LISTAS / MODO JUGADOR',

    // Additional UI labels
    playerFallback: 'Jugador',
    cancelSearch: 'Cancelar búsqueda',
    cancelSearchHint: 'Puedes cancelar la búsqueda en cualquier momento.',
    confirmedPlayers: 'jugadores confirmados',
    connectingEngine: 'Conectando con el motor del servidor...',
    controlsLabel: 'Controles: WASD / flechas · ESPACIO para colocar una bomba',
    creatingMatch: 'Creando partida...',
    hostOnlyStartText: 'Solo el anfitrión puede iniciar la partida privada.',
    mapHint: 'Elige un mapa',
    map1Hint: '13 × 11 · clásico',
    map2Hint: '13 × 11 · abierto',
    map3Hint: '13 × 11 · laberinto',
    matchStartingIn: 'La partida comienza en',
    maxPlayers: 'máx. 4',
    modeHint: 'Elige tu desafío',
    modePracticeBadge: 'Ideal para probar',
    modePrivateBadge: 'Sin desconocidos',
    modePublicBadge: 'Emparejamiento abierto',
    modePracticeShort: 'PRÁCTICA',
    modePrivateShort: 'PRIVADA',
    modePublicShort: 'PÚBLICA',
    playersInGroup: 'jugador(es) en tu grupo',
    preparingSearch: 'Preparando la búsqueda...',
    readyLabel: 'LISTO PARA JUGAR',
    searchDoesNotExpire: 'la búsqueda no caduca',
    searchingMatch: 'BUSCANDO PARTIDA',
    searchingPlayers: 'Buscando jugadores...',
    settingsHint: 'Personaliza la partida',
  },
  friends: {
    friendList: 'Lista de Amigos',
    addFriendPlaceholder: 'Añadir amigo: introducir nombre de usuario',
    addFriendButton: 'Enviar',
    friendRequestSent: 'Solicitud enviada a',
    requestSendError: 'Error al enviar solicitud',
    friendRequestsTitle: 'Solicitudes de amistad',
    friendRequestText: 'te envió una solicitud de amistad.',
    inviteLobbyTitle: 'Invitar amigo a lobby',
    inviteLobbyPlaceholder: 'Nombre de usuario',
    inviteLobbyButton: 'Invitar',
    lobbyFull: 'El lobby está completo.',
    inviteOnlyFriends: 'Solo puedes invitar a amigos con una amistad aceptada.',
    noFriendsYet: 'No tienes amigos añadidos aún.',
    deleteFriendTitle: 'Eliminar amigo',
    deleteFriendConfirm: '¿Estás seguro de que deseas eliminar a',
    deleteFriendConfirm2: 'de tu lista de amigos?',
    cancelButton: 'Cancelar',
    rejectButton: 'Rechazar',
    removeButton: 'Eliminar',
    spectateTitle: 'Espectar partida',
    inviteToLobby: 'Invitar a lobby',
    youLabel: ' (Tú)',
    onlineStatus: 'En línea',
    inGameStatus: 'En partida',
    offlineStatus: 'Desconectado',
    add: '+ Añadir',
    sent: 'Enviada',
    noResults: 'No se encontraron usuarios.',

    // Info texts
    friendSearchError: 'Error buscando usuarios',
    networkError: 'No se pudo conectar con el servidor.',
    friendRequestSentTo: 'Solicitud enviada a {username}',
    friendAlreadySent: 'Solicitud ya enviada a {username}',
    friendNotFound: 'Usuario {username} no encontrado',
    friendSelfRequest: 'No puedes añadirte a ti mismo como amigo',
    friendBlocked: 'No puedes interactuar con este usuario',
    sendRequestError: 'Error al enviar solicitud',
  },
  aboutUs: {
    title: 'Sobre Nosotros',
    teamBadge: 'Equipo de 42 Madrid',
    subtitle:
      'Cuatro desarrolladores de 42 Madrid creando una experiencia arcade multijugador en tiempo real impulsada por arquitectura de software moderna.',
    contributionsLabel: 'Trabajo Asignado y Logros',
    githubProfileAria: '{name} en GitHub',
    linkedinProfileAria: '{name} en LinkedIn',
    bombermanAccountAria: 'Cuenta de Bomberman de {name}',
    school42ProfileAria: 'Perfil de 42 School de {name}',
    roles: {
      frontendLead: 'Project Manager QA & Líder de Desarrollo Frontend',
      frontendArchitect: 'Product Owner y Arquitecto/Diseñador Frontend',
      backendLead: 'Líder Backend y Motor en Tiempo Real',
      devopsLead: 'Arquitecto Técnico y Ingeniero de DevOps',
    },
    contributions: {
      member1:
        'Implementación de diseño frontend, enrutamiento del lado del cliente y desarrollo de páginas, motor i18n multilenguaje, interfaz de gestión de usuarios/amistades y chat.',
      member2:
        'Arquitectura frontend, creación de ilustraciones, desarrollo de páginas, motor i18n multilenguaje y diseño frontend del juego.',
      member3:
        'Autenticación de usuarios + JWT y Google, implementación de WebSocket, funcionalidad de chat, matchmaking en vivo y motor del juego.',
      member4:
        'Despliegue y orquestación de contenedores Docker, nginx, prisma ORM con seed, gestión de relaciones de amistad, autenticación de usuarios y gestión de avatares.',
    },
  },
  aboutGame: {
    badge: 'Guia para jugar ft_bomberman',
    title: 'Sobre el Juego',
    subtitle:
      'Recorre laberintos con bloques destructibles, coloca bombas, recoge mejoras y sobrevive a tus rivales en esta arena multijugador online.',
    controlsTitle: 'Controles',
    controlsSpace: 'ESPACIO',
    movementTitle: 'Movimiento',
    movementDescription:
      'Muévete usando cualquiera de los dos grupos de teclas. No se permite el movimiento diagonal.',
    wasdLabel: 'WASD',
    arrowKeysLabel: 'Flechas',
    or: 'o',
    moveUp: 'Mover hacia arriba',
    moveDown: 'Mover hacia abajo',
    moveLeft: 'Mover hacia la izquierda',
    moveRight: 'Mover hacia la derecha',
    actionTitle: 'Bomba',
    actionDescription: 'Pulsa la barra espaciadora para colocar una bomba.',
    placeBomb: 'Colocar bomba',
    objectiveTitle: 'Objetivo',
    objectiveDescription:
      'Sobrevive y sé el último jugador en pie. Las bombas también pueden eliminarte, así que planea una ruta de escape antes de colocarlas.',
    mechanicsTitle: 'Mecánicas principales',
    mechanics: {
      bombPlacement: {
        label: 'Colocación de bombas',
        description:
          'Coloca bombas para destruir bloques y atrapar a tus rivales en la explosión. Vigila la mecha y aléjate antes de que detone.',
      },
      powerUps: {
        label: 'Power-ups',
        description:
          'Rompe bloques para encontrar mejoras de alcance de explosión, cantidad de bombas simultáneas y velocidad de movimiento.',
      },
      multiplayer: {
        label: 'Multijugador',
        description:
          'Compite online con amigos u otros jugadores. Elige práctica individual, una partida privada en tu lobby o emparejamiento abierto.',
      },
    },
    matchModesTitle: 'Elige un modo de juego',
    modes: {
      practice: {
        label: 'Práctica',
        description:
          'Juega en solitario contra un bot para aprender los controles y probar tu estrategia.',
      },
      private: {
        label: 'Partida privada',
        description:
          'Juega con entre 2 y 4 participantes de tu lobby actual en una partida privada.',
      },
      public: {
        label: 'Emparejamiento público',
        description:
          'Únete a la cola abierta. La partida empieza cuando hay al menos 2 jugadores y admite hasta 4.',
      },
    },
    demoTitle: 'Prueba la arena',
    demoDescription:
      'Usa la vista interactiva para probar el movimiento, colocar bombas y escapar de las explosiones.',
  },
  notFound: {
    badge: 'ERROR 404',
    title: 'Página no encontrada',
    subtitle:
      'La página que buscas no existe, se ha movido o la URL no es correcta.',
    requestedPath: 'Ruta solicitada',
    backLobby: 'Volver al Lobby',
    backHome: 'Ir al inicio de sesión',
    goBack: 'Volver',
    quickLinks: 'Navegación rápida',
    quickLinksHint:
      'Descubre las reglas, el desglose del proyecto o conoce al equipo.',
  },
  game: {
    viewportLabel: 'Área de juego',
    sidebarLabel: 'Panel lateral de la partida',
  },

  hud: {
    health: 'Vidas',
    bombs: 'Bombas',
    blast: 'Alcance',
    speed: 'Velocidad',
    time: 'Tiempo',
    rivals: 'Rivales',
    remaining: 'Restantes',
    alive: 'En pie',
    down: 'Fuera',
    finalSeconds: '¡Últimos 20 segundos!',
    suddenDeath: '¡Muerte súbita!',
    suddenDeathSub: 'Los muros se cierran',
  },

  topbar: {
    practiceMatch: 'Partida práctica',
    time: 'Tiempo',
    overtime: 'Tiempo extra',
    survivors: 'Supervivientes',
    map: 'Mapa',
    exitFullscreen: 'Salir de pantalla completa',
    enterFullscreen: 'Entrar en pantalla completa',
    leave: 'Salir',
  },
  endScreen: {
    deadTitle: 'Has muerto',
    victoryTitle: 'Ganaste',
    defeatTitle: 'Perdiste',
    drawTitle: 'Empate',
    returnLobby: 'Volver al lobby',
    keepWatching: 'Seguir viendo',
    restart: 'Reiniciar',
  },
  joinFailure: {
    notFoundTitle: 'Partida no encontrada',
    notFoundSubtitle: 'Esta partida no existe o ya terminó.',
    connectionLostTitle: 'No se pudo conectar al servidor',
    connectionLostSubtitle: 'El servidor no respondió a tiempo.',
    retry: 'Reintentar',
  },
  sidebar: {
    players: 'Jugadores',
    yourStats: 'Tus estadísticas',
    you: 'Tú',
    bombs: 'Bombas',
    blast: 'Alcance',
    speed: 'Velocidad',
  },
  legend: {
    title: 'Información',
    wall: 'Muro indestructible',
    crate: 'Muro destructible',
    bomb: 'Bomba',
    powerUp: 'Power-up',
  },
} as const;
