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
    sendMessagePlaceholder: 'Enviar mensaje a tu lobby...',
    sendButton: 'Enviar',
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
    mapRedName: 'Red Map',
    mapOrangeName: 'Orange Map',
    mapYellowName: 'Yellow Map',
    activeLabel: 'Activo',

    settingsLabel: 'Ajustes',
    initialBombsLabel: 'Bombas iniciales',
    initialSpeedLabel: 'Velocidad base',
    fuseTimeLabel: 'Mecha',
    fixedPublicLabel: 'Valores fijos en público',
    hostOnlyLabel: 'Solo anfitrión',

    matchmakingPracticeText: 'Comenzar Práctica (1 vs Bot)',
    matchmakingPrivateHostText: 'Empezar Partida Privada',
    matchmakingPrivateGuestText: 'Esperando al anfitrión...',
    matchmakingPublicText: 'Empezar Servicio (Buscar Jugadores)',
    searchingText: 'Buscando jugadores...',
    cancelText: 'Cancelar',
    searchInfoText:
      'Esperando jugadores públicos (arranque automático con 4 jugadores o al agotar el tiempo si hay al menos 2 jugadores).',
    needPrivateText:
      'Se necesita al menos 2 jugadores en la sala para empezar en modo privado.',
    needPublicText:
      'Se necesita al menos 2 jugadores en la sala para empezar en modo público.',
    practiceInfoText:
      'Se puede empezar la práctica en cualquier momento, ya que es un modo de juego individual contra un bot.',
  },
  friends: {
    friendList: 'Lista de Amigos',
    addFriendPlaceholder: 'Añadir amigo: Introducir nombre de usuario exacto',
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
  },
} as const;
