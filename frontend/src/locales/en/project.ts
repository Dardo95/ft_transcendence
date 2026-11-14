/**
 * English project page translations.
 * Category: Translation Resource
 *
 * Contains user-facing strings related to:
 * - Claimed module breakdown and points.
 * - Module requirements.
 *
 * Translation resources must not contain application logic.
 */

export const projectEn = {
  title: 'About the Project',
  subtitle:
    'Technical specification, system architecture, and module breakdown evaluated under the official 42 guidelines (v21.2).',
  summaryMandatory: 'Mandatory',
  summaryBonus: 'Bonus',
  mandatoryHeading: 'Mandatory Core Modules',
  bonusHeading: 'Bonus Modules (Max 5 pts)',
  extraHeading: 'Extra Modules',
  extraDesc:
    'Additional modules or features that are not part of the mandatory or bonus criteria but may enhance the project.',
  pointsLabel: 'Points Claimed',
  pts: 'pts',
  minPoints: 'Min 14 pts',
  maxPoints: 'Max 5 pts',
  colModule: 'Module',
  colCategory: 'Category',
  colType: 'Type',
  colPoints: 'Points',
  categories: {
    web: 'Web',
    userMgmt: 'User Management',
    gaming: 'Gaming and user experience',
    a11y: 'Accessibility and Internationalization',
  },
  types: {
    major: 'Major (2 pts)',
    minor: 'Minor (1 pt)',
  },
  modules: {
    frameworks: {
      title: 'Use a framework for both the frontend and backend',
      requirements: [
        'Frontend framework (React, Vue, Angular, Svelte, etc.).',
        'Backend framework (Express, NestJS, Django, Flask, Ruby on Rails, etc.).',
        'Full-stack frameworks (Next.js, Nuxt.js, SvelteKit) count as both if you use both their frontend and backend capabilities.',
      ],
    },
    websockets: {
      title:
        'Implement real-time features using WebSockets or similar technology',
      requirements: [
        'Real-time updates across clients.',
        'Handle connection/disconnection gracefully.',
        'Efficient message broadcasting.',
      ],
    },
    interaction: {
      title: 'Allow users to interact with other users',
      requirements: [
        'A basic chat system (send/receive messages between users).',
        'A profile system (view user information).',
        'A friends system (add/remove friends, see friends list).',
      ],
    },
    userMgmt: {
      title: 'Standard user management and authentication',
      requirements: [
        'Users can update their profile information.',
        'Users can upload an avatar (with a default avatar if none provided).',
        'Users can add other users as friends and see their online status.',
        'Users have a profile page displaying their information.',
      ],
    },
    game: {
      title:
        'Implement a complete web-based game where users can play against each other',
      requirements: [
        'The game can be real-time multiplayer (e.g., Pong, Chess, Tic-Tac-Toe, Card games, etc.).',
        'Players must be able to play live matches.',
        'The game must have clear rules and win/loss conditions.',
        'The game can be 2D or 3D.',
      ],
    },
    remote: {
      title:
        'Remote players — Enable two players on separate computers to play the same game in real-time',
      requirements: [
        'Handle network latency and disconnections gracefully.',
        'Provide a smooth user experience for remote gameplay.',
        'Implement reconnection logic.',
      ],
    },
    multiplayer: {
      title: 'Multiplayer game (more than two players)',
      requirements: [
        'Support for three or more players simultaneously.',
        'Fair gameplay mechanics for all participants.',
        'Proper synchronization across all clients.',
      ],
    },
    orm: {
      title: 'Use an ORM for the database',
      requirements: [
        'An ORM (Object-Relational Mapping) is a programming technique that lets you interact with a relational database using object-oriented code instead of writing raw SQL.',
      ],
    },
    i18n: {
      title: 'Support for multiple languages (at least 3 languages)',
      requirements: [
        'Implement i18n (internationalization) system.',
        'At least 3 complete language translations.',
        'Language switcher in the UI.',
        'All user-facing text must be translatable.',
      ],
    },
    customization: {
      title: 'Game customization options',
      requirements: [
        'Power-ups, attacks, or special abilities.',
        'Different maps or themes.',
        'Customizable game settings.',
        'Default options must be available.',
      ],
    },
    stats: {
      title: 'Game statistics and match history',
      requirements: [
        'Track user game statistics (wins, losses, ranking, level, etc.).',
        'Display match history (1v1 games, dates, results, opponents).',
        'Show achievements and progression.',
        'Leaderboard integration.',
      ],
    },
    spectator: {
      title: 'Implement spectator mode for games',
      requirements: [
        'Allow users to watch ongoing games.',
        'Real-time updates for spectators.',
        'Optional: spectator chat.',
      ],
    },
    oauth: {
      title:
        'Implement remote authentication with OAuth 2.0 (Google, GitHub, 42, etc.)',
      requirements: [],
    },
  },
} as const;
