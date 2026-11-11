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
    battlefield: 'LA COCINA ES UN CAMPO DE BATALLA',
    subTitle:
      'Alta cocina, destrucción, ollas a presión y vapor desatado. Regístrate o inicia sesión para entrar al servicio.',
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
    openSession: 'Sesión abierta en otra ventana',
    sessionReplaced:
      'Esta cuenta se ha iniciado en otra pestaña o dispositivo. Esta ventana ha quedado desconectada.',
    reloadSession: 'Recuperar sesión',
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
    lobbyChat: 'Chat del Lobby',
    userEnteredLobby: 'ha entrado al Lobby',
    userLeftLobby: 'ha salido del Lobby',
    sendMessagePlaceholder: 'Enviar mensaje a tu lobby...',
    sendButton: 'Enviar',
    acceptButton: 'Aceptar',
    joinLobbyToChat:
      'Entra en un lobby para utilizar el chat privado con sus miembros.',

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

    matchmakingPracticeText: 'Empezar Partida dePráctica',
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
    subtitle:
      'Cuatro desarrolladores de 42 Madrid creando una experiencia arcade multijugador en tiempo real impulsada por arquitectura de software moderna.',
    contributionsLabel: 'Trabajo Asignado y Logros',
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
  aboutProject: {
    title: 'Sobre el Proyecto',
    subtitle:
      'Especificación técnica, arquitectura del sistema y desglose de módulos evaluados según la normativa oficial (v21.2).',
    summaryMandatory: 'Obligatorio',
    summaryBonus: 'Bonus',
    mandatoryHeading: 'Módulos Obligatorios de Base',
    bonusHeading: 'Módulos Bonus (Máx 5 pts)',
    pointsLabel: 'Puntos Declarados',
    colModule: 'Módulo',
    colCategory: 'Categoría',
    colType: 'Tipo',
    colPoints: 'Puntos',
    categories: {
      web: 'Web',
      userMgmt: 'Gestión de Usuarios',
      gaming: 'Juego y UX',
      a11y: 'Accesibilidad e i18n',
    },
    types: {
      major: 'Mayor (2 pts)',
      minor: 'Menor (1 pt)',
    },
    modules: {
      frameworks: {
        title: 'Frameworks en Frontend y Backend',
        desc: 'React + Vite en cliente y arquitectura modular NestJS en servidor.',
      },
      websockets: {
        title: 'Funcionalidades en Tiempo Real (WebSockets)',
        desc: 'Bucle de juego autoritativo en servidor mediante Socket.io a baja latencia.',
      },
      interaction: {
        title: 'Interacción de Usuarios y Social',
        desc: 'Chat global y en lobby, perfiles públicos y estado de amigos en tiempo real.',
      },
      userMgmt: {
        title: 'Gestión de Usuarios Estándar y Autenticación',
        desc: 'Hashing con Argon2id, cookies HTTP-only JWT y subida de avatares.',
      },
      game: {
        title: 'Juego Completo Basado en Web',
        desc: 'Arena Bomberman 2D en tiempo real con reglas y condiciones de victoria claras.',
      },
      remote: {
        title: 'Soporte de Jugadores Remotos',
        desc: 'Partidas sincronizadas entre equipos separados y reconexión gestionada.',
      },
      multiplayer: {
        title: 'Multijugador de 3 o más Jugadores',
        desc: 'Arena simultánea para hasta 4 jugadores con sincronización de estado.',
      },
      orm: {
        title: 'Uso de un ORM para la Base de Datos',
        desc: 'Esquema relacional en PostgreSQL gestionado con Prisma y migraciones.',
      },
      i18n: {
        title: 'Soporte Multilingüe (3+ idiomas)',
        desc: 'Motor de internacionalización completo para inglés, español e italiano.',
      },
      customization: {
        title: 'Opciones de Personalización y Power-ups',
        desc: 'Objetos en mapa: mayor radio de bomba, bombas adicionales y botas de velocidad.',
      },
      stats: {
        title: 'Estadísticas e Historial de Partidas',
        desc: 'Historial de encuentros, registro de victorias/derrotas y tabla clasificatoria.',
      },
      spectator: {
        title: 'Modo Espectador',
        desc: 'Transmisión de partidas activas en tiempo real en modo sólo lectura.',
      },
    },
  },
  aboutGame: {
    title: 'Reglas del Juego',
    subtitle:
      'Guía táctica sobre mecánicas de movimiento, colocación de bombas, tipos de bloques y catálogo de mejoras.',
  },

  hud: {
    health: 'Vidas',
    bombs: 'Ollas',
    blast: 'Fuego',
    speed: 'Café',
    time: 'Tiempo',
    rivals: 'Rivales',
    remaining: 'Restantes',
    alive: 'En pie',
    down: 'Fuera',
  },

  topbar: {
    practiceMatch: 'Partida práctica',
    time: 'Tiempo',
    survivors: 'Supervivientes',
    map: 'Mapa',
    exitFullscreen: 'Salir de pantalla completa',
    leave: 'Salir',
  },
  endScreen: {
    deadTitle: 'chau chao adios',
    victoryTitle: 'Ganaste',
    defeatTitle: 'Perdiste',
    returnLobby: 'Volver al lobby',
    keepWatching: 'Seguir viendo',
  },
  sidebar: {
    inKitchen: 'En la cocina',
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
