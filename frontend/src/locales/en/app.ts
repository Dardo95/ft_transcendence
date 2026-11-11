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
    openSession: 'Session opened in another window',
    sessionReplaced:
      'This account has been logged in on another tab or device. This window has been disconnected.',
    reloadSession: 'Recover session',
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
    lobbyChat: 'Lobby Chat',
    userEnteredLobby: 'has entered the Lobby',
    userLeftLobby: 'has left the Lobby',
    sendMessagePlaceholder: 'Send a message to your lobby...',
    sendButton: 'Send',
    acceptButton: 'Accept',
    joinLobbyToChat: 'Enter a lobby to use the private chat with its members.',

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
    subtitle:
      'Four 42 Madrid developers building a real-time multiplayer arcade experience driven by modern software architecture.',
    contributionsLabel: 'Assigned Work & Highlights',
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
  aboutProject: {
    title: 'About the Project',
    subtitle:
      'Technical specification, system architecture and module breakdown evaluated according to the official guidelines (ft_trascendence v21.2).',
    officialNotice:
      'This project was created as part of the 42 curriculum by ozamora-, brivera, enogueir and raperez-.',
  },
  aboutGame: {
    title: 'Rules of the Game',
    subtitle:
      'Tactical guide on movement mechanics, bomb placement, block types and upgrade catalog.',
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
    survivors: 'Survivors',
    map: 'Map',
    exitFullscreen: 'Exit fullscreen',
    leave: 'Leave',
  },
  endScreen: {
    deadTitle: 'bye bye goodbye',
    victoryTitle: 'You win',
    defeatTitle: 'You lose',
    returnLobby: 'Back to lobby',
    keepWatching: 'Keep watching',
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
