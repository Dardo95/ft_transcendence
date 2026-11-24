/**
 * English application translations.
 * Category: Translation Resource
 */

export const appEn = {
  general: {
    title: 'ft_bomberman',
    battlefield: 'THE KITCHEN IS A BATTLEFIELD',
    subTitle:
      'High cuisine, destruction, pressure cookers and unleashed steam. Register or log in to access the service.',
    userLabel: 'User',
    connectedAs: 'Logged in as',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    aboutUs: 'About Us',
    aboutGame: 'About the Game',
    aboutProject: 'About the Project',
    stats: 'Game Statistics',
    profile: 'User Profile',
    game: 'Bomberman',
    notFound: '404 Not Found',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    connected: 'Connected to server',
    connecting: 'Connecting...',
    connectingStatus: 'Connecting...',
    disconnected: 'Disconnected',
    openSession: 'Session opened in another window',
    sessionReplaced:
      'This account has been logged in on another tab or device. This window has been disconnected.',
    reloadSession: 'Recover session',
    underConstruction: 'Under construction.',
    logoAlt: 'ft_bomberman logo',
    avatarAlt: 'Avatar',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    userMenu: 'User menu',
    statsSubtitle: 'Track your matches, results and progression over time.',
    matchHistory: 'Match history',
    statsEmpty: 'No matches recorded yet.',
    match: 'Match',
    result: 'Result',
    date: 'Date',
  },
  lobby: {
    lobbyTitle: 'Lobby',
    yourLobby: 'Your lobby',
    players: 'Players',
    host: 'Host',
    guest: 'Guest',
    leaveGroup: 'Leave group',
    preparingGroup: 'Preparing your group...',
    syncingLobby: 'We are syncing your lobby with the server.',
    lobbyInvitations: 'Lobby Invitations',
    invitesYou: 'invites you to their lobby.',
    leaveBeforeAccept:
      'Leave your current group before accepting another invitation.',
    globalChat: 'Global Chat',
    systemLabel: 'System',
    userConnected: 'has connected',
    userDisconnected: 'has disconnected',
    sendMessagePlaceholder: 'Send a message to all players...',
    sendButton: 'Send',
    acceptButton: 'Accept',

    // Mode selector
    modeLabel: 'Mode of Game',
    modePracticeTitle: 'Practice',
    modePracticeSub: '1 vs Bot',
    modePrivateTitle: 'Private Match',
    modePrivateSub: 'Room members only',
    modePublicTitle: 'Public Match',
    modePublicSub: 'Open matchmaking',

    // Map selector
    mapLabel: 'Selected Map',
    map1Name: 'Red Map',
    map2Name: 'Orange Map',
    map3Name: 'Yellow Map',
    activeLabel: 'Active',

    // Settings card
    settingsLabel: 'Settings',
    initialBombsLabel: 'Initial bombs',
    initialSpeedLabel: 'Base speed',
    fuseTimeLabel: 'Fuse',
    fixedPublicLabel: 'Fixed values in public',
    hostOnlyLabel: 'Host only',

    // Matchmaking button
    matchmakingPracticeText: 'Start Practice Match',
    matchmakingPrivateHostText: 'Start Private Match',
    matchmakingPrivateGuestText: 'Waiting for host...',
    matchmakingPublicText: 'Search Players for Match Start',
    searchingText: 'Searching players...',
    cancelText: 'Cancel',

    // Notices
    noticeLobbyCreated: 'Lobby created successfully',
    noticeJoinedLobby: 'You joined the lobby',
    noticeLeftLobby: 'You left the lobby',
    noticeInvitationSent: 'Invitation sent to',

    // Error texts
    errorNotConnected: 'You are not connected to the server',
    errorEnterUsername: 'Enter a username',

    // Info texts
    searchInfoText:
      'Waiting for public players (auto start at 4 players or timeout if >=2 players).',
    needPrivateText:
      'At least 2 players are needed in the room to start a private match.',
    needPublicText: 'At least 2 players are needed to start a public match.',
    practiceInfoText:
      'You can start practice anytime since it is a 1v1 game against a bot.',
    matchmakingFailed: 'The match could not be started. Try again.',
    matchmakingActiveGame:
      'You already have a match in progress. Finish it before starting another one.',
    activeMatchNotice:
      'You already have a match in progress. Return to it to keep playing.',
    returnToActiveMatch: 'Return to active match',
    socketOnline: 'SOCKET ONLINE',
    socketOffline: 'SOCKET OFFLINE',
    enterLobbyPrefix: 'Welcome to the Lobby, ',
    bannerDescription:
      'Configure your match. The server controls movement, bombs, explosions, power-ups, and victory.',
    bombsReady: 'BOMBS READY / PLAYER MODE',

    // Additional UI labels
    playerFallback: 'Player',
    cancelSearch: 'Cancel search',
    cancelSearchHint: 'You can cancel the search at any time.',
    confirmedPlayers: 'players confirmed',
    connectingEngine: 'Connecting to the game engine...',
    controlsLabel: 'Controls: WASD / arrows · SPACE to drop a bomb',
    creatingMatch: 'Creating match...',
    hostOnlyStartText: 'Only the host can start the private match.',
    mapHint: 'Choose a map',
    map1Hint: '13 × 11 · classic',
    map2Hint: '13 × 11 · open',
    map3Hint: '13 × 11 · maze',
    matchStartingIn: 'Match starting in',
    maxPlayers: 'max. 4',
    modeHint: 'Choose your challenge',
    modePracticeBadge: 'Great for testing',
    modePrivateBadge: 'Friends only',
    modePublicBadge: 'Open matchmaking',
    modePracticeShort: 'PRACTICE',
    modePrivateShort: 'PRIVATE',
    modePublicShort: 'PUBLIC',
    playersInGroup: 'player(s) in your group',
    preparingSearch: 'Preparing matchmaking...',
    readyLabel: 'READY TO PLAY',
    searchDoesNotExpire: 'the search does not expire',
    searchingMatch: 'SEARCHING FOR A MATCH',
    searchingPlayers: 'Searching for players...',
    settingsHint: 'Customize the match',
  },
  friends: {
    friendList: 'Friend List',
    addFriendPlaceholder: 'Add friend: enter the username',
    addFriendButton: 'Send',
    friendRequestSent: 'Request sent to',
    requestSendError: 'Error sending request',
    friendRequestsTitle: 'Friend Requests',
    friendRequestText: 'sent you a friend request.',
    inviteLobbyTitle: 'Invite friend to lobby',
    inviteLobbyPlaceholder: 'Username',
    inviteLobbyButton: 'Invite',
    lobbyFull: 'The lobby is full.',
    inviteOnlyFriends:
      'You can only invite friends with an accepted friendship.',
    noFriendsYet: 'You have no friends added yet.',
    deleteFriendTitle: 'Delete friend',
    deleteFriendConfirm: 'Are you sure you want to remove',
    deleteFriendConfirm2: 'from your friend list?',
    cancelButton: 'Cancel',
    rejectButton: 'Reject',
    removeButton: 'Remove',
    spectateTitle: 'Spectate game',
    inviteToLobby: 'Invite to lobby',
    youLabel: ' (You)',
    onlineStatus: 'Online',
    inGameStatus: 'In game',
    offlineStatus: 'Offline',
    sent: 'Sent',
    add: '+ Add',
    noResults: 'No results found.',

    // Info texts
    friendSearchError: 'Error searching users',
    networkError: 'Could not connect to the server.',
    friendRequestSentTo: 'Request sent to {username}',
    friendAlreadySent: 'Friend request already sent to {username}',
    friendNotFound: 'User {username} not found',
    friendSelfRequest: 'You cannot add yourself as a friend',
    friendBlocked: 'You cannot interact with this user',
    sendRequestError: 'Error sending request',
  },
  aboutUs: {
    title: 'About Us',
    teamBadge: '42 Madrid Team',
    subtitle:
      'Four 42 Madrid developers building a real-time multiplayer arcade experience driven by modern software architecture.',
    contributionsLabel: 'Assigned Work & Highlights',
    githubProfileAria: '{name} on GitHub',
    linkedinProfileAria: '{name} on LinkedIn',
    bombermanAccountAria: '{name} Bomberman account',
    school42ProfileAria: '{name} 42 School profile',
    roles: {
      frontendLead: 'Project Manager QA & Frontend Lead Developer',
      frontendArchitect: 'Product Owner & Frontend Architect/Designer',
      backendLead: 'Backend Lead Developer & Real-time/Game Engine',
      devopsLead: 'Technical Architect & DevOps Engineer',
    },
    contributions: {
      member1:
        'Frontend implementation, client-side routing and page development, i18n multi-language engine, User/friendship management interface and Chat',
      member2:
        'Frontend architecture, illustration creation, page development, i18n multi-language engine and game frontend design.',
      member3:
        'User authentication + JWT and Google, WebSocket implementation, chat functionality, live matchmaking and game engine',
      member4:
        'Docker Compose deployment orchestration, Nginx reverse proxy, prisma ORM with seed, user authentification, friend relationship management, and avatar management.',
    },
  },
  aboutGame: {
    title: 'ft_bomberman',
    subtitle:
      'Inspired by Bomberman, the classic strategy and maze video game franchise originally created by Hudson Soft in 1983 and now owned by Konami. A 42 Madrid project.',
    mechanicsTitle: 'Core mechanics',
    mechanics: {
      bombPlacement: {
        label: 'Bomb placement',
        description:
          'the player moves through a maze and strategically places explosives to destroy walls and eliminate enemies.',
      },
      powerUps: {
        label: 'Power-ups',
        description:
          'breaking blocks yields upgrades such as greater explosion range, more simultaneous bombs, or increased movement speed.',
      },
      multiplayer: {
        label: 'Multiplayer',
        description:
          'it is known for its frenetic competitive modes, both in local and online matches for multiple players.',
      },
    },
  },

  game: {
    viewportLabel: 'Game viewport',
    sidebarLabel: 'Game sidebar',
  },

  hud: {
    health: 'Lives',
    bombs: 'Pots',
    blast: 'Steam',
    speed: 'Coffee',
    time: 'Time',
    rivals: 'Rivals',
    remaining: 'Left',
    alive: 'Up',
    down: 'Out',
  },

  topbar: {
    practiceMatch: 'Practice match',
    time: 'Time',
    overtime: 'Overtime',
    survivors: 'Survivors',
    map: 'Map',
    exitFullscreen: 'Exit fullscreen',
    enterFullscreen: 'Enter fullscreen',
    leave: 'Leave',
  },
  endScreen: {
    deadTitle: 'bye bye goodbye',
    victoryTitle: 'You win',
    defeatTitle: 'You lose',
    drawTitle: 'Draw',
    returnLobby: 'Back to lobby',
    keepWatching: 'Keep watching',
    restart: 'Restart',
  },
  joinFailure: {
    notFoundTitle: 'Match not found',
    notFoundSubtitle: 'This match does not exist or has already ended.',
    connectionLostTitle: 'Could not connect to the server',
    connectionLostSubtitle: 'The server did not respond in time.',
    retry: 'Retry',
  },
  sidebar: {
    inKitchen: 'In the kitchen',
    yourStats: 'Your stats',
    you: 'You',
    bombs: 'Bombs',
    blast: 'Blast',
    speed: 'Speed',
  },
  legend: {
    title: 'Information',
    wall: 'Indestructible wall',
    crate: 'Destructible wall',
    bomb: 'Bomb',
    powerUp: 'Power-up',
  },
} as const;
