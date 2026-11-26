/**
 * English application translations.
 * Category: Translation Resource
 */

export const appEn = {
  general: {
    title: 'ft_bomberman',
    battlefield: 'ENTER THE ARENA',
    subTitle:
      'Register or log in to join multiplayer matches, compete with other players, and connect with friends.',
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
    matchmakingPracticeText: 'Start Practice',
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
    errorLobbyOperationFailed:
      'The lobby action could not be completed. Please try again.',
    dismissNotification: 'Dismiss notification',
    retry: 'Retry',
    lobbyErrorUsernameRequired: 'Enter a username to send an invitation.',
    lobbyErrorUserNotFound: 'We could not find that player.',
    lobbyErrorNotFriends: 'You can only invite players on your friends list.',
    lobbyErrorOnlyHostCanInvite: 'Only the lobby host can invite players.',
    lobbyErrorCannotInviteSelf: 'You cannot invite yourself.',
    lobbyErrorInviteeInGroup: 'That player is already in another lobby.',
    lobbyErrorLobbyFull: 'This lobby is full.',
    lobbyErrorInvitationExists: 'You already invited that player.',
    lobbyErrorInvitationNotFound: 'That invitation is no longer available.',
    lobbyErrorLobbyGone:
      'This lobby no longer exists. We refreshed your lobby.',
    lobbyErrorNotInLobby: 'You are not in a lobby right now.',
    lobbyErrorAlreadyInLobby: 'You are already in a lobby.',
    lobbyErrorInvitationIdRequired: 'The invitation is missing its identifier.',
    lobbyErrorMessageLength:
      'Messages must contain between 1 and 500 characters.',
    lobbyErrorGeneric:
      'The lobby action could not be completed. Please try again.',

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
    matchmakingPrivatePlayers: 'A private match needs between 2 and 4 players.',
    matchmakingDifferentMap:
      'Your lobby is already searching on another map. Cancel that search before choosing a new one.',
    matchmakingNotInLobby:
      'You are no longer in a lobby. Rejoin a group and try again.',
    matchmakingHostOnly: 'Only the lobby host can start a private match.',
    matchmakingTimeout:
      'The match is taking too long to open. Please try again.',
    connectingToMatch: 'Connecting to match...',
    connectingToMatchHint: 'Hold on while the arena opens.',
    connectingMatchEyebrow: 'MATCH READY',
    activeMatchNotice:
      'You already have a match in progress. Return to it to keep playing.',
    returnToActiveMatch: 'Return to active match',
    activeMatchCheckFailed:
      'Could not check whether you have an active match. Refresh the lobby and try again.',
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
    retry: 'Retry',
    dismissNotification: 'Dismiss notification',
    loadingFriends: 'Loading friends...',
    loadingBlockedUsers: 'Loading blocked users...',
    noIncomingRequests: 'No pending requests.',
    errorFriendsLoad: 'Could not load your friends. Please try again.',
    errorFriendsPartialLoad:
      'Some friend data could not be loaded. Please try again.',
    errorFriendsBlockedLoad:
      'Could not load your blocked users. Please try again.',

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
    badge: 'Guide to play ft_bomberman',
    title: 'About the Game',
    subtitle:
      'Move through destructible mazes, place bombs, collect upgrades, and outlast your opponents in this online multiplayer arena.',
    controlsTitle: 'Controls',
    controlsSpace: 'SPACE',
    movementTitle: 'Movement',
    movementDescription:
      'Move using either key set. Diagonal movement is not available.',
    wasdLabel: 'WASD',
    arrowKeysLabel: 'Arrow keys',
    or: 'or',
    moveUp: 'Move up',
    moveDown: 'Move down',
    moveLeft: 'Move left',
    moveRight: 'Move right',
    actionTitle: 'Bomb',
    actionDescription: 'Press the Space bar to place a bomb.',
    placeBomb: 'Place bomb',
    objectiveTitle: 'Objective',
    objectiveDescription:
      'Stay alive and be the last player remaining. Bombs can eliminate you too, so plan an escape route before placing one.',
    mechanicsTitle: 'Core mechanics',
    mechanics: {
      bombPlacement: {
        label: 'Bomb placement',
        description:
          'Place bombs to break destructible blocks and catch rivals in their blast. Watch the fuse and move to safety before detonation.',
      },
      powerUps: {
        label: 'Power-ups',
        description:
          'Destroy blocks to find upgrades for blast range, the number of bombs you can place at once, and movement speed.',
      },
      multiplayer: {
        label: 'Multiplayer',
        description:
          'Compete online with friends or other players. Choose a solo practice match, a private lobby match, or open matchmaking.',
      },
    },
    matchModesTitle: 'Choose a game mode',
    modes: {
      practice: {
        label: 'Practice',
        description:
          'Play solo against a bot to learn the controls and test your strategy.',
      },
      private: {
        label: 'Private match',
        description:
          'Play with 2–4 players from your current lobby in a private match.',
      },
      public: {
        label: 'Public matchmaking',
        description:
          'Join the open queue. A match starts when at least 2 players are ready and supports up to 4 players.',
      },
    },
    demoTitle: 'Try the arena',
    demoDescription:
      'Use the interactive preview to try moving, placing bombs, and escaping explosions.',
  },
  notFound: {
    badge: 'ERROR 404',
    title: 'Page Not Found',
    subtitle:
      'The page you are looking for does not exist, has been moved, or the URL is incorrect.',
    requestedPath: 'Requested path',
    backLobby: 'Back to Lobby',
    backHome: 'Go to Login',
    goBack: 'Go Back',
    quickLinks: 'Quick Navigation',
    quickLinksHint:
      'Explore the game rules, the project breakdown, or meet the team.',
  },

  game: {
    viewportLabel: 'Game viewport',
    sidebarLabel: 'Game sidebar',
  },

  hud: {
    health: 'Lives',
    bombs: 'Bombs',
    blast: 'Blast',
    speed: 'Speed',
    time: 'Time',
    rivals: 'Rivals',
    remaining: 'Left',
    alive: 'Up',
    down: 'Out',
    finalSeconds: 'Last 20 seconds!',
    suddenDeath: 'Sudden death!',
    suddenDeathSub: 'Walls are closing in',
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
    deadTitle: 'You are dead',
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
    players: 'Players',
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
