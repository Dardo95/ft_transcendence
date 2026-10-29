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
    searchInfoText:
      'Waiting for public players (auto start at 4 players or timeout if >=2 players).',
    needPrivateText:
      'At least 2 players are needed in the room to start a private match.',
    needPublicText: 'At least 2 players are needed to start a public match.',
    practiceInfoText:
      'You can start practice anytime since it is a 1v1 game against a bot.',
  },
  friends: {
    friendList: 'Friend List',
    addFriendPlaceholder: 'Add friend: Enter exact username',
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
  },
  aboutUs: {
    title: 'About Us',
    subtitle:
      'Four developers from 42 Madrid creating a real-time multiplayer arcade experience driven by modern software architecture.',
    manifesto:
      'In ft_bomberman we tackle the Common Core challenges by combining system engineering, network concurrency and graphics performance. Our goal is to offer a minimally lagging, desync-resistant competitive environment built under strict security and scalability standards.',
  },
  aboutProject: {
    title: 'About the Project',
    subtitle:
      'Technical specification, system architecture and module breakdown evaluated according to official regulation (ft_trascendence v21.2).',
    officialNotice:
      'This project has been created as part of the 42 curriculum by ozamora-, brivera, enogueir, and raperez-.',
  },
  aboutGame: {
    title: 'Game Manual — Combat Rules',
    subtitle:
      'Tactical guide on movement mechanics, bomb placement, block types and power-up catalog.',
  },
} as const;
