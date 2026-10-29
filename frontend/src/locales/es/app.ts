/**
 * Spanish application translations.
 * Category: Translation Resource
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
  aboutUs: {
    title: 'Sobre nosotros',
    subtitle:
      'Cuatro desarrolladores de 42 Madrid creando una experiencia arcade multijugador en tiempo real impulsada por arquitectura de software moderna.',
    manifesto:
      'En ft_bomberman abordamos los retos del Common Core combinando ingeniería de sistemas, concurrencia de red y rendimiento gráfico. Nuestro objetivo es ofrecer un entorno competitivo de latencia mínima, resistente a desincronizaciones y construido bajo estrictos estándares de seguridad y escalabilidad.',
  },
  aboutProject: {
    title: 'Sobre el Proyecto',
    subtitle:
      'Especificación técnica, arquitectura del sistema y desglose de módulos evaluados según la normativa oficial (ft_trascendence v21.2).',
    officialNotice:
      'Este proyecto se ha creado como parte del currículo 42 por ozamora-, brivera, enogueir y raperez-.',
  },
  aboutGame: {
    title: 'Reglas del Juego',
    subtitle:
      'Guía táctica sobre mecánicas de movimiento, colocación de bombas, tipos de bloques y catálogo de mejoras.',
  },
} as const;
